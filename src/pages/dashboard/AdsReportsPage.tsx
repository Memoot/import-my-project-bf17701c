import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  DollarSign,
  Calendar,
  RefreshCw,
  Download,
  Megaphone,
  Clock,
  Target,
  Activity,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Advertisement } from "@/hooks/useAdvertisements";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "#10b981", "#f59e0b", "#ef4444"];

export default function AdsReportsPage() {
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState("30");

  // Fetch all advertisements
  const { data: ads, isLoading } = useQuery({
    queryKey: ["all-advertisements-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("advertisements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Advertisement[];
    },
  });

  // Extend ad mutation
  const extendAd = useMutation({
    mutationFn: async ({ id, days }: { id: string; days: number }) => {
      const ad = ads?.find((a) => a.id === id);
      if (!ad) throw new Error("الإعلان غير موجود");

      const currentEndDate = ad.end_date ? new Date(ad.end_date) : new Date();
      const newEndDate = new Date(currentEndDate);
      newEndDate.setDate(newEndDate.getDate() + days);

      const { error } = await supabase
        .from("advertisements")
        .update({
          end_date: newEndDate.toISOString(),
          status: "active",
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-advertisements-reports"] });
      queryClient.invalidateQueries({ queryKey: ["all-advertisements"] });
      toast({ title: "تم تمديد الإعلان بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ في تمديد الإعلان", variant: "destructive" });
    },
  });

  // Calculate statistics
  const stats = {
    totalAds: ads?.length || 0,
    activeAds: ads?.filter((ad) => ad.status === "active").length || 0,
    pendingAds: ads?.filter((ad) => ad.status === "pending").length || 0,
    expiredAds: ads?.filter((ad) => ad.status === "expired").length || 0,
    totalViews: ads?.reduce((sum, ad) => sum + (ad.views_count || 0), 0) || 0,
    totalClicks: ads?.reduce((sum, ad) => sum + (ad.clicks_count || 0), 0) || 0,
    totalRevenue: ads?.reduce((sum, ad) => sum + (ad.price || 0), 0) || 0,
    avgCTR:
      ads && ads.length > 0
        ? (
            (ads.reduce((sum, ad) => sum + (ad.clicks_count || 0), 0) /
              Math.max(ads.reduce((sum, ad) => sum + (ad.views_count || 0), 0), 1)) *
            100
          ).toFixed(2)
        : "0",
  };

  // Prepare chart data
  const adTypeData = [
    { name: "أساسي", value: ads?.filter((ad) => ad.ad_type === "basic").length || 0 },
    { name: "جانبي", value: ads?.filter((ad) => ad.ad_type === "standard").length || 0 },
    { name: "متميز", value: ads?.filter((ad) => ad.ad_type === "premium").length || 0 },
    { name: "مميز", value: ads?.filter((ad) => ad.ad_type === "featured").length || 0 },
  ];

  const performanceData = ads?.slice(0, 10).map((ad) => ({
    name: ad.title.substring(0, 15) + "...",
    مشاهدات: ad.views_count || 0,
    نقرات: ad.clicks_count || 0,
  })) || [];

  const statusData = [
    { name: "نشط", value: stats.activeAds, color: "#10b981" },
    { name: "قيد المراجعة", value: stats.pendingAds, color: "#f59e0b" },
    { name: "منتهي", value: stats.expiredAds, color: "#6b7280" },
    { name: "مرفوض", value: ads?.filter((ad) => ad.status === "rejected").length || 0, color: "#ef4444" },
  ];

  // Get expired or about to expire ads
  const expiringAds = ads?.filter((ad) => {
    if (!ad.end_date) return false;
    const endDate = new Date(ad.end_date);
    const now = new Date();
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 3 && daysLeft >= -7;
  }) || [];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "غير محدد";
    return new Date(dateString).toLocaleDateString("ar-SA");
  };

  const getDaysLeft = (endDate: string | null) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-background font-cairo flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="تقارير وإحصائيات الإعلانات" description="تحليلات مفصلة لأداء الإعلانات" />
        <main className="flex-1 p-6 overflow-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Megaphone className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{stats.totalAds}</p>
                <p className="text-xs text-muted-foreground">إجمالي الإعلانات</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Activity className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold text-green-500">{stats.activeAds}</p>
                <p className="text-xs text-muted-foreground">نشط</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                <p className="text-2xl font-bold text-amber-500">{stats.pendingAds}</p>
                <p className="text-xs text-muted-foreground">قيد المراجعة</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                <p className="text-2xl font-bold text-gray-500">{stats.expiredAds}</p>
                <p className="text-xs text-muted-foreground">منتهي</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Eye className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold text-blue-500">{stats.totalViews.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">المشاهدات</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <MousePointer className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold text-purple-500">{stats.totalClicks.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">النقرات</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                <p className="text-2xl font-bold text-orange-500">{stats.avgCTR}%</p>
                <p className="text-xs text-muted-foreground">معدل النقر</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                <p className="text-2xl font-bold text-emerald-500">{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">الإيرادات (ر.س)</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  أداء أفضل 10 إعلانات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="مشاهدات" fill="hsl(var(--primary))" />
                      <Bar dataKey="نقرات" fill="hsl(var(--secondary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  توزيع حالات الإعلانات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Expiring Ads - Auto Extend */}
          {expiringAds.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-amber-500" />
                  إعلانات تحتاج للتمديد ({expiringAds.length})
                </CardTitle>
                <CardDescription>
                  هذه الإعلانات انتهت أو ستنتهي قريباً - يمكنك تمديدها بنقرة واحدة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الإعلان</TableHead>
                        <TableHead>المعلن</TableHead>
                        <TableHead>تاريخ الانتهاء</TableHead>
                        <TableHead>الأيام المتبقية</TableHead>
                        <TableHead>المشاهدات</TableHead>
                        <TableHead>تمديد</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expiringAds.map((ad) => {
                        const daysLeft = getDaysLeft(ad.end_date);
                        return (
                          <TableRow key={ad.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden">
                                  {ad.image_url ? (
                                    <img src={ad.image_url} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Megaphone className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>
                                <span className="font-medium">{ad.title}</span>
                              </div>
                            </TableCell>
                            <TableCell>{ad.advertiser_name}</TableCell>
                            <TableCell>{formatDate(ad.end_date)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={daysLeft && daysLeft < 0 ? "destructive" : "outline"}
                                className={daysLeft && daysLeft < 0 ? "" : "text-amber-500 border-amber-500"}
                              >
                                {daysLeft && daysLeft < 0 ? `منتهي منذ ${Math.abs(daysLeft)} يوم` : `${daysLeft} يوم`}
                              </Badge>
                            </TableCell>
                            <TableCell>{ad.views_count}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => extendAd.mutate({ id: ad.id, days: 7 })}
                                  disabled={extendAd.isPending}
                                >
                                  +7 أيام
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => extendAd.mutate({ id: ad.id, days: 14 })}
                                  disabled={extendAd.isPending}
                                >
                                  +14 يوم
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-primary-gradient"
                                  onClick={() => extendAd.mutate({ id: ad.id, days: 30 })}
                                  disabled={extendAd.isPending}
                                >
                                  +30 يوم
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Ads Performance Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">تقرير أداء جميع الإعلانات</CardTitle>
                <CardDescription>عرض تفصيلي لأداء كل إعلان</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 ml-2" />
                تصدير التقرير
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الإعلان</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>المشاهدات</TableHead>
                      <TableHead>النقرات</TableHead>
                      <TableHead>معدل النقر</TableHead>
                      <TableHead>السعر</TableHead>
                      <TableHead>تاريخ البدء</TableHead>
                      <TableHead>تاريخ الانتهاء</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ads?.map((ad) => {
                      const ctr = ad.views_count && ad.views_count > 0
                        ? ((ad.clicks_count || 0) / ad.views_count * 100).toFixed(2)
                        : "0";
                      return (
                        <TableRow key={ad.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden">
                                {ad.image_url ? (
                                  <img src={ad.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Megaphone className="w-4 h-4 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{ad.title}</p>
                                <p className="text-xs text-muted-foreground">{ad.advertiser_name}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{ad.ad_type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={ad.status === "active" ? "default" : ad.status === "pending" ? "outline" : "secondary"}
                              className={ad.status === "active" ? "bg-green-500" : ad.status === "pending" ? "text-amber-500 border-amber-500" : ""}
                            >
                              {ad.status === "active" ? "نشط" : ad.status === "pending" ? "قيد المراجعة" : ad.status === "expired" ? "منتهي" : "مرفوض"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4 text-muted-foreground" />
                              {ad.views_count?.toLocaleString() || 0}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MousePointer className="w-4 h-4 text-muted-foreground" />
                              {ad.clicks_count?.toLocaleString() || 0}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={Number(ctr) > 5 ? "text-green-500 font-medium" : "text-muted-foreground"}>
                              {ctr}%
                            </span>
                          </TableCell>
                          <TableCell>{ad.price} ر.س</TableCell>
                          <TableCell>{formatDate(ad.start_date)}</TableCell>
                          <TableCell>{formatDate(ad.end_date)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
