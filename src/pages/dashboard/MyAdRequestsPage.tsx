import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { useMyAdRequests, useCreateAdRequest, useDeleteAdRequest } from "@/hooks/useAdRequests";
import { useAdPackages } from "@/hooks/useAdPackages";
import { Megaphone, Plus, Loader2, Trash2, ExternalLink, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "قيد المراجعة", variant: "secondary" },
  approved: { label: "معتمد", variant: "default" },
  rejected: { label: "مرفوض", variant: "destructive" },
  active: { label: "نشط", variant: "default" },
  expired: { label: "منتهي", variant: "outline" },
};

export default function MyAdRequestsPage() {
  const { data: requests, isLoading } = useMyAdRequests();
  const { data: packages } = useAdPackages();
  const createRequest = useCreateAdRequest();
  const deleteRequest = useDeleteAdRequest();

  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link_url: "",
    image_url: "",
    package_id: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      link_url: "",
      image_url: "",
      package_id: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createRequest.mutateAsync(formData);
    setShowDialog(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
      await deleteRequest.mutateAsync(id);
    }
  };

  const selectedPackage = packages?.find(p => p.id === formData.package_id);

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="طلبات الإعلانات" description="إدارة طلبات إعلاناتك" />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Megaphone className="w-8 h-8 text-primary" />
                  </div>
                  طلبات الإعلانات
                </h1>
                <p className="text-muted-foreground mt-2">إدارة طلبات إعلاناتك</p>
              </div>
              <Dialog open={showDialog} onOpenChange={(open) => {
                setShowDialog(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-primary-gradient">
                    <Plus className="w-4 h-4 ml-2" />
                    طلب إعلان جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>طلب إعلان جديد</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>اختر الباقة</Label>
                      <Select 
                        value={formData.package_id} 
                        onValueChange={(value) => setFormData({ ...formData, package_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر باقة إعلانية" />
                        </SelectTrigger>
                        <SelectContent>
                          {packages?.filter(p => p.is_active).map((pkg) => (
                            <SelectItem key={pkg.id} value={pkg.id}>
                              <div className="flex items-center justify-between w-full gap-4">
                                <span>{pkg.name}</span>
                                <span className="text-primary font-bold">${pkg.price}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedPackage && (
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{selectedPackage.name}</span>
                            <span className="text-lg font-bold text-primary">${selectedPackage.price}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{selectedPackage.duration_days} يوم</p>
                          {selectedPackage.features && selectedPackage.features.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {selectedPackage.features.map((f, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">عنوان الإعلان</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="عنوان جذاب لإعلانك"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">وصف الإعلان</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="وصف مختصر"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="link_url">رابط الإعلان</Label>
                        <Input
                          id="link_url"
                          value={formData.link_url}
                          onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="image_url">رابط الصورة</Label>
                        <Input
                          id="image_url"
                          value={formData.image_url}
                          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-primary-gradient" 
                      disabled={createRequest.isPending || !formData.package_id}
                    >
                      {createRequest.isPending && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                      إرسال الطلب
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : requests && requests.length > 0 ? (
              <div className="grid gap-4">
                {requests.map((request: any) => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex">
                        {request.image_url && (
                          <div className="w-40 h-32 flex-shrink-0">
                            <img src={request.image_url} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-lg">{request.title}</h3>
                              {request.description && (
                                <p className="text-muted-foreground text-sm mt-1">{request.description}</p>
                              )}
                            </div>
                            <Badge variant={statusLabels[request.status]?.variant}>
                              {statusLabels[request.status]?.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <span>{request.ad_packages?.name || "-"}</span>
                            <span className="flex items-center gap-1 text-primary font-bold">
                              <DollarSign className="w-4 h-4" />
                              {request.ad_packages?.price || 0}
                            </span>
                            <span>{format(new Date(request.created_at), "dd MMM yyyy", { locale: ar })}</span>
                          </div>
                          {request.admin_notes && (
                            <div className="mt-3 p-2 rounded bg-muted/50 text-sm">
                              <span className="font-medium">ملاحظات الإدارة: </span>
                              {request.admin_notes}
                            </div>
                          )}
                          <div className="flex gap-2 mt-3">
                            {request.link_url && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={request.link_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4 ml-2" />
                                  عرض الرابط
                                </a>
                              </Button>
                            )}
                            {request.status === "pending" && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDelete(request.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4 ml-2" />
                                حذف
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Megaphone className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">لا توجد طلبات إعلانات</p>
                  <Button className="mt-4" onClick={() => setShowDialog(true)}>
                    <Plus className="w-4 h-4 ml-2" />
                    أضف طلب إعلان
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
