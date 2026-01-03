-- Drop the dangerous public access policies
DROP POLICY IF EXISTS "Anyone can view campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Anyone can create campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Anyone can update campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Anyone can delete campaigns" ON public.campaigns;

-- Create secure user-scoped RLS policies
CREATE POLICY "Users can view own campaigns" 
ON public.campaigns 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own campaigns" 
ON public.campaigns 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns" 
ON public.campaigns 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own campaigns" 
ON public.campaigns 
FOR DELETE 
USING (auth.uid() = user_id);

-- Make user_id required for new campaigns
ALTER TABLE public.campaigns ALTER COLUMN user_id SET NOT NULL;