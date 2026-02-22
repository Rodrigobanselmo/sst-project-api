#!/bin/bash

# ============================================
# 🔄 SimpleSST - Restaurar Backup PostgreSQL
# ============================================
# Uso: ./restore.sh backups/simplesst_2024-01-01.sql.gz
# ============================================

set -e

# Diretório do script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

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
echo "   Arquivo: $BACKUP_FILE"
echo "   Tamanho: $(ls -lh $BACKUP_FILE | awk '{print $5}')"
echo ""
read -p "Tem certeza? (digite 'sim' para confirmar): " CONFIRM

if [ "$CONFIRM" != "sim" ]; then
    echo "❌ Restauração cancelada"
    exit 1
fi

echo "🔄 Restaurando backup: $BACKUP_FILE"

# Restaurar (usa postgres como usuário padrão)
gunzip -c $BACKUP_FILE | docker exec -i simplesst-db psql -U postgres postgres

echo "✅ Backup restaurado com sucesso!"

