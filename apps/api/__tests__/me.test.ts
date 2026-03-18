/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authModule from "@/lib/auth";
import * as supabaseModule from "@/lib/supabase";

vi.mock("@/lib/auth");
vi.mock("@/lib/supabase");

const { GET, PATCH, DELETE } = await import("@/app/api/me/route");

const mockProfile = {
  id: "user-1",
  email: "test@example.com",
  display_name: "Test User",
  avatar_url: null,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

function makeRequest(init?: RequestInit): Request {
  return new Request("http://localhost/api/me", {
    headers: { authorization: "Bearer token" },
    ...init,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(authModule.requireAuth).mockResolvedValue({
    userId: "user-1",
    email: "test@example.com",
  });
});

describe("GET /api/me", () => {
  it("returns mapped profile on success", async () => {
    vi.mocked(supabaseModule.createAdminClient).mockReturnValue({
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: mockProfile, error: null }),
          }),
        }),
      }),
    } as any);

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.error).toBeNull();
    expect(body.data).toEqual({
      id: "user-1",
      email: "test@example.com",
      displayName: "Test User",
      avatarUrl: null,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    });
  });

  it("returns 404 when profile not found in DB", async () => {
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

    const res = await GET(makeRequest());
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error.code).toBe("NOT_FOUND");
  });

  it("returns 401 when requireAuth throws", async () => {
    const { AuthenticationError } = await import("@/lib/errors");
    vi.mocked(authModule.requireAuth).mockRejectedValue(
      new AuthenticationError("Invalid token"),
    );

    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
  });
});

describe("PATCH /api/me", () => {
  function patchRequest(body: object): Request {
    return new Request("http://localhost/api/me", {
      method: "PATCH",
      headers: {
        authorization: "Bearer token",
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  it("updates displayName and returns updated profile", async () => {
    const updated = { ...mockProfile, display_name: "New Name" };
    vi.mocked(supabaseModule.createAdminClient).mockReturnValue({
      from: () => ({
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: updated, error: null }),
            }),
          }),
        }),
      }),
    } as any);

    const res = await PATCH(patchRequest({ displayName: "New Name" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.displayName).toBe("New Name");
  });

  it("returns 400 when displayName is not a string", async () => {
    const res = await PATCH(patchRequest({ displayName: 42 }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 400 when avatarUrl is not a string", async () => {
    const res = await PATCH(patchRequest({ avatarUrl: true }));
    expect(res.status).toBe(400);
  });

  it("returns 404 when profile not found during update", async () => {
    vi.mocked(supabaseModule.createAdminClient).mockReturnValue({
      from: () => ({
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () =>
                Promise.resolve({
                  data: null,
                  error: { message: "not found" },
                }),
            }),
          }),
        }),
      }),
    } as any);

    const res = await PATCH(patchRequest({ displayName: "X" }));
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/me", () => {
  it("deletes user and returns success message", async () => {
    vi.mocked(supabaseModule.createAdminClient).mockReturnValue({
      auth: {
        admin: {
          deleteUser: () => Promise.resolve({ error: null }),
        },
      },
    } as any);

    const res = await DELETE(makeRequest());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.message).toBe("Account permanently deleted");
    expect(body.error).toBeNull();
  });

  it("returns 500 when Supabase delete fails", async () => {
    vi.mocked(supabaseModule.createAdminClient).mockReturnValue({
      auth: {
        admin: {
          deleteUser: () => Promise.resolve({ error: { message: "DB error" } }),
        },
      },
    } as any);

    const res = await DELETE(makeRequest());
    expect(res.status).toBe(500);
  });
});
