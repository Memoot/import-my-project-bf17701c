import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface UsageBarProps {
  label: string;
  current: number;
  limit: number | null;
  className?: string;
}

export function UsageBar({ label, current, limit, className }: UsageBarProps) {
  const isUnlimited = limit === null;
  const percent = isUnlimited ? 0 : Math.min((current / limit) * 100, 100);
  
  const getColorClass = () => {
    if (isUnlimited) return "bg-primary";
    if (percent >= 100) return "bg-destructive";
    if (percent >= 80) return "bg-warning";
    return "bg-primary";
  };

  const formatValue = (value: number | null) => {
    if (value === null) return "∞";
    return value.toLocaleString("ar-SA");
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {formatValue(current)} / {formatValue(limit)}
        </span>
      </div>
      <div className="relative">
        <Progress 
          value={isUnlimited ? 100 : percent} 
          className={cn(
            "h-2",
            isUnlimited && "[&>div]:bg-primary/30"
          )}
        />
        <div 
          className={cn("absolute top-0 h-2 rounded-full transition-all", getColorClass())}
          style={{ width: `${isUnlimited ? 100 : percent}%` }}
        />
      </div>
      {!isUnlimited && percent >= 80 && percent < 100 && (
        <p className="text-xs text-warning">اقتربت من الحد الأقصى ({Math.round(percent)}%)</p>
      )}
      {!isUnlimited && percent >= 100 && (
        <p className="text-xs text-destructive">تم الوصول للحد الأقصى</p>
      )}
    </div>
  );
}
