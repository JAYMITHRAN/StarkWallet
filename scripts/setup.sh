#!/usr/bin/env bash
set -euo pipefail

echo "▶ StarkMoneyWalletTracker — Phase 1 setup"
echo ""

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "1/4  Installing dependencies (npm workspaces)..."
npm install

echo "2/4  Preparing environment files..."
[ -f server/.env ] || cp server/.env.example server/.env
[ -f client/.env ] || cp client/.env.example client/.env
echo "     server/.env and client/.env are ready — edit server/.env's JWT_SECRET before shipping."

echo "3/4  Generating Prisma client..."
npm run prisma:generate --workspace=server

echo "4/4  Running first database migration..."
npm run prisma:migrate --workspace=server -- --name init

echo ""
echo "✅ Setup complete. Start development with:"
echo "   npm run dev"
