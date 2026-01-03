-- Update existing subscription plans with new USD pricing
UPDATE public.subscription_plans SET is_active = false WHERE id IS NOT NULL;

-- Insert new subscription plans with USD pricing
INSERT INTO public.subscription_plans (
  name, monthly_price, email_limit_per_month, subscriber_limit, 
  landing_page_limit, automation_limit, is_default, display_order,
  custom_domain, advanced_analytics, advanced_automation, api_access, remove_branding
) VALUES 
  -- Free Trial Plan (3 days, 50 emails/day)
  ('تجريبي', 0, 150, 100, 1, 0, true, 1, false, false, false, false, false),
  -- Pro Plan ($15/month)
  ('احترافي', 15, 5000, 1000, 5, 3, false, 2, false, true, true, false, true),
  -- Enterprise Plan ($70/month)
  ('الشركات', 70, 50000, 10000, 20, 10, false, 3, true, true, true, true, true);

-- Create encryption functions for API keys
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create function to encrypt API key
CREATE OR REPLACE FUNCTION public.encrypt_api_key(plain_text text, secret_key text DEFAULT 'lovable_secret_key_2024')
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN encode(
    pgp_sym_encrypt(plain_text, secret_key),
    'base64'
  );
END;
$$;

-- Create function to decrypt API key
CREATE OR REPLACE FUNCTION public.decrypt_api_key(encrypted_text text, secret_key text DEFAULT 'lovable_secret_key_2024')
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN pgp_sym_decrypt(
    decode(encrypted_text, 'base64'),
    secret_key
  );
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$;

-- Add trial_expires_at column to user_subscriptions for trial tracking
ALTER TABLE public.user_subscriptions 
ADD COLUMN IF NOT EXISTS trial_expires_at timestamp with time zone;