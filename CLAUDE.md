# CLAUDE.md — AI Context for App Template

## Project Overview

AI-first iOS app template built as a Turborepo monorepo. Designed to be the starting point for many future projects. Features real authentication (Supabase Auth with JWT, OAuth2), a Next.js API backend, and an Expo React Native mobile app targeting the Apple App Store.

## Tech Stack

| Technology | Purpose | Version |
|---|---|---|
| Turborepo | Monorepo build system | ^2.3 |
| pnpm | Package manager | 9.x |
| TypeScript | Language (strict mode) | ^5.7 |
| Next.js | Backend API (App Router) | ^15.1 |
| Expo | Mobile app framework | ~52.0 |
| React Native | Mobile UI | 0.76.x |
| Supabase | Database + Auth | ^2.49 |
| jose | JWT verification (Edge-compatible) | ^5.9 |
| TanStack Query | Server state management | ^5.62 |
| MMKV | Fast local storage | ^3.1 |
| Axios | HTTP client | ^1.7 |
| Vitest | Testing (API + packages) | ^2.1 |
| Jest + jest-expo | Testing (mobile) | ^29.7 |

## Architecture

```
app-template/
├── apps/
│   ├── api/          — Next.js 15 API (deployed to Vercel)
│   └── mobile/       — Expo React Native (deployed via EAS to App Store)
├── packages/
│   ├── types/        — Shared TypeScript interfaces (@app-template/types)
│   ├── utils/        — Shared utilities (@app-template/utils)
│   ├── ui/           — Design tokens (@app-template/ui)
│   ├── eslint-config/— Shared ESLint config (@app-template/eslint-config)
│   └── typescript-config/ — Shared tsconfig (@app-template/typescript-config)
├── supabase/         — Database migrations and config
├── scripts/          — Setup, rename, and test scripts
└── docs/             — ADRs, auth flow, guides
```

### Package Dependency Graph
```
mobile → types, utils, ui
api    → types
utils  → types (peer)
```

### Data Flow
```
iPhone (Expo) → HTTP + Bearer JWT → Next.js API (Vercel) → Supabase (PostgreSQL)
```

## Development Commands

```bash
pnpm dev              # Start API + mobile in parallel
pnpm build            # Build all apps
pnpm lint             # Lint all workspaces
pnpm test             # Run all tests
pnpm type-check       # TypeScript check all workspaces
pnpm clean            # Remove build artifacts + node_modules

# Supabase
pnpm supabase:start   # Start local Supabase (requires Docker)
pnpm supabase:stop    # Stop local Supabase
pnpm supabase:reset   # Reset database and re-apply migrations
pnpm supabase:status  # Show local Supabase URLs and keys

# Individual apps
pnpm --filter @app-template/api dev      # API only
pnpm --filter @app-template/mobile dev   # Mobile only
pnpm --filter @app-template/api test     # API tests only
pnpm --filter @app-template/utils test   # Utils tests only
```

## Authentication System

### How It Works End-to-End

1. **Mobile app** uses `@supabase/supabase-js` client for all auth operations (signUp, signIn, OAuth, password reset)
2. **Supabase Auth** issues JWTs, handles email verification, and manages OAuth flows
3. **Tokens stored** in MMKV via a custom Supabase storage adapter (`apps/mobile/lib/storage.ts`)
4. **API requests** include `Authorization: Bearer <token>` via Axios interceptor (`apps/mobile/lib/api.ts`)
5. **API middleware** checks Bearer header format (`apps/api/middleware.ts`)
6. **Route handlers** verify JWT cryptographically using `jose` + Supabase JWKS (`apps/api/lib/auth.ts`)
7. **RLS policies** enforce data isolation per user in PostgreSQL (`supabase/migrations/`)

### Auth Files Map
- `apps/mobile/providers/AuthProvider.tsx` — React Context with all auth methods
- `apps/mobile/hooks/useAuth.ts` — Consumer hook for components
- `apps/mobile/lib/supabase.ts` — Supabase client with MMKV storage adapter
- `apps/mobile/lib/storage.ts` — MMKV instance + Supabase storage interface
- `apps/mobile/lib/api.ts` — Axios with automatic JWT injection + 401 refresh
- `apps/api/lib/auth.ts` — JWT verification via jose + JWKS
- `apps/api/lib/errors.ts` — Error classes (AuthenticationError, etc.)
- `apps/api/middleware.ts` — Security headers, CORS, Bearer format check

### OAuth Providers
- **Google**: via `expo-web-browser` + `supabase.auth.signInWithOAuth`
- **Apple**: via `expo-apple-authentication` + `supabase.auth.signInWithIdToken`
- Apple Sign-In is **required** by App Store if any other OAuth provider is offered

### Route Protection
- `app/(auth)/` — Public screens (login, register, forgot-password)
- `app/(app)/` — Protected screens (redirects to login if no session)
- Layout files handle redirect logic via `useAuth().isAuthenticated`

## Conventions and Patterns

### API Response Format
Every API endpoint returns `ApiResponse<T>`:
```typescript
{ data: T | null, error: { code: string, message: string } | null }
```

### Error Handling
- API: throw typed errors (`AuthenticationError`, `ValidationError`, `NotFoundError`)
- Errors caught by `withErrorHandler()` wrapper or try/catch in route handlers
- All errors map to consistent `ApiResponse` format

### State Management
- **Server state**: TanStack Query (caching, background refetch)
- **Auth state**: React Context via `AuthProvider`
- **Local storage**: MMKV (auth tokens via Supabase adapter)

### Testing
- **API + packages**: Vitest (ESM-native, fast)
- **Mobile**: Jest + jest-expo (required for RN Babel transforms)
- Mock MMKV: `apps/mobile/__mocks__/react-native-mmkv.ts`
- Mock Supabase: mock `@supabase/supabase-js` in test files

### Naming Conventions
- Files: `kebab-case.ts` for utils, `PascalCase.tsx` for components
- Packages: `@app-template/<name>`
- API routes: `app/api/<resource>/route.ts`
- Mobile screens: `app/(group)/screen-name.tsx`

## Adding a New Feature

1. **Types**: Define interfaces in `packages/types/src/`
2. **Migration**: Create SQL in `supabase/migrations/` (run `pnpm supabase:migration <name>`)
3. **API route**: Create `apps/api/app/api/<resource>/route.ts`
4. **Mobile hook**: Create `apps/mobile/hooks/use<Feature>.ts` with TanStack Query
5. **Mobile screen**: Create `apps/mobile/app/(app)/<screen>.tsx`
6. **Tests**: Add tests in `__tests__/` directories
7. **Update docs**: Update this file if conventions change

## Adding a New API Route

```typescript
// apps/api/app/api/<resource>/route.ts
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase";
import { errorResponse } from "@/lib/errors";
import type { ApiResponse } from "@app-template/types";

export async function GET(request: Request): Promise<NextResponse<ApiResponse<YourType>>> {
  try {
    const { userId } = await requireAuth(request);
    const supabase = createAdminClient();
    // ... query logic
    return NextResponse.json({ data: result, error: null });
  } catch (error) {
    return errorResponse(error);
  }
}
```

## Environment Variables

### API (`apps/api/.env.local`)

These variable names are set automatically when you connect Supabase to your Vercel project via the Vercel integration. Copy them to `.env.local` for local development.

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — server only, never expose to client | Yes |
| `POSTGRES_URL_NON_POOLING` | Direct Postgres connection for migrations (DDL) | Yes (migrations) |
| `ADMIN_SECRET` | Bearer token for `/api/admin/*` — generate with `openssl rand -hex 32` | Yes (migrations) |
| `CORS_ORIGINS` | Comma-separated allowed origins for mobile app | No |
| `SENTRY_DSN` | Sentry error tracking DSN | No |

### Mobile (`apps/mobile/.env`)

| Variable | Description | Required |
|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `EXPO_PUBLIC_API_URL` | API base URL (Vercel URL or machine IP for local) | Yes |
| `EXPO_PUBLIC_SENTRY_DSN` | Sentry DSN for mobile error tracking | No |

## Multi-Environment Mobile Deployment

The mobile app has three EAS build profiles defined in `apps/mobile/eas.json`:

### development — iOS Simulator (local dev)
```bash
eas build --profile development --platform ios
```
- Runs on the iOS Simulator
- Reads `.env` file locally — point to local or cloud Supabase
- Required because MMKV needs the dev client (Expo Go won't work)
- Build once, then start with `pnpm --filter @app-template/mobile dev`

### preview — Internal TestFlight testing
```bash
eas build --profile preview --platform ios
```
- Distributes via TestFlight (internal testers)
- Env vars are baked in from `eas.json` → `preview.env`
- Fill in `REPLACE_WITH_*` values in `eas.json` before building
- Use for QA, stakeholder demos, beta testing

### production — App Store
```bash
eas build --profile production --platform ios
eas submit --platform ios
```
- Submits to App Store
- Env vars baked in from `eas.json` → `production.env`
- Same cloud URLs as preview — no separate staging env needed for this template

### Setup steps before first EAS build
1. Fill in `REPLACE_WITH_*` values in `apps/mobile/eas.json`
2. Fill in Apple credentials in `eas.json` → `submit.production.ios`
3. Run migrations on production DB: `POST /api/admin/migrations`
4. Build: `eas build --profile preview --platform ios`

## Running Database Migrations

Migrations live in `supabase/migrations/` and are applied via the admin API endpoint (no CLI needed on production):

```bash
# Check what's pending
curl -H "Authorization: Bearer $ADMIN_SECRET" https://your-app.vercel.app/api/admin/migrations

# Apply pending migrations
curl -X POST -H "Authorization: Bearer $ADMIN_SECRET" https://your-app.vercel.app/api/admin/migrations

# Preview without applying
curl -X POST -H "Authorization: Bearer $ADMIN_SECRET" \
  "https://your-app.vercel.app/api/admin/migrations?dry_run=true"
```

Local development still uses `pnpm supabase:reset` which re-applies all migrations via the Supabase CLI.

## Common Gotchas

- **MMKV requires a dev client**: Cannot use Expo Go. Run `eas build --profile development` first
- **Metro monorepo**: `metro.config.js` must set `watchFolders` to monorepo root
- **Mobile local dev**: Use machine IP (not localhost) for `EXPO_PUBLIC_API_URL` when testing on a physical device
- **Apple Sign-In**: Required by App Store Review if Google OAuth is offered
- **Supabase local ports**: API=54321, DB=54322, Studio=54323, Email=54324
- **pnpm + Jest**: `transformIgnorePatterns` in `jest.config.js` must allow workspace packages
- **Two test frameworks**: Vitest for API/packages, Jest for mobile (technical constraint, not preference)
- **Duplicate env vars**: Next.js uses the first occurrence of a variable — avoid duplicates in `.env.local`
- **`.env` vs `.env.local`**: Next.js dev server only loads `.env.local` (not `.env`) — always use `.env.local`
