import { Button } from "@/components/ui/button";
import { 
  ArrowRight,
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  Edit,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LandingPageRenderer } from "@/components/landing-page/LandingPageRenderer";
import { landingPageTemplates, LandingPage } from "@/data/landingPageTemplates";
import { useLandingPage } from "@/hooks/useLandingPages";

export default function LandingPagePreviewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');
  
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [currentPage, setCurrentPage] = useState<LandingPage | null>(null);
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [activePageId, setActivePageId] = useState<string>("");

  // Load from database if id exists
  const { data: dbLandingPage, isLoading } = useLandingPage(id !== 'new' ? id : undefined);

  useEffect(() => {
    if (dbLandingPage && dbLandingPage.pages) {
      const loadedPages = dbLandingPage.pages as LandingPage[];
      setPages(loadedPages);
      if (loadedPages.length > 0) {
        setCurrentPage(loadedPages[0]);
        setActivePageId(loadedPages[0].id);
      }
    } else if (templateId) {
      const template = landingPageTemplates.find(t => t.id === parseInt(templateId));
      if (template) {
        setPages(template.pages);
        if (template.pages.length > 0) {
          setCurrentPage(template.pages[0]);
          setActivePageId(template.pages[0].id);
        }
      }
    } else if (id === 'new') {
      // Show demo page for new projects
      const demoTemplate = landingPageTemplates[0];
      if (demoTemplate) {
        setPages(demoTemplate.pages);
        if (demoTemplate.pages.length > 0) {
          setCurrentPage(demoTemplate.pages[0]);
          setActivePageId(demoTemplate.pages[0].id);
        }
      }
    }
  }, [templateId, id, dbLandingPage]);

  const handlePageChange = (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (page) {
      setCurrentPage(page);
      setActivePageId(pageId);
    }
  };

  const deviceWidths = {
    desktop: 'w-full max-w-[1200px]',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/50 flex flex-col">
      {/* Preview Header */}
      <header className="bg-card border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/dashboard/landing-pages')}
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة
          </Button>
          <span className="text-sm font-medium">معاينة صفحة الهبوط</span>
        </div>

        {/* Page Tabs */}
        {pages.length > 1 && (
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {pages.map((page) => (
              <Button
                key={page.id}
                variant={activePageId === page.id ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => handlePageChange(page.id)}
              >
                {page.name}
              </Button>
            ))}
          </div>
        )}

        {/* Device Switcher */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={device === 'desktop' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setDevice('desktop')}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={device === 'tablet' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setDevice('tablet')}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={device === 'mobile' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setDevice('mobile')}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/dashboard/landing-pages/edit/${id || 'new'}${templateId ? `?template=${templateId}` : ''}`)}
            >
              <Edit className="w-4 h-4 ml-2" />
              تعديل
            </Button>
            <Button size="sm" className="bg-primary-gradient">
              <ExternalLink className="w-4 h-4 ml-2" />
              نشر
            </Button>
          </div>
        </div>
      </header>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto p-6 flex justify-center">
        <div 
          className={cn(
            "bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300",
            deviceWidths[device],
            device !== 'desktop' && 'max-h-[800px] overflow-y-auto'
          )}
        >
          {currentPage ? (
            <LandingPageRenderer page={currentPage} />
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              <p>لا توجد صفحة للمعاينة</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
