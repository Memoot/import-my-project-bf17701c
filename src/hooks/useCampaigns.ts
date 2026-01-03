import { useState, useEffect, useCallback } from 'react';
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

// Use localStorage for now until tables are created
const STORAGE_KEY = 'campaigns';

const getCampaignsFromStorage = (): Campaign[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveCampaignsToStorage = (campaigns: Campaign[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
};

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    const data = getCampaignsFromStorage();
    setCampaigns(data);
    setLoading(false);
  }, []);

  const createCampaign = async (campaign: CampaignInput): Promise<Campaign | null> => {
    try {
      const newCampaign: Campaign = {
        id: crypto.randomUUID(),
        user_id: null,
        title: campaign.title,
        subject: campaign.subject || null,
        content: campaign.content,
        status: campaign.status || 'draft',
        scheduled_at: campaign.scheduled_at || null,
        sent_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const updated = [newCampaign, ...campaigns];
      setCampaigns(updated);
      saveCampaignsToStorage(updated);
      
      toast({ title: 'تم إنشاء الحملة بنجاح' });
      return newCampaign;
    } catch (error: any) {
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
      const updated = campaigns.map(c => 
        c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } as Campaign : c
      );
      setCampaigns(updated);
      saveCampaignsToStorage(updated);
      return true;
    } catch (error: any) {
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
      const updated = campaigns.filter(c => c.id !== id);
      setCampaigns(updated);
      saveCampaignsToStorage(updated);
      toast({ title: 'تم حذف الحملة بنجاح' });
      return true;
    } catch (error: any) {
      toast({
        title: 'خطأ في حذف الحملة',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const getCampaign = async (id: string): Promise<Campaign | null> => {
    return campaigns.find(c => c.id === id) || null;
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
