import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowRight,
  Send,
  Eye,
  Save,
  Calendar,
  Users,
  Sparkles,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { emailTemplates } from "@/data/emailTemplates";
import { toast } from "@/hooks/use-toast";
import { EmailEditor, blocksToHtml, blocksToText } from "@/components/dashboard/EmailEditor";
import { useCampaigns } from "@/hooks/useCampaigns";
import { sanitizeHtml } from "@/lib/sanitize";

interface EmailBlock {
  id: string;
  type: "heading" | "text" | "button" | "divider" | "image" | "spacer";
  content: string;
  style?: Record<string, string>;
}

export default function NewCampaignPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');
  const editId = searchParams.get('edit');
  
  const { createCampaign, updateCampaign, getCampaign } = useCampaigns();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    recipients: "all",
  });
  
  const [emailBlocks, setEmailBlocks] = useState<EmailBlock[]>([]);
  const [previewHtml, setPreviewHtml] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (editId) {
        const campaign = await getCampaign(editId);
        if (campaign) {
          setFormData({
            name: campaign.title,
            subject: campaign.subject || "",
            recipients: "all",
          });
          const blocks = Array.isArray(campaign.content) ? campaign.content as EmailBlock[] : [];
          setEmailBlocks(blocks);
          setPreviewHtml(blocksToHtml(blocks));
        }
      } else if (templateId) {
        const template = emailTemplates.find(t => t.id === parseInt(templateId));
        if (template) {
          setFormData({
            name: `حملة - ${template.name}`,
            subject: template.subject,
            recipients: "all",
          });
          const initialBlocks: EmailBlock[] = [
            { id: "1", type: "heading", content: template.name },
            { id: "2", type: "text", content: template.description },
            { id: "3", type: "button", content: "اضغط هنا" },
          ];
          setEmailBlocks(initialBlocks);
          setPreviewHtml(blocksToHtml(initialBlocks));
        }
      }
    };
    loadData();
  }, [templateId, editId, getCampaign]);

  const handleBlocksChange = (blocks: EmailBlock[]) => {
    setEmailBlocks(blocks);
    setPreviewHtml(blocksToHtml(blocks));
  };

  const handleSend = async () => {
    if (!formData.name || !formData.subject) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    if (emailBlocks.length === 0) {
      toast({
        title: "خطأ",
        description: "يرجى إضافة محتوى للرسالة",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      if (editId) {
        await updateCampaign(editId, {
          title: formData.name,
          subject: formData.subject,
          content: emailBlocks,
          status: 'sent',
        });
      } else {
        await createCampaign({
          title: formData.name,
          subject: formData.subject,
          content: emailBlocks,
          status: 'sent',
        });
      }
      
      toast({
        title: "تم إرسال الحملة بنجاح! 🎉",
        description: "سيتم إرسال الرسائل للمشتركين المحددين",
      });
      
      setTimeout(() => navigate('/dashboard/campaigns'), 1500);
    } catch (error) {
      console.error('Error sending campaign:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!formData.name) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم الحملة",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      if (editId) {
        await updateCampaign(editId, {
          title: formData.name,
          subject: formData.subject,
          content: emailBlocks,
          status: 'draft',
        });
      } else {
        await createCampaign({
          title: formData.name,
          subject: formData.subject,
          content: emailBlocks,
          status: 'draft',
        });
      }
      
      toast({
        title: "تم حفظ المسودة",
        description: "يمكنك متابعة التعديل لاحقاً",
      });
      
      navigate('/dashboard/campaigns');
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSchedule = async () => {
    if (!formData.name || !formData.subject) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const scheduledAt = new Date();
      scheduledAt.setDate(scheduledAt.getDate() + 1);
      
      if (editId) {
        await updateCampaign(editId, {
          title: formData.name,
          subject: formData.subject,
          content: emailBlocks,
          status: 'scheduled',
          scheduled_at: scheduledAt.toISOString(),
        });
      } else {
        await createCampaign({
          title: formData.name,
          subject: formData.subject,
          content: emailBlocks,
          status: 'scheduled',
          scheduled_at: scheduledAt.toISOString(),
        });
      }
      
      toast({
        title: "تم جدولة الحملة",
        description: "سيتم إرسال الحملة في الموعد المحدد",
      });
      
      navigate('/dashboard/campaigns');
    } catch (error) {
      console.error('Error scheduling campaign:', error);
    } finally {
      setSaving(false);
    }
  };

  const getRecipientsCount = () => {
    switch (formData.recipients) {
      case "all": return "12,847";
      case "active": return "10,234";
      case "new": return "847";
      case "inactive": return "1,766";
      default: return "0";
    }
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          title="حملة جديدة" 
          description="إنشاء وإرسال حملة بريدية جديدة"
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate('/dashboard/campaigns')}
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة للحملات
          </Button>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Editor Section */}
            <div className="space-y-6">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-secondary" />
                    تفاصيل الحملة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">اسم الحملة *</Label>
                    <Input 
                      id="name"
                      placeholder="مثال: عرض رمضان المميز"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">عنوان البريد *</Label>
                    <Input 
                      id="subject"
                      placeholder="مثال: 🔥 عرض حصري لك!"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipients">المستلمون</Label>
                    <Select 
                      value={formData.recipients}
                      onValueChange={(value) => setFormData({...formData, recipients: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المستلمين" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">جميع المشتركين (12,847)</SelectItem>
                        <SelectItem value="active">المشتركين النشطين (10,234)</SelectItem>
                        <SelectItem value="new">المشتركين الجدد (847)</SelectItem>
                        <SelectItem value="inactive">غير النشطين (1,766)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Visual Email Editor */}
              <div>
                <h3 className="text-lg font-semibold mb-4">محتوى الرسالة</h3>
                <EmailEditor 
                  onContentChange={handleBlocksChange}
                  initialBlocks={emailBlocks}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button 
                  className="bg-primary-gradient hover:opacity-90 flex-1"
                  onClick={handleSend}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 ml-2" />
                  )}
                  {editId ? 'تحديث وإرسال' : 'إرسال الآن'}
                </Button>
                <Button variant="outline" onClick={handleSchedule} disabled={saving}>
                  <Calendar className="w-4 h-4 ml-2" />
                  جدولة
                </Button>
                <Button variant="outline" onClick={handleSaveDraft} disabled={saving}>
                  <Save className="w-4 h-4 ml-2" />
                  حفظ كمسودة
                </Button>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              <Card className="bg-card sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-primary" />
                      معاينة الرسالة
                    </span>
                    <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {getRecipientsCount()} مستلم
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Email Preview Frame */}
                  <div className="border border-border rounded-lg overflow-hidden">
                    {/* Email Header */}
                    <div className="bg-muted p-3 border-b border-border">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">من:</span>
                        <span className="text-foreground">رسائل برو &lt;noreply@rasaelpro.com&gt;</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <span className="text-muted-foreground">الموضوع:</span>
                        <span className="text-foreground font-medium">
                          {formData.subject || "عنوان البريد..."}
                        </span>
                      </div>
                    </div>
                    
                    {/* Email Body */}
                    <div className="bg-white p-6 min-h-[400px] max-h-[600px] overflow-y-auto" dir="rtl">
                      {previewHtml ? (
                        <div 
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(`
                            <div style="font-family: 'Cairo', Arial, sans-serif; direction: rtl; max-width: 600px; margin: 0 auto;">
                              ${previewHtml}
                            </div>
                          `) }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                          <p>أضف محتوى للرسالة لمعاينته</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Text Preview */}
                  {emailBlocks.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">النص العادي:</p>
                      <div className="bg-muted p-3 rounded-lg text-sm whitespace-pre-wrap max-h-[150px] overflow-y-auto">
                        {blocksToText(emailBlocks)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
