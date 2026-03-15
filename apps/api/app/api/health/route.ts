import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import type { ApiResponse } from "@app-template/types";

interface HealthStatus {
  status: "healthy" | "unhealthy";
  timestamp: string;
  services: {
    database: "connected" | "disconnected";
  };
}

export async function GET(): Promise<NextResponse<ApiResponse<HealthStatus>>> {
  let dbStatus: "connected" | "disconnected" = "disconnected";

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("profiles").select("id").limit(1);
    if (error) {
      logger.error("Health check: database query failed", {
        supabaseCode: error.code,
        supabaseMessage: error.message,
        supabaseDetails: error.details,
        supabaseHint: error.hint,
      });
      dbStatus = "disconnected";
    } else {
      dbStatus = "connected";
    }
  } catch (err) {
    logger.error("Health check: unexpected error reaching database", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    dbStatus = "disconnected";
  }

  const healthy = dbStatus === "connected";
  const status: HealthStatus = {
    status: healthy ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    services: { database: dbStatus },
  };

  logger.info("Health check", { healthy, database: dbStatus });

  return NextResponse.json(
    { data: status, error: null },
    { status: healthy ? 200 : 503 },
  );
}
