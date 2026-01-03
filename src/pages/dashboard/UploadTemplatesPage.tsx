import { useState, useRef } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { 
  useUploadedTemplates, 
  useCreateUploadedTemplate, 
  useDeleteUploadedTemplate,
  useToggleUploadedTemplateStatus 
} from "@/hooks/useUploadedTemplates";
import { 
  Upload, 
  FileArchive, 
  Loader2, 
  Eye, 
  Trash2, 
  ArrowRight,
  FileCode,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import JSZip from "jszip";

const categories = [
  "عام",
  "التجارة الإلكترونية",
  "الدورات التدريبية",
  "الخدمات",
  "التطبيقات",
  "الاستشارات",
  "الصحة واللياقة",
  "العقارات",
  "المطاعم",
];

export default function UploadTemplatesPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: userRole, isLoading: roleLoading } = useUserRole();
  const { data: templates = [], isLoading: templatesLoading } = useUploadedTemplates();
  const createTemplate = useCreateUploadedTemplate();
  const deleteTemplate = useDeleteUploadedTemplate();
  const toggleStatus = useToggleUploadedTemplateStatus();
  
  const [uploading, setUploading] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadedContent, setUploadedContent] = useState<{
    html: string;
    css: string;
    js: string;
    assets: any[];
  } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "عام",
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      toast({
        title: "خطأ",
        description: "يرجى رفع ملف ZIP فقط",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      
      let htmlContent = "";
      let cssContent = "";
      let jsContent = "";
      const assets: any[] = [];

      // Process files in the ZIP
      for (const [filename, zipEntry] of Object.entries(contents.files)) {
        if (zipEntry.dir) continue;
        
        const lowerName = filename.toLowerCase();
        
        if (lowerName.endsWith('.html') || lowerName.endsWith('.htm')) {
          if (!htmlContent || lowerName.includes('index')) {
            htmlContent = await zipEntry.async('string');
          }
        } else if (lowerName.endsWith('.css')) {
          cssContent += await zipEntry.async('string') + "\n";
        } else if (lowerName.endsWith('.js')) {
          jsContent += await zipEntry.async('string') + "\n";
        } else if (
          lowerName.endsWith('.png') || 
          lowerName.endsWith('.jpg') || 
          lowerName.endsWith('.jpeg') ||
          lowerName.endsWith('.gif') ||
          lowerName.endsWith('.svg') ||
          lowerName.endsWith('.webp')
        ) {
          // Upload image to storage
          const blob = await zipEntry.async('blob');
          const assetPath = `templates/${Date.now()}-${filename.replace(/\//g, '-')}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('uploaded-templates')
            .upload(assetPath, blob);
          
          if (!uploadError && uploadData) {
            const { data: { publicUrl } } = supabase.storage
              .from('uploaded-templates')
              .getPublicUrl(assetPath);
            
            assets.push({
              originalName: filename,
              storagePath: assetPath,
              publicUrl,
            });
            
            // Replace image references in HTML/CSS
            const originalRef = filename.split('/').pop();
            if (originalRef) {
              htmlContent = htmlContent.replace(
                new RegExp(originalRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                publicUrl
              );
              cssContent = cssContent.replace(
                new RegExp(originalRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                publicUrl
              );
            }
          }
        }
      }

      if (!htmlContent) {
        toast({
          title: "خطأ",
          description: "لم يتم العثور على ملف HTML في الملف المضغوط",
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      // Inject CSS into HTML if exists
      if (cssContent) {
        htmlContent = htmlContent.replace(
          '</head>',
          `<style>${cssContent}</style></head>`
        );
      }

      // Inject JS into HTML if exists
      if (jsContent) {
        htmlContent = htmlContent.replace(
          '</body>',
          `<script>${jsContent}</script></body>`
        );
      }

      setUploadedContent({
        html: htmlContent,
        css: cssContent,
        js: jsContent,
        assets,
      });
      
      // Extract name from filename
      const templateName = file.name.replace('.zip', '');
      setFormData(prev => ({ ...prev, name: templateName }));
      setUploadDialogOpen(true);
      
    } catch (error: any) {
      console.error("Error processing ZIP:", error);
      toast({
        title: "خطأ",
        description: "فشل في معالجة الملف المضغوط",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSaveTemplate = async () => {
    if (!uploadedContent || !formData.name.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم القالب",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    await createTemplate.mutateAsync({
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      category: formData.category,
      thumbnail_url: null,
      html_content: uploadedContent.html,
      css_content: uploadedContent.css || null,
      js_content: uploadedContent.js || null,
      assets: uploadedContent.assets,
      is_active: true,
      created_by: user?.id || null,
    });

    setUploadDialogOpen(false);
    setUploadedContent(null);
    setFormData({ name: "", description: "", category: "عام" });
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userRole?.isAdmin) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          title="رفع القوالب الجاهزة" 
          description="قم برفع قوالب HTML جاهزة عبر ملفات ZIP"
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate('/dashboard/admin/templates')}
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة لإدارة القوالب
          </Button>

          {/* Upload Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileArchive className="w-5 h-5 text-primary" />
                رفع قالب جديد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".zip"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-muted-foreground">جاري معالجة الملف...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">اضغط هنا لرفع ملف ZIP</p>
                    <p className="text-sm text-muted-foreground">
                      يجب أن يحتوي الملف على index.html وملفات CSS/JS والصور
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Templates List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-primary" />
                القوالب المرفوعة
              </CardTitle>
            </CardHeader>
            <CardContent>
              {templatesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  لا توجد قوالب مرفوعة بعد
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>التصنيف</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>تاريخ الإنشاء</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{template.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={template.is_active}
                              onCheckedChange={(checked) => 
                                toggleStatus.mutate({ id: template.id, is_active: checked })
                              }
                            />
                            {template.is_active ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                نشط
                              </span>
                            ) : (
                              <span className="text-muted-foreground flex items-center gap-1">
                                <XCircle className="w-4 h-4" />
                                معطل
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(template.created_at).toLocaleDateString('ar-EG')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setPreviewTemplate(template)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>حذف القالب</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    هل أنت متأكد من حذف هذا القالب؟ لا يمكن التراجع عن هذا الإجراء.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground"
                                    onClick={() => deleteTemplate.mutate(template.id)}
                                  >
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>تفاصيل القالب</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>اسم القالب *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="أدخل اسم القالب"
              />
            </div>
            <div className="space-y-2">
              <Label>الوصف</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="وصف مختصر للقالب"
              />
            </div>
            <div className="space-y-2">
              <Label>التصنيف</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {uploadedContent && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  تم استخراج: HTML + {uploadedContent.css ? 'CSS + ' : ''}{uploadedContent.js ? 'JS + ' : ''}{uploadedContent.assets.length} صورة
                </p>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                إلغاء
              </Button>
              <Button 
                className="bg-primary-gradient"
                onClick={handleSaveTemplate}
                disabled={createTemplate.isPending}
              >
                {createTemplate.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                ) : null}
                حفظ القالب
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name}</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto max-h-[70vh] border rounded-lg">
            <iframe
              srcDoc={previewTemplate?.html_content}
              className="w-full h-[600px] border-0"
              title="معاينة القالب"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
