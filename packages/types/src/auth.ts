/**
 * Authenticated user profile as stored in the profiles table.
 */
export interface AuthUser {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Auth session containing tokens and user info.
 * Mirrors the shape returned by Supabase Auth.
 */
export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: AuthUser;
}

/**
 * Decoded JWT payload from Supabase Auth.
 */
export interface JwtPayload {
  sub: string;
  email: string;
  aud: string;
  exp: number;
  iat: number;
}
