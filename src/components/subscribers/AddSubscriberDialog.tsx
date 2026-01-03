import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Loader2 } from 'lucide-react';
import { useUsageLimits } from '@/hooks/useUsageLimits';
import { UpgradeModal } from '@/components/subscription/UpgradeModal';
import { toast } from '@/hooks/use-toast';

interface AddSubscriberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: { email: string; name?: string }) => Promise<any>;
}

export function AddSubscriberDialog({ open, onOpenChange, onAdd }: AddSubscriberDialogProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { checkLimit, incrementUsage } = useUsageLimits();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);

    try {
      // Check usage limit before adding
      const limitCheck = await checkLimit('add_subscriber');
      
      if (!limitCheck.allowed) {
        setShowUpgradeModal(true);
        setLoading(false);
        return;
      }

      if (limitCheck.warning) {
        toast({
          title: 'تنبيه',
          description: `${limitCheck.message} (${limitCheck.percent}%)`,
          variant: 'default',
        });
      }

      const result = await onAdd({ email: email.trim(), name: name.trim() || undefined });

      if (result) {
        // Increment usage after successful add
        await incrementUsage('subscribers_count');
        setEmail('');
        setName('');
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error adding subscriber:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              إضافة مشترك جديد
            </DialogTitle>
            <DialogDescription>
              أضف مشتركاً جديداً إلى قائمتك البريدية
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">الاسم (اختياري)</Label>
              <Input
                id="name"
                type="text"
                placeholder="اسم المشترك"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                إلغاء
              </Button>
              <Button type="submit" disabled={loading || !email.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-1" />
                    جاري الإضافة...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 ml-1" />
                    إضافة
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
    </>
  );
}
