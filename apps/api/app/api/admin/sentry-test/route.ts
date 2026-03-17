import { NextResponse } from "next/server";

/**
 * Temporary endpoint to verify Sentry is capturing errors in production.
 * Protected by ADMIN_SECRET. Remove after confirming Sentry works.
 *
 * Usage:
 *   curl -X POST https://your-api.vercel.app/api/admin/sentry-test \
 *     -H "Authorization: Bearer <ADMIN_SECRET>"
 */
export async function POST(request: Request): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  throw new Error(
    "Sentry production test — remove this endpoint after verifying",
  );
}
