-- Create advertisements table
CREATE TABLE public.advertisements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  advertiser_name TEXT NOT NULL,
  advertiser_email TEXT NOT NULL,
  advertiser_phone TEXT,
  ad_type TEXT NOT NULL DEFAULT 'banner', -- banner, sidebar, featured
  price DECIMAL(10,2) NOT NULL,
  duration_days INTEGER NOT NULL DEFAULT 30,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, active, expired, rejected
  is_featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

-- Public can view active advertisements
CREATE POLICY "Anyone can view active advertisements" 
ON public.advertisements 
FOR SELECT 
USING (status = 'active' AND (end_date IS NULL OR end_date > now()));

-- Admins can manage all advertisements
CREATE POLICY "Admins can manage advertisements" 
ON public.advertisements 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can insert advertisement requests (for ad submission)
CREATE POLICY "Anyone can submit advertisement requests" 
ON public.advertisements 
FOR INSERT 
WITH CHECK (status = 'pending');

-- Create ad pricing table
CREATE TABLE public.ad_pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  ad_type TEXT NOT NULL, -- banner, sidebar, featured
  price DECIMAL(10,2) NOT NULL,
  duration_days INTEGER NOT NULL,
  description TEXT,
  features TEXT[],
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for ad_pricing
ALTER TABLE public.ad_pricing ENABLE ROW LEVEL SECURITY;

-- Anyone can view active pricing
CREATE POLICY "Anyone can view active ad pricing" 
ON public.ad_pricing 
FOR SELECT 
USING (is_active = true);

-- Admins can manage pricing
CREATE POLICY "Admins can manage ad pricing" 
ON public.ad_pricing 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default pricing plans
INSERT INTO public.ad_pricing (name, ad_type, price, duration_days, description, features, is_popular) VALUES
('إعلان أساسي', 'banner', 99.00, 7, 'إعلان بانر لمدة أسبوع', ARRAY['ظهور في الصفحة الرئيسية', 'تقارير المشاهدات', 'دعم فني'], false),
('إعلان متميز', 'banner', 299.00, 30, 'إعلان بانر لمدة شهر', ARRAY['ظهور في جميع الصفحات', 'تقارير مفصلة', 'أولوية في العرض', 'دعم فني متميز'], true),
('إعلان جانبي', 'sidebar', 149.00, 14, 'إعلان في الشريط الجانبي', ARRAY['ظهور دائم', 'حجم مميز', 'تقارير المشاهدات'], false),
('إعلان مميز', 'featured', 499.00, 30, 'إعلان مميز في أعلى الصفحة', ARRAY['أعلى ظهور', 'تصميم مخصص', 'تقارير شاملة', 'دعم VIP', 'ضمان المشاهدات'], false);

-- Create trigger for updated_at
CREATE TRIGGER update_advertisements_updated_at
BEFORE UPDATE ON public.advertisements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ad_pricing_updated_at
BEFORE UPDATE ON public.ad_pricing
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();