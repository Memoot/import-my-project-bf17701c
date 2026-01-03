-- Create storage bucket for template images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'template-images', 
  'template-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Allow public read access
CREATE POLICY "Public can view template images"
ON storage.objects FOR SELECT
USING (bucket_id = 'template-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload template images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'template-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update template images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'template-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete template images"
ON storage.objects FOR DELETE
USING (bucket_id = 'template-images' AND auth.role() = 'authenticated');

-- Create table to store template image mappings
CREATE TABLE public.template_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id INTEGER NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.template_images ENABLE ROW LEVEL SECURITY;

-- Anyone can view template images
CREATE POLICY "Anyone can view template images"
ON public.template_images FOR SELECT
USING (true);

-- Authenticated users can manage template images
CREATE POLICY "Authenticated users can insert template images"
ON public.template_images FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update template images"
ON public.template_images FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete template images"
ON public.template_images FOR DELETE
USING (auth.role() = 'authenticated');

-- Add trigger for updated_at
CREATE TRIGGER update_template_images_updated_at
BEFORE UPDATE ON public.template_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();