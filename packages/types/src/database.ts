/**
 * Database row types matching Supabase schema.
 * Keep in sync with supabase/migrations/.
 */

/**
 * Row in the public.profiles table.
 * Auto-created by trigger when a user signs up via Supabase Auth.
 */
export interface ProfileRow {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}
