import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  useAdPackages, 
  useCreateAdPackage, 
  useUpdateAdPackage, 
  useDeleteAdPackage,
  AdPackage 
} from "@/hooks/useAdPackages";
import { Package, Plus, Pencil, Trash2, Loader2, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AdPackagesManagementPage() {
  const { data: packages, isLoading } = useAdPackages();
  const createPackage = useCreateAdPackage();
  const updatePackage = useUpdateAdPackage();
  const deletePackage = useDeleteAdPackage();

  const [showDialog, setShowDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState<AdPackage | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    duration_days: 30,
    features: [] as string[],
    is_active: true,
    display_order: 0,
  });
  const [newFeature, setNewFeature] = useState("");

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      duration_days: 30,
      features: [],
      is_active: true,
      display_order: 0,
    });
    setEditingPackage(null);
    setNewFeature("");
  };

  const handleEdit = (pkg: AdPackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description || "",
      price: pkg.price,
      duration_days: pkg.duration_days,
      features: pkg.features || [],
      is_active: pkg.is_active,
      display_order: pkg.display_order,
    });
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPackage) {
      await updatePackage.mutateAsync({ id: editingPackage.id, ...formData });
    } else {
      await createPackage.mutateAsync(formData);
    }
    
    setShowDialog(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الباقة؟")) {
      await deletePackage.mutateAsync(id);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="إدارة باقات الإعلانات" description="إدارة الأسعار والميزات" />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Package className="w-8 h-8 text-primary" />
                  </div>
                  إدارة باقات الإعلانات
                </h1>
                <p className="text-muted-foreground mt-2">إدارة أسعار وميزات باقات الإعلانات</p>
              </div>
              <Dialog open={showDialog} onOpenChange={(open) => {
                setShowDialog(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-primary-gradient">
                    <Plus className="w-4 h-4 ml-2" />
                    باقة جديدة
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPackage ? "تعديل الباقة" : "إضافة باقة جديدة"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">اسم الباقة</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="الباقة الأساسية"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">الوصف</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="وصف الباقة"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">السعر ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          min={0}
                          step={0.01}
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">المدة (يوم)</Label>
                        <Input
                          id="duration"
                          type="number"
                          min={1}
                          value={formData.duration_days}
                          onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>المميزات</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          placeholder="ميزة جديدة"
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                        />
                        <Button type="button" variant="outline" onClick={addFeature}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.features.map((feature, i) => (
                          <Badge key={i} variant="secondary" className="px-3 py-1">
                            {feature}
                            <button
                              type="button"
                              onClick={() => removeFeature(i)}
                              className="mr-2 hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_active">مفعّلة</Label>
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="display_order">ترتيب العرض</Label>
                      <Input
                        id="display_order"
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-primary-gradient" disabled={createPackage.isPending || updatePackage.isPending}>
                      {(createPackage.isPending || updatePackage.isPending) && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                      {editingPackage ? "حفظ التعديلات" : "إضافة الباقة"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : packages && packages.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الباقة</TableHead>
                        <TableHead className="text-right">السعر</TableHead>
                        <TableHead className="text-right">المدة</TableHead>
                        <TableHead className="text-right">المميزات</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {packages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{pkg.name}</div>
                              {pkg.description && (
                                <div className="text-sm text-muted-foreground">{pkg.description}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 font-bold text-primary">
                              <DollarSign className="w-4 h-4" />
                              {pkg.price}
                            </div>
                          </TableCell>
                          <TableCell>{pkg.duration_days} يوم</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {pkg.features?.slice(0, 2).map((f, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
                              ))}
                              {pkg.features && pkg.features.length > 2 && (
                                <Badge variant="outline" className="text-xs">+{pkg.features.length - 2}</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={pkg.is_active ? "default" : "secondary"}>
                              {pkg.is_active ? "مفعّلة" : "معطّلة"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(pkg)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(pkg.id)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">لا توجد باقات بعد</p>
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
