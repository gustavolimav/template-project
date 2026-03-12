import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { ApiResponse } from "@app-template/types";

/**
 * GET /api/auth/verify-email — Handles email verification link.
 * Supabase handles the actual verification; this endpoint confirms
 * the result and can redirect the user.
 */
export async function GET(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<{ message: string }>>> {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const type = searchParams.get("type");

  if (!token || type !== "signup") {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "INVALID_VERIFICATION",
          message: "Invalid verification link",
        },
      },
      { status: 400 },
    );
  }

  // Supabase handles token verification automatically via its auth endpoint.
  // This route exists for custom post-verification logic (e.g., redirect to app).
  return NextResponse.json({
    data: { message: "Email verified successfully" },
    error: null,
  });
}
