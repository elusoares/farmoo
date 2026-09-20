#!/usr/bin/env bash

# Destrói todos os containers do projeto (dev e prod), incluindo os volumes.

set -euo pipefail

cd "$(dirname "$0")"

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${YELLOW}🛑 Destruindo containers (dev + prod) e volumes...${NC}"

docker compose down -v

echo -e "${GREEN}✅ Tudo parado.${NC}"