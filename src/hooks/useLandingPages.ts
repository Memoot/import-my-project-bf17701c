import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface LandingPageData {
  id: string;
  user_id: string;
  name: string;
  template_id: number | null;
  pages: any[];
  settings: Record<string, any>;
  is_published: boolean;
  published_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useLandingPages() {
  return useQuery({
    queryKey: ["landing-pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("landing_pages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as LandingPageData[];
    },
  });
}

export function useLandingPage(id: string | undefined) {
  return useQuery({
    queryKey: ["landing-page", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as LandingPageData;
    },
    enabled: !!id,
  });
}

export function useCreateLandingPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      template_id?: number;
      pages: any[];
      settings: Record<string, any>;
      user_id: string;
    }) => {
      const { data: result, error } = await supabase
        .from("landing_pages")
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result as LandingPageData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landing-pages"] });
      toast({
        title: "تم الإنشاء",
        description: "تم إنشاء صفحة الهبوط بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل في إنشاء صفحة الهبوط",
        variant: "destructive",
      });
      console.error(error);
    },
  });
}

export function useUpdateLandingPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Partial<LandingPageData> & { id: string }) => {
      const { data: result, error } = await supabase
        .from("landing_pages")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result as LandingPageData;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["landing-pages"] });
      queryClient.invalidateQueries({ queryKey: ["landing-page", data.id] });
      toast({
        title: "تم الحفظ",
        description: "تم حفظ التغييرات بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل في حفظ التغييرات",
        variant: "destructive",
      });
      console.error(error);
    },
  });
}

export function useDeleteLandingPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("landing_pages")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landing-pages"] });
      toast({
        title: "تم الحذف",
        description: "تم حذف صفحة الهبوط بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل في حذف صفحة الهبوط",
        variant: "destructive",
      });
      console.error(error);
    },
  });
}

export function useDuplicateLandingPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, user_id }: { id: string; user_id: string }) => {
      // First get the original
      const { data: original, error: fetchError } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Create a copy
      const { data: result, error } = await supabase
        .from("landing_pages")
        .insert({
          name: `${original.name} (نسخة)`,
          template_id: original.template_id,
          pages: original.pages,
          settings: original.settings,
          user_id: user_id,
          is_published: false,
        })
        .select()
        .single();

      if (error) throw error;
      return result as LandingPageData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landing-pages"] });
      toast({
        title: "تم النسخ",
        description: "تم نسخ صفحة الهبوط بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل في نسخ صفحة الهبوط",
        variant: "destructive",
      });
      console.error(error);
    },
  });
}
