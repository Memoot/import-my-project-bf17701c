import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SubscriptionPlan {
  id: string;
  name: string;
  monthly_price: number;
  email_limit_per_month: number;
  subscriber_limit: number | null;
  automation_limit: number | null;
  landing_page_limit: number | null;
  user_limit: number;
  advanced_automation: boolean;
  advanced_analytics: boolean;
  custom_domain: boolean;
  remove_branding: boolean;
  api_access: boolean;
  is_active: boolean;
  is_default: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  started_at: string;
  expires_at: string | null;
  billing_cycle_start: string;
  created_at: string;
  updated_at: string;
  plan?: SubscriptionPlan;
}

export interface UsageTracking {
  id: string;
  user_id: string;
  billing_period_start: string;
  emails_sent: number;
  subscribers_count: number;
  automations_count: number;
  landing_pages_count: number;
  created_at: string;
  updated_at: string;
}

export interface UsageLimitCheck {
  allowed: boolean;
  unlimited?: boolean;
  warning?: boolean;
  reason?: string;
  current?: number;
  limit?: number;
  percent?: number;
  message?: string;
}

// Hook to get all plans
export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .order("display_order");
      
      if (error) throw error;
      return data as SubscriptionPlan[];
    },
  });
}

// Hook to get current user's subscription
export function useUserSubscription() {
  return useQuery({
    queryKey: ["user-subscription"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("user_subscriptions")
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();
      
      if (error) throw error;
      return data as (UserSubscription & { plan: SubscriptionPlan }) | null;
    },
  });
}

// Hook to get current user's usage
export function useUserUsage() {
  return useQuery({
    queryKey: ["user-usage"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const currentPeriod = new Date().toISOString().slice(0, 7) + "-01";
      
      const { data, error } = await supabase
        .from("usage_tracking")
        .select("*")
        .eq("user_id", user.id)
        .eq("billing_period_start", currentPeriod)
        .maybeSingle();
      
      if (error) throw error;
      return data as UsageTracking | null;
    },
  });
}

// Hook to check usage limit (calls database function)
export function useCheckUsageLimit(action: string) {
  return useQuery({
    queryKey: ["usage-limit", action],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { allowed: false, reason: "not_authenticated" } as UsageLimitCheck;

      const { data, error } = await supabase.rpc("check_usage_limit", {
        p_user_id: user.id,
        p_action: action,
      });
      
      if (error) throw error;
      return data as unknown as UsageLimitCheck;
    },
    staleTime: 30000, // 30 seconds
  });
}

// Admin hook to manage plans
export function useManagePlans() {
  const queryClient = useQueryClient();

  const createPlan = useMutation({
    mutationFn: async (plan: Omit<Partial<SubscriptionPlan>, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .insert(plan as any)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
      toast.success("تم إنشاء الخطة بنجاح");
    },
    onError: (error) => {
      toast.error("فشل في إنشاء الخطة: " + error.message);
    },
  });

  const updatePlan = useMutation({
    mutationFn: async ({ id, ...plan }: Partial<SubscriptionPlan> & { id: string }) => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .update(plan)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
      toast.success("تم تحديث الخطة بنجاح");
    },
    onError: (error) => {
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
    onError: (error) => {
      toast.error("فشل في حذف الخطة: " + error.message);
    },
  });

  return { createPlan, updatePlan, deletePlan };
}

// Admin hook to manage user subscriptions
export function useManageSubscriptions() {
  const queryClient = useQueryClient();

  const assignPlan = useMutation({
    mutationFn: async ({ userId, planId }: { userId: string; planId: string }) => {
      // First check if user already has a subscription
      const { data: existing } = await supabase
        .from("user_subscriptions")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (existing) {
        // Update existing subscription
        const { data, error } = await supabase
          .from("user_subscriptions")
          .update({
            plan_id: planId,
            status: "active",
            started_at: new Date().toISOString(),
            billing_cycle_start: new Date().toISOString(),
          })
          .eq("user_id", userId)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Create new subscription
        const { data, error } = await supabase
          .from("user_subscriptions")
          .insert({
            user_id: userId,
            plan_id: planId,
            status: "active",
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-subscriptions"] });
      toast.success("تم تعيين الخطة للمستخدم بنجاح");
    },
    onError: (error) => {
      toast.error("فشل في تعيين الخطة: " + error.message);
    },
  });

  return { assignPlan };
}

// Get all subscriptions (admin)
export function useAllSubscriptions() {
  return useQuery({
    queryKey: ["all-subscriptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as (UserSubscription & { plan: SubscriptionPlan })[];
    },
  });
}

// Hook to increment usage
export function useIncrementUsage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ field, amount = 1 }: { field: string; amount?: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.rpc("increment_usage", {
        p_user_id: user.id,
        p_field: field,
        p_amount: amount,
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-usage"] });
      queryClient.invalidateQueries({ queryKey: ["usage-limit"] });
    },
  });
}
