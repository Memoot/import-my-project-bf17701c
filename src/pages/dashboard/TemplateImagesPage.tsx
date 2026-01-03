import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowRight,
  Upload,
  Trash2,
  Image as ImageIcon,
  Loader2,
  Star
} from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { landingPageTemplates } from "@/data/landingPageTemplates";
import { useTemplateImages } from "@/hooks/useTemplateImages";

// Import default template images
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

const defaultImages: Record<string, string> = {
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

export default function TemplateImagesPage() {
  const navigate = useNavigate();
  const { templateImages, loading, uploading, uploadTemplateImage, deleteTemplateImage } = useTemplateImages();
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const handleFileChange = async (templateId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploadingId(templateId);
    await uploadTemplateImage(templateId, file);
    setUploadingId(null);
    
    // Reset input
    if (fileInputRefs.current[templateId]) {
      fileInputRefs.current[templateId]!.value = '';
    }
  };

  const getDisplayImage = (template: typeof landingPageTemplates[0]) => {
    // First check for uploaded image from database
    if (templateImages[template.id]) {
      return templateImages[template.id];
    }
    // Fall back to default images
    return defaultImages[template.thumbnail] || null;
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          title="إدارة صور القوالب" 
          description="رفع وتعديل صور المعاينة للقوالب"
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate('/dashboard/landing-pages/templates')}
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة للقوالب
          </Button>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {landingPageTemplates.map((template) => {
                const displayImage = getDisplayImage(template);
                const hasCustomImage = !!templateImages[template.id];
                const isUploading = uploadingId === template.id;
                
                return (
                  <Card key={template.id} className="bg-card">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          {template.name}
                          {template.isPopular && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </CardTitle>
                        {hasCustomImage && (
                          <Badge variant="secondary" className="text-xs">
                            صورة مخصصة
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Current Image Preview */}
                      <div className="aspect-video rounded-lg mb-4 overflow-hidden border border-border bg-muted">
                        {displayImage ? (
                          <img 
                            src={displayImage} 
                            alt={template.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                              <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">لا توجد صورة</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Upload Controls */}
                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          ref={(el) => (fileInputRefs.current[template.id] = el)}
                          onChange={(e) => handleFileChange(template.id, e)}
                        />
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          disabled={isUploading}
                          onClick={() => fileInputRefs.current[template.id]?.click()}
                        >
                          {isUploading ? (
                            <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4 ml-1" />
                          )}
                          {hasCustomImage ? 'تغيير الصورة' : 'رفع صورة'}
                        </Button>
                        
                        {hasCustomImage && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteTemplateImage(template.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground mt-2">
                        JPG, PNG, WebP أو GIF - حد أقصى 5 ميجابايت
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
