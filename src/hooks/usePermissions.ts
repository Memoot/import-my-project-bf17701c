import { useUserSubscription } from "./useSubscription";
import { useUserRole } from "./useUserRole";

export interface Permission {
  allowed: boolean;
  reason?: string;
  limit?: number;
  current?: number;
}

// Define feature permissions based on subscription plan limits
const FEATURE_PERMISSIONS: Record<string, (limits: Record<string, any>) => boolean> = {
  'create_campaign': (limits) => true,
  'create_landing_page': (limits) => true,
  'add_subscriber': (limits) => true,
  'send_email': (limits) => true,
  'advanced_automation': (limits) => !!limits.advanced_automation,
  'advanced_analytics': (limits) => !!limits.advanced_analytics,
  'custom_domain': (limits) => !!limits.custom_domain,
  'remove_branding': (limits) => !!limits.remove_branding,
  'api_access': (limits) => !!limits.api_access,
  'ai_tools': (limits) => !!limits.ai_tools,
  'priority_support': (limits) => !!limits.priority_support,
};

export function usePermissions() {
  const { data: subscription, isLoading: isSubLoading } = useUserSubscription();
  const { data: userRole, isLoading: isRoleLoading } = useUserRole();

  const isLoading = isSubLoading || isRoleLoading;
  const isAdmin = userRole?.isAdmin || false;

  const checkPermission = (feature: string): Permission => {
    // Admins have all permissions
    if (isAdmin) {
      return { allowed: true };
    }

    if (!subscription?.plan) {
      return { allowed: false, reason: "لا يوجد اشتراك نشط" };
    }

    const limits = subscription.plan.limits || {};
    const usage = subscription.usage || {};

    // Check feature permission
    const permissionCheck = FEATURE_PERMISSIONS[feature];
    if (permissionCheck && !permissionCheck(limits)) {
      return { 
        allowed: false, 
        reason: `هذه الميزة غير متاحة في خطتك الحالية (${subscription.plan.name})` 
      };
    }

    // Check usage limits for specific actions
    const usageMappings: Record<string, { limitKey: string; usageKey: string; name: string }> = {
      'create_campaign': { limitKey: 'campaigns', usageKey: 'campaigns_count', name: 'الحملات' },
      'create_landing_page': { limitKey: 'landing_pages', usageKey: 'landing_pages_count', name: 'صفحات الهبوط' },
      'add_subscriber': { limitKey: 'subscribers', usageKey: 'subscribers_count', name: 'المشتركين' },
      'send_email': { limitKey: 'emails_per_month', usageKey: 'emails_sent', name: 'الرسائل' },
    };

    const mapping = usageMappings[feature];
    if (mapping) {
      const limit = limits[mapping.limitKey];
      const current = usage[mapping.usageKey] || 0;

      // -1 or undefined means unlimited
      if (limit !== undefined && limit !== -1 && limit !== null) {
        if (current >= limit) {
          return {
            allowed: false,
            reason: `لقد وصلت للحد الأقصى من ${mapping.name} (${limit})`,
            limit,
            current,
          };
        }
        return { allowed: true, limit, current };
      }
    }

    return { allowed: true };
  };

  const hasFeature = (feature: string): boolean => {
    return checkPermission(feature).allowed;
  };

  const getUsageInfo = (feature: string) => {
    const permission = checkPermission(feature);
    if (permission.limit !== undefined) {
      const percentage = permission.limit > 0 ? ((permission.current || 0) / permission.limit) * 100 : 0;
      return {
        current: permission.current || 0,
        limit: permission.limit,
        percentage: Math.min(percentage, 100),
        isNearLimit: percentage >= 80,
        isAtLimit: percentage >= 100,
      };
    }
    return { current: 0, limit: -1, percentage: 0, isNearLimit: false, isAtLimit: false, unlimited: true };
  };

  return {
    isLoading,
    isAdmin,
    subscription,
    plan: subscription?.plan,
    checkPermission,
    hasFeature,
    getUsageInfo,
  };
}

export function useRequirePermission(feature: string) {
  const { checkPermission, isLoading } = usePermissions();
  const permission = checkPermission(feature);
  
  return {
    isLoading,
    ...permission,
  };
}
