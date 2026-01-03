import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Subscriber {
  id: string;
  user_id: string;
  email: string;
  name: string | null;
  status: 'active' | 'unsubscribed' | 'bounced';
  tags: string[];
  metadata: Record<string, any>;
  subscribed_at: string;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
  source: string | null; // Compatibility field
}

export interface SubscriberInput {
  email: string;
  name?: string;
  tags?: string[];
}

export function useSubscribers() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['subscribers'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Subscriber[];
    },
  });

  const addSubscriber = async (input: SubscriberInput): Promise<Subscriber | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('غير مصرح');

      const { data, error } = await supabase
        .from('subscribers')
        .insert({
          user_id: user.id,
          email: input.email,
          name: input.name || null,
          tags: input.tags || [],
          status: 'active',
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') throw new Error('هذا البريد الإلكتروني مسجل بالفعل');
        throw error;
      }
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      toast({ title: 'تم إضافة المشترك', description: 'تمت إضافة المشترك بنجاح' });
      return data as Subscriber;
    } catch (error: any) {
      toast({
        title: 'خطأ في إضافة المشترك',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateSubscriber = async (id: string, updates: Partial<Subscriber>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('subscribers')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      return true;
    } catch (error: any) {
      toast({
        title: 'خطأ في التحديث',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteSubscriber = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('subscribers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      toast({ title: 'تم الحذف', description: 'تم حذف المشترك بنجاح' });
      return true;
    } catch (error: any) {
      toast({
        title: 'خطأ في الحذف',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const getStats = () => {
    const subscribers = query.data || [];
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      total: subscribers.length,
      active: subscribers.filter(s => s.status === 'active').length,
      unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length,
      thisMonth: subscribers.filter(s => new Date(s.subscribed_at) >= thisMonthStart).length,
    };
  };

  return {
    subscribers: query.data || [],
    loading: query.isLoading,
    isLoading: query.isLoading,
    fetchSubscribers: query.refetch,
    addSubscriber,
    updateSubscriber,
    deleteSubscriber,
    getStats,
    refetch: query.refetch,
  };
}

export function useAddSubscriber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SubscriberInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('غير مصرح');

      const { data, error } = await supabase
        .from('subscribers')
        .insert({
          user_id: user.id,
          email: input.email,
          name: input.name || null,
          tags: input.tags || [],
          status: 'active',
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') throw new Error('هذا البريد الإلكتروني مسجل بالفعل');
        throw error;
      }
      return data as Subscriber;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      toast({ title: 'تم إضافة المشترك', description: 'تمت إضافة المشترك بنجاح' });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في إضافة المشترك',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateSubscriber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Subscriber> & { id: string }) => {
      const { error } = await supabase
        .from('subscribers')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      toast({ title: 'تم التحديث', description: 'تم تحديث بيانات المشترك' });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في التحديث',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteSubscriber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('subscribers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      toast({ title: 'تم الحذف', description: 'تم حذف المشترك بنجاح' });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في الحذف',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
