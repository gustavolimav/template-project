import { describe, it, expect, beforeEach, vi } from "vitest";
import { middleware } from "../middleware";
import { NextRequest } from "next/server";

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
});

function makeRequest(
  url: string,
  init?: RequestInit & { method?: string },
): NextRequest {
  return new NextRequest(`http://localhost${url}`, init);
}

describe("CORS preflight (OPTIONS)", () => {
  it("returns 204 for OPTIONS request", async () => {
    const res = await middleware(makeRequest("/api/me", { method: "OPTIONS" }));
    expect(res.status).toBe(204);
  });

  it("includes CORS headers on preflight", async () => {
    const res = await middleware(makeRequest("/api/me", { method: "OPTIONS" }));
    expect(res.headers.get("Access-Control-Allow-Methods")).toBeTruthy();
    expect(res.headers.get("Access-Control-Allow-Headers")).toBeTruthy();
  });
});

describe("public paths bypass auth", () => {
  it.each([
    ["/api/health"],
    ["/api/auth/callback"],
    ["/api/auth/forgot-password"],
    ["/api/admin/migrations"],
  ])("allows %s without Authorization", async (path) => {
    const res = await middleware(makeRequest(path));
    expect(res.status).not.toBe(401);
  });
});

describe("security headers", () => {
  it("adds security headers to public path responses", async () => {
    const res = await middleware(makeRequest("/api/health"));
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
    expect(res.headers.get("X-XSS-Protection")).toBe("1; mode=block");
    expect(res.headers.get("Referrer-Policy")).toBe(
      "strict-origin-when-cross-origin",
    );
  });

  it("adds security headers to 401 responses", async () => {
    const res = await middleware(makeRequest("/api/me"));
    expect(res.status).toBe(401);
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });
});

describe("protected paths require Bearer token", () => {
  it("returns 401 when Authorization header is missing", async () => {
    const res = await middleware(makeRequest("/api/me"));
    expect(res.status).toBe(401);
  });

  it("returns 401 when Authorization scheme is not Bearer", async () => {
    const res = await middleware(
      makeRequest("/api/me", {
        headers: { authorization: "Basic dXNlcjpwYXNz" },
      }),
    );
    expect(res.status).toBe(401);
  });

  it("returns correct error body for missing token", async () => {
    const res = await middleware(makeRequest("/api/me"));
    const body = await res.json();
    expect(body).toEqual({
      data: null,
      error: { code: "UNAUTHORIZED", message: "Missing authorization token" },
    });
  });

  it("passes through when Bearer header is present", async () => {
    const res = await middleware(
      makeRequest("/api/me", {
        headers: { authorization: "Bearer some-token" },
      }),
    );
    // Middleware only checks format; JWT verification happens in the route handler
    expect(res.status).not.toBe(401);
  });

  it("applies to /api/me", async () => {
    expect((await middleware(makeRequest("/api/me"))).status).toBe(401);
  });

  it("applies to nested protected routes", async () => {
    expect((await middleware(makeRequest("/api/me/data-export"))).status).toBe(
      401,
    );
  });
});
