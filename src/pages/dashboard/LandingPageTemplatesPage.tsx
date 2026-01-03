import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Search, 
  Eye, 
  Star,
  Layout,
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Smartphone,
  Users,
  Heart,
  Home,
  UtensilsCrossed,
  ArrowRight,
  FileText,
  Sparkles,
  ImageIcon,
  Settings,
  Shield,
  Upload
} from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { landingPageTemplates, landingPageCategories, LandingPageTemplate } from "@/data/landingPageTemplates";
import { useTemplateImages } from "@/hooks/useTemplateImages";
import { useUserRole } from "@/hooks/useUserRole";
import { useAdminTemplates } from "@/hooks/useAdminTemplates";

// Import template images
import templateCourse from "@/assets/templates/template-course.png";
import templateEcommerce from "@/assets/templates/template-ecommerce.png";
import templateConsulting from "@/assets/templates/template-consulting.png";
import templateApp from "@/assets/templates/template-app.png";
import templateFitness from "@/assets/templates/template-fitness.png";
import templateRealestate from "@/assets/templates/template-realestate.png";
import templateRestaurant from "@/assets/templates/template-restaurant.png";
import templateWebinar from "@/assets/templates/template-webinar.png";
import templateServices from "@/assets/templates/template-services.png";
import templateCoaching from "@/assets/templates/template-coaching.png";

const templateImages: Record<string, string> = {
  course: templateCourse,
  ecommerce: templateEcommerce,
  consulting: templateConsulting,
  app: templateApp,
  fitness: templateFitness,
  realestate: templateRealestate,
  restaurant: templateRestaurant,
  webinar: templateWebinar,
  services: templateServices,
  coaching: templateCoaching,
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "التجارة الإلكترونية": return ShoppingBag;
    case "الدورات التدريبية": return GraduationCap;
    case "الخدمات": return Briefcase;
    case "التطبيقات": return Smartphone;
    case "الاستشارات": return Users;
    case "الصحة واللياقة": return Heart;
    case "العقارات": return Home;
    case "المطاعم": return UtensilsCrossed;
    default: return Layout;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "التجارة الإلكترونية": return "bg-green-100 text-green-700 border-green-200";
    case "الدورات التدريبية": return "bg-primary/10 text-primary border-primary/20";
    case "الخدمات": return "bg-purple-100 text-purple-700 border-purple-200";
    case "التطبيقات": return "bg-cyan-100 text-cyan-700 border-cyan-200";
    case "الاستشارات": return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "الصحة واللياقة": return "bg-red-100 text-red-700 border-red-200";
    case "العقارات": return "bg-amber-100 text-amber-700 border-amber-200";
    case "المطاعم": return "bg-orange-100 text-orange-700 border-orange-200";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

export default function LandingPageTemplatesPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<LandingPageTemplate | null>(null);
  const { templateImages: dbTemplateImages, loading: imagesLoading } = useTemplateImages();
  const { data: userRole } = useUserRole();
  const { data: adminTemplates = [] } = useAdminTemplates();

  // Combine default templates with admin templates
  const allTemplates = [
    ...landingPageTemplates,
    ...adminTemplates.map((t, index) => ({
      id: 1000 + index, // Use high IDs for admin templates
      name: t.name,
      category: t.category,
      description: t.description || "",
      thumbnail: "custom",
      previewImage: t.thumbnail_url || undefined,
      heroImage: t.hero_image_url || undefined,
      pages: (t.template_data as any)?.pages || [],
      isPopular: false,
      uses: 0,
      isCustom: true,
      customId: t.id,
    }))
  ];

  const filteredTemplates = allTemplates.filter(template => {
    const matchesCategory = selectedCategory === "الكل" || template.category === selectedCategory;
    const matchesSearch = template.name.includes(searchQuery) || template.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (templateId: number) => {
    navigate(`/dashboard/landing-pages/new?template=${templateId}`);
  };

  // Get template image - prioritize custom images, then DB images, then default
  const getTemplateImage = (template: any) => {
    // For custom admin templates
    if (template.previewImage) {
      return template.previewImage;
    }
    // For templates with DB images
    if (dbTemplateImages[template.id]) {
      return dbTemplateImages[template.id];
    }
    // Default template images
    return templateImages[template.thumbnail] || null;
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          title="قوالب صفحات الهبوط" 
          description="اختر من مجموعة القوالب الاحترافية الجاهزة"
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard/landing-pages')}
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة لصفحات الهبوط
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard/landing-pages/template-images')}
            >
              <Settings className="w-4 h-4 ml-2" />
              إدارة صور القوالب
            </Button>
            {userRole?.isAdmin && (
              <Button 
                variant="default"
                className="bg-primary-gradient"
                asChild
              >
                <Link to="/dashboard/admin/templates">
                  <Upload className="w-4 h-4 ml-2" />
                  رفع قوالب جاهزة
                </Link>
              </Button>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="بحث في القوالب..." 
                className="pr-10 w-full sm:w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {landingPageCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className={selectedCategory === category ? "bg-primary-gradient" : ""}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTemplates.map((template: any) => {
              const CategoryIcon = getCategoryIcon(template.category);
              const isCustomTemplate = template.isCustom;
              return (
                <Card key={template.customId || template.id} className="bg-card hover:shadow-md transition-shadow group relative">
                  {isCustomTemplate && (
                    <div className="absolute top-2 left-2 z-10">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                        <Upload className="w-3 h-3 ml-1" />
                        مخصص
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <CategoryIcon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-semibold flex items-center gap-2">
                            {template.name}
                            {template.isPopular && (
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </CardTitle>
                          <Badge className={getCategoryColor(template.category)} variant="outline">
                            {template.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {template.description}
                    </p>
                    
                    {/* Template Preview Image */}
                    <div 
                      className="aspect-video rounded-lg mb-4 overflow-hidden cursor-pointer border border-border hover:border-primary/50 transition-colors"
                      onClick={() => setPreviewTemplate(template)}
                    >
                      {getTemplateImage(template) ? (
                        <img 
                          src={getTemplateImage(template)!} 
                          alt={template.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                          <div className="text-center">
                            <Layout className="w-10 h-10 mx-auto mb-2 text-primary/50" />
                            <p className="text-sm text-muted-foreground">انقر للمعاينة</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {template.pages?.length || 1} صفحات
                        </span>
                        {!isCustomTemplate && (
                          <span>استخدم {(template.uses || 0).toLocaleString('ar-EG')} مرة</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => setPreviewTemplate(template)}
                      >
                        <Eye className="w-3 h-3 ml-1" />
                        معاينة
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 bg-primary-gradient hover:opacity-90"
                        onClick={() => handleUseTemplate(template.id)}
                      >
                        <Sparkles className="w-3 h-3 ml-1" />
                        استخدام
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </main>
      </div>

      {/* Preview Modal */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl flex items-center gap-2">
              {previewTemplate?.name}
              {previewTemplate?.isPopular && (
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-6 pt-4 overflow-y-auto max-h-[calc(90vh-180px)]">
            {/* Template Preview Image in Modal */}
            {previewTemplate && getTemplateImage(previewTemplate) && (
              <div className="aspect-video rounded-lg overflow-hidden mb-4 border border-border">
                <img 
                  src={getTemplateImage(previewTemplate)!} 
                  alt={previewTemplate.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <p className="text-muted-foreground mb-4">{previewTemplate?.description}</p>
            
            {/* Pages Preview */}
            <div className="space-y-4">
              <h3 className="font-semibold">الصفحات المتضمنة:</h3>
              {previewTemplate?.pages.map((page, index) => (
                <Card key={page.id} className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {page.type === 'sales' ? 'صفحة بيع' : 
                           page.type === 'thankyou' ? 'صفحة شكر' :
                           page.type === 'optin' ? 'صفحة تسجيل' :
                           page.type === 'webinar' ? 'صفحة ويبينار' : 'صفحة مخصصة'}
                        </Badge>
                        <span className="font-medium">{page.name}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {page.sections.map(section => (
                        <Badge key={section.id} variant="secondary" className="text-xs">
                          {section.type === 'hero' ? 'قسم رئيسي' :
                           section.type === 'features' ? 'مميزات' :
                           section.type === 'testimonials' ? 'آراء العملاء' :
                           section.type === 'pricing' ? 'أسعار' :
                           section.type === 'faq' ? 'أسئلة شائعة' :
                           section.type === 'cta' ? 'دعوة للإجراء' :
                           section.type === 'bonus' ? 'هدايا' :
                           section.type === 'about' ? 'من نحن' :
                           section.type === 'gallery' ? 'معرض' :
                           section.type === 'contact' ? 'تواصل' :
                           section.type === 'countdown' ? 'عد تنازلي' :
                           section.type === 'video' ? 'فيديو' : section.type}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="p-6 pt-0 flex gap-3 justify-end border-t border-border mt-4">
            <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
              إغلاق
            </Button>
            <Button 
              className="bg-primary-gradient hover:opacity-90"
              onClick={() => {
                if (previewTemplate) {
                  handleUseTemplate(previewTemplate.id);
                }
              }}
            >
              <Sparkles className="w-4 h-4 ml-2" />
              استخدام هذا القالب
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
