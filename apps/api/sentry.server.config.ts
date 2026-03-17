import * as Sentry from "@sentry/nextjs";

/**
 * Sentry config for the Node.js server runtime (API routes, Server Components).
 * This file is auto-loaded by the @sentry/nextjs SDK — do not import it manually.
 *
 * DSN is read from SENTRY_DSN env var. When absent, Sentry is disabled silently.
 */
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,
  sendDefaultPii: true,
  // Attach local variable values to stack frames for richer debugging
  includeLocalVariables: true,
  // Forward Sentry.logger.* calls to Sentry Logs product
  enableLogs: true,
  // Capture unhandled promise rejections and uncaught exceptions
  integrations: [Sentry.captureConsoleIntegration({ levels: ["error"] })],
});
