# 📱 REALITY FX — MOBILE AUDIT CHECKLIST

*Every build of the Android wrapper, before it is sent to a single student.
One page, walk it top to bottom. The APK is only "release-ready" when every
line is a pass.*

*Author: the machine · 17 Aug 2026 · companion to `android-wrapper/README.md`*

---

## 0. Build integrity (do this first — it gates everything)

- [ ] APK built from a clean `bash build-apk.sh` (never a stale `www/`)
- [ ] `www/` regenerated from the OS + PWA (never hand-edited)
- [ ] APK **signed** with the release keystore (not debug, not unsigned)
- [ ] **SHA-256 computed and written down** — it goes in the email with the file
- [ ] A second person installs the exact APK from the email file (not from the
      build folder) and confirms it installs — this proves the hash matches

## 1. Install & launch

- [ ] Install on a clean Android phone (nothing preloaded) — no Play Protect
      warning that scares the user (explain the "unknown source" step in the
      email if it appears)
- [ ] App icon is the **gold crown** on the launcher, not Capacitor's default
- [ ] Splash is **black with the crown** — no white flash
- [ ] Launches into the OS dashboard within ~3 seconds on a mid-range phone
- [ ] Orientation is portrait and locks (no accidental rotation mid-quiz)

## 2. Identity & session

- [ ] A student with a verified handoff sees **their name** in the greeting
- [ ] A student without a handoff lands in the **demo/local mode** with the
      demo trader — never a blank or error screen
- [ ] The single-session guard behaves: sign in on a second device → first
      device is prompted, not silently kicked
- [ ] Device-protection modal shows the correct code flow on a fresh install

## 3. The journey (the actual education)

- [ ] All **13 chapters** load — every lane (Foundation / Demanding / Elite)
      opens slides from the bundled `assets/` (the 741-slide pack) with **no
      internet**
- [ ] Quizzes grade, explanations render, XP lands, badges award
- [ ] The **certificate room** renders for a passed student
- [ ] **Print certificate (PDF)** on Android: the print sheet opens with the
      A4-landscape full-bleed dark page (allow the popup — it's our page)
- [ ] The **trade journal** opens, logs a trade, recomputes stats, and its
      "never leaves this device" guarantee holds (airplane-mode test)

## 4. Offline behaviour

- [ ] Airplane mode ON: dashboard, chapters, journal, sim, certificate all
      work from the bundle
- [ ] Airplane mode ON → network returns: the app recovers without a restart,
      no frozen spinner
- [ ] No crash or white screen on a cold start with no network

## 5. Performance budget

- [ ] Dashboard paints in one frame budget — no jank scrolling the journey
- [ ] Chapter slides advance without a hitch; images (where bundled) don't
      stutter
- [ ] The sim's tick loop doesn't drain the battery when backgrounded (check
      battery usage after 10 minutes backgrounded)
- [ ] Memory stays flat through 30+ slide changes (no creeping OOM)

## 6. Security on the device

- [ ] Journal data never leaves the device (verified in code AND by testing
      with a network monitor — no `fetch`/`sendBeacon` from journal.js)
- [ ] No PII (email, phone, address, ID) rendered on any screen it shouldn't
      be — run the OS "undefined sweep" pass on the wrapper build
- [ ] The PII scanner still blocks codes/OTPs in Live Room chat
- [ ] App asks for **no permissions at install** (camera/mic/contacts are
      never requested until an explicit feature needs them — and none do in
      the first build)
- [ ] APK hash verification documented in the student email

## 7. Layout & polish across screens

- [ ] Test on at least: a small phone (≤360dp), a standard phone (≈390dp),
      and a large phone/tablet
- [ ] No "kissing" elements — pills, cards, buttons breathe (the OS pill
      standard holds at every width)
- [ ] No text overflow or clipped cards in the dashboard, journey or journal
- [ ] Keyboard doesn't cover form fields (register / journal entry)
- [ ] Dark theme stays black+gold end to end — no white flash between rooms

## 8. Update path

- [ ] A second build (bumped OS stamp) installs **over** the first without
      data loss (progress survives)
- [ ] If data survives: confirm journal + progress carry over

---

## What a PASS looks like

Every box ticked → the APK is distributable: email it with the SHA-256, the
one-line install note ("allow unknown sources — this is our official file"),
and the 30 September promise. Any box unticked → fix, rebuild, re-walk the
list from 0. The machine audits the code; **this checklist audits the
experience** — both have to pass before a student's phone.
