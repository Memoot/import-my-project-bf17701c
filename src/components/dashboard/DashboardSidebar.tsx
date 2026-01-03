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
  Key
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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
  { title: "مفاتيح API", url: "/dashboard/admin/api-keys", icon: Key },
  { title: "إدارة الإعلانات", url: "/dashboard/admin/ads", icon: Megaphone },
  { title: "تقارير الإعلانات", url: "/dashboard/admin/ads-reports", icon: BarChart3 },
  { title: "إدارة القوالب", url: "/dashboard/admin/templates", icon: Upload },
  { title: "رفع قوالب جاهزة", url: "/dashboard/admin/upload-templates", icon: FileArchive },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
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
    <aside 
      className={cn(
        "bg-card border-l border-border h-screen sticky top-0 transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo - Clickable to go home */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">ماركيتلي</span>
          </button>
        )}
        {collapsed && (
          <button 
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center mx-auto hover:opacity-80 transition-opacity"
          >
            <Mail className="w-5 h-5 text-primary-foreground" />
          </button>
        )}
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -left-3 top-6 w-6 h-6 rounded-full border border-border bg-card shadow-sm hover:bg-muted"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </Button>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === "/dashboard"}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
              collapsed && "justify-center px-2"
            )}
            activeClassName="bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary font-medium"
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}

        {/* Admin Section */}
        {userRole?.isAdmin && (
          <>
            <div className={cn("pt-4 pb-2", collapsed && "hidden")}>
              <span className="text-xs font-medium text-muted-foreground px-3">الإدارة</span>
            </div>
            {adminItems.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
                  collapsed && "justify-center px-2"
                )}
                activeClassName="bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary font-medium"
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        <div className={cn(
          "flex items-center gap-3",
          collapsed && "justify-center"
        )}>
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-foreground">{userInitials}</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {userRole?.isAdmin ? "مدير" : "مستخدم"}
              </p>
              <p className="text-xs text-muted-foreground truncate">{userEmail || "..."}</p>
            </div>
          )}
          {!collapsed && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="flex-shrink-0 text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
