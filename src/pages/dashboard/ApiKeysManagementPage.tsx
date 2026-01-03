import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import {
  useApiKeys,
  useCreateApiKey,
  useUpdateApiKey,
  useDeleteApiKey,
  useToggleApiKey,
  PREDEFINED_SERVICES,
  CATEGORY_LABELS,
  type ApiKey,
  type CreateApiKeyInput,
} from "@/hooks/useApiKeys";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  Brain,
  CreditCard,
  Key,
  Loader2,
  Mail,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  Wallet,
  Eye,
  EyeOff,
  Settings,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain,
  Sparkles,
  Mail,
  CreditCard,
  Wallet,
};

export default function ApiKeysManagementPage() {
  const navigate = useNavigate();
  const { data: userRole, isLoading: roleLoading } = useUserRole();
  const { data: apiKeys, isLoading: keysLoading } = useApiKeys();
  const createApiKey = useCreateApiKey();
  const updateApiKey = useUpdateApiKey();
  const deleteApiKey = useDeleteApiKey();
  const toggleApiKey = useToggleApiKey();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [showKeyValue, setShowKeyValue] = useState<Record<string, boolean>>({});
  
  // Form state
  const [formData, setFormData] = useState<CreateApiKeyInput>({
    key_name: "",
    service_name: "",
    key_type: "custom",
    api_key_value: "",
    description: "",
    category: "other",
  });

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!userRole?.isAdmin) {
    navigate("/dashboard");
    return null;
  }

  const handleAddPredefined = (service: typeof PREDEFINED_SERVICES[0]) => {
    setFormData({
      key_name: service.key_name,
      service_name: service.service_name,
      key_type: "predefined",
      api_key_value: "",
      description: service.description,
      category: service.category,
    });
    setIsAddDialogOpen(true);
  };

  const handleAddCustom = () => {
    setFormData({
      key_name: "",
      service_name: "",
      key_type: "custom",
      api_key_value: "",
      description: "",
      category: "other",
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (key: ApiKey) => {
    setSelectedKey(key);
    setFormData({
      key_name: key.key_name,
      service_name: key.service_name,
      key_type: key.key_type as "predefined" | "custom",
      api_key_value: key.api_key_value,
      description: key.description || "",
      category: key.category as CreateApiKeyInput["category"],
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (key: ApiKey) => {
    setSelectedKey(key);
    setDeleteDialogOpen(true);
  };

  const handleSubmitAdd = async () => {
    await createApiKey.mutateAsync(formData);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleSubmitEdit = async () => {
    if (!selectedKey) return;
    await updateApiKey.mutateAsync({
      id: selectedKey.id,
      key_name: formData.key_name,
      service_name: formData.service_name,
      api_key_value: formData.api_key_value,
      description: formData.description,
      category: formData.category,
    });
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleConfirmDelete = async () => {
    if (!selectedKey) return;
    await deleteApiKey.mutateAsync(selectedKey.id);
    setDeleteDialogOpen(false);
    setSelectedKey(null);
  };

  const resetForm = () => {
    setFormData({
      key_name: "",
      service_name: "",
      key_type: "custom",
      api_key_value: "",
      description: "",
      category: "other",
    });
    setSelectedKey(null);
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return "••••••••";
    return `••••••••${key.slice(-4)}`;
  };

  const getServiceStatus = (serviceName: string) => {
    const key = apiKeys?.find(
      (k) => k.service_name === serviceName && k.is_active
    );
    return key ? "connected" : "not_connected";
  };

  const groupedKeys = apiKeys?.reduce((acc, key) => {
    const category = key.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(key);
    return acc;
  }, {} as Record<string, ApiKey[]>);

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard/admin")}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">إدارة مفاتيح API</h1>
            <p className="text-muted-foreground">
              إدارة مفاتيح الربط مع المنصات والخدمات الخارجية
            </p>
          </div>
        </div>
        <Button onClick={handleAddCustom}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة مفتاح مخصص
        </Button>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList>
          <TabsTrigger value="services">المنصات الرئيسية</TabsTrigger>
          <TabsTrigger value="all">جميع المفاتيح</TabsTrigger>
        </TabsList>

        {/* Predefined Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PREDEFINED_SERVICES.map((service) => {
              const IconComponent = iconMap[service.icon] || Key;
              const status = getServiceStatus(service.service_name);
              const existingKey = apiKeys?.find(
                (k) => k.key_name === service.key_name
              );

              return (
                <Card key={service.key_name} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {service.service_name}
                          </CardTitle>
                          <Badge
                            variant={
                              status === "connected" ? "default" : "secondary"
                            }
                            className="mt-1"
                          >
                            {status === "connected" ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 ml-1" />
                                متصل
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 ml-1" />
                                غير متصل
                              </>
                            )}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {service.description}
                    </CardDescription>
                    {existingKey ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(existingKey)}
                        >
                          <Pencil className="h-4 w-4 ml-1" />
                          تعديل
                        </Button>
                        <Switch
                          checked={existingKey.is_active}
                          onCheckedChange={(checked) =>
                            toggleApiKey.mutate({
                              id: existingKey.id,
                              is_active: checked,
                            })
                          }
                        />
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddPredefined(service)}
                      >
                        <Key className="h-4 w-4 ml-1" />
                        إضافة المفتاح
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* All Keys Tab */}
        <TabsContent value="all" className="space-y-6">
          {keysLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : !apiKeys?.length ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">لا توجد مفاتيح</h3>
                <p className="text-muted-foreground text-center mb-4">
                  لم يتم إضافة أي مفاتيح API بعد
                </p>
                <Button onClick={handleAddCustom}>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة مفتاح
                </Button>
              </CardContent>
            </Card>
          ) : (
            Object.entries(groupedKeys || {}).map(([category, keys]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {CATEGORY_LABELS[category] || category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الخدمة</TableHead>
                        <TableHead>اسم المفتاح</TableHead>
                        <TableHead>القيمة</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>النوع</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {keys.map((key) => (
                        <TableRow key={key.id}>
                          <TableCell className="font-medium">
                            {key.service_name}
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {key.key_name}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                {showKeyValue[key.id]
                                  ? key.api_key_value
                                  : maskApiKey(key.api_key_value)}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() =>
                                  setShowKeyValue((prev) => ({
                                    ...prev,
                                    [key.id]: !prev[key.id],
                                  }))
                                }
                              >
                                {showKeyValue[key.id] ? (
                                  <EyeOff className="h-3 w-3" />
                                ) : (
                                  <Eye className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={key.is_active}
                              onCheckedChange={(checked) =>
                                toggleApiKey.mutate({
                                  id: key.id,
                                  is_active: checked,
                                })
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                key.key_type === "predefined"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {key.key_type === "predefined"
                                ? "محدد مسبقاً"
                                : "مخصص"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(key)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(key)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
            resetForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {isEditDialogOpen ? "تعديل مفتاح API" : "إضافة مفتاح API"}
            </DialogTitle>
            <DialogDescription>
              {formData.key_type === "predefined"
                ? `إضافة مفتاح ${formData.service_name}`
                : "إضافة مفتاح API مخصص"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {formData.key_type === "custom" && (
              <>
                <div className="space-y-2">
                  <Label>اسم الخدمة</Label>
                  <Input
                    value={formData.service_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        service_name: e.target.value,
                      }))
                    }
                    placeholder="مثال: Twilio"
                  />
                </div>
                <div className="space-y-2">
                  <Label>اسم المفتاح (متغير البيئة)</Label>
                  <Input
                    value={formData.key_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        key_name: e.target.value.toUpperCase().replace(/\s/g, "_"),
                      }))
                    }
                    placeholder="مثال: TWILIO_API_KEY"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الفئة</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: CreateApiKeyInput["category"]) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>قيمة المفتاح</Label>
              <Input
                type="password"
                value={formData.api_key_value}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    api_key_value: e.target.value,
                  }))
                }
                placeholder="أدخل قيمة مفتاح API"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label>الوصف (اختياري)</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="وصف مختصر للمفتاح واستخدامه"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
                resetForm();
              }}
            >
              إلغاء
            </Button>
            <Button
              onClick={isEditDialogOpen ? handleSubmitEdit : handleSubmitAdd}
              disabled={
                createApiKey.isPending ||
                updateApiKey.isPending ||
                !formData.api_key_value ||
                !formData.key_name ||
                !formData.service_name
              }
            >
              {(createApiKey.isPending || updateApiKey.isPending) && (
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              )}
              {isEditDialogOpen ? "تحديث" : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف مفتاح "{selectedKey?.service_name}" نهائياً. هذا الإجراء
              لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteApiKey.isPending && (
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              )}
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
