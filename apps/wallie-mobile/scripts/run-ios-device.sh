#!/usr/bin/env bash
# Physical device workflow (matches PostShow):
# 1) Start Metro dev server (dev client needs it — debug builds skip embedded JS)
# 2) Build/install native app with --no-bundler
# 3) Keep Metro running in this terminal so you see bundler logs

set -euo pipefail

APP_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
METRO_PORT="${METRO_PORT:-8081}"
METRO_PID=""
STARTED_METRO=false

pick_metro_port() {
  for port in 8081 8082 8083 8084 8085; do
    if ! lsof -i ":$port" -sTCP:LISTEN -t >/dev/null 2>&1; then
      METRO_PORT="$port"
      return
    fi
  done

  echo "No free Metro port found (tried 8081-8085). Stop other Expo apps and retry."
  exit 1
}

cleanup() {
  if [[ "$STARTED_METRO" == "true" ]] && [[ -n "$METRO_PID" ]] && kill -0 "$METRO_PID" 2>/dev/null; then
    kill "$METRO_PID" 2>/dev/null || true
    wait "$METRO_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

ensure_metro_running() {
  if lsof -i ":$METRO_PORT" -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Metro already running on port $METRO_PORT"
    return
  fi

  pick_metro_port

  echo "Starting Metro dev server on port $METRO_PORT (LAN — for your iPhone)..."
  (
    cd "$APP_ROOT"
    exec pnpm exec expo start --dev-client --port "$METRO_PORT"
  ) &
  METRO_PID=$!
  STARTED_METRO=true

  for _ in $(seq 1 80); do
    if lsof -i ":$METRO_PORT" -sTCP:LISTEN -t >/dev/null 2>&1; then
      echo "Metro ready on port $METRO_PORT"
      return
    fi
    if ! kill -0 "$METRO_PID" 2>/dev/null; then
      echo "Metro failed to start."
      exit 1
    fi
    sleep 0.25
  done

  echo "Metro is still starting — continuing with native install..."
}

ensure_metro_running

echo "Building and installing Wallie on your connected iPhone..."
(
  cd "$APP_ROOT"
  exec pnpm exec expo run:ios --device --no-bundler
)

cat <<EOF

Native install finished.
Open the Wallie app on your iPhone — this terminal is serving JavaScript on port $METRO_PORT.

If the app flashes and closes:
  • Settings → Privacy & Security → Developer Mode → ON (restart iPhone if prompted)
  • Delete Wallie, run this command again, then open the app

Press Ctrl+C to stop Metro.

EOF

if [[ "$STARTED_METRO" == "true" ]] && [[ -n "$METRO_PID" ]]; then
  wait "$METRO_PID"
fi
