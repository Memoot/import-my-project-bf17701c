import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface LandingPage {
  id: string;
  user_id: string;
  title: string;
  name: string; // Alias for title
  slug: string;
  description: string | null;
  template_id: string | null;
  content: Record<string, any>;
  pages: any[]; // Alias for sections in content
  settings: Record<string, any>;
  is_published: boolean;
  published_at: string | null;
  published_url: string | null;
  views_count: number;
  conversions_count: number;
  created_at: string;
  updated_at: string;
}

export interface LandingPageData extends LandingPage {}

export interface LandingPageInput {
  title?: string;
  name?: string;
  slug?: string;
  description?: string;
  template_id?: string | number;
  content?: Record<string, any>;
  pages?: any[];
  settings?: Record<string, any>;
  user_id?: string;
}

const transformPage = (data: any): LandingPage => ({
  ...data,
  name: data.title,
  pages: data.content?.sections || [],
  published_url: data.is_published ? `/p/${data.slug}` : null,
});

export function useLandingPages() {
  return useQuery({
    queryKey: ["landing-pages"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(transformPage) as LandingPage[];
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
        .maybeSingle();

      if (error) throw error;
      return data ? transformPage(data) : null;
    },
    enabled: !!id,
  });
}

export function useCreateLandingPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LandingPageInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("غير مصرح");

      const title = input.title || input.name || 'صفحة جديدة';
      const slug = input.slug || `page-${Date.now()}`;

      const { data, error } = await supabase
        .from("landing_pages")
        .insert({
          user_id: input.user_id || user.id,
          title,
          slug,
          description: input.description || null,
          template_id: input.template_id?.toString() || null,
          content: input.content || { sections: input.pages || [] },
          settings: input.settings || {},
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') throw new Error('هذا الرابط مستخدم بالفعل');
        throw error;
      }
      return transformPage(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landing-pages"] });
      toast({ title: "تم الإنشاء", description: "تم إنشاء صفحة الهبوط بنجاح" });
    },
    onError: (error: any) => {
      toast({ 
        title: "خطأ", 
        description: error.message || "فشل في إنشاء صفحة الهبوط", 
        variant: "destructive" 
      });
    },
  });
}

export function useUpdateLandingPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<LandingPageInput> & { id: string }) => {
      const updateData: any = {};
      
      if (input.title || input.name) updateData.title = input.title || input.name;
      if (input.slug) updateData.slug = input.slug;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.template_id !== undefined) updateData.template_id = input.template_id?.toString();
      if (input.content) updateData.content = input.content;
      if (input.pages) updateData.content = { sections: input.pages };
      if (input.settings) updateData.settings = input.settings;

      const { error } = await supabase
        .from("landing_pages")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["landing-pages"] });
      queryClient.invalidateQueries({ queryKey: ["landing-page", id] });
      toast({ title: "تم الحفظ", description: "تم حفظ التغييرات بنجاح" });
    },
    onError: (error: any) => {
      toast({ 
        title: "خطأ", 
        description: error.message || "فشل في حفظ التغييرات", 
        variant: "destructive" 
      });
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
      toast({ title: "تم الحذف", description: "تم حذف صفحة الهبوط بنجاح" });
    },
    onError: (error: any) => {
      toast({ 
        title: "خطأ", 
        description: error.message || "فشل في حذف صفحة الهبوط", 
        variant: "destructive" 
      });
    },
  });
}

export function useDuplicateLandingPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, user_id }: { id: string; user_id?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("غير مصرح");

      // Get original page
      const { data: original, error: fetchError } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Create copy
      const { data, error } = await supabase
        .from("landing_pages")
        .insert({
          user_id: user_id || user.id,
          title: `${original.title} (نسخة)`,
          slug: `${original.slug}-copy-${Date.now()}`,
          description: original.description,
          template_id: original.template_id,
          content: original.content,
          settings: original.settings,
          is_published: false,
        })
        .select()
        .single();

      if (error) throw error;
      return transformPage(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landing-pages"] });
      toast({ title: "تم النسخ", description: "تم نسخ صفحة الهبوط بنجاح" });
    },
    onError: (error: any) => {
      toast({ 
        title: "خطأ", 
        description: error.message || "فشل في نسخ صفحة الهبوط", 
        variant: "destructive" 
      });
    },
  });
}
