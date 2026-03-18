/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as supabaseModule from "@/lib/supabase";

vi.mock("@/lib/supabase");

const { POST } = await import("@/app/api/notifications/route");

const ADMIN_SECRET = "test-admin-secret";

function makeRequest(body: object, authHeader?: string): Request {
  return new Request("http://localhost/api/notifications", {
    method: "POST",
    headers: {
      authorization: authHeader ?? `Bearer ${ADMIN_SECRET}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.ADMIN_SECRET = ADMIN_SECRET;
});

describe("POST /api/notifications — auth", () => {
  it("returns 401 when Authorization header is missing", async () => {
    const req = new Request("http://localhost/api/notifications", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId: "u1", title: "T", body: "B" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error.code).toBe("UNAUTHORIZED");
  });

  it("returns 401 when ADMIN_SECRET is wrong", async () => {
    const res = await POST(
      makeRequest({ userId: "u1", title: "T", body: "B" }, "Bearer wrong"),
    );
    expect(res.status).toBe(401);
  });

  it("returns 401 when ADMIN_SECRET env var is not set", async () => {
    delete process.env.ADMIN_SECRET;
    const res = await POST(
      makeRequest({ userId: "u1", title: "T", body: "B" }),
    );
    expect(res.status).toBe(401);
  });
});

describe("POST /api/notifications — validation", () => {
  it("returns 400 when userId is missing", async () => {
    const res = await POST(makeRequest({ title: "T", body: "B" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when title is missing", async () => {
    const res = await POST(makeRequest({ userId: "u1", body: "B" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when body is missing", async () => {
    const res = await POST(makeRequest({ userId: "u1", title: "T" }));
    expect(res.status).toBe(400);
  });
});

describe("POST /api/notifications — success", () => {
  it("invokes Edge Function and returns sent count", async () => {
    vi.mocked(supabaseModule.createAdminClient).mockReturnValue({
      functions: {
        invoke: () =>
          Promise.resolve({ data: { sent: 1, tickets: [{}] }, error: null }),
      },
    } as any);

    const res = await POST(
      makeRequest({ userId: "u1", title: "Hello", body: "World" }),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.sent).toBe(1);
    expect(json.error).toBeNull();
  });

  it("returns sent:0 when Edge Function returns null data", async () => {
    vi.mocked(supabaseModule.createAdminClient).mockReturnValue({
      functions: {
        invoke: () => Promise.resolve({ data: null, error: null }),
      },
    } as any);

    const res = await POST(
      makeRequest({ userId: "u1", title: "T", body: "B" }),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data).toEqual({ sent: 0, tickets: [] });
  });

  it("returns 500 when Edge Function throws", async () => {
    vi.mocked(supabaseModule.createAdminClient).mockReturnValue({
      functions: {
        invoke: () =>
          Promise.resolve({
            data: null,
            error: { message: "Function crashed" },
          }),
      },
    } as any);

    const res = await POST(
      makeRequest({ userId: "u1", title: "T", body: "B" }),
    );
    expect(res.status).toBe(500);
  });

  it("passes optional data and channelId to the Edge Function", async () => {
    const invoker = vi
      .fn()
      .mockResolvedValue({ data: { sent: 1, tickets: [] }, error: null });
    vi.mocked(supabaseModule.createAdminClient).mockReturnValue({
      functions: { invoke: invoker },
    } as any);

    await POST(
      makeRequest({
        userId: "u1",
        title: "T",
        body: "B",
        data: { screen: "/(app)/settings" },
        channelId: "default",
      }),
    );

    const [, options] = invoker.mock.calls[0] as [string, { body: object }];
    expect((options.body as any).data).toEqual({ screen: "/(app)/settings" });
    expect((options.body as any).channelId).toBe("default");
  });
});
