import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAdPackages, AdPackage } from "./useAdPackages";

// Re-export AdPackage types for backward compatibility
export interface Advertisement {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  status: string;
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

// Use ad_requests table for active advertisements
export function useActiveAdvertisements() {
  return useQuery({
    queryKey: ["advertisements", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ad_requests")
        .select("*, ad_packages(*)")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as any[];
    },
  });
}

// Use ad_packages table for pricing
export function useAdPricing() {
  return useQuery({
    queryKey: ["ad_pricing"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ad_packages")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true });

      if (error) throw error;
      // Map to old format for compatibility
      return (data || []).map((pkg: any) => ({
        id: pkg.id,
        name: pkg.name,
        ad_type: "standard",
        price: pkg.price,
        duration_days: pkg.duration_days,
        description: pkg.description,
        features: pkg.features,
        is_popular: false,
        is_active: pkg.is_active,
        created_at: pkg.created_at,
        updated_at: pkg.updated_at,
      })) as AdPricing[];
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
      advertiser_name?: string;
      advertiser_email?: string;
      advertiser_phone?: string;
      ad_type?: string;
      price?: number;
      duration_days?: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("ad_requests")
        .insert({
          title: adData.title,
          description: adData.description,
          image_url: adData.image_url,
          link_url: adData.link_url,
          user_id: user.id,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["advertisements"] });
      queryClient.invalidateQueries({ queryKey: ["my-ad-requests"] });
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
      // No-op for now - views tracking not implemented
      console.log("View increment for ad:", adId);
    },
  });
}

export function useIncrementAdClick() {
  return useMutation({
    mutationFn: async (adId: string) => {
      // No-op for now - clicks tracking not implemented
      console.log("Click increment for ad:", adId);
    },
  });
}
