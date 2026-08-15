# FOR-LEE — System A: Lineage Restoration + Today's Updates

> Everything below is built, synced to BOTH trees (`System-A-live` + the source
> folder), and verified live in the browser. Work the sections top to bottom.

---

## 1. ⚠️ URGENT — the db.js lineage break is FIXED (please never let this recur)

**What happened:** the served `db.js` (3170 lines) had silently lost an entire
feature layer. The member panel's dashboard called `db.trustScore`,
`db.isFoundersDay`, `db.sessionStillValid`, `db.journeyCal`, `db.supportThreads`
etc. — and **none of those functions existed in the file anymore**. The panel
rendered the name, then crashed on the first card. The staff console, SRM
profile view and member panel were all partially broken by the same gap.

**The root cause:** the two source trees drifted apart and an older-lineage
`db.js` was copied over the rich one. The rich lineage still existed in
`C:\Users\user\AppData\Local\Temp\served-a\db.js` (4,796 lines) — recovered and
made the base again.

**The fix (done):**
- Base restored from the rich 4,796-line lineage: trust bar, founder day,
  journey calendar, study-session tracker, live-support conversations, the
  single-session token contract, the Academy outage ledger, staff duty engine,
  prep guide, notifications — **all present again**.
- Re-ported on top: the **RFX Course Coupons** engine (golden ticket), the
  **OS integrity-flag rail** (`osFlagsServer`/`listOsFlags`/`resolveOsFlag`),
  `identityFlags`, and `clearServerStore`.
- **New: the demo-trial engine for staff** — `staffTrials()`,
  `staffTrialDaysLeft()`, `staffTrialReport()`, `decideStaffTrial()` plus
  `createStaff({ trialDays })`. A new hire on a trial (2 days / a week / a
  month) is watched by the robotic manager; when the window closes the report
  is frozen and the admin signs — **pass → staff contract email**, **don't
  pass → warm reconsideration note** and the record stays on file as a mini
  internship so a future opening can bring them back.
- `memberLogin` now mints a session token via `issueSession` (single-session
  contract) — the member panel's lock screen works again end-to-end.
- Cache-busted: all HTML version strings bumped to `v=20260811-57` so browsers
  actually load the new JS.

**Verified:** all 10 pages (register, wallet, staff, admin, reception, srm,
member, mailbox, bridge, bot) resolve **zero** missing `db.*` functions. The
member panel renders every card (trust bar, calendar, machinery, support,
wallet) with a clean console.

**Your guardrail going forward:** before you ever copy a `db.js` from one tree
to another, diff the exports. This is the second time a lineage overwrite has
bitten us. A `scripts/check-db-exports.pl`-style audit would be worth adding to
your workflow.

---

## 2. Reception hero — new greeting (done)

The long "official front door / Someone bought Reality FX…" block is gone.
The reception now opens with:

> **Reality FX Ecosystem**
> *Welcome aboard, member.*

Same clean, classy tone, no walls of text on first arrival.

---

## 3. Coupon origin on student records (done)

- **SRM list:** a redeemed coupon shows as a small gold pill under the course
  price (`R3,335.00 · RFX-TEST5`).
- **SRM profile:** a new **Coupon origin** row — code pill, benefit (5% off /
  full course covered), and redemption date. Staff can now see exactly how
  every student got in, without digging through the audit log.

---

## 4. Coupon analytics in the staff console (done)

The Coupons manager now ends with a live **Coupon analytics** card: total
coupons, active count, uses consumed, students enrolled via coupon,
full-course gifts, and the most-used codes. No more guessing whether a
campaign worked.

---

## 5. Easter-egg coupon hunt + small discounts (done)

- Coupon **percent benefit now defaults to 5%** (was 50%) in both the engine
  and the admin form — small, professional discounts. The system's own pricing
  is what it is; a coupon nudges, it never undercuts.
- Multi-use coupons can be planted around socials later; single-use stays for
  "someone truly deserves it" (the reception validates before asking for any
  details, and every unknown code raises a security event).

## 6. Price-increase / referral email — copy-ready draft (done)

New **Price notice** button in the Staff Console (next to Coupons). Opens a
copy-ready HTML letter: prices rise from **1 September**, today's price is
locked to existing students forever, and friends who join before the change
enrol at today's price while the referrer earns up to 30%. One click copies
the HTML for your email provider. **Edit the date before sending.**

## 7. Youth inclusivity (done)

- New **Youth Membership & Parental Guidance** agreement (v1.0) added to the
  registration agreements list + the register page's agreement text: every
  gender, every background, every age old enough to follow the rules and
  understand the material; under-18s review with a parent/guardian and learn
  on demo/paper accounts until the guardian confirms readiness for live
  decisions.
- The Academy prep guide gained a **"Youth members — younger traders are
  welcome"** section with the same message.

## 8. OS dashboard — name editing removed (done)

The editable "Your name (shown on your certificate)" box AND the
"Edit full profile →" link are **gone** from the OS dashboard. Student
credentials (name, email, phone, country) belong to the registration/portal
rail — the certificate name comes from the **verified identity** the handshake
delivers (`verifiedName`), never from ad-hoc edits.

---

## What I still owe you / next steps

- **Your #1 job:** make the demo-trial + coupon + support + calendar data
  models server-side (Firestore), with the same transactional guarantees the
  demo fakes in-browser — especially **coupon redemption** (two prospects must
  never burn the last use at once) and **trial expiry sweeps**.
- The OS deploy (Netlify) is still gated on account build credits — the moment
  credits exist, one command ships it (see `DEPLOY_THE_OS_NOW.md`).
- Keep the two trees in sync: `System-A-live` is the live-served copy, the
  source folder is the canonical one — sync **both** after every edit.
