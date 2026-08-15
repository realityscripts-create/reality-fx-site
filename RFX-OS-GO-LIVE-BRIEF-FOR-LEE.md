# FOR-LEE — RFX OS (System B) GO-LIVE BRIEF

> Written by the RFX OS side (System B) so the two systems can go live together.
> This is the OS's answer to the FOR-LEE update: what is **already built** on the OS
> side (the seams are ready), what **Lee must do** on his end for go-live, and the
> shared scorecard. Work it top to bottom; each item has a ✅ *done means* check.
> Everything is behind the existing seams in the OS (`os/js/os.js`, `os/js/data.js`)
> and the handoff rail (`os-handoff-server.pl` → production Cloud Function).

---

## 0. THE ONE RULE THAT OUTRANKS EVERYTHING: ALWAYS-ON 🔌

**Students must always be able to reach the Academy. Always. Full stop.**

The founder's exact words: *"our main importance is that students must always have
access to the OS, and with that being off, we are screwed — this needs to be fixed
immediately."* The demo dies whenever the local machine restarts; production must never.

This is Lee's #1 deliverable. Nothing below matters if the door is sometimes closed.

---

## 1. Status — what is ALREADY built on the OS side (so Lee never rebuilds)

The OS demo already ships these seams, verified live. Production just swaps the rail:

| Seam | Where | Notes |
|---|---|---|
| **Handoff endpoint** | `os-handoff-server.pl` → `POST /os/api/handoff` | Idempotent by `studentId` (a retry returns `{ received:true, already:true }` — never a duplicate); CORS preflight answers; `GET /os/api/handoffs` feeds the OS. **Production:** replace with the Cloud Function in §3.3 — same contract. |
| **Single-session guard** | `/os/api/session/claim|heartbeat|release` | One active session per student. A second device claiming the same studentId revokes every row of the old device; the kicked device's next heartbeat returns inactive → lock screen. **Production:** same rule server-side in Firebase (§3.2). |
| **Fair-Play flags rail** | `/os/api/flags/report|resolve` + `/os/api/flags` | The OS reports integrity flags (fast answers, suspicious perfect scores, retake abuse); the moderator's SRM reads them and moves the Trust Bar. Dedup by (studentId, type, ch, qi) — retries can never double-penalise. |
| **Academy heartbeat + recovery beacon** | OS sidebar + dashboard | Probes System A; on outage shows the composed message (*"Academy server down right now — we're aware & fixing it. Your course is unaffected."*), red pulse, auto-recovers on the next successful check. Course content is device-native — the Journey never closes. |
| **Academy discovery** | OS boot | If the OS is opened directly (no captured base), it probes the System A servers and re-points every return link (My RFX Account + Reception). Kills the `{"error":"not found"}` handshake bug. |
| **`printTrust` read** | OS identity load | The OS reads `printTrust` from the handoff record. Enforcement (§2 of this brief) is the remaining work. |
| **ID pill + verified identity** | OS dashboard/profile | `ID RFX-XXXXX (Verified!)` chip; profile resolves identity by email when the OS is opened directly. |
| **Difficulty lanes** | OS Journey | Standard / Challenging / Elite tiers, per-chapter decks, lane peek on the tier cards, tier-tagged badges. |

**The handoff payload contract (canonical — do not change):**
```json
{
  "idempotencyKey": "RFX-10482",
  "studentId": "RFX-10482",
  "studentCode": "VGNNAC",
  "verifiedName": "Pedro Zulu",
  "email": "pedro.zulu@example.com",
  "enrollmentId": "ENR-0001",
  "invoice": "INV-2026-0001",
  "course": "Reality Academy — Professional Program",
  "entitlements": { "course": "Reality Academy — Professional Program" },
  "printTrust": "standard",
  "status": "ready",
  "source": "reality-fx-registrar",
  "sentAt": "2026-08-09T…",
  "founder": false
}
```
`founder` is an **optional boolean that defaults to `false`** — an absent/`false` field must
never break a normal handoff. The OS now also expects (and stores, when present):
`demoPass { hours, createdAt }`, `approvalAt` → `demoTourEndsAt` (ISO), and
`trust { score, tier }` on every handoff/sync.

---

## 2. LEE'S LIST — what he must do on his end for go-live

Work in this order. **§2.1 is the critical path — start there.**

### 2.1 Always-on hosting — the non-negotiable (see §0) ✅ REQUIRED NOW

The OS is a **static app** — Firebase Hosting, Vercel, Netlify, or Render all host it
trivially. Requirements:

- [ ] Deploy the OS to an **always-on host** (never a machine that can be switched off,
      never a laptop, never a free-tier cold-start-only host if it can sleep).
- [ ] **HTTPS forced** + HSTS on the OS origin.
- [ ] Serve a **health/probe endpoint** (root or `/api/health`) that answers 200 fast.
      System A probes it (3.5s timeout) before opening the Academy. If the OS is ever
      genuinely down for maintenance, serve a **503 with a branded maintenance page**
      instead of refusing the connection — so System A shows the calm message and
      students never see a browser error.
- [ ] Set the real OS URL in System A's bridge settings (Staff Console → Handoff →
      Bridge settings; the demo uses the captured base — production is one constant).
- [ ] Uptime monitoring (UptimeRobot free tier or equivalent) pinging the OS URL; an
      alert email the moment it goes down. "We never have technical difficulties" is
      a promise — monitoring is what makes it true.
- [ ] Test the exact founder flow on a phone on mobile data: member panel → "Enter the
      Academy" → OS loads → handshake confirmed → course unlocked.

✅ *done when: the OS URL answers 200 from anywhere in the world, 24/7, and System A's
probe goes green.*

### 2.2 Firebase Auth — password login (the OS's real auth) 🔑

The OS demo signs in via email + Student Code held in the browser. Production rule:
**Reality FX never sees or sends a plain-text password. Ever.**

- [ ] On handoff (System A side), a **server-side Cloud Function** creates the Auth user
      with a **random temporary password**, then sends a **set-your-password link**
      (`sendPasswordResetEmail`-style flow). The student sets their own password on
      first OS login.
- [ ] OS sign-in = standard Firebase Auth; sessions via `onAuthStateChanged`.
- [ ] **One session per student, server-side:** a second login revokes the first —
      same-device second browser included. The kicked device's next request gets
      401/`session_invalid` and shows the same gold lock screen the demo shows.
      Log `SESSION_REVOKED` (which device, which identity, same-device flag).
- [ ] Keep the **15-minute inactivity** rule server-side.
- [ ] Keep System A's **lockout messaging** on the OS UI (Firebase throttles the real auth).
- [ ] Map the Auth `uid` → the student's `studentId` (the OS shows the Student ID from
      the `uid` lookup — never trust the client to say who it is).

✅ *done when: a student who received their set-password link completes sign-up, logs
in, sees their Student ID, and a second device login locks the first within seconds.*

### 2.3 The handoff endpoint in production (the OS's Cloud Function) 🤝

Mirror the demo contract exactly (§1). The function must:

1. **API-key gate first.** Refuse any request missing the matching `X-RFX-Handoff-Key`
   header. Knowing the endpoint URL must never be enough to mint an identity.
2. **Idempotency second.** If the student exists by `studentId` → return
   `{ received: true, already: true }` — no create, no duplicate, no error.
3. **Validate the payload:** missing `studentId`, unknown `entitlements`,
   `printTrust` outside `standard|trusted` → reject with a reason.
4. **CORS:** allow the `X-RFX-Handoff-Key` request header in preflight
   (`Access-Control-Allow-Headers: Content-Type, X-RFX-Handoff-Key`). Without it the
   browser blocks the POST before it reaches the function — this was caught live once;
   do not repeat it.
5. **Entitlements are a LIST per identity, not a single course field.** When System A
   hands over a second course (same Student ID, new course — §9.19 of the FOR-LEE
   update), **merge** the new entitlement into the existing record. Reconcile, never
   duplicate, never treat it as a new person.
6. **Store the full handoff record** the OS reads back: identity, `printTrust`,
   `founder`, `demoPass`/`demoTourEndsAt`, `trust { score, tier }`.
7. **Log every handoff call** (success, reject, duplicate) to the security event store.

✅ *done when: a raw curl without the key is refused, a forged payload is rejected with
a reason, calling the function twice with the same `studentId` leaves exactly one
student document, and a second-course handoff merges entitlements.*

### 2.4 Firestore mirror + rules (the OS's data layer) 📦

Mirror System A's state (see FOR-LEE update §2/§4 — same schema, same rules):

- [ ] `students/{studentId}` — the identity System A hands over (fields above, incl.
      `entitlements[]`, `printTrust`, `founder`, `demoTourEndsAt`, `trust`).
- [ ] Wallets/payouts/awards/securityEvents/settings — as §2 of the FOR-LEE update.
- [ ] **Rules:** a student reads ONLY their own doc (`auth.uid == studentId`); NO
      client writes to `students/*` or `wallets/*` — money and identity only move
      through server functions with the API-key gate.
- [ ] `settings/global` mirrors System A's `getSettings()` so both sides agree on
      limits (`financeEmail`, `revealStudentCountsAt = 1000`, `FOUNDERS_DAY`).

✅ *done when: a raw Firestore client attempt to write a wallet balance fails, and a
student can read exactly one document: their own.*

### 2.5 The OS contract items the brief assigns to the OS side

These are OS-side behaviours called out in the FOR-LEE update. Build them with the
same design language (gold `#D4AF37`, dark `#080808`, Playfair/Inter, gold rings):

- [ ] **§9.6 Screen-capture deterrence** — every protected OS page watermarked with the
      student's ID (faint rotated tiled overlay); text selection + copy blocked on
      course content; `@media print` blacks out course pages; capture attempts logged
      as a suspicious signal. Deter + trace — never pretend to prevent.
- [ ] **§9.6b Trusted printing** — `printTrust: 'standard'` = watermarked everywhere,
      selection blocked, print blacked out. `'trusted'` = a print button for that
      student's own material, still watermarked with their Student ID. Revocations
      propagate on the next sync.
- [ ] **§9.19 DEMO / LIVE pills** — small pill on the OS dashboard mirroring System A's
      tier; access keyed on the underlying `approved`/`studentId` booleans, never a
      label string.
- [ ] **§9.23 Trust Bar** — render the gold percentage RING from the synced
      `trust { score, tier }` (same ring spec as the course ring). The OS enforces,
      System A records: `trust.score = 0` (restricted) → course access dies server-side
      on next sync; timeout tiers (≤25 / ≤10) pause access with the stated durations.
      Report OS-detected violations to System A via `POST /api/trust-event`
      `{ studentId, severity, reason, reference }` — idempotent by `reference`.
- [ ] **§9.25 "The Machinery"** — an engine-room card on the OS dashboard with the
      OS's real measured numbers (integrity monitors live, quiz-timing checks,
      session/device watchers, watermark coverage) in the same gold-ring design.
      Honest, never staged. **Capacity headroom, never raw student counts.**
- [ ] **§9.26 Founder's Day + Hall of Fame** — annual Founder's Day on **1 November**
      (read from the shared constant), rotating founder quote on the dashboard that
      day, a dignified gold plaque honouring *"the founder"* — **no name, no photos
      while he lives** (his explicit wish; the name is added only after his passing).
- [ ] **§9.29b The ghost-town rule** — no student-facing surface ever reveals how many
      students/identities the Academy has **until 1,000 ACTIVE** (`revealStudentCountsAt`).
      Show capacity headroom + the privacy line instead. Staff consoles always see real
      numbers.
- [ ] **§9.38 Demo-tour expiry** — store `demoTourEndsAt` (approval + hours) from the
      handoff; at the exact second, flip the demo account from tour-active to
      tour-ended (same authorization path as paid — a shorter entitlement window).
      Account + progress stay permanent; premium access reverts; a paid handoff
      upgrades seamlessly. **The founder is exempt** (`founder: true` → lifetime).
- [ ] **§9.39 Founder Master Key** — read `founder` from the handoff and store it as an
      auth claim on the OS account (never a hard-coded email check). The founder's OS
      dashboard opens every door (full content overview) while STILL applying the
      machine's safety rules (one session, revocation, audits).
- [ ] **§9.41 Operating guide** — an "How Reality FX operates" link/card in the OS
      opening the same branded guide.
- [ ] **§9.43 Power-on moment** — when the Academy comes back after an outage, the OS
      welcome should *feel* like the lights came on (flicker → steady glow), and serve
      the same "Academy back online" notice System A sends.
- [ ] **§9.24 Load-test mirror** — the OS's own harness against Firestore (seed N
      students, run auth/authorization/integrity/quiz-timing under load, printed
      PASS/FAIL, zero residue). When the founder asks "can it hold 2,000?", the answer
      is a run, not an opinion.

✅ *done when: every box above is checked and verified against the real deployed OS.*

### 2.6 DNS + email identity (go-live networking) 🌐

From FOR-LEE update §11 + §9.33 — the shared list applies to the OS origin too:

- [ ] Real domain, registrar separated from hosting, auto-renew + transfer lock + 2FA +
      WHOIS privacy.
- [ ] Decide the OS URL NOW (`os.realityfx…` / `academy.realityfx…`) — before anything
      links to it. A wildcard or explicit subdomain record for it.
- [ ] Email identity: custom-domain sender (`no-reply@realityfx.academy`), branded
      display name "Reality FX Academy", SPF + DKIM + DMARC passing, test on Gmail +
      Outlook. Resend or Brevo free tier covers our scale forever.
- [ ] HTTPS everywhere; `file://` and `http://127.0.0.1` demo URLs gone from
      production builds (System A reads the OS endpoint from settings — set it to the
      HTTPS URL).
- [ ] Security headers on the OS host: X-Content-Type-Options, X-Frame-Options,
      Referrer-Policy, CSP where practical.
- [ ] Backups: nightly export of the OS database + Firebase export.
- [ ] Monitoring: uptime ping on the OS URL + alert email (see §2.1).

✅ *done when: the OS is reachable at its real HTTPS URL from a phone on mobile data,
mail from the Academy domain lands in Gmail/Outlook with DKIM PASS, and an outage
pings the founder within minutes.*

---

## 3. The shared go-live checklist (both systems together)

From FOR-LEE update §10 — the scorecard the founder will run. The OS-relevant rows:

- [ ] A student who paid → registered → approved → handed off can log into RFX OS and
      see exactly their course's content — nothing else.
- [ ] A student who only paid (never approved) cannot log into the OS.
- [ ] One active session per student on both sides; a second-device sign-in revokes
      the first with a SESSION_REVOKED event.
- [ ] The reconciliation sweep fires: an approved student with a live bridge reaches
      ACTIVE even when no Staff Console tab was open (server-side schedule on Lee's
      side; sweep + Sync-all on demo).
- [ ] OS pages are watermarked with the student ID, text copy is blocked, print is
      blacked out by default, capture attempts surface in the security feed, and only
      `printTrust: 'trusted'` students can print (revocations take effect on next sync).
- [ ] An OS achievement event (80%+ average) creates exactly one merch order; a retry
      creates zero duplicates; below-threshold is refused.
- [ ] A refund is risk-scored before payout; an executed refund revokes the Auth user +
      OS entitlement; a cooldown identity cannot re-enroll within 30 days.
- [ ] A demo student whose 24h elapses mid-session is cut off by the OS at the exact
      second, sees the tour-ended message, and becomes a full student with zero
      friction after enrolling. The founder's master key never expires.
- [ ] No visitor can learn the student count on either system below 1,000; the OS
      shows headroom + the privacy line.
- [ ] The OS dashboard carries "The Machinery" in the same gold-ring design, with real
      measured numbers.
- [ ] The OS hosts the Hall of Fame + Founder's Day on 1 November (shared constant),
      rotating founder quote, no name/photos.
- [ ] The Academy entry button on System A probes the OS before opening; if the OS is
      offline the student sees the calm "warming up" state instead of a dead page.
- [ ] The load test runs clean at 2,000+ students on System A; the OS's Firestore
      harness proves it holds the same number.
- [ ] The OS links its account menu to System A's `member.html?email=…`; the email is
      prefilled; the Student Code is never in a URL; travel both ways is smooth.

---

## 4. What the OS side is doing (this lane, in parallel)

While Lee works §2, the OS side is making the demo production-shaped so the swap is
seamless:

- [x] Recovery beacon + composed outage (already live)
- [x] Academy discovery (already live)
- [ ] Student-ID watermark + copy-block + print blackout (in progress)
- [ ] printTrust enforcement (in progress)
- [ ] Ghost-town rule — no student counts below 1,000 (in progress)
- [ ] Founder Master Key from the handoff (in progress)
- [ ] Demo-tour expiry plumbing (in progress)
- [ ] Trust Bar ring + Machinery card + Founder's Day + power-on moment (queued)

**The handshake between the two lanes:** Lee's §2.1–2.4 are the rails; this lane is
the carriage. When both are done, the founder runs the checklist in §3 and Reality FX
goes live — with an Academy that never sleeps.

---

*RFX OS — System B. Built for Reality FX, The Trading Academy. Seams in `os/js/os.js`
and the handoff rail; the function signatures ARE the contract.*
