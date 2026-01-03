-- Remove insecure encryption functions that use hardcoded keys
DROP FUNCTION IF EXISTS public.encrypt_api_key(text, text);
DROP FUNCTION IF EXISTS public.decrypt_api_key(text, text);