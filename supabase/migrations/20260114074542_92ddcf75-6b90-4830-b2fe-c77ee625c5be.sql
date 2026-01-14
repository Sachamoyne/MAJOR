-- Create a security definer function to delete user from auth.users
-- This function runs with elevated privileges to access auth schema
CREATE OR REPLACE FUNCTION public.delete_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete the user from auth.users when their profile is deleted
  DELETE FROM auth.users WHERE id = OLD.user_id;
  RETURN OLD;
END;
$$;

-- Create trigger to automatically delete auth user when profile is deleted
CREATE TRIGGER on_profile_deleted
  AFTER DELETE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.delete_auth_user();

-- Verify RLS policy exists for users to delete their own profile
-- (Already exists based on schema: "Users can delete their own profile")