import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ApiKey {
  id: string;
  key_name: string;
  service_name: string;
  key_type: "predefined" | "custom";
  api_key_value: string;
  description: string | null;
  category: "ai" | "payments" | "email" | "storage" | "other";
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateApiKeyInput {
  key_name: string;
  service_name: string;
  key_type: "predefined" | "custom";
  api_key_value: string;
  description?: string;
  category: "ai" | "payments" | "email" | "storage" | "other";
}

export interface UpdateApiKeyInput {
  id: string;
  key_name?: string;
  service_name?: string;
  api_key_value?: string;
  description?: string;
  category?: "ai" | "payments" | "email" | "storage" | "other";
  is_active?: boolean;
}

export function useApiKeys() {
  return useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("api_keys")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching API keys:", error);
        throw error;
      }

      return data as ApiKey[];
    },
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateApiKeyInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("api_keys")
        .insert({
          ...input,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating API key:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast({
        title: "تم بنجاح",
        description: "تم إضافة مفتاح API بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message.includes("duplicate")
          ? "اسم المفتاح موجود مسبقاً"
          : "فشل في إضافة مفتاح API",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateApiKeyInput) => {
      const { data, error } = await supabase
        .from("api_keys")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating API key:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast({
        title: "تم بنجاح",
        description: "تم تحديث مفتاح API بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في تحديث مفتاح API",
        variant: "destructive",
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

      if (error) {
        console.error("Error deleting API key:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast({
        title: "تم بنجاح",
        description: "تم حذف مفتاح API بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في حذف مفتاح API",
        variant: "destructive",
      });
    },
  });
}

export function useToggleApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data, error } = await supabase
        .from("api_keys")
        .update({ is_active })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error toggling API key:", error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast({
        title: "تم بنجاح",
        description: data.is_active ? "تم تفعيل المفتاح" : "تم تعطيل المفتاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في تغيير حالة المفتاح",
        variant: "destructive",
      });
    },
  });
}

// Predefined services configuration
export const PREDEFINED_SERVICES = [
  {
    key_name: "OPENAI_API_KEY",
    service_name: "OpenAI",
    category: "ai" as const,
    description: "مفتاح API لخدمات OpenAI (GPT, DALL-E)",
    icon: "Brain",
  },
  {
    key_name: "GEMINI_API_KEY",
    service_name: "Google Gemini",
    category: "ai" as const,
    description: "مفتاح API لخدمات Google Gemini AI",
    icon: "Sparkles",
  },
  {
    key_name: "AWS_ACCESS_KEY_ID",
    service_name: "Amazon SES",
    category: "email" as const,
    description: "مفتاح الوصول لخدمة Amazon SES للبريد الإلكتروني",
    icon: "Mail",
  },
  {
    key_name: "STRIPE_SECRET_KEY",
    service_name: "Stripe",
    category: "payments" as const,
    description: "مفتاح Stripe للمدفوعات الإلكترونية",
    icon: "CreditCard",
  },
  {
    key_name: "PAYPAL_CLIENT_ID",
    service_name: "PayPal",
    category: "payments" as const,
    description: "معرف عميل PayPal للمدفوعات",
    icon: "Wallet",
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  ai: "الذكاء الاصطناعي",
  payments: "المدفوعات",
  email: "البريد الإلكتروني",
  storage: "التخزين",
  other: "أخرى",
};
