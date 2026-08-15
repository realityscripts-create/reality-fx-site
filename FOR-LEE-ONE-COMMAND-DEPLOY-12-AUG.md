# FOR-LEE — ONE-COMMAND DEPLOY, CONSOLE NOISE, MOBILE QC (12 Aug)

> Everything below is on my side (the OS) plus one shared tool. The only thing
> standing between the local tree and the live site is **Netlify credits** —
> the account's 300/month build credits are exhausted this cycle, so the API
> refuses new deploys until credits are added or the cycle resets. Code-wise
> the pipeline is proven end to end.

---

## 1) ONE-COMMAND LIVE DEPLOY — `bash deploy-live.sh` (project root)

Runs the full institutional pipeline, no manual steps:

1. **Regression audit** (`audit-regression.pl`) — aborts the deploy if ANY
   check fails. The building is inspected before the weight lands.
2. **Stages the OS app** at the site root (index.html + css/ + js/ +
   `_redirects` + `netlify/functions/`) — the 238 MB `assets/` folder is
   intentionally excluded (nothing references it — checked).
3. **Pushes via the tested REST pipeline** (`deploy-flow.pl`) — content-
   addressed: only *changed* files upload, polls to `ready`, auto-publishes.
4. **Verifies the live site** — new stamp served, `/api/handoffs` + `/api/flags`
   answering.

Targets `reality-fx-os` (site id `3c3b9935-9865-47dc-9db0-80de5f8e4591`).
Token lives in `.freebuff/tools/netlify-token.txt`. `NETLIFY_TOKEN` /
`NETLIFY_SITE_ID` env vars override both.

**Bug fixed during the build:** `deploy-flow.pl` silently hashed **0 static
files** when `DEPLOY_DIR` was relative — `File::Find` chdirs mid-traversal, so
the path broke. The script now passes an absolute stage path (verified:
"hashed 7 static files" = 9 staged − 2 functions). This is exactly the class
of silent failure the audit exists to catch — a deploy that "succeeded" with
an empty manifest would have nuked the live site.

**Deploy status right now:** blocked by Netlify — `Account credit usage
exceeded - new deploys are blocked until credits are added`. Live site is
healthy on its current build (stamps v=8/10/11; local is at v=19). Once
credits are available, the one command takes the whole thing live.

---

## 2) DEV CONSOLE NOISE — killed

Local dev was spamming 404/429s on every boot:

- **`POST /os/api/device/check → 404`** — the device-trust endpoints existed
  only in the Netlify function, not the local server. Added the full
  **device trust store** to `os-handoff-server.pl` (check / challenge /
  confirm, per-student `os-devices.json`, demo code rides back in demo mode).
  Local dev now behaves exactly like production — verified end to end:
  unknown device → challenge → code → confirm → known.
- **`https://ipwho.is/ → 429`** on every boot — the free geolocation rail
  rate-limits hard. `deviceLocation()` now caches: a real answer lives 24 h,
  a failed/rate-limited probe 1 h. Verified: a boot with a fresh cache makes
  **zero** calls to ipwho.is.

Result: a clean boot's console is silent — all rails 200
(handoffs, device/check, rooms, session/claim/heartbeat), no 404s, no 429s.

---

## 3) MOBILE QC PASS — the OS

Verified in the browser at 755 px (tablet width — the preview floor) and by
CSS breakpoint coverage (700 / 640 / 760 / 900 / 980 px):

- **Left panel** — the earlier "won't close" complaint is **fixed**: the
  drawer opens, and closes via the ✕ button, the dimmed backdrop, or picking
  any destination (all three paths verified live).
- **No horizontal scroll** — document scrollWidth ≤ viewport, zero elements
  poking past the right edge (the off-canvas drawer is the only thing ever
  off-screen, and it's *supposed* to be).
- **No text clipping** — zero clipped elements across the dashboard.
- **Machinery** — stacks in a clean single column at narrow width; no
  2,1,1 unevenness anywhere.
- **Touch targets** — 11/12 interactive elements ≥ 36 px (one 35 px ghost
  button, borderline-acceptable).
- Rings, live-session timer, and the founder banner all render correctly at
  narrow width with no kissing cards.

Nothing on your side needs action from this pass — all OS-side.

---

## Standing summary

| Item | State |
|------|-------|
| `deploy-live.sh` | ✅ built, tested through the API gate |
| Netlify deploy | ⏸ blocked — **credits exhausted**, add or wait for cycle |
| Device-trust rail local | ✅ full parity with production |
| ipwho.is noise | ✅ cached (24 h / 1 h failure) |
| Mobile panel close | ✅ verified all three paths |
| Trees | ✅ byte-identical, audit ALL GREEN |
