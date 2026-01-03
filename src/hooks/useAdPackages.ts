import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface AdPackage {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_days: number;
  features: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function useAdPackages() {
  return useQuery({
    queryKey: ["ad-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ad_packages")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as AdPackage[];
    },
  });
}

export function useCreateAdPackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (packageData: Omit<AdPackage, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("ad_packages")
        .insert([packageData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ad-packages"] });
      toast({ title: "تم إضافة الباقة بنجاح" });
    },
    onError: (error: Error) => {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateAdPackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<AdPackage> & { id: string }) => {
      const { error } = await supabase
        .from("ad_packages")
        .update(data)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ad-packages"] });
      toast({ title: "تم تحديث الباقة بنجاح" });
    },
    onError: (error: Error) => {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteAdPackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("ad_packages")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ad-packages"] });
      toast({ title: "تم حذف الباقة بنجاح" });
    },
    onError: (error: Error) => {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    },
  });
}
