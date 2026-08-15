#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
#  deploy-os.sh — THE one command to push the OS to production.
#
#  Syncs the working files → bumps the cache-bust stamp → rebuilds the zip →
#  uploads through the Netlify Build API (the ONLY path that wires the
#  function + env vars) → waits for it to go live → verifies the rail.
#
#  Usage:  bash .freebuff/deploy-os.sh
#  Token:  NETLIFY_TOKEN env var, or .freebuff/tools/netlify-token.txt
# ═══════════════════════════════════════════════════════════════════════════
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OS_SRC="$ROOT/REALITY-FOREX-TRADING-/os"
FN_SRC="$ROOT/netlify/functions/osapi.js"
REDIR_SRC="$ROOT/_redirects"
STAGE="C:/Users/user/Desktop/rfx-os-deploy"
ZIP="C:/Users/user/OneDrive/Desktop/RFX-OS-DEPLOY.zip"
TOKEN_FILE="$ROOT/.freebuff/tools/netlify-token.txt"
KEY_FILE="$ROOT/.freebuff/tools/handoff-key.txt"
TOKEN="${NETLIFY_TOKEN:-$(cat "$TOKEN_FILE" 2>/dev/null)}"
SITE_ID="3c3b9935-9865-47dc-9db0-80de5f8e4591"
API="https://api.netlify.com/api/v1"

[ -n "$TOKEN" ] || { echo "✗ No Netlify token — set NETLIFY_TOKEN or create $TOKEN_FILE"; exit 1; }

echo "== 1/5  bump cache-bust stamp in SOURCE (browsers always fetch the new build) =="
perl -i -pe 's/((?:os|data|mentor|icons)\.(?:js|css)\?v=)(\d+)/$1.($2+1)/ge' "$OS_SRC/index.html"
grep -o 'os.js?v=[0-9]*' "$OS_SRC/index.html" | head -1

echo "== 2/5  sync working files → deploy stage =="
rm -rf "$STAGE" && mkdir -p "$STAGE"
cp -r "$OS_SRC/." "$STAGE/"
mkdir -p "$STAGE/netlify/functions"
cp "$FN_SRC" "$STAGE/netlify/functions/osapi.js"
cp "$REDIR_SRC" "$STAGE/_redirects"
echo "   synced ($(find "$STAGE" -type f | wc -l) files)"

echo "== 3/5  build the deploy zip =="
powershell -NoProfile -ExecutionPolicy Bypass -File "$ROOT/.freebuff/tools/build-api-zip.ps1" -SourceDir "$STAGE" -OutZip "$ZIP" | tail -2

echo "== 4/5  upload via the Build API (~4 min) =="
# -H "Expect:" + --http1.1: disables the 100-continue handshake that makes the
# gateway stall on large uploads; --speed-limit: abort a dead pipe fast so the
# retry loop catches a healthy window instead of burning the whole timeout.
RESP=$(curl -s --max-time 540 --speed-limit 150000 --speed-time 60 -H "Expect:" --http1.1 -X POST \
  -F "title=RFX OS update $(date +%H:%M)" \
  -F "zip=@$ZIP;type=application/zip" \
  -H "Authorization: Bearer $TOKEN" \
  "$API/sites/$SITE_ID/builds")
DEPLOY_ID=$(printf '%s' "$RESP" | perl -ne 'print $1 if /"deploy_id":"([^"]+)"/')
[ -n "$DEPLOY_ID" ] || { echo "✗ upload failed: $RESP"; exit 1; }
echo "   deploy: $DEPLOY_ID"
ST="new"
for i in $(seq 1 24); do
  sleep 15
  ST=$(curl -s --max-time 30 -H "Authorization: Bearer $TOKEN" "$API/sites/$SITE_ID/deploys/$DEPLOY_ID" | perl -ne 'print $1 if /"state":"(\w+)"/')
  echo "   poll[$i] $ST"
  [ "$ST" = "ready" ] && break
  [ "$ST" = "error" -o "$ST" = "failed" ] && { echo "✗ DEPLOY FAILED"; exit 1; }
done
[ "$ST" = "ready" ] || { echo "✗ not ready after polling"; exit 1; }

echo "== 5/5  verify the rail =="
curl -s -o /dev/null -w "   handoffs:            HTTP %{http_code}\n" "https://reality-fx-os.netlify.app/api/handoffs"
curl -s -o /dev/null -w "   old key rejected:    HTTP %{http_code}\n" -X POST -H "Content-Type: application/json" -H "X-RFX-Handoff-Key: rfx-handoff-demo-key" -d '{"studentId":"x"}' "https://reality-fx-os.netlify.app/os/api/handoff"
NEWKEY=$(cat "$KEY_FILE" 2>/dev/null || echo "31wO3R5r7OTi00QfNbQeUybc7lpoIGp3")
curl -s -o /dev/null -w "   new key accepted:    HTTP %{http_code}\n" -X POST -H "Content-Type: application/json" -H "X-RFX-Handoff-Key: $NEWKEY" -d '{"studentId":"RFX-10482"}' "https://reality-fx-os.netlify.app/os/api/handoff"
echo ""
echo "✔ DONE — live at https://reality-fx-os.netlify.app"
