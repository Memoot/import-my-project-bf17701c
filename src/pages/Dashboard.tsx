import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentCampaigns } from "@/components/dashboard/RecentCampaigns";
import { SubscribersChart } from "@/components/dashboard/SubscribersChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { CurrentPlanCard } from "@/components/subscription/CurrentPlanCard";
import { UsageBar } from "@/components/subscription/UsageBar";
import { useUserSubscription, useUserUsage } from "@/hooks/useSubscription";
import { Mail, Users, MousePointer, TrendingUp, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "إجمالي المشتركين",
    value: "12,847",
    change: "+12.5% من الشهر الماضي",
    changeType: "positive" as const,
    icon: Users,
    iconColor: "bg-gradient-to-br from-emerald-500 to-teal-500",
  },
  {
    title: "الرسائل المرسلة",
    value: "48,293",
    change: "+8.2% من الشهر الماضي",
    changeType: "positive" as const,
    icon: Mail,
    iconColor: "bg-gradient-to-br from-blue-500 to-indigo-500",
  },
  {
    title: "معدل الفتح",
    value: "68.4%",
    change: "+3.1% من الشهر الماضي",
    changeType: "positive" as const,
    icon: TrendingUp,
    iconColor: "bg-gradient-to-br from-amber-500 to-orange-500",
  },
  {
    title: "معدل النقر",
    value: "24.8%",
    change: "-1.2% من الشهر الماضي",
    changeType: "negative" as const,
    icon: MousePointer,
    iconColor: "bg-gradient-to-br from-pink-500 to-rose-500",
  },
];

export default function Dashboard() {
  const { data: subscription } = useUserSubscription();
  const { data: usage } = useUserUsage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          title="نظرة عامة" 
          description="مرحباً بك! إليك ملخص أداء حملاتك البريدية"
        />
        
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {/* Welcome Banner */}
          <Card className="mb-6 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border-emerald-500/20 overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full -translate-x-32 -translate-y-32" />
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-teal-500/20 to-transparent rounded-full translate-x-24 translate-y-24" />
              
              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">مرحباً بك في ماركيتلي! 👋</h2>
                  <p className="text-muted-foreground">استعد لإطلاق حملات تسويقية ناجحة تصل لآلاف العملاء</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
            {stats.map((stat) => (
              <StatsCard key={stat.title} {...stat} />
            ))}
          </div>

          {/* Subscription & Usage Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
            <CurrentPlanCard />
            
            <Card className="lg:col-span-2 shadow-md border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  استهلاك الخطة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <UsageBar 
                  label="الرسائل المرسلة"
                  current={usage?.emails_sent || 0}
                  limit={subscription?.plan?.email_limit_per_month || null}
                />
                <UsageBar 
                  label="المشتركين"
                  current={usage?.subscribers_count || 0}
                  limit={subscription?.plan?.subscriber_limit || null}
                />
                <UsageBar 
                  label="صفحات الهبوط"
                  current={usage?.landing_pages_count || 0}
                  limit={subscription?.plan?.landing_page_limit || null}
                />
                <UsageBar 
                  label="الأتمتة"
                  current={usage?.automations_count || 0}
                  limit={subscription?.plan?.automation_limit || null}
                />
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Chart - Takes 2 columns */}
            <div className="lg:col-span-2">
              <SubscribersChart />
            </div>

            {/* Quick Actions */}
            <div>
              <QuickActions />
            </div>
          </div>

          {/* Recent Campaigns */}
          <div className="mt-6">
            <RecentCampaigns />
          </div>
        </main>
      </div>
    </div>
  );
}
