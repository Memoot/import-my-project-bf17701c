import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentCampaigns } from "@/components/dashboard/RecentCampaigns";
import { SubscribersChart } from "@/components/dashboard/SubscribersChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { CurrentPlanCard } from "@/components/subscription/CurrentPlanCard";
import { UsageBar } from "@/components/subscription/UsageBar";
import { useUserSubscription, useUserUsage } from "@/hooks/useSubscription";
import { Mail, Users, MousePointer, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "إجمالي المشتركين",
    value: "12,847",
    change: "+12.5% من الشهر الماضي",
    changeType: "positive" as const,
    icon: Users,
    iconColor: "bg-primary/10 text-primary",
  },
  {
    title: "الرسائل المرسلة",
    value: "48,293",
    change: "+8.2% من الشهر الماضي",
    changeType: "positive" as const,
    icon: Mail,
    iconColor: "bg-secondary/10 text-secondary",
  },
  {
    title: "معدل الفتح",
    value: "68.4%",
    change: "+3.1% من الشهر الماضي",
    changeType: "positive" as const,
    icon: TrendingUp,
    iconColor: "bg-green-100 text-green-700",
  },
  {
    title: "معدل النقر",
    value: "24.8%",
    change: "-1.2% من الشهر الماضي",
    changeType: "negative" as const,
    icon: MousePointer,
    iconColor: "bg-accent/10 text-accent",
  },
];

export default function Dashboard() {
  const { data: subscription } = useUserSubscription();
  const { data: usage } = useUserUsage();

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          title="نظرة عامة" 
          description="مرحباً بك! إليك ملخص أداء حملاتك البريدية"
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat) => (
              <StatsCard key={stat.title} {...stat} />
            ))}
          </div>

          {/* Subscription & Usage Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <CurrentPlanCard />
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>استهلاك الخطة</CardTitle>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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