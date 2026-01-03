import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export interface LandingPageData {
  id: string;
  user_id: string;
  name: string;
  template_id: number | null;
  pages: any[];
  settings: Record<string, any>;
  is_published: boolean;
  published_url: string | null;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'landing_pages';

const getPagesFromStorage = (): LandingPageData[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const savePagesToStorage = (pages: LandingPageData[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
};

export function useLandingPages() {
  return useQuery({
    queryKey: ["landing-pages"],
    queryFn: async () => {
      return getPagesFromStorage();
    },
  });
}

export function useLandingPage(id: string | undefined) {
  return useQuery({
    queryKey: ["landing-page", id],
    queryFn: async () => {
      if (!id) return null;
      const pages = getPagesFromStorage();
      return pages.find(p => p.id === id) || null;
    },
    enabled: !!id,
  });
}

export function useCreateLandingPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      template_id?: number;
      pages: any[];
      settings: Record<string, any>;
      user_id: string;
    }) => {
      const pages = getPagesFromStorage();
      const newPage: LandingPageData = {
        id: crypto.randomUUID(),
        user_id: data.user_id,
        name: data.name,
        template_id: data.template_id || null,
        pages: data.pages,
        settings: data.settings,
        is_published: false,
        published_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      pages.unshift(newPage);
      savePagesToStorage(pages);
      return newPage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landing-pages"] });
      toast({ title: "تم الإنشاء", description: "تم إنشاء صفحة الهبوط بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل في إنشاء صفحة الهبوط", variant: "destructive" });
    },
  });
}

export function useUpdateLandingPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<LandingPageData> & { id: string }) => {
      const pages = getPagesFromStorage();
      const index = pages.findIndex(p => p.id === id);
      if (index !== -1) {
        pages[index] = { ...pages[index], ...data, updated_at: new Date().toISOString() };
        savePagesToStorage(pages);
        return pages[index];
      }
      throw new Error("Page not found");
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["landing-pages"] });
      queryClient.invalidateQueries({ queryKey: ["landing-page", data.id] });
      toast({ title: "تم الحفظ", description: "تم حفظ التغييرات بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل في حفظ التغييرات", variant: "destructive" });
    },
  });
}

export function useDeleteLandingPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const pages = getPagesFromStorage().filter(p => p.id !== id);
      savePagesToStorage(pages);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landing-pages"] });
      toast({ title: "تم الحذف", description: "تم حذف صفحة الهبوط بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل في حذف صفحة الهبوط", variant: "destructive" });
    },
  });
}

export function useDuplicateLandingPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, user_id }: { id: string; user_id: string }) => {
      const pages = getPagesFromStorage();
      const original = pages.find(p => p.id === id);
      if (!original) throw new Error("Page not found");

      const newPage: LandingPageData = {
        ...original,
        id: crypto.randomUUID(),
        name: `${original.name} (نسخة)`,
        user_id,
        is_published: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      pages.unshift(newPage);
      savePagesToStorage(pages);
      return newPage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landing-pages"] });
      toast({ title: "تم النسخ", description: "تم نسخ صفحة الهبوط بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل في نسخ صفحة الهبوط", variant: "destructive" });
    },
  });
}
