#!/bin/bash

# ============================================
# 💾 SimpleSST - Backup Automático PostgreSQL
# ============================================
# Uso: ./backup.sh
# Cron: 0 2 * * * /path/to/backup.sh
# ============================================

set -e

# Carregar variáveis de ambiente
source ../.env

# Configurações
BACKUP_DIR="./backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="$BACKUP_DIR/simplesst_$DATE.sql.gz"
RETENTION_DAYS=7

echo "💾 Iniciando backup..."

# Criar diretório de backup se não existir
mkdir -p $BACKUP_DIR

# Fazer backup
docker exec simplesst-db pg_dump -U $DATABASE_USER $DATABASE_NAME | gzip > $BACKUP_FILE

echo "✅ Backup criado: $BACKUP_FILE"

# Remover backups antigos (mais de 7 dias)
find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "🧹 Backups antigos removidos (> $RETENTION_DAYS dias)"

# Mostrar backups existentes
echo "📋 Backups disponíveis:"
ls -lh $BACKUP_DIR/*.sql.gz 2>/dev/null || echo "  Nenhum backup encontrado"

