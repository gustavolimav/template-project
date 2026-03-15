# CLAUDE.md — AI Context for App Template

## Project Overview

AI-first iOS app template built as a Turborepo monorepo. Designed to be the starting point for many future projects. Features real authentication (Supabase Auth with JWT, OAuth2), a Next.js API backend, and an Expo React Native mobile app targeting the Apple App Store. LGPD-compliant by default (Brazilian data protection law).

**Current version**: 1.1.0

## Tech Stack

| Technology        | Purpose                             | Version              |
| ----------------- | ----------------------------------- | -------------------- |
| Turborepo         | Monorepo build system               | ^2.3                 |
| pnpm              | Package manager                     | 9.x                  |
| TypeScript        | Language (strict mode)              | ^5.7                 |
| Next.js           | Backend API (App Router)            | ^15.1                |
| Expo              | Mobile app framework                | ~52.0                |
| React Native      | Mobile UI                           | 0.76.x               |
| NativeWind        | Tailwind CSS for React Native       | v4 (nativewind@next) |
| Supabase          | Database + Auth + Storage           | ^2.49                |
| jose              | JWT verification (Edge-compatible)  | ^5.9                 |
| TanStack Query    | Server state management             | ^5.62                |
| MMKV              | Fast local storage                  | ^3.1                 |
| Axios             | HTTP client                         | ^1.7                 |
| Vitest            | Testing (API + packages)            | ^2.1                 |
| Jest + jest-expo  | Testing (mobile)                    | ^29.7                |
| husky             | Git hooks                           | ^9.1                 |
| commitlint        | Conventional commit enforcement     | ^20.4                |
| standard-version  | Semver bumps + changelog generation | ^9.5                 |
| MUI (Material UI) | Web UI components for API pages     | ^6.x                 |

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
iPhone (Expo) → Supabase JS client ──────────────────────→ Supabase Storage (avatars)
```

## Development Commands

```bash
pnpm dev              # Start API + mobile in parallel
pnpm build            # Build all apps
pnpm lint             # Lint all workspaces
pnpm test             # Run all tests
pnpm type-check       # TypeScript check all workspaces
pnpm clean            # Remove build artifacts + node_modules

# Releases
pnpm release          # Bump patch version, update CHANGELOG.md, tag
pnpm release:minor    # Bump minor version
pnpm release:major    # Bump major version

# Supabase
pnpm supabase:start   # Start local Supabase (requires Docker)
pnpm supabase:stop    # Stop local Supabase
pnpm supabase:reset   # Reset database and re-apply migrations
pnpm supabase:status  # Show local Supabase URLs and keys
pnpm supabase:types   # Regenerate packages/types/src/database.generated.ts from local schema

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

### LGPD Compliance (Lei 13.709/2018)

- **Consent at registration** (Art. 7, I): mandatory checkbox in register screen; submission blocked until checked
- **Right to portability** (Art. 18, V): `GET /api/me/data-export` returns all user data as JSON
- **Right to erasure** (Art. 18, IV): `DELETE /api/me` hard-deletes auth user + profile via `supabase.auth.admin.deleteUser`
- Both actions are surfaced in the home screen under "PRIVACIDADE E DADOS"

## NativeWind Styling

The mobile app uses NativeWind v4 for Tailwind CSS styling. **Critical version notes** — NativeWind v4 is fundamentally different from v2:

| Item         | v4 (current)                                        | v2 (old — do NOT use)           |
| ------------ | --------------------------------------------------- | ------------------------------- |
| Babel config | `jsxImportSource: "nativewind"` inside Expo preset  | `plugins: ["nativewind/babel"]` |
| Metro config | `withNativeWind(config, { input: "./global.css" })` | no wrapper needed               |
| CSS entry    | `global.css` imported in root `_layout.tsx`         | not needed                      |

### Design Tokens

All Tailwind custom values are defined in `apps/mobile/tailwind.config.js` and mirror `packages/ui/src/theme.ts`:

- Colors: `primary-*`, `gray-*`, `error`, `success`, `warning`
- Spacing: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`
- Font sizes: `xs` through `4xl` with line heights
- Border radii: `sm`, `md`, `lg`, `xl`, `full`

### Rules for writing mobile UI

- **Always use `className`** — never `StyleSheet.create` or inline `style` objects
- Use design token classes (`text-primary-600`, `p-md`, `rounded-lg`) not arbitrary values (`p-[12px]`)
- `SafeAreaView` as outermost wrapper on every screen
- `KeyboardAvoidingView` with `behavior={Platform.OS === "ios" ? "padding" : "height"}` on forms

## MUI Web UI (API Landing Page & Future Web Pages)

The API app uses Material UI v6 for all web pages. **Only `apps/api` uses MUI** — the mobile app does not install it.

### Setup

- **Packages** (in `apps/api`): `@mui/material`, `@mui/material-nextjs`, `@emotion/react`, `@emotion/styled`, `@emotion/cache`
- **Shared theme** (`packages/ui/src/mui-theme.ts`): dark MUI theme derived from design tokens in `packages/ui/src/theme.ts`
- **SSR adapter** (`apps/api/components/ThemeRegistry.tsx`): wraps children in `AppRouterCacheProvider` → `ThemeProvider` → `CssBaseline`
- **Root layout** (`apps/api/app/layout.tsx`): renders `<ThemeRegistry>` to apply theme globally

### Why the subpath export pattern

`packages/ui` exposes the MUI theme via `"./mui-theme"` subpath export, **not** via the main `"."` index. This prevents MUI from being imported into the mobile app (which doesn't install it), keeping the mobile bundle clean.

```typescript
// Correct — only in apps/api
import { muiTheme } from "@app-template/ui/mui-theme";

// Wrong — never import from main index
import { muiTheme } from "@app-template/ui"; // would break mobile
```

### Rules for writing API web pages

- **Always use MUI components** — no raw HTML elements with `style` objects or inline CSS
- Use `Container` for page layout, `Box` for spacing/layout, `Typography` for text
- Use `Paper variant="outlined"` for cards and code blocks
- Use `Chip` for method badges and auth indicators
- Use `TableContainer + Table + TableHead + TableBody + TableRow + TableCell` for data tables
- `CssBaseline` is already applied globally via `ThemeRegistry` — do not add it again in individual pages
- The theme's `palette.mode` is `"dark"` — use semantic color tokens (`color="text.secondary"`, `bgcolor="action.hover"`) not hex values

### Example page structure

```tsx
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function MyPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" fontWeight={700} color="white">
        Title
      </Typography>
      <Box sx={{ mb: 5 }}>{/* content */}</Box>
    </Container>
  );
}
```

## Profile Management

### API Endpoints

- `GET /api/me` — authenticated user profile
- `PATCH /api/me` — update `displayName` and/or `avatarUrl`
- `DELETE /api/me` — full account erasure (LGPD Art. 18, IV)
- `GET /api/me/data-export` — full data export as JSON (LGPD Art. 18, V)

### Avatar Upload Architecture

Avatar upload goes **directly mobile → Supabase Storage** (not proxied through the API). Reason: Vercel serverless functions have a 4.5 MB request body limit which avatar images can exceed.

```
mobile (expo-image-picker) → base64 read (expo-file-system/legacy)
  → Uint8Array → supabase.storage.from("avatars").upload(path, buffer)
  → getPublicUrl() → PATCH /api/me { avatarUrl }
```

Path convention: `{user_id}/avatar.{ext}` — RLS enforces `foldername[1] = auth.uid()::text`.

Always use `upsert: true` and append `?v=Date.now()` to the public URL to bust the CDN cache after re-upload.

### Mobile Hooks

- `apps/mobile/hooks/useProfile.ts` — `useProfile()`, `useUpdateProfile()`, `useUploadAvatar()`
- `useUploadAvatar` reads file with `import * as FileSystem from "expo-file-system/legacy"` — the `EncodingType` enum moved to the legacy export in SDK 52+

## Database Types

Types are **auto-generated** from the live local Supabase schema. Never edit `database.generated.ts` manually.

```bash
pnpm supabase:types   # requires local Supabase running (pnpm supabase:start)
```

### Using typed DB access

```typescript
import type { Tables, TablesInsert, TablesUpdate } from "@app-template/types";

type Profile = Tables<"profiles">; // Row type
type NewProfile = TablesInsert<"profiles">; // Insert type
type ProfilePatch = TablesUpdate<"profiles">; // Update type (all fields optional)
```

- `ProfileRow` in `@app-template/types` is `Tables<"profiles">` — derived from schema, not maintained manually
- `database.generated.ts` is **committed to git** so CI can type-check without a running Supabase instance
- After adding a new migration, always run `pnpm supabase:types` and commit the updated generated file

## Git Workflow & Commit Convention

### Conventional Commits (enforced by commitlint)

Every commit must follow this format:

```
<type>(<scope>): <subject>

type: feat | fix | chore | docs | refactor | test | perf | ci | build
scope: optional, lowercase (e.g. api, mobile, types, auth)
subject: imperative, no period, max 100 chars
```

Examples:

```
feat(mobile): add biometric auth on app resume
fix(api): return 404 instead of 500 for missing profile
chore: bump dependencies
docs: update CLAUDE.md with NativeWind styling rules
```

The `commit-msg` hook rejects non-conforming commits at commit time.

### Pre-commit Hook

`lint-staged` runs automatically on every `git commit`:

- `apps/api/**/*.{ts,tsx}` → ESLint --fix + Prettier
- `apps/mobile/**/*.{ts,tsx}` → ESLint --fix + Prettier
- `packages/**/*.{ts,tsx}` → Prettier
- `**/*.{json,yaml,yml,md}` → Prettier

Type-check is **not** in the pre-commit hook (too slow). Run `pnpm type-check` before pushing, or let CI catch it.

### Versioning

Run `pnpm release` after merging a PR to main. It will:

1. Bump version in `package.json` based on commit types (feat → minor, fix → patch)
2. Update `CHANGELOG.md`
3. Create a git tag

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

1. **Migration**: Create SQL in `supabase/migrations/` (`pnpm supabase:migration <name>`), then run `pnpm supabase:types` and commit the updated generated file
2. **Types**: Add to `packages/types/src/` if needed (prefer `Tables<"your_table">` over manual interfaces)
3. **API route**: Create `apps/api/app/api/<resource>/route.ts` (see template below)
4. **Mobile hook**: Create `apps/mobile/hooks/use<Feature>.ts` with TanStack Query
5. **Mobile screen**: Create `apps/mobile/app/(app)/<screen>.tsx` using `className` (NativeWind)
6. **Tests**: Add tests in `__tests__/` directories
7. **Update CLAUDE.md**: If you introduce a new pattern or convention, document it here

## Adding a New API Route

```typescript
// apps/api/app/api/<resource>/route.ts
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase";
import { errorResponse } from "@/lib/errors";
import type { ApiResponse } from "@app-template/types";

export async function GET(
  request: Request,
): Promise<NextResponse<ApiResponse<YourType>>> {
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

## Adding a New Mobile Screen

```tsx
// apps/mobile/app/(app)/my-screen.tsx
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-md">
        <Text className="text-2xl font-bold text-gray-900">Title</Text>
      </View>
    </SafeAreaView>
  );
}
```

After creating a new screen file, **run `expo start` once** — Expo Router regenerates `.expo/types/router.d.ts` which enables typed `router.push("/(app)/my-screen")`. Until that regeneration, use `router.push("/(app)/my-screen" as Href)` as a workaround.

## Environment Variables

### API (`apps/api/.env.local`)

These variable names are set automatically when you connect Supabase to your Vercel project via the Vercel integration. Copy them to `.env.local` for local development.

| Variable                        | Description                                                            | Required         |
| ------------------------------- | ---------------------------------------------------------------------- | ---------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                                                   | Yes              |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key                                                 | Yes              |
| `SUPABASE_SERVICE_ROLE_KEY`     | Service role key — server only, never expose to client                 | Yes              |
| `SUPABASE_JWT_SECRET`           | JWT secret for token verification                                      | Yes              |
| `POSTGRES_URL_NON_POOLING`      | Direct Postgres connection for migrations (DDL)                        | Yes (migrations) |
| `ADMIN_SECRET`                  | Bearer token for `/api/admin/*` — generate with `openssl rand -hex 32` | Yes (migrations) |
| `CORS_ORIGINS`                  | Comma-separated allowed origins for mobile app                         | No               |
| `SENTRY_DSN`                    | Sentry error tracking DSN                                              | No               |

### Mobile (`apps/mobile/.env`)

| Variable                        | Description                                       | Required |
| ------------------------------- | ------------------------------------------------- | -------- |
| `EXPO_PUBLIC_SUPABASE_URL`      | Supabase project URL                              | Yes      |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key                            | Yes      |
| `EXPO_PUBLIC_API_URL`           | API base URL (Vercel URL or machine IP for local) | Yes      |
| `EXPO_PUBLIC_SENTRY_DSN`        | Sentry DSN for mobile error tracking              | No       |

### Local Development Note

- API `.env.local`: use `http://127.0.0.1:54321` for Supabase URL (loopback is fine for server-to-server)
- Mobile `.env`: use `http://<machine-IP>:54321` — the device/simulator cannot reach `127.0.0.1` on your machine

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

After any migration that changes the schema, run `pnpm supabase:types` and commit the result.

## Common Gotchas

- **MMKV requires a dev client**: Cannot use Expo Go. Run `eas build --profile development` first
- **NativeWind v4 Babel**: Only `jsxImportSource: "nativewind"` in the preset — do NOT add `plugins: ["nativewind/babel"]` (that's v2)
- **expo-file-system EncodingType**: Import from `expo-file-system/legacy`, not `expo-file-system` (moved in SDK 52)
- **Expo Router typed routes**: New screens aren't typed until `expo start` regenerates `.expo/types` — use `as Href` cast in the meantime
- **Metro monorepo**: `metro.config.js` must set `watchFolders` to monorepo root
- **Mobile local dev**: Use machine IP (not localhost) for `EXPO_PUBLIC_API_URL` and `EXPO_PUBLIC_SUPABASE_URL` when testing on device/simulator
- **Apple Sign-In**: Required by App Store Review if Google OAuth is offered
- **Supabase local ports**: API=54321, DB=54322, Studio=54323, Email=54324
- **pnpm + Jest**: `transformIgnorePatterns` in `jest.config.js` must allow workspace packages
- **Two test frameworks**: Vitest for API/packages, Jest for mobile (technical constraint, not preference)
- **`.env` vs `.env.local`**: Next.js dev server only loads `.env.local` — always use `.env.local` for the API
- **Avatar CDN cache**: Append `?v=Date.now()` to avatar public URL after re-upload to bust Supabase CDN cache
- **Avatar upload size**: Bucket limit is 5 MB; `expo-image-picker` quality 0.8 keeps most photos under this
- **`database.generated.ts` is committed**: Do not add it to `.gitignore` — CI needs it for type-checking without a running Supabase instance
