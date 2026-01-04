import { ReactNode } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Crown, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ProtectedFeatureProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgrade?: boolean;
}

export function ProtectedFeature({ 
  feature, 
  children, 
  fallback,
  showUpgrade = true 
}: ProtectedFeatureProps) {
  const { checkPermission, isLoading, plan } = usePermissions();
  const permission = checkPermission(feature);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!permission.allowed) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (!showUpgrade) {
      return null;
    }

    return (
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <Lock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-base">ميزة مقفلة</CardTitle>
              <CardDescription>{permission.reason}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Link to="/dashboard/pricing">
            <Button size="sm" className="gap-2">
              <Crown className="h-4 w-4" />
              ترقية الخطة
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}

interface ProtectedButtonProps {
  feature: string;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
}

export function ProtectedButton({
  feature,
  children,
  onClick,
  className,
  variant = "default",
  size = "default",
  disabled = false,
}: ProtectedButtonProps) {
  const { checkPermission, isLoading } = usePermissions();
  const permission = checkPermission(feature);

  if (isLoading) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (!permission.allowed) {
    return (
      <Link to="/dashboard/pricing">
        <Button variant="outline" size={size} className={`${className} gap-2`}>
          <Lock className="h-4 w-4" />
          ترقية للوصول
        </Button>
      </Link>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}
