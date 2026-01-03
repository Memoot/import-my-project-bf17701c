import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

const STORAGE_KEY = 'api_keys_encrypted';

// Simple encryption/decryption for demo
export const encryptApiKey = async (value: string): Promise<string> => btoa(value);
export const decryptApiKey = async (encrypted: string): Promise<string> => {
  try { return atob(encrypted); } catch { return encrypted; }
};

const getKeysFromStorage = (): ApiKey[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};

const saveKeysToStorage = (keys: ApiKey[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
};

export function useApiKeysEncrypted() {
  return useQuery({
    queryKey: ["api-keys-encrypted"],
    queryFn: async () => getKeysFromStorage(),
  });
}

export function useCreateApiKeyEncrypted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateApiKeyInput) => {
      const keys = getKeysFromStorage();
      const encryptedKey = await encryptApiKey(input.api_key_value);
      const newKey: ApiKey = {
        id: crypto.randomUUID(),
        ...input,
        api_key_value: encryptedKey,
        description: input.description || null,
        is_active: true,
        created_by: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      keys.unshift(newKey);
      saveKeysToStorage(keys);
      return newKey;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys-encrypted"] });
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast({ title: "تم بنجاح", description: "تم إضافة مفتاح API بنجاح (مشفر)" });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message.includes("duplicate") ? "اسم المفتاح موجود مسبقاً" : "فشل في إضافة مفتاح API",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateApiKeyEncrypted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, api_key_value, ...updates }: UpdateApiKeyInput) => {
      const keys = getKeysFromStorage();
      const index = keys.findIndex(k => k.id === id);
      if (index !== -1) {
        let encryptedKey = keys[index].api_key_value;
        if (api_key_value) {
          encryptedKey = await encryptApiKey(api_key_value);
        }
        keys[index] = { ...keys[index], ...updates, api_key_value: encryptedKey, updated_at: new Date().toISOString() };
        saveKeysToStorage(keys);
        return keys[index];
      }
      throw new Error("Key not found");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys-encrypted"] });
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast({ title: "تم بنجاح", description: "تم تحديث مفتاح API بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل في تحديث مفتاح API", variant: "destructive" });
    },
  });
}

export function useDecryptApiKey() {
  return useMutation({
    mutationFn: async (encryptedText: string) => await decryptApiKey(encryptedText),
  });
}

export function maskApiKey(key: string): string {
  if (!key || key.length < 8) return "••••••••";
  return "••••••••" + key.slice(-4);
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
