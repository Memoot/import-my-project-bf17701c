import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useAdvertisements, useCreateAdvertisement, useUpdateAdvertisement, useDeleteAdvertisement } from "@/hooks/useAdvertisements";
import { Megaphone, Loader2, Plus, Edit, Trash2, Eye, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function AdsManagementPage() {
  const { data: ads, isLoading } = useAdvertisements();
  const createAd = useCreateAdvertisement();
  const updateAd = useUpdateAdvertisement();
  const deleteAd = useDeleteAdvertisement();

  const [showDialog, setShowDialog] = useState(false);
  const [editingAd, setEditingAd] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    link_url: "",
    position: "sidebar",
    priority: 0,
    start_date: "",
    end_date: "",
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
      link_url: "",
      position: "sidebar",
      priority: 0,
      start_date: "",
      end_date: "",
      is_active: true,
    });
    setEditingAd(null);
  };

  const handleEdit = (ad: any) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      description: ad.description || "",
      image_url: ad.image_url || "",
      link_url: ad.link_url || "",
      position: ad.position,
      priority: ad.priority || 0,
      start_date: ad.start_date,
      end_date: ad.end_date,
      is_active: ad.is_active,
    });
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.start_date || !formData.end_date) return;

    if (editingAd) {
      await updateAd.mutateAsync({ id: editingAd.id, ...formData });
    } else {
      await createAd.mutateAsync(formData);
    }
    setShowDialog(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الإعلان؟")) {
      await deleteAd.mutateAsync(id);
    }
  };

  const handleToggleActive = async (ad: any) => {
    await updateAd.mutateAsync({ id: ad.id, is_active: !ad.is_active });
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader title="إدارة الإعلانات" description="إدارة جميع الإعلانات النشطة" />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Megaphone className="w-8 h-8 text-primary" />
                  </div>
                  إدارة الإعلانات
                </h1>
                <p className="text-muted-foreground mt-2">إنشاء وإدارة جميع الإعلانات</p>
              </div>

              <Dialog open={showDialog} onOpenChange={(open) => { setShowDialog(open); if (!open) resetForm(); }}>
                <DialogTrigger asChild>
                  <Button className="bg-primary-gradient">
                    <Plus className="w-4 h-4 ml-2" />
                    إعلان جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{editingAd ? "تعديل الإعلان" : "إعلان جديد"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">العنوان *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="عنوان الإعلان"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">الوصف</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="وصف الإعلان"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="image_url">رابط الصورة</Label>
                        <Input
                          id="image_url"
                          value={formData.image_url}
                          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                          placeholder="https://..."
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="link_url">رابط الإعلان</Label>
                        <Input
                          id="link_url"
                          value={formData.link_url}
                          onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                          placeholder="https://..."
                          dir="ltr"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="position">الموقع</Label>
                        <Select value={formData.position} onValueChange={(v) => setFormData({ ...formData, position: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sidebar">الشريط الجانبي</SelectItem>
                            <SelectItem value="header">أعلى الصفحة</SelectItem>
                            <SelectItem value="footer">أسفل الصفحة</SelectItem>
                            <SelectItem value="popup">نافذة منبثقة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">الأولوية</Label>
                        <Input
                          id="priority"
                          type="number"
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start_date">تاريخ البدء *</Label>
                        <Input
                          id="start_date"
                          type="date"
                          value={formData.start_date}
                          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end_date">تاريخ الانتهاء *</Label>
                        <Input
                          id="end_date"
                          type="date"
                          value={formData.end_date}
                          onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_active">نشط</Label>
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                      />
                    </div>
                    <Button
                      className="w-full bg-primary-gradient"
                      onClick={handleSubmit}
                      disabled={createAd.isPending || updateAd.isPending}
                    >
                      {(createAd.isPending || updateAd.isPending) && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                      {editingAd ? "حفظ التغييرات" : "إنشاء الإعلان"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي الإعلانات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{ads?.length || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">الإعلانات النشطة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{ads?.filter(a => a.is_active).length || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي المشاهدات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{ads?.reduce((sum, a) => sum + (a.impressions_count || 0), 0) || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي النقرات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{ads?.reduce((sum, a) => sum + (a.clicks_count || 0), 0) || 0}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : ads && ads.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الإعلان</TableHead>
                        <TableHead className="text-right">الموقع</TableHead>
                        <TableHead className="text-right">المدة</TableHead>
                        <TableHead className="text-right">الإحصائيات</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ads.map((ad) => (
                        <TableRow key={ad.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {ad.image_url && (
                                <img src={ad.image_url} alt="" className="w-12 h-12 object-cover rounded-lg" />
                              )}
                              <div>
                                <div className="font-medium">{ad.title}</div>
                                {ad.link_url && (
                                  <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                                    <ExternalLink className="w-3 h-3" />
                                    عرض الرابط
                                  </a>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {ad.position === "sidebar" ? "جانبي" : ad.position === "header" ? "علوي" : ad.position === "footer" ? "سفلي" : "منبثق"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{format(new Date(ad.start_date), "dd MMM", { locale: ar })}</div>
                              <div className="text-muted-foreground">إلى {format(new Date(ad.end_date), "dd MMM", { locale: ar })}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {ad.impressions_count || 0}
                              </div>
                              <div className="text-muted-foreground">{ad.clicks_count || 0} نقرة</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={ad.is_active}
                              onCheckedChange={() => handleToggleActive(ad)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(ad)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(ad.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <Megaphone className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">لا توجد إعلانات</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
