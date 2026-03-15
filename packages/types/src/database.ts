// Re-export generated types — do not edit manually.
// Regenerate with: pnpm supabase:types
export type { Database, Json } from "./database.generated";

// Convenience helpers
import type { Database } from "./database.generated";

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

/** Row in the public.profiles table. */
export type ProfileRow = Tables<"profiles">;
