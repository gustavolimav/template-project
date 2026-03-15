import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { errorResponse, ValidationError } from "@/lib/errors";
import { parseBody } from "@/lib/validate";
import type { ApiResponse } from "@app-template/types";

interface SendNotificationBody {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  channelId?: string;
}

interface SendNotificationResult {
  sent: number;
  tickets: unknown[];
}

function requireAdminAuth(request: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

/**
 * POST /api/notifications — Send a push notification to a specific user.
 *
 * Requires: Authorization: Bearer <ADMIN_SECRET>
 *
 * Body: { userId, title, body, data?, channelId? }
 *
 * Delegates delivery to the `send-notification` Supabase Edge Function,
 * which fetches the user's device tokens and calls the Expo Push API.
 *
 * Example:
 *   curl -X POST https://your-app.vercel.app/api/notifications \
 *     -H "Authorization: Bearer $ADMIN_SECRET" \
 *     -H "Content-Type: application/json" \
 *     -d '{ "userId": "...", "title": "Hello", "body": "World" }'
 *
 * To send a notification that deep-links to a screen on tap, include
 * `data.screen` with an Expo Router path, e.g.:
 *   { "data": { "screen": "/(app)/settings" } }
 */
export async function POST(
  request: Request,
): Promise<NextResponse<ApiResponse<SendNotificationResult | null>>> {
  try {
    if (!requireAdminAuth(request)) {
      return NextResponse.json(
        {
          data: null,
          error: { code: "UNAUTHORIZED", message: "Invalid admin secret" },
        },
        { status: 401 },
      );
    }

    const body = await parseBody<SendNotificationBody>(request);

    if (!body.userId || typeof body.userId !== "string") {
      throw new ValidationError("userId is required");
    }
    if (!body.title || typeof body.title !== "string") {
      throw new ValidationError("title is required");
    }
    if (!body.body || typeof body.body !== "string") {
      throw new ValidationError("body is required");
    }

    const supabase = createAdminClient();

    const { data, error } =
      await supabase.functions.invoke<SendNotificationResult>(
        "send-notification",
        {
          body: {
            userId: body.userId,
            title: body.title,
            body: body.body,
            data: body.data,
            channelId: body.channelId,
          },
        },
      );

    if (error) {
      throw new Error(`Edge Function error: ${error.message}`);
    }

    return NextResponse.json({
      data: data ?? { sent: 0, tickets: [] },
      error: null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
