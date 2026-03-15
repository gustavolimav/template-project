import { createRemoteJWKSet, jwtVerify } from "jose";
import { AuthenticationError } from "./errors";

/**
 * Cached JWKS keyset for Supabase JWT verification.
 * Fetches public keys from Supabase's well-known endpoint and caches them.
 */
let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getSupabaseUrl(): string {
  const url =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL");
  return url;
}

function getJWKS() {
  if (!jwks) {
    jwks = createRemoteJWKSet(
      new URL(`${getSupabaseUrl()}/auth/v1/.well-known/jwks.json`),
    );
  }
  return jwks;
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
}

/**
 * Verifies a Supabase JWT access token.
 * Uses the JWKS endpoint for public key verification (no shared secrets).
 */
export async function verifyToken(token: string): Promise<AuthenticatedUser> {
  try {
    const { payload } = await jwtVerify(token, getJWKS(), {
      issuer: `${getSupabaseUrl()}/auth/v1`,
    });

    const userId = payload.sub;
    const email = payload.email as string | undefined;

    if (!userId) {
      throw new AuthenticationError("Token missing subject claim");
    }

    return { userId, email: email ?? "" };
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new AuthenticationError("Invalid or expired token");
  }
}

/**
 * Extracts the Bearer token from the Authorization header.
 */
export function extractBearerToken(
  headers: Headers,
): string | null {
  const auth = headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return null;
  }
  return auth.slice(7);
}

/**
 * Convenience: extract token + verify in one call.
 * Throws AuthenticationError if token is missing or invalid.
 */
export async function requireAuth(
  request: Request,
): Promise<AuthenticatedUser> {
  const token = extractBearerToken(request.headers);
  if (!token) {
    throw new AuthenticationError("Missing authorization token");
  }
  return verifyToken(token);
}
