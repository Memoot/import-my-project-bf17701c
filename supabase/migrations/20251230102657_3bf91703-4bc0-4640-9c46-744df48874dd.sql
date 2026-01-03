-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can create their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can update their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can delete their own campaigns" ON public.campaigns;

-- Create public policies (temporary for development)
CREATE POLICY "Anyone can view campaigns" 
ON public.campaigns 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create campaigns" 
ON public.campaigns 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update campaigns" 
ON public.campaigns 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete campaigns" 
ON public.campaigns 
FOR DELETE 
USING (true);

-- Make user_id nullable for public access
ALTER TABLE public.campaigns ALTER COLUMN user_id DROP NOT NULL;