# 📱 REALITY FX MOBILE APP — HANDOFF FOR A FRESH THREAD

*Dropped on the desk 13 Aug 2026 · for whoever opens the mobile build in a new thread*

## The brief (read this first)
`C:\Users\user\Downloads\Reality FX Mobile Application Development Brief.pdf`

Its spirit in one line: **this is NOT a from-scratch mobile build.** The brief's own
headline. The right order is AUDIT → ADAPT → INTEGRATE → OPTIMIZE → NATIVE
FEATURES → SECURITY → TESTING → DISTRIBUTION, and above all:
**REUSE BEFORE REBUILD — do not duplicate the RFX brain.**

## Facts a fresh thread needs (from the live machine)

- **The RFX brain lives in the web OS** — static-first HTML/CSS/JS, zero framework,
  black + gold design system (crown `👑`, gold `#d4af37` / `#a8842a`, near-black `#0e0d0a`).
- **Two interlocking systems**: System A (verification/registration/security hub,
  `System-A-live/`) and System B (the OS campus, `REALITY-FOREX-TRADING-/os/`). The
  handshake rail connects them; the OS refuses entry without a verified identity.
- **19 rooms/routes** in the OS; 13 chapters × 3 lanes (774 / 847 / 1,065 slides);
  ~40k lines hand-built; machine audit: 13 sections, ALL GREEN.
- **APIs already exist** for the app to talk to: `/os/api/handoff`, `/session/*`,
  `/device/*`, `/rooms*`, `/challenge/leaderboard`, `/pii-incidents`, `/flags/*`,
  `/mail` (production function `netlify/functions/osapi.js`, 627 lines, zero deps).
- **The OS is already mobile-responsive** — so the app's real job is: shell +
  native features (notifications, offline, camera/notifications hooks) + the same
  identity/security rails — NOT re-teaching or re-rendering the course from scratch.
- **Deploy/hosting**: Netlify (free tier, currently credit-gated), one-command
  `deploy-live.sh`. Local dev servers + run doc in `.freebuff/run.md`.

## What to paste into the new thread
> Build the Reality FX mobile app (Android + iOS) per
> `C:\Users\user\Downloads\Reality FX Mobile Application Development Brief.pdf`.
> It is NOT a from-scratch build: audit the existing web OS first
> (`C:\Users\user\Downloads\REALITY FX TRADING\reality-fx-site`), reuse the RFX
> brain (never duplicate it), and deliver Android + iOS apps that adapt, integrate
> and optimize the existing system with native features, security and distribution.
> Start with the audit (already built / needs adaptation / needs development).

## Standing notes
- Keep the black + gold identity and the crown everywhere.
- The machine audits itself before every change — keep that discipline.
- OS status: feature-complete, awaiting Netlify credits to go live; email domain
  (eu.org) parked until then.
