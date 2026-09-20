#!/usr/bin/env bash

# Destrói todos os containers do projeto (dev e prod).

set -euo pipefail

cd "$(dirname "$0")"

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${YELLOW}🛑 Parando containers (dev + prod)...${NC}"

# Para o ambiente de produção (ignora override)
docker compose -f docker-compose.yml down

# Para o ambiente de desenvolvimento (usa override automaticamente)
docker compose down

echo -e "${GREEN}✅ Tudo parado.${NC}"