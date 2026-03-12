import * as Sentry from "@sentry/nextjs";

/**
 * Sentry config for the Edge runtime (middleware.ts runs here).
 * This file is auto-loaded by the @sentry/nextjs SDK — do not import it manually.
 */
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,
});
