#!/usr/bin/env bash
# ==============================================================================
# 🕉️ Real Panchangam & Shraddha Platform - Zero-Downtime Update Script
# Updates repository, runs database migrations, rebuilds apps, and restarts PM2
# ==============================================================================

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Color outputs
GREEN='\033[0;32m'
GOLD='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${GOLD}"
echo "======================================================================"
echo "🕉️  REAL PANCHANGAM PLATFORM - CHECKING FOR UPDATES"
echo "    Directory: ${PROJECT_DIR}"
echo "======================================================================"
echo -e "${NC}"

cd "$PROJECT_DIR"

# 1. PULL LATEST GIT COMMITS
echo -e "${CYAN}[1/5] Pulling latest git commits...${NC}"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
git fetch origin "$CURRENT_BRANCH"
git pull origin "$CURRENT_BRANCH"

# 2. UPDATE NPM DEPENDENCIES
echo -e "${CYAN}[2/5] Installing updated npm packages...${NC}"
npm install --prefer-offline --no-audit

# 3. RUN PRISMA DATABASE MIGRATIONS (Preserves SQLite records)
echo -e "${CYAN}[3/5] Syncing database schema...${NC}"
npx prisma db push --schema=apps/api/prisma/schema.prisma

# 4. REBUILD PACKAGES & WEB BUNDLE
echo -e "${CYAN}[4/5] Compiling engine, API, and web bundles...${NC}"
npm run build

# 5. RESTART API IN PM2 & RELOAD NGINX
echo -e "${CYAN}[5/5] Reloading PM2 and Nginx...${NC}"
pm2 reload panchangam-api || pm2 restart panchangam-api
sudo systemctl reload nginx

echo -e "${GREEN}"
echo "======================================================================"
echo "✅ UPDATE COMPLETE & RUNNING!"
echo "======================================================================"
echo -e "${NC}"
pm2 status
