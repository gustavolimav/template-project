/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthenticationError } from "@/lib/errors";

vi.mock("jose", () => ({
  createRemoteJWKSet: vi.fn(() => "mock-jwks"),
  jwtVerify: vi.fn(),
}));

// Must import after mocking jose
const { verifyToken, requireAuth } = await import("@/lib/auth");
const jose = await import("jose");

beforeEach(() => {
  vi.clearAllMocks();
  process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
});

describe("verifyToken", () => {
  it("returns userId and email for a valid token", async () => {
    vi.mocked(jose.jwtVerify).mockResolvedValue({
      payload: { sub: "user-1", email: "test@example.com" },
    } as any);

    const result = await verifyToken("valid-token");
    expect(result.userId).toBe("user-1");
    expect(result.email).toBe("test@example.com");
  });

  it("returns empty string for email when claim is absent", async () => {
    vi.mocked(jose.jwtVerify).mockResolvedValue({
      payload: { sub: "user-1" },
    } as any);

    const result = await verifyToken("valid-token");
    expect(result.email).toBe("");
  });

  it("throws AuthenticationError when sub claim is missing", async () => {
    vi.mocked(jose.jwtVerify).mockResolvedValue({
      payload: { email: "test@example.com" },
    } as any);

    await expect(verifyToken("bad-token")).rejects.toThrow(AuthenticationError);
    await expect(verifyToken("bad-token")).rejects.toThrow(
      "Token missing subject claim",
    );
  });

  it("throws AuthenticationError when jose throws", async () => {
    vi.mocked(jose.jwtVerify).mockRejectedValue(new Error("JWT expired"));

    await expect(verifyToken("expired")).rejects.toThrow(AuthenticationError);
    await expect(verifyToken("expired")).rejects.toThrow(
      "Invalid or expired token",
    );
  });

  it("re-throws AuthenticationError as-is when jose throws one", async () => {
    vi.mocked(jose.jwtVerify).mockResolvedValue({
      payload: {},
    } as any);

    await expect(verifyToken("bad")).rejects.toThrow(AuthenticationError);
  });
});

describe("requireAuth", () => {
  it("returns user when Authorization header is valid", async () => {
    vi.mocked(jose.jwtVerify).mockResolvedValue({
      payload: { sub: "user-1", email: "test@example.com" },
    } as any);

    const req = new Request("http://localhost/api/me", {
      headers: { authorization: "Bearer valid-token" },
    });
    const result = await requireAuth(req);
    expect(result.userId).toBe("user-1");
  });

  it("throws AuthenticationError when Authorization header is missing", async () => {
    const req = new Request("http://localhost/api/me");
    await expect(requireAuth(req)).rejects.toThrow(AuthenticationError);
    await expect(requireAuth(req)).rejects.toThrow(
      "Missing authorization token",
    );
  });
});
