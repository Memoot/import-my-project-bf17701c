import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

export function useUploadedTemplates() {
  return useQuery({
    queryKey: ["uploaded-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("uploaded_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as UploadedTemplate[];
    },
  });
}

export function useCreateUploadedTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: Omit<UploadedTemplate, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("uploaded_templates")
        .insert(template)
        .select()
        .single();

      if (error) throw error;
      return data as UploadedTemplate;
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
      const { error } = await supabase
        .from("uploaded_templates")
        .delete()
        .eq("id", id);

      if (error) throw error;
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
      const { error } = await supabase
        .from("uploaded_templates")
        .update({ is_active })
        .eq("id", id);

      if (error) throw error;
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
