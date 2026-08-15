# REALITY FX — DISTRIBUTION PLAYBOOK
**How students get the Academy on their phones. One page. PWA-first.**

*Author: the machine · 15 Aug 2026 · companion to `rfx-pwa/README.md`*

---

## The decision: skip the stores (for now)

The OS is already offline-first, session-guarded and mobile-native-capable. There is
nothing an app store adds at this stage except review delays, a $25/$99 developer fee
and an update lag. The stores become a **marketing badge later**, not a dependency.

**The official link is the only door.** Students get the Academy from ONE place:
the enrollment flow and official emails. Anyone who hears about Reality FX from
anywhere else is pointed back to that same link. This keeps the phishing surface
near zero.

---

## Channel 1 — PWA (the main way) ✅

Students tap the link → the Academy opens → **Install app** appears in the menu →
it lands on their home screen with the gold crown, opens fullscreen, and updates
itself automatically whenever we ship.

| Device | How they install |
|---|---|
| Android · Chrome | ⋮ menu → "Add to Home screen" / "Install app" |
| iPhone/iPad · Safari | Share → "Add to Home screen" |
| Desktop · Chrome/Edge | address-bar install icon, or ⋮ → "Install Reality FX OS" |

What the PWA layer gives us (all in `rfx-pwa/`, **outside** the OS file group):
- `manifest.json` — app identity, standalone display, install, shortcuts to
  Journey / Laboratory / Journal
- `sw.js` — offline shell; every visited slide keeps working with no internet
- `register.js` — install prompt + iOS hint + slide warm-up
- `install.html` — the branded "put the Academy on your home screen" guide
- `push.js` — push scaffolding (needs a VAPID key + a subscribe endpoint to light
  up; the OS shows no push UI until that exists — nothing pretends)

**Rollout:** the install guide page (`/rfx-pwa/install.html`) is linked from the
welcome/onboarding email. That's the whole funnel: link → guide → installed.

---

## Channel 2 — Direct APK (Android power-users only) 🔧

When we want a true Android package to email: build with **Capacitor** from the PWA
(the brief's own approach), sign it, and publish two things:

1. The APK on the official site: `https://reality-fx-os.netlify.app/rfx-apk/` (or
   the member portal's download rail)
2. The **SHA-256** hash of the exact file, next to the download and in the email

Why the hash: an APK emailed around is a phishing surface — someone could copy our
APK, inject malware, and re-share it. The published hash lets a student verify the
file they received is exactly the file we signed. Verify on device/desktop:

```bash
sha256sum RealityFX-OS-v1.apk        # macOS/Linux
certutil -hashfile RealityFX-OS-v1.apk SHA256   # Windows
```

The same instructions live in `install.html` if we ever flip this channel on.
iOS has no sideload path — iPhones use the PWA, period.

---

## Channel 3 — Stores (later, deliberately)

A 2-week bolt-on when the brand wants the badge: Play dev account ($25 once),
data-safety form (our 18+/guardian gate is exactly what Play wants to see), iOS
needs a Mac/cloud build + $99/yr. Nothing about the current build blocks this
later; deferring costs nothing.

---

## The rules (non-negotiable)

1. **One link, official only.** The link IS the app. No mirrors, no rehosts.
2. **Every update is automatic** via the service worker — students never "update".
3. **The APK, if used, always carries a published SHA-256.**
4. **No app-store dependency in the roadmap** — stores are marketing, not plumbing.

---

## Status

- [x] PWA layer built + verified (all paths resolve in the production layout, v=65)
- [x] Onboarding wired — the install guide is linked in three places, all derived
      from the configured OS endpoint (`osInstallUrl()`, never hardcoded):
      1. the **welcome email** (bridge.js, sent the moment the handshake lands)
      2. the **registration completion screen** (register.html, under "Enter the
         Academy")
      3. the **member panel** access card (My RFX Account, under the Enter button)
- [ ] PWA live-probed on `reality-fx-os.netlify.app` after next deploy
- [ ] (optional) Capacitor APK + SHA-256 rail
