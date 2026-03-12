import * as Sentry from "@sentry/react-native";

/**
 * Initialise Sentry for the mobile app.
 *
 * DSN is read from EXPO_PUBLIC_SENTRY_DSN. When the variable is absent
 * (local dev without Sentry configured) the call is a no-op.
 *
 * Source maps are uploaded automatically during EAS builds when the
 * SENTRY_AUTH_TOKEN secret is set in the EAS project (see eas.json).
 */
export function initSentry() {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    // Capture 100 % of transactions in dev; reduce in production via
    // environment-specific env vars or a beforeSend filter.
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,
    // Attach breadcrumbs for navigation events automatically
    enableAutoSessionTracking: true,
    // Avoid noise from the Metro dev server
    enabled: !__DEV__,
    debug: false,
  });
}
