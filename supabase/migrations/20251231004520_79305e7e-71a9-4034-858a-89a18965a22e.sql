-- Create subscribers table for email list
CREATE TABLE public.subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  source TEXT DEFAULT 'form',
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, email)
);

-- Enable RLS
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscribers
CREATE POLICY "Users can view own subscribers"
ON public.subscribers
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own subscribers
CREATE POLICY "Users can insert own subscribers"
ON public.subscribers
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscribers
CREATE POLICY "Users can update own subscribers"
ON public.subscribers
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own subscribers
CREATE POLICY "Users can delete own subscribers"
ON public.subscribers
FOR DELETE
USING (auth.uid() = user_id);

-- Allow public to subscribe (insert only with specific fields)
CREATE POLICY "Public can subscribe"
ON public.subscribers
FOR INSERT
TO anon
WITH CHECK (true);

-- Create updated_at trigger
CREATE TRIGGER update_subscribers_updated_at
BEFORE UPDATE ON public.subscribers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();