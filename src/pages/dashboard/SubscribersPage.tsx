import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Mail, 
  Trash2, 
  Upload,
  Download,
  Filter,
  Users,
  UserPlus,
  UserMinus
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";

const subscribers = [
  {
    id: 1,
    name: "أحمد محمد",
    email: "ahmed@example.com",
    status: "نشط",
    subscribeDate: "2024-01-15",
    openRate: 85,
  },
  {
    id: 2,
    name: "فاطمة علي",
    email: "fatima@example.com",
    status: "نشط",
    subscribeDate: "2024-02-20",
    openRate: 72,
  },
  {
    id: 3,
    name: "محمد خالد",
    email: "mohamed@example.com",
    status: "غير نشط",
    subscribeDate: "2023-11-10",
    openRate: 15,
  },
  {
    id: 4,
    name: "سارة أحمد",
    email: "sara@example.com",
    status: "نشط",
    subscribeDate: "2024-03-05",
    openRate: 90,
  },
  {
    id: 5,
    name: "عمر حسن",
    email: "omar@example.com",
    status: "ملغي",
    subscribeDate: "2023-08-22",
    openRate: 0,
  },
  {
    id: 6,
    name: "نورة سعيد",
    email: "noura@example.com",
    status: "نشط",
    subscribeDate: "2024-02-28",
    openRate: 68,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "نشط":
      return "bg-green-100 text-green-700 border-green-200";
    case "غير نشط":
      return "bg-muted text-muted-foreground border-border";
    case "ملغي":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "";
  }
};

export default function SubscribersPage() {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          title="المشتركين" 
          description="إدارة قائمة المشتركين في النشرة البريدية"
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatsCard
              title="إجمالي المشتركين"
              value="12,847"
              change="+156 هذا الأسبوع"
              changeType="positive"
              icon={Users}
              iconColor="bg-primary/10 text-primary"
            />
            <StatsCard
              title="مشتركين جدد"
              value="847"
              change="+23% من الشهر الماضي"
              changeType="positive"
              icon={UserPlus}
              iconColor="bg-green-100 text-green-700"
            />
            <StatsCard
              title="إلغاء الاشتراك"
              value="52"
              change="-12% من الشهر الماضي"
              changeType="positive"
              icon={UserMinus}
              iconColor="bg-destructive/10 text-destructive"
            />
          </div>

          {/* Actions Bar */}
          <Card className="bg-card mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4 justify-between">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="بحث بالاسم أو البريد..." 
                      className="pr-10 w-full sm:w-80"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 ml-2" />
                    تصفية
                  </Button>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Upload className="w-4 h-4 ml-2" />
                    استيراد
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 ml-2" />
                    تصدير
                  </Button>
                  <Button className="bg-primary-gradient hover:opacity-90">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة مشترك
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscribers Table */}
          <Card className="bg-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead>المشترك</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>تاريخ الاشتراك</TableHead>
                    <TableHead>معدل الفتح</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-sm font-medium text-foreground">
                              {subscriber.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{subscriber.name}</p>
                            <p className="text-sm text-muted-foreground">{subscriber.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(subscriber.status)} variant="outline">
                          {subscriber.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {subscriber.subscribeDate}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${subscriber.openRate}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {subscriber.openRate}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 ml-2" />
                              إرسال بريد
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 ml-2" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
