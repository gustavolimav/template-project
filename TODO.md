# TODO — Future Improvements

Categorized by priority. Each item includes rationale for why it matters.

## High Priority (Before App Store Submission)

### Push Notifications

- [x] Set up `expo-notifications` with EAS (`app.json` plugin, `aps-environment` entitlement)
- [x] Create Supabase Edge Function for sending notifications (`supabase/functions/send-notification/`)
- [x] Register device tokens on auth (`hooks/usePushNotifications.ts`, `providers/AuthProvider.tsx`)
- [x] Handle notification deep links (`useNotificationListeners` in root `_layout.tsx`, `data.screen` convention)
- [ ] Obtain EAS project ID and pass it to `getExpoPushTokenAsync({ projectId })` before first build
- [x] Deploy Edge Function: `supabase functions deploy send-notification`
- _Rationale: Expected by users; increases engagement and retention_

### Error Tracking

- [x] Add `@sentry/react-native` to mobile (`lib/sentry.ts`, `app/_layout.tsx`)
- [x] Add `@sentry/nextjs` to API (`sentry.server.config.ts`, `sentry.edge.config.ts`, `next.config.ts`, `instrumentation.ts`, `global-error.tsx`)
- [x] Configure source map uploading in EAS build (`eas.json` + `@sentry/react-native/expo` plugin)
- [ ] Set up error alerting — configure in Sentry dashboard: Alerts → Create Alert Rule
- [x] Fill in `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_DSN`, `SENTRY_AUTH_TOKEN` in env files + Vercel
- _Rationale: Cannot fix bugs you cannot see; critical before real users_

### CI/CD Pipeline

- [x] GitHub Actions: lint + type-check + test on every PR (`.github/workflows/ci.yml`)
- [x] GitHub Actions: EAS build on push to main (`.github/workflows/eas-build.yml`)
- [x] Vercel auto-deploy for API (`.github/workflows/api-deploy.yml`)
- [x] Run Supabase migrations in CI (`migration-check` job in `ci.yml`)
- _Rationale: Prevents regressions; automates the release process_

### App Store Metadata

- [ ] Privacy policy page/URL (required by App Store)
- [ ] Terms of service page/URL
- [ ] App Store screenshots (iPhone 6.7", 6.1")
- [ ] App description, keywords, category
- [ ] App icon in all required sizes (generated from 1024x1024 source)
- _Rationale: Required for App Store Review approval_

## Medium Priority (Post-Launch Polish)

### Offline Support

- [ ] Persist TanStack Query cache with MMKV
- [ ] Optimistic mutations (create/update/delete)
- [ ] Sync queue for offline changes
- [ ] Network status indicator
- _Rationale: Mobile users expect apps to work without connectivity_

### Deep Linking

- [ ] Configure `expo-linking` with custom scheme
- [ ] Universal links for iOS (apple-app-site-association)
- [ ] Handle auth callback deep links
- [ ] Handle notification deep links
- _Rationale: Enables sharing, marketing links, notification taps_

### Dark Mode

- [ ] Define dark color palette in `packages/ui/src/theme.ts`
- [ ] Use `useColorScheme()` hook
- [ ] Ensure all components respect color scheme
- [ ] Test on iOS with system dark mode
- _Rationale: Expected by iOS users; improves accessibility_

### Biometric Auth

- [ ] Add `expo-local-authentication`
- [ ] Prompt for Face ID / Touch ID on app resume
- [ ] Store biometric preference in MMKV
- [ ] Graceful fallback to PIN or re-login
- _Rationale: Security + convenience; common in fintech/productivity apps_

### NativeWind / Tailwind Styling

- [x] Install NativeWind v4
- [x] Configure Tailwind with `packages/ui/theme.ts` colors
- [x] Migrate `StyleSheet.create` to `className`
- [ ] Set up dark mode via NativeWind
- _Rationale: Dramatically faster UI iteration_

### User Profile Management

- [x] Profile edit screen (display name, avatar)
- [x] Avatar upload via Supabase Storage
- [x] Account deletion (LGPD/GDPR compliance)
- [x] Data export endpoint (LGPD Art. 18, V — portability)
- _Rationale: Basic user expectation; LGPD/GDPR legally required_

### UI Component Library (Material UI)

- [x] Install `@mui/material` and `@emotion/react` / `@emotion/styled` in `apps/api`
- [x] Install `@mui/material-nextjs` adapter for Next.js App Router (SSR-safe theme injection)
- [x] Define shared theme in `packages/ui/src/mui-theme.ts` extending MUI default theme with project color palette
- [x] Replace raw HTML/CSS in API landing page and any future web pages with MUI components
- [x] Add `CssBaseline` to API root layout for consistent cross-browser baseline styles
- _Rationale: Production-ready component system; consistent web UI; pairs well with the existing design tokens in `packages/ui/src/theme.ts`_

## Lower Priority (Growth Features)

### Analytics

- [ ] Add PostHog or Mixpanel for event tracking
- [ ] Track: sign up, login, key feature usage, errors
- [ ] Funnel analysis for onboarding
- _Rationale: Data-driven decisions; understand user behavior_

### Accessibility

- [ ] Audit all screens with VoiceOver
- [ ] Add `accessibilityLabel` to all interactive elements
- [ ] Test Dynamic Type scaling
- [ ] Ensure minimum contrast ratios
- _Rationale: Required for broad user base; Apple rewards accessible apps_

### Internationalization (i18n)

- [ ] Set up `expo-localization` + `i18next`
- [ ] Extract all strings to locale files
- [ ] Add Portuguese (pt-BR) as second language
- [ ] Right-to-left layout support
- _Rationale: Multiplies addressable market_

### Testing Expansion

- [ ] E2E tests with Detox or Maestro
- [ ] API integration tests against local Supabase
- [ ] Visual regression tests for components
- [ ] Coverage thresholds in CI
- _Rationale: Confidence for rapid iteration_

### Performance

- [ ] React Native Flipper / Reactotron integration
- [ ] Measure and optimize app startup time
- [ ] Image optimization with `expo-image`
- [ ] Lazy loading for large lists (`FlashList`)
- _Rationale: App Store reviews mention performance; affects ratings_

### Infrastructure

- [ ] Supabase Edge Functions for server-side logic
- [ ] Database backups automation
- [ ] Staging environment (separate Supabase project)
- [ ] Feature flags system
- [ ] Webhook handling
- _Rationale: Operational maturity for production workloads_

### Developer Experience

- [ ] Storybook for mobile components
- [x] Pre-commit hooks (lint-staged + husky)
- [x] Conventional commits + auto-changelog (`commitlint` + `standard-version`)
- [x] Database type generation (`supabase gen types` → `packages/types/src/database.generated.ts`)
- _Rationale: Faster development cycles; consistent code quality_
