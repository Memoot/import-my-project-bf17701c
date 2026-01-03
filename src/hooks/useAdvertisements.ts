import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Advertisement {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  advertiser_name: string;
  advertiser_email: string;
  advertiser_phone: string | null;
  ad_type: string;
  price: number;
  duration_days: number;
  start_date: string | null;
  end_date: string | null;
  status: string;
  is_featured: boolean;
  views_count: number;
  clicks_count: number;
  created_at: string;
  updated_at: string;
}

export interface AdPricing {
  id: string;
  name: string;
  ad_type: string;
  price: number;
  duration_days: number;
  description: string | null;
  features: string[] | null;
  is_popular: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useActiveAdvertisements() {
  return useQuery({
    queryKey: ["advertisements", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("advertisements")
        .select("*")
        .eq("status", "active")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Advertisement[];
    },
  });
}

export function useAdPricing() {
  return useQuery({
    queryKey: ["ad_pricing"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ad_pricing")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true });

      if (error) throw error;
      return data as AdPricing[];
    },
  });
}

export function useSubmitAdvertisement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (adData: {
      title: string;
      description?: string;
      image_url?: string;
      link_url?: string;
      advertiser_name: string;
      advertiser_email: string;
      advertiser_phone?: string;
      ad_type: string;
      price: number;
      duration_days: number;
    }) => {
      const { data, error } = await supabase
        .from("advertisements")
        .insert({
          ...adData,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["advertisements"] });
      toast({
        title: "تم إرسال طلب الإعلان",
        description: "سيتم مراجعة إعلانك والتواصل معك قريباً",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال الإعلان",
        variant: "destructive",
      });
      console.error("Error submitting ad:", error);
    },
  });
}

export function useIncrementAdView() {
  return useMutation({
    mutationFn: async (adId: string) => {
      // Simple increment via update - RPC not available
      const { data: ad } = await supabase
        .from("advertisements")
        .select("views_count")
        .eq("id", adId)
        .single();
      
      if (ad) {
        await supabase
          .from("advertisements")
          .update({ views_count: (ad.views_count || 0) + 1 })
          .eq("id", adId);
      }
    },
  });
}

export function useIncrementAdClick() {
  return useMutation({
    mutationFn: async (adId: string) => {
      // Simple increment via update - RPC not available
      const { data: ad } = await supabase
        .from("advertisements")
        .select("clicks_count")
        .eq("id", adId)
        .single();
      
      if (ad) {
        await supabase
          .from("advertisements")
          .update({ clicks_count: (ad.clicks_count || 0) + 1 })
          .eq("id", adId);
      }
    },
  });
}
