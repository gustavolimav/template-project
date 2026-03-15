/**
 * lint-staged config — runs fast checks on staged files only.
 *
 * Type-check is intentionally excluded here: it must scan the whole project
 * (not just changed files) and is too slow for a pre-commit hook.
 * Run `pnpm type-check` manually before pushing or let CI catch it.
 */
module.exports = {
  // API and packages: ESLint + Prettier
  "apps/api/**/*.{ts,tsx}": ["pnpm --filter @app-template/api exec eslint --fix --max-warnings 0", "pnpm --filter @app-template/api exec prettier --write"],
  // Mobile: ESLint + Prettier
  "apps/mobile/**/*.{ts,tsx}": ["pnpm --filter @app-template/mobile exec eslint --fix --max-warnings 0", "pnpm --filter @app-template/mobile exec prettier --write"],
  // Shared packages: Prettier only (ESLint runs per-workspace in CI)
  "packages/**/*.{ts,tsx}": ["pnpm exec prettier --write"],
  // JSON, YAML, Markdown: Prettier only
  "**/*.{json,yaml,yml,md}": ["pnpm exec prettier --write"],
};
