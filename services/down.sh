#!/usr/bin/env bash

# Destrói todos os containers do projeto (dev e prod), sem destruir os volumes.

set -euo pipefail

cd "$(dirname "$0")"

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${YELLOW}🛑 Destruindo containers (dev + prod), sem destruir os volumes...${NC}"

docker compose down

echo -e "${GREEN}✅ Tudo destruído.${NC}"