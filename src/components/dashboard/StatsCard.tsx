import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export function StatsCard({ title, value, change, changeType, icon: Icon, iconColor = "bg-gradient-to-br from-emerald-500 to-teal-500" }: StatsCardProps) {
  return (
    <Card className="bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md overflow-hidden group">
      <CardContent className="p-4 sm:p-6 relative">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500" />
        
        <div className="flex items-start justify-between relative gap-2">
          <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{value}</p>
            <div className={cn(
              "flex items-center gap-1 text-xs sm:text-sm font-medium",
              changeType === "positive" && "text-emerald-600",
              changeType === "negative" && "text-red-500",
              changeType === "neutral" && "text-muted-foreground"
            )}>
              {changeType === "positive" && <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />}
              {changeType === "negative" && <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />}
              <span className="truncate">{change}</span>
            </div>
          </div>
          <div className={cn(
            "w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0",
            iconColor
          )}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
