import { useState, useRef } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import {
  Megaphone,
  Check,
  X,
  Edit,
  Trash2,
  Eye,
  MousePointer,
  Loader2,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Advertisement } from "@/hooks/useAdvertisements";

export default function AdsManagementPage() {
  const queryClient = useQueryClient();
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all advertisements (admin can see all)
  const { data: ads, isLoading } = useQuery({
    queryKey: ["all-advertisements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("advertisements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Advertisement[];
    },
  });

  // Update advertisement mutation
  const updateAd = useMutation({
    mutationFn: async (ad: Partial<Advertisement> & { id: string }) => {
      const { id, ...updates } = ad;
      const { error } = await supabase
        .from("advertisements")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-advertisements"] });
      queryClient.invalidateQueries({ queryKey: ["advertisements"] });
      toast({ title: "تم تحديث الإعلان بنجاح" });
      setShowEditDialog(false);
    },
    onError: () => {
      toast({ title: "خطأ في تحديث الإعلان", variant: "destructive" });
    },
  });

  // Delete advertisement mutation
  const deleteAd = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("advertisements")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-advertisements"] });
      queryClient.invalidateQueries({ queryKey: ["advertisements"] });
      toast({ title: "تم حذف الإعلان بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ في حذف الإعلان", variant: "destructive" });
    },
  });

  // Upload image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingAd) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `ads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("advertisements")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("advertisements")
        .getPublicUrl(filePath);

      setEditingAd({ ...editingAd, image_url: publicUrl });
      toast({ title: "تم رفع الصورة بنجاح" });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({ title: "خطأ في رفع الصورة", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const approveAd = (ad: Advertisement) => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + ad.duration_days);

    updateAd.mutate({
      id: ad.id,
      status: "active",
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    });
  };

  const rejectAd = (id: string) => {
    updateAd.mutate({ id, status: "rejected" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">نشط</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-amber-500 border-amber-500">قيد المراجعة</Badge>;
      case "rejected":
        return <Badge variant="destructive">مرفوض</Badge>;
      case "expired":
        return <Badge variant="secondary">منتهي</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const pendingAds = ads?.filter((ad) => ad.status === "pending") || [];
  const activeAds = ads?.filter((ad) => ad.status === "active") || [];
  const otherAds = ads?.filter((ad) => !["pending", "active"].includes(ad.status)) || [];

  return (
    <div className="min-h-screen bg-background font-cairo flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="إدارة الإعلانات" description="إدارة ومراجعة جميع طلبات الإعلانات" />
        <main className="flex-1 p-6 overflow-auto">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">قيد المراجعة</p>
                    <p className="text-2xl font-bold text-amber-500">{pendingAds.length}</p>
                  </div>
                  <Loader2 className="w-8 h-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">نشط</p>
                    <p className="text-2xl font-bold text-green-500">{activeAds.length}</p>
                  </div>
                  <Check className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي المشاهدات</p>
                    <p className="text-2xl font-bold text-primary">
                      {ads?.reduce((sum, ad) => sum + (ad.views_count || 0), 0) || 0}
                    </p>
                  </div>
                  <Eye className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي النقرات</p>
                    <p className="text-2xl font-bold text-secondary">
                      {ads?.reduce((sum, ad) => sum + (ad.clicks_count || 0), 0) || 0}
                    </p>
                  </div>
                  <MousePointer className="w-8 h-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Ads */}
          {pendingAds.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Loader2 className="w-5 h-5 text-amber-500" />
                  طلبات في انتظار المراجعة ({pendingAds.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingAds.map((ad) => (
                    <Card key={ad.id} className="overflow-hidden border-amber-500/30">
                      <div className="aspect-video bg-muted">
                        {ad.image_url ? (
                          <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Megaphone className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold mb-2">{ad.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{ad.description}</p>
                        <div className="text-sm space-y-1 mb-4">
                          <p><span className="text-muted-foreground">المعلن:</span> {ad.advertiser_name}</p>
                          <p><span className="text-muted-foreground">البريد:</span> {ad.advertiser_email}</p>
                          <p><span className="text-muted-foreground">السعر:</span> {ad.price} ر.س</p>
                          <p><span className="text-muted-foreground">المدة:</span> {ad.duration_days} يوم</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-green-500 hover:bg-green-600"
                            onClick={() => approveAd(ad)}
                            disabled={updateAd.isPending}
                          >
                            <Check className="w-4 h-4 ml-1" />
                            موافقة
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex-1"
                            onClick={() => rejectAd(ad.id)}
                            disabled={updateAd.isPending}
                          >
                            <X className="w-4 h-4 ml-1" />
                            رفض
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Ads Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">جميع الإعلانات</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الإعلان</TableHead>
                        <TableHead>المعلن</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>السعر</TableHead>
                        <TableHead>المشاهدات</TableHead>
                        <TableHead>النقرات</TableHead>
                        <TableHead>مميز</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ads?.map((ad) => (
                        <TableRow key={ad.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                                {ad.image_url ? (
                                  <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Megaphone className="w-5 h-5 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{ad.title}</p>
                                <p className="text-xs text-muted-foreground">{ad.ad_type}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{ad.advertiser_name}</p>
                            <p className="text-xs text-muted-foreground">{ad.advertiser_email}</p>
                          </TableCell>
                          <TableCell>{getStatusBadge(ad.status)}</TableCell>
                          <TableCell>{ad.price} ر.س</TableCell>
                          <TableCell>{ad.views_count}</TableCell>
                          <TableCell>{ad.clicks_count}</TableCell>
                          <TableCell>
                            <Switch
                              checked={ad.is_featured}
                              onCheckedChange={(checked) =>
                                updateAd.mutate({ id: ad.id, is_featured: checked })
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                  setEditingAd(ad);
                                  setShowEditDialog(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-destructive"
                                onClick={() => deleteAd.mutate(ad.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل الإعلان</DialogTitle>
          </DialogHeader>
          {editingAd && (
            <div className="space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>صورة الإعلان</Label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    {editingAd.image_url ? (
                      <img src={editingAd.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 ml-2" />
                      )}
                      رفع صورة
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>العنوان</Label>
                  <Input
                    value={editingAd.title}
                    onChange={(e) => setEditingAd({ ...editingAd, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>الحالة</Label>
                  <Select
                    value={editingAd.status}
                    onValueChange={(value) => setEditingAd({ ...editingAd, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">قيد المراجعة</SelectItem>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="rejected">مرفوض</SelectItem>
                      <SelectItem value="expired">منتهي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea
                  value={editingAd.description || ""}
                  onChange={(e) => setEditingAd({ ...editingAd, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>رابط الصورة</Label>
                  <Input
                    value={editingAd.image_url || ""}
                    onChange={(e) => setEditingAd({ ...editingAd, image_url: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>رابط الإعلان</Label>
                  <Input
                    value={editingAd.link_url || ""}
                    onChange={(e) => setEditingAd({ ...editingAd, link_url: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={editingAd.is_featured}
                  onCheckedChange={(checked) => setEditingAd({ ...editingAd, is_featured: checked })}
                />
                <Label>إعلان مميز</Label>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  إلغاء
                </Button>
                <Button
                  onClick={() => updateAd.mutate(editingAd)}
                  disabled={updateAd.isPending}
                >
                  {updateAd.isPending && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                  حفظ التغييرات
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
