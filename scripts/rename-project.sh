#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: ./scripts/rename-project.sh @your-scope"
  echo "Example: ./scripts/rename-project.sh @myapp"
  exit 1
fi

NEW_SCOPE="$1"
OLD_SCOPE="@app-template"

if [ "$NEW_SCOPE" = "$OLD_SCOPE" ]; then
  echo "New scope is the same as current scope. Nothing to do."
  exit 0
fi

echo "Renaming project from '$OLD_SCOPE' to '$NEW_SCOPE'..."
echo ""

# Find and replace in all relevant files
find . -type f \( \
  -name "package.json" -o \
  -name "*.ts" -o \
  -name "*.tsx" -o \
  -name "*.js" -o \
  -name "*.mjs" -o \
  -name "*.md" -o \
  -name "*.json" -o \
  -name "*.toml" \
\) \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/.next/*" \
  -not -path "*/.expo/*" \
  -exec sed -i '' "s|$OLD_SCOPE|$NEW_SCOPE|g" {} +

echo "Done! Replaced all occurrences of '$OLD_SCOPE' with '$NEW_SCOPE'."
echo ""
echo "Next steps:"
echo "  1. Run 'pnpm install' to update lockfile"
echo "  2. Run 'pnpm type-check' to verify"
echo ""
