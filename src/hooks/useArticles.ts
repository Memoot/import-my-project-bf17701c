import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  author_id: string | null;
  category: string | null;
  tags: string[] | null;
  is_published: boolean;
  published_at: string | null;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export function usePublishedArticles() {
  return useQuery({
    queryKey: ["published-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data as Article[];
    },
  });
}

export function useAllArticles() {
  return useQuery({
    queryKey: ["all-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Article[];
    },
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (error) throw error;
      return data as Article | null;
    },
    enabled: !!slug,
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleData: { title: string; slug: string; content: string; excerpt?: string; cover_image?: string; category?: string; tags?: string[]; is_published?: boolean; published_at?: string | null }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("articles")
        .insert([{ ...articleData, author_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-articles"] });
      queryClient.invalidateQueries({ queryKey: ["published-articles"] });
      toast({ title: "تم إضافة المقال بنجاح" });
    },
    onError: (error: Error) => {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Article> & { id: string }) => {
      const { error } = await supabase
        .from("articles")
        .update(data)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-articles"] });
      queryClient.invalidateQueries({ queryKey: ["published-articles"] });
      toast({ title: "تم تحديث المقال بنجاح" });
    },
    onError: (error: Error) => {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-articles"] });
      queryClient.invalidateQueries({ queryKey: ["published-articles"] });
      toast({ title: "تم حذف المقال بنجاح" });
    },
    onError: (error: Error) => {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    },
  });
}
