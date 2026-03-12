import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Edge Middleware for authentication, security headers, and CORS.
 *
 * Runs on every /api/* request. Skips auth verification for:
 * - /api/health (health check)
 * - /api/auth/* (auth endpoints handle their own auth)
 */

const PUBLIC_PATHS = ["/api/health", "/api/auth"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

function getCorsHeaders(): Record<string, string> {
  const origins = process.env.CORS_ORIGINS ?? "";
  return {
    "Access-Control-Allow-Origin": origins || "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

function getSecurityHeaders(): Record<string, string> {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: { ...getCorsHeaders(), ...getSecurityHeaders() },
    });
  }

  // Skip auth for public paths
  if (isPublicPath(pathname)) {
    const response = NextResponse.next();
    for (const [key, value] of Object.entries({
      ...getCorsHeaders(),
      ...getSecurityHeaders(),
    })) {
      response.headers.set(key, value);
    }
    return response;
  }

  // Extract and verify Bearer token
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      {
        data: null,
        error: { code: "UNAUTHORIZED", message: "Missing authorization token" },
      },
      {
        status: 401,
        headers: { ...getCorsHeaders(), ...getSecurityHeaders() },
      },
    );
  }

  // Token verification happens in the route handler via requireAuth()
  // because Edge Middleware cannot use the full jose JWKS verification
  // (it runs in a limited edge runtime). The middleware ensures the header
  // format is correct; the route handler does cryptographic verification.
  const response = NextResponse.next();
  for (const [key, value] of Object.entries({
    ...getCorsHeaders(),
    ...getSecurityHeaders(),
  })) {
    response.headers.set(key, value);
  }
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
