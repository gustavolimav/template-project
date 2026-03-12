import postgres from "postgres";

let _sql: ReturnType<typeof postgres> | null = null;

/**
 * Returns a Postgres client for running raw SQL (migrations, DDL).
 * Requires DATABASE_URL — get it from Supabase Dashboard → Settings → Database
 * → Connection string (use the "Direct connection" string, not pooled).
 */
export function getSql(): ReturnType<typeof postgres> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  if (!_sql) {
    _sql = postgres(url, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 15,
      ssl: url.includes("localhost") ? false : "require",
    });
  }
  return _sql;
}
