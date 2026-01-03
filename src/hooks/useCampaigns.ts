import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  title: string; // Alias for name
  subject: string;
  content: any[];
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduled_at: string | null;
  sent_at: string | null;
  recipients_count: number;
  opens_count: number;
  clicks_count: number;
  created_at: string;
  updated_at: string;
}

export interface CampaignInput {
  title: string;
  name?: string;
  subject?: string;
  content: any[];
  status?: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduled_at?: string;
}

const transformCampaign = (data: any): Campaign => ({
  ...data,
  title: data.name,
});

export function useCampaigns() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(transformCampaign) as Campaign[];
    },
  });

  const createCampaign = async (input: CampaignInput): Promise<Campaign | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('غير مصرح');

      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          user_id: user.id,
          name: input.title || input.name,
          subject: input.subject || input.title || input.name,
          content: input.content,
          status: input.status || 'draft',
          scheduled_at: input.scheduled_at || null,
        })
        .select()
        .single();

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({ title: 'تم إنشاء الحملة بنجاح' });
      return transformCampaign(data);
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
      const updateData: any = { ...updates };
      if (updates.title) updateData.name = updates.title;
      delete updateData.title;

      const { error } = await supabase
        .from('campaigns')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', id] });
      toast({ title: 'تم حفظ التغييرات' });
      return true;
    } catch (error: any) {
      toast({
        title: 'خطأ في حفظ الحملة',
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
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
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
    const campaign = query.data?.find(c => c.id === id);
    if (campaign) return campaign;

    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return null;
    return transformCampaign(data);
  };

  const fetchCampaigns = () => query.refetch();

  return {
    campaigns: query.data || [],
    loading: query.isLoading,
    isLoading: query.isLoading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    getCampaign,
    fetchCampaigns,
    refetch: query.refetch,
  };
}

export function useCampaign(id: string | undefined) {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data ? transformCampaign(data) : null;
    },
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CampaignInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('غير مصرح');

      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          user_id: user.id,
          name: input.title || input.name,
          subject: input.subject || input.title || input.name,
          content: input.content,
          status: input.status || 'draft',
          scheduled_at: input.scheduled_at || null,
        })
        .select()
        .single();

      if (error) throw error;
      return transformCampaign(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({ title: 'تم إنشاء الحملة بنجاح' });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في إنشاء الحملة',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CampaignInput> & { id: string }) => {
      const updateData: any = { ...updates };
      if (updates.title) updateData.name = updates.title;
      delete updateData.title;

      const { error } = await supabase
        .from('campaigns')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', id] });
      toast({ title: 'تم حفظ التغييرات' });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في حفظ الحملة',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({ title: 'تم حذف الحملة بنجاح' });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في حذف الحملة',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
