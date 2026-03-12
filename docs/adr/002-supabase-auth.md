# ADR-002: Supabase Auth

## Status
Accepted

## Context
Need authentication with email/password, OAuth2 (Google, Apple), email verification, and password reset.

## Decision
Use Supabase Auth for all authentication. No custom auth server.

## Rationale
- Provides email/password, OAuth2, email verification, password reset out of the box
- JWT issuance and refresh handled automatically
- Mobile SDK handles the full OAuth flow
- API verifies tokens via standard JWKS endpoint
- Database integration: `auth.uid()` in RLS policies
- Open-source (GoTrue) — migration path exists

## Trade-offs
- Vendor lock-in to Supabase's auth system
- Must use Supabase's email templates (customizable but limited)
- OAuth redirect flow requires careful URL scheme configuration
