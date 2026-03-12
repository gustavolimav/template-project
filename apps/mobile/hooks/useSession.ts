import { useAuth } from "./useAuth";
import type { Session } from "@supabase/supabase-js";

/**
 * Hook to access the raw Supabase session.
 * Useful for components that need direct access to the access token.
 */
export function useSession(): Session | null {
  const { session } = useAuth();
  return session;
}
