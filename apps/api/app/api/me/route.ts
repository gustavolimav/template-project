import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase";
import { errorResponse, NotFoundError, ValidationError } from "@/lib/errors";
import { parseBody } from "@/lib/validate";
import type { AuthUser } from "@app-template/types";

function mapProfile(data: Record<string, unknown>): AuthUser {
  return {
    id: data.id as string,
    email: data.email as string,
    displayName: (data.display_name as string | null) ?? null,
    avatarUrl: (data.avatar_url as string | null) ?? null,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
  };
}

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

    return NextResponse.json({ data: mapProfile(data), error: null });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * PATCH /api/me — Updates the authenticated user's profile.
 * Body: { displayName?: string; avatarUrl?: string }
 */
export async function PATCH(request: Request) {
  try {
    const { userId } = await requireAuth(request);
    const body = await parseBody<{ displayName?: string; avatarUrl?: string }>(
      request,
    );

    if (body.displayName !== undefined && typeof body.displayName !== "string") {
      throw new ValidationError("displayName must be a string");
    }
    if (body.avatarUrl !== undefined && typeof body.avatarUrl !== "string") {
      throw new ValidationError("avatarUrl must be a string");
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...(body.displayName !== undefined && { display_name: body.displayName }),
        ...(body.avatarUrl !== undefined && { avatar_url: body.avatarUrl }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundError("User profile not found");
    }

    return NextResponse.json({ data: mapProfile(data), error: null });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * DELETE /api/me — Permanently deletes the authenticated user's account.
 * Satisfies LGPD Art. 18, IV (right to erasure / exclusão).
 */
export async function DELETE(request: Request) {
  try {
    const { userId } = await requireAuth(request);
    const supabase = createAdminClient();

    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }

    return NextResponse.json({
      data: { message: "Account permanently deleted" },
      error: null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
