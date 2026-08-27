#!/usr/bin/env bash
# ==============================================================================
# 🕉️ Real Panchangam & Shraddha Platform - Automated Production Setup
# Target Environment: Oracle Cloud Infrastructure (OCI) Ubuntu 22.04 / 24.04 LTS
# Domain: realpanchangam.run.place
# ==============================================================================

set -e

DOMAIN="realpanchangam.run.place"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_PORT=4000

# Color outputs
RED='\033[0;31m'
GREEN='\033[0;32m'
GOLD='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${GOLD}"
echo "======================================================================"
echo "🕉️  REAL PANCHANGAM PLATFORM - ORACLE CLOUD PRODUCTION DEPLOYMENT"
echo "    Domain: ${DOMAIN}"
echo "    Path:   ${PROJECT_DIR}"
echo "======================================================================"
echo -e "${NC}"

# 1. ROOT / SUDO VERIFICATION
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}[!] Please run setup.sh as your standard ubuntu user (with sudo access), NOT directly as root.${NC}"
    echo -e "    Example: ./setup.sh"
    exit 1
fi

# 2. CONFIGURE SWAP MEMORY (CRITICAL FOR ORACLE CLOUD 1GB MICRO INSTANCES)
echo -e "${CYAN}[1/7] Checking Swap Memory...${NC}"
EXISTING_SWAP=$(swapon --show | wc -l)
if [ "$EXISTING_SWAP" -le 1 ]; then
    echo -e "${GOLD}[i] Low/No swap detected. Creating 2GB swapfile to prevent OOM build crashes...${NC}"
    sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    if ! grep -q '/swapfile' /etc/fstab; then
        echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    fi
    # Tune swappiness so Linux uses RAM first and swaps only under pressure
    sudo sysctl vm.swappiness=20 2>/dev/null || true
    if ! grep -q 'vm.swappiness' /etc/sysctl.conf; then
        echo 'vm.swappiness=20' | sudo tee -a /etc/sysctl.conf
    fi
    echo -e "${GREEN}[✓] 2GB Swapfile created, enabled, and persisted across reboots via /etc/fstab.${NC}"
else
    echo -e "${GREEN}[✓] Swap memory is already active and configured.${NC}"
fi

# 3. INSTALL SYSTEM DEPENDENCIES & NODE.JS 20 LTS
echo -e "${CYAN}[2/7] Updating system packages and installing Node.js 20 LTS & Nginx...${NC}"
sudo apt update -y
sudo apt install -y curl git build-essential nginx certbot python3-certbot-nginx ufw iptables-persistent

if ! command -v node &> /dev/null || [ "$(node -v | cut -d'.' -f1 | tr -d 'v')" -lt 20 ]; then
    echo -e "${GOLD}[i] Installing Node.js 20 LTS...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

echo -e "${GREEN}[✓] Node $(node -v) & npm $(npm -v) installed.${NC}"

# Install PM2 Process Manager globally if missing
if ! command -v pm2 &> /dev/null; then
    echo -e "${GOLD}[i] Installing PM2 process manager...${NC}"
    sudo npm install -g pm2
fi

# 4. ORACLE CLOUD FIREWALL (IPTABLES & UFW UNBLOCKING)
echo -e "${CYAN}[3/7] Unblocking Oracle Cloud Ubuntu iptables & firewall for HTTP/HTTPS...${NC}"
# Oracle Cloud images drop HTTP/HTTPS by default in iptables:
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT 2>/dev/null || true
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT 2>/dev/null || true
sudo netfilter-persistent save 2>/dev/null || true

sudo ufw allow 'Nginx Full' 2>/dev/null || true
sudo ufw allow OpenSSH 2>/dev/null || true
sudo ufw --force enable 2>/dev/null || true
echo -e "${GREEN}[✓] Firewall configured for Port 80 (HTTP) and Port 443 (HTTPS).${NC}"

# 5. ENVIRONMENT SETUP & DATABASE MIGRATION
echo -e "${CYAN}[4/7] Setting up Environment Variables and Prisma SQLite Database...${NC}"
API_ENV_FILE="${PROJECT_DIR}/apps/api/.env"

if [ ! -f "$API_ENV_FILE" ]; then
    JWT_SECRET=$(openssl rand -hex 32)
    cat <<EOF > "$API_ENV_FILE"
NODE_ENV=production
PORT=${API_PORT}
JWT_SECRET=${JWT_SECRET}
DATABASE_URL="file:./panchangam.db"
ADMIN_PHONE="9999999999"
ADMIN_PASSWORD="PanchangamAdmin@2026"
EOF
    echo -e "${GREEN}[✓] Created apps/api/.env with secure JWT secret.${NC}"
else
    echo -e "${GREEN}[✓] apps/api/.env already exists.${NC}"
fi

# 6. INSTALL WORKSPACE PACKAGES & BUILD
echo -e "${CYAN}[5/7] Installing npm packages and building production bundles...${NC}"
cd "$PROJECT_DIR"
npm install --prefer-offline --no-audit

# Sync Prisma Schema & Seed Admin
echo -e "${GOLD}[i] Initializing SQLite database with Prisma...${NC}"
npx prisma db push --schema=apps/api/prisma/schema.prisma --accept-data-loss
npx tsx apps/api/prisma/seed.ts 2>/dev/null || true

# Compile all workspaces
echo -e "${GOLD}[i] Compiling TypeScript engine, API, and Vite web bundle...${NC}"
npm run build

echo -e "${GREEN}[✓] Production builds generated successfully.${NC}"

# 7. CONFIGURE PM2 SERVICE FOR FASTIFY API
echo -e "${CYAN}[6/7] Configuring PM2 background process for Fastify API...${NC}"
pm2 delete panchangam-api 2>/dev/null || true
pm2 start apps/api/dist/server.js --name "panchangam-api" --cwd "$PROJECT_DIR" --env production
pm2 save
# Ensure auto-restart on instance reboot
STARTUP_CMD=$(pm2 startup systemd -u "$USER" --hp "$HOME" | grep "sudo env PATH")
if [ -n "$STARTUP_CMD" ]; then
    eval "$STARTUP_CMD" || true
fi
echo -e "${GREEN}[✓] PM2 daemon active and configured for system boot.${NC}"

# 8. CONFIGURE NGINX REVERSE PROXY
echo -e "${CYAN}[7/7] Configuring Nginx reverse proxy for ${DOMAIN}...${NC}"
NGINX_CONF="/etc/nginx/sites-available/${DOMAIN}"

sudo tee "$NGINX_CONF" > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    # Web Frontend (Vite Single Page Application)
    root ${PROJECT_DIR}/apps/web/dist;
    index index.html;

    # Gzip Performance
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript application/json;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, no-transform, immutable";
    }

    # Fastify REST API Reverse Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:${API_PORT}/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Swagger / OpenAPI Documentation
    location /docs {
        proxy_pass http://127.0.0.1:${API_PORT}/docs;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/
# Remove default nginx welcome site if active
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

echo -e "${GREEN}"
echo "======================================================================"
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================================================================"
echo -e "${NC}"
echo -e "Your platform is live at: ${CYAN}http://${DOMAIN}${NC}"
echo -e "Swagger API Docs at:     ${CYAN}http://${DOMAIN}/docs${NC}"
echo ""
echo -e "${GOLD}NEXT STEPS FOR HTTPS (FREE SSL):${NC}"
echo -e "Once your DNS A-Record for ${DOMAIN} points to this server's Public IP, run:"
echo -e "   ${CYAN}sudo certbot --nginx -d ${DOMAIN} --redirect${NC}"
echo ""
echo -e "${GOLD}DEFAULT ADMIN CREDENTIALS:${NC}"
echo -e "   Phone:    ${CYAN}9999999999${NC}"
echo -e "   Password: ${CYAN}PanchangamAdmin@2026${NC}"
echo "======================================================================"
