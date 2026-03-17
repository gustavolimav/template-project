// Supabase Edge Function: send-notification
// Fetches device tokens for a user and delivers push notifications via the Expo Push API.
//
// Invoke from your API server (never from the mobile client):
//   supabase.functions.invoke("send-notification", {
//     body: { userId, title, body, data, channelId },
//   })
//
// The function is secured by the Supabase service role key that the API server sends
// automatically when using the admin Supabase client.

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

interface NotificationPayload {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  channelId?: string;
}

interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
  channelId: string;
  sound: "default";
}

serve(async (req: Request) => {
  try {
    const payload: NotificationPayload = await req.json();

    if (!payload.userId || !payload.title || !payload.body) {
      return new Response(
        JSON.stringify({
          data: null,
          error: { code: "INVALID_PAYLOAD", message: "userId, title, and body are required" },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Use service role to read device tokens (bypasses RLS)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { data: tokenRows, error: dbError } = await supabase
      .from("device_tokens")
      .select("token")
      .eq("user_id", payload.userId);

    if (dbError) {
      throw new Error(`DB error: ${dbError.message}`);
    }

    if (!tokenRows || tokenRows.length === 0) {
      return new Response(
        JSON.stringify({ data: { sent: 0, tickets: [] }, error: null }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    const messages: ExpoPushMessage[] = tokenRows.map(({ token }) => ({
      to: token,
      title: payload.title,
      body: payload.body,
      data: payload.data ?? {},
      channelId: payload.channelId ?? "default",
      sound: "default",
    }));

    const expoResponse = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate",
      },
      body: JSON.stringify(messages),
    });

    const { data: tickets } = await expoResponse.json();

    return new Response(
      JSON.stringify({ data: { sent: messages.length, tickets }, error: null }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ data: null, error: { code: "INTERNAL_ERROR", message } }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
