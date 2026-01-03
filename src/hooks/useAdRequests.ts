import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface AdRequest {
  id: string;
  user_id: string;
  package_id: string | null;
  title: string;
  description: string | null;
  link_url: string | null;
  image_url: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'expired';
  admin_notes: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export function useMyAdRequests() {
  return useQuery({
    queryKey: ["my-ad-requests"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("ad_requests")
        .select("*, ad_packages(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useAllAdRequests() {
  return useQuery({
    queryKey: ["all-ad-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ad_requests")
        .select("*, ad_packages(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useCreateAdRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestData: { title: string; description?: string; link_url?: string; image_url?: string; package_id?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("ad_requests")
        .insert([{ ...requestData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-ad-requests"] });
      toast({ title: "تم إرسال طلب الإعلان بنجاح", description: "سيتم مراجعته من قبل الإدارة" });
    },
    onError: (error: Error) => {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateAdRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<AdRequest> & { id: string }) => {
      const { error } = await supabase
        .from("ad_requests")
        .update(data)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-ad-requests"] });
      queryClient.invalidateQueries({ queryKey: ["all-ad-requests"] });
      toast({ title: "تم تحديث الطلب بنجاح" });
    },
    onError: (error: Error) => {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteAdRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("ad_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-ad-requests"] });
      toast({ title: "تم حذف الطلب بنجاح" });
    },
    onError: (error: Error) => {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    },
  });
}
