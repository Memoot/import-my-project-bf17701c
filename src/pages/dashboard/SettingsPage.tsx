import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Mail,
  Key,
  Smartphone,
  Save
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          title="الإعدادات" 
          description="إدارة إعدادات حسابك والتفضيلات"
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-muted p-1 h-auto flex-wrap">
              <TabsTrigger value="profile" className="gap-2">
                <User className="w-4 h-4" />
                الملف الشخصي
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="w-4 h-4" />
                الإشعارات
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="w-4 h-4" />
                الأمان
              </TabsTrigger>
              <TabsTrigger value="email" className="gap-2">
                <Mail className="w-4 h-4" />
                البريد
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>الملف الشخصي</CardTitle>
                  <CardDescription>إدارة معلومات حسابك الشخصية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-2xl font-bold text-foreground">أم</span>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">تغيير الصورة</Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        JPG, GIF or PNG. الحجم الأقصى 2MB
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">الاسم الأول</Label>
                      <Input id="firstName" defaultValue="أحمد" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">الاسم الأخير</Label>
                      <Input id="lastName" defaultValue="محمد" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input id="email" type="email" defaultValue="ahmed@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input id="phone" defaultValue="+966 50 123 4567" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="company">اسم الشركة</Label>
                      <Input id="company" defaultValue="شركة المستقبل للتقنية" />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-primary-gradient hover:opacity-90">
                      <Save className="w-4 h-4 ml-2" />
                      حفظ التغييرات
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>إعدادات الإشعارات</CardTitle>
                  <CardDescription>تخصيص كيفية استلام الإشعارات</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>إشعارات البريد الإلكتروني</Label>
                        <p className="text-sm text-muted-foreground">
                          استلام تحديثات عبر البريد الإلكتروني
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>تقارير الحملات</Label>
                        <p className="text-sm text-muted-foreground">
                          استلام تقارير أداء الحملات
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>إشعارات المشتركين</Label>
                        <p className="text-sm text-muted-foreground">
                          تنبيهات عند اشتراك أو إلغاء اشتراك
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>تحديثات النظام</Label>
                        <p className="text-sm text-muted-foreground">
                          أخبار وتحديثات المنصة
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>الأمان والخصوصية</CardTitle>
                  <CardDescription>إدارة إعدادات الأمان لحسابك</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Key className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <Label>كلمة المرور</Label>
                          <p className="text-sm text-muted-foreground">
                            آخر تغيير: منذ 30 يوم
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">تغيير</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <Label>التحقق بخطوتين</Label>
                          <p className="text-sm text-muted-foreground">
                            غير مفعل
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">تفعيل</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Globe className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <Label>الجلسات النشطة</Label>
                          <p className="text-sm text-muted-foreground">
                            2 أجهزة متصلة
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">إدارة</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Email Settings Tab */}
            <TabsContent value="email">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>إعدادات البريد</CardTitle>
                  <CardDescription>تخصيص إعدادات إرسال البريد الإلكتروني</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="senderName">اسم المرسل</Label>
                      <Input id="senderName" defaultValue="رسائل برو" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="senderEmail">بريد المرسل</Label>
                      <Input id="senderEmail" type="email" defaultValue="noreply@rasaelpro.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="replyTo">الرد على</Label>
                      <Input id="replyTo" type="email" defaultValue="support@rasaelpro.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="footer">توقيع البريد</Label>
                      <Input id="footer" defaultValue="فريق رسائل برو" />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>تتبع الفتح</Label>
                        <p className="text-sm text-muted-foreground">
                          تتبع عندما يفتح المستلمون رسائلك
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>تتبع النقرات</Label>
                        <p className="text-sm text-muted-foreground">
                          تتبع النقرات على الروابط
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-primary-gradient hover:opacity-90">
                      <Save className="w-4 h-4 ml-2" />
                      حفظ التغييرات
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
