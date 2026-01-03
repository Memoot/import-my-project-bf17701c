import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface AdminTemplate {
  id: string;
  name: string;
  category: string;
  description: string | null;
  thumbnail_url: string | null;
  hero_image_url: string | null;
  template_data: Record<string, any>;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// Mock data since table doesn't exist
const mockTemplates: AdminTemplate[] = [];

export function useAdminTemplates() {
  return useQuery({
    queryKey: ["admin-templates"],
    queryFn: async () => {
      // Return empty array - templates managed differently now
      return mockTemplates;
    },
  });
}

export function useCreateAdminTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: Omit<AdminTemplate, "id" | "created_at" | "updated_at">) => {
      // Not implemented - return mock
      return { ...template, id: "mock", created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as AdminTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-templates"] });
      toast({
        title: "تم الإنشاء",
        description: "تم إنشاء القالب بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في إنشاء القالب",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateAdminTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<AdminTemplate> & { id: string }) => {
      // Not implemented - return mock
      return { ...data, id, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as AdminTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-templates"] });
      toast({
        title: "تم الحفظ",
        description: "تم حفظ التغييرات بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في حفظ التغييرات",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteAdminTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Not implemented
      console.log("Delete template:", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-templates"] });
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
