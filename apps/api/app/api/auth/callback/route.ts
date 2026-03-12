import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase";

/**
 * GET /api/auth/callback — Handles OAuth2 redirect from Supabase Auth.
 * Exchanges the authorization code for a session.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirect_to") ?? "/";

  if (!code) {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "MISSING_CODE",
          message: "No authorization code provided",
        },
      },
      { status: 400 },
    );
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: "AUTH_CALLBACK_ERROR",
            message: error.message,
          },
        },
        { status: 400 },
      );
    }

    // Redirect back to the app
    return NextResponse.redirect(new URL(redirectTo, request.url));
  } catch {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to process auth callback",
        },
      },
      { status: 500 },
    );
  }
}
