#!/usr/bin/env bash

# Sobe o ambiente de produção em background.
# Ignora o docker-compose.override.yml explicitamente.

set -euo pipefail

cd "$(dirname "$0")"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Subindo ambiente de PRODUÇÃO em background...${NC}"

if [ ! -f .env ]; then
  echo -e "${RED}❌ Arquivo .env não encontrado.${NC}"
  echo -e "${YELLOW}💡 Copie o .env.example e ajuste os valores:${NC}"
  echo "   cp .env.example .env"
  exit 1
fi

if ! docker network inspect farmoo-network >/dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  Rede 'farmoo-network' não encontrada. Criando...${NC}"
  docker network create farmoo-network
fi

docker compose -f docker-compose.yml up -d --build "$@"

echo -e "${GREEN}✅ Ambiente de produção rodando.${NC}"
docker compose -f docker-compose.yml ps