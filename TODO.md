# TODO — Future Improvements

Categorized by priority. Each item includes rationale for why it matters.

## High Priority (Before App Store Submission)

### Push Notifications
- [ ] Set up `expo-notifications` with EAS
- [ ] Create Supabase Edge Function for sending notifications
- [ ] Register device tokens on auth
- [ ] Handle notification deep links
- *Rationale: Expected by users; increases engagement and retention*

### Error Tracking
- [ ] Add `@sentry/react-native` to mobile
- [ ] Add `@sentry/nextjs` to API
- [ ] Configure source map uploading in EAS build
- [ ] Set up error alerting
- *Rationale: Cannot fix bugs you cannot see; critical before real users*

### CI/CD Pipeline
- [ ] GitHub Actions: lint + type-check + test on every PR
- [ ] GitHub Actions: EAS build on push to main
- [ ] Vercel auto-deploy for API (via git integration)
- [ ] Run Supabase migrations in CI
- *Rationale: Prevents regressions; automates the release process*

### App Store Metadata
- [ ] Privacy policy page/URL (required by App Store)
- [ ] Terms of service page/URL
- [ ] App Store screenshots (iPhone 6.7", 6.1")
- [ ] App description, keywords, category
- [ ] App icon in all required sizes (generated from 1024x1024 source)
- *Rationale: Required for App Store Review approval*

## Medium Priority (Post-Launch Polish)

### Offline Support
- [ ] Persist TanStack Query cache with MMKV
- [ ] Optimistic mutations (create/update/delete)
- [ ] Sync queue for offline changes
- [ ] Network status indicator
- *Rationale: Mobile users expect apps to work without connectivity*

### Deep Linking
- [ ] Configure `expo-linking` with custom scheme
- [ ] Universal links for iOS (apple-app-site-association)
- [ ] Handle auth callback deep links
- [ ] Handle notification deep links
- *Rationale: Enables sharing, marketing links, notification taps*

### Dark Mode
- [ ] Define dark color palette in `packages/ui/src/theme.ts`
- [ ] Use `useColorScheme()` hook
- [ ] Ensure all components respect color scheme
- [ ] Test on iOS with system dark mode
- *Rationale: Expected by iOS users; improves accessibility*

### Biometric Auth
- [ ] Add `expo-local-authentication`
- [ ] Prompt for Face ID / Touch ID on app resume
- [ ] Store biometric preference in MMKV
- [ ] Graceful fallback to PIN or re-login
- *Rationale: Security + convenience; common in fintech/productivity apps*

### NativeWind / Tailwind Styling
- [ ] Install NativeWind v4
- [ ] Configure Tailwind with `packages/ui/theme.ts` colors
- [ ] Migrate `StyleSheet.create` to `className`
- [ ] Set up dark mode via NativeWind
- *Rationale: Dramatically faster UI iteration*

### User Profile Management
- [ ] Profile edit screen (display name, avatar)
- [ ] Avatar upload via Supabase Storage
- [ ] Account deletion (GDPR compliance)
- *Rationale: Basic user expectation; GDPR may be legally required*

## Lower Priority (Growth Features)

### Analytics
- [ ] Add PostHog or Mixpanel for event tracking
- [ ] Track: sign up, login, key feature usage, errors
- [ ] Funnel analysis for onboarding
- *Rationale: Data-driven decisions; understand user behavior*

### Accessibility
- [ ] Audit all screens with VoiceOver
- [ ] Add `accessibilityLabel` to all interactive elements
- [ ] Test Dynamic Type scaling
- [ ] Ensure minimum contrast ratios
- *Rationale: Required for broad user base; Apple rewards accessible apps*

### Internationalization (i18n)
- [ ] Set up `expo-localization` + `i18next`
- [ ] Extract all strings to locale files
- [ ] Add Portuguese (pt-BR) as second language
- [ ] Right-to-left layout support
- *Rationale: Multiplies addressable market*

### Testing Expansion
- [ ] E2E tests with Detox or Maestro
- [ ] API integration tests against local Supabase
- [ ] Visual regression tests for components
- [ ] Coverage thresholds in CI
- *Rationale: Confidence for rapid iteration*

### Performance
- [ ] React Native Flipper / Reactotron integration
- [ ] Measure and optimize app startup time
- [ ] Image optimization with `expo-image`
- [ ] Lazy loading for large lists (`FlashList`)
- *Rationale: App Store reviews mention performance; affects ratings*

### Infrastructure
- [ ] Supabase Edge Functions for server-side logic
- [ ] Database backups automation
- [ ] Staging environment (separate Supabase project)
- [ ] Feature flags system
- [ ] Webhook handling
- *Rationale: Operational maturity for production workloads*

### Developer Experience
- [ ] Storybook for mobile components
- [ ] Pre-commit hooks (lint-staged + husky)
- [ ] Conventional commits + auto-changelog
- [ ] Database type generation (`supabase gen types`)
- *Rationale: Faster development cycles; consistent code quality*
