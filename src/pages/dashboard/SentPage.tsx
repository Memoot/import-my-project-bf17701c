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
  Search, 
  MoreHorizontal, 
  Eye, 
  Trash2, 
  Filter,
  Send,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";

const sentEmails = [
  {
    id: 1,
    subject: "عرض رمضان المميز - خصم 50%",
    campaign: "عرض رمضان",
    recipients: 12500,
    delivered: 12350,
    failed: 150,
    status: "مكتمل",
    sentAt: "2024-03-15 10:30",
  },
  {
    id: 2,
    subject: "نشرة أسبوعية - أحدث المقالات",
    campaign: "النشرة الأسبوعية",
    recipients: 8900,
    delivered: 8850,
    failed: 50,
    status: "مكتمل",
    sentAt: "2024-03-12 09:00",
  },
  {
    id: 3,
    subject: "مرحباً بك في رسائل برو",
    campaign: "ترحيب المشتركين",
    recipients: 450,
    delivered: 448,
    failed: 2,
    status: "مكتمل",
    sentAt: "2024-03-18 14:15",
  },
  {
    id: 4,
    subject: "تحديث سياسة الخصوصية",
    campaign: "إشعارات النظام",
    recipients: 15000,
    delivered: 10500,
    failed: 0,
    status: "قيد الإرسال",
    sentAt: "2024-03-19 08:00",
  },
  {
    id: 5,
    subject: "تذكير: العرض ينتهي غداً",
    campaign: "عرض رمضان",
    recipients: 5000,
    delivered: 4980,
    failed: 20,
    status: "مكتمل",
    sentAt: "2024-03-17 16:00",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "مكتمل":
      return <CheckCircle className="w-4 h-4" />;
    case "قيد الإرسال":
      return <RefreshCw className="w-4 h-4 animate-spin" />;
    case "فشل":
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "مكتمل":
      return "bg-green-100 text-green-700 border-green-200";
    case "قيد الإرسال":
      return "bg-secondary/10 text-secondary border-secondary/20";
    case "فشل":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export default function SentPage() {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          title="الرسائل المرسلة" 
          description="سجل جميع الرسائل البريدية المرسلة"
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <StatsCard
              title="إجمالي المرسل"
              value="48,293"
              change="هذا الشهر"
              changeType="neutral"
              icon={Send}
              iconColor="bg-primary/10 text-primary"
            />
            <StatsCard
              title="تم التوصيل"
              value="47,128"
              change="97.6% معدل التوصيل"
              changeType="positive"
              icon={CheckCircle}
              iconColor="bg-green-100 text-green-700"
            />
            <StatsCard
              title="فشل التوصيل"
              value="222"
              change="0.5% من الإجمالي"
              changeType="negative"
              icon={XCircle}
              iconColor="bg-destructive/10 text-destructive"
            />
            <StatsCard
              title="قيد الإرسال"
              value="4,500"
              change="3 حملات نشطة"
              changeType="neutral"
              icon={Clock}
              iconColor="bg-secondary/10 text-secondary"
            />
          </div>

          {/* Actions Bar */}
          <Card className="bg-card mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="بحث في الرسائل المرسلة..." 
                      className="pr-10 w-full sm:w-80"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 ml-2" />
                    تصفية
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sent Emails Table */}
          <Card className="bg-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead>الموضوع</TableHead>
                    <TableHead>الحملة</TableHead>
                    <TableHead>المستلمين</TableHead>
                    <TableHead>التوصيل</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sentEmails.map((email) => (
                    <TableRow key={email.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-foreground">{email.subject}</p>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {email.campaign}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {email.recipients.toLocaleString('ar-EG')}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-green-600 text-sm">
                            ✓ {email.delivered.toLocaleString('ar-EG')}
                          </span>
                          {email.failed > 0 && (
                            <span className="text-destructive text-sm">
                              ✗ {email.failed.toLocaleString('ar-EG')}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(email.status)} variant="outline">
                          {getStatusIcon(email.status)}
                          <span className="mr-1">{email.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {email.sentAt}
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
                              <Eye className="w-4 h-4 ml-2" />
                              عرض التفاصيل
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="w-4 h-4 ml-2" />
                              إعادة الإرسال
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
