import { useState, useEffect, useCallback } from "react";

export interface TemplateImage {
  id: string;
  template_id: number;
  image_url: string;
  created_at: string;
}

// Mock implementation - table doesn't exist in database
export function useTemplateImages() {
  const [templateImages, setTemplateImages] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchTemplateImages = useCallback(async () => {
    // No-op: table doesn't exist
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTemplateImages();
  }, [fetchTemplateImages]);

  const uploadTemplateImage = useCallback(async (
    templateId: number,
    file: File
  ): Promise<string | null> => {
    // Mock implementation
    setUploading(true);
    try {
      // Create a local URL for preview
      const url = URL.createObjectURL(file);
      setTemplateImages(prev => new Map(prev).set(templateId, url));
      return url;
    } finally {
      setUploading(false);
    }
  }, []);

  const deleteTemplateImage = useCallback(async (templateId: number) => {
    setTemplateImages(prev => {
      const newMap = new Map(prev);
      newMap.delete(templateId);
      return newMap;
    });
  }, []);

  const getTemplateImage = useCallback((
    templateId: number,
    defaultThumbnail?: string
  ): string | null => {
    return templateImages.get(templateId) || defaultThumbnail || null;
  }, [templateImages]);

  return {
    templateImages: Object.fromEntries(templateImages),
    loading,
    uploading,
    uploadTemplateImage,
    deleteTemplateImage,
    getTemplateImage,
    refetch: fetchTemplateImages,
  };
}
