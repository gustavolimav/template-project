import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase";
import { errorResponse, NotFoundError } from "@/lib/errors";
import type { AuthUser } from "@app-template/types";

/**
 * GET /api/me — Returns the authenticated user's profile.
 */
export async function GET(request: Request) {
  try {
    const { userId } = await requireAuth(request);
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) {
      throw new NotFoundError("User profile not found");
    }

    const user: AuthUser = {
      id: data.id,
      email: data.email,
      displayName: data.display_name,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json({ data: user, error: null });
  } catch (error) {
    return errorResponse(error);
  }
}
