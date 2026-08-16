#!/usr/bin/env bash
# ============================================================
# RFX OS Android wrapper — launcher icons (run once, after
# `npm run android:init` created android/). Drops the gold
# crown into every launcher slot so the app icon is ours.
# ============================================================
set -euo pipefail
cd "$(dirname "$0")/.."

[ -d android ] || { echo "android/ not found — run 'npm run android:init' first."; exit 1; }

RES="android/app/src/main/res"
SRC="www/rfx-pwa"

# Density buckets -> target pixel sizes (Capacitor default scaffold).
declare -A SLOTS=(
  [mipmap-mdpi]=48
  [mipmap-hdpi]=72
  [mipmap-xhdpi]=96
  [mipmap-xxhdpi]=144
  [mipmap-xxxhdpi]=192
)

for bucket in "${!SLOTS[@]}"; do
  [ -d "$RES/$bucket" ] || continue
  cp "$SRC/icon-512.png" "$RES/$bucket/ic_launcher.png"
  cp "$SRC/icon-512.png" "$RES/$bucket/ic_launcher_round.png"
done

echo "  launcher icons replaced with the RFX crown (512px master scaled by Android)."
