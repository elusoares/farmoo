#!/usr/bin/env bash

# Sobe o ambiente de desenvolvimento com hot-reload e sincronização automática.
# Usa `docker compose watch` para refletir alterações de código e instalar
# dependências automaticamente quando o package.json muda.

set -euo pipefail

cd "$(dirname "$0")"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'
WATCH_PID_FILE='.compose-watch.pid'
watch_job_pid=''
watch_pgid=''

cleanup_watch() {
  if [[ -n "$watch_pgid" ]] && kill -0 -- "-$watch_pgid" 2>/dev/null; then
    kill -CONT -- "-$watch_pgid" 2>/dev/null || true
    kill -TERM -- "-$watch_pgid" 2>/dev/null || true
  fi

  rm -f "$WATCH_PID_FILE"
}

trap cleanup_watch EXIT
trap 'exit 0' INT TERM HUP

echo -e "${GREEN}🚀 Subindo ambiente de DESENVOLVIMENTO com watch...${NC}"

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

echo -e "${YELLOW}👀 Monitorando alterações em src/ e package.json...${NC}"
echo -e "${YELLOW}   Ctrl+C para sair do watch (os containers continuam rodando).${NC}"
echo ""

setsid --wait bash -c 'printf "%s\n" "$$" > "$1"; exec docker compose watch' _ "$WATCH_PID_FILE" &
watch_job_pid=$!

while [[ ! -s "$WATCH_PID_FILE" ]]; do
  if ! kill -0 "$watch_job_pid" 2>/dev/null; then
    wait "$watch_job_pid"
  fi
done

watch_pgid=$(cat "$WATCH_PID_FILE")

if wait "$watch_job_pid"; then
  exit 0
else
  watch_status=$?
fi

if [[ "$watch_status" -ne 130 && "$watch_status" -ne 137 && "$watch_status" -ne 143 ]]; then
  exit "$watch_status"
fi