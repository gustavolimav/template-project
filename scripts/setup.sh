#!/bin/bash
set -e

echo "=== App Template Setup ==="
echo ""

# Check prerequisites
check_command() {
  if ! command -v "$1" &> /dev/null; then
    echo "ERROR: $1 is not installed. Please install it first."
    exit 1
  fi
}

echo "Checking prerequisites..."
check_command node
check_command pnpm
check_command docker

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "ERROR: Node.js 20+ required. Current: $(node -v)"
  exit 1
fi

echo "  Node.js $(node -v) ✓"
echo "  pnpm $(pnpm -v) ✓"
echo "  Docker ✓"
echo ""

# Install dependencies
echo "Installing dependencies..."
pnpm install
echo ""

# Start Supabase
echo "Starting local Supabase (requires Docker)..."
npx supabase start
echo ""

# Extract Supabase keys
echo "Extracting Supabase configuration..."
SUPABASE_URL=$(npx supabase status --output json 2>/dev/null | grep -o '"API_URL":"[^"]*"' | cut -d'"' -f4)
SUPABASE_ANON_KEY=$(npx supabase status --output json 2>/dev/null | grep -o '"ANON_KEY":"[^"]*"' | cut -d'"' -f4)
SUPABASE_SERVICE_ROLE_KEY=$(npx supabase status --output json 2>/dev/null | grep -o '"SERVICE_ROLE_KEY":"[^"]*"' | cut -d'"' -f4)

if [ -z "$SUPABASE_URL" ]; then
  echo "Could not auto-extract Supabase keys. Run 'npx supabase status' and fill .env files manually."
  SUPABASE_URL="http://127.0.0.1:54321"
  SUPABASE_ANON_KEY="REPLACE_ME"
  SUPABASE_SERVICE_ROLE_KEY="REPLACE_ME"
fi

# Create API .env.local
if [ ! -f apps/api/.env.local ]; then
  echo "Creating apps/api/.env.local..."
  cat > apps/api/.env.local << EOF
SUPABASE_URL=$SUPABASE_URL
SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
CORS_ORIGINS=http://localhost:8081,exp://localhost:8081
EOF
else
  echo "apps/api/.env.local already exists, skipping."
fi

# Get machine IP for mobile
MACHINE_IP=$(ipconfig getifaddr en0 2>/dev/null || hostname -I 2>/dev/null | awk '{print $1}' || echo "192.168.1.100")

# Create mobile .env
if [ ! -f apps/mobile/.env ]; then
  echo "Creating apps/mobile/.env..."
  cat > apps/mobile/.env << EOF
EXPO_PUBLIC_SUPABASE_URL=$SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
EXPO_PUBLIC_API_URL=http://$MACHINE_IP:3000
EOF
else
  echo "apps/mobile/.env already exists, skipping."
fi

# Apply migrations
echo ""
echo "Applying database migrations..."
npx supabase db push
echo ""

echo "=== Setup Complete ==="
echo ""
echo "Your local environment is ready:"
echo "  API:              http://localhost:3000"
echo "  Supabase Studio:  http://localhost:54323"
echo "  Supabase API:     $SUPABASE_URL"
echo "  Email Testing:    http://localhost:54324"
echo ""
echo "Start development with:"
echo "  pnpm dev"
echo ""
