import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  monthly_price: number; // Alias for price
  currency: string;
  billing_period: 'monthly' | 'yearly' | 'lifetime';
  features: string[];
  limits: Record<string, number>;
  is_active: boolean;
  is_default: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  // Compatibility fields
  email_limit_per_month: number | null;
  subscriber_limit: number | null;
  automation_limit: number | null;
  landing_page_limit: number | null;
  user_limit: number;
  advanced_automation: boolean;
  advanced_analytics: boolean;
  custom_domain: boolean;
  remove_branding: boolean;
  api_access: boolean;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string | null;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  current_period_start: string;
  started_at: string; // Alias
  billing_cycle_start: string; // Alias
  current_period_end: string | null;
  cancelled_at: string | null;
  usage: Record<string, number>;
  created_at: string;
  updated_at: string;
  plan?: SubscriptionPlan;
}

export interface UsageLimitCheck {
  allowed: boolean;
  unlimited?: boolean;
  warning?: boolean;
  reason?: string;
  current?: number;
  limit?: number;
  message?: string;
}

const transformPlan = (data: any): SubscriptionPlan => {
  const limits = typeof data.limits === 'object' && data.limits !== null ? data.limits : {};
  return {
    ...data,
    monthly_price: data.price,
    is_default: data.display_order === 1,
    features: Array.isArray(data.features) ? data.features : [],
    limits,
    email_limit_per_month: limits.emails_per_month || null,
    subscriber_limit: limits.subscribers || null,
    automation_limit: limits.automations || null,
    landing_page_limit: limits.landing_pages || null,
    user_limit: limits.users || 1,
    advanced_automation: !!limits.advanced_automation,
    advanced_analytics: !!limits.advanced_analytics,
    custom_domain: !!limits.custom_domain,
    remove_branding: !!limits.remove_branding,
    api_access: !!limits.api_access,
  };
};

const transformSubscription = (data: any): UserSubscription => ({
  ...data,
  started_at: data.current_period_start,
  billing_cycle_start: data.current_period_start,
  plan: data.plan ? transformPlan(data.plan) : undefined,
});

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return (data || []).map(transformPlan) as SubscriptionPlan[];
    },
  });
}

export function useUserSubscription() {
  return useQuery({
    queryKey: ["user-subscription"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*, plan:subscription_plans(*)")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) {
        // Get free plan
        const { data: freePlan } = await supabase
          .from("subscription_plans")
          .select("*")
          .eq("price", 0)
          .maybeSingle();

        return transformSubscription({
          id: 'new',
          user_id: user.id,
          plan_id: freePlan?.id || null,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: null,
          cancelled_at: null,
          usage: { subscribers_count: 0, campaigns_count: 0, landing_pages_count: 0, emails_sent: 0, automations_count: 0 },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          plan: freePlan,
        });
      }

      return transformSubscription(data);
    },
  });
}

export function useUserUsage() {
  const { data: subscription } = useUserSubscription();
  
  return useQuery({
    queryKey: ["user-usage"],
    queryFn: async () => {
      return subscription?.usage || {
        subscribers_count: 0,
        campaigns_count: 0,
        landing_pages_count: 0,
        emails_sent: 0,
        automations_count: 0,
      };
    },
    enabled: !!subscription,
  });
}

export function useCheckUsageLimit(action: string) {
  const { data: subscription } = useUserSubscription();
  
  return useQuery({
    queryKey: ["usage-limit", action],
    queryFn: async (): Promise<UsageLimitCheck> => {
      if (!subscription?.plan?.limits) {
        return { allowed: true, unlimited: true };
      }

      const limits = subscription.plan.limits as Record<string, number>;
      const usage = subscription.usage as Record<string, number>;

      const limit = limits[action];
      const current = usage[action] || 0;

      if (limit === -1 || limit === undefined) {
        return { allowed: true, unlimited: true };
      }

      const allowed = current < limit;
      const warning = current >= limit * 0.8;

      return {
        allowed,
        warning,
        current,
        limit,
        message: allowed 
          ? (warning ? `اقتربت من الحد الأقصى (${current}/${limit})` : undefined)
          : `تم الوصول للحد الأقصى (${limit})`,
      };
    },
    enabled: !!subscription,
    staleTime: 30000,
  });
}

export function useManagePlans() {
  const queryClient = useQueryClient();

  const createPlan = useMutation({
    mutationFn: async (plan: Partial<SubscriptionPlan>) => {
      const insertData: any = {
        name: plan.name,
        description: plan.description,
        price: plan.price || plan.monthly_price || 0,
        currency: plan.currency || 'USD',
        billing_period: plan.billing_period || 'monthly',
        features: plan.features || [],
        limits: plan.limits || {
          emails_per_month: plan.email_limit_per_month,
          subscribers: plan.subscriber_limit,
          automations: plan.automation_limit,
          landing_pages: plan.landing_page_limit,
          users: plan.user_limit,
          advanced_automation: plan.advanced_automation,
          advanced_analytics: plan.advanced_analytics,
          custom_domain: plan.custom_domain,
          remove_branding: plan.remove_branding,
          api_access: plan.api_access,
        },
        is_active: plan.is_active ?? true,
        display_order: plan.display_order || 0,
      };

      const { data, error } = await supabase
        .from("subscription_plans")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return transformPlan(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
      toast.success("تم إنشاء الخطة بنجاح");
    },
    onError: (error: any) => {
      toast.error("فشل في إنشاء الخطة: " + error.message);
    },
  });

  const updatePlan = useMutation({
    mutationFn: async ({ id, ...plan }: Partial<SubscriptionPlan> & { id: string }) => {
      const updateData: any = {};
      
      if (plan.name !== undefined) updateData.name = plan.name;
      if (plan.description !== undefined) updateData.description = plan.description;
      if (plan.price !== undefined || plan.monthly_price !== undefined) {
        updateData.price = plan.price || plan.monthly_price;
      }
      if (plan.features !== undefined) updateData.features = plan.features;
      if (plan.is_active !== undefined) updateData.is_active = plan.is_active;
      if (plan.display_order !== undefined) updateData.display_order = plan.display_order;
      
      // Build limits object
      if (plan.email_limit_per_month !== undefined || plan.subscriber_limit !== undefined || 
          plan.automation_limit !== undefined || plan.landing_page_limit !== undefined ||
          plan.limits !== undefined) {
        updateData.limits = plan.limits || {
          emails_per_month: plan.email_limit_per_month,
          subscribers: plan.subscriber_limit,
          automations: plan.automation_limit,
          landing_pages: plan.landing_page_limit,
          users: plan.user_limit,
          advanced_automation: plan.advanced_automation,
          advanced_analytics: plan.advanced_analytics,
          custom_domain: plan.custom_domain,
          remove_branding: plan.remove_branding,
          api_access: plan.api_access,
        };
      }

      const { error } = await supabase
        .from("subscription_plans")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
      toast.success("تم تحديث الخطة بنجاح");
    },
    onError: (error: any) => {
      toast.error("فشل في تحديث الخطة: " + error.message);
    },
  });

  const deletePlan = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("subscription_plans")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
      toast.success("تم حذف الخطة بنجاح");
    },
    onError: (error: any) => {
      toast.error("فشل في حذف الخطة: " + error.message);
    },
  });

  return { createPlan, updatePlan, deletePlan };
}

export function useManageSubscriptions() {
  const queryClient = useQueryClient();

  const assignPlan = useMutation({
    mutationFn: async ({ userId, planId }: { userId: string; planId: string }) => {
      // Check if subscription exists
      const { data: existing } = await supabase
        .from("user_subscriptions")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("user_subscriptions")
          .update({ plan_id: planId, status: 'active' })
          .eq("user_id", userId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_subscriptions")
          .insert({
            user_id: userId,
            plan_id: planId,
            status: 'active',
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
      toast.success("تم تعيين الخطة للمستخدم بنجاح");
    },
    onError: (error: any) => {
      toast.error("فشل في تعيين الخطة: " + error.message);
    },
  });

  return { assignPlan };
}

export function useAllSubscriptions() {
  return useQuery({
    queryKey: ["all-subscriptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*, plan:subscription_plans(*)");

      if (error) throw error;
      return (data || []).map(transformSubscription) as UserSubscription[];
    },
  });
}

export function useIncrementUsage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ field, amount = 1 }: { field: string; amount?: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("غير مصرح");

      // Get current subscription
      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("id, usage")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!sub) return;

      const currentUsage = (sub.usage as Record<string, number>) || {};
      currentUsage[field] = (currentUsage[field] || 0) + amount;

      const { error } = await supabase
        .from("user_subscriptions")
        .update({ usage: currentUsage })
        .eq("id", sub.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-usage"] });
      queryClient.invalidateQueries({ queryKey: ["usage-limit"] });
      queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
    },
  });
}
