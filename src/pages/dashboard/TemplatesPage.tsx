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
  Star,
  Layout,
  ShoppingBag,
  Megaphone,
  Calendar,
  Heart,
  FileText,
  X,
  Send
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { emailTemplates } from "@/data/emailTemplates";
import { toast } from "@/hooks/use-toast";
import { sanitizeHtml } from "@/lib/sanitize";

const categories = ["الكل", "ترحيب", "نشرات", "عروض", "منتجات", "فعاليات", "أساسي"];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "ترحيب":
      return Heart;
    case "نشرات":
      return FileText;
    case "عروض":
      return ShoppingBag;
    case "منتجات":
      return Megaphone;
    case "فعاليات":
      return Calendar;
    case "أساسي":
      return Layout;
    default:
      return FileText;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "ترحيب":
      return "bg-pink-100 text-pink-700 border-pink-200";
    case "نشرات":
      return "bg-primary/10 text-primary border-primary/20";
    case "عروض":
      return "bg-secondary/10 text-secondary border-secondary/20";
    case "منتجات":
      return "bg-green-100 text-green-700 border-green-200";
    case "فعاليات":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "أساسي":
      return "bg-muted text-muted-foreground border-border";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<typeof emailTemplates[0] | null>(null);

  const filteredTemplates = emailTemplates.filter(template => {
    const matchesCategory = selectedCategory === "الكل" || template.category === selectedCategory;
    const matchesSearch = template.name.includes(searchQuery) || template.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (templateId: number) => {
    navigate(`/dashboard/campaigns/new?template=${templateId}`);
  };

  const handleCopyTemplate = (template: typeof emailTemplates[0]) => {
    navigator.clipboard.writeText(template.content);
    toast({
      title: "تم نسخ القالب",
      description: "تم نسخ محتوى القالب إلى الحافظة",
    });
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          title="القوالب" 
          description="قوالب بريد إلكتروني جاهزة للاستخدام"
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Actions Bar */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="بحث في القوالب..." 
                  className="pr-10 w-full sm:w-80"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                className="bg-primary-gradient hover:opacity-90"
                onClick={() => navigate('/dashboard/campaigns/new')}
              >
                <Plus className="w-4 h-4 ml-2" />
                حملة جديدة
              </Button>
            </div>
            
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
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
            {filteredTemplates.map((template) => {
              const CategoryIcon = getCategoryIcon(template.category);
              return (
                <Card key={template.id} className="bg-card hover:shadow-md transition-shadow group">
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setPreviewTemplate(template)}>
                            <Eye className="w-4 h-4 ml-2" />
                            معاينة
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUseTemplate(template.id)}>
                            <Edit className="w-4 h-4 ml-2" />
                            تعديل واستخدام
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyTemplate(template)}>
                            <Copy className="w-4 h-4 ml-2" />
                            نسخ المحتوى
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {template.description}
                    </p>
                    
                    {/* Template Preview */}
                    <div 
                      className="aspect-[4/3] bg-white rounded-lg mb-4 overflow-hidden border border-border cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => setPreviewTemplate(template)}
                    >
                      <div 
                        className="w-full h-full transform scale-[0.25] origin-top-right"
                        style={{ width: '400%', height: '400%' }}
                      >
                        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(template.content) }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        استخدم {template.uses.toLocaleString('ar-EG')} مرة
                      </span>
                      <Button 
                        size="sm" 
                        className="bg-primary-gradient hover:opacity-90"
                        onClick={() => handleUseTemplate(template.id)}
                      >
                        <Send className="w-3 h-3 ml-1" />
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
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">{previewTemplate?.name}</DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="p-6 pt-4 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Email Info */}
            <div className="bg-muted p-3 rounded-lg mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">الموضوع:</span>
                <span className="text-foreground font-medium">{previewTemplate?.subject}</span>
              </div>
            </div>

            {/* Email Preview */}
            <div className="border border-border rounded-lg overflow-hidden bg-white">
              {previewTemplate && (
                <div 
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(previewTemplate.content) }}
                  className="p-4"
                />
              )}
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
              <Send className="w-4 h-4 ml-2" />
              استخدام هذا القالب
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
