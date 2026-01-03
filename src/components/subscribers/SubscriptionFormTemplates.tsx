import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Eye, Code, Palette, Layout, Sparkles, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  style: 'minimal' | 'modern' | 'classic' | 'gradient';
  preview: string;
}

const formTemplates: FormTemplate[] = [
  {
    id: 'minimal',
    name: 'النموذج البسيط',
    description: 'تصميم بسيط ونظيف مع حقل بريد فقط',
    style: 'minimal',
    preview: 'bg-background border rounded-lg p-6',
  },
  {
    id: 'modern',
    name: 'النموذج العصري',
    description: 'تصميم حديث مع تأثيرات متحركة',
    style: 'modern',
    preview: 'bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8',
  },
  {
    id: 'classic',
    name: 'النموذج الكلاسيكي',
    description: 'تصميم تقليدي مع حقول كاملة',
    style: 'classic',
    preview: 'bg-card shadow-lg rounded-md p-6 border-2',
  },
  {
    id: 'gradient',
    name: 'النموذج المتدرج',
    description: 'تصميم ملفت مع خلفية متدرجة',
    style: 'gradient',
    preview: 'bg-gradient-to-br from-primary to-primary/60 text-primary-foreground rounded-2xl p-8',
  },
];

interface SubscriptionFormTemplatesProps {
  userId: string;
}

export function SubscriptionFormTemplates({ userId }: SubscriptionFormTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [showCodeDialog, setShowCodeDialog] = useState(false);

  const generateEmbedCode = (template: FormTemplate) => {
    const baseUrl = window.location.origin;
    
    return `<!-- نموذج الاشتراك - ${template.name} -->
<div id="subscription-form-${template.id}"></div>
<script>
(function() {
  const container = document.getElementById('subscription-form-${template.id}');
  const userId = '${userId}';
  const style = '${template.style}';
  
  const styles = {
    minimal: 'background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:24px;font-family:system-ui;',
    modern: 'background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(168,85,247,0.1));border-radius:16px;padding:32px;font-family:system-ui;',
    classic: 'background:#fff;box-shadow:0 4px 6px rgba(0,0,0,0.1);border-radius:6px;padding:24px;border:2px solid #e5e7eb;font-family:Georgia,serif;',
    gradient: 'background:linear-gradient(135deg,#6366f1,rgba(99,102,241,0.6));color:#fff;border-radius:20px;padding:32px;font-family:system-ui;'
  };
  
  container.innerHTML = \`
    <form id="sub-form-${template.id}" style="\${styles[style]}max-width:400px;margin:0 auto;">
      <h3 style="margin:0 0 8px;font-size:1.25rem;font-weight:600;">انضم لقائمتنا البريدية</h3>
      <p style="margin:0 0 16px;opacity:0.8;font-size:0.875rem;">احصل على آخر التحديثات والعروض الحصرية</p>
      <input type="text" name="name" placeholder="الاسم (اختياري)" style="width:100%;padding:12px;margin-bottom:12px;border:1px solid #d1d5db;border-radius:6px;box-sizing:border-box;"/>
      <input type="email" name="email" placeholder="البريد الإلكتروني" required style="width:100%;padding:12px;margin-bottom:12px;border:1px solid #d1d5db;border-radius:6px;box-sizing:border-box;"/>
      <button type="submit" style="width:100%;padding:12px;background:#6366f1;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:600;">اشترك الآن</button>
      <p id="form-message-${template.id}" style="margin-top:12px;text-align:center;font-size:0.875rem;"></p>
    </form>
  \`;
  
  document.getElementById('sub-form-${template.id}').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const name = form.name.value;
    const msgEl = document.getElementById('form-message-${template.id}');
    
    try {
      const res = await fetch('${baseUrl}/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, userId: '${userId}', source: 'embed_form' })
      });
      
      if (res.ok) {
        msgEl.textContent = 'تم الاشتراك بنجاح! ✓';
        msgEl.style.color = '#10b981';
        form.reset();
      } else {
        const data = await res.json();
        msgEl.textContent = data.error || 'حدث خطأ، حاول مرة أخرى';
        msgEl.style.color = '#ef4444';
      }
    } catch (err) {
      msgEl.textContent = 'حدث خطأ في الاتصال';
      msgEl.style.color = '#ef4444';
    }
  });
})();
</script>`;
  };

  const copyCode = (template: FormTemplate) => {
    const code = generateEmbedCode(template);
    navigator.clipboard.writeText(code);
    toast({
      title: 'تم النسخ',
      description: 'تم نسخ كود التضمين بنجاح',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Layout className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">قوالب نماذج الاشتراك</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className={`h-32 ${template.preview} flex items-center justify-center`}>
              <div className="text-center">
                <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-60" />
                <span className="text-sm opacity-80">معاينة النموذج</span>
              </div>
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <Badge variant="outline">{template.style}</Badge>
              </div>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedTemplate(template);
                    setShowCodeDialog(true);
                  }}
                >
                  <Eye className="h-4 w-4 ml-1" />
                  معاينة
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => copyCode(template)}
                >
                  <Copy className="h-4 w-4 ml-1" />
                  نسخ الكود
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              معاينة وكود التضمين للنموذج
            </DialogDescription>
          </DialogHeader>
          
          {selectedTemplate && (
            <Tabs defaultValue="preview" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">
                  <Eye className="h-4 w-4 ml-1" />
                  معاينة
                </TabsTrigger>
                <TabsTrigger value="code">
                  <Code className="h-4 w-4 ml-1" />
                  الكود
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="mt-4">
                <div className={`${selectedTemplate.preview} max-w-md mx-auto`}>
                  <h3 className="text-lg font-semibold mb-2">انضم لقائمتنا البريدية</h3>
                  <p className="text-sm opacity-80 mb-4">احصل على آخر التحديثات والعروض الحصرية</p>
                  <input 
                    type="text" 
                    placeholder="الاسم (اختياري)" 
                    className="w-full p-3 mb-3 border rounded-md bg-background text-foreground"
                    disabled
                  />
                  <input 
                    type="email" 
                    placeholder="البريد الإلكتروني" 
                    className="w-full p-3 mb-3 border rounded-md bg-background text-foreground"
                    disabled
                  />
                  <Button className="w-full" disabled>
                    <CheckCircle className="h-4 w-4 ml-1" />
                    اشترك الآن
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="code" className="mt-4">
                <div className="relative">
                  <Button 
                    size="sm" 
                    className="absolute top-2 left-2 z-10"
                    onClick={() => copyCode(selectedTemplate)}
                  >
                    <Copy className="h-4 w-4 ml-1" />
                    نسخ
                  </Button>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm" dir="ltr">
                    <code>{generateEmbedCode(selectedTemplate)}</code>
                  </pre>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  الصق هذا الكود في موقعك حيث تريد عرض نموذج الاشتراك
                </p>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
