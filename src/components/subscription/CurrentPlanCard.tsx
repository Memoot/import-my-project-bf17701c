import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap, Calendar } from "lucide-react";
import { useUserSubscription, useUserUsage, SubscriptionPlan } from "@/hooks/useSubscription";
import { UsageBar } from "./UsageBar";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export function CurrentPlanCard() {
  const { data: subscription, isLoading: loadingSubscription } = useUserSubscription();
  const { data: usage, isLoading: loadingUsage } = useUserUsage();
  const navigate = useNavigate();

  if (loadingSubscription || loadingUsage) {
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
  const currentUsage = usage || {
    emails_sent: 0,
    subscribers_count: 0,
    automations_count: 0,
    landing_pages_count: 0,
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Crown className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">{plan.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{subscription.status === "active" ? "نشط" : "غير نشط"}</Badge>
              <span className="text-sm text-muted-foreground">
                ${plan.monthly_price}/شهر
              </span>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/settings?tab=billing")}>
          إدارة الاشتراك
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>
            بداية دورة الفوترة: {format(new Date(subscription.billing_cycle_start), "d MMMM yyyy", { locale: ar })}
          </span>
        </div>

        <div className="grid gap-4 pt-4 border-t">
          <UsageBar
            label="الرسائل البريدية"
            current={currentUsage.emails_sent}
            limit={plan.email_limit_per_month}
          />
          <UsageBar
            label="المشتركين"
            current={currentUsage.subscribers_count}
            limit={plan.subscriber_limit}
          />
          <UsageBar
            label="الأتمتة"
            current={currentUsage.automations_count}
            limit={plan.automation_limit}
          />
          <UsageBar
            label="صفحات الهبوط"
            current={currentUsage.landing_pages_count}
            limit={plan.landing_page_limit}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 pt-4 border-t text-sm">
          <FeatureItem label="تحليلات متقدمة" enabled={plan.advanced_analytics} />
          <FeatureItem label="أتمتة متقدمة" enabled={plan.advanced_automation} />
          <FeatureItem label="نطاق مخصص" enabled={plan.custom_domain} />
          <FeatureItem label="إزالة العلامة التجارية" enabled={plan.remove_branding} />
          <FeatureItem label="وصول API" enabled={plan.api_access} />
        </div>
      </CardContent>
    </Card>
  );
}

function FeatureItem({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${enabled ? "bg-primary" : "bg-muted"}`} />
      <span className={enabled ? "" : "text-muted-foreground"}>{label}</span>
    </div>
  );
}
