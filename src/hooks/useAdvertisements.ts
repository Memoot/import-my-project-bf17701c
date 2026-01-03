import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Advertisement {
  id: string;
  request_id: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  position: string;
  priority: number;
  impressions_count: number;
  clicks_count: number;
  views_count: number; // Alias for impressions_count
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_featured: boolean; // Based on priority
  advertiser_name: string; // Default value
  created_at: string;
  updated_at: string;
}

export interface AdPricing {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_days: number;
  features: any[];
  is_active: boolean;
  is_popular: boolean; // Based on display_order
  ad_type: string; // Default value
  display_order: number;
  created_at: string;
  updated_at: string;
}

const transformAd = (data: any): Advertisement => ({
  ...data,
  views_count: data.impressions_count || 0,
  is_featured: (data.priority || 0) > 5,
  advertiser_name: 'معلن',
});

const transformPricing = (data: any): AdPricing => ({
  ...data,
  is_popular: data.display_order === 2,
  ad_type: 'standard',
});

// Get active advertisements for display
export function useActiveAdvertisements() {
  return useQuery({
    queryKey: ["advertisements", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("advertisements")
        .select("*")
        .eq("is_active", true)
        .gte("end_date", new Date().toISOString().split('T')[0])
        .lte("start_date", new Date().toISOString().split('T')[0])
        .order("priority", { ascending: false });

      if (error) throw error;
      return (data || []).map(transformAd) as Advertisement[];
    },
  });
}

// Get ad pricing packages
export function useAdPricing() {
  return useQuery({
    queryKey: ["ad_pricing"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ad_packages")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return (data || []).map(transformPricing) as AdPricing[];
    },
  });
}

// Submit advertisement request
export function useSubmitAdvertisement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (adData: {
      title: string;
      description?: string;
      image_url?: string;
      link_url?: string;
      package_id?: string;
      ad_type?: string;
      price?: number;
      duration_days?: number;
      advertiser_name?: string;
      advertiser_email?: string;
      advertiser_phone?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("يرجى تسجيل الدخول أولاً");

      const { data, error } = await supabase
        .from("ad_requests")
        .insert({
          title: adData.title,
          description: adData.description,
          image_url: adData.image_url,
          link_url: adData.link_url,
          package_id: adData.package_id,
          user_id: user.id,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-ad-requests"] });
      toast({
        title: "تم إرسال طلب الإعلان",
        description: "سيتم مراجعة إعلانك والتواصل معك قريباً",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء إرسال الإعلان",
        variant: "destructive",
      });
    },
  });
}

// Increment ad view count
export function useIncrementAdView() {
  return useMutation({
    mutationFn: async (adId: string) => {
      const { data: ad } = await supabase
        .from("advertisements")
        .select("impressions_count")
        .eq("id", adId)
        .single();

      if (ad) {
        await supabase
          .from("advertisements")
          .update({ impressions_count: (ad.impressions_count || 0) + 1 })
          .eq("id", adId);
      }
    },
  });
}

// Increment ad click count
export function useIncrementAdClick() {
  return useMutation({
    mutationFn: async (adId: string) => {
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
