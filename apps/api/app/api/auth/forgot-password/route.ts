import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { parseBody } from "@/lib/validate";
import { ValidationError, errorResponse } from "@/lib/errors";


interface ForgotPasswordBody {
  email: string;
}

/**
 * POST /api/auth/forgot-password — Sends a password reset email.
 * Always returns 200 to prevent email enumeration.
 */
export async function POST(request: Request) {
  try {
    const { email } = await parseBody<ForgotPasswordBody>(request);

    if (!email || typeof email !== "string") {
      throw new ValidationError("Email is required");
    }

    const supabase = createAdminClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.SUPABASE_URL}/auth/v1/verify?type=recovery`,
    });

    // Always return success to prevent email enumeration
    return NextResponse.json({
      data: { message: "If an account exists, a reset email has been sent" },
      error: null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
