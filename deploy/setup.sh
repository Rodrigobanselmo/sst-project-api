#!/bin/bash

# ============================================
# 🚀 SimpleSST - Setup Completo com SSL
# ============================================
# Uso: ./setup.sh seu-email@exemplo.com
# ============================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configurações
DOMAIN="api.production.simplesst.com.br"
EMAIL="${1:-admin@simplesst.com.br}"

echo -e "${GREEN}🚀 Iniciando setup SimpleSST...${NC}"

# 1. Verificar se está rodando como root ou com sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${YELLOW}⚠️  Execute com sudo: sudo ./setup.sh seu-email@exemplo.com${NC}"
    exit 1
fi

# 2. Instalar Docker se não existir
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando Docker...${NC}"
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
fi

# 3. Instalar Docker Compose se não existir
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando Docker Compose...${NC}"
    apt-get update && apt-get install -y docker-compose-plugin
fi

# 4. Criar diretórios necessários
echo -e "${GREEN}📁 Criando diretórios...${NC}"
mkdir -p certbot/www certbot/conf backups

# 5. Criar configuração temporária do Nginx (sem SSL)
echo -e "${GREEN}🔧 Configurando Nginx temporário...${NC}"
cat > nginx/conf.d/default.conf << 'NGINX_TEMP'
server {
    listen 80;
    listen [::]:80;
    server_name api.production.simplesst.com.br;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://api:3333;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
NGINX_TEMP

# 6. Subir containers (sem SSL primeiro)
echo -e "${GREEN}🐳 Iniciando containers...${NC}"
docker compose -f docker-compose.prod.yml up -d --build

# 7. Aguardar containers ficarem prontos
echo -e "${YELLOW}⏳ Aguardando containers iniciarem (30s)...${NC}"
sleep 30

# 8. Gerar certificado SSL com Certbot
echo -e "${GREEN}🔐 Gerando certificado SSL...${NC}"
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN

# 9. Restaurar configuração completa do Nginx (com SSL)
echo -e "${GREEN}🔧 Configurando Nginx com SSL...${NC}"
cat > nginx/conf.d/default.conf << 'NGINX_SSL'
server {
    listen 80;
    listen [::]:80;
    server_name api.production.simplesst.com.br;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 301 https://$host$request_uri; }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.production.simplesst.com.br;

    ssl_certificate /etc/letsencrypt/live/api.production.simplesst.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.production.simplesst.com.br/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    add_header Strict-Transport-Security "max-age=63072000" always;

    proxy_connect_timeout 300;
    proxy_send_timeout 300;
    proxy_read_timeout 300;
    client_max_body_size 50M;

    location / {
        proxy_pass http://api:3333;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
NGINX_SSL

# 10. Reiniciar Nginx com SSL
echo -e "${GREEN}🔄 Reiniciando Nginx com SSL...${NC}"
docker compose -f docker-compose.prod.yml restart nginx

# 11. Configurar renovação automática do certificado (cron)
echo -e "${GREEN}⏰ Configurando renovação automática do SSL...${NC}"
(crontab -l 2>/dev/null; echo "0 3 * * * cd $(pwd) && docker compose -f docker-compose.prod.yml run --rm certbot renew && docker compose -f docker-compose.prod.yml restart nginx") | crontab -

echo -e "${GREEN}✅ ============================================${NC}"
echo -e "${GREEN}✅ Setup completo!${NC}"
echo -e "${GREEN}✅ ============================================${NC}"
echo -e "${NC}"
echo -e "🌐 API disponível em: ${GREEN}https://api.production.simplesst.com.br${NC}"
echo -e "${NC}"
echo -e "📋 Comandos úteis:"
echo -e "   ${YELLOW}docker compose -f docker-compose.prod.yml logs -f${NC}  # Ver logs"
echo -e "   ${YELLOW}docker compose -f docker-compose.prod.yml ps${NC}       # Ver status"
echo -e "   ${YELLOW}docker compose -f docker-compose.prod.yml restart${NC}  # Reiniciar"
echo -e "${NC}"

