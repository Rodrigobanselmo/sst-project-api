#!/bin/bash

# ============================================
# 🔄 SimpleSST - Restaurar Backup PostgreSQL
# ============================================
# Uso: ./restore.sh backups/simplesst_2024-01-01.sql.gz
# ============================================

set -e

# Carregar variáveis de ambiente
source ../.env

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "❌ Erro: Especifique o arquivo de backup"
    echo "Uso: ./restore.sh backups/simplesst_2024-01-01.sql.gz"
    echo ""
    echo "📋 Backups disponíveis:"
    ls -lh backups/*.sql.gz 2>/dev/null || echo "  Nenhum backup encontrado"
    exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Erro: Arquivo não encontrado: $BACKUP_FILE"
    exit 1
fi

echo "⚠️  ATENÇÃO: Isso irá SUBSTITUIR todos os dados do banco!"
read -p "Tem certeza? (digite 'sim' para confirmar): " CONFIRM

if [ "$CONFIRM" != "sim" ]; then
    echo "❌ Restauração cancelada"
    exit 1
fi

echo "🔄 Restaurando backup: $BACKUP_FILE"

# Restaurar
gunzip -c $BACKUP_FILE | docker exec -i simplesst-db psql -U $DATABASE_USER $DATABASE_NAME

echo "✅ Backup restaurado com sucesso!"

