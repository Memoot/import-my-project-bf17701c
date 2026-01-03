import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Sparkles } from "lucide-react";
import { useSubscriptionPlans, useUserSubscription } from "@/hooks/useSubscription";
import { UpgradeModal } from "@/components/subscription/UpgradeModal";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PricingPage() {
  const { data: plans, isLoading: plansLoading } = useSubscriptionPlans();
  const { data: currentSubscription } = useUserSubscription();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setUpgradeModalOpen(true);
  };

  const formatNumber = (num: number | null) => {
    if (num === null) return "غير محدود";
    return num.toLocaleString("ar-SA");
  };

  const getPlanIcon = (index: number) => {
    if (index === 0) return <Zap className="h-6 w-6" />;
    if (index === 1) return <Sparkles className="h-6 w-6" />;
    return <Crown className="h-6 w-6" />;
  };

  const activePlans = plans?.filter(p => p.is_active) || [];

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          title="الخطط والأسعار" 
          description="اختر الخطة المناسبة لاحتياجاتك"
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">ابدأ بالخطة المجانية وتوسع مع نموك</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              اختر من بين خططنا المرنة التي تناسب جميع أحجام الأعمال
            </p>
          </div>

          {/* Plans Grid */}
          {plansLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-96 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {activePlans.map((plan, index) => {
                const isCurrentPlan = currentSubscription?.plan_id === plan.id;
                const isPopular = index === 1; // Middle plan is popular

                return (
                  <Card 
                    key={plan.id} 
                    className={`relative overflow-hidden transition-all hover:shadow-lg ${
                      isPopular ? "border-primary shadow-md scale-105" : ""
                    } ${isCurrentPlan ? "ring-2 ring-primary" : ""}`}
                  >
                    {isPopular && (
                      <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                        الأكثر شيوعاً
                      </div>
                    )}
                    
                    <CardHeader className={isPopular ? "pt-10" : ""}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-2 rounded-lg ${
                          isPopular ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}>
                          {getPlanIcon(index)}
                        </div>
                        <CardTitle>{plan.name}</CardTitle>
                        {isCurrentPlan && (
                          <Badge variant="secondary">خطتك الحالية</Badge>
                        )}
                      </div>
                      <CardDescription>
                        <span className="text-3xl font-bold text-foreground">
                          {plan.monthly_price === 0 ? "مجاني" : `${plan.monthly_price} ر.س`}
                        </span>
                        {plan.monthly_price > 0 && (
                          <span className="text-muted-foreground"> / شهرياً</span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{formatNumber(plan.email_limit_per_month)} رسالة شهرياً</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{formatNumber(plan.subscriber_limit)} مشترك</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{formatNumber(plan.landing_page_limit)} صفحة هبوط</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{formatNumber(plan.automation_limit)} أتمتة</span>
                        </li>
                        {plan.advanced_analytics && (
                          <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                            <span>تحليلات متقدمة</span>
                          </li>
                        )}
                        {plan.custom_domain && (
                          <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                            <span>دومين مخصص</span>
                          </li>
                        )}
                        {plan.remove_branding && (
                          <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                            <span>إزالة العلامة التجارية</span>
                          </li>
                        )}
                        {plan.api_access && (
                          <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                            <span>وصول API</span>
                          </li>
                        )}
                      </ul>
                      
                      <Button 
                        className={`w-full ${isPopular ? "bg-primary-gradient" : ""}`}
                        variant={isCurrentPlan ? "outline" : isPopular ? "default" : "outline"}
                        disabled={isCurrentPlan}
                        onClick={() => handleSelectPlan(plan.id)}
                      >
                        {isCurrentPlan ? "خطتك الحالية" : "اختر هذه الخطة"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* FAQ Section */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">الأسئلة الشائعة</h3>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">هل يمكنني الترقية أو التخفيض في أي وقت؟</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    نعم، يمكنك تغيير خطتك في أي وقت. عند الترقية، ستحصل على الميزات الجديدة فوراً.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ماذا يحدث إذا تجاوزت حدود خطتي؟</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    سنُعلمك عندما تقترب من حدودك. يمكنك الترقية لخطة أعلى لمواصلة العمل بدون انقطاع.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">هل هناك فترة تجريبية؟</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    الخطة المجانية متاحة للجميع بدون قيود زمنية. يمكنك البدء مجاناً والترقية عندما تحتاج لميزات إضافية.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <UpgradeModal 
        open={upgradeModalOpen} 
        onOpenChange={setUpgradeModalOpen}
      />
    </div>
  );
}
