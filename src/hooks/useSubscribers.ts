import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Subscriber {
  id: string;
  user_id: string;
  email: string;
  name: string | null;
  status: 'active' | 'unsubscribed' | 'bounced';
  source: string | null;
  subscribed_at: string;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriberInput {
  email: string;
  name?: string;
  source?: string;
}

export function useSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      setSubscribers((data || []) as Subscriber[]);
    } catch (error: any) {
      console.error('Error fetching subscribers:', error);
      toast({
        title: 'خطأ في جلب المشتركين',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const addSubscriber = async (input: SubscriberInput): Promise<Subscriber | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('يجب تسجيل الدخول');
      }

      const { data, error } = await supabase
        .from('subscribers')
        .insert({
          user_id: user.id,
          email: input.email,
          name: input.name || null,
          source: input.source || 'manual',
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('هذا البريد الإلكتروني مسجل بالفعل');
        }
        throw error;
      }

      const subscriber = data as Subscriber;
      setSubscribers(prev => [subscriber, ...prev]);
      toast({
        title: 'تم إضافة المشترك',
        description: 'تمت إضافة المشترك بنجاح',
      });
      return subscriber;
    } catch (error: any) {
      console.error('Error adding subscriber:', error);
      toast({
        title: 'خطأ في إضافة المشترك',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateSubscriber = async (id: string, updates: Partial<SubscriberInput & { status: string }>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('subscribers')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setSubscribers(prev =>
        prev.map(s => s.id === id ? { ...s, ...updates } as Subscriber : s)
      );
      return true;
    } catch (error: any) {
      console.error('Error updating subscriber:', error);
      toast({
        title: 'خطأ في تحديث المشترك',
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

      setSubscribers(prev => prev.filter(s => s.id !== id));
      toast({
        title: 'تم حذف المشترك',
        description: 'تم حذف المشترك بنجاح',
      });
      return true;
    } catch (error: any) {
      console.error('Error deleting subscriber:', error);
      toast({
        title: 'خطأ في حذف المشترك',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const getStats = useCallback(() => {
    const total = subscribers.length;
    const active = subscribers.filter(s => s.status === 'active').length;
    const unsubscribed = subscribers.filter(s => s.status === 'unsubscribed').length;
    const thisMonth = subscribers.filter(s => {
      const subDate = new Date(s.subscribed_at);
      const now = new Date();
      return subDate.getMonth() === now.getMonth() && subDate.getFullYear() === now.getFullYear();
    }).length;

    return { total, active, unsubscribed, thisMonth };
  }, [subscribers]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  return {
    subscribers,
    loading,
    fetchSubscribers,
    addSubscriber,
    updateSubscriber,
    deleteSubscriber,
    getStats,
  };
}
