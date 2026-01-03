-- Function to automatically add user to subscribers when they sign up
CREATE OR REPLACE FUNCTION public.handle_new_user_subscriber()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Get the first admin user to be the owner of auto-created subscribers
  SELECT user_id INTO admin_user_id 
  FROM public.user_roles 
  WHERE role = 'admin' 
  LIMIT 1;
  
  -- If no admin exists, use the new user's own id (they own their own subscription)
  IF admin_user_id IS NULL THEN
    admin_user_id := new.id;
  END IF;
  
  -- Insert into subscribers if not already exists
  INSERT INTO public.subscribers (user_id, email, name, status, source)
  VALUES (
    admin_user_id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'name', NULL),
    'active',
    'user_signup'
  )
  ON CONFLICT (user_id, email) DO NOTHING;
  
  RETURN new;
END;
$$;

-- Create trigger to auto-add subscribers on user creation
DROP TRIGGER IF EXISTS on_auth_user_created_subscriber ON auth.users;
CREATE TRIGGER on_auth_user_created_subscriber
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_subscriber();

-- Copy existing users (from profiles) to subscribers
-- Get the first admin user ID for ownership
DO $$
DECLARE
  admin_id uuid;
BEGIN
  SELECT user_id INTO admin_id 
  FROM public.user_roles 
  WHERE role = 'admin' 
  LIMIT 1;
  
  -- If admin exists, copy all profiles to subscribers owned by admin
  IF admin_id IS NOT NULL THEN
    INSERT INTO public.subscribers (user_id, email, name, status, source, subscribed_at)
    SELECT 
      admin_id,
      p.email,
      p.display_name,
      'active',
      'user_signup',
      p.created_at
    FROM public.profiles p
    WHERE p.email IS NOT NULL
    ON CONFLICT (user_id, email) DO NOTHING;
  END IF;
END $$;