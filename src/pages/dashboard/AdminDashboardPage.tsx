import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Crown, 
  CreditCard, 
  Megaphone, 
  FileText, 
  Key, 
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  Loader2,
  Shield,
  Mail,
  Layout
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useUserRole, useAllUsers } from "@/hooks/useUserRole";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [
        { count: usersCount },
        { count: subscribersCount },
        { count: campaignsCount },
        { count: landingPagesCount },
        { count: adsCount },
        { count: messagesCount },
        { count: subscriptionsCount },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("subscribers").select("*", { count: "exact", head: true }),
        supabase.from("campaigns").select("*", { count: "exact", head: true }),
        supabase.from("landing_pages").select("*", { count: "exact", head: true }),
        supabase.from("advertisements").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "unread"),
        supabase.from("user_subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
      ]);

      return {
        usersCount: usersCount || 0,
        subscribersCount: subscribersCount || 0,
        campaignsCount: campaignsCount || 0,
        landingPagesCount: landingPagesCount || 0,
        adsCount: adsCount || 0,
        messagesCount: messagesCount || 0,
        subscriptionsCount: subscriptionsCount || 0,
      };
    },
  });
}

export default function AdminDashboardPage() {
  const { data: userRole, isLoading: isRoleLoading } = useUserRole();
  const { data: allUsers = [] } = useAllUsers();
  const { data: stats, isLoading: isStatsLoading } = useAdminStats();

  if (isRoleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userRole?.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const adminCount = allUsers.filter((u) => u.roles.includes("admin")).length;

  const quickLinks = [
    { title: "إدارة المستخدمين", description: "عرض وإدارة المستخدمين", url: "/dashboard/admin/users", icon: Users, color: "from-blue-500 to-cyan-500", count: stats?.usersCount },
    { title: "إدارة الخطط", description: "خطط الاشتراك", url: "/dashboard/admin/plans", icon: Crown, color: "from-amber-500 to-orange-500" },
    { title: "الاشتراكات", description: "اشتراكات المستخدمين", url: "/dashboard/admin/subscriptions", icon: CreditCard, color: "from-green-500 to-emerald-500", count: stats?.subscriptionsCount },
    { title: "طلبات الإعلانات", description: "مراجعة الطلبات", url: "/dashboard/admin/ad-requests", icon: Megaphone, color: "from-purple-500 to-pink-500" },
    { title: "إدارة الإعلانات", description: "الإعلانات النشطة", url: "/dashboard/admin/ads", icon: TrendingUp, color: "from-red-500 to-rose-500", count: stats?.adsCount },
    { title: "إدارة المقالات", description: "المدونة والمقالات", url: "/dashboard/admin/articles", icon: FileText, color: "from-indigo-500 to-violet-500" },
    { title: "رسائل التواصل", description: "رسائل الزوار", url: "/dashboard/admin/messages", icon: MessageSquare, color: "from-teal-500 to-cyan-500", count: stats?.messagesCount },
    { title: "مفاتيح API", description: "إدارة المفاتيح", url: "/dashboard/admin/api-keys", icon: Key, color: "from-gray-500 to-slate-500" },
  ];

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          title="لوحة تحكم المدير" 
          description="مركز التحكم الشامل لإدارة النظام" 
        />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 border border-primary/20">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/20">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">مرحباً بك في لوحة تحكم المدير</h1>
                  <p className="text-muted-foreground">يمكنك إدارة جميع جوانب النظام من هنا</p>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>إجمالي المستخدمين</span>
                    <Users className="w-4 h-4 text-blue-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{isStatsLoading ? "-" : stats?.usersCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">{adminCount} مدير</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>المشتركين</span>
                    <Mail className="w-4 h-4 text-green-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{isStatsLoading ? "-" : stats?.subscribersCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">إجمالي القوائم البريدية</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>الحملات</span>
                    <Megaphone className="w-4 h-4 text-purple-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{isStatsLoading ? "-" : stats?.campaignsCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">حملة بريدية</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>صفحات الهبوط</span>
                    <Layout className="w-4 h-4 text-amber-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{isStatsLoading ? "-" : stats?.landingPagesCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">صفحة هبوط</p>
                </CardContent>
              </Card>
            </div>

            {/* Alerts */}
            {stats?.messagesCount && stats.messagesCount > 0 && (
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-destructive/20">
                      <MessageSquare className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <p className="font-medium">لديك {stats.messagesCount} رسائل جديدة</p>
                      <p className="text-sm text-muted-foreground">تحتاج للمراجعة</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/dashboard/admin/messages">
                      عرض الرسائل
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Links */}
            <div>
              <h2 className="text-xl font-bold mb-4">الوصول السريع</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {quickLinks.map((link) => (
                  <Link key={link.url} to={link.url}>
                    <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                      <CardHeader className="pb-2">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                          <link.icon className="w-5 h-5 text-white" />
                        </div>
                        <CardTitle className="text-base flex items-center justify-between">
                          {link.title}
                          {link.count !== undefined && link.count > 0 && (
                            <Badge variant="secondary">{link.count}</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{link.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button variant="ghost" size="sm" className="p-0 h-auto text-primary">
                          عرض
                          <ArrowUpRight className="w-4 h-4 mr-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
