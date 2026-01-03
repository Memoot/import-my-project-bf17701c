import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Campaign {
  id: string;
  user_id: string | null;
  title: string;
  subject: string | null;
  content: any[];
  status: 'draft' | 'scheduled' | 'sent';
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignInput {
  title: string;
  subject?: string;
  content: any[];
  status?: 'draft' | 'scheduled' | 'sent';
  scheduled_at?: string;
}

const mapCampaign = (data: any): Campaign => ({
  id: data.id,
  user_id: data.user_id,
  title: data.title,
  subject: data.subject,
  content: Array.isArray(data.content) ? data.content : [],
  status: data.status as 'draft' | 'scheduled' | 'sent',
  scheduled_at: data.scheduled_at,
  sent_at: data.sent_at,
  created_at: data.created_at,
  updated_at: data.updated_at,
});

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns((data || []).map(mapCampaign));
    } catch (error: any) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: 'خطأ في جلب الحملات',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const createCampaign = async (campaign: CampaignInput): Promise<Campaign | null> => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('يجب تسجيل الدخول لإنشاء حملة');
      }

      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          title: campaign.title,
          subject: campaign.subject || null,
          content: campaign.content,
          status: campaign.status || 'draft',
          scheduled_at: campaign.scheduled_at || null,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      const mappedCampaign = mapCampaign(data);
      setCampaigns(prev => [mappedCampaign, ...prev]);
      return mappedCampaign;
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast({
        title: 'خطأ في إنشاء الحملة',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateCampaign = async (id: string, updates: Partial<CampaignInput>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      setCampaigns(prev => 
        prev.map(c => c.id === id ? { ...c, ...updates } as Campaign : c)
      );
      return true;
    } catch (error: any) {
      console.error('Error updating campaign:', error);
      toast({
        title: 'خطأ في تحديث الحملة',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteCampaign = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCampaigns(prev => prev.filter(c => c.id !== id));
      toast({
        title: 'تم حذف الحملة',
        description: 'تم حذف الحملة بنجاح',
      });
      return true;
    } catch (error: any) {
      console.error('Error deleting campaign:', error);
      toast({
        title: 'خطأ في حذف الحملة',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const getCampaign = async (id: string): Promise<Campaign | null> => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data ? mapCampaign(data) : null;
    } catch (error: any) {
      console.error('Error fetching campaign:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    campaigns,
    loading,
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    getCampaign,
  };
}
