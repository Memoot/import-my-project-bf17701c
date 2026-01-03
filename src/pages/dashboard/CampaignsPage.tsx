import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Eye, 
  Edit, 
  Trash2, 
  Copy,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Send
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCampaigns, Campaign } from "@/hooks/useCampaigns";
import { useSubscribers } from "@/hooks/useSubscribers";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { SendCampaignDialog } from "@/components/campaigns/SendCampaignDialog";

const getStatusLabel = (status: string) => {
  switch (status) {
    case "sent": return "مرسلة";
    case "draft": return "مسودة";
    case "scheduled": return "مجدولة";
    default: return status;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "sent":
      return <CheckCircle className="w-4 h-4" />;
    case "draft":
      return <XCircle className="w-4 h-4" />;
    case "scheduled":
      return <Clock className="w-4 h-4" />;
    default:
      return <Mail className="w-4 h-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "sent":
      return "bg-green-100 text-green-700 border-green-200";
    case "draft":
      return "bg-muted text-muted-foreground border-border";
    case "scheduled":
      return "bg-secondary/10 text-secondary border-secondary/20";
    default:
      return "";
  }
};

export default function CampaignsPage() {
  const navigate = useNavigate();
  const { campaigns, loading, deleteCampaign, createCampaign, fetchCampaigns } = useCampaigns();
  const { subscribers } = useSubscribers();
  const [searchQuery, setSearchQuery] = useState("");
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const filteredCampaigns = campaigns.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.subject && c.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDelete = async (id: string) => {
    await deleteCampaign(id);
  };

  const handleDuplicate = async (campaign: Campaign) => {
    const result = await createCampaign({
      title: `نسخة من ${campaign.title}`,
      subject: campaign.subject || undefined,
      content: campaign.content,
      status: 'draft',
    });
    
    if (result) {
      toast({
        title: "تم نسخ الحملة",
        description: "تم إنشاء نسخة من الحملة بنجاح",
      });
    }
  };

  const handleSendCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setSendDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          title="الحملات" 
          description="إدارة جميع حملاتك البريدية"
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="بحث في الحملات..." 
                className="pr-10 w-full sm:w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              className="bg-primary-gradient hover:opacity-90"
              onClick={() => navigate('/dashboard/campaigns/new')}
            >
              <Plus className="w-4 h-4 ml-2" />
              حملة جديدة
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Mail className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg">لا توجد حملات</p>
              <p className="text-sm">ابدأ بإنشاء حملتك الأولى</p>
              <Button 
                className="mt-4 bg-primary-gradient"
                onClick={() => navigate('/dashboard/campaigns/new')}
              >
                <Plus className="w-4 h-4 ml-2" />
                حملة جديدة
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign) => (
                <Card key={campaign.id} className="bg-card hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-semibold truncate">
                        {campaign.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(campaign.created_at)}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="flex-shrink-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/campaigns/new?edit=${campaign.id}`)}>
                          <Eye className="w-4 h-4 ml-2" />
                          عرض
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/campaigns/new?edit=${campaign.id}`)}>
                          <Edit className="w-4 h-4 ml-2" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(campaign)}>
                          <Copy className="w-4 h-4 ml-2" />
                          نسخ
                        </DropdownMenuItem>
                        {campaign.status !== 'sent' && (
                          <DropdownMenuItem onClick={() => handleSendCampaign(campaign)}>
                            <Send className="w-4 h-4 ml-2" />
                            إرسال
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(campaign.id)}
                        >
                          <Trash2 className="w-4 h-4 ml-2" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <Badge className={`${getStatusColor(campaign.status)} mb-4`} variant="outline">
                      {getStatusIcon(campaign.status)}
                      <span className="mr-1">{getStatusLabel(campaign.status)}</span>
                    </Badge>

                    {campaign.subject && (
                      <p className="text-sm text-muted-foreground truncate mb-2">
                        الموضوع: {campaign.subject}
                      </p>
                    )}

                    <div className="text-xs text-muted-foreground">
                      {campaign.status === 'scheduled' && campaign.scheduled_at && (
                        <p>مجدولة في: {formatDate(campaign.scheduled_at)}</p>
                      )}
                      {campaign.status === 'sent' && campaign.sent_at && (
                        <p>أرسلت في: {formatDate(campaign.sent_at)}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>

        <SendCampaignDialog
          open={sendDialogOpen}
          onOpenChange={setSendDialogOpen}
          campaign={selectedCampaign}
          subscribers={subscribers}
          onSent={fetchCampaigns}
        />
      </div>
    </div>
  );
}
