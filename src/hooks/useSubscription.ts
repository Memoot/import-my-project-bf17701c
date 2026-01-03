import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

// Default plans for demo
const defaultPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "المجانية",
    monthly_price: 0,
    email_limit_per_month: 1000,
    subscriber_limit: 500,
    automation_limit: 1,
    landing_page_limit: 2,
    user_limit: 1,
    advanced_automation: false,
    advanced_analytics: false,
    custom_domain: false,
    remove_branding: false,
    api_access: false,
    is_active: true,
    is_default: true,
    display_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "pro",
    name: "احترافية",
    monthly_price: 29,
    email_limit_per_month: 10000,
    subscriber_limit: 5000,
    automation_limit: 10,
    landing_page_limit: 20,
    user_limit: 3,
    advanced_automation: true,
    advanced_analytics: true,
    custom_domain: true,
    remove_branding: true,
    api_access: true,
    is_active: true,
    is_default: false,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const PLANS_KEY = 'subscription_plans';
const SUBS_KEY = 'user_subscriptions';

const getPlansFromStorage = (): SubscriptionPlan[] => {
  try {
    const data = localStorage.getItem(PLANS_KEY);
    return data ? JSON.parse(data) : defaultPlans;
  } catch { return defaultPlans; }
};

const savePlansToStorage = (plans: SubscriptionPlan[]) => {
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
};

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => getPlansFromStorage(),
  });
}

export function useUserSubscription() {
  return useQuery({
    queryKey: ["user-subscription"],
    queryFn: async () => {
      // Return default free plan for demo
      return {
        id: "demo",
        user_id: "demo",
        plan_id: "free",
        status: "active",
        started_at: new Date().toISOString(),
        expires_at: null,
        billing_cycle_start: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        plan: defaultPlans[0],
      } as UserSubscription & { plan: SubscriptionPlan };
    },
  });
}

export function useUserUsage() {
  return useQuery({
    queryKey: ["user-usage"],
    queryFn: async () => ({
      id: "demo",
      user_id: "demo",
      billing_period_start: new Date().toISOString().slice(0, 7) + "-01",
      emails_sent: 0,
      subscribers_count: 0,
      automations_count: 0,
      landing_pages_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as UsageTracking),
  });
}

export function useCheckUsageLimit(action: string) {
  return useQuery({
    queryKey: ["usage-limit", action],
    queryFn: async () => ({ allowed: true, unlimited: true } as UsageLimitCheck),
    staleTime: 30000,
  });
}

export function useManagePlans() {
  const queryClient = useQueryClient();

  const createPlan = useMutation({
    mutationFn: async (plan: Omit<Partial<SubscriptionPlan>, 'id' | 'created_at' | 'updated_at'>) => {
      const plans = getPlansFromStorage();
      const newPlan: SubscriptionPlan = {
        ...defaultPlans[0],
        ...plan,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as SubscriptionPlan;
      plans.push(newPlan);
      savePlansToStorage(plans);
      return newPlan;
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
      const plans = getPlansFromStorage();
      const index = plans.findIndex(p => p.id === id);
      if (index !== -1) {
        plans[index] = { ...plans[index], ...plan, updated_at: new Date().toISOString() };
        savePlansToStorage(plans);
        return plans[index];
      }
      throw new Error("Plan not found");
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
      const plans = getPlansFromStorage().filter(p => p.id !== id);
      savePlansToStorage(plans);
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

export function useManageSubscriptions() {
  const queryClient = useQueryClient();

  const assignPlan = useMutation({
    mutationFn: async ({ userId, planId }: { userId: string; planId: string }) => {
      // Mock implementation
      return { user_id: userId, plan_id: planId };
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

export function useAllSubscriptions() {
  return useQuery({
    queryKey: ["all-subscriptions"],
    queryFn: async () => [] as (UserSubscription & { plan: SubscriptionPlan })[],
  });
}

export function useIncrementUsage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ field, amount = 1 }: { field: string; amount?: number }) => {
      console.log("Incrementing usage:", field, amount);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-usage"] });
      queryClient.invalidateQueries({ queryKey: ["usage-limit"] });
    },
  });
}
