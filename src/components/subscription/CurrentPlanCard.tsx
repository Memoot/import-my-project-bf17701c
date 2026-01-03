import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap, Calendar } from "lucide-react";
import { useUserSubscription } from "@/hooks/useSubscription";
import { UsageBar } from "./UsageBar";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export function CurrentPlanCard() {
  const { data: subscription, isLoading: loadingSubscription } = useUserSubscription();
  const navigate = useNavigate();

  if (loadingSubscription) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <Crown className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">لا يوجد اشتراك نشط</h3>
          <p className="text-muted-foreground mb-4">
            اختر خطة للبدء في استخدام جميع المميزات
          </p>
          <Button onClick={() => navigate("/dashboard/settings?tab=billing")}>
            <Zap className="w-4 h-4 ml-2" />
            اختر خطة
          </Button>
        </CardContent>
      </Card>
    );
  }

  const plan = subscription.plan;
  const currentUsage = subscription.usage || {
    emails_sent: 0,
    subscribers_count: 0,
    campaigns_count: 0,
    landing_pages_count: 0,
  };

  const limits = (plan?.limits || {}) as Record<string, number>;

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Crown className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base sm:text-lg truncate">{plan?.name || 'مجاني'}</CardTitle>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">{subscription.status === "active" ? "نشط" : "غير نشط"}</Badge>
              <span className="text-xs sm:text-sm text-muted-foreground">
                ${plan?.price || 0}/{plan?.billing_period === 'yearly' ? 'سنة' : 'شهر'}
              </span>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/settings?tab=billing")} className="w-full sm:w-auto text-xs sm:text-sm">
          إدارة الاشتراك
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">
            بداية الاشتراك: {format(new Date(subscription.current_period_start), "d MMMM yyyy", { locale: ar })}
          </span>
        </div>

        <div className="grid gap-4 pt-4 border-t">
          <UsageBar
            label="الرسائل البريدية"
            current={currentUsage.emails_sent || 0}
            limit={limits.emails_per_month || null}
          />
          <UsageBar
            label="المشتركين"
            current={currentUsage.subscribers_count || 0}
            limit={limits.subscribers || null}
          />
          <UsageBar
            label="الحملات"
            current={currentUsage.campaigns_count || 0}
            limit={limits.campaigns_per_month || null}
          />
          <UsageBar
            label="صفحات الهبوط"
            current={currentUsage.landing_pages_count || 0}
            limit={limits.landing_pages || null}
          />
        </div>

        {plan?.features && Array.isArray(plan.features) && plan.features.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">المميزات:</p>
            <div className="grid grid-cols-1 gap-1 text-sm">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
