import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  transpilePackages: ["@app-template/types"],
  // Include migration SQL files in the serverless function bundle.
  // The files are copied from supabase/migrations/ by scripts/copy-migrations.js
  // during the build step, before next build runs.
  outputFileTracingIncludes: {
    "/api/admin/migrations": ["./migrations/**/*.sql"],
  },
  headers: async () => [
    {
      source: "/api/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
  ],
};

export default withSentryConfig(nextConfig, {
  // Sentry org + project (from sentry.io dashboard)
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Auth token for source map uploads (set in Vercel env vars + CI secrets)
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Silences the Sentry CLI output during builds
  silent: !process.env.CI,
  // Upload source maps to Sentry during production builds
  widenClientFileUpload: true,
  // Delete source maps from the build output after uploading to Sentry
  sourcemaps: { deleteSourcemapsAfterUpload: true },
  // Reduces bundle size by tree-shaking debug code
  disableLogger: true,
});
