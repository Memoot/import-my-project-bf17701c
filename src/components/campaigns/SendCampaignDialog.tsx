import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, Users, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Campaign } from '@/hooks/useCampaigns';
import { Subscriber } from '@/hooks/useSubscribers';
import { useUsageLimits } from '@/hooks/useUsageLimits';
import { UpgradeModal } from '@/components/subscription/UpgradeModal';

interface SendCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Campaign | null;
  subscribers: Subscriber[];
  onSent?: () => void;
}

export function SendCampaignDialog({ 
  open, 
  onOpenChange, 
  campaign, 
  subscribers,
  onSent 
}: SendCampaignDialogProps) {
  const [fromEmail, setFromEmail] = useState('');
  const [fromName, setFromName] = useState('');
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { checkLimit, incrementUsage } = useUsageLimits();
  const [result, setResult] = useState<{
    success: boolean;
    sent: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const activeSubscribers = subscribers.filter(s => s.status === 'active');

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedSubscribers([]);
    }
  };

  const handleSelectSubscriber = (id: string, checked: boolean) => {
    setSelectAll(false);
    if (checked) {
      setSelectedSubscribers(prev => [...prev, id]);
    } else {
      setSelectedSubscribers(prev => prev.filter(s => s !== id));
    }
  };

  const getSelectedCount = () => {
    if (selectAll) return activeSubscribers.length;
    return selectedSubscribers.length;
  };

  const handleSend = async () => {
    if (!campaign || !fromEmail) return;

    const count = getSelectedCount();
    if (count === 0) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار مشترك واحد على الأقل',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Check usage limit before sending
      const limitCheck = await checkLimit('send_email');
      
      if (!limitCheck.allowed) {
        setShowUpgradeModal(true);
        setLoading(false);
        return;
      }

      if (limitCheck.warning) {
        toast({
          title: 'تنبيه',
          description: limitCheck.message || 'اقتربت من الحد الأقصى',
          variant: 'default',
        });
      }

      // Convert campaign content blocks to HTML
      const htmlContent = campaign.content
        .map((block: any) => {
          switch (block.type) {
            case 'heading':
              return `<h2 style="margin: 0 0 16px; font-size: 24px; font-weight: bold;">${block.content}</h2>`;
            case 'text':
              return `<p style="margin: 0 0 16px; line-height: 1.6;">${block.content}</p>`;
            case 'button':
              return `<a href="${block.url || '#'}" style="display: inline-block; padding: 12px 24px; background: #6366f1; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">${block.content}</a>`;
            case 'image':
              return `<img src="${block.content}" alt="" style="max-width: 100%; height: auto; margin: 16px 0;" />`;
            case 'divider':
              return `<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />`;
            default:
              return `<p>${block.content}</p>`;
          }
        })
        .join('\n');

      const wrappedHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f4f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    ${htmlContent}
  </div>
</body>
</html>`;

      const textContent = campaign.content
        .filter((block: any) => ['heading', 'text'].includes(block.type))
        .map((block: any) => block.content)
        .join('\n\n');

      const { data, error } = await supabase.functions.invoke('send-campaign', {
        body: {
          campaignId: campaign.id,
          subject: campaign.subject || campaign.title,
          htmlContent: wrappedHtml,
          textContent,
          fromEmail,
          fromName,
          subscriberIds: selectAll ? undefined : selectedSubscribers,
        },
      });

      if (error) throw error;

      setResult({
        success: true,
        sent: data.results.sent,
        failed: data.results.failed,
        errors: data.results.errors,
      });

      if (data.results.sent > 0) {
        // Increment usage after successful send
        await incrementUsage('emails_sent', data.results.sent);
        
        toast({
          title: 'تم إرسال الحملة',
          description: `تم إرسال ${data.results.sent} رسالة بنجاح`,
        });
        onSent?.();
      }

    } catch (error: any) {
      console.error('Error sending campaign:', error);
      toast({
        title: 'خطأ في إرسال الحملة',
        description: error.message,
        variant: 'destructive',
      });
      setResult({
        success: false,
        sent: 0,
        failed: 0,
        errors: [error.message],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    setFromEmail('');
    setFromName('');
    setSelectedSubscribers([]);
    setSelectAll(true);
    onOpenChange(false);
  };

  return (
    <>
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            إرسال الحملة
          </DialogTitle>
          <DialogDescription>
            {campaign?.title}
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="py-6 text-center">
            {result.success && result.sent > 0 ? (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">تم الإرسال بنجاح!</h3>
                <p className="text-muted-foreground mb-4">
                  تم إرسال {result.sent} رسالة
                  {result.failed > 0 && ` (${result.failed} فشل)`}
                </p>
              </>
            ) : (
              <>
                <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">حدث خطأ</h3>
                <p className="text-muted-foreground mb-4">
                  {result.errors[0] || 'فشل في إرسال الحملة'}
                </p>
              </>
            )}
            <Button onClick={handleClose}>إغلاق</Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fromEmail">البريد المرسل *</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  placeholder="noreply@yourdomain.com"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  dir="ltr"
                />
                <p className="text-xs text-muted-foreground">
                  يجب أن يكون بريد مُتحقق منه في Amazon SES
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromName">اسم المرسل (اختياري)</Label>
                <Input
                  id="fromName"
                  type="text"
                  placeholder="اسم شركتك"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>المشتركين</Label>
                  <Badge variant="outline">
                    <Users className="h-3 w-3 ml-1" />
                    {getSelectedCount()} مشترك
                  </Badge>
                </div>

                <div className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b">
                    <Checkbox
                      id="selectAll"
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                    />
                    <label htmlFor="selectAll" className="text-sm font-medium cursor-pointer">
                      جميع المشتركين النشطين ({activeSubscribers.length})
                    </label>
                  </div>

                  {!selectAll && (
                    <ScrollArea className="h-48">
                      <div className="space-y-2">
                        {activeSubscribers.map((subscriber) => (
                          <div key={subscriber.id} className="flex items-center gap-2">
                            <Checkbox
                              id={subscriber.id}
                              checked={selectedSubscribers.includes(subscriber.id)}
                              onCheckedChange={(checked) => 
                                handleSelectSubscriber(subscriber.id, checked as boolean)
                              }
                            />
                            <label htmlFor={subscriber.id} className="text-sm cursor-pointer flex-1">
                              <span className="font-medium">{subscriber.name || 'بدون اسم'}</span>
                              <span className="text-muted-foreground mr-2" dir="ltr">
                                ({subscriber.email})
                              </span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={handleClose}>
                إلغاء
              </Button>
              <Button 
                onClick={handleSend} 
                disabled={loading || !fromEmail || getSelectedCount() === 0}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-1" />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 ml-1" />
                    إرسال ({getSelectedCount()})
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>

    <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
    </>
  );
}
