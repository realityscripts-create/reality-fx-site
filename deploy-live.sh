#!/usr/bin/env bash
# ============================================================
# REALITY FX — ONE-COMMAND LIVE DEPLOY
# ------------------------------------------------------------
#   perl audit-regression.pl   -> structural gate (abort on findings)
#   stage the app              -> os mode: OS at site root (index.html +
#                                 css/ + js/ + assets/ + _redirects +
#                                 rfx-pwa/ + netlify/functions)
#                              -> marketing mode: the whole public site
#                                 (REALITY-FOREX-TRADING-/ at root, OS under
#                                 /os/, PWA + functions riding along)
#   deploy-flow.pl             -> Netlify REST pipeline (content-addressed, only
#                                 changed files upload, polls to ready)
#   verify                     -> live stamp + /api rails answer
#
# Usage:  bash deploy-live.sh            (OS site: reality-fx-os.netlify.app)
#         bash deploy-live.sh --marketing (public site: realityfx.netlify.app)
# Env:    NETLIFY_TOKEN / NETLIFY_SITE_ID can override the defaults below.
#         NETLIFY_MARKETING_TOKEN / NETLIFY_MARKETING_SITE_ID override the
#         marketing account's credentials.
# ============================================================

set -euo pipefail
cd "$(dirname "$0")"

MODE="${1:-os}"
MODE="${MODE#--}"
[ "$MODE" = "os" ] || [ "$MODE" = "marketing" ] || { echo "✗ mode must be 'os' or '--marketing'"; exit 1; }

TOKEN="${NETLIFY_TOKEN:-$(cat .freebuff/tools/netlify-token.txt 2>/dev/null || true)}"
OS_SITE_ID="${NETLIFY_SITE_ID:-3c3b9935-9865-47dc-9db0-80de5f8e4591}"                                   # reality-fx-os
MARKETING_SITE_ID="${NETLIFY_MARKETING_SITE_ID:-334794d1-1439-4a7e-bdd8-b59c9f55cefb}"                 # realityfx.netlify.app
# The founder's word (17 Aug 2026): the marketing account's credits restore on
# 10 September. We are in no rush — the gate message says so and we stop polling.
CREDIT_RESTORE_DATE="10 September"
STAGE="$(pwd)/.freebuff/tools/deploy-stage"   # absolute — File::Find chdirs during hashing

if [ "$MODE" = "marketing" ]; then
  SITE_ID="$MARKETING_SITE_ID"
  MTK="${NETLIFY_MARKETING_TOKEN:-$TOKEN}"
  LIVE="https://realityfx.netlify.app"
  echo "  mode: MARKETING site ($LIVE) — the public doors"
else
  SITE_ID="$OS_SITE_ID"
  MTK="$TOKEN"
  LIVE="https://reality-fx-os.netlify.app"
  echo "  mode: OS site ($LIVE) — the classroom"
fi

[ -n "$MTK" ] || { echo "✗ no Netlify token (set NETLIFY_TOKEN or NETLIFY_MARKETING_TOKEN, or fill .freebuff/tools/netlify-token.txt)"; exit 1; }

echo "════════════════════════════════════════════"
echo "  REALITY FX — LIVE DEPLOY"
echo "  $(date)"
echo "════════════════════════════════════════════"

# 0) credit pre-flight — report what the account says, then probe the real gate.
# The account object's counters can lag reality (the API showed 0 used while
# deploys were blocked), so we ALSO fire the deploy-create call: it either
# creates the deploy (proceed) or returns the credit verdict immediately.
echo ""
echo "[0/5] Netlify credit check"
if [ "$MODE" = "os" ]; then
  ACCT_JSON=$(curl -s "https://api.netlify.com/api/v1/accounts/6a7a49f0e7c10e74a063c61c?access_token=$MTK" 2>/dev/null || echo "{}")
  PLAN=$(echo "$ACCT_JSON" | grep -oE '"plan_credits"\s*:\s*[0-9.]+' | grep -oE '[0-9.]+' | head -1)
  USED=$(echo "$ACCT_JSON" | grep -oE '"credits"\s*:\s*\{"included"\s*:\s*[0-9.]+,\s*"used"\s*:\s*[0-9.]+' | grep -oE '"used"\s*:\s*[0-9.]+' | grep -oE '[0-9.]+' | head -1)
  TOPUP=$(echo "$ACCT_JSON" | grep -oE '"swar_auto_topup_credits"\s*:\s*[0-9.]+' | grep -oE '[0-9.]+' | head -1)
  echo "  account says: plan $PLAN credits/month, used $USED this period, auto-topup $TOPUP"
fi
CREATE=$(curl -s -X POST "https://api.netlify.com/api/v1/sites/$SITE_ID/deploys?access_token=$MTK" -H "Content-Type: application/json" -d '{"draft":false}')
if echo "$CREATE" | grep -q '"id"'; then
  echo "  gate: OPEN — a deploy can be created ("$(echo "$CREATE" | grep -oE '"state"\s*:\s*"[a-z]+' | grep -oE '[a-z]+' | head -1)")"
elif echo "$CREATE" | grep -qi 'credit'; then
  echo "  ✗ gate: CLOSED — Netlify says: $(echo "$CREATE" | grep -oE '"error"\s*:\s*"[^"]*' | sed 's/"error"\s*:\s*"//' | head -1)"
  echo "  ✗ Nothing was deployed. The founder's word: credits restore on $CREDIT_RESTORE_DATE — no rush, come back then."
  exit 1
else
  echo "  ⚠ gate: UNKNOWN — $(echo "$CREATE" | head -c 120)"
  echo "  (continuing — the pipeline's own create call will give the final verdict)"
fi

# 1) the gate — the machine walks the building first
echo ""
echo "[1/5] Regression audit"
if ! perl audit-regression.pl; then
  echo "✗ AUDIT FAILED — fix the findings above before going live. Nothing was deployed."
  exit 1
fi

# 2) stage the app at the site root (+ API rail + functions)
echo ""
echo "[2/4] Staging the app at site root"
rm -rf "$STAGE" && mkdir -p "$STAGE"
if [ "$MODE" = "marketing" ]; then
  # The whole public site: the marketing pages at root, the OS under /os/,
  # and the PWA + functions riding along — the exact live topology of
  # realityfx.netlify.app.
  cp -r REALITY-FOREX-TRADING-/index.html     "$STAGE/"
  cp -r REALITY-FOREX-TRADING-/careers.html   "$STAGE/"
  cp -r REALITY-FOREX-TRADING-/why-choose-us.html "$STAGE/"
  cp -r REALITY-FOREX-TRADING-/our-services.html "$STAGE/"
  cp -r REALITY-FOREX-TRADING-/industries.html   "$STAGE/"
  cp -r REALITY-FOREX-TRADING-/programs.html     "$STAGE/"
  cp -r REALITY-FOREX-TRADING-/contact.html      "$STAGE/"
  cp -r REALITY-FOREX-TRADING-/css   "$STAGE/css"
  cp -r REALITY-FOREX-TRADING-/js    "$STAGE/js"
  cp -r REALITY-FOREX-TRADING-/os    "$STAGE/os"       # the classroom rides at /os/
else
  cp -r REALITY-FOREX-TRADING-/os/index.html "$STAGE/"
  cp -r REALITY-FOREX-TRADING-/os/css   "$STAGE/"
  cp -r REALITY-FOREX-TRADING-/os/js    "$STAGE/"
  cp -r REALITY-FOREX-TRADING-/os/assets "$STAGE/assets"   # 741 chapter slides — the OS loads them at runtime
fi
cp _redirects "$STAGE/_redirects"
# the PWA layer (manifest, service worker, install guide) rides every deploy,
# and its _headers grants the worker site-wide scope (Service-Worker-Allowed: /)
cp -r rfx-pwa "$STAGE/rfx-pwa"
cp rfx-pwa/_headers "$STAGE/_headers"
mkdir -p "$STAGE/netlify/functions"
cp netlify/functions/osapi.js   "$STAGE/netlify/functions/"
cp netlify/functions/envprobe.js "$STAGE/netlify/functions/"
# deploy-baked secrets (free-plan env fallback): Netlify's env-var create API
# needs a paid account, so the mail rail's vars ride the deploy in a generated
# module. Source file is .freebuff/tools/secrets.env — never committed, never
# uploaded as a static file (it lives outside $STAGE). UI-set env vars win at
# runtime because osapi.js checks process.env first.
if [ -f .freebuff/tools/secrets.env ]; then
  {
    echo '"use strict";'
    echo '/* generated by deploy-live.sh from .freebuff/tools/secrets.env — never commit the source file */'
    echo 'module.exports = {'
    sed -n 's/^\([A-Z0-9_]*\)=\(.*\)$/  \1: "\2",/p' .freebuff/tools/secrets.env
    echo '};'
  } > "$STAGE/netlify/functions/rfx-env.js"
  echo "  baked $(grep -c ':' "$STAGE/netlify/functions/rfx-env.js") mail secret(s) into the function bundle"
else
  echo "  (no .freebuff/tools/secrets.env — mail rail stays in demo mode)"
fi
echo "  staged $(find "$STAGE" -type f | wc -l) files, stamp: $(grep -oE 'v=[0-9]+' "$STAGE/index.html" 2>/dev/null | sort -u)"

# 3) push through the tested REST pipeline
echo ""
echo "[3/4] Pushing to Netlify (only changed files upload)"
DEPLOY_DIR="$STAGE" NETLIFY_TOKEN="$MTK" NETLIFY_SITE_ID="$SITE_ID" perl .freebuff/tools/deploy-flow.pl
echo "  deploy pipeline finished"

# 4) verify the live site actually serves the new build
echo ""
echo "[4/4] Verifying the live site"
STAMP=$(curl -s "$LIVE/" | grep -oE 'v=[0-9]+' | sort -u | tr '\n' ' ')
echo "  live stamp:  $STAMP"
curl -s -o /dev/null -w "  /               → %{http_code}\n" "$LIVE/"
if [ "$MODE" = "marketing" ]; then
  curl -s -o /dev/null -w "  /careers.html   → %{http_code}\n" "$LIVE/careers.html"
  if curl -s "$LIVE/careers.html" | grep -q "R18,000" && ! curl -s "$LIVE/careers.html" | grep -q "R25,000"; then
    echo "  ✓ careers salaries: realistic rates live (old fantasy figures gone)"
  else
    echo "  ✗ careers salaries did NOT land — investigate before declaring victory."
    exit 1
  fi
else
  curl -s -o /dev/null -w "  /os/api/handoffs → %{http_code}\n" "$LIVE/os/api/handoffs"
  curl -s -o /dev/null -w "  /api/flags       → %{http_code}\n" "$LIVE/api/flags"
fi
# the PWA rail must be live too — manifest, the worker's site-wide scope
# header (without it the install is blocked), and the install guide. Retries
# absorb the few seconds of CDN propagation after the upload.
echo ""
echo "[5/5] Verifying the PWA layer is live"
MANIFEST_CODE=$(curl -s --retry 4 --retry-delay 3 --retry-all-errors -o /dev/null -w "%{http_code}" "$LIVE/rfx-pwa/manifest.json")
echo "  /rfx-pwa/manifest.json → $MANIFEST_CODE"
SW_HEADER=$(curl -s --retry 4 --retry-delay 3 --retry-all-errors -m 12 -D - -o /dev/null "$LIVE/rfx-pwa/sw.js" | grep -i "service-worker-allowed" | tr -d '\r' || echo "MISSING")
echo "  /rfx-pwa/sw.js         → $SW_HEADER"
INSTALL_CODE=$(curl -s --retry 4 --retry-delay 3 --retry-all-errors -o /dev/null -w "%{http_code}" "$LIVE/rfx-pwa/install.html")
echo "  /rfx-pwa/install.html  → $INSTALL_CODE"
if [ "$MANIFEST_CODE" != "200" ] || [ "$INSTALL_CODE" != "200" ]; then
  echo "  ✗ THE APP LAYER DID NOT SHIP — investigate before declaring victory."
  exit 1
fi
if ! echo "$SW_HEADER" | grep -qi "service-worker-allowed:\s*/"; then
  echo "  ✗ WORKER SCOPE HEADER MISSING — installs would be blocked on every device."
  exit 1
fi
echo ""
echo "✅ DONE — one command, whole building walked, app layer live and verified."
