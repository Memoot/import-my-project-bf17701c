import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  Menu,
  PanelRightClose,
  PanelLeftClose,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { landingPageTemplates, LandingPage, LandingPageSection, sectionTypes } from "@/data/landingPageTemplates";
import { LandingPageRenderer } from "@/components/landing-page/LandingPageRenderer";
import { DraggableLandingPageRenderer } from "@/components/landing-page/editor/DraggableLandingPageRenderer";
import { useCreateLandingPage, useUpdateLandingPage, useLandingPage } from "@/hooks/useLandingPages";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// مكونات المحرر الجديدة
import { ElementsPanel } from "@/components/landing-page/editor/ElementsPanel";
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

// مكون قسم قابل للسحب
function SortableSectionItem({
  section,
  index,
  isActive,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDelete,
  isFirst,
  isLast,
}: {
  section: LandingPageSection;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Icon = getSectionIcon(section.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors",
        isActive 
          ? 'border-primary bg-primary/5' 
          : 'border-border hover:border-primary/50'
      )}
      onClick={onSelect}
    >
      <button
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </button>
      <Icon className="w-4 h-4 text-primary flex-shrink-0" />
      <span className="text-sm flex-1 truncate">{section.title}</span>
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
          disabled={isFirst}
        >
          <ArrowUp className="w-3 h-3" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
          disabled={isLast}
        >
          <ArrowDown className="w-3 h-3" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 text-destructive"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

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
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [draggingSection, setDraggingSection] = useState<LandingPageSection | null>(null);

  // Sensors for drag and drop - with touch support
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDuplicateSection = (sectionId: string) => {
    if (!currentPage) return;
    const section = currentPage.sections.find(s => s.id === sectionId);
    if (!section) return;

    const newSection: LandingPageSection = {
      ...section,
      id: `section-${Date.now()}`,
      title: `${section.title} (نسخة)`,
      order: currentPage.sections.length + 1,
    };

    setPages(prev => prev.map(p => 
      p.id === activePage 
        ? { ...p, sections: [...p.sections, newSection] }
        : p
    ));
    toast({ title: "تم النسخ", description: "تم نسخ القسم بنجاح" });
  };

  const handleSectionsReorder = (newSections: LandingPageSection[]) => {
    setPages(prev => prev.map(p => 
      p.id === activePage ? { ...p, sections: newSections } : p
    ));
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

  // Handle section drag end
  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggingSection(null);

    if (over && active.id !== over.id && currentPage) {
      const oldIndex = currentPage.sections.findIndex((s) => s.id === active.id);
      const newIndex = currentPage.sections.findIndex((s) => s.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newSections = arrayMove(currentPage.sections, oldIndex, newIndex);
        newSections.forEach((s, i) => { s.order = i + 1; });
        
        setPages(prev => prev.map(p => 
          p.id === activePage ? { ...p, sections: newSections } : p
        ));
      }
    }
  };

  const handleSectionDragStart = (event: DragStartEvent) => {
    const section = currentPage?.sections.find(s => s.id === event.active.id);
    if (section) {
      setDraggingSection(section);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Left panel content component
  const LeftPanelContent = () => (
    <>
      {/* Pages */}
      <div className="p-3 border-b">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">الصفحات</span>
          <div className="flex gap-1">
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
                  onClick={() => { setActivePage(page.id); setActiveSection(null); setLeftPanelOpen(false); }}
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
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>اختر نوع القسم</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
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
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleSectionDragStart}
                  onDragEnd={handleSectionDragEnd}
                >
                  <SortableContext
                    items={currentPage?.sections.map(s => s.id) || []}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {currentPage?.sections.map((section, index) => (
                        <SortableSectionItem
                          key={section.id}
                          section={section}
                          index={index}
                          isActive={activeSection === section.id}
                          onSelect={() => { setActiveSection(section.id); setLeftPanelOpen(false); }}
                          onMoveUp={() => handleMoveSection(section.id, 'up')}
                          onMoveDown={() => handleMoveSection(section.id, 'down')}
                          onDelete={() => handleDeleteSection(section.id)}
                          isFirst={index === 0}
                          isLast={index === (currentPage?.sections.length || 0) - 1}
                        />
                      ))}
                    </div>
                  </SortableContext>
                  <DragOverlay>
                    {draggingSection ? (
                      <div className="flex items-center gap-2 p-2 rounded-lg border border-primary bg-primary/10 shadow-lg">
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{draggingSection.title}</span>
                      </div>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="elements" className="flex-1 overflow-hidden m-0">
          <ElementsPanel onAddElement={addElement} />
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
    </>
  );

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Hide sidebar on small screens in editor */}
      <div className="hidden xl:block">
        <DashboardSidebar />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar - Responsive */}
        <div className="flex items-center justify-between p-2 lg:p-3 border-b bg-card gap-2">
          <div className="flex items-center gap-2">
            {/* Mobile Left Panel Toggle */}
            <Sheet open={leftPanelOpen} onOpenChange={setLeftPanelOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0 overflow-y-auto">
                <div className="flex flex-col h-full">
                  <LeftPanelContent />
                </div>
              </SheetContent>
            </Sheet>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard/landing-pages')}
              className="hidden sm:flex"
            >
              <ArrowRight className="w-4 h-4 ml-1" />
              <span className="hidden md:inline">العودة</span>
            </Button>
            <Input 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-32 sm:w-48 font-semibold h-8 text-sm"
            />
          </div>
          
          <div className="flex items-center gap-1 lg:gap-2">
            {/* Zoom Control - Hide on mobile */}
            <div className="hidden md:flex items-center gap-1 bg-muted rounded-lg px-2 py-1">
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
            <div className="flex items-center gap-0.5 bg-muted rounded-lg p-0.5 lg:p-1">
              <Button
                variant={previewDevice === 'desktop' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-6 w-6 lg:h-7 lg:w-7 p-0"
                onClick={() => setPreviewDevice('desktop')}
              >
                <Monitor className="w-3 h-3 lg:w-4 lg:h-4" />
              </Button>
              <Button
                variant={previewDevice === 'tablet' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-6 w-6 lg:h-7 lg:w-7 p-0"
                onClick={() => setPreviewDevice('tablet')}
              >
                <Tablet className="w-3 h-3 lg:w-4 lg:h-4" />
              </Button>
              <Button
                variant={previewDevice === 'mobile' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-6 w-6 lg:h-7 lg:w-7 p-0"
                onClick={() => setPreviewDevice('mobile')}
              >
                <Smartphone className="w-3 h-3 lg:w-4 lg:h-4" />
              </Button>
            </div>

            <Button 
              variant="outline" 
              size="sm"
              className="hidden sm:flex"
              onClick={() => {
                const previewUrl = templateId 
                  ? `/dashboard/landing-pages/preview/new?template=${templateId}`
                  : `/dashboard/landing-pages/preview/${id || 'new'}`;
                window.open(previewUrl, '_blank');
              }}
            >
              <Eye className="w-4 h-4 lg:ml-1" />
              <span className="hidden lg:inline">معاينة</span>
            </Button>
            <Button 
              size="sm"
              className="bg-primary-gradient"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 lg:ml-1" />}
              <span className="hidden lg:inline">حفظ</span>
            </Button>

            {/* Mobile Right Panel Toggle */}
            <Sheet open={rightPanelOpen} onOpenChange={setRightPanelOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Settings className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 overflow-y-auto">
                <RightPanelContent />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Desktop */}
          <div className="w-72 border-l bg-card hidden lg:flex flex-col overflow-hidden">
            <LeftPanelContent />
          </div>

          {/* Center - Live Preview */}
          <div className="flex-1 bg-muted/50 overflow-auto p-2 lg:p-4 flex justify-center">
            <div 
              className={cn(
                "bg-white shadow-lg rounded-lg overflow-auto transition-all duration-300",
                deviceWidths[previewDevice],
                previewDevice !== 'desktop' && 'max-h-full'
              )}
              // NOTE: Using CSS `zoom` avoids breaking @dnd-kit drag coords (transform: scale causes issues)
              style={{ zoom: zoom / 100 } as any}
            >
              {currentPage ? (
                <DraggableLandingPageRenderer 
                  page={currentPage} 
                  isEditing={true}
                  activeSection={activeSection}
                  onSectionClick={(sectionId) => {
                    setActiveSection(sectionId);
                    // Open right panel on mobile when section is selected
                    if (window.innerWidth < 1024) {
                      setRightPanelOpen(true);
                    }
                  }}
                  onContentChange={updateSectionContent}
                  onSectionsReorder={handleSectionsReorder}
                  onSectionDelete={handleDeleteSection}
                  onSectionDuplicate={handleDuplicateSection}
                  onAddSection={handleAddSection}
                />
              ) : (
                <div className="p-12 text-center text-muted-foreground">
                  <Layout className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>اختر صفحة لتحريرها</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Desktop */}
          <div className="w-80 border-r bg-card hidden lg:flex flex-col overflow-hidden">
            <RightPanelContent />
          </div>
        </div>
      </div>
    </div>
  );

  // Right Panel Content Component
  function RightPanelContent() {
    return (
      <Tabs value={rightPanelTab} onValueChange={(v: any) => setRightPanelTab(v)} className="flex-1 flex flex-col h-full">
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
                          <SelectItem value="minimal">بسيط</SelectItem>
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
                      <Label>نص الزر</Label>
                      <Input 
                        value={activeFullSection.content.buttonText || ''}
                        onChange={(e) => updateSectionContent(activeSection!, 'buttonText', e.target.value)}
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
                      <Label>نص الزر</Label>
                      <Input 
                        value={activeFullSection.content.buttonText || ''}
                        onChange={(e) => updateSectionContent(activeSection!, 'buttonText', e.target.value)}
                      />
                    </div>
                  </>
                )}

                {/* Video Section Properties */}
                {activeFullSection.type === 'video' && (
                  <div className="space-y-2">
                    <Label>رابط الفيديو</Label>
                    <Input 
                      value={activeFullSection.content.videoUrl || ''}
                      onChange={(e) => updateSectionContent(activeSection!, 'videoUrl', e.target.value)}
                      placeholder="رابط يوتيوب..."
                    />
                  </div>
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
    );
  }
}
