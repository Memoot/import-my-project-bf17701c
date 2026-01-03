-- Add policy for public access to published landing pages
CREATE POLICY "Public can view published landing pages"
ON public.landing_pages
FOR SELECT
TO anon, authenticated
USING (is_published = true);