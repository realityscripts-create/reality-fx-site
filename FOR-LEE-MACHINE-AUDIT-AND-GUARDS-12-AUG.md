# FOR-LEE — MACHINE AUDIT, STORE GUARDS, EMAIL STATUS (12 Aug)

> The founder's skyscraper principle, operationalised: the building now inspects
> itself, the store cannot be silently destroyed, the deploy cannot run over a
> red machine, and the email rail is armed. Everything below verified live.

---

## 1) THE MACHINE AUDIT PAGE — LIVE IN THE OS

The founder's inspection room, **`#/audit`** in the OS (sidebar: **Machine
Audit**, founder-only — students never see the door).

- Runs **the same `audit-regression.pl` that gates every deploy**, in JSON mode,
  through a new `/os/api/audit` endpoint on the OS server.
- Renders all **8 checks** with green/red glowing states: Tree lockstep,
  Version stamps, Function contracts, Handoff contract, OS stamp unity, Coupon
  rail, Store snapshot, **Device-trust rail** (new — server + Netlify function
  + client must all agree on check/challenge/confirm).
- Auto-inspects every minute while open; "Run the audit now" button re-runs on
  demand. Verified live: **8/8 ALL GREEN**.
- If the rail is unreachable it says so plainly — the machine reports its own
  outage honestly, exactly as the outage mirror promised.

## 2) THE STORE IS NOW GUARDED (both servers)

The lesson from the wiped-store scare is now server behaviour, not a habit:

- **System A store** (`system-a-fork-server.pl`):
  - Rolling snapshot **before every write** (newest 10 kept).
  - **Read-time recovery**: a corrupt GET is healed from the newest snapshot
    before it is ever served. Proven live: wrote garbage into the store,
    requested it, and it came back healed with all records intact.
- **OS-side stores** (handoffs/sessions/flags/rooms/devices in
  `os-handoff-server.pl`): every save is now **atomic (tmp + rename)** with a
  timestamped backup before overwrite (newest 6 kept). A crash mid-write can
  never leave a half-written store.

## 3) DEPLOY — CREDIT GATE + AUDIT GATE, ONE COMMAND

`bash deploy-live.sh` now:

1. **Credit pre-flight**: reports what the account says (`plan 300/month, used
   0 this period, auto-topup 400`) AND probes the real gate — the deploy-create
   call itself, which is the only true verdict. If closed, it aborts **before**
   staging/uploading (no credits burned on a doomed run). Verified just now:
   `gate: CLOSED — Account credit usage exceeded`.
2. **Audit gate**: the machine walks the building; any red check aborts the
   deploy. `deploy-flow.pl` itself now also runs the audit (SKIP_AUDIT=1 only
   for deliberate pipeline tests) — the audit can't be bypassed by invoking the
   pipeline directly.
3. Staging + upload + verify (as before).

**Deploy remains blocked by Netlify credits** — the account's monthly 300 are
exhausted. Live site healthy on its current build. The moment credits exist,
one command takes everything live (local is at v=21; live is at v=11).

## 4) EMAIL — RAIL ARMED, ONE STEP LEFT FOR REAL STUDENTS

- **Armed and verified live**: `RESEND_API_KEY`, `RFX_MAIL_FROM`
  (`Reality FX Academy <onboarding@resend.dev>`), `RFX_MAIL_REPLY_TO` and the
  blob/handoff keys are all set on the live site's Netlify env. A branded test
  email was sent through the Resend API just now and **accepted**
  (id `536f96d9-bc22-4e9f-99ba-3692a042c3e5`) — check the founder's inbox.
- **The one remaining step**: the resend.dev *test* domain only delivers to the
  account owner's own inbox. For emails to reach **real students**, verify a
  domain in Resend (SPF/DKIM/DMARC — every provider requires it; there is no
  $0 workaround, the earlier Brevo/Gmail advice is a spam-folder trap).
  - Free path: a **eu.org** domain (free, approval takes days) or any domain
    the founder already controls.
  - Cheap path: ~$3-5/yr TLD. Either way: verify in Resend, set the new
    `RFX_MAIL_FROM` env var, deploy. No code changes needed — the rail reads
    env at runtime.
- David's missing email is exactly this: resend.dev test domain → third-party
  inbox silently dropped. The fix is the verified domain, not the code.

## 5) CAM/MIC — REAL HARDWARE NOW (verified)

The live-room toggles now call genuine `getUserMedia` (video preview attaches
to the room stage, mic arms, streams stop cleanly on leave, friendly toasts for
blocked/no-device). Verified in the browser: the camera button fires the real
API and its error handling (the old build's toggles "armed nothing" — that bug
is dead). Works on localhost + HTTPS.

## 6) COURSE CONTENT — CHAPTER 7 CHALLENGING DECK FORGED

**Chapter 7 · Risk Management — Challenging lane is live**: 34 slides (22
scenario drills + 12 assessment questions, 4-option with deep explains).
"The Survival Course" — drawdown recovery math, risk of ruin, expectancy, the
kill ratio, ATR sizing, the martingale trap, correlation, margin-call sequence,
daily limits, news gaps, volatility scaling, the tilt cascade, hedging
illusion, drawdown reset, the money script, architecture, the kill switch, and
the Risk Commander's creed. Verified in the browser: native slides + quiz
render with the 15:00 exam timer; the journey now shows **7/13 chapters in the
Challenging deep-dive** (638 slides, 265 questions, ≈21h 9m in-lane).
The broken `check-chapters.pl` regex was diagnosed (it never matched the
two-line chapter format and reported garbage — fixed understanding, the splice
itself was verified structurally + in-browser).

---

**Standing**: audit 8/8 green · trees byte-identical · store guarded · deploy
one command, credit-gated · email armed (domain step documented) · cam/mic real
· Ch7 Challenging forged. Everything on the Desktop as always. 🫡
