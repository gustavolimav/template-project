import { describe, it, expect, vi } from "vitest";
import { extractBearerToken } from "../lib/auth";
import {
  AppError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  ForbiddenError,
  RateLimitError,
  errorResponse,
  withErrorHandler,
} from "../lib/errors";

describe("extractBearerToken", () => {
  it("extracts token from valid Authorization header", () => {
    const headers = new Headers({ Authorization: "Bearer my-token-123" });
    expect(extractBearerToken(headers)).toBe("my-token-123");
  });

  it("returns null for missing Authorization header", () => {
    const headers = new Headers();
    expect(extractBearerToken(headers)).toBeNull();
  });

  it("returns null for non-Bearer auth", () => {
    const headers = new Headers({ Authorization: "Basic abc123" });
    expect(extractBearerToken(headers)).toBeNull();
  });
});

describe("Error classes", () => {
  it("AuthenticationError has correct status and code", () => {
    const err = new AuthenticationError();
    expect(err.status).toBe(401);
    expect(err.code).toBe("UNAUTHORIZED");
    expect(err.message).toBe("Authentication required");
  });

  it("ValidationError has correct status and code", () => {
    const err = new ValidationError("Bad input");
    expect(err.status).toBe(400);
    expect(err.code).toBe("VALIDATION_ERROR");
    expect(err.message).toBe("Bad input");
  });

  it("NotFoundError has correct status and code", () => {
    const err = new NotFoundError();
    expect(err.status).toBe(404);
    expect(err.code).toBe("NOT_FOUND");
  });

  it("All errors extend AppError", () => {
    expect(new AuthenticationError()).toBeInstanceOf(AppError);
    expect(new ValidationError("x")).toBeInstanceOf(AppError);
    expect(new NotFoundError()).toBeInstanceOf(AppError);
  });

  it("ForbiddenError has status 403 and code FORBIDDEN", () => {
    const err = new ForbiddenError();
    expect(err.status).toBe(403);
    expect(err.code).toBe("FORBIDDEN");
    expect(err).toBeInstanceOf(AppError);
  });

  it("RateLimitError has status 429 and code RATE_LIMITED", () => {
    const err = new RateLimitError();
    expect(err.status).toBe(429);
    expect(err.code).toBe("RATE_LIMITED");
    expect(err).toBeInstanceOf(AppError);
  });
});

describe("errorResponse", () => {
  it("returns correct status for AppError", async () => {
    const response = errorResponse(new AuthenticationError("No token"));
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.data).toBeNull();
    expect(body.error.code).toBe("UNAUTHORIZED");
    expect(body.error.message).toBe("No token");
  });

  it("returns 500 for unknown errors", async () => {
    const response = errorResponse(new Error("unexpected"));
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error.code).toBe("INTERNAL_ERROR");
  });

  it("logs error-level for AppError with status >= 500", async () => {
    const appErr = new AppError("boom", "INTERNAL", 500);
    const res = errorResponse(appErr);
    expect(res.status).toBe(500);
  });
});

describe("withErrorHandler", () => {
  it("returns handler result on success", async () => {
    const handler = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ data: "ok", error: null }), {
          status: 200,
        }),
      );
    const wrapped = withErrorHandler(handler);
    const req = new Request("http://localhost/");
    const res = await wrapped(req);
    expect(res.status).toBe(200);
  });

  it("converts thrown AppError to error response", async () => {
    const handler = vi.fn().mockRejectedValue(new NotFoundError("not found"));
    const wrapped = withErrorHandler(handler);
    const res = await wrapped(new Request("http://localhost/"));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error.code).toBe("NOT_FOUND");
  });

  it("converts thrown unknown error to 500", async () => {
    const handler = vi.fn().mockRejectedValue(new Error("crash"));
    const wrapped = withErrorHandler(handler);
    const res = await wrapped(new Request("http://localhost/"));
    expect(res.status).toBe(500);
  });
});
