# SimpleSST API - Deploy na Magalu Cloud

> **Status: ✅ DEPLOY COMPLETO** (Atualizado em 22/02/2026)

## 📋 Informações do Servidor

| Item               | Valor                                             |
| ------------------ | ------------------------------------------------- |
| **IP do Servidor** | `201.54.2.104`                                    |
| **Domínio**        | `api.production.simplesst.com.br`                 |
| **URL da API**     | `https://api.production.simplesst.com.br`         |
| **Usuário SSH**    | `ubuntu`                                          |
| **Chave SSH**      | `~/.ssh/simplesst_magalu`                         |
| **VM**             | Magalu Cloud BV2-8-40 (8GB RAM, 2 vCPU, 40GB SSD) |
| **Sistema**        | Ubuntu 24.04 LTS                                  |
| **Node.js**        | v22.22.0                                          |
| **PM2**            | v6.0.14                                           |
| **PostgreSQL**     | 17.8 + pgvector 0.8.1 (Docker)                    |
| **Node Max Heap**  | 6144 MB (6 GB)                                    |
| **SSL**            | Let's Encrypt (válido até 23/05/2026)             |

---

## 🔐 Conexões

### SSH

```bash
ssh -i ~/.ssh/simplesst_magalu ubuntu@201.54.2.104
```

### PostgreSQL (via client externo)

| Campo        | Valor            |
| ------------ | ---------------- |
| **Host**     | `201.54.2.104`   |
| **Porta**    | `5432`           |
| **Database** | `postgres`       |
| **Usuário**  | `postgres`       |
| **Senha**    | `-AwsRds3556725` |

> ⚠️ **Importante**: Para conectar externamente, a porta 5432 deve estar liberada no Security Group da Magalu Cloud.

### String de conexão (para DBeaver, pgAdmin, etc)

```
postgresql://postgres:-AwsRds3556725@201.54.2.104:5432/postgres
```

---

## 📁 Estrutura no Servidor

```
/home/ubuntu/sst-project-api/     # Repositório clonado
├── .env                          # Variáveis de ambiente (copiado de deploy/)
├── dist/                         # Build da aplicação
├── deploy/
│   ├── .env                      # Variáveis de ambiente (PRODUÇÃO)
│   └── docker-compose.prod.yml   # Docker Compose (PostgreSQL)
├── cert/                         # Certificados eSocial
├── node_modules/                 # Dependências
├── prisma/                       # Schema e migrations
├── src/                          # Código fonte
└── ...
```

---

## 🚀 Setup Recomendado (PM2 + PostgreSQL Docker)

### 1. Instalar Node.js 22 + PM2

```bash
# Conectar no servidor
ssh -i ~/.ssh/simplesst_magalu ubuntu@201.54.2.104

# Instalar Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 e Yarn
sudo npm install -g pm2 yarn

# Verificar
node --version   # v22.x.x
pm2 --version
```

### 2. Subir PostgreSQL no Docker

```bash
cd /home/ubuntu/sst-project-api/deploy

# Subir PostgreSQL (usa docker-compose.prod.yml que já existe)
sudo docker compose -f docker-compose.prod.yml up -d

# Verificar se está rodando
sudo docker ps
```

### 3. Instalar dependências e buildar

```bash
cd /home/ubuntu/sst-project-api

# Copiar .env para raiz
cp deploy/.env .env

# Atualizar DATABASE_HOST para localhost (não mais 'db')
sed -i 's/DATABASE_HOST=db/DATABASE_HOST=localhost/' .env
sed -i 's/@db:5432/@localhost:5432/' .env

# Instalar dependências
yarn install

# Gerar Prisma Client
npx prisma generate

# Buildar
yarn build

# Rodar migrations
npx prisma migrate deploy
```

### 4. Iniciar com PM2

```bash
cd /home/ubuntu/sst-project-api

# Iniciar aplicação (6GB de memória para documentos grandes)
pm2 start dist/main.js --name simplesst-api --max-memory-restart 6G --node-args='--max-old-space-size=6144'

# Salvar configuração PM2
pm2 save

# Configurar para iniciar no boot
pm2 startup
# Execute o comando que aparecer

# Ver logs
pm2 logs simplesst-api

# Ver status
pm2 status
```

### 5. Configurar Nginx + SSL

```bash
# Instalar Nginx e Certbot
sudo apt-get install -y nginx certbot python3-certbot-nginx

# Criar config do Nginx (com timeouts para operações longas)
sudo tee /etc/nginx/sites-available/simplesst << 'EOF'
server {
    listen 80;
    server_name api.production.simplesst.com.br;
    client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:3333;
        proxy_http_version 1.1;

        # Headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts (600s = 10 min) - importante para geração de documentos
        proxy_read_timeout 600s;
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;

        # Disable buffering for real-time responses
        proxy_buffering off;
        proxy_cache off;
    }
}
EOF

# Ativar site
sudo ln -sf /etc/nginx/sites-available/simplesst /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# Gerar certificado SSL
sudo certbot --nginx -d api.production.simplesst.com.br --email rodrigo@simplesst.com.br --agree-tos --non-interactive

# Renovação automática (já configurada pelo certbot)
sudo systemctl enable certbot.timer
```

### Configuração atual do Nginx (após SSL)

```nginx
server {
    server_name api.production.simplesst.com.br;
    client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:3333;
        proxy_http_version 1.1;

        # Headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts (600s = 10 min)
        proxy_read_timeout 600s;
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;

        # Disable buffering for real-time responses
        proxy_buffering off;
        proxy_cache off;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/api.production.simplesst.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.production.simplesst.com.br/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    listen 80;
    server_name api.production.simplesst.com.br;
    return 301 https://$host$request_uri;
}
```

---

## 🔧 Comandos Úteis

### Comandos rápidos (do seu Mac)

```bash
# Ver status da API
ssh -i ~/.ssh/simplesst_magalu ubuntu@201.54.2.104 "pm2 status"

# Ver logs (últimas 50 linhas)
ssh -i ~/.ssh/simplesst_magalu ubuntu@201.54.2.104 "pm2 logs simplesst-api --lines 50 --nostream"

# Reiniciar API
ssh -i ~/.ssh/simplesst_magalu ubuntu@201.54.2.104 "pm2 restart simplesst-api"

# Deploy rápido (pull + build + restart)
ssh -i ~/.ssh/simplesst_magalu ubuntu@201.54.2.104 "cd /home/ubuntu/sst-project-api && git pull && yarn build && pm2 restart simplesst-api"

# Deploy completo (com migrations)
ssh -i ~/.ssh/simplesst_magalu ubuntu@201.54.2.104 "cd /home/ubuntu/sst-project-api && git pull && yarn install && npx prisma generate && yarn build && npx prisma migrate deploy && pm2 restart simplesst-api"
```

### Comandos no servidor (após SSH)

```bash
# Ver status da API
pm2 status

# Ver logs em tempo real
pm2 logs simplesst-api --lines 100

# Reiniciar API
pm2 restart simplesst-api

# Parar API
pm2 stop simplesst-api

# Ver uso de memória/CPU
pm2 monit

# Ver status do PostgreSQL
sudo docker ps

# Ver logs do PostgreSQL
sudo docker logs simplesst-db --tail 50

# Reiniciar PostgreSQL
sudo docker restart simplesst-db

# Verificar espaço em disco
df -h

# Verificar memória
free -h
```

---

## 🔄 Processo de Deploy (Atualização)

Quando precisar atualizar a API em produção:

```bash
# 1. Conectar no servidor
ssh -i ~/.ssh/simplesst_magalu ubuntu@201.54.2.104

# 2. Ir para o diretório do projeto
cd /home/ubuntu/sst-project-api

# 3. Baixar últimas alterações
git pull

# 4. Instalar novas dependências (se houver)
yarn install

# 5. Gerar Prisma Client
npx prisma generate

# 6. Buildar
yarn build

# 7. Rodar migrations (se houver novas)
npx prisma migrate deploy

# 8. Reiniciar API
pm2 restart simplesst-api

# 9. Verificar logs
pm2 logs simplesst-api --lines 20
```

---

## 🛡️ Security Group (Magalu Cloud)

Portas que devem estar liberadas:

| Porta | Protocolo | Uso                                                  |
| ----- | --------- | ---------------------------------------------------- |
| 22    | TCP       | SSH                                                  |
| 80    | TCP       | HTTP (redireciona para HTTPS)                        |
| 443   | TCP       | HTTPS (API)                                          |
| 5432  | TCP       | PostgreSQL (opcional, só se precisar acesso externo) |

---

## 🔒 SSL / Certificado

O certificado SSL é gerenciado automaticamente pelo **Certbot** e será renovado automaticamente.

- **Validade atual**: até 23/05/2026
- **Renovação automática**: ativa via `certbot.timer`

Para verificar/renovar manualmente:

```bash
# Verificar status do timer
sudo systemctl status certbot.timer

# Testar renovação (dry-run)
sudo certbot renew --dry-run

# Forçar renovação
sudo certbot renew
```

---

## 📝 O que foi configurado

1. ✅ VM criada na Magalu Cloud (São Paulo)
2. ✅ DNS configurado: `api.production.simplesst.com.br` → `201.54.2.104`
3. ✅ Docker instalado
4. ✅ Repositório clonado via Git
5. ✅ Node.js 22.22.0 instalado
6. ✅ PM2 6.0.14 instalado (com startup automático)
7. ✅ Yarn 1.22.22 instalado
8. ✅ PostgreSQL 17.8 + pgvector 0.8.1 rodando em Docker
9. ✅ 145 tabelas / 285 migrations
10. ✅ API rodando com PM2
11. ✅ Nginx configurado como reverse proxy
12. ✅ Timeouts de 600s configurados (para operações longas)
13. ✅ Buffering desativado (para respostas em tempo real)
14. ✅ SSL Let's Encrypt configurado
15. ✅ Renovação automática de SSL ativa

---

## ⚠️ Troubleshooting

### API não está respondendo

```bash
# Verificar se PM2 está rodando
pm2 status

# Se não estiver, iniciar
pm2 start dist/main.js --name simplesst-api --max-memory-restart 6G --node-args='--max-old-space-size=6144'

# Verificar logs de erro
pm2 logs simplesst-api --err --lines 50
```

### PostgreSQL não está acessível

```bash
# Verificar se container está rodando
sudo docker ps

# Se não estiver, subir
cd /home/ubuntu/sst-project-api/deploy
sudo docker compose -f docker-compose.prod.yml up -d
```

### Nginx não está funcionando

```bash
# Testar configuração
sudo nginx -t

# Reiniciar
sudo systemctl restart nginx

# Ver logs
sudo tail -50 /var/log/nginx/error.log
```

### Erro de certificado SSL

```bash
# Verificar certificado
sudo certbot certificates

# Renovar manualmente
sudo certbot renew --force-renewal
```

---

## 💾 Backup e Restore

### Fazer backup

```bash
cd /home/ubuntu/sst-project-api/deploy
./backup.sh
```

### Restaurar backup

```bash
cd /home/ubuntu/sst-project-api/deploy
./restore.sh backups/simplesst_2026-02-22_12-00-00.sql.gz
```

### Restaurar de dump externo (pg_dump format)

```bash
# 1. Copiar dump para o servidor
scp -i ~/.ssh/simplesst_magalu dump.sql ubuntu@201.54.2.104:/home/ubuntu/

# 2. No servidor, copiar para o container e restaurar
sudo docker cp /home/ubuntu/dump.sql simplesst-db:/tmp/
sudo docker exec simplesst-db pg_restore -U postgres -d postgres --no-owner --no-privileges --clean --if-exists /tmp/dump.sql
```

---

## 🧩 pgvector (Busca Vetorial)

O PostgreSQL inclui a extensão **pgvector** para busca por similaridade vetorial.

```sql
-- Verificar se está instalado
SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';

-- Criar extensão (se necessário)
CREATE EXTENSION IF NOT EXISTS vector;

-- Exemplo de uso
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  embedding vector(1536)
);

-- Busca por similaridade (cosine distance)
SELECT * FROM items ORDER BY embedding <=> '[0.1, 0.2, ...]' LIMIT 5;
```

---

## 📊 Monitoramento

### Verificar saúde da API

```bash
curl -s https://api.production.simplesst.com.br/health || echo "API down"
```

### Verificar recursos do servidor

```bash
ssh -i ~/.ssh/simplesst_magalu ubuntu@201.54.2.104 "echo '=== DISK ===' && df -h / && echo '=== MEMORY ===' && free -h && echo '=== PM2 ===' && pm2 jlist | jq '.[0] | {name, pm2_env: {status: .pm2_env.status, memory: .monit.memory, cpu: .monit.cpu}}'"
```

### Verificar PostgreSQL e pgvector

```bash
ssh -i ~/.ssh/simplesst_magalu ubuntu@201.54.2.104 "sudo docker exec simplesst-db psql -U postgres -c 'SELECT version();' && sudo docker exec simplesst-db psql -U postgres -c \"SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';\""
```
