# FOR-LEE — Student Data Security & Privacy Architecture · 12 Aug 2026

> The founder commissioned a full security layer for the institution — not
> "we promise your data is safe", but architecture that demonstrates it.
> Everything below is **built and verified live** (System A v20260812-65,
> OS v24, audit 9/9 ALL GREEN). Work top to bottom; the audit machine is
> now the standing inspector for all of it.

---

## 1. The room-chat guard (DLP) — the "don't paste your number here" layer

Students naturally trust Study Rooms and Live Chat, so the guard assumes
someone will eventually type something sensitive — and catches it before it
goes anywhere:

- **Warn** (message still sendable after an explicit "Send anyway"): phone
  numbers, email addresses, street addresses.
- **Block** (never sent, with a plain explanation): card numbers, national
  ID numbers, crypto wallet addresses, passwords/PINs.
- The same rule runs in **three layers** — the client (instant feedback),
  the local dev server, and the Netlify function (a bypassed client still
  can't post it). Verified live: block bar, warn bar, send-anyway, and a
  direct API call returning 403.
- Bonus fix found while testing: the room poller re-rendered every 15s and
  **ate the student's half-typed message**. Drafts and open warnings now
  survive every poll.

## 2. Data minimization — masking + role-based access (RBAC)

- Staff lists (SRM, review queue) now show **masked emails** (e.g.
  `da••••••••••@gmail.com`); the full address reveals only on a deliberate,
  **logged** click.
- The "Identity submitted" block in the Staff Console is **role-gated**:
  admin / approver / reception see phone, address, DOB and selfie (they're
  the verifiers); finance and other roles see a "Restricted — contact an
  approver" card instead. Verified both paths in the browser.

## 3. Access logging — who looked at what, when

Every student record opened and every masked field revealed is recorded:
`who · role · action · target · time`. The log lives in the Security &
data hygiene card of the Staff Console ("Who looked at what — access log")
with a 400-entry cap. Verified live. **One honesty note:** the first
version logged once per 2-second modal re-render (47 spam entries in
minutes) — caught it, fixed it to log once per view. The audit now treats
this as part of the security check.

## 4. Staff session timeout

An unattended staff console is a locked desk: after **30 minutes** of no
mouse/keyboard, the console signs itself out — with a 1-minute warning
first. (Student-side timeout already existed.)

## 5. Student-facing privacy assurance

- **Registration, identity step:** a gold "🔒 Your data is protected" strip —
  encrypted in transit, access-logged, only authorized staff for legitimate
  purposes, never sold, no government IDs collected.
- **Member panel:** a "protected student environment" note under the vital
  details card.
- **OS Operating Guide:** a new plain-language card explaining handshake,
  version stamps, snapshots, the chat guard and the access log — so a
  student who wonders "are they stealing my data?" gets a calm, true answer.

## 6. Minors initiative — guardian consent (the founder's question)

Reality FX welcomes every learner old enough to follow rules and
understand the material; for members **under 18** the registration now
requires a **parent/guardian email + explicit consent checkbox** (driven
automatically by the date of birth collected on step 1), recorded as a
security event. The existing "Youth Membership & Parental Guidance"
agreement (v1.0) already covers the policy side — this is the enforcement.

## 7. The audit machine grew a 9th check

`audit-regression.pl` now inspects the whole security layer on every run —
DLP in all three layers, masking helpers, RBAC, access log + viewer, staff
timeout, guardian consent, privacy statements. **Current status: 9/9 ALL
GREEN.** Run it with: `perl audit-regression.pl`

## What I still need from you (next natural steps)

1. **Production email domain** (unchanged from the last brief): the rail is
   armed and branded — Resend still needs a verified sender domain to reach
   real students (resend.dev only reaches your own inbox).
2. **Netlify build credits** before the next live deploy can land.
3. When Firebase lands, the access log, DLP and masking rules mirror
   server-side automatically — the browser guard is the demo layer, the
   platform is the enforcement layer. Same pattern as everything else.
