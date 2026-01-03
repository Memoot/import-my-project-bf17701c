import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PenSquare, 
  UserPlus, 
  FileText, 
  Upload,
  Sparkles
} from "lucide-react";

const actions = [
  {
    icon: PenSquare,
    title: "إنشاء حملة",
    description: "أنشئ حملة بريدية جديدة",
    color: "bg-primary/10 text-primary hover:bg-primary/20",
  },
  {
    icon: UserPlus,
    title: "إضافة مشترك",
    description: "أضف مشتركين جدد",
    color: "bg-secondary/10 text-secondary hover:bg-secondary/20",
  },
  {
    icon: FileText,
    title: "قالب جديد",
    description: "صمم قالب بريد إلكتروني",
    color: "bg-accent/10 text-accent hover:bg-accent/20",
  },
  {
    icon: Upload,
    title: "استيراد جهات اتصال",
    description: "استورد قائمة المشتركين",
    color: "bg-green-100 text-green-700 hover:bg-green-200",
  },
];

export function QuickActions() {
  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-secondary" />
          <CardTitle className="text-lg font-semibold">إجراءات سريعة</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="ghost"
              className={`h-auto flex-col items-start p-4 ${action.color} transition-colors`}
            >
              <action.icon className="w-6 h-6 mb-2" />
              <span className="font-medium">{action.title}</span>
              <span className="text-xs opacity-70 mt-1">{action.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
