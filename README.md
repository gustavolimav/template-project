# App Template

**v1.1.0** — AI-first iOS app template. Production-ready monorepo with real authentication, LGPD compliance, and full developer tooling.

Built with Turborepo · Next.js 15 · Expo SDK 52 · Supabase · NativeWind v4

---

## What's Included

**Authentication (complete)**

- Email/password with sign up, sign in, email verification, password reset
- Google OAuth + Apple Sign-In (required by App Store)
- JWT verification in API middleware via `jose` + Supabase JWKS
- MMKV token storage (10× faster than AsyncStorage)
- Protected route groups with Expo Router

**LGPD Compliance (Lei 13.709/2018)**

- Consent checkbox at registration (Art. 7, I)
- Data export endpoint — `GET /api/me/data-export` (Art. 18, V)
- Account erasure — `DELETE /api/me` (Art. 18, IV)

**Profile Management**

- Edit display name and avatar
- Avatar upload directly to Supabase Storage (bypasses Vercel's 4.5 MB limit)
- Full account deletion with confirmation

**Developer Experience**

- Pre-commit hooks: ESLint + Prettier via `lint-staged` + `husky`
- Conventional Commits enforced by `commitlint`
- Semver releases + auto-changelog via `standard-version`
- Auto-generated DB types: `pnpm supabase:types`

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+
- [Docker](https://www.docker.com/) (for local Supabase)
- [EAS CLI](https://docs.expo.dev/eas/) — `npm install -g eas-cli`

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Start local Supabase (requires Docker)
pnpm supabase:start

# 3. Copy environment files
cp apps/api/.env.example apps/api/.env.local
cp apps/mobile/.env.example apps/mobile/.env

# 4. Fill in keys from Supabase output
pnpm supabase:status

# 5. Start development
pnpm dev
```

Or run the automated setup script:

```bash
chmod +x scripts/setup.sh && ./scripts/setup.sh
```

> **Note**: The mobile app requires a custom dev client (MMKV won't work with Expo Go).
> Build once: `eas build --profile development --platform ios`

---

## Architecture

```
┌─────────────┐  HTTP + Bearer JWT  ┌──────────────┐  SQL  ┌──────────────┐
│  iOS App    │ ──────────────────→ │  Next.js API │ ────→ │  PostgreSQL  │
│  (Expo)     │                     │  (Vercel)    │       │  (Supabase)  │
└─────────────┘                     └──────────────┘       └──────────────┘
       │                                                           │
       │◄──── Supabase Auth (JWT, OAuth2, email verify) ──────────┤
       │                                                           │
       └──────────── Supabase Storage (avatars) ──────────────────┘
```

### Monorepo Structure

```
├── apps/
│   ├── api/          → Next.js 15 backend (Vercel)
│   └── mobile/       → Expo React Native iOS app (EAS / App Store)
├── packages/
│   ├── types/        → Shared TypeScript types + generated DB types
│   ├── utils/        → Shared validation, date, and error utilities
│   ├── ui/           → Design tokens (colors, spacing, typography)
│   ├── eslint-config/→ Shared ESLint config
│   └── typescript-config/ → Shared tsconfig presets
├── supabase/         → Migrations and local config
├── scripts/          → setup.sh, rename-project.sh, copy-migrations.js
└── docs/             → Architecture Decision Records, auth flow diagrams
```

---

## Commands

| Command                | Description                                   |
| ---------------------- | --------------------------------------------- |
| `pnpm dev`             | Start API + mobile in parallel                |
| `pnpm build`           | Build all workspaces                          |
| `pnpm lint`            | Lint all workspaces                           |
| `pnpm test`            | Run all tests                                 |
| `pnpm type-check`      | TypeScript check all workspaces               |
| `pnpm release`         | Bump patch version + update CHANGELOG         |
| `pnpm release:minor`   | Bump minor version                            |
| `pnpm supabase:start`  | Start local Supabase (Docker required)        |
| `pnpm supabase:stop`   | Stop local Supabase                           |
| `pnpm supabase:reset`  | Reset DB and re-run all migrations            |
| `pnpm supabase:status` | Print local URLs and API keys                 |
| `pnpm supabase:types`  | Regenerate TypeScript types from local schema |

---

## Deployment

### API → Vercel

1. Connect the repo to Vercel and set the root directory to `apps/api`
2. Add environment variables (copy from `apps/api/.env.example`)
3. Push to `main` — Vercel auto-deploys
4. Run migrations after first deploy:
   ```bash
   curl -X POST -H "Authorization: Bearer $ADMIN_SECRET" \
     https://your-app.vercel.app/api/admin/migrations
   ```

### Mobile → App Store

1. Fill in `REPLACE_WITH_*` values in `apps/mobile/eas.json`
2. Add Apple credentials under `submit.production.ios`
3. Build and submit:
   ```bash
   eas build --platform ios --profile production
   eas submit --platform ios
   ```

---

## Git Conventions

Every commit must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(mobile): add push notification support
fix(api): return 404 for missing profile instead of 500
chore: bump dependencies
docs: update README
```

The `commit-msg` hook rejects non-conforming messages. The `pre-commit` hook runs ESLint + Prettier on staged files automatically.

---

## Renaming the Project

```bash
chmod +x scripts/rename-project.sh
./scripts/rename-project.sh @your-scope/app-name
```

Replaces `@app-template` across all `package.json` files and TypeScript imports.

---

## Adding a New Migration

```bash
# 1. Create migration file
pnpm supabase:migration add-your-table

# 2. Write SQL in supabase/migrations/<timestamp>_your-table.sql

# 3. Apply locally
pnpm supabase:reset

# 4. Regenerate TypeScript types
pnpm supabase:types

# 5. Commit both files
git add supabase/migrations/ packages/types/src/database.generated.ts
```
