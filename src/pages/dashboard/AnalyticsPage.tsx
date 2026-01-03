import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Mail, 
  Eye, 
  MousePointer, 
  TrendingUp,
  Users,
  ArrowUpRight
} from "lucide-react";

const emailPerformance = [
  { month: "يناير", sent: 8500, opened: 5100, clicked: 1700 },
  { month: "فبراير", sent: 9200, opened: 5980, clicked: 2024 },
  { month: "مارس", sent: 11000, opened: 7700, clicked: 2860 },
  { month: "أبريل", sent: 12500, opened: 8750, clicked: 3375 },
  { month: "مايو", sent: 14000, opened: 10080, clicked: 4060 },
  { month: "يونيو", sent: 15500, opened: 11470, clicked: 4805 },
];

const campaignPerformance = [
  { name: "عرض رمضان", openRate: 70, clickRate: 25 },
  { name: "نشرة أسبوعية", openRate: 60, clickRate: 20 },
  { name: "ترحيب جديد", openRate: 80, clickRate: 35 },
  { name: "تحديث منتج", openRate: 55, clickRate: 18 },
  { name: "عرض خاص", openRate: 75, clickRate: 30 },
];

const deviceData = [
  { name: "الجوال", value: 55, color: "hsl(217 91% 40%)" },
  { name: "الكمبيوتر", value: 35, color: "hsl(28 95% 55%)" },
  { name: "التابلت", value: 10, color: "hsl(180 70% 40%)" },
];

const stats = [
  {
    title: "إجمالي الرسائل",
    value: "156,847",
    change: "+18.2% من الشهر الماضي",
    changeType: "positive" as const,
    icon: Mail,
    iconColor: "bg-primary/10 text-primary",
  },
  {
    title: "معدل الفتح",
    value: "68.4%",
    change: "+5.1% من الشهر الماضي",
    changeType: "positive" as const,
    icon: Eye,
    iconColor: "bg-green-100 text-green-700",
  },
  {
    title: "معدل النقر",
    value: "24.8%",
    change: "+2.3% من الشهر الماضي",
    changeType: "positive" as const,
    icon: MousePointer,
    iconColor: "bg-secondary/10 text-secondary",
  },
  {
    title: "نمو المشتركين",
    value: "+2,847",
    change: "+12.5% من الشهر الماضي",
    changeType: "positive" as const,
    icon: Users,
    iconColor: "bg-accent/10 text-accent",
  },
];

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          title="التحليلات" 
          description="تحليلات أداء حملاتك البريدية"
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat) => (
              <StatsCard key={stat.title} {...stat} />
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Email Performance Chart */}
            <Card className="bg-card lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  أداء البريد الإلكتروني
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={emailPerformance}>
                      <defs>
                        <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(217 91% 40%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(217 91% 40%)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(28 95% 55%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(28 95% 55%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis 
                        dataKey="month" 
                        className="text-xs fill-muted-foreground"
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        className="text-xs fill-muted-foreground"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => value.toLocaleString('ar-EG')}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          direction: "rtl",
                        }}
                        formatter={(value: number, name: string) => [
                          value.toLocaleString('ar-EG'),
                          name === "sent" ? "مرسلة" : name === "opened" ? "مفتوحة" : "نقرات"
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="sent"
                        stroke="hsl(217 91% 40%)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorSent)"
                      />
                      <Area
                        type="monotone"
                        dataKey="opened"
                        stroke="hsl(28 95% 55%)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorOpened)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Device Distribution */}
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">توزيع الأجهزة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`${value}%`, ""]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  {deviceData.map((device) => (
                    <div key={device.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: device.color }}
                      />
                      <span className="text-sm text-muted-foreground">{device.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campaign Performance */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-secondary" />
                أداء الحملات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaignPerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                    <XAxis 
                      type="number"
                      className="text-xs fill-muted-foreground"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <YAxis 
                      type="category"
                      dataKey="name"
                      className="text-xs fill-muted-foreground"
                      tickLine={false}
                      axisLine={false}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        direction: "rtl",
                      }}
                      formatter={(value: number, name: string) => [
                        `${value}%`,
                        name === "openRate" ? "معدل الفتح" : "معدل النقر"
                      ]}
                    />
                    <Bar dataKey="openRate" fill="hsl(217 91% 40%)" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="clickRate" fill="hsl(28 95% 55%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
