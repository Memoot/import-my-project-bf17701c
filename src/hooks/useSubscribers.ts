import { useState, useEffect, useCallback } from 'react';
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

const STORAGE_KEY = 'subscribers';

const getSubscribersFromStorage = (): Subscriber[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveSubscribersToStorage = (subscribers: Subscriber[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribers));
};

export function useSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    const data = getSubscribersFromStorage();
    setSubscribers(data);
    setLoading(false);
  }, []);

  const addSubscriber = async (input: SubscriberInput): Promise<Subscriber | null> => {
    try {
      // Check for duplicate
      const existing = subscribers.find(s => s.email === input.email);
      if (existing) {
        throw new Error('هذا البريد الإلكتروني مسجل بالفعل');
      }

      const newSubscriber: Subscriber = {
        id: crypto.randomUUID(),
        user_id: 'local',
        email: input.email,
        name: input.name || null,
        status: 'active',
        source: input.source || 'manual',
        subscribed_at: new Date().toISOString(),
        unsubscribed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const updated = [newSubscriber, ...subscribers];
      setSubscribers(updated);
      saveSubscribersToStorage(updated);
      
      toast({ title: 'تم إضافة المشترك', description: 'تمت إضافة المشترك بنجاح' });
      return newSubscriber;
    } catch (error: any) {
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
      const updated = subscribers.map(s =>
        s.id === id ? { ...s, ...updates, updated_at: new Date().toISOString() } as Subscriber : s
      );
      setSubscribers(updated);
      saveSubscribersToStorage(updated);
      return true;
    } catch (error: any) {
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
      const updated = subscribers.filter(s => s.id !== id);
      setSubscribers(updated);
      saveSubscribersToStorage(updated);
      toast({ title: 'تم حذف المشترك', description: 'تم حذف المشترك بنجاح' });
      return true;
    } catch (error: any) {
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
