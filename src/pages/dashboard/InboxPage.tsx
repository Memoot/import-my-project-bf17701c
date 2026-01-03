import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  MoreHorizontal, 
  Reply, 
  Trash2, 
  Star,
  StarOff,
  Archive,
  Mail,
  MailOpen,
  Inbox as InboxIcon
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { useState } from "react";
import { cn } from "@/lib/utils";

const inboxMessages = [
  {
    id: 1,
    from: "أحمد محمد",
    email: "ahmed@example.com",
    subject: "استفسار عن خطة الأعمال",
    preview: "مرحباً، أود الاستفسار عن مميزات خطة الأعمال وإمكانية الترقية من الخطة الحالية...",
    date: "منذ ساعة",
    isRead: false,
    isStarred: true,
  },
  {
    id: 2,
    from: "سارة علي",
    email: "sara@example.com",
    subject: "مشكلة في إرسال الحملة",
    preview: "واجهت مشكلة أثناء إرسال الحملة الأخيرة، يظهر لي خطأ في التحقق من البريد...",
    date: "منذ 3 ساعات",
    isRead: false,
    isStarred: false,
  },
  {
    id: 3,
    from: "محمد خالد",
    email: "mohamed@example.com",
    subject: "شكر وتقدير",
    preview: "أود أن أشكركم على الخدمة الممتازة، ساعدتني المنصة كثيراً في تنمية عملي...",
    date: "أمس",
    isRead: true,
    isStarred: true,
  },
  {
    id: 4,
    from: "فاطمة حسن",
    email: "fatima@example.com",
    subject: "طلب استرداد",
    preview: "أرجو النظر في طلب استرداد الاشتراك الشهري حيث لم أستخدم الخدمة...",
    date: "منذ يومين",
    isRead: true,
    isStarred: false,
  },
  {
    id: 5,
    from: "عمر سعيد",
    email: "omar@example.com",
    subject: "اقتراح ميزة جديدة",
    preview: "لدي اقتراح لإضافة ميزة جدولة الرسائل المتكررة تلقائياً...",
    date: "منذ 3 أيام",
    isRead: true,
    isStarred: false,
  },
];

export default function InboxPage() {
  const [messages, setMessages] = useState(inboxMessages);
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);

  const toggleStar = (id: number) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, isStarred: !msg.isStarred } : msg
    ));
  };

  const markAsRead = (id: number) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, isRead: true } : msg
    ));
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          title="البريد الوارد" 
          description="الرسائل الواردة من المشتركين"
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatsCard
              title="إجمالي الرسائل"
              value="156"
              change="هذا الشهر"
              changeType="neutral"
              icon={InboxIcon}
              iconColor="bg-primary/10 text-primary"
            />
            <StatsCard
              title="غير مقروءة"
              value="12"
              change="تحتاج للرد"
              changeType="negative"
              icon={Mail}
              iconColor="bg-secondary/10 text-secondary"
            />
            <StatsCard
              title="مميزة بنجمة"
              value="8"
              change="رسائل مهمة"
              changeType="neutral"
              icon={Star}
              iconColor="bg-yellow-100 text-yellow-600"
            />
          </div>

          {/* Actions Bar */}
          <Card className="bg-card mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox />
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="بحث في الرسائل..." 
                      className="pr-10 w-full sm:w-80"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Archive className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <MailOpen className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages List */}
          <Card className="bg-card">
            <CardContent className="p-0 divide-y divide-border">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors",
                    !message.isRead && "bg-primary/5",
                    selectedMessage === message.id && "bg-muted"
                  )}
                  onClick={() => {
                    setSelectedMessage(message.id);
                    markAsRead(message.id);
                  }}
                >
                  <Checkbox 
                    onClick={(e) => e.stopPropagation()}
                  />
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(message.id);
                    }}
                    className="flex-shrink-0"
                  >
                    {message.isStarred ? (
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    ) : (
                      <StarOff className="w-5 h-5 text-muted-foreground hover:text-yellow-500" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-medium",
                          !message.isRead ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {message.from}
                        </span>
                        {!message.isRead && (
                          <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline">
                            جديد
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground flex-shrink-0">
                        {message.date}
                      </span>
                    </div>
                    
                    <p className={cn(
                      "text-sm mb-1",
                      !message.isRead ? "font-medium text-foreground" : "text-muted-foreground"
                    )}>
                      {message.subject}
                    </p>
                    
                    <p className="text-sm text-muted-foreground truncate">
                      {message.preview}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Reply className="w-4 h-4 ml-2" />
                        رد
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Archive className="w-4 h-4 ml-2" />
                        أرشفة
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 ml-2" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
