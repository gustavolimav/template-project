# Changelog

## v1.0.0 — Initial Template (2026-03-10)

### What Was Created

**Monorepo Infrastructure**
- Turborepo + pnpm workspaces with 5 shared packages
- TypeScript strict mode across all workspaces
- ESLint 9 flat config with shared rules
- Dual testing: Vitest (API/packages) + Jest (mobile)

**Authentication (Complete)**
- Supabase Auth integration with JWT, OAuth2
- Email/password: sign up, sign in, email verification, password reset
- Google OAuth via expo-web-browser
- Apple Sign-In via expo-apple-authentication (App Store required)
- JWT verification in API using jose + JWKS (Edge-compatible)
- MMKV as Supabase storage adapter for fast token persistence
- Protected routes via Expo Router route groups
- Rate limiting and security headers in API middleware
- Row Level Security (RLS) in PostgreSQL

**Mobile App (Expo)**
- Login, Register, Forgot Password screens
- Protected home screen with auth guard
- Reusable UI components (Button, Input, LoadingScreen, ErrorView)
- TanStack Query for server state management
- Axios with automatic JWT injection and 401 refresh

**API (Next.js 15)**
- Health check endpoint with DB connectivity test
- User profile endpoint (`/api/me`)
- Auth endpoints (callback, forgot-password, reset-password, verify-email)
- Middleware: CORS, security headers, Bearer format validation
- Centralized error handling with typed error classes

**Database (Supabase)**
- Profiles table with auto-creation trigger on user signup
- RLS policies for user data isolation
- Reusable `update_updated_at_column()` function

**Documentation**
- CLAUDE.md for AI-first development
- AGENTS.md for agent guidance
- README.md with quick start guide
- TODO.md with categorized future improvements
- Architecture Decision Records (ADRs)

### Architecture Decisions

| Decision | Rationale |
|---|---|
| jose for JWT | Works in Edge Runtime; TypeScript-first |
| Supabase Auth | Handles JWT, OAuth2, email verify, password reset out of the box |
| MMKV storage adapter | Synchronous reads for Axios interceptors; 10x faster than AsyncStorage |
| Route groups (auth)/(app) | Declarative auth guard; integrates with deep linking |
| @app-template/ scope | Template-friendly; replaceable via rename script |
| Dual test frameworks | Jest required for RN; Vitest faster for everything else |
