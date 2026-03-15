# Changelog

## v1.1.0 — Auth Flow, UI, Profile & Developer Experience (2026-03-14)

### Features

**LGPD-Compliant Auth Flow**

- Register screen with mandatory consent checkbox (LGPD Art. 7, I) blocking submission until accepted
- Forgot-password screen with email validation using shared `@app-template/utils`
- Home screen with profile card (display name, email, member-since date, initials avatar)
- "PRIVACIDADE E DADOS" section: data export (LGPD Art. 18, V) and account deletion with confirmation

**Profile Management**

- Edit Profile screen: tap avatar to pick image, update display name
- Avatar upload directly to Supabase Storage (`avatars` bucket) from the mobile app — bypasses Vercel's 4.5 MB serverless request limit
- `PATCH /api/me` — updates `display_name` and/or `avatar_url`
- `DELETE /api/me` — full account erasure via `supabase.auth.admin.deleteUser`
- `GET /api/me/data-export` — returns all user data as JSON (LGPD Art. 18, V portability)
- Supabase Storage migration (`00000000000002_avatars_storage.sql`): public bucket, per-user RLS

**NativeWind v4 Styling**

- Installed NativeWind v4 (`nativewind@next`) compatible with React Native New Architecture (0.76+)
- Configured `tailwind.config.js` with full design token set from `packages/ui/src/theme.ts` (colors, spacing, typography, radii)
- Replaced all `StyleSheet.create` with `className` across auth and app screens
- `global.css` imported in root `_layout.tsx`; `withNativeWind` wrapper in `metro.config.js`

**Developer Experience**

- **husky** v9 — git hooks initialized via `prepare` script; zero-config for all contributors
- **lint-staged** — pre-commit hook runs ESLint + Prettier on staged `.ts/.tsx` files only; JSON/YAML/Markdown get Prettier
- **commitlint** — `commit-msg` hook enforces Conventional Commits; rejects non-conforming messages
- **standard-version** — `pnpm release` / `pnpm release:minor` / `pnpm release:major` for semver bumps + changelog generation
- **Database type generation** — `pnpm supabase:types` generates `packages/types/src/database.generated.ts` from live local schema
- **Typed DB helpers** in `@app-template/types`: `Database`, `Tables<T>`, `TablesInsert<T>`, `TablesUpdate<T>`, `Enums<T>`; `ProfileRow` is now derived from the generated schema instead of maintained manually

### Bug Fixes

- **NativeWind v4 Babel config** — removed `plugins: ["nativewind/babel"]` (v2-only plugin that breaks v4); v4 only needs `jsxImportSource: "nativewind"` in the Expo preset
- **`AuthUser` type mismatch** — `display_name` was cast as `string | undefined`; corrected to `string | null` to match `AuthUser` interface
- **`expo-file-system` EncodingType** — changed import to `expo-file-system/legacy` (SDK 52+ moved `EncodingType` there)
- **Expo Router typed routes** — `/(app)/edit-profile` cast as `Href` to bypass stale `.expo/types` until `expo start` regenerates

### Architecture Notes

| Decision                                | Rationale                                                                                               |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Direct mobile → Supabase Storage upload | Avoids Vercel 4.5 MB serverless body limit for avatar files                                             |
| `expo-file-system/legacy`               | `EncodingType` relocated in SDK 52; legacy import preserves stable API                                  |
| `jsxImportSource: "nativewind"` only    | NativeWind v4 uses compile-time JSX transform; the v2 Babel plugin (`nativewind/babel`) is incompatible |
| Committed `database.generated.ts`       | CI has no local Supabase instance; generated file must be in source control                             |
| `ProfileRow = Tables<"profiles">`       | Single source of truth: schema defines the type, not a manual interface                                 |

---

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

| Decision                  | Rationale                                                              |
| ------------------------- | ---------------------------------------------------------------------- |
| jose for JWT              | Works in Edge Runtime; TypeScript-first                                |
| Supabase Auth             | Handles JWT, OAuth2, email verify, password reset out of the box       |
| MMKV storage adapter      | Synchronous reads for Axios interceptors; 10x faster than AsyncStorage |
| Route groups (auth)/(app) | Declarative auth guard; integrates with deep linking                   |
| @app-template/ scope      | Template-friendly; replaceable via rename script                       |
| Dual test frameworks      | Jest required for RN; Vitest faster for everything else                |
