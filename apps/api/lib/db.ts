import postgres from "postgres";

let _sql: ReturnType<typeof postgres> | null = null;

/**
 * Returns a Postgres client for running raw SQL (migrations, DDL).
 * Accepts DATABASE_URL or POSTGRES_URL_NON_POOLING (set automatically by the
 * Supabase Vercel integration). Must be a direct (non-pooled) connection.
 */
export function getSql(): ReturnType<typeof postgres> {
  const url =
    process.env.DATABASE_URL ?? process.env.POSTGRES_URL_NON_POOLING;
  if (!url)
    throw new Error(
      "DATABASE_URL or POSTGRES_URL_NON_POOLING is not set",
    );
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
