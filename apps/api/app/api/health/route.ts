import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
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
    dbStatus = error ? "disconnected" : "connected";
  } catch {
    dbStatus = "disconnected";
  }

  const status: HealthStatus = {
    status: dbStatus === "connected" ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
    },
  };

  return NextResponse.json(
    { data: status, error: null },
    { status: dbStatus === "connected" ? 200 : 503 },
  );
}
