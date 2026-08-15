# 🚀 REALITY FX OS — LAUNCH WEEK CHECKLIST

*The machine is built, audited and waiting. This is the sequence that takes it live —
and keeps it alive. Every item is real: real command, real endpoint, real check.*

---

## DAY 0 — THE GATE OPENS (pre-launch, hours before)

**1. Confirm the deploy gate is open**
```bash
bash deploy-live.sh
```
The script's step [0/5] prints the verdict. If it says *"gate: CLOSED"*, stop —
nothing else on this list matters until credits land.

**2. The one-command deploy (the whole machine)**
```bash
bash deploy-live.sh
```
What it does, in order: credit check → **regression audit (13 sections, ALL
GREEN or it refuses)** → stage the OS → Netlify REST pipeline → verify live
stamp + rails. Watch for: `AUDIT: ALL GREEN`, `DONE url=...`.

**3. Verify the live site actually answers**
```bash
curl -s https://reality-fx-os.netlify.app/ | grep -oE 'v=[0-9]+'
curl -s -o /dev/null -w "%{http_code}\n" https://reality-fx-os.netlify.app/os/api/audit
```
Expect the current stamp (v=53) and HTTP 200 on the audit rail.

**4. Live rails sweep — every rail answers**
```bash
# handshake rail (the identity door)
curl -s -X POST https://reality-fx-os.netlify.app/os/api/handoff -H "Content-Type: application/json" -d '{"studentId":"RFX-10482"}' | head -c 200
# machine self-report
curl -s https://reality-fx-os.netlify.app/os/api/audit | perl -e 'local $/; $_=<>; print /"ok":true/ ? "AUDIT JSON: GREEN\n" : "AUDIT JSON: FAIL\n"'
# challenge leaderboard
curl -s https://reality-fx-os.netlify.app/os/api/challenge/leaderboard | head -c 120
```

**5. Mail rail — demo vs live, decided by you**
- Until the eu.org domain is verified in Resend, codes stay in demo mode
  (`onboarding@resend.dev` only reaches YOUR inbox — students worldwide still
  get the on-screen code fallback).
- The moment the domain is verified: update `RFX_MAIL_FROM` in
  `.freebuff/tools/secrets.env` with Resend's exact sender, then
  `bash deploy-live.sh` again. No other change needed.

---

## DAY 1 — LAUNCH MORNING (the founder's walkthrough)

**6. Founders-only tour, on the PRODUCTION URL (not localhost)**
- [ ] Sign in from a fresh device → expect the **"Is this really you?"** device
      challenge + emailed code (or demo code, see step 5).
- [ ] Register a brand-new student end to end (age gate → guardian if under 18 →
      coupon apply → identity verification → handoff into the OS).
- [ ] Check the **Machine Audit page** (`#/audit`) shows **13 / 13 ALL GREEN** live.
- [ ] Open the **Journey** → scope card shows 774 / 847 / 1,065 slides.
- [ ] Open the **Trade Journal** → hover the stats rail (gold glow), log + delete a test trade.
- [ ] Open the **Trading Challenge** → prices tick, place a test order, watch P/L move.
- [ ] Open the **Live Studio** → toggle **camera and mic** (browser will prompt —
      this is the real hardware check on HTTPS).

**7. The five student journeys (walk one each, note anything odd)**
1. Visitor → coupon → registration → verified student → first lesson.
2. New device login → device challenge → code → in.
3. Under-18 enrollment → guardian authorization email → guardian approves → enrolled.
4. Chapter completion → assessment → 80% gate → trust bar credit.
5. Challenge entry → machine grade → leaderboard → reward eligibility.

**8. Staff consoles**
- [ ] Registrar: student records, access log viewer, masking (no phone/photo for
      staff who don't need them).
- [ ] Audit: the machine report, store snapshots, PII incident board.
- [ ] Coupon analytics: redemptions, origins, expiry.
- [ ] Trial lifecycle: start a staff demo trial, let it lapse, send the contract /
      the "don't give up" email path.

---

## DAY 2–3 — REAL-WORLD SHOWING

**9. Send the first real welcome/onboarding email** (via the mail rail once live)
- Welcome + identity established + "your OS access is ready."
- The founder's pricing letter (the one drafted for the coupon push: *"prices
  going up soon — refer your friends and family before it increases"*).
- Guardian confirmation emails for any under-18 enrolments.

**10. Hall of Fame seeding — the anticipation engine**
- [ ] Seed 2024 / 2025 / 2026 with realistic names and stats (standard/demanding/
      elite lanes) — elite stays rare (that's the point).
- [ ] Verify hover cards show each student's achievements (rewards, prize money).
- [ ] Check the wall renders on mobile (the earlier hover-collision fix held).

**11. Challenge reward path**
- [ ] First machine-graded challenge closes; winner flagged.
- [ ] Staff reviews the machine's assessment, then the R3,000-style boost is
      released per the reward philosophy (recognition + first-account funding).

---

## DAY 4–7 — MONITORING & THE CALM PHASE

**12. Daily 5-minute ritual (owner + Lee)**
```bash
cd "C:/Users/user/Downloads/REALITY FX TRADING/reality-fx-site"
perl audit-regression.pl        # the machine inspects itself — expect ALL GREEN
curl -s https://reality-fx-os.netlify.app/os/api/audit | grep -c '"ok":true'
```
- [ ] If anything is red: fix before building further — the gate exists for this.
- [ ] Watch Netlify: credits remaining, deploy health, function error logs
      (Site → Functions → osapi → Logs).

**13. The trust bar & fair-play watch**
- [ ] Review the fair-play flags board daily in week one.
- [ ] Confirm the trust bar is rewarding fast, honest learners and flagging
      out-of-norm behavior (whistle-blowers working).

**14. Performance sanity**
- [ ] Sim with 600 positions still holds (the documented ceiling — don't exceed
      without a perf budget).
- [ ] Mobile pass on a real phone: nav drawer opens/closes, no card collisions,
      no text overflow (the sweep that found the panel bug).

**15. The week-one report to the founder**
- Deploy count, audit results, emails sent (after domain), students enrolled,
  challenges closed, flags reviewed, credits remaining, anything the machine caught.

---

## THE GOLDEN RULES (printed, framed, obeyed)

1. **Never deploy over a red audit.** `deploy-live.sh` enforces it — don't bypass.
2. **Demo vs live email is a decision, not a bug.** Demo codes on screen until the
   domain verifies; then one env line + one deploy flips it.
3. **Founder-only doors stay founder-only.** Students never see the audit page,
   staff consoles, or incident boards.
4. **The machine catches it before students do.** Every bug this week is a gift —
   log it, fix it, verify it.
5. **One command, one truth.** `bash deploy-live.sh` is the only way to go live.

> *Every lesson is a trade. Every trade is a lesson.* 👑
