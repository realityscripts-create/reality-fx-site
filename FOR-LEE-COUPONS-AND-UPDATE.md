# FOR LEE — RFX Course Coupons + OS Updates (11 Aug 2026)

> Hey Lee — two things in this brief: a **brand-new system** (RFX Course
> Coupons, built into System A) that you'll mirror server-side in production,
> and a **status rollup** of the OS work since your last brief. Read it top to
> bottom; the coupon section is the new contract.

---

## 1. 🎟️ RFX COURSE COUPONS — the golden ticket (NEW, live in the demo)

**What it is.** A coupon code staff mints for someone who deserves it — a
partner, a scholarship, an easter egg hidden around social spaces. A prospect
applies the code on the **reception** (the official front door), gets routed
into the **standard registration** (never skippable — verify email, human
check, identity, agreements, exactly like every student), with the course
included (free) or discounted. **Once-and-done:** an expired or fully-redeemed
coupon can never be renewed — no resets, no exceptions.

**Why.** Marketing. We share the website with prospects; the coupon is a
golden ticket that routes them into the real registration flow (same feel as
the demo pass: gold card, secure link + email delivery) while still collecting
every identity checkpoint. Coupons can be planted as easter eggs later; for
now staff mints them for people who genuinely deserve one.

**Data model** (lives in System A's shared store, `state.coupons`):

```js
{
  code: "RFX-K4YLKX",            // auto RFX-XXXXXX or custom (A-Z0-9-, 3-20)
  createdBy: "Staff console",
  note: "Lilongwe partner programme scholarship",
  benefit: { type: "free" }      // or { type: "percent", value: 50 }
  totalUses: 1,                  // default 1 (once-and-done); campaigns can raise it
  used: 0,
  createdAt, expiresAt,          // expiresAt null = never; expiry is a hard wall
  status: "active",              // active | paused | revoked
  redemptions: [ { at, email, name, enrId } ]
}
```

**Flow (already built and verified end-to-end in the demo):**
1. **Staff Console → "Coupons" button** → mint a coupon (custom/auto code,
   note, benefit free-or-%, max uses, expiry). List shows every coupon with a
   derived status pill — ACTIVE / PAUSED / EXPIRED / USED UP / REVOKED — plus
   uses and redemption counts. Pause / Revoke are one click.
2. **Reception → "Have a coupon? Redeem a coupon"** gold card. Prospect enters
   the code → **validation first** (no details collected until the coupon is
   proven good): "✓ RFX-K4YLKX — your coupon is valid · Full course access —
   nothing to pay · 1 of 1 use left". Unknown / expired / revoked / used-up
   codes are refused with an honest message ("Coupons are once-and-done — they
   cannot be renewed").
3. Prospect enters **name + email** → redeem → the machine mints the
   enrollment **tagged with the coupon** (`enr.coupon = { code, benefit,
   redeemedAt }`, `paymentMethod: "COUPON"`, `transactionId: "COUPON-<CODE>"`
   for idempotency, price `0` for free or the discounted amount), fires the
   standard **invoice + registration emails**, and shows the secure single-use
   registration link with copy/start buttons.
4. Registration is the same pillar as any purchase — nothing skipped. The
   welcome screen shows **"Covered by coupon RFX-K4YLKX"** instead of R0.00,
   and the invoice email says **GRANTED — Covered by coupon**.
5. **Idempotent per email:** the same address re-applying gets its existing
   link back (never a duplicate student), even after the coupon is fully used.
   A *different* email on a used-up coupon is refused.

**Security touches:** unknown codes raise a `COUPON_UNKNOWN_CODE` security
event; creations/redemptions log `COUPON_CREATED` / `COUPON_REDEEMED`; codes
use a clean alphabet (no 0/O/1/I) so they're easy to read out loud.

**What YOU need to do for production (mirror it server-side):**
- Firestore: `coupons` collection; redemption must be a **transaction**
  (read coupon → check status/expiry/uses → increment `used` + write
  enrollment + write redemption atomically) so two prospects can't burn the
  last use at the same instant. The browser-side check in the demo is honest
  for the demo store; production MUST be server-enforced.
- The coupon statuses (revoked/paused/expired/used) must be re-checked on the
  server at redemption time, never trusted from the client.
- `redeemCoupon`'s per-email idempotency = query enrollments by
  `coupon.code + payment.email` inside the same transaction.
- Emails (invoice + registration) already go through your mail rail — no
  change there.
- Consider a `COUPON_REDEEMED` audit event shape so the SRM can surface
  "how did this student get in" for every enrollment (already on the record
  as `enr.coupon`).

---

## 2. 🧭 OS UPDATES SINCE YOUR LAST BRIEF (all live on the OS build)

- **Completion-time recognition + the Trust Bar hall pass.** The OS times
  every chapter attempt. A pass finished well ahead of the honest estimate
  (~60 min chapter done in ~4 min) on a **high Trust Bar** earns a public
  "Well done — that was fast, and the machine noticed" card; the same speed
  with a low bar stays **evidence** for the moderator. All integrity
  heuristics (rhythm, reading, streaks, patterns, jump-retakes, paused-search,
  fast answers, perfect-fast) are gated behind the Trust Bar — your SRM flags
  arrive only for students the machine does NOT trust. Verified end-to-end in
  the real player (100% pass, 4 min, zero flags on a 100-trust account).
- **Trust loads at boot** — the hall pass is armed before the first lesson
  (a live test caught it only loading on the dashboard; fixed).
- **White-number theme** — ring labels, stat cards, session timer, exam clock,
  drawdown figures: numbers now render white next to the gold icons.
- **Study Hall spacing** — the live strip no longer kisses the trader identity
  card.
- **Reflection-pause CTA** — during a chapter's 2h reflection window the
  dashboard says "Review — [chapter] · retake unlocks in Xm" instead of
  offering "Claim your certificate" to a 0% student.
- **Heartbeat metrics** — "13 chapters · 1,067 slides · 433 assessments across
  Standard, Challenging & Elite · ≈22h of study", all computed dynamically.
- **Live-Trade Scenario depth** — 27 scenario slides added across all 9 tier
  decks (first-live-trade walkthrough, derivative hold, NFP two-way spike,
  breakout-vs-fakeout, reversal anticipation, in-trade psychology) + repaired
  deck layouts in ch3/ch4/ch5/ch6.

## 3. 🚀 NETLIFY STATUS (read this — it affects you)

- The live account's **300 free build-credits are exhausted** → Netlify blocks
  new deploys until the monthly reset. The OS build with everything above is
  **staged and verified** (`RFX-OS-DEPLOY.zip`, v14), one command from live:
  `bash .freebuff/deploy-os.sh` the moment credits exist.
- **Plan:** move the OS to a fresh Netlify account (same URL
  `reality-fx-os.netlify.app`, fresh 300 credits) via
  `.freebuff/tools/migrate-fresh-account.sh` — the founder only needs to
  create the account + token.
- **Never use the Netlify drop zone** for the OS — it silently drops the
  function (the rail dies). Updates go through the Build API / deploy script
  only.
- The handoff key was rotated (old key 403s, new key live) — update
  `handoffApiKey` in your copy if you haven't.
