/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authModule from "@/lib/auth";
import * as supabaseModule from "@/lib/supabase";

vi.mock("@/lib/auth");
vi.mock("@/lib/supabase");

const { GET } = await import("@/app/api/me/data-export/route");

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(authModule.requireAuth).mockResolvedValue({
    userId: "user-1",
    email: "test@example.com",
  });
});

describe("GET /api/me/data-export", () => {
  it("returns export payload with profile data", async () => {
    const mockProfile = {
      id: "user-1",
      email: "test@example.com",
      display_name: "Test User",
      avatar_url: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    };
    vi.mocked(supabaseModule.createAdminClient).mockReturnValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: mockProfile, error: null }),
          }),
        }),
      }),
    } as any);

    const req = new Request("http://localhost/api/me/data-export", {
      headers: { authorization: "Bearer token" },
    });
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.error).toBeNull();
    expect(body.data.subject.id).toBe("user-1");
    expect(body.data.subject.email).toBe("test@example.com");
    expect(body.data.profile).toEqual(mockProfile);
    expect(body.data.exportedAt).toBeDefined();
    expect(body.data.legalBasis).toMatch(/LGPD/);
  });

  it("returns null profile when not found in DB", async () => {
    vi.mocked(supabaseModule.createAdminClient).mockReturnValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () =>
              Promise.resolve({ data: null, error: { message: "not found" } }),
          }),
        }),
      }),
    } as any);

    const req = new Request("http://localhost/api/me/data-export", {
      headers: { authorization: "Bearer token" },
    });
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.profile).toBeNull();
  });

  it("returns 401 when auth fails", async () => {
    const { AuthenticationError } = await import("@/lib/errors");
    vi.mocked(authModule.requireAuth).mockRejectedValue(
      new AuthenticationError(),
    );

    const req = new Request("http://localhost/api/me/data-export");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });
});
