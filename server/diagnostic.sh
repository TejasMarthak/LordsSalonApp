#!/bin/bash
# Quick diagnostic script for Google OAuth route issue

echo "🔍 GOOGLE OAUTH ROUTE DIAGNOSTIC"
echo "=================================="
echo ""

# Check if server is running
echo "1️⃣  Checking if server is running on port 5000..."
curl -s http://localhost:5000/api/health > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Server is running"
else
    echo "❌ Server is NOT running on port 5000"
    echo "   Run: cd server && npm run dev"
    exit 1
fi

echo ""
echo "2️⃣  Testing OAuth callback endpoint..."
echo "   URL: POST http://localhost:5000/api/auth/oauth/google/callback"
curl -X POST http://localhost:5000/api/auth/oauth/google/callback \
  -H "Content-Type: application/json" \
  -d '{"code":"test"}' 2>/dev/null | jq .

echo ""
echo "3️⃣  Checking environment variables..."
echo "   GOOGLE_CLIENT_ID: $(grep GOOGLE_CLIENT_ID /d/LordsSalonApp/server/.env | cut -d= -f2 | head -c 20)..."
echo "   GOOGLE_CLIENT_SECRET: $(grep GOOGLE_CLIENT_SECRET /d/LordsSalonApp/server/.env | cut -d= -f2 | head -c 20)..."
echo "   GOOGLE_CALLBACK_URL: $(grep GOOGLE_CALLBACK_URL /d/LordsSalonApp/server/.env | cut -d= -f2)"

echo ""
echo "4️⃣  Checking frontend API URL..."
echo "   VITE_API_URL: $(grep VITE_API_URL /d/LordsSalonApp/admin/.env.local | cut -d= -f2)"

echo ""
echo "=================================="
echo "✅ Diagnostic complete"
