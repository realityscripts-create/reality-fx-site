#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
#  migrate-fresh-account.sh — move the OS to a fresh Netlify account.
#
#  Why: the current account's 300 free build-credits are exhausted (every
#  237MB build spends them), so Netlify blocks new deploys until the monthly
#  reset. Free→free site TRANSFERS aren't self-service on Netlify, so instead
#  this: create a new site on the fresh account, briefly rename the old site
#  to free up "reality-fx-os.netlify.app", claim the name on the new site,
#  re-wire the env vars, deploy the staged v14 zip, and point the deploy
#  script at the new site. Same URL, fresh 300 credits, nothing deleted.
#
#  Usage:  NEW_TOKEN="nfp_..." bash .freebuff/tools/migrate-fresh-account.sh
# ═══════════════════════════════════════════════════════════════════════════
set -e

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NEW_TOKEN="${NEW_TOKEN:-}"
OLD_TOKEN="$(cat "$ROOT/.freebuff/tools/netlify-token.txt" 2>/dev/null)"
ZIP="C:/Users/user/OneDrive/Desktop/RFX-OS-DEPLOY.zip"
OLD_SITE="3c3b9935-9865-47dc-9db0-80de5f8e4591"
API="https://api.netlify.com/api/v1"
NAME="reality-fx-os"
LEGACY="reality-fx-os-legacy"

[ -n "$NEW_TOKEN" ] || { echo "✗ Set NEW_TOKEN=\"nfp_...\" to the fresh account's personal access token"; exit 1; }
[ -f "$ZIP" ] || { echo "✗ Staged zip not found at $ZIP — run deploy-os.sh steps 1–3 first"; exit 1; }

echo "== 1/7  verify the fresh account + its credits =="
ACC_JSON=$(curl -s --max-time 30 -H "Authorization: Bearer $NEW_TOKEN" "$API/accounts")
NEW_ACC=$(printf '%s' "$ACC_JSON" | perl -ne 'print "$1\n" if /"id":"([0-9a-f]{24})"/' | head -1)
[ -n "$NEW_ACC" ] || { echo "✗ Token invalid or no account found"; exit 1; }
echo "   new account: $NEW_ACC"
echo "$ACC_JSON" | grep -o '"credits":{[^}]*}' | head -1

echo "== 2/7  create the new site (temp name while the old one holds the URL) =="
NEW_SITE_JSON=$(curl -s --max-time 40 -X POST -H "Authorization: Bearer $NEW_TOKEN" -H "Content-Type: application/json" \
  -d "{\"name\":\"$NAME-tmp\",\"force_ssl\":true}" "$API/sites")
NEW_SITE=$(printf '%s' "$NEW_SITE_JSON" | perl -ne 'print "$1\n" if /"id":"([0-9a-f]{24})"/' | head -1)
[ -n "$NEW_SITE" ] || { echo "✗ Site create failed: $NEW_SITE_JSON"; exit 1; }
echo "   new site: $NEW_SITE"

echo "== 3/7  free the name (old site → $LEGACY) then claim it (new site → $NAME) =="
curl -s --max-time 30 -X PATCH -H "Authorization: Bearer $OLD_TOKEN" -H "Content-Type: application/json" \
  -d "{\"name\":\"$LEGACY\"}" "$API/sites/$OLD_SITE" | grep -o '"ssl_url":"[^"]*"' | head -1
sleep 2
curl -s --max-time 30 -X PATCH -H "Authorization: Bearer $NEW_TOKEN" -H "Content-Type: application/json" \
  -d "{\"name\":\"$NAME\"}" "$API/sites/$NEW_SITE" | grep -o '"ssl_url":"[^"]*"' | head -1

echo "== 4/7  re-wire the env vars (mail rail + academy secrets) =="
set_env () { # key value
  curl -s --max-time 30 -X PUT -H "Authorization: Bearer $NEW_TOKEN" -H "Content-Type: application/json" \
    -d "{\"key\":\"$1\",\"values\":[{\"value\":\"$2\",\"context\":\"all\",\"role\":\"\"}],\"scopes\":[\"builds\",\"functions\",\"post_processing\",\"runtime\"]}" \
    "$API/sites/$NEW_SITE/env/$1" | grep -o '"key":"[^"]*"' | head -1
}
RESEND="$(grep -m1 -o 're_[A-Za-z0-9_-]*' "$ROOT/.freebuff/tools/resend-key.txt" 2>/dev/null || true)"
[ -n "$RESEND" ] || { echo "✗ No Resend key in .freebuff/tools/resend-key.txt — paste it there first (or add RESEND_KEY env)"; exit 1; }
set_env "RESEND_API_KEY" "$RESEND"
set_env "RFX_MAIL_FROM" "Reality FX Academy <onboarding@resend.dev>"
set_env "RFX_MAIL_REPLY_TO" "leeroychirwa18@gmail.com"

echo "== 5/7  upload the staged build (fresh credits, ~4 min) =="
RESP=$(curl -s --max-time 540 --speed-limit 150000 --speed-time 60 -H "Expect:" --http1.1 -X POST \
  -F "title=RFX OS — fresh account migration" \
  -F "zip=@$ZIP;type=application/zip" \
  -H "Authorization: Bearer $NEW_TOKEN" \
  "$API/sites/$NEW_SITE/builds")
DEPLOY_ID=$(printf '%s' "$RESP" | perl -ne 'print $1 if /"deploy_id":"([^"]+)"/')
[ -n "$DEPLOY_ID" ] || { echo "✗ upload failed: $RESP"; exit 1; }
echo "   deploy: $DEPLOY_ID"
for i in $(seq 1 24); do
  sleep 15
  ST=$(curl -s --max-time 30 -H "Authorization: Bearer $NEW_TOKEN" "$API/sites/$NEW_SITE/deploys/$DEPLOY_ID" | perl -ne 'print $1 if /"state":"(\w+)"/')
  echo "   poll[$i] $ST"
  [ "$ST" = "ready" ] && break
  [ "$ST" = "error" ] && { echo "✗ build errored — check the deploy"; curl -s --max-time 30 -H "Authorization: Bearer $NEW_TOKEN" "$API/sites/$NEW_SITE/deploys/$DEPLOY_ID" | head -c 600; exit 1; }
done

echo "== 6/7  point the deploy script + token at the new site =="
printf '%s' "$NEW_TOKEN" > "$ROOT/.freebuff/tools/netlify-token.txt"
perl -i -pe "s/^SITE_ID=.*/SITE_ID=\"$NEW_SITE\"/" "$ROOT/.freebuff/deploy-os.sh"
echo "   deploy-os.sh now targets $NEW_SITE"

echo "== 7/7  verify the live site =="
sleep 5
echo "   live:  https://$NAME.netlify.app"
timeout 30 curl -s -o /dev/null -w "   index: %{http_code}\n" "https://$NAME.netlify.app/"
timeout 30 curl -s -o /dev/null -w "   rail : %{http_code}\n" "https://$NAME.netlify.app/api/handoffs"
echo "✅ Done — same URL, fresh credits. Next deploys: bash .freebuff/deploy-os.sh"
