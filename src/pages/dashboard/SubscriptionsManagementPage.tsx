import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Crown, Users, RefreshCw } from "lucide-react";
import { useSubscriptionPlans, useAllSubscriptions, useManageSubscriptions } from "@/hooks/useSubscription";
import { useAllUsers } from "@/hooks/useUserRole";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubscriptionsManagementPage() {
  const { data: subscriptions, isLoading: loadingSubs } = useAllSubscriptions();
  const { data: plans } = useSubscriptionPlans();
  const { data: users } = useAllUsers();
  const { assignPlan } = useManageSubscriptions();
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAssignPlan = async () => {
    if (!selectedUser || !selectedPlan) return;
    try {
      await assignPlan.mutateAsync({ userId: selectedUser, planId: selectedPlan });
      setIsDialogOpen(false);
      setSelectedUser("");
      setSelectedPlan("");
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">نشط</Badge>;
      case "cancelled":
        return <Badge variant="destructive">ملغي</Badge>;
      case "expired":
        return <Badge variant="secondary">منتهي</Badge>;
      case "suspended":
        return <Badge variant="outline">موقوف</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="إدارة الاشتراكات" />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">إدارة الاشتراكات</h1>
                <p className="text-muted-foreground">تعيين وإدارة اشتراكات المستخدمين</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Crown className="w-4 h-4 ml-2" />
                    تعيين خطة لمستخدم
                  </Button>
                </DialogTrigger>
                <DialogContent dir="rtl">
                  <DialogHeader>
                    <DialogTitle>تعيين خطة لمستخدم</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">المستخدم</label>
                      <Select value={selectedUser} onValueChange={setSelectedUser}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر مستخدم" />
                        </SelectTrigger>
                        <SelectContent>
                          {users?.map((user) => (
                            <SelectItem key={user.user_id} value={user.user_id}>
                              {user.user_id.slice(0, 8)}... ({user.roles.join(", ")})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">الخطة</label>
                      <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر خطة" />
                        </SelectTrigger>
                        <SelectContent>
                          {plans?.map((plan) => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.name} - ${plan.monthly_price}/شهر
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleAssignPlan}
                      disabled={!selectedUser || !selectedPlan || assignPlan.isPending}
                    >
                      {assignPlan.isPending ? "جاري التعيين..." : "تعيين الخطة"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{subscriptions?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">إجمالي الاشتراكات</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Crown className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{subscriptions?.filter(s => s.status === "active").length || 0}</p>
                      <p className="text-sm text-muted-foreground">اشتراكات نشطة</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{subscriptions?.filter(s => s.status === "expired").length || 0}</p>
                      <p className="text-sm text-muted-foreground">اشتراكات منتهية</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subscriptions Table */}
            <Card>
              <CardHeader>
                <CardTitle>جميع الاشتراكات</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSubs ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>المستخدم</TableHead>
                        <TableHead>الخطة</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>تاريخ البدء</TableHead>
                        <TableHead>بداية دورة الفوترة</TableHead>
                        <TableHead>إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscriptions?.map((sub) => (
                        <TableRow key={sub.id}>
                          <TableCell className="font-mono text-sm">
                            {sub.user_id.slice(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Crown className="w-4 h-4 text-primary" />
                              <span>{sub.plan?.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(sub.status)}</TableCell>
                          <TableCell>
                            {format(new Date(sub.started_at), "d MMM yyyy", { locale: ar })}
                          </TableCell>
                          <TableCell>
                            {format(new Date(sub.billing_cycle_start), "d MMM yyyy", { locale: ar })}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(sub.user_id);
                                setSelectedPlan(sub.plan_id);
                                setIsDialogOpen(true);
                              }}
                            >
                              تغيير الخطة
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
