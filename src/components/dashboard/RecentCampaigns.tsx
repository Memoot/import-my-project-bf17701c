import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const campaigns = [
  {
    id: 1,
    name: "عرض رمضان المميز",
    status: "نشطة",
    sent: 12500,
    opened: 8750,
    clicked: 3200,
    date: "2024-03-15",
  },
  {
    id: 2,
    name: "نشرة أسبوعية - العدد 42",
    status: "مكتملة",
    sent: 8900,
    opened: 5340,
    clicked: 1780,
    date: "2024-03-12",
  },
  {
    id: 3,
    name: "تحديث المنتجات الجديدة",
    status: "مسودة",
    sent: 0,
    opened: 0,
    clicked: 0,
    date: "2024-03-10",
  },
  {
    id: 4,
    name: "عرض العودة للمدارس",
    status: "مجدولة",
    sent: 0,
    opened: 0,
    clicked: 0,
    date: "2024-03-20",
  },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "نشطة":
      return "default";
    case "مكتملة":
      return "secondary";
    case "مسودة":
      return "outline";
    case "مجدولة":
      return "default";
    default:
      return "default";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "نشطة":
      return "bg-green-100 text-green-700 border-green-200";
    case "مكتملة":
      return "bg-primary/10 text-primary border-primary/20";
    case "مسودة":
      return "bg-muted text-muted-foreground border-border";
    case "مجدولة":
      return "bg-secondary/10 text-secondary border-secondary/20";
    default:
      return "";
  }
};

export function RecentCampaigns() {
  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg font-semibold">آخر الحملات</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary text-xs sm:text-sm">
          عرض الكل
        </Button>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="space-y-3 sm:space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="flex items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-background hover:bg-muted/50 transition-colors gap-2"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h4 className="font-medium text-foreground text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">{campaign.name}</h4>
                  <Badge className={`${getStatusColor(campaign.status)} text-xs`} variant="outline">
                    {campaign.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-muted-foreground">
                  <span>مرسلة: {campaign.sent.toLocaleString('ar-EG')}</span>
                  <span className="hidden xs:inline">مفتوحة: {campaign.opened.toLocaleString('ar-EG')}</span>
                  <span className="hidden sm:inline">نقرات: {campaign.clicked.toLocaleString('ar-EG')}</span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover">
                  <DropdownMenuItem>
                    <Eye className="w-4 h-4 ml-2" />
                    عرض
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 ml-2" />
                    تعديل
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="w-4 h-4 ml-2" />
                    حذف
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
