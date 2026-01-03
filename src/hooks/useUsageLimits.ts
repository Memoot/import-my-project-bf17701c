import { useState, useCallback } from "react";

export interface UsageLimitCheck {
  allowed: boolean;
  reason?: string;
  warning?: boolean;
  message?: string;
  current?: number;
  limit?: number;
}

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

  const checkLimit = useCallback(async (action: string): Promise<UsageLimitCheck> => {
    // Mock implementation - always allow since no subscription tables exist
    const result: UsageLimitCheck = { allowed: true };
    setLimitCheck(result);
    return result;
  }, []);

  const incrementUsage = useCallback(async (field: string, amount = 1) => {
    // Mock implementation - no-op
  }, []);

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
    // Mock implementation - always allow
    return fn(...args);
  }) as T;
}
