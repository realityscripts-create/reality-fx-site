#!/usr/bin/env bash
# Reality FX demo — one-click start for all three servers.
#   bash .freebuff/tools/start-demo.sh     (or double-click start-demo.bat)
# Starts whatever isn't already running; never duplicates a live server.
set -u
cd "$(dirname "$0")/../.." || exit 1
LOG=.freebuff/logs
mkdir -p "$LOG"

ensure() {
  local port="$1"; shift
  if curl -s -m 1 -o /dev/null "http://127.0.0.1:$port/"; then
    echo "  ✓ port $port already running"
  else
    echo "  ▶ starting port $port → $*"
    nohup "$@" >> "$LOG/demo-server.log" 2>&1 &
  fi
}

echo "Reality FX demo servers"
echo "-----------------------"
# ONE store, ONE build — 8123 and 8124 must share the same state file, or
# logins diverge (a student present on one port and absent on the other).
ensure 8123  perl .freebuff/tools/system-a-fork-server.pl System-A-live 8123 .freebuff/tools/system-a-state.json
ensure 8124  perl .freebuff/tools/system-a-fork-server.pl System-A-live 8124 .freebuff/tools/system-a-state.json
ensure 49270 perl .freebuff/tools/os-handoff-server.pl REALITY-FOREX-TRADING- 49270
echo
echo "  Reception  → http://127.0.0.1:8123/index.html"
echo "  Members    → http://127.0.0.1:8123/member.html"
echo "  RFX OS     → http://127.0.0.1:49270/os/index.html"
echo
echo "Logs: .freebuff/logs/demo-server.log"
