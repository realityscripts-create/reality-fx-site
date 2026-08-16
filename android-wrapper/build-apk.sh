#!/usr/bin/env bash
# ============================================================
# RFX OS — one-command Android APK build
# ------------------------------------------------------------
#   bash build-apk.sh
#
# Prerequisites (one-time, see README.md):
#   Node 18+  ·  Android Studio (bundles JDK 17 + SDK)  ·  `npm install`
#   `npm run android:init` (creates android/ + the Gradle wrapper)
#
# Output: dist/RFX-OS-Android.apk — the file you email students.
# ============================================================
set -euo pipefail
cd "$(dirname "$0")"

echo "  [1/4] Building the web bundle (OS + PWA -> www/)..."
bash scripts/build-web.sh

echo "  [2/4] Syncing Capacitor (www -> android assets)..."
npx cap sync android

echo "  [3/4] Gradle assembleRelease..."
( cd android && ./gradlew assembleRelease )

echo "  [4/4] Collecting the APK..."
mkdir -p dist
APK=$(ls android/app/build/outputs/apk/release/*.apk 2>/dev/null | head -1)
[ -n "$APK" ] || { echo "  no APK produced — check the Gradle output above."; exit 1; }
cp "$APK" dist/RFX-OS-Android.apk
echo ""
echo "  ✔ APK ready: $(pwd)/dist/RFX-OS-Android.apk"
echo "  SHA-256 for the email (students verify the file is ours):"
sha256sum dist/RFX-OS-Android.apk
