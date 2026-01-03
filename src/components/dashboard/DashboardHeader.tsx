import { Bell, Search, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  title: string;
  description?: string;
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-card border-b border-border px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1 lg:flex-none pr-12 lg:pr-0">
          <h1 className="text-xl lg:text-2xl font-bold text-foreground truncate">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1 text-sm lg:text-base truncate">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
          {/* Search - Desktop Only */}
          <div className="relative hidden lg:block">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="بحث..." 
              className="pr-10 w-64 bg-background"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          {/* New Campaign - Hide text on mobile */}
          <Button 
            className="bg-primary-gradient hover:opacity-90"
            onClick={() => navigate('/dashboard/campaigns/new')}
          >
            <Plus className="w-4 h-4 lg:ml-2" />
            <span className="hidden lg:inline">حملة جديدة</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
