import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key_name: string; // Alias for name
  key_hash: string;
  key_prefix: string;
  permissions: string[];
  last_used_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Compatibility fields
  service_name: string;
  key_type: "predefined" | "custom";
  api_key_value: string;
  description: string | null;
  category: "ai" | "payments" | "email" | "storage" | "other";
}

export interface CreateApiKeyInput {
  name?: string;
  key_name?: string;
  service_name?: string;
  key_type?: "predefined" | "custom";
  api_key_value?: string;
  description?: string;
  category?: "ai" | "payments" | "email" | "storage" | "other";
  permissions?: string[];
  expires_at?: string;
}

const transformKey = (data: any): ApiKey => ({
  ...data,
  key_name: data.name,
  service_name: data.name,
  key_type: 'custom',
  api_key_value: `${data.key_prefix}...`,
  description: null,
  category: 'other',
});

export function useApiKeys() {
  return useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("api_keys")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(transformKey) as ApiKey[];
    },
  });
}

// Simple hash function for demo purposes
const hashKey = async (key: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateApiKeyInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("غير مصرح");

      // Generate API key
      const rawKey = `mk_${crypto.randomUUID().replace(/-/g, '')}`;
      const keyHash = await hashKey(input.api_key_value || rawKey);
      const keyPrefix = (input.api_key_value || rawKey).substring(0, 10);

      const { data, error } = await supabase
        .from("api_keys")
        .insert({
          user_id: user.id,
          name: input.name || input.key_name || input.service_name || 'مفتاح جديد',
          key_hash: keyHash,
          key_prefix: keyPrefix,
          permissions: input.permissions || [],
          expires_at: input.expires_at || null,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      // Return with the raw key (only shown once)
      return { ...transformKey(data), rawKey, api_key_value: input.api_key_value || rawKey } as ApiKey & { rawKey: string };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast({ title: "تم بنجاح", description: "تم إنشاء مفتاح API بنجاح" });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في إنشاء مفتاح API",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CreateApiKeyInput> & { id: string }) => {
      const updateData: any = {};
      if (updates.name || updates.key_name || updates.service_name) {
        updateData.name = updates.name || updates.key_name || updates.service_name;
      }
      if (updates.permissions) updateData.permissions = updates.permissions;
      if (updates.expires_at) updateData.expires_at = updates.expires_at;

      const { error } = await supabase
        .from("api_keys")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast({ title: "تم بنجاح", description: "تم تحديث المفتاح" });
    },
    onError: (error: any) => {
      toast({ 
        title: "خطأ", 
        description: error.message || "فشل في تحديث المفتاح", 
        variant: "destructive" 
      });
    },
  });
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("api_keys")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast({ title: "تم بنجاح", description: "تم حذف المفتاح" });
    },
    onError: (error: any) => {
      toast({ 
        title: "خطأ", 
        description: error.message || "فشل في حذف المفتاح", 
        variant: "destructive" 
      });
    },
  });
}

export function useToggleApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("api_keys")
        .update({ is_active })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, { is_active }) => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast({ 
        title: "تم بنجاح", 
        description: is_active ? "تم تفعيل المفتاح" : "تم تعطيل المفتاح" 
      });
    },
    onError: (error: any) => {
      toast({ 
        title: "خطأ", 
        description: error.message || "فشل في تغيير حالة المفتاح", 
        variant: "destructive" 
      });
    },
  });
}

export const PREDEFINED_SERVICES = [
  { key_name: "OPENAI_API_KEY", service_name: "OpenAI", category: "ai" as const, description: "مفتاح API لخدمات OpenAI (GPT, DALL-E)", icon: "Brain" },
  { key_name: "GEMINI_API_KEY", service_name: "Google Gemini", category: "ai" as const, description: "مفتاح API لخدمات Google Gemini AI", icon: "Sparkles" },
  { key_name: "AWS_ACCESS_KEY_ID", service_name: "Amazon SES", category: "email" as const, description: "مفتاح الوصول لخدمة Amazon SES للبريد الإلكتروني", icon: "Mail" },
  { key_name: "STRIPE_SECRET_KEY", service_name: "Stripe", category: "payments" as const, description: "مفتاح Stripe للمدفوعات الإلكترونية", icon: "CreditCard" },
  { key_name: "PAYPAL_CLIENT_ID", service_name: "PayPal", category: "payments" as const, description: "معرف عميل PayPal للمدفوعات", icon: "Wallet" },
];

export const CATEGORY_LABELS: Record<string, string> = {
  ai: "الذكاء الاصطناعي",
  payments: "المدفوعات",
  email: "البريد الإلكتروني",
  storage: "التخزين",
  other: "أخرى",
};
