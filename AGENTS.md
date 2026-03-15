# AGENTS.md — Guidance for AI Agents

## Build & Dev Commands

```bash
pnpm dev                    # Start everything (API + mobile)
pnpm build                  # Build all workspaces
pnpm lint                   # Lint all
pnpm test                   # Run all tests
pnpm type-check             # TypeScript check
pnpm supabase:start         # Start local Supabase (Docker required)
pnpm supabase:reset         # Reset DB and re-run migrations
```

## Architecture

- **Monorepo**: Turborepo + pnpm workspaces
- **Backend**: `apps/api/` — Next.js 15 App Router, deployed to Vercel
- **Mobile**: `apps/mobile/` — Expo 52 + React Native, deployed via EAS
- **Database**: `supabase/` — PostgreSQL with RLS, managed by Supabase
- **Shared**: `packages/` — types, utils, ui, configs

## Key Conventions

1. **API responses** always use `ApiResponse<T>`: `{ data: T | null, error: ApiError | null }`
2. **Auth**: Real JWT via Supabase Auth. Verify tokens with `requireAuth(request)` in route handlers
3. **Errors**: Throw typed errors (`AuthenticationError`, `ValidationError`). Caught by error handler
4. **Types**: Define in `packages/types/src/`, import as `@app-template/types`
5. **Testing**: Vitest for API/packages, Jest for mobile. Always add tests for new features
6. **TypeScript**: Strict mode everywhere. No `any` types
7. **Path aliases**: `@/*` maps to the app root in both API and mobile

## Data Flow

```
Mobile (Expo) → Axios + Bearer JWT → Next.js API → Supabase PostgreSQL
                                      ↑ JWT verified via jose + JWKS
```

## Auth Implementation

- Mobile uses `@supabase/supabase-js` for auth (signIn, signUp, OAuth)
- Tokens persisted in MMKV via custom storage adapter
- API verifies JWT using `jose` + Supabase JWKS endpoint (cached)
- Route protection via Expo Router route groups: `(auth)/` = public, `(app)/` = protected

## Environment Variables

**API** (`apps/api/.env.local`) — variable names match the Supabase Vercel integration:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` — service role key (server only)
- `POSTGRES_URL_NON_POOLING` — direct Postgres URL for migrations
- `ADMIN_SECRET` — bearer token for `/api/admin/*` endpoints

**Mobile** (`apps/mobile/.env` for local dev; baked into EAS builds for preview/production):
- `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_API_URL`

**EAS build profiles** (`apps/mobile/eas.json`):
- `development` — simulator build, reads local `.env`
- `preview` — TestFlight internal, env vars in `eas.json`
- `production` — App Store, env vars in `eas.json`

## Database Migrations

Local: `pnpm supabase:reset` (Supabase CLI)
Production: `POST /api/admin/migrations` with `Authorization: Bearer $ADMIN_SECRET`

## Adding Features

1. Types in `packages/types/src/`
2. DB migration in `supabase/migrations/`
3. API route in `apps/api/app/api/`
4. Mobile hook in `apps/mobile/hooks/`
5. Mobile screen in `apps/mobile/app/(app)/`
6. Tests in `__tests__/` directories

## Important File Paths

- Auth verification: `apps/api/lib/auth.ts`
- Error handling: `apps/api/lib/errors.ts`
- Supabase admin client: `apps/api/lib/supabase.ts`
- Mobile auth provider: `apps/mobile/providers/AuthProvider.tsx`
- Mobile Supabase client: `apps/mobile/lib/supabase.ts`
- MMKV storage adapter: `apps/mobile/lib/storage.ts`
- API interceptor: `apps/mobile/lib/api.ts`
- Design tokens: `packages/ui/src/theme.ts`
- Shared types: `packages/types/src/index.ts`
- DB migrations: `supabase/migrations/`
