# FOR-LEE — PII SCANNER + HARDENED MINORS ENROLLMENT — 12 AUG 2026

System B's answer to today's safeguarding commission. Built, verified live, audit ALL GREEN.

---

## 1. The room-chat guard is now a full PII scanner

Every chat surface (Study Hall, Break Room, Live Rooms, **and the AI Mentor**) runs the same
categorized scanner, on all three layers — the browser, the local server, and the Netlify function —
so a bypassed client still can't post sensitive data.

**Hard-blocked (refused outright, staff will NEVER ask for these in a chat):**
- Card numbers (13–19 digits) · SSNs (###-##-####) · national IDs
- Bank account numbers, IBANs, routing/sort codes
- Passport numbers, driving licence numbers
- Crypto wallet addresses (BTC + ETH)
- Passwords / PINs · live login / 2FA / OTP codes

**Warned before sending (still blocked behind a "Send anyway"):**
- Phone numbers · email addresses · street addresses
- Date of birth · age self-reports · IP addresses · GPS coordinates · postal/ZIP codes

The AI Mentor now refuses hard-blocked content ("🚫 Not sending that…") and gently flags
contact details before answering. Verified end-to-end: block bars, warn bars, and a direct
server call returning 403 with a clear reason for card/SSN and password/OTP messages.

## 2. Hardened enrollment for minors — the age gate + guardian flow

**"Are you 18 or older?"** is now the first question of every enrollment (after the welcome
screen) — with a visible **🛡️ Student safety is built into this enrollment** card on the
welcome screen itself, before any data is entered. Not an attendance gate: the copy makes
clear Reality FX welcomes every age; it routes minors through parent authorization.

**Under-18 path** inserts a dedicated **Guardian step** (Step 4 of 7):
- Parent/guardian full name, relationship (Parent / Legal guardian / Other), guardian email
- A consent box the parent confirms: "I am the parent or legal guardian of [student name]…"
- The parent is emailed a 6-digit code and confirms from THEIR inbox — a checkbox a minor
  ticks is no longer enough. Brute-force guarded (5 attempts → lockout, resend resets).
- Secured end-to-end: `AGE_GATE`, `GUARDIAN_CONSENT`, `GUARDIAN_VERIFIED` events all
  recorded on the audit rail; the review screen shows "Guardian: [name] (Parent) · email ·
  AUTHORIZED ✓"; submission is REFUSED (store-level guard, not just UI) for any under-18
  registration without verified guardian consent.

**Two bypass gaps closed:**
- A minor who claims "18+" on the gate but enters a real minor DOB still gets the guardian
  step (DOB is double-checked at every gate, not just the age question).
- The old "guardian consent" checkbox that lived inside the Identity step is gone — it could
  be ticked by the minor themselves with no proof.

## 3. Two bugs caught and fixed while testing (worth knowing about)

1. **The age quick-pick chips were dead** — `RFX.pickAgeRange` was never exposed, so the
   "16–17 / 18–24 / …" buttons threw and did nothing. Now wired to fill the DOB.
2. **Step 1 was broken for every student** — register.js read a `#p-name` field that no
   longer exists (the form now uses separate First name / Surname inputs), so the personal
   step crashed on Continue and nothing saved. Fixed to read the real fields.

## 4. Audit status

`audit-regression.pl` — **ALL GREEN**, 10 sections. New checks added: full PII scanner
(SSN/IBAN/bank/OTP + RFXpii exposure), age gate, guardian step, pre-enrollment safeguarding
card, guardian machinery in db.js. Security layer section now reads
"PII scanner + masking + RBAC + access log + age gate + guardian + privacy".

## 5. What this means for you

- **Registration links** now route minors through the guardian step automatically — no
  staff action needed; the parent's authorization rides the email rail exactly like the
  student's verification code.
- **Staff console** already surfaces guardian records via the enrollment registration data
  (name, relation, email, verifiedAt) — approve as usual; the checklist includes a
  `guardianVerified` row for minors.
- **No deployment needed for the local demo** — files are stamped (OS v=34, System A
  v=20260812-68) and both System A trees are identical. The Netlify function's PII rules
  will deploy with the next build.
- Still open (from before): production email domain for real student delivery, and Netlify
  build credits.

— Zorro (System B), 12 August 2026

---

## 6. ADDENDUM — 12 AUG 2026, 15:30 local (same-day second delivery)

**Trading Challenge — full trade loop verified + the wall is seeded.** The sim was driven
end-to-end live: enter a challenge → place a stop/target order (the 1%-risk gate checks it
first) → close → end challenge → the machine grades (score, drawdown, consistency,
discipline) → result posts to the server-signed leaderboard. The wall now carries **18
realistic machine-scored entries** across all four boards (RFX FTMO, Risk Management,
Consistency, Prop-Style) — PASS entries are deliberately rare (1 per board, top of the
wall); the rest are REVIEW, so the elite tier stays earned. Seed script:
`.freebuff/tools/seed-challenges.pl`. Re-runnable any time.

**PII incident board — every blocked chat attempt, logged and visible.** Both the server
(bypassed clients) and the client (catches before send) now write to one incident store
(`pii-incidents` rail): who, role, room, reason, sample, time. The Staff Console has a new
**"PII incidents — blocked chat attempts"** board with Refresh + Clear, and it falls back
from the production bridge to the local OS rail so the demo board works on this machine.
Netlify function mirrors the rail for production. Verified live: a card+SSN message and a
bank-account message both 403'd and both appeared on the board.

**Guardian emails — the parent is in the loop end-to-end.** The moment a guardian verifies
their code, a branded **"Reality FX — your authorization is confirmed"** email lands in
their inbox (what they authorised, what happens next, how to reach us). And when an
under-18 member is approved, the parent is **copied on the Academy preparation guide**
(addressed to the guardian, alongside the student's own copy). Both verified in the
mailbox: `guardian-confirm` and `guardian-prep` send correctly.

**Resend domain — the one step left, fully written up.** `RESEND-DOMAIN-GO-LIVE-STEP-BY-STEP.md`
is on the Desktop: free eu.org path (or ~$3–5/yr real domain), the exact SPF/DKIM/DMARC
records, and flipping `RFX_MAIL_FROM` in Netlify env vars — no code changes needed. The
rail already reads env at runtime.

**Audit: ALL GREEN**, 10 sections — new checks for the guardian emails, the PII incident
rails (server + Netlify + admin board + client report). Stamps: OS v=35, System A
v=20260812-71, both trees identical.

— Zorro (System B), 12 August 2026
