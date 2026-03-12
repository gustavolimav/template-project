# ADR-004: JWT Verification with jose

## Status
Accepted

## Context
API needs to verify Supabase-issued JWTs. Next.js middleware runs in Edge Runtime.

## Decision
Use the `jose` library to verify JWTs against Supabase's JWKS endpoint.

## Rationale
- Works in Edge Runtime (unlike `jsonwebtoken` which needs Node.js crypto)
- TypeScript-first with full type safety
- Built-in JWKS fetching and caching via `createRemoteJWKSet()`
- No shared secrets — uses public key verification
- Standard approach for JWT verification

## Alternatives Considered
- **jsonwebtoken**: Node.js only — incompatible with Edge Runtime
- **Supabase SDK verification**: Requires a round-trip to Supabase on every request
- **Shared secret**: Less secure; JWKS rotation is automatic with public key approach
