#!/usr/bin/env bash
# RFX demo watchdog — keeps the three demo servers alive.
#   bash .freebuff/tools/watchdog.sh &        (or via start-demo.sh --watchdog)
# Checks every 8s; restarts any server that died. Writes one line per restart
# to .freebuff/logs/watchdog.log — silent otherwise.
set -u
cd "$(dirname "$0")/../.." || exit 1
LOG=.freebuff/logs
mkdir -p "$LOG"
WD="$LOG/watchdog.log"

check() {
  local port="$1"; shift
  if ! curl -s -m 1 -o /dev/null "http://127.0.0.1:$port/"; then
    echo "[$(date '+%F %T')] port $port down — restarting: $*" >> "$WD"
    nohup "$@" >> "$LOG/demo-server.log" 2>&1 &
  fi
}

echo "RFX watchdog running — keeping 8123, 8124 and 49270 alive. Log: $WD"
while true; do
  # ONE store, ONE build — 8123 and 8124 share system-a-state.json so a
  # student can never be missing on one port again.
  check 8123  perl .freebuff/tools/system-a-fork-server.pl System-A-live 8123 .freebuff/tools/system-a-state.json
  check 8124  perl .freebuff/tools/system-a-fork-server.pl System-A-live 8124 .freebuff/tools/system-a-state.json
  check 8125  perl .freebuff/tools/system-a-fork-server.pl System-A-live 8125 .freebuff/tools/system-a-state.json
  check 49270 perl .freebuff/tools/os-handoff-server.pl REALITY-FOREX-TRADING- 49270
  sleep 8
done
