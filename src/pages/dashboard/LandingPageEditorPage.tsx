import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  ArrowRight,
  Save,
  Eye,
  Plus,
  Trash2,
  GripVertical,
  Settings,
  Palette,
  FileText,
  Layout,
  Star,
  MessageSquare,
  DollarSign,
  HelpCircle,
  MousePointer,
  Gift,
  Users,
  Image,
  Mail,
  Clock,
  Play,
  ArrowUp,
  ArrowDown,
  Loader2,
  Monitor,
  Tablet,
  Smartphone,
  BookOpen,
  Heart,
  CreditCard,
  Shield,
  Layers,
  Type,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { landingPageTemplates, LandingPage, LandingPageSection, sectionTypes } from "@/data/landingPageTemplates";
import { LandingPageRenderer } from "@/components/landing-page/LandingPageRenderer";
import { useCreateLandingPage, useUpdateLandingPage, useLandingPage } from "@/hooks/useLandingPages";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

// مكونات المحرر الجديدة
import { ElementToolbar } from "@/components/landing-page/editor/ElementToolbar";
import { StyleEditor } from "@/components/landing-page/editor/StyleEditor";
import { SectionBackgroundEditor } from "@/components/landing-page/editor/SectionBackgroundEditor";
import { LayersPanel } from "@/components/landing-page/editor/LayersPanel";
import { FormBuilder } from "@/components/landing-page/editor/FormBuilder";
import { useEditorElements } from "@/components/landing-page/editor/useEditorElements";
import { createAutomaticPage, AUTOMATIC_PAGES } from "@/components/landing-page/editor/AutomaticPages";
import { DraggableElement, SectionSettings, ELEMENT_TYPES, PAGE_TYPES } from "@/components/landing-page/editor/types";

const getSectionIcon = (type: string) => {
  switch (type) {
    case 'hero': return Layout;
    case 'features': return Star;
    case 'testimonials': return MessageSquare;
    case 'pricing': return DollarSign;
    case 'faq': return HelpCircle;
    case 'cta': return MousePointer;
    case 'bonus': return Gift;
    case 'about': return Users;
    case 'gallery': return Image;
    case 'contact': return Mail;
    case 'countdown': return Clock;
    case 'video': return Play;
    case 'blog': return BookOpen;
    default: return Layout;
  }
};

const getPageTypeIcon = (type: string) => {
  switch (type) {
    case 'sales': return DollarSign;
    case 'thankyou': return Heart;
    case 'checkout': return CreditCard;
    case 'privacy': return Shield;
    case 'optin': return Mail;
    case 'webinar': return Play;
    default: return FileText;
  }
};

export default function LandingPageEditorPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const templateId = searchParams.get('template');
  
  const [projectName, setProjectName] = useState("مشروع جديد");
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [activePage, setActivePage] = useState<string>("");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [showAddPage, setShowAddPage] = useState(false);
  const [showAddAutoPage, setShowAddAutoPage] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [newPageType, setNewPageType] = useState<LandingPage['type']>("custom");
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showSettings, setShowSettings] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [activeTab, setActiveTab] = useState<'sections' | 'elements' | 'layers'>('sections');
  const [rightPanelTab, setRightPanelTab] = useState<'properties' | 'style' | 'background'>('properties');

  // استخدام hook العناصر
  const {
    elements,
    setElements,
    selectedElementId,
    selectedElement,
    setSelectedElementId,
    addElement,
    updateElement,
    updateElementStyle,
    updateElementContent,
    deleteElement,
    duplicateElement,
    toggleVisibility,
    toggleLock,
    reorderElements,
    moveLayer,
  } = useEditorElements();

  const createMutation = useCreateLandingPage();
  const updateMutation = useUpdateLandingPage();
  const { data: existingPage, isLoading } = useLandingPage(id !== 'new' ? id : undefined);

  useEffect(() => {
    if (existingPage) {
      setProjectName(existingPage.name);
      const loadedPages = existingPage.pages as LandingPage[];
      setPages(loadedPages);
      if (loadedPages.length > 0) {
        setActivePage(loadedPages[0].id);
      }
    } else if (templateId) {
      const template = landingPageTemplates.find(t => t.id === parseInt(templateId));
      if (template) {
        setProjectName(`مشروع - ${template.name}`);
        setPages(template.pages);
        if (template.pages.length > 0) {
          setActivePage(template.pages[0].id);
        }
      }
    } else if (!id || id === 'new') {
      const blankPage: LandingPage = {
        id: "page-new",
        name: "صفحة البيع",
        type: "sales",
        settings: {
          primaryColor: "#1e40af",
          secondaryColor: "#f97316",
          fontFamily: "Cairo",
          direction: "rtl"
        },
        sections: []
      };
      setPages([blankPage]);
      setActivePage(blankPage.id);
    }
  }, [templateId, id, existingPage]);

  const currentPage = pages.find(p => p.id === activePage);

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "خطأ في المصادقة",
        description: "يرجى تسجيل الدخول للمتابعة",
        variant: "destructive",
      });
      return;
    }

    const pageData = {
      name: projectName,
      template_id: templateId ? parseInt(templateId) : undefined,
      pages: pages,
      settings: currentPage?.settings || {},
      user_id: user.id,
    };

    if (existingPage) {
      updateMutation.mutate({ id: existingPage.id, ...pageData });
    } else {
      createMutation.mutate(pageData, {
        onSuccess: (data) => {
          navigate(`/dashboard/landing-pages/edit/${data.id}`, { replace: true });
        }
      });
    }
  };

  const handleAddSection = (type: LandingPageSection['type']) => {
    if (!currentPage) return;
    
    const defaultContent = getDefaultContentForSection(type);
    
    const newSection: LandingPageSection = {
      id: `section-${Date.now()}`,
      type,
      title: sectionTypes.find(s => s.type === type)?.label || "قسم جديد",
      order: currentPage.sections.length + 1,
      content: defaultContent
    };

    setPages(prev => prev.map(p => 
      p.id === activePage 
        ? { ...p, sections: [...p.sections, newSection] }
        : p
    ));
    setShowAddSection(false);
    setActiveSection(newSection.id);
    toast({ title: "تمت الإضافة", description: "تم إضافة القسم بنجاح" });
  };

  const getDefaultContentForSection = (type: string) => {
    switch (type) {
      case 'hero':
        return {
          headline: "عنوان رئيسي جذاب",
          subheadline: "وصف مختصر ومقنع للمنتج أو الخدمة",
          buttonText: "ابدأ الآن",
          buttonUrl: "#pricing",
          openInNewTab: false,
          style: 'modern',
          layout: 'center',
        };
      case 'features':
        return {
          items: [
            { icon: "CheckCircle", title: "ميزة 1", description: "وصف الميزة الأولى" },
            { icon: "TrendingUp", title: "ميزة 2", description: "وصف الميزة الثانية" },
            { icon: "Award", title: "ميزة 3", description: "وصف الميزة الثالثة" }
          ]
        };
      case 'testimonials':
        return {
          items: [
            { name: "أحمد", text: "تجربة رائعة", rating: 5 },
            { name: "سارة", text: "أنصح بها", rating: 5 }
          ]
        };
      case 'pricing':
        return {
          originalPrice: "997",
          salePrice: "297",
          currency: "ر.س",
          buttonText: "اشتري الآن",
          buttonUrl: "#checkout",
          openInNewTab: false,
          features: ["ميزة 1", "ميزة 2", "ميزة 3"]
        };
      case 'faq':
        return {
          items: [
            { question: "سؤال شائع 1؟", answer: "الإجابة على السؤال الأول" },
            { question: "سؤال شائع 2؟", answer: "الإجابة على السؤال الثاني" }
          ]
        };
      case 'bonus':
        return {
          items: [
            { title: "هدية 1", value: "97$" },
            { title: "هدية 2", value: "197$" }
          ]
        };
      case 'contact':
        return {
          fields: [
            { id: 'name', type: 'text', label: 'الاسم', required: true },
            { id: 'email', type: 'email', label: 'البريد الإلكتروني', required: true },
            { id: 'phone', type: 'phone', label: 'الهاتف', required: false },
            { id: 'message', type: 'textarea', label: 'الرسالة', required: false },
          ],
          submitButtonText: 'إرسال',
          successMessage: 'تم الإرسال بنجاح!',
        };
      case 'countdown':
        return {
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        };
      case 'video':
        return {
          videoUrl: '',
          autoplay: false,
          controls: true,
        };
      case 'cta':
        return {
          headline: "جاهز للبدء؟",
          subheadline: "انضم الآن واستفد من عروضنا الحصرية",
          buttonText: "ابدأ الآن",
          buttonUrl: "#pricing",
          openInNewTab: false,
        };
      case 'blog':
        return {
          title: "أحدث المقالات",
          subtitle: "تعرف على آخر الأخبار والمقالات في مجالنا",
          posts: [
            {
              title: "كيف تبدأ مشروعك الناجح",
              excerpt: "تعلم الخطوات الأساسية لبدء مشروعك الخاص",
              image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
              date: new Date().toLocaleDateString('ar-SA'),
              author: "فريق العمل",
              category: "ريادة أعمال"
            },
          ]
        };
      default:
        return {};
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    setPages(prev => prev.map(p => 
      p.id === activePage 
        ? { ...p, sections: p.sections.filter(s => s.id !== sectionId) }
        : p
    ));
    setActiveSection(null);
    toast({ title: "تم الحذف", description: "تم حذف القسم" });
  };

  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    if (!currentPage) return;
    
    const index = currentPage.sections.findIndex(s => s.id === sectionId);
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === currentPage.sections.length - 1)) return;

    const newSections = [...currentPage.sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    
    newSections.forEach((s, i) => s.order = i + 1);

    setPages(prev => prev.map(p => 
      p.id === activePage ? { ...p, sections: newSections } : p
    ));
  };

  const handleAddPage = () => {
    if (!newPageName.trim()) {
      toast({ title: "خطأ", description: "يرجى إدخال اسم الصفحة", variant: "destructive" });
      return;
    }

    const newPage: LandingPage = {
      id: `page-${Date.now()}`,
      name: newPageName,
      type: newPageType,
      settings: currentPage?.settings || {
        primaryColor: "#1e40af",
        secondaryColor: "#f97316",
        fontFamily: "Cairo",
        direction: "rtl"
      },
      sections: []
    };

    setPages(prev => [...prev, newPage]);
    setActivePage(newPage.id);
    setShowAddPage(false);
    setNewPageName("");
    toast({ title: "تمت الإضافة", description: "تم إضافة الصفحة بنجاح" });
  };

  const handleAddAutoPage = (type: 'thankyou' | 'checkout' | 'privacy') => {
    const settings = currentPage?.settings || {
      primaryColor: "#1e40af",
      secondaryColor: "#f97316",
      fontFamily: "Cairo",
      direction: "rtl"
    };

    const newPage = createAutomaticPage(type, settings);
    setPages(prev => [...prev, newPage]);
    setActivePage(newPage.id);
    setShowAddAutoPage(false);
    toast({ title: "تمت الإضافة", description: `تم إضافة ${AUTOMATIC_PAGES.find(p => p.type === type)?.label}` });
  };

  const handleDeletePage = (pageId: string) => {
    if (pages.length <= 1) {
      toast({ title: "خطأ", description: "يجب أن يكون لديك صفحة واحدة على الأقل", variant: "destructive" });
      return;
    }
    
    setPages(prev => prev.filter(p => p.id !== pageId));
    if (activePage === pageId) {
      setActivePage(pages.filter(p => p.id !== pageId)[0]?.id || "");
    }
    setActiveSection(null);
    toast({ title: "تم الحذف", description: "تم حذف الصفحة" });
  };

  const updateSectionContent = (sectionId: string, field: string, value: any) => {
    setPages(prev => prev.map(p => 
      p.id === activePage 
        ? { 
            ...p, 
            sections: p.sections.map(s => 
              s.id === sectionId 
                ? { ...s, content: { ...s.content, [field]: value } }
                : s
            ) 
          }
        : p
    ));
  };

  const updatePageSettings = (field: string, value: any) => {
    setPages(prev => prev.map(p => 
      p.id === activePage 
        ? { ...p, settings: { ...p.settings, [field]: value } }
        : p
    ));
  };

  const updateSectionSettings = (sectionId: string, settings: Partial<SectionSettings>) => {
    setPages(prev => prev.map(p => 
      p.id === activePage 
        ? { 
            ...p, 
            sections: p.sections.map(s => 
              s.id === sectionId 
                ? { ...s, content: { ...s.content, sectionSettings: { ...s.content.sectionSettings, ...settings } } }
                : s
            ) 
          }
        : p
    ));
  };

  const activeFullSection = currentPage?.sections.find(s => s.id === activeSection);
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const deviceWidths = {
    desktop: 'w-full',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-3 border-b bg-card">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard/landing-pages')}
            >
              <ArrowRight className="w-4 h-4 ml-1" />
              العودة
            </Button>
            <Input 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-48 font-semibold h-8"
            />
          </div>
          
          <div className="flex items-center gap-2">
            {/* Zoom Control */}
            <div className="flex items-center gap-1 bg-muted rounded-lg px-2 py-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setZoom(Math.max(50, zoom - 10))}
              >
                <ZoomOut className="w-3 h-3" />
              </Button>
              <span className="text-xs w-10 text-center">{zoom}%</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setZoom(Math.min(150, zoom + 10))}
              >
                <ZoomIn className="w-3 h-3" />
              </Button>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button
                variant={previewDevice === 'desktop' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setPreviewDevice('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={previewDevice === 'tablet' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setPreviewDevice('tablet')}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={previewDevice === 'mobile' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setPreviewDevice('mobile')}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const previewUrl = templateId 
                  ? `/dashboard/landing-pages/preview/new?template=${templateId}`
                  : `/dashboard/landing-pages/preview/${id || 'new'}`;
                window.open(previewUrl, '_blank');
              }}
            >
              <Eye className="w-4 h-4 ml-1" />
              معاينة
            </Button>
            <Button 
              size="sm"
              className="bg-primary-gradient"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="w-4 h-4 ml-1 animate-spin" /> : <Save className="w-4 h-4 ml-1" />}
              حفظ
            </Button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Pages, Sections, Elements, Layers */}
          <div className="w-72 border-l bg-card flex flex-col overflow-hidden">
            {/* Pages */}
            <div className="p-3 border-b">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">الصفحات</span>
                <div className="flex gap-1">
                  {/* إضافة صفحة تلقائية */}
                  <Dialog open={showAddAutoPage} onOpenChange={setShowAddAutoPage}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="صفحات تلقائية">
                        <Star className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>إضافة صفحة تلقائية</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-3 pt-4">
                        {AUTOMATIC_PAGES.map((page) => {
                          const Icon = getPageTypeIcon(page.type);
                          return (
                            <Button
                              key={page.type}
                              variant="outline"
                              className="h-auto py-4 justify-start gap-3"
                              onClick={() => handleAddAutoPage(page.type)}
                            >
                              <Icon className="w-6 h-6 text-primary" />
                              <div className="text-right">
                                <p className="font-medium">{page.label}</p>
                                <p className="text-xs text-muted-foreground">{page.description}</p>
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* إضافة صفحة مخصصة */}
                  <Dialog open={showAddPage} onOpenChange={setShowAddPage}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>إضافة صفحة جديدة</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>اسم الصفحة</Label>
                          <Input 
                            value={newPageName}
                            onChange={(e) => setNewPageName(e.target.value)}
                            placeholder="مثال: صفحة الشكر"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>نوع الصفحة</Label>
                          <Select value={newPageType} onValueChange={(v: LandingPage['type']) => setNewPageType(v)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {PAGE_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full bg-primary-gradient" onClick={handleAddPage}>
                          إضافة الصفحة
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <ScrollArea className="h-24">
                <div className="space-y-1">
                  {pages.map((page) => {
                    const PageIcon = getPageTypeIcon(page.type);
                    return (
                      <div
                        key={page.id}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors group",
                          activePage === page.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                        )}
                        onClick={() => { setActivePage(page.id); setActiveSection(null); }}
                      >
                        <div className="flex items-center gap-2">
                          <PageIcon className="w-4 h-4" />
                          <span className="text-sm truncate">{page.name}</span>
                        </div>
                        {pages.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                            onClick={(e) => { e.stopPropagation(); handleDeletePage(page.id); }}
                          >
                            <Trash2 className="w-3 h-3 text-destructive" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* Tabs: Sections / Elements / Layers */}
            <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="w-full grid grid-cols-3 mx-3 mt-2" style={{ width: 'calc(100% - 24px)' }}>
                <TabsTrigger value="sections" className="text-xs">الأقسام</TabsTrigger>
                <TabsTrigger value="elements" className="text-xs">العناصر</TabsTrigger>
                <TabsTrigger value="layers" className="text-xs">الطبقات</TabsTrigger>
              </TabsList>

              <TabsContent value="sections" className="flex-1 overflow-hidden m-0">
                <ScrollArea className="h-full">
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">أقسام الصفحة</span>
                      <Dialog open={showAddSection} onOpenChange={setShowAddSection}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>اختر نوع القسم</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-3 gap-3 pt-4">
                            {sectionTypes.map((section) => {
                              const Icon = getSectionIcon(section.type);
                              return (
                                <Button
                                  key={section.type}
                                  variant="outline"
                                  className="h-auto py-4 flex flex-col gap-2"
                                  onClick={() => handleAddSection(section.type as LandingPageSection['type'])}
                                >
                                  <Icon className="w-6 h-6 text-primary" />
                                  <span className="text-sm">{section.label}</span>
                                </Button>
                              );
                            })}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {currentPage?.sections.length === 0 ? (
                      <div className="text-center py-8">
                        <Layout className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                        <p className="text-sm text-muted-foreground mb-3">لا توجد أقسام</p>
                        <Button size="sm" onClick={() => setShowAddSection(true)}>
                          <Plus className="w-4 h-4 ml-1" />
                          إضافة قسم
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {currentPage?.sections.map((section, index) => {
                          const Icon = getSectionIcon(section.type);
                          return (
                            <div
                              key={section.id}
                              className={cn(
                                "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors",
                                activeSection === section.id 
                                  ? 'border-primary bg-primary/5' 
                                  : 'border-border hover:border-primary/50'
                              )}
                              onClick={() => setActiveSection(section.id)}
                            >
                              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab flex-shrink-0" />
                              <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-sm flex-1 truncate">{section.title}</span>
                              <div className="flex items-center gap-0.5 flex-shrink-0">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6"
                                  onClick={(e) => { e.stopPropagation(); handleMoveSection(section.id, 'up'); }}
                                  disabled={index === 0}
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6"
                                  onClick={(e) => { e.stopPropagation(); handleMoveSection(section.id, 'down'); }}
                                  disabled={index === (currentPage?.sections.length || 0) - 1}
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 text-destructive"
                                  onClick={(e) => { e.stopPropagation(); handleDeleteSection(section.id); }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="elements" className="flex-1 overflow-hidden m-0">
                <ScrollArea className="h-full">
                  <ElementToolbar onAddElement={addElement} />
                </ScrollArea>
              </TabsContent>

              <TabsContent value="layers" className="flex-1 overflow-hidden m-0">
                <ScrollArea className="h-full">
                  <LayersPanel
                    elements={elements}
                    selectedElementId={selectedElementId}
                    onSelectElement={setSelectedElementId}
                    onDeleteElement={deleteElement}
                    onDuplicateElement={duplicateElement}
                    onToggleVisibility={toggleVisibility}
                    onToggleLock={toggleLock}
                    onReorderElements={reorderElements}
                    onMoveLayer={moveLayer}
                  />
                </ScrollArea>
              </TabsContent>
            </Tabs>

            {/* Page Settings */}
            <div className="p-3 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Palette className="w-4 h-4 ml-2" />
                إعدادات الألوان
              </Button>
              {showSettings && currentPage && (
                <div className="mt-3 space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">اللون الرئيسي</Label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={currentPage.settings.primaryColor}
                        onChange={(e) => updatePageSettings('primaryColor', e.target.value)}
                        className="w-10 h-8 rounded cursor-pointer"
                      />
                      <Input 
                        value={currentPage.settings.primaryColor}
                        onChange={(e) => updatePageSettings('primaryColor', e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">اللون الثانوي</Label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={currentPage.settings.secondaryColor}
                        onChange={(e) => updatePageSettings('secondaryColor', e.target.value)}
                        className="w-10 h-8 rounded cursor-pointer"
                      />
                      <Input 
                        value={currentPage.settings.secondaryColor}
                        onChange={(e) => updatePageSettings('secondaryColor', e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center - Live Preview */}
          <div className="flex-1 bg-muted/50 overflow-auto p-4 flex justify-center">
            <div 
              className={cn(
                "bg-white shadow-lg rounded-lg overflow-auto transition-all duration-300",
                deviceWidths[previewDevice],
                previewDevice !== 'desktop' && 'max-h-full'
              )}
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            >
              {currentPage ? (
                <LandingPageRenderer 
                  page={currentPage} 
                  isEditing={true}
                  activeSection={activeSection}
                  onSectionClick={setActiveSection}
                  onContentChange={updateSectionContent}
                />
              ) : (
                <div className="p-12 text-center text-muted-foreground">
                  <Layout className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>اختر صفحة لتحريرها</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Properties Panel */}
          <div className="w-80 border-r bg-card flex flex-col overflow-hidden">
            <Tabs value={rightPanelTab} onValueChange={(v: any) => setRightPanelTab(v)} className="flex-1 flex flex-col">
              <div className="p-3 border-b">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="properties" className="text-xs">الخصائص</TabsTrigger>
                  <TabsTrigger value="style" className="text-xs">التنسيق</TabsTrigger>
                  <TabsTrigger value="background" className="text-xs">الخلفية</TabsTrigger>
                </TabsList>
              </div>

              <ScrollArea className="flex-1">
                <TabsContent value="properties" className="m-0">
                  {activeFullSection ? (
                    <div className="p-4 space-y-4">
                      <div className="space-y-2">
                        <Label>عنوان القسم</Label>
                        <Input 
                          value={activeFullSection.title}
                          onChange={(e) => {
                            setPages(prev => prev.map(p => 
                              p.id === activePage 
                                ? { 
                                    ...p, 
                                    sections: p.sections.map(s => 
                                      s.id === activeSection 
                                        ? { ...s, title: e.target.value }
                                        : s
                                    ) 
                                  }
                                : p
                            ));
                          }}
                        />
                      </div>

                      {/* Hero Section Properties */}
                      {activeFullSection.type === 'hero' && (
                        <>
                          <div className="space-y-2">
                            <Label>العنوان الرئيسي</Label>
                            <Input 
                              value={activeFullSection.content.headline || ''}
                              onChange={(e) => updateSectionContent(activeSection!, 'headline', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>العنوان الفرعي</Label>
                            <Textarea 
                              value={activeFullSection.content.subheadline || ''}
                              onChange={(e) => updateSectionContent(activeSection!, 'subheadline', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>نص الزر</Label>
                            <Input 
                              value={activeFullSection.content.buttonText || ''}
                              onChange={(e) => updateSectionContent(activeSection!, 'buttonText', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>رابط الزر</Label>
                            <Input 
                              value={activeFullSection.content.buttonUrl || ''}
                              onChange={(e) => updateSectionContent(activeSection!, 'buttonUrl', e.target.value)}
                              placeholder="#section أو /page أو https://..."
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>فتح في نافذة جديدة</Label>
                            <input 
                              type="checkbox"
                              checked={activeFullSection.content.openInNewTab || false}
                              onChange={(e) => updateSectionContent(activeSection!, 'openInNewTab', e.target.checked)}
                              className="w-4 h-4"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>الشارة</Label>
                            <Input 
                              value={activeFullSection.content.badge || ''}
                              onChange={(e) => updateSectionContent(activeSection!, 'badge', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>ستايل التصميم</Label>
                            <Select
                              value={activeFullSection.content.style || 'modern'}
                              onValueChange={(value) => updateSectionContent(activeSection!, 'style', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="modern">عصري</SelectItem>
                                <SelectItem value="bold">جريء</SelectItem>
                                <SelectItem value="elegant">أنيق</SelectItem>
                                <SelectItem value="dynamic">ديناميكي</SelectItem>
                                <SelectItem value="gradient">متدرج</SelectItem>
                                <SelectItem value="professional">احترافي</SelectItem>
                                <SelectItem value="minimal">بسيط</SelectItem>
                                <SelectItem value="classic">كلاسيكي</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>تخطيط النص</Label>
                            <Select
                              value={activeFullSection.content.layout || 'center'}
                              onValueChange={(value) => updateSectionContent(activeSection!, 'layout', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="center">وسط</SelectItem>
                                <SelectItem value="right">يمين</SelectItem>
                                <SelectItem value="left">يسار</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}

                      {/* Pricing Section Properties */}
                      {activeFullSection.type === 'pricing' && (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                              <Label>السعر الأصلي</Label>
                              <Input 
                                value={activeFullSection.content.originalPrice || ''}
                                onChange={(e) => updateSectionContent(activeSection!, 'originalPrice', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>سعر العرض</Label>
                              <Input 
                                value={activeFullSection.content.salePrice || ''}
                                onChange={(e) => updateSectionContent(activeSection!, 'salePrice', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>العملة</Label>
                            <Input 
                              value={activeFullSection.content.currency || 'ر.س'}
                              onChange={(e) => updateSectionContent(activeSection!, 'currency', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>نص الزر</Label>
                            <Input 
                              value={activeFullSection.content.buttonText || ''}
                              onChange={(e) => updateSectionContent(activeSection!, 'buttonText', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>رابط الزر</Label>
                            <Input 
                              value={activeFullSection.content.buttonUrl || ''}
                              onChange={(e) => updateSectionContent(activeSection!, 'buttonUrl', e.target.value)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>فتح في نافذة جديدة</Label>
                            <input 
                              type="checkbox"
                              checked={activeFullSection.content.openInNewTab || false}
                              onChange={(e) => updateSectionContent(activeSection!, 'openInNewTab', e.target.checked)}
                              className="w-4 h-4"
                            />
                          </div>
                        </>
                      )}

                      {/* CTA Section Properties */}
                      {activeFullSection.type === 'cta' && (
                        <>
                          <div className="space-y-2">
                            <Label>العنوان</Label>
                            <Input 
                              value={activeFullSection.content.headline || ''}
                              onChange={(e) => updateSectionContent(activeSection!, 'headline', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>العنوان الفرعي</Label>
                            <Textarea 
                              value={activeFullSection.content.subheadline || ''}
                              onChange={(e) => updateSectionContent(activeSection!, 'subheadline', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>نص الزر</Label>
                            <Input 
                              value={activeFullSection.content.buttonText || ''}
                              onChange={(e) => updateSectionContent(activeSection!, 'buttonText', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>رابط الزر</Label>
                            <Input 
                              value={activeFullSection.content.buttonUrl || ''}
                              onChange={(e) => updateSectionContent(activeSection!, 'buttonUrl', e.target.value)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>فتح في نافذة جديدة</Label>
                            <input 
                              type="checkbox"
                              checked={activeFullSection.content.openInNewTab || false}
                              onChange={(e) => updateSectionContent(activeSection!, 'openInNewTab', e.target.checked)}
                              className="w-4 h-4"
                            />
                          </div>
                        </>
                      )}

                      {/* Video Section Properties */}
                      {activeFullSection.type === 'video' && (
                        <>
                          <div className="space-y-2">
                            <Label>رابط الفيديو</Label>
                            <Input 
                              value={activeFullSection.content.videoUrl || ''}
                              onChange={(e) => updateSectionContent(activeSection!, 'videoUrl', e.target.value)}
                              placeholder="رابط يوتيوب..."
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>تشغيل تلقائي</Label>
                            <input 
                              type="checkbox"
                              checked={activeFullSection.content.autoplay || false}
                              onChange={(e) => updateSectionContent(activeSection!, 'autoplay', e.target.checked)}
                              className="w-4 h-4"
                            />
                          </div>
                        </>
                      )}

                      {/* Countdown Section Properties */}
                      {activeFullSection.type === 'countdown' && (
                        <div className="space-y-2">
                          <Label>تاريخ الانتهاء</Label>
                          <Input 
                            type="datetime-local"
                            value={activeFullSection.content.endDate ? new Date(activeFullSection.content.endDate).toISOString().slice(0, 16) : ''}
                            onChange={(e) => updateSectionContent(activeSection!, 'endDate', new Date(e.target.value).toISOString())}
                          />
                        </div>
                      )}

                      {/* Contact/Form Section Properties */}
                      {activeFullSection.type === 'contact' && (
                        <FormBuilder
                          form={{
                            fields: activeFullSection.content.fields || [],
                            submitButtonText: activeFullSection.content.submitButtonText || 'إرسال',
                            successMessage: activeFullSection.content.successMessage || 'تم الإرسال بنجاح!',
                            redirectUrl: activeFullSection.content.redirectUrl,
                          }}
                          onChange={(form) => {
                            updateSectionContent(activeSection!, 'fields', form.fields);
                            updateSectionContent(activeSection!, 'submitButtonText', form.submitButtonText);
                            updateSectionContent(activeSection!, 'successMessage', form.successMessage);
                            updateSectionContent(activeSection!, 'redirectUrl', form.redirectUrl);
                          }}
                        />
                      )}
                    </div>
                  ) : selectedElement ? (
                    <StyleEditor
                      elementType={selectedElement.type}
                      style={selectedElement.style}
                      content={selectedElement.content}
                      onStyleChange={(style) => updateElementStyle(selectedElement.id, style)}
                      onContentChange={(content) => updateElementContent(selectedElement.id, content)}
                    />
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">اختر قسم أو عنصر لتحريره</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="style" className="m-0">
                  {selectedElement ? (
                    <StyleEditor
                      elementType={selectedElement.type}
                      style={selectedElement.style}
                      content={selectedElement.content}
                      onStyleChange={(style) => updateElementStyle(selectedElement.id, style)}
                      onContentChange={(content) => updateElementContent(selectedElement.id, content)}
                    />
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <Type className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">اختر عنصر لتنسيقه</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="background" className="m-0 p-4">
                  {activeFullSection ? (
                    <SectionBackgroundEditor
                      settings={activeFullSection.content.sectionSettings || {}}
                      onChange={(settings) => updateSectionSettings(activeSection!, settings)}
                    />
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">اختر قسم لتعديل خلفيته</p>
                    </div>
                  )}
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
