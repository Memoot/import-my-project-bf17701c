-- Create storage bucket for uploaded templates
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploaded-templates', 'uploaded-templates', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for uploaded templates bucket
CREATE POLICY "Admins can upload templates"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'uploaded-templates' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update templates"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'uploaded-templates' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete templates"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'uploaded-templates' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Anyone can view uploaded templates"
ON storage.objects
FOR SELECT
USING (bucket_id = 'uploaded-templates');

-- Create table to track uploaded HTML templates
CREATE TABLE IF NOT EXISTS public.uploaded_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'عام',
  thumbnail_url TEXT,
  html_content TEXT NOT NULL,
  css_content TEXT,
  js_content TEXT,
  assets JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.uploaded_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies for uploaded_templates
CREATE POLICY "Admins can manage uploaded templates"
ON public.uploaded_templates
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active uploaded templates"
ON public.uploaded_templates
FOR SELECT
USING (is_active = true);

-- Add trigger for updated_at
CREATE TRIGGER update_uploaded_templates_updated_at
BEFORE UPDATE ON public.uploaded_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();