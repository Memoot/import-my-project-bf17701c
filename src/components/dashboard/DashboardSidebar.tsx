import { 
  LayoutDashboard, 
  Mail, 
  Users, 
  BarChart3, 
  Settings, 
  FileText,
  Send,
  Inbox,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Layout,
  Shield,
  Upload,
  Sparkles,
  FileArchive,
  UserCircle,
  Megaphone,
  Crown,
  CreditCard,
  Key,
  Menu,
  Rocket,
  TrendingUp
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

const menuItems = [
  { title: "نظرة عامة", url: "/dashboard", icon: LayoutDashboard },
  { title: "الحملات", url: "/dashboard/campaigns", icon: Mail },
  { title: "صفحات الهبوط", url: "/dashboard/landing-pages", icon: Layout },
  { title: "توليد الصور بالذكاء", url: "/dashboard/ai-images", icon: Sparkles },
  { title: "المشتركين", url: "/dashboard/subscribers", icon: Users },
  { title: "الرسائل المرسلة", url: "/dashboard/sent", icon: Send },
  { title: "البريد الوارد", url: "/dashboard/inbox", icon: Inbox },
  { title: "التحليلات", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "القوالب", url: "/dashboard/templates", icon: FileText },
  { title: "الخطط والأسعار", url: "/dashboard/pricing", icon: Crown },
  { title: "الملف الشخصي", url: "/dashboard/profile", icon: UserCircle },
  { title: "الإعدادات", url: "/dashboard/settings", icon: Settings },
];

const adminItems = [
  { title: "لوحة الإدارة", url: "/dashboard/admin", icon: Shield },
  { title: "إدارة المستخدمين", url: "/dashboard/admin/users", icon: Users },
  { title: "إدارة الخطط", url: "/dashboard/admin/plans", icon: Crown },
  { title: "إدارة الاشتراكات", url: "/dashboard/admin/subscriptions", icon: CreditCard },
  { title: "طلبات الإعلانات", url: "/dashboard/admin/ad-requests", icon: Megaphone },
  { title: "إدارة الإعلانات", url: "/dashboard/admin/ads", icon: TrendingUp },
  { title: "إدارة المقالات", url: "/dashboard/admin/articles", icon: FileText },
  { title: "رسائل التواصل", url: "/dashboard/admin/messages", icon: Inbox },
  { title: "مفاتيح API", url: "/dashboard/admin/api-keys", icon: Key },
  { title: "إدارة القوالب", url: "/dashboard/admin/templates", icon: Upload },
];

function SidebarContent({ 
  collapsed, 
  userRole, 
  userEmail, 
  userInitials, 
  handleLogout,
  onNavigate 
}: { 
  collapsed: boolean;
  userRole: any;
  userEmail: string | null;
  userInitials: string;
  handleLogout: () => void;
  onNavigate?: () => void;
}) {
  const navigate = useNavigate();

  return (
    <>
      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === "/dashboard"}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10 hover:text-foreground transition-all duration-200",
                collapsed && "justify-center px-2"
              )}
              activeClassName="bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-600 dark:text-emerald-400 hover:from-emerald-500/20 hover:to-teal-500/20 font-medium border-r-2 border-emerald-500"
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          ))}

          {/* Admin Section */}
          {userRole?.isAdmin && (
            <>
              <div className={cn("pt-6 pb-2", collapsed && "hidden")}>
                <div className="flex items-center gap-2 px-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs font-medium text-muted-foreground">الإدارة</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              </div>
              {adminItems.map((item) => (
                <NavLink
                  key={item.url}
                  to={item.url}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-orange-500/10 hover:text-foreground transition-all duration-200",
                    collapsed && "justify-center px-2"
                  )}
                  activeClassName="bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-600 dark:text-amber-400 hover:from-amber-500/20 hover:to-orange-500/20 font-medium border-r-2 border-amber-500"
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              ))}
            </>
          )}
        </nav>
      </ScrollArea>

      {/* User Section */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className={cn(
          "flex items-center gap-3",
          collapsed && "justify-center"
        )}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-sm font-bold text-white">{userInitials}</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {userRole?.isAdmin ? "مدير النظام" : "مستخدم"}
              </p>
              <p className="text-xs text-muted-foreground truncate">{userEmail || "..."}</p>
            </div>
          )}
          {!collapsed && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="flex-shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: userRole } = useUserRole();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState("؟؟");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || null);
        if (user.email) {
          setUserInitials(user.email.substring(0, 2).toUpperCase());
        }
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <>
      {/* Mobile Menu Button - Fixed Position */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 right-4 z-50 lg:hidden bg-card shadow-lg rounded-xl"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-72 p-0 bg-card border-l-0">
          {/* Mobile Header */}
          <div className="p-4 border-b border-border bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
            <button 
              onClick={() => { navigate("/"); setMobileOpen(false); }}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-foreground block">ماركيتلي</span>
                <span className="text-[10px] text-muted-foreground">منصة التسويق الذكية</span>
              </div>
            </button>
          </div>
          <div className="flex flex-col h-[calc(100%-81px)]">
            <SidebarContent 
              collapsed={false} 
              userRole={userRole}
              userEmail={userEmail}
              userInitials={userInitials}
              handleLogout={handleLogout}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "bg-card border-l border-border h-screen sticky top-0 transition-all duration-300 flex-col hidden lg:flex shadow-xl",
          collapsed ? "w-20" : "w-72"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-border bg-gradient-to-r from-emerald-500/5 to-teal-500/5">
          {!collapsed ? (
            <button 
              onClick={() => navigate("/")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity w-full"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <div className="text-right">
                <span className="font-bold text-lg text-foreground block">ماركيتلي</span>
                <span className="text-[10px] text-muted-foreground">منصة التسويق الذكية</span>
              </div>
            </button>
          ) : (
            <button 
              onClick={() => navigate("/")}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto hover:opacity-80 transition-opacity shadow-lg"
            >
              <Rocket className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {/* Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -left-3 top-8 w-6 h-6 rounded-full border border-border bg-card shadow-md hover:bg-muted z-10"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </Button>

        <SidebarContent 
          collapsed={collapsed} 
          userRole={userRole}
          userEmail={userEmail}
          userInitials={userInitials}
          handleLogout={handleLogout}
        />
      </aside>
    </>
  );
}
