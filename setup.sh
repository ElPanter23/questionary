#!/bin/bash

echo "🚀 Question Tool Setup"
echo "====================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js ist nicht installiert. Bitte installiere Node.js 18 oder höher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js Version $NODE_VERSION ist zu alt. Bitte installiere Node.js 18 oder höher."
    exit 1
fi

echo "✅ Node.js Version $(node -v) gefunden"

# Install backend dependencies
echo "📦 Installiere Backend-Dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Fehler beim Installieren der Backend-Dependencies"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installiere Frontend-Dependencies..."
cd client
npm install

if [ $? -ne 0 ]; then
    echo "❌ Fehler beim Installieren der Frontend-Dependencies"
    exit 1
fi

cd ..

# Create database directory
mkdir -p server/database

echo "✅ Setup abgeschlossen!"
echo ""
echo "🎮 Um das Spiel zu starten:"
echo "   1. Backend starten: npm run dev"
echo "   2. Frontend starten: npm run client"
echo "   3. Öffne http://localhost:4200 im Browser"
echo ""
echo "📚 Weitere Informationen findest du in der README.md"
