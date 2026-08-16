# 📱 Reality FX OS — Android Wrapper

The Reality FX Trading Academy as a distributable **Android APK** — a thin
Capacitor shell around the **existing web OS**. The RFX brain is never rebuilt
or duplicated: the wrapper bundles the exact production layout (`index.html` +
`css/` + `js/` + `assets/` at the root, `rfx-pwa/` beside it) and serves it in
a fullscreen WebView with the gold crown on the launcher.

**This is the distribution playbook's Channel 2**: a signed APK you can email
to students directly — no store, no review queue.

---

## Prerequisites (one-time)

| Tool | Why | Get it |
|---|---|---|
| **Node 18+** | Capacitor CLI | nodejs.org |
| **Android Studio** | Bundles JDK 17 + the Android SDK | developer.android.com/studio |

Install Android Studio, open *SDK Manager* and make sure **Android SDK
Platform 34** and **Build-Tools 34** are installed. That's the whole setup.

## First build (three commands)

```bash
cd android-wrapper
npm install          # 1. pull the Capacitor toolchain
npm run android:init # 2. generate the android/ project + Gradle wrapper (once)
bash build-apk.sh    # 3. build the APK
```

> Windows PowerShell users: `.\build-apk.ps1` instead of `bash build-apk.sh`.
> If `npx cap add android` asks which package to install, pick `@capacitor/android`.

**Output:** `android-wrapper/dist/RFX-OS-Android.apk`

The script prints the **SHA-256** of the APK — include that hash in the email
you send with the file so students can verify the APK is exactly the one we
signed (see the Distribution Playbook: an APK passed around by email is a
phishing surface unless the hash travels with it).

## Everyday builds

After the first build, every future APK is one command:

```bash
bash build-apk.sh     # rebuild web bundle -> sync -> assembleRelease
```

To run it on a connected phone or emulator in dev mode (hot iteration):

```bash
npm run android:dev   # syncs + opens Android Studio — press Run
```

## Signing (before you email students)

The first `build-apk.sh` produces an **unsigned** APK. Android requires a
signature to install. Two options:

1. **Quick (debug-signed, fine for testing):** use the debug key Android
   Studio already generates.
2. **Release signing (do this before real distribution):** in Android Studio,
   *Build → Generate Signed App Bundle / APK → APK*, create a keystore
   (`release.keystore` — keep it safe; you need it for every update), and
   check *V2 signature*.

Once a keystore exists, add it to `android/app/build.gradle` (the
`signingConfigs` + `buildTypes.release` blocks) and `build-apk.sh` will
produce the signed APK automatically.

## Icons

`npm run android:icons` drops the gold crown into every launcher slot after
`android:init`. (Capacitor's default icons are used until then.)

## How the app talks to the Academy

The OS is offline-first: progress, the trade journal, the simulator, chapters
and the certificate all live on the device and work with zero connection —
exactly like the browser version. The cloud rails (`/os/api/*`: handshake
adoption, live rooms, session gate) are enhancements on the hosted site. In
the first wrapper build those fetches fail gracefully and the OS runs in its
proven local mode; pointing the WebView at the hosted Academy (a
`server.url` change in `capacitor.config.json`) is the documented follow-up
for full live mode — see `RFX-MOBILE-AUDIT-CHECKLIST.md` for the exact pass.

## What never changes

- The OS files in `../REALITY-FOREX-TRADING-/os/` and the PWA in `../rfx-pwa/`
  stay the single source of truth. **Edit those, never `www/`** — the build
  script regenerates `www/` from them every time.
- Black + gold identity, the crown, the house rules — everywhere.
