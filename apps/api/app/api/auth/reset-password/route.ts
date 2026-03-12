import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { parseBody } from "@/lib/validate";
import { ValidationError, errorResponse } from "@/lib/errors";


interface ResetPasswordBody {
  accessToken: string;
  newPassword: string;
}

/**
 * POST /api/auth/reset-password — Resets password using a recovery token.
 * The access token comes from the password reset email link.
 */
export async function POST(request: Request) {
  try {
    const { accessToken, newPassword } =
      await parseBody<ResetPasswordBody>(request);

    if (!accessToken) {
      throw new ValidationError("Access token is required");
    }

    if (!newPassword || newPassword.length < 8) {
      throw new ValidationError(
        "Password must be at least 8 characters long",
      );
    }

    const supabase = createAdminClient();

    // Verify the recovery token and update password
    const { error } = await supabase.auth.admin.updateUserById(
      // The access token from the email contains the user ID
      // We use the admin client to update the password
      accessToken,
      { password: newPassword },
    );

    if (error) {
      throw new ValidationError(error.message);
    }

    return NextResponse.json({
      data: { message: "Password has been reset successfully" },
      error: null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
