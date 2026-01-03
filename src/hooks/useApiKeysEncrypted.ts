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

// Encrypt API key before storing
async function encryptApiKey(plainText: string): Promise<string> {
  const { data, error } = await supabase.rpc('encrypt_api_key', {
    plain_text: plainText
  });
  
  if (error) {
    console.error("Error encrypting API key:", error);
    throw error;
  }
  
  return data as string;
}

// Decrypt API key for display (admin only)
async function decryptApiKey(encryptedText: string): Promise<string | null> {
  const { data, error } = await supabase.rpc('decrypt_api_key', {
    encrypted_text: encryptedText
  });
  
  if (error) {
    console.error("Error decrypting API key:", error);
    return null;
  }
  
  return data as string;
}

export function useApiKeysEncrypted() {
  return useQuery({
    queryKey: ["api-keys-encrypted"],
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

export function useCreateApiKeyEncrypted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateApiKeyInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Encrypt the API key before storing
      const encryptedKey = await encryptApiKey(input.api_key_value);
      
      const { data, error } = await supabase
        .from("api_keys")
        .insert({
          ...input,
          api_key_value: encryptedKey,
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
      queryClient.invalidateQueries({ queryKey: ["api-keys-encrypted"] });
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast({
        title: "تم بنجاح",
        description: "تم إضافة مفتاح API بنجاح (مشفر)",
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

export function useUpdateApiKeyEncrypted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, api_key_value, ...updates }: UpdateApiKeyInput) => {
      let encryptedKey: string | undefined;
      
      // Only encrypt if new key value is provided
      if (api_key_value) {
        encryptedKey = await encryptApiKey(api_key_value);
      }
      
      const updateData = {
        ...updates,
        ...(encryptedKey && { api_key_value: encryptedKey }),
      };
      
      const { data, error } = await supabase
        .from("api_keys")
        .update(updateData)
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
      queryClient.invalidateQueries({ queryKey: ["api-keys-encrypted"] });
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

export function useDecryptApiKey() {
  return useMutation({
    mutationFn: async (encryptedText: string) => {
      return await decryptApiKey(encryptedText);
    },
  });
}

// Mask API key for display (show only last 4 characters)
export function maskApiKey(key: string): string {
  if (!key || key.length < 8) return "••••••••";
  return "••••••••" + key.slice(-4);
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
