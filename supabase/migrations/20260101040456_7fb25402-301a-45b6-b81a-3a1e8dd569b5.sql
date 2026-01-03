-- Create subscription plans table (admin managed)
CREATE TABLE public.subscription_plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    monthly_price numeric NOT NULL DEFAULT 0,
    email_limit_per_month integer NOT NULL DEFAULT 1000,
    subscriber_limit integer, -- NULL means unlimited
    automation_limit integer, -- NULL means unlimited
    landing_page_limit integer, -- NULL means unlimited
    user_limit integer NOT NULL DEFAULT 1,
    -- Feature toggles
    advanced_automation boolean NOT NULL DEFAULT false,
    advanced_analytics boolean NOT NULL DEFAULT false,
    custom_domain boolean NOT NULL DEFAULT false,
    remove_branding boolean NOT NULL DEFAULT false,
    api_access boolean NOT NULL DEFAULT false,
    -- Metadata
    is_active boolean NOT NULL DEFAULT true,
    is_default boolean NOT NULL DEFAULT false,
    display_order integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL UNIQUE,
    plan_id uuid NOT NULL REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'suspended')),
    started_at timestamp with time zone NOT NULL DEFAULT now(),
    expires_at timestamp with time zone,
    billing_cycle_start timestamp with time zone NOT NULL DEFAULT date_trunc('month', now()),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create usage tracking table
CREATE TABLE public.usage_tracking (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    billing_period_start date NOT NULL DEFAULT date_trunc('month', now())::date,
    emails_sent integer NOT NULL DEFAULT 0,
    subscribers_count integer NOT NULL DEFAULT 0,
    automations_count integer NOT NULL DEFAULT 0,
    landing_pages_count integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(user_id, billing_period_start)
);

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- Plans policies (public read for active, admin manage)
CREATE POLICY "Anyone can view active plans"
ON public.subscription_plans FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage plans"
ON public.subscription_plans FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Subscriptions policies
CREATE POLICY "Users can view their own subscription"
ON public.user_subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions"
ON public.user_subscriptions FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage subscriptions"
ON public.user_subscriptions FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Usage tracking policies
CREATE POLICY "Users can view their own usage"
ON public.usage_tracking FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage"
ON public.usage_tracking FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "System can insert usage records"
ON public.usage_tracking FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all usage"
ON public.usage_tracking FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all usage"
ON public.usage_tracking FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create function to get or create current usage record
CREATE OR REPLACE FUNCTION public.get_or_create_current_usage(p_user_id uuid)
RETURNS public.usage_tracking
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_period date := date_trunc('month', now())::date;
    usage_record public.usage_tracking;
BEGIN
    SELECT * INTO usage_record
    FROM public.usage_tracking
    WHERE user_id = p_user_id AND billing_period_start = current_period;
    
    IF NOT FOUND THEN
        INSERT INTO public.usage_tracking (user_id, billing_period_start)
        VALUES (p_user_id, current_period)
        RETURNING * INTO usage_record;
    END IF;
    
    RETURN usage_record;
END;
$$;

-- Create function to increment usage
CREATE OR REPLACE FUNCTION public.increment_usage(
    p_user_id uuid,
    p_field text,
    p_amount integer DEFAULT 1
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_period date := date_trunc('month', now())::date;
BEGIN
    PERFORM public.get_or_create_current_usage(p_user_id);
    
    EXECUTE format(
        'UPDATE public.usage_tracking SET %I = %I + $1, updated_at = now() WHERE user_id = $2 AND billing_period_start = $3',
        p_field, p_field
    ) USING p_amount, p_user_id, current_period;
    
    RETURN true;
END;
$$;

-- Create function to check if user can perform action
CREATE OR REPLACE FUNCTION public.check_usage_limit(
    p_user_id uuid,
    p_action text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_plan public.subscription_plans;
    user_usage public.usage_tracking;
    plan_limit integer;
    current_usage integer;
    usage_percent numeric;
BEGIN
    SELECT sp.* INTO user_plan
    FROM public.user_subscriptions us
    JOIN public.subscription_plans sp ON sp.id = us.plan_id
    WHERE us.user_id = p_user_id AND us.status = 'active';
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'reason', 'no_subscription',
            'message', 'لا يوجد اشتراك نشط'
        );
    END IF;
    
    SELECT * INTO user_usage FROM public.get_or_create_current_usage(p_user_id);
    
    CASE p_action
        WHEN 'send_email' THEN
            plan_limit := user_plan.email_limit_per_month;
            current_usage := user_usage.emails_sent;
        WHEN 'add_subscriber' THEN
            plan_limit := user_plan.subscriber_limit;
            current_usage := user_usage.subscribers_count;
        WHEN 'create_automation' THEN
            plan_limit := user_plan.automation_limit;
            current_usage := user_usage.automations_count;
        WHEN 'create_landing_page' THEN
            plan_limit := user_plan.landing_page_limit;
            current_usage := user_usage.landing_pages_count;
        ELSE
            RETURN jsonb_build_object('allowed', true);
    END CASE;
    
    IF plan_limit IS NULL THEN
        RETURN jsonb_build_object(
            'allowed', true,
            'unlimited', true
        );
    END IF;
    
    usage_percent := (current_usage::numeric / NULLIF(plan_limit::numeric, 0)) * 100;
    
    IF current_usage >= plan_limit THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'reason', 'limit_exceeded',
            'current', current_usage,
            'limit', plan_limit,
            'percent', 100,
            'message', 'تم الوصول للحد الأقصى'
        );
    END IF;
    
    IF usage_percent >= 80 THEN
        RETURN jsonb_build_object(
            'allowed', true,
            'warning', true,
            'current', current_usage,
            'limit', plan_limit,
            'percent', round(usage_percent),
            'message', 'اقتربت من الحد الأقصى'
        );
    END IF;
    
    RETURN jsonb_build_object(
        'allowed', true,
        'current', current_usage,
        'limit', plan_limit,
        'percent', round(usage_percent)
    );
END;
$$;

-- Insert default plans
INSERT INTO public.subscription_plans (name, monthly_price, email_limit_per_month, subscriber_limit, automation_limit, landing_page_limit, user_limit, advanced_automation, advanced_analytics, custom_domain, remove_branding, api_access, is_default, display_order)
VALUES 
    ('مجاني', 0, 500, 100, 1, 1, 1, false, false, false, false, false, true, 1),
    ('أساسي', 29, 5000, 1000, 5, 3, 2, false, true, false, false, false, false, 2),
    ('احترافي', 79, 25000, 5000, 20, 10, 5, true, true, true, true, false, false, 3),
    ('متقدم', 199, 100000, NULL, NULL, NULL, 20, true, true, true, true, true, false, 4);

-- Create triggers
CREATE TRIGGER update_subscription_plans_updated_at
    BEFORE UPDATE ON public.subscription_plans
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
    BEFORE UPDATE ON public.user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_usage_tracking_updated_at
    BEFORE UPDATE ON public.usage_tracking
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();