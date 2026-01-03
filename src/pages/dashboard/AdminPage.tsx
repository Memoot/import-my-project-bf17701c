import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Shield, UserPlus, Trash2, Users, ShieldCheck, Loader2, Search, Mail, Key } from "lucide-react";
import { useUserRole, useAllUsers } from "@/hooks/useUserRole";
import { useSearchProfileByEmail } from "@/hooks/useProfiles";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigate, Link } from "react-router-dom";

export default function AdminPage() {
  const [newUserId, setNewUserId] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: userRole, isLoading: isRoleLoading } = useUserRole();
  const { data: allUsers = [], isLoading: isUsersLoading } = useAllUsers();
  const { data: searchResults = [], isLoading: isSearching } = useSearchProfileByEmail(emailSearch);

  const addAdminMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users-with-roles"] });
      toast({
        title: "تمت الإضافة",
        description: "تم إضافة صلاحيات المسؤول بنجاح",
      });
      setNewUserId("");
      setEmailSearch("");
      setSelectedUserId(null);
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في إضافة الصلاحيات",
        variant: "destructive",
      });
    },
  });

  const removeAdminMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "admin");

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users-with-roles"] });
      toast({
        title: "تمت الإزالة",
        description: "تم إزالة صلاحيات المسؤول بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في إزالة الصلاحيات",
        variant: "destructive",
      });
    },
  });

  const handleAddAdmin = () => {
    const userId = selectedUserId || newUserId.trim();
    if (!userId) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال معرف المستخدم أو اختيار مستخدم",
        variant: "destructive",
      });
      return;
    }
    addAdminMutation.mutate(userId);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    setNewUserId(userId);
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

  const adminCount = allUsers.filter((u) => u.roles.includes("admin")).length;

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title="لوحة تحكم المسؤول"
          description="مركز التحكم الشامل - إدارة المستخدمين والصلاحيات والخطط والاشتراكات"
        />

        <main className="flex-1 p-6 space-y-6 overflow-auto">
          {/* Quick Access Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link to="/dashboard/admin/users">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20 hover:border-primary/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إدارة المستخدمين</CardTitle>
                  <Users className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{allUsers.length}</div>
                  <p className="text-xs text-muted-foreground">إجمالي المستخدمين</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/admin/plans">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-amber-500/20 hover:border-amber-500/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إدارة الخطط</CardTitle>
                  <ShieldCheck className="h-5 w-5 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{adminCount}</div>
                  <p className="text-xs text-muted-foreground">المسؤولين النشطين</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/admin/subscriptions">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-500/20 hover:border-green-500/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">الاشتراكات</CardTitle>
                  <Users className="h-5 w-5 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{allUsers.length - adminCount}</div>
                  <p className="text-xs text-muted-foreground">المستخدمين العاديين</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/admin/ads">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-500/20 hover:border-purple-500/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">الإعلانات</CardTitle>
                  <Shield className="h-5 w-5 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">إدارة الإعلانات</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/dashboard/admin/api-keys">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-orange-500/20 hover:border-orange-500/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">مفاتيح API</CardTitle>
                  <Key className="h-5 w-5 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">إدارة الربط مع المنصات</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <Tabs defaultValue="users" className="space-y-4">
            <TabsList>
              <TabsTrigger value="users">إدارة الصلاحيات</TabsTrigger>
              <TabsTrigger value="templates">
                <Link to="/dashboard/admin/templates" className="flex items-center gap-2">
                  إدارة القوالب
                </Link>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              {/* User Management */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      إدارة الصلاحيات
                    </CardTitle>
                    <CardDescription>
                      إضافة أو إزالة صلاحيات المسؤول للمستخدمين
                    </CardDescription>
                  </div>

                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="h-4 w-4 ml-2" />
                        إضافة مسؤول
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>إضافة مسؤول جديد</DialogTitle>
                        <DialogDescription>
                          ابحث عن المستخدم بالبريد الإلكتروني أو أدخل معرف المستخدم مباشرة
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        {/* Email Search */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            البحث بالبريد الإلكتروني
                          </label>
                          <div className="relative">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="example@email.com"
                              value={emailSearch}
                              onChange={(e) => {
                                setEmailSearch(e.target.value);
                                setSelectedUserId(null);
                              }}
                              className="pr-10"
                              dir="ltr"
                            />
                          </div>
                          
                          {/* Search Results */}
                          {emailSearch.length > 2 && (
                            <div className="border rounded-md max-h-40 overflow-y-auto">
                              {isSearching ? (
                                <div className="p-3 text-center text-muted-foreground">
                                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                </div>
                              ) : searchResults && searchResults.length > 0 ? (
                                searchResults.map((profile) => (
                                  <button
                                    key={profile.id}
                                    onClick={() => handleSelectUser(profile.id)}
                                    className={`w-full p-3 text-right hover:bg-muted transition-colors border-b last:border-0 ${
                                      selectedUserId === profile.id ? "bg-primary/10" : ""
                                    }`}
                                  >
                                    <p className="font-medium" dir="ltr">{profile.email}</p>
                                    <p className="text-xs text-muted-foreground" dir="ltr">
                                      {profile.id.slice(0, 8)}...
                                    </p>
                                  </button>
                                ))
                              ) : (
                                <div className="p-3 text-center text-muted-foreground text-sm">
                                  لم يتم العثور على نتائج
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">أو</span>
                          </div>
                        </div>

                        {/* Direct UUID Input */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">معرف المستخدم (UUID)</label>
                          <Input
                            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                            value={newUserId}
                            onChange={(e) => {
                              setNewUserId(e.target.value);
                              setSelectedUserId(null);
                            }}
                            dir="ltr"
                          />
                        </div>

                        {selectedUserId && (
                          <div className="p-3 bg-primary/10 rounded-md">
                            <p className="text-sm font-medium">المستخدم المحدد:</p>
                            <p className="text-xs text-muted-foreground" dir="ltr">{selectedUserId}</p>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          إلغاء
                        </Button>
                        <Button
                          onClick={handleAddAdmin}
                          disabled={addAdminMutation.isPending || (!selectedUserId && !newUserId.trim())}
                        >
                          {addAdminMutation.isPending && (
                            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                          )}
                          إضافة
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>

                <CardContent>
                  {isUsersLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : allUsers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      لا يوجد مستخدمين بعد
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right">معرف المستخدم</TableHead>
                          <TableHead className="text-right">الصلاحيات</TableHead>
                          <TableHead className="text-right">تاريخ الإضافة</TableHead>
                          <TableHead className="text-right">الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allUsers.map((user) => (
                          <TableRow key={user.user_id}>
                            <TableCell className="font-mono text-sm" dir="ltr">
                              {user.user_id.slice(0, 8)}...
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1 flex-wrap">
                                {user.roles.map((role) => (
                                  <Badge
                                    key={role}
                                    variant={role === "admin" ? "default" : "secondary"}
                                  >
                                    {role === "admin" ? "مسؤول" : "مستخدم"}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(user.created_at).toLocaleDateString("ar-SA")}
                            </TableCell>
                            <TableCell>
                              {user.roles.includes("admin") && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeAdminMutation.mutate(user.user_id)}
                                  disabled={removeAdminMutation.isPending}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
