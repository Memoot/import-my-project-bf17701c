import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export interface UploadedTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  thumbnail_url: string | null;
  html_content: string;
  css_content: string | null;
  js_content: string | null;
  assets: any[];
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// Mock implementation - table doesn't exist in database
const mockTemplates: UploadedTemplate[] = [];

export function useUploadedTemplates() {
  return useQuery({
    queryKey: ["uploaded-templates"],
    queryFn: async () => {
      // Return empty array - table doesn't exist
      return mockTemplates;
    },
  });
}

export function useCreateUploadedTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: Omit<UploadedTemplate, "id" | "created_at" | "updated_at">) => {
      // Mock: add to local array
      const newTemplate: UploadedTemplate = {
        ...template,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockTemplates.push(newTemplate);
      return newTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uploaded-templates"] });
      toast({
        title: "تم الرفع",
        description: "تم رفع القالب بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في رفع القالب",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteUploadedTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const index = mockTemplates.findIndex(t => t.id === id);
      if (index > -1) {
        mockTemplates.splice(index, 1);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uploaded-templates"] });
      toast({
        title: "تم الحذف",
        description: "تم حذف القالب بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في حذف القالب",
        variant: "destructive",
      });
    },
  });
}

export function useToggleUploadedTemplateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const template = mockTemplates.find(t => t.id === id);
      if (template) {
        template.is_active = is_active;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["uploaded-templates"] });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في تحديث الحالة",
        variant: "destructive",
      });
    },
  });
}
