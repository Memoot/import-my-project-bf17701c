-- Remove the dangerous unrestricted public insert policy
-- The subscribe edge function uses service role key and will still work
DROP POLICY IF EXISTS "Public can subscribe" ON public.subscribers;