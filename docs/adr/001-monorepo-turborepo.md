# ADR-001: Turborepo Monorepo

## Status
Accepted

## Context
Need to share TypeScript types, utilities, and configuration between a Next.js API and an Expo React Native mobile app.

## Decision
Use Turborepo with pnpm workspaces for monorepo management.

## Rationale
- Share types and utilities without publishing to npm
- Intelligent caching reduces build times
- Parallel task execution for dev/build/test
- pnpm's strict dependency resolution prevents phantom dependencies
- Single `pnpm dev` starts both API and mobile

## Alternatives Considered
- **Nx**: More powerful but heavier; overkill for 2-app monorepo
- **Lerna**: Less maintained; Turborepo is the modern successor
- **Separate repos**: Forces npm publishing for shared code; coordination overhead
