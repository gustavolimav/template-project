import { NextResponse } from "next/server";
import { readdir, readFile } from "fs/promises";
import path from "path";
import { getSql } from "@/lib/db";
import { logger } from "@/lib/logger";
import type { ApiResponse } from "@app-template/types";

// Node.js runtime — needs fs + direct TCP connection to Postgres
export const runtime = "nodejs";

// Copied here at build time by scripts/copy-migrations.js
const MIGRATIONS_DIR = path.join(process.cwd(), "migrations");

interface MigrationInfo {
  version: string;
  name: string;
  filename: string;
  applied: boolean;
}

interface MigrationsListData {
  migrations: MigrationInfo[];
  total: number;
  applied: number;
  pending: number;
}

interface MigrationsRunData {
  ran: string[];
  failed: string | null;
  message: string;
}

function requireAdminAuth(request: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

async function getMigrationFiles() {
  const files = await readdir(MIGRATIONS_DIR);
  return files
    .filter((f) => f.endsWith(".sql"))
    .sort()
    .map((filename) => {
      const match = /^(\d+)_(.+)\.sql$/.exec(filename);
      return {
        version: match?.[1] ?? filename,
        name: match?.[2]?.replace(/_/g, " ") ?? filename,
        filename,
      };
    });
}

async function getAppliedVersions(): Promise<Set<string>> {
  const sql = getSql();
  try {
    const rows = await sql<{ version: string }[]>`
      SELECT version FROM supabase_migrations.schema_migrations ORDER BY version
    `;
    return new Set(rows.map((r) => r.version));
  } catch {
    // Table doesn't exist yet — treat as no migrations applied
    return new Set();
  }
}

async function ensureMigrationsTable(): Promise<void> {
  const sql = getSql();
  await sql`
    CREATE SCHEMA IF NOT EXISTS supabase_migrations
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS supabase_migrations.schema_migrations (
      version TEXT NOT NULL,
      CONSTRAINT schema_migrations_pkey PRIMARY KEY (version)
    )
  `;
}

/**
 * GET /api/admin/migrations
 * Lists all migration files and whether each has been applied.
 * Requires: Authorization: Bearer <ADMIN_SECRET>
 */
export async function GET(
  request: Request,
): Promise<NextResponse<ApiResponse<MigrationsListData>>> {
  if (!requireAdminAuth(request)) {
    return NextResponse.json(
      { data: null, error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 },
    );
  }

  try {
    const [files, applied] = await Promise.all([
      getMigrationFiles(),
      getAppliedVersions(),
    ]);

    const migrations: MigrationInfo[] = files.map(({ version, name, filename }) => ({
      version,
      name,
      filename,
      applied: applied.has(version),
    }));

    const pendingCount = migrations.filter((m) => !m.applied).length;

    logger.info("Listed migrations", {
      total: migrations.length,
      pending: pendingCount,
    });

    return NextResponse.json({
      data: {
        migrations,
        total: migrations.length,
        applied: migrations.length - pendingCount,
        pending: pendingCount,
      },
      error: null,
    });
  } catch (err) {
    logger.error("Failed to list migrations", {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { data: null, error: { code: "INTERNAL_ERROR", message: "Failed to list migrations" } },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/migrations
 * Runs all pending migrations in order. Stops on first failure.
 * Requires: Authorization: Bearer <ADMIN_SECRET>
 *
 * Optional query param: ?dry_run=true — lists what would run without executing.
 */
export async function POST(
  request: Request,
): Promise<NextResponse<ApiResponse<MigrationsRunData>>> {
  if (!requireAdminAuth(request)) {
    return NextResponse.json(
      { data: null, error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const dryRun = searchParams.get("dry_run") === "true";

  try {
    const [files, applied] = await Promise.all([
      getMigrationFiles(),
      getAppliedVersions(),
    ]);

    const pending = files.filter(({ version }) => !applied.has(version));

    if (pending.length === 0) {
      return NextResponse.json({
        data: { ran: [], failed: null, message: "No pending migrations" },
        error: null,
      });
    }

    if (dryRun) {
      return NextResponse.json({
        data: {
          ran: pending.map((m) => m.filename),
          failed: null,
          message: `Dry run — ${pending.length} migration(s) would be applied`,
        },
        error: null,
      });
    }

    await ensureMigrationsTable();

    const sql = getSql();
    const ran: string[] = [];

    for (const { version, name, filename } of pending) {
      const sqlContent = await readFile(
        path.join(MIGRATIONS_DIR, filename),
        "utf-8",
      );

      logger.info("Applying migration", { version, name });

      try {
        await sql.begin(async (tx) => {
          await tx.unsafe(sqlContent);
          // version is digits-only (extracted via /^\d+/ regex) — safe to interpolate
          await tx.unsafe(
            `INSERT INTO supabase_migrations.schema_migrations (version) VALUES ('${version}') ON CONFLICT (version) DO NOTHING`,
          );
        });

        ran.push(filename);
        logger.info("Migration applied", { version, name });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        logger.error("Migration failed", { version, name, error: message });

        return NextResponse.json(
          {
            data: { ran, failed: filename, message: `Failed at ${filename}` },
            error: { code: "MIGRATION_FAILED", message: `${filename}: ${message}` },
          },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      data: {
        ran,
        failed: null,
        message: `Applied ${ran.length} migration(s)`,
      },
      error: null,
    });
  } catch (err) {
    logger.error("Failed to run migrations", {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { data: null, error: { code: "INTERNAL_ERROR", message: "Failed to run migrations" } },
      { status: 500 },
    );
  }
}
