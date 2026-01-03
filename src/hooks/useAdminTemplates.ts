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

export function useAdminTemplates() {
  return useQuery({
    queryKey: ["admin-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as AdminTemplate[];
    },
  });
}

export function useCreateAdminTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: Omit<AdminTemplate, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("admin_templates")
        .insert(template)
        .select()
        .single();

      if (error) throw error;
      return data as AdminTemplate;
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
      const { data: result, error } = await supabase
        .from("admin_templates")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result as AdminTemplate;
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
      const { error } = await supabase
        .from("admin_templates")
        .delete()
        .eq("id", id);

      if (error) throw error;
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
