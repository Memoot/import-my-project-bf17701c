import { useState, useCallback } from "react";
import { useCheckUsageLimit, useIncrementUsage, UsageLimitCheck } from "./useSubscription";

interface UseUsageLimitsReturn {
  checkLimit: (action: string) => Promise<UsageLimitCheck>;
  incrementUsage: (field: string, amount?: number) => Promise<void>;
  showWarning: boolean;
  showBlocked: boolean;
  limitCheck: UsageLimitCheck | null;
  clearWarning: () => void;
}

export function useUsageLimits(): UseUsageLimitsReturn {
  const [showWarning, setShowWarning] = useState(false);
  const [showBlocked, setShowBlocked] = useState(false);
  const [limitCheck, setLimitCheck] = useState<UsageLimitCheck | null>(null);
  const incrementUsageMutation = useIncrementUsage();

  const checkLimit = useCallback(async (action: string): Promise<UsageLimitCheck> => {
    // Import supabase dynamically to avoid circular deps
    const { supabase } = await import("@/integrations/supabase/client");
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { allowed: false, reason: "not_authenticated" };
    }

    const { data, error } = await supabase.rpc("check_usage_limit", {
      p_user_id: user.id,
      p_action: action,
    });

    if (error) {
      console.error("Error checking usage limit:", error);
      return { allowed: true }; // Allow on error to not block users
    }

    const result = data as unknown as UsageLimitCheck;
    setLimitCheck(result);

    if (!result.allowed) {
      setShowBlocked(true);
    } else if (result.warning) {
      setShowWarning(true);
    }

    return result;
  }, []);

  const incrementUsage = useCallback(async (field: string, amount = 1) => {
    await incrementUsageMutation.mutateAsync({ field, amount });
  }, [incrementUsageMutation]);

  const clearWarning = useCallback(() => {
    setShowWarning(false);
    setShowBlocked(false);
    setLimitCheck(null);
  }, []);

  return {
    checkLimit,
    incrementUsage,
    showWarning,
    showBlocked,
    limitCheck,
    clearWarning,
  };
}

// Higher-order function to wrap actions with usage limit checks
export function withUsageCheck<T extends (...args: any[]) => Promise<any>>(
  action: string,
  fn: T,
  onBlocked?: () => void,
  onWarning?: () => void
): T {
  return (async (...args: Parameters<T>) => {
    const { supabase } = await import("@/integrations/supabase/client");
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Not authenticated");
    }

    const { data, error } = await supabase.rpc("check_usage_limit", {
      p_user_id: user.id,
      p_action: action,
    });

    if (error) {
      console.error("Error checking usage limit:", error);
      // Allow on error
      return fn(...args);
    }

    const result = data as unknown as UsageLimitCheck;

    if (!result.allowed) {
      onBlocked?.();
      throw new Error(result.message || "تم الوصول للحد الأقصى");
    }

    if (result.warning) {
      onWarning?.();
    }

    return fn(...args);
  }) as T;
}
