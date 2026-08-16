# ============================================================
# RFX OS — one-command Android APK build (PowerShell)
# ------------------------------------------------------------
#   .\build-apk.ps1
#
# Prerequisites (one-time, see README.md):
#   Node 18+  ·  Android Studio (JDK 17 + SDK)  ·  `npm install`
#   `npm run android:init` (creates android/ + the Gradle wrapper)
#
# Output: dist\RFX-OS-Android.apk — the file you email students.
# ============================================================
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "  [1/4] Building the web bundle (OS + PWA -> www/)..."
bash scripts/build-web.sh

Write-Host "  [2/4] Syncing Capacitor (www -> android assets)..."
npx cap sync android

Write-Host "  [3/4] Gradle assembleRelease..."
Push-Location android
.\gradlew.bat assembleRelease
Pop-Location

Write-Host "  [4/4] Collecting the APK..."
New-Item -ItemType Directory -Force -Path dist | Out-Null
$apk = Get-ChildItem android\app\build\outputs\apk\release\*.apk -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $apk) { Write-Host "  no APK produced — check the Gradle output above."; exit 1 }
Copy-Item $apk.FullName dist\RFX-OS-Android.apk -Force
Write-Host ""
Write-Host "  APK ready: $((Resolve-Path dist\RFX-OS-Android.apk).Path)"
Write-Host "  SHA-256 for the email (students verify the file is ours):"
Get-FileHash dist\RFX-OS-Android.apk -Algorithm SHA256 | ForEach-Object { $_.Hash.ToLower() }
