#!/usr/bin/env bash
# ============================================================
# RFX OS Android wrapper — build the web bundle (www/)
# ------------------------------------------------------------
# Composes the exact production layout into www/:
#   index.html + css/ + js/ + assets/ (the OS, staged at root)
#   rfx-pwa/                        (manifest, sw, icons, install)
# This is the same composition deploy-live.sh stages for the
# live site — the wrapper must never diverge from it.
# ============================================================
set -euo pipefail
cd "$(dirname "$0")/.."

OS="$(cd ../REALITY-FOREX-TRADING-/os && pwd)"
PWA="$(cd ../rfx-pwa && pwd)"

echo "  OS : $OS"
echo "  PWA: $PWA"

rm -rf www
mkdir -p www

cp -r "$OS/index.html"  www/
cp -r "$OS/css"         www/css
cp -r "$OS/js"          www/js
cp -r "$OS/assets"      www/assets        # 741 chapter slides — the OS loads them at runtime
cp -r "$PWA"            www/rfx-pwa

# Root-relative PWA refs (manifest icon paths, sw shell) resolve best with
# the icons also at the root — harmless duplication, zero layout drift.
cp "$PWA/icon-192.png"   www/icon-192.png
cp "$PWA/icon-512.png"   www/icon-512.png
cp "$PWA/maskable-512.png" www/maskable-512.png

# Capacitor serves via its own local server — there are no _headers, so a
# worker at /rfx-pwa/sw.js can never claim scope "/". Move the worker to the
# root and point register.js at it (the scope "/" then becomes legal and the
# whole shell caches offline inside the APK). The source PWA is never touched.
cp "$PWA/sw.js" www/sw.js
sed -i 's|var SW = "/rfx-pwa/sw.js";|var SW = "/sw.js";|' www/rfx-pwa/register.js

echo "  www ready: $(find www -type f | wc -l) files"
