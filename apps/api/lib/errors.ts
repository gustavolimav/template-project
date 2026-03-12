import { NextResponse } from "next/server";
import type { ApiResponse } from "@app-template/types";

/**
 * Base application error with HTTP status code.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number = 500,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super(message, "UNAUTHORIZED", 401);
    this.name = "AuthenticationError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, "FORBIDDEN", 403);
    this.name = "ForbiddenError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests") {
    super(message, "RATE_LIMITED", 429);
    this.name = "RateLimitError";
  }
}

/**
 * Converts any error into a consistent ApiResponse JSON response.
 */
export function errorResponse(error: unknown): NextResponse<ApiResponse<null>> {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        data: null,
        error: { code: error.code, message: error.message },
      },
      { status: error.status },
    );
  }

  console.error("Unhandled error:", error);

  return NextResponse.json(
    {
      data: null,
      error: {
        code: "INTERNAL_ERROR",
        message: "An internal error occurred",
      },
    },
    { status: 500 },
  );
}

/**
 * Wraps an async route handler with error handling.
 */
export function withErrorHandler<T>(
  handler: (request: Request) => Promise<NextResponse<ApiResponse<T>>>,
) {
  return async (request: Request) => {
    try {
      return await handler(request);
    } catch (error) {
      return errorResponse(error);
    }
  };
}
