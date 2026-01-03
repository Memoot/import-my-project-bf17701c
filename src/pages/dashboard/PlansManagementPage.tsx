import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Crown, Users, Mail, Layout, Zap } from "lucide-react";
import { useSubscriptionPlans, useManagePlans, SubscriptionPlan } from "@/hooks/useSubscription";
import { toast } from "sonner";

export default function PlansManagementPage() {
  const { data: plans, isLoading } = useSubscriptionPlans();
  const { createPlan, updatePlan, deletePlan } = useManagePlans();
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = async (formData: FormData) => {
    const planData = {
      name: formData.get("name") as string,
      monthly_price: parseFloat(formData.get("monthly_price") as string) || 0,
      email_limit_per_month: parseInt(formData.get("email_limit_per_month") as string) || 1000,
      subscriber_limit: formData.get("subscriber_unlimited") ? null : parseInt(formData.get("subscriber_limit") as string) || 100,
      automation_limit: formData.get("automation_unlimited") ? null : parseInt(formData.get("automation_limit") as string) || 1,
      landing_page_limit: formData.get("landing_page_unlimited") ? null : parseInt(formData.get("landing_page_limit") as string) || 1,
      user_limit: parseInt(formData.get("user_limit") as string) || 1,
      advanced_automation: formData.get("advanced_automation") === "on",
      advanced_analytics: formData.get("advanced_analytics") === "on",
      custom_domain: formData.get("custom_domain") === "on",
      remove_branding: formData.get("remove_branding") === "on",
      api_access: formData.get("api_access") === "on",
      is_active: true,
      display_order: parseInt(formData.get("display_order") as string) || 0,
    };

    try {
      if (editingPlan) {
        await updatePlan.mutateAsync({ id: editingPlan.id, ...planData });
      } else {
        await createPlan.mutateAsync(planData);
      }
      setIsDialogOpen(false);
      setEditingPlan(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخطة؟")) return;
    try {
      await deletePlan.mutateAsync(id);
    } catch (error) {
      console.error(error);
    }
  };

  const formatLimit = (value: number | null) => {
    if (value === null) return <Badge variant="secondary">غير محدود</Badge>;
    return value.toLocaleString("ar-SA");
  };

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="إدارة الخطط" />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">إدارة الخطط</h1>
                <p className="text-muted-foreground">إنشاء وتعديل خطط الاشتراك</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingPlan(null)}>
                    <Plus className="w-4 h-4 ml-2" />
                    خطة جديدة
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
                  <DialogHeader>
                    <DialogTitle>{editingPlan ? "تعديل الخطة" : "إنشاء خطة جديدة"}</DialogTitle>
                  </DialogHeader>
                  <PlanForm plan={editingPlan} onSave={handleSave} isPending={createPlan.isPending || updatePlan.isPending} />
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Crown className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{plans?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">إجمالي الخطط</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{plans?.filter(p => p.is_active).length || 0}</p>
                      <p className="text-sm text-muted-foreground">خطط نشطة</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Plans Table */}
            <Card>
              <CardHeader>
                <CardTitle>جميع الخطط</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الخطة</TableHead>
                      <TableHead>السعر</TableHead>
                      <TableHead>الرسائل</TableHead>
                      <TableHead>المشتركين</TableHead>
                      <TableHead>الأتمتة</TableHead>
                      <TableHead>صفحات الهبوط</TableHead>
                      <TableHead>المميزات</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plans?.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Crown className="w-4 h-4 text-primary" />
                            <span className="font-medium">{plan.name}</span>
                            {plan.is_default && <Badge variant="outline">افتراضي</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>${plan.monthly_price}/شهر</TableCell>
                        <TableCell>{formatLimit(plan.email_limit_per_month)}</TableCell>
                        <TableCell>{formatLimit(plan.subscriber_limit)}</TableCell>
                        <TableCell>{formatLimit(plan.automation_limit)}</TableCell>
                        <TableCell>{formatLimit(plan.landing_page_limit)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {plan.advanced_analytics && <Badge variant="secondary" className="text-xs">تحليلات</Badge>}
                            {plan.custom_domain && <Badge variant="secondary" className="text-xs">نطاق</Badge>}
                            {plan.api_access && <Badge variant="secondary" className="text-xs">API</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={plan.is_active ? "default" : "secondary"}>
                            {plan.is_active ? "نشط" : "غير نشط"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingPlan(plan);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleDelete(plan.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

function PlanForm({ plan, onSave, isPending }: { plan: SubscriptionPlan | null; onSave: (data: FormData) => void; isPending: boolean }) {
  const [subscriberUnlimited, setSubscriberUnlimited] = useState(plan?.subscriber_limit === null);
  const [automationUnlimited, setAutomationUnlimited] = useState(plan?.automation_limit === null);
  const [landingPageUnlimited, setLandingPageUnlimited] = useState(plan?.landing_page_limit === null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (subscriberUnlimited) formData.set("subscriber_unlimited", "true");
    if (automationUnlimited) formData.set("automation_unlimited", "true");
    if (landingPageUnlimited) formData.set("landing_page_unlimited", "true");
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">اسم الخطة</Label>
          <Input id="name" name="name" defaultValue={plan?.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthly_price">السعر الشهري ($)</Label>
          <Input id="monthly_price" name="monthly_price" type="number" step="0.01" defaultValue={plan?.monthly_price || 0} required />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">الحدود</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email_limit_per_month">حد الرسائل الشهرية</Label>
            <Input id="email_limit_per_month" name="email_limit_per_month" type="number" defaultValue={plan?.email_limit_per_month || 1000} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="user_limit">حد المستخدمين</Label>
            <Input id="user_limit" name="user_limit" type="number" defaultValue={plan?.user_limit || 1} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="subscriber_limit">حد المشتركين</Label>
              <div className="flex items-center gap-2">
                <Switch checked={subscriberUnlimited} onCheckedChange={setSubscriberUnlimited} />
                <span className="text-sm">غير محدود</span>
              </div>
            </div>
            {!subscriberUnlimited && (
              <Input id="subscriber_limit" name="subscriber_limit" type="number" defaultValue={plan?.subscriber_limit || 100} />
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="automation_limit">حد الأتمتة</Label>
              <div className="flex items-center gap-2">
                <Switch checked={automationUnlimited} onCheckedChange={setAutomationUnlimited} />
                <span className="text-sm">غير محدود</span>
              </div>
            </div>
            {!automationUnlimited && (
              <Input id="automation_limit" name="automation_limit" type="number" defaultValue={plan?.automation_limit || 1} />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="landing_page_limit">حد صفحات الهبوط</Label>
            <div className="flex items-center gap-2">
              <Switch checked={landingPageUnlimited} onCheckedChange={setLandingPageUnlimited} />
              <span className="text-sm">غير محدود</span>
            </div>
          </div>
          {!landingPageUnlimited && (
            <Input id="landing_page_limit" name="landing_page_limit" type="number" defaultValue={plan?.landing_page_limit || 1} />
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">المميزات</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label htmlFor="advanced_automation">أتمتة متقدمة</Label>
            <Switch id="advanced_automation" name="advanced_automation" defaultChecked={plan?.advanced_automation} />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label htmlFor="advanced_analytics">تحليلات متقدمة</Label>
            <Switch id="advanced_analytics" name="advanced_analytics" defaultChecked={plan?.advanced_analytics} />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label htmlFor="custom_domain">نطاق مخصص</Label>
            <Switch id="custom_domain" name="custom_domain" defaultChecked={plan?.custom_domain} />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label htmlFor="remove_branding">إزالة العلامة التجارية</Label>
            <Switch id="remove_branding" name="remove_branding" defaultChecked={plan?.remove_branding} />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label htmlFor="api_access">وصول API</Label>
            <Switch id="api_access" name="api_access" defaultChecked={plan?.api_access} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="display_order">ترتيب العرض</Label>
        <Input id="display_order" name="display_order" type="number" defaultValue={plan?.display_order || 0} />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "جاري الحفظ..." : (plan ? "تحديث الخطة" : "إنشاء الخطة")}
      </Button>
    </form>
  );
}
