import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Copy,
  Layout,
  FileText,
  ExternalLink,
  Sparkles,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLandingPages, useDeleteLandingPage, useDuplicateLandingPage } from "@/hooks/useLandingPages";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function LandingPagesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: landingPages = [], isLoading } = useLandingPages();
  const deleteMutation = useDeleteLandingPage();
  const duplicateMutation = useDuplicateLandingPage();

  const filteredPages = landingPages.filter(page =>
    page.name.includes(searchQuery)
  );

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleDuplicate = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "خطأ في المصادقة",
        description: "يرجى تسجيل الدخول للمتابعة",
        variant: "destructive",
      });
      return;
    }
    duplicateMutation.mutate({ id, user_id: user.id });
  };

  const totalViews = 0; // Will be calculated from analytics later
  const totalConversions = 0;

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          title="صفحات الهبوط" 
          description="إنشاء وإدارة صفحات الهبوط الاحترافية"
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي الصفحات</p>
                    <p className="text-2xl font-bold">{landingPages.length}</p>
                  </div>
                  <Layout className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">المنشورة</p>
                    <p className="text-2xl font-bold">{landingPages.filter(p => p.is_published).length}</p>
                  </div>
                  <ExternalLink className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي الزيارات</p>
                    <p className="text-2xl font-bold">{totalViews.toLocaleString('ar-EG')}</p>
                  </div>
                  <Eye className="w-8 h-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">التحويلات</p>
                    <p className="text-2xl font-bold">{totalConversions}</p>
                  </div>
                  <Sparkles className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="بحث في صفحات الهبوط..." 
                className="pr-10 w-full sm:w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard/landing-pages/templates')}
              >
                <FileText className="w-4 h-4 ml-2" />
                القوالب الجاهزة
              </Button>
              <Button 
                className="bg-primary-gradient hover:opacity-90"
                onClick={() => navigate('/dashboard/landing-pages/templates')}
              >
                <Plus className="w-4 h-4 ml-2" />
                إنشاء صفحة جديدة
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredPages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPages.map((page) => (
                <Card key={page.id} className="bg-card hover:shadow-md transition-shadow group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Layout className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-semibold">
                            {page.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {new Date(page.created_at).toLocaleDateString('ar-EG')}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/dashboard/landing-pages/edit/${page.id}`)}>
                            <Edit className="w-4 h-4 ml-2" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/dashboard/landing-pages/preview/${page.id}`)}>
                            <Eye className="w-4 h-4 ml-2" />
                            معاينة
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(page.id)}>
                            <Copy className="w-4 h-4 ml-2" />
                            نسخ
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(page.id)}
                          >
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant={page.is_published ? 'default' : 'secondary'}>
                        {page.is_published ? 'منشورة' : 'مسودة'}
                      </Badge>
                      <Badge variant="outline">{page.pages?.length || 0} صفحات</Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => navigate(`/dashboard/landing-pages/edit/${page.id}`)}
                      >
                        <Edit className="w-3 h-3 ml-1" />
                        تعديل
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 bg-primary-gradient"
                        onClick={() => navigate(`/dashboard/landing-pages/preview/${page.id}`)}
                      >
                        <Eye className="w-3 h-3 ml-1" />
                        معاينة
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-card">
              <CardContent className="p-12 text-center">
                <Layout className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">لا توجد صفحات هبوط</h3>
                <p className="text-muted-foreground mb-4">ابدأ بإنشاء صفحة هبوط جديدة أو اختر من القوالب الجاهزة</p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => navigate('/dashboard/landing-pages/templates')}>
                    <FileText className="w-4 h-4 ml-2" />
                    القوالب الجاهزة
                  </Button>
                  <Button className="bg-primary-gradient" onClick={() => navigate('/dashboard/landing-pages/templates')}>
                    <Plus className="w-4 h-4 ml-2" />
                    إنشاء صفحة جديدة
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
