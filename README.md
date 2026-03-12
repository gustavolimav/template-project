# App Template

AI-first iOS app template with authentication. Built as a Turborepo monorepo with Next.js API + Expo React Native.

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+
- [Docker](https://www.docker.com/) (for local Supabase)
- [EAS CLI](https://docs.expo.dev/eas/) (`npm install -g eas-cli`)

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Start local Supabase
pnpm supabase:start

# 3. Copy environment files
cp apps/api/.env.example apps/api/.env.local
cp apps/mobile/.env.example apps/mobile/.env

# 4. Get Supabase keys and update .env files
pnpm supabase:status

# 5. Start development
pnpm dev
```

Or use the setup script:
```bash
chmod +x scripts/setup.sh && ./scripts/setup.sh
```

## Architecture

```
┌─────────────┐    HTTP + JWT    ┌─────────────┐    SQL    ┌──────────────┐
│  iOS App    │ ──────────────→ │  Next.js API │ ───────→ │  PostgreSQL  │
│  (Expo)     │                 │  (Vercel)    │          │  (Supabase)  │
└─────────────┘                 └─────────────┘          └──────────────┘
       │                                                         │
       └── Supabase Auth (JWT, OAuth2, email verify) ────────────┘
```

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start API + mobile in parallel |
| `pnpm build` | Build all workspaces |
| `pnpm lint` | Lint all workspaces |
| `pnpm test` | Run all tests |
| `pnpm type-check` | TypeScript check |
| `pnpm supabase:start` | Start local Supabase |
| `pnpm supabase:stop` | Stop local Supabase |
| `pnpm supabase:reset` | Reset DB + re-run migrations |

## Project Structure

```
├── apps/api/        → Next.js 15 backend API
├── apps/mobile/     → Expo React Native iOS app
├── packages/types/  → Shared TypeScript interfaces
├── packages/utils/  → Shared utility functions
├── packages/ui/     → Design tokens (colors, spacing)
├── supabase/        → Database migrations and config
├── scripts/         → Setup and utility scripts
└── docs/            → Architecture decision records
```

## Authentication

Built-in auth with:
- Email/password (sign up, sign in, email verification)
- Google OAuth
- Apple Sign-In (required for App Store)
- Password reset flow
- JWT verification in API middleware
- Row Level Security in database

## Deployment

### API (Vercel)
Connect the repo to Vercel. Set environment variables. Auto-deploys on push.

### Mobile (App Store)
```bash
eas build --platform ios --profile production
eas submit --platform ios
```

Update `apps/mobile/eas.json` with your Apple credentials first.

## Renaming the Project

```bash
chmod +x scripts/rename-project.sh
./scripts/rename-project.sh @your-app-name
```

This replaces `@app-template` across all package.json files and imports.
