import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      exclude: [
        "**/__tests__/**",
        "**/node_modules/**",
        "**/.next/**",
        // Config files — not unit-testable
        "**/*.config.{ts,mjs,js}",
        "**/next-env.d.ts",
        // Next.js / Sentry bootstrap files
        "**/instrumentation.ts",
        "**/sentry.*.config.ts",
        // Next.js shell (layout, landing page, error boundary) — UI-only
        "**/app/layout.tsx",
        "**/app/page.tsx",
        "**/app/global-error.tsx",
        "**/components/**",
        // Scripts — CLI tools, not unit-testable
        "**/scripts/**",
        // Auth routes — thin Supabase wrappers; better as integration tests
        "**/app/api/auth/**",
        // Admin migration runner — integration-only
        "**/app/api/admin/**",
        // Supabase / DB factory — always mocked in unit tests
        "**/lib/supabase.ts",
        "**/lib/db.ts",
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 50,
        statements: 60,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
