#!/bin/bash
set -e

API_URL="${1:-http://localhost:3000}"

echo "=== API Smoke Tests ==="
echo "Target: $API_URL"
echo ""

# Health check
echo "1. GET /api/health"
HEALTH=$(curl -s -w "\n%{http_code}" "$API_URL/api/health")
HTTP_CODE=$(echo "$HEALTH" | tail -1)
BODY=$(echo "$HEALTH" | head -1)

if [ "$HTTP_CODE" = "200" ]; then
  echo "   ✓ 200 OK"
  echo "   $BODY"
else
  echo "   ✗ $HTTP_CODE (expected 200)"
  echo "   $BODY"
fi
echo ""

# Unauthenticated request to /api/me
echo "2. GET /api/me (no auth)"
ME=$(curl -s -w "\n%{http_code}" "$API_URL/api/me")
HTTP_CODE=$(echo "$ME" | tail -1)
BODY=$(echo "$ME" | head -1)

if [ "$HTTP_CODE" = "401" ]; then
  echo "   ✓ 401 Unauthorized (expected)"
  echo "   $BODY"
else
  echo "   ✗ $HTTP_CODE (expected 401)"
  echo "   $BODY"
fi
echo ""

echo "=== Done ==="
