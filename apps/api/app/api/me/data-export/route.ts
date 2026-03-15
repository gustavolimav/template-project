import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase";
import { errorResponse } from "@/lib/errors";

/**
 * GET /api/me/data-export — Returns all personal data stored for the user.
 * Satisfies LGPD Art. 18, V (right to data portability / portabilidade).
 */
export async function GET(request: Request) {
  try {
    const { userId, email } = await requireAuth(request);
    const supabase = createAdminClient();

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    const exportData = {
      exportedAt: new Date().toISOString(),
      dataController: "App Template",
      legalBasis: "LGPD Art. 7, I — consent",
      subject: {
        id: userId,
        email,
      },
      profile: profile ?? null,
    };

    return NextResponse.json({ data: exportData, error: null });
  } catch (error) {
    return errorResponse(error);
  }
}
