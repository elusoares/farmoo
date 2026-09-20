#!/usr/bin/env bash

# Destrói todos os containers do projeto (dev e prod), incluindo os volumes.

set -euo pipefail

cd "$(dirname "$0")"

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'
WATCH_PID_FILE='.compose-watch.pid'

stop_compose_watch() {
	if [[ ! -f "$WATCH_PID_FILE" ]]; then
		return
	fi

	watch_pid=$(cat "$WATCH_PID_FILE")

	if [[ "$watch_pid" =~ ^[0-9]+$ ]] && kill -0 -- "-$watch_pid" 2>/dev/null; then
		echo -e "${YELLOW}👀 Encerrando monitoramento de desenvolvimento...${NC}"
		kill -CONT -- "-$watch_pid" 2>/dev/null || true
		kill -TERM -- "-$watch_pid" 2>/dev/null || true

		for _ in {1..50}; do
			if ! kill -0 -- "-$watch_pid" 2>/dev/null; then
				break
			fi
			read -r -t 0.1 || true
		done

		if kill -0 -- "-$watch_pid" 2>/dev/null; then
			kill -KILL -- "-$watch_pid"
		fi
	fi

	rm -f "$WATCH_PID_FILE"
}

echo -e "${YELLOW}🛑 Destruindo containers (dev + prod) e volumes...${NC}"

stop_compose_watch
docker compose down -v

echo -e "${GREEN}✅ Tudo parado.${NC}"