import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TemplateImage {
  id: string;
  template_id: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export function useTemplateImages() {
  const [templateImages, setTemplateImages] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Fetch all template images
  const fetchTemplateImages = async () => {
    try {
      const { data, error } = await supabase
        .from('template_images')
        .select('*');
      
      if (error) throw error;
      
      const imageMap: Record<number, string> = {};
      data?.forEach((item: TemplateImage) => {
        imageMap[item.template_id] = item.image_url;
      });
      
      setTemplateImages(imageMap);
    } catch (error) {
      console.error('Error fetching template images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplateImages();
  }, []);

  // Upload image for a template
  const uploadTemplateImage = async (templateId: number, file: File): Promise<string | null> => {
    // Validate file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "خطأ",
        description: "نوع الملف غير مدعوم. استخدم JPG, PNG, WebP أو GIF",
        variant: "destructive",
      });
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "خطأ",
        description: "حجم الملف يجب أن يكون أقل من 5 ميجابايت",
        variant: "destructive",
      });
      return null;
    }

    setUploading(true);
    
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `template-${templateId}-${Date.now()}.${fileExt}`;
      
      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('template-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('template-images')
        .getPublicUrl(fileName);
      
      const imageUrl = urlData.publicUrl;
      
      // Check if template already has an image
      const { data: existing } = await supabase
        .from('template_images')
        .select('id')
        .eq('template_id', templateId)
        .maybeSingle();
      
      if (existing) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('template_images')
          .update({ image_url: imageUrl })
          .eq('template_id', templateId);
        
        if (updateError) throw updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('template_images')
          .insert({ template_id: templateId, image_url: imageUrl });
        
        if (insertError) throw insertError;
      }
      
      // Update local state
      setTemplateImages(prev => ({ ...prev, [templateId]: imageUrl }));
      
      toast({
        title: "تم الرفع",
        description: "تم رفع صورة القالب بنجاح",
      });
      
      return imageUrl;
    } catch (error) {
      console.error('Error uploading template image:', error);
      toast({
        title: "خطأ",
        description: "فشل في رفع الصورة",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Delete template image
  const deleteTemplateImage = async (templateId: number) => {
    try {
      const { error } = await supabase
        .from('template_images')
        .delete()
        .eq('template_id', templateId);
      
      if (error) throw error;
      
      setTemplateImages(prev => {
        const updated = { ...prev };
        delete updated[templateId];
        return updated;
      });
      
      toast({
        title: "تم الحذف",
        description: "تم حذف صورة القالب",
      });
    } catch (error) {
      console.error('Error deleting template image:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف الصورة",
        variant: "destructive",
      });
    }
  };

  // Get image URL for a template (from DB or fallback to default)
  const getTemplateImage = (templateId: number, defaultThumbnail?: string) => {
    return templateImages[templateId] || null;
  };

  return {
    templateImages,
    loading,
    uploading,
    uploadTemplateImage,
    deleteTemplateImage,
    getTemplateImage,
    refetch: fetchTemplateImages,
  };
}
