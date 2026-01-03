-- Create storage bucket for advertisement images
INSERT INTO storage.buckets (id, name, public) VALUES ('advertisements', 'advertisements', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for advertisement images
CREATE POLICY "Anyone can view advertisement images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'advertisements');

CREATE POLICY "Authenticated users can upload advertisement images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'advertisements' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can delete advertisement images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'advertisements' AND public.has_role(auth.uid(), 'admin'));