import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Layout, Plus, Trash2, Edit, Loader2, Upload, Eye, ArrowRight } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { 
  useAdminTemplates, 
  useCreateAdminTemplate, 
  useUpdateAdminTemplate,
  useDeleteAdminTemplate 
} from "@/hooks/useAdminTemplates";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Navigate, Link } from "react-router-dom";
import { landingPageCategories, landingPageTemplates } from "@/data/landingPageTemplates";

const defaultTemplateData = {
  pages: [
    {
      id: "sales-1",
      name: "صفحة البيع",
      type: "sales",
      settings: {
        primaryColor: "#1e40af",
        secondaryColor: "#f97316",
        fontFamily: "Cairo",
        direction: "rtl"
      },
      sections: [
        {
          id: "hero-1",
          type: "hero",
          title: "القسم الرئيسي",
          order: 1,
          content: {
            headline: "عنوان رئيسي جذاب",
            subheadline: "وصف مختصر للعرض أو المنتج",
            buttonText: "ابدأ الآن",
            buttonUrl: "#pricing",
            backgroundType: "gradient"
          }
        }
      ]
    }
  ]
};

export default function AdminTemplatesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    thumbnail_url: "",
    hero_image_url: "",
    is_active: true,
  });

  const { data: userRole, isLoading: isRoleLoading } = useUserRole();
  const { data: templates = [], isLoading: isTemplatesLoading } = useAdminTemplates();
  const createMutation = useCreateAdminTemplate();
  const updateMutation = useUpdateAdminTemplate();
  const deleteMutation = useDeleteAdminTemplate();

  const handleOpenDialog = (template?: any) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name,
        category: template.category,
        description: template.description || "",
        thumbnail_url: template.thumbnail_url || "",
        hero_image_url: template.hero_image_url || "",
        is_active: template.is_active,
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        name: "",
        category: "",
        description: "",
        thumbnail_url: "",
        hero_image_url: "",
        is_active: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.category) {
      toast({
        title: "خطأ",
        description: "يرجى ملء الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (editingTemplate) {
      updateMutation.mutate({
        id: editingTemplate.id,
        ...formData,
      });
    } else {
      createMutation.mutate({
        ...formData,
        template_data: defaultTemplateData,
        created_by: user?.id || null,
      });
    }
    setIsDialogOpen(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'thumbnail_url' | 'hero_image_url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `templates/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('template-images')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "خطأ في الرفع",
        description: uploadError.message,
        variant: "destructive",
      });
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('template-images')
      .getPublicUrl(filePath);

    setFormData(prev => ({ ...prev, [field]: publicUrl }));
    toast({
      title: "تم الرفع",
      description: "تم رفع الصورة بنجاح",
    });
  };

  if (isRoleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userRole?.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title="إدارة القوالب"
          description="إنشاء وإدارة قوالب صفحات الهبوط"
        />

        <main className="flex-1 p-6 space-y-6 overflow-auto">
          {/* Back Link */}
          <Button variant="ghost" asChild>
            <Link to="/dashboard/admin" className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              العودة للوحة الإدارة
            </Link>
          </Button>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">قوالب مخصصة</CardTitle>
                <Layout className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{templates.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">قوالب نشطة</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {templates.filter(t => t.is_active).length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">قوالب افتراضية</CardTitle>
                <Layout className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{landingPageTemplates.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Templates Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5" />
                  القوالب المخصصة
                </CardTitle>
                <CardDescription>
                  قوالب صفحات هبوط مخصصة يمكن للمستخدمين استخدامها
                </CardDescription>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenDialog()}>
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة قالب
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingTemplate ? "تعديل القالب" : "إضافة قالب جديد"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingTemplate ? "عدّل بيانات القالب" : "أنشئ قالب جديد لصفحات الهبوط"}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>اسم القالب *</Label>
                        <Input
                          placeholder="قالب المتجر الإلكتروني"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>الفئة *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الفئة" />
                          </SelectTrigger>
                          <SelectContent>
                            {landingPageCategories.filter(c => c !== "الكل").map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>الوصف</Label>
                      <Textarea
                        placeholder="وصف مختصر للقالب"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>صورة المعاينة</Label>
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'thumbnail_url')}
                          />
                          {formData.thumbnail_url && (
                            <img
                              src={formData.thumbnail_url}
                              alt="Thumbnail"
                              className="w-full h-32 object-cover rounded-md"
                            />
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>صورة القسم الرئيسي (Hero)</Label>
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'hero_image_url')}
                          />
                          {formData.hero_image_url && (
                            <img
                              src={formData.hero_image_url}
                              alt="Hero"
                              className="w-full h-32 object-cover rounded-md"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>نشط</Label>
                        <p className="text-sm text-muted-foreground">
                          إظهار القالب للمستخدمين
                        </p>
                      </div>
                      <Switch
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      إلغاء
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      {(createMutation.isPending || updateMutation.isPending) && (
                        <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      )}
                      {editingTemplate ? "حفظ التغييرات" : "إنشاء القالب"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>

            <CardContent>
              {isTemplatesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد قوالب مخصصة بعد</p>
                  <p className="text-sm">أنشئ قالب جديد للبدء</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الصورة</TableHead>
                      <TableHead className="text-right">الاسم</TableHead>
                      <TableHead className="text-right">الفئة</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell>
                          {template.thumbnail_url ? (
                            <img
                              src={template.thumbnail_url}
                              alt={template.name}
                              className="w-16 h-10 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-10 bg-muted rounded flex items-center justify-center">
                              <Layout className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>{template.category}</TableCell>
                        <TableCell>
                          <Badge variant={template.is_active ? "default" : "secondary"}>
                            {template.is_active ? "نشط" : "غير نشط"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(template.created_at).toLocaleDateString("ar-SA")}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(template)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteMutation.mutate(template.id)}
                              disabled={deleteMutation.isPending}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
    </div>
  );
}
