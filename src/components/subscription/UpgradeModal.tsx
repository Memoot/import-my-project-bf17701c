import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, AlertTriangle } from "lucide-react";
import { useSubscriptionPlans, SubscriptionPlan } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";

interface UpgradeModalProps {
  open: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  currentPlanId?: string;
  warningType?: "warning" | "blocked";
  limitType?: string;
  currentUsage?: number;
  limit?: number;
}

export function UpgradeModal({ 
  open, 
  onClose, 
  onOpenChange,
  currentPlanId, 
  warningType = "warning",
  limitType,
  currentUsage,
  limit 
}: UpgradeModalProps) {
  const { data: plans } = useSubscriptionPlans();
  const navigate = useNavigate();

  const handleClose = () => {
    onClose?.();
    onOpenChange?.(false);
  };

  const getLimitLabel = (type?: string) => {
    switch (type) {
      case "send_email": return "الرسائل البريدية";
      case "add_subscriber": return "المشتركين";
      case "create_automation": return "الأتمتة";
      case "create_landing_page": return "صفحات الهبوط";
      default: return "الاستخدام";
    }
  };

  const availablePlans = plans?.filter(p => p.id !== currentPlanId && p.is_active) || [];

  const formatLimit = (value: number | null) => {
    if (value === null) return "غير محدود";
    return value.toLocaleString("ar-SA");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {warningType === "blocked" ? (
              <>
                <AlertTriangle className="w-6 h-6 text-destructive" />
                تم الوصول للحد الأقصى
              </>
            ) : (
              <>
                <Zap className="w-6 h-6 text-warning" />
                اقتربت من الحد الأقصى
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-base">
            {warningType === "blocked" ? (
              <>لقد وصلت إلى الحد الأقصى لـ{getLimitLabel(limitType)} ({currentUsage} من {limit}). قم بالترقية للاستمرار.</>
            ) : (
              <>استخدمت {currentUsage} من {limit} ({Math.round((currentUsage || 0) / (limit || 1) * 100)}%) من {getLimitLabel(limitType)}. قم بالترقية لتجنب الانقطاع.</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-3 mt-4">
          {availablePlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onSelect={() => {
              navigate("/dashboard/pricing");
              handleClose();
            }} />
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleClose}>
            لاحقاً
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PlanCard({ plan, onSelect }: { plan: SubscriptionPlan; onSelect: () => void }) {
  const formatLimit = (value: number | null) => {
    if (value === null) return "∞";
    return value.toLocaleString("ar-SA");
  };

  return (
    <div className="border rounded-xl p-4 hover:border-primary transition-colors">
      <div className="text-center mb-4">
        <h3 className="font-bold text-lg">{plan.name}</h3>
        <div className="mt-2">
          <span className="text-3xl font-bold">${plan.monthly_price}</span>
          <span className="text-muted-foreground">/شهر</span>
        </div>
      </div>

      <ul className="space-y-2 text-sm mb-4">
        <li className="flex items-center gap-2">
          <Check className="w-4 h-4 text-primary" />
          <span>{formatLimit(plan.email_limit_per_month)} رسالة/شهر</span>
        </li>
        <li className="flex items-center gap-2">
          <Check className="w-4 h-4 text-primary" />
          <span>{formatLimit(plan.subscriber_limit)} مشترك</span>
        </li>
        <li className="flex items-center gap-2">
          <Check className="w-4 h-4 text-primary" />
          <span>{formatLimit(plan.landing_page_limit)} صفحة هبوط</span>
        </li>
        {plan.advanced_analytics && (
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span>تحليلات متقدمة</span>
          </li>
        )}
        {plan.custom_domain && (
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span>نطاق مخصص</span>
          </li>
        )}
        {plan.api_access && (
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span>وصول API</span>
          </li>
        )}
      </ul>

      <Button className="w-full" onClick={onSelect}>
        اختر هذه الخطة
      </Button>
    </div>
  );
}
