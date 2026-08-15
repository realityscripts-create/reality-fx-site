# 📕 REALITY FX MASTER GUIDE
## The Complete Reality FX Ecosystem & OS Handbook

> *Every lesson is a trade. Every trade is a lesson.*
>
> The school textbook of Reality FX — the full organism, from the front door to the deepest layer of the OS. Built for the founder, developers, administrators, mentors and internal team. If someone asks *"walk me through Reality FX from the moment I discover the website to the moment I become a fully developed trader"*, this is the book.

**Version:** 1.1 · **Date:** 13 August 2026 · **System state:** all three tiers forged (13/13 chapters × Standard + Challenging + Elite), OS feature-complete per the roadmap, audit ALL GREEN (13 sections)

---

## PART I — THE REALITY FX ORGANIZATION

### What Reality FX is

Reality FX is a digital trading education ecosystem — not a website, not a course, not a simulator, but a connected institution that moves a person from **complete stranger** to **verified student** to **trained trader** to **proven performer**, with the systems, records, security and machinery of a real school behind them.

It is built as two interlocking systems:

- **System A — the Registrar & Security Hub.** The front door of Reality FX. Handles the public website experience, enrollment/registration, identity verification, student records, staff consoles, wallets, invoices, mail, and the security layer that guards everything (device trust, session guard, access control, PII protection). *System A makes sure a student is real and verified.*
- **System B — the OS (Online Campus).** The Reality FX Trading Academy OS. Where the verified student actually learns: the 13-chapter, three-tier course, assessments with exam protocol, the Laboratory, the Trading Challenge arena, the AI Mentor, Live Rooms, the Trade Journal, the Break Room, the Hall of Fame, and the machine that audits the whole building. *System B consumes System A's verification and does the teaching.*

They are dependent on each other: System A verifies identity so the OS knows who is learning; the OS turns that verified identity into education. A weakness in either is a weakness in the whole institution — which is why the quality-control standard is applied to both.

### The philosophy

- **We don't sell courses. We build traders.** The product is not a set of videos; it is a managed journey with real assessment, real practice, real risk control and real recognition.
- **Education with institutional weight.** Chapters are "lessons", exams are "assessments", rules are "protocol", records are kept, conduct is monitored, and achievement is recognised publicly. Students feel they are in a school, because they are.
- **Safety before everything.** Student data, minors' safeguarding, chat privacy, device trust, fair play — the architecture is designed so that "safe" is the default, not a promise.
- **Honesty as a feature.** When the server is down, the system says so plainly. When material is being forged, the scope card says exactly how many chapters are done. The machine reports its own health. Quality control means telling the truth, even about ourselves.
- **The market is the mirror.** Practical, scenario-driven, psychology-aware material — students are trained to think like professionals under pressure, because the market never stops for them.

### The mission

To build the best unknown trading school in the world — an institution where a young person with savings and ambition can learn the language of the markets, practise with zero danger, prove their ability against a machine's honest scoring, and leave with a real skill, a real record and a real opportunity. The measurable goal: 10,000 students who can point at this system and say *it works*.

---

## PART II — THE PUBLIC-FACING REALITY FX EXPERIENCE

### The Website (the first room everyone enters)

**Files:** `index.html`, `programs.html`, `our-services.html`, `why-choose-us.html`, `industries.html`, `careers.html`, `evaluation.html`, `contact.html` (System B's public tree)

**Purpose:** introduce Reality FX, convert a visitor into a prospective student, and hand them to the front door of the institution.

**What a visitor experiences:**

1. **Home** — who we are, the crown brand, the academy promise, the "Reality FX Ecosystem" statement.
2. **Programs & pricing** — the course plans (entry, singular lessons, full 13-chapter curriculum) with PayPal/Stripe enrolment. Individual lessons route through the contact form/email.
3. **Why choose us / Our services / Industries** — the differentiators: verified identity, live mentorship, the OS campus, the machine-judged challenges.
4. **Careers** — the institution's people; the demo-trial pathway for prospective staff.
5. **Evaluation / Contact** — conversion forms.

**How it connects to the systems underneath:**

- The site is the *public marketing skin*; the institution itself lives in System A's registration panel and System B's OS.
- A visitor who decides to enrol is sent to the **Registration** flow. In the future, **RFX Course Coupons** (the golden ticket) deep-link the site straight to registration — `?coupon=CODE` pre-fills the coupon at the front door, so a marketing code becomes a registration session with the coupon tagged to the record.
- Pricing is displayed here; the *actual* payment + invoice + wallet machinery lives in System A.

### Registration & the Reception (System A's front door)

**Files:** System A: `register.html`, `reception.js`, `register.js`, `db.js`, `bridge.js`

**Purpose:** turn an applicant into a *verified* student, safely.

**The flow:**

1. **Age gate / safeguarding.** The enrollment process opens by asking the age cohort. **18+** proceeds as a standard applicant. **Under 18** enters the **guardian authorization flow**: a parent/legal guardian must confirm they are aware of the enrollment and give consent before the student is enrolled — especially where payment, personal data or communication is involved. The system is built to say, plainly: *"we know you're trusting us with your child, and we take that responsibility seriously."*
2. **Identity submission.** Name, email, phone, address, photo (selfie). Government ID is **not** collected — we don't need it and we don't want it; the selfie + contact verification is the identity anchor.
3. **Email verification.** A registration code is emailed (the live mail rail); the code unlocks the application. A resend rotates the token, keeps the lifetime, and re-sends — the student never loses the path.
4. **Payment / coupon.** The course is purchased (PayPal/Stripe) *or* covered by an RFX Course Coupon (the golden ticket — once-and-done, never renewable). A coupon-granted enrollment shows "Covered by coupon CODE", not R0.00.
5. **Verification & approval.** A staff member (or the demo's automated path) reviews the application. Approved students are **verified** — this is what makes them real.
6. **The handshake.** System A's bridge POSTs the approved identity to the OS's handoff rail (`/os/api/handoff`). The OS now greets the verified student by name and Student ID. The two systems have introduced each other — securely, never guessing.

**Why this approach instead of a simpler one?** Because an online trading academy that cannot prove who its students are cannot protect them, cannot certify them, and cannot stop abuse. Verification is the foundation of every certificate we will ever issue.

### The Member Panel (My RFX Account)

**Files:** System A: `member.html`, `member.js`

**Purpose:** the student's account home — identity, wallet, invoice, and access.

- Verified identity details (name, Student ID, the "Reality FX identity has been established" state).
- Wallet (RFX credits, challenge rewards, top-ups).
- Invoices and purchase history.
- The "forgot your student code" path — because humans forget. A student who loses their code is sent a link to their live email address; no new code needs to be invented, the *same* code is returned to them via their registered inbox. One function, several problems solved.
- Access to the RFX OS (the return trip link on the OS sidebar).

---

## PART III — THE STUDENT JOURNEY

```
Visitor → Applicant → Registered Student → Learner → Trader → Challenge Participant → Proven Performer → Success Story
```

| Stage | System | What happens |
|---|---|---|
| **Visitor** | Public website | Discovers Reality FX; sees programs, pricing, the brand, the coupon opportunities. |
| **Applicant** | Reception (System A) | Age gate, identity submission, email code, payment/coupon, guardian consent if under 18. |
| **Registered Student** | System A + handshake | Application approved → verified → handoff mints identity in the OS → greeted by name + Student ID. |
| **Learner** | OS (System B) | Picks a tier, works the 13-chapter Journey, takes assessments with exam protocol, earns XP/badges, keeps a Trust Bar, builds a Trade Journal. |
| **Trader** | OS Laboratory + sim | Practises risk control in the Laboratory, trades the simulated market in the Trading Challenge arena. |
| **Challenge Participant** | OS sim + leaderboard rail | Enters RFX FTMO / Risk / Consistency / Prop challenges; machine grades ability, not just profit. |
| **Proven Performer** | OS + Hall of Fame | Passes challenges, appears on the Hall of Fame wall, earns rewards and RFX credit paid to the wallet. |
| **Success Story** | The institution | A certified, practised, risk-aware trader — the strongest evidence the environment works. |

---

## PART IV — THE REALITY FX TRADING ACADEMY OS

### What the OS is

The OS is a **digital campus** — not a website. Every room is a purpose-built environment. The student enters through the **Dashboard**, and the left rail is their map of the campus.

### The identity layer (side rail)

- **ID chip:** `RFX-10482 (Verified!)` — the student's identity card, carried across every page, so they always remember their code.
- **Rank & XP:** Novice → … rank ladder driven by XP earned from slides, correct answers, chapter passes, distinctions and study time.
- **Academy links:** Reception and My RFX Account (System A doors) live on the rail, with a live/stale/unreachable health indicator.

### The rooms (route by route)

**Dashboard (`#/`)** — the student's home. Greeting by verified name, the LIVE SESSION timer (real active seconds; pauses when the tab hides — study time can't be gamed), the course-completion ring, accuracy ring, the Trader Identity card (student code + verified), Trust Bar ring, duration breakdown, Live tool strip (Laboratory, AI Mentor, Trade Journal), recommended-practice shelf, certification teaser, Academy FAQ & Fair Usage policy. *No profile editing here* — credentials belong to the registration rail, not ad-hoc edits.

**Journey (`#/map`)** — the course map: 13 chapters, three tiers, per-chapter focus, slide counts, assessment counts, estimated duration, difficulty chips, badges, and the golden one-shot unlock animation when a chapter opens.

**Performance (`#/progress`)** — Trading Analytics: grades, accuracy, average response time, pace, XP history, per-chapter breakdowns, retake states.

**Your Path (`#/path`)** — the trader identity journey: the founder's teaching voice, psychology-first material, "Your Path" cards that tailor by trading style (scalper/day/swing/position).

**Fair Play (`#/mod`)** — the Academy's electrical fence: assessment timings, tab-switch watching, response-pattern analysis (the kind used by competitive platforms), Trust Bar thresholds, incident states.

**Certificate (`#/certificate`)** — prints only for students who earned it: verified name, Student ID, gold. Draws from the SRM's record — no re-entry needed.

**Hall of Fame (`#/hof`)** — the honours room: highest performers by year (Standard / Challenging / Elite), premium hover reveals (what the student gained), seeded with realistic 2024–2025–2026 walls. Places are earned, never sold.

**Academy Vault (`#/vault`)** — hidden gems and founder-level material; the key is performance, not payment.

**Trade Journal (`#/journal`)** — the trader's mirror: a ticket form that computes pips, P/L and the R multiple as you type; a six-card stats rail (trades, win rate, net P/L, profit factor, total pips, avg R); filterable entries (All/Wins/Losses/Breakeven). **Local-only by design** — the journal lives on the device and never leaves it. Zero server rails, zero PII.

**Laboratory (`#/lab`)** — theory comes alive: the 3-Loss Circuit Breaker, the drawdown simulator, and other risk experiments. Play with the inputs; the numbers are the lesson.

**Trading Challenge (`#/sim`)** — the arena (see Part V).

**AI Mentor (`#/mentor`)** — a trading twin built from the founder's own head: aggressive opinions, dry humour, logic that meets you where you are. It answers like a mentor, not a search bar, and never leaves the semester early.

**Live Rooms (`#/live`)** — the broadcasting wing (see Part V). Mentor lessons, staff meetings, 1-on-1 support, interviews. The room list shows join codes, broadcast windows, room chat with the PII guard.

**Live Studio (`#/studio`, staff only)** — the founder/staff broadcast room: cam/mic toggles through real `getUserMedia` hardware, white-background mode, video-quality controls, lecturer mode, waiting rooms with countdowns for interviews.

**Break Room (`#/break`)** — a real break, not a tab-switch: a nudge after heavy assessments, a quiet space to let a long session settle, chat-safe (the PII guard refuses phone numbers, addresses and passwords).

**Study Hall** — the always-open room where students gather and keep each other pushing; same rules as every room: one identity, honest chat, PII guard.

**The Story (`#/story`)** — how the OS was actually built: the sleepless nights, the code that broke, the ideas that were brilliant at midnight and wrong by morning. The honest version of what the student is standing in.

**Operating Guide (`#/guide`)** — the campus handbook: every room, what it's for, how to use it, the rules, the safety architecture. If a student wonders *"what does this do?"*, the guide already has the answer.

**Machine Audit (`#/audit`, founder only)** — the building inspecting itself: the same regression audit that gates every deploy, rendered live. Students never see this door. 13 sections, ALL GREEN when healthy.

### The course & assessment engine

- **13 chapters**, each with **three tiers**: Standard (complete, trade-ready), Challenging (applied questions, insider notes, deeper thinking — everything in Standard plus the drill field), Elite (a different course: advanced concepts, real trading math, the institutional layer — the most information of all).
- **Tier decks are composed, not replaced.** A Challenging student reads the full Standard material *plus* the Challenging depth; an Elite student reads everything. The scope card counts honestly: Standard ≈ 774 slides, Challenging ≈ 847, Elite ≈ 1065.
- **Assessments with explain-everything.** Every question carries a gold explanation; Challenging/Elite questions have "the deeper layer". Elite lane uses five-option questions as the standard.
- **Exam protocol.** Challenging and Elite assessments run a real-time exam clock (15 min / 20 min) — institutions don't let a student stare at one question for five minutes, and neither do we. Standard is untimed.
- **Completion-time tracking.** The machine times the whole attempt from first open to finish; a pass (or fail) resets so every attempt is timed fairly.
- **Progression:** chapters unlock in order; a failed assessment opens the 2-hour reflection period + retake tokens (3 per chapter, one regenerates weekly). Revision mode gives read-only access to re-read everything.
- **Slides:** rich native content (lead, body, bullets, examples, callouts, gold insights, per-style notes), pause slides, poll slides, close slides.

---

## PART V — THE TRADING ENVIRONMENT

### Trading Challenge (the arena) — `sim.js`

**Purpose:** let students *apply* what they learned in a controlled, machine-judged environment — learn → practise → replay → **trade** → measure → improve.

**The challenges:**

| Challenge | Focus |
|---|---|
| **RFX FTMO Challenge** (flagship) | The old FTMO spirit, institution-grade: controlled demo account, target return, machine-scored. |
| **Risk Management Challenge** | Who loses least, stays longest — risk control is the whole game. |
| **Consistency Challenge** | The machine grades your rhythm: steady R-multiples beat one lucky spike. |
| **Prop-Style Challenge** | The two-step institution test: rules, drawdown red line, discipline gates. |

**The trading environment:**

- **Live market feed** with moving prices; pairs include EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/ZAR, XAU/USD (pip-aware math).
- **TradingView chart** integrated into the trading view (loaded once, never re-rendered by ticks — performance by architecture).
- **Order ticket:** pair, direction (buy/sell), size (lots), stop-loss, take-profit, with a live 1%-risk gate.
- **Open positions & trade history** updated in place (no full rebuilds — the 600-position perf budget is architecturally guaranteed; ~6.6 ms/tick at 600 rows).
- **Machine assessment:** the machine grades ability, not just profit — Profitability (28%), Risk-adjusted return (25%), Discipline (27%), Consistency (20%). 30% with reckless risk scores *lower* than 10% done cleanly.
- **Boundaries are architectural:** demo accounts only, machine-enforced risk caps, no real money ever touches this floor. A student can only lose the lesson they refuse to learn.
- **Leaderboard rail:** results are server-signed (`/os/api/challenge/leaderboard`) and appear on the wall; local results still stand if the rail is down and sync when it returns.
- **Rewards:** passing students earn a machine-signed badge and RFX credit paid straight to their wallet. The philosophy: *"You have demonstrated that what you learned here works. We recognise that achievement, and we want to help you take the next step."*

### Live Rooms & the Studio

- **Rooms rail** (`/os/api/rooms`): mentors host lessons, staff host meetings; every session appears with join code, broadcast window and room chat.
- **Cam/mic:** real hardware via `getUserMedia` (works on localhost + HTTPS); toggles stop the tracks when off — the camera light must never stay on when not broadcasting.
- **White-background mode:** a distraction-free virtual backdrop for broadcasts.
- **Quality controls:** video quality selection, host controls.
- **Mentor calendar:** students request slots; a request is only real once the mentor confirms — never silently. Mentors can't cancel confirmed appointments inside a 3-hour window.
- **Interview room:** prospects/candidates wait in a mini waiting room, then are let in with a countdown.
- **1-on-1 sessions:** extra support for enrolled students; new students who paid for the course-with-mentor get first-hand privilege.

### Trade Journal

The trader's mirror (see Part IV). Local-only, six-stat rail, honest standard-lot math disclosed in the footer.

---

## PART VI — EDUCATIONAL INFRASTRUCTURE

### The Forge Standard (how chapters are built)

Every chapter is treated as a real learning experience, not a slide count: **Teach → Demonstrate → Challenge → Assess → Explain → Verify.** The `check-chapters.pl` verifier enforces per-lane structural integrity (slides/quiz positions on nulls, every assessment explained, content anatomy), and the Machine Audit gates every deploy on it.

### Learning mechanics

- XP (slides, correct answers, chapter passes, quiz passes), streaks, distinctions (90%+), time-in-game badges (First Hour → Century of Study), study-day badges.
- Trust Bar — the student's hall pass: 100% at mint, moves only on measured grounds. A healthy bar keeps every door open and lets fair-play flags resolve in the student's favour.
- Reflection windows, retake tokens, revision mode, notes on every slide, recommended-practice shelf.
- Mentor voice consistency across lessons; the AI Mentor as the always-available twin.

### Graduation

Complete all 13 chapters and pass every assessment → the certificate, drawn in gold with the verified identity from System A. Certificates print only for students who earned print trust.

---

## PART VII — CHALLENGES, RECOGNITION & STUDENT SUCCESS

### The reward philosophy

A challenge reward is **not** prize money. It is the institution saying:

> *"You have demonstrated that what you learned here works. We recognise that achievement, and we want to help you take the next step."*

A **R3,000 trading boost** could fund a successful student's first real trading account — proof the environment works, and a practical hand toward the market. Hard work → competence → recognition → opportunity.

### The Hall of Fame

The honours room: yearly walls (2024 / 2025 / 2026) across Standard, Challenging and Elite, with premium hover reveals showing what each honouree gained. Seeded with realistic, humanly-achievable stats — Elite is rare by design, so students crave their name on that wall.

### Success stories

Student successes become the strongest evidence the educational environment works — the institution's proof, not its marketing.

---

## PART VIII — ADMINISTRATION & ORGANIZATION

### The Registrar's consoles (System A)

- **SRM (Student Records Management)** — every student, every enrollment, every record: identity, contact, payments, coupons, verification state, access log (who looked at what, when).
- **Staff console** — duties, shifts, staff schedule, staff wallets, trial reviews.
- **Admin console** — enrollment review, approved/rejected states, batches, awards, financials, OS flags, OS uptime, storage, security, RFX coupons (mint, list, analytics), the PII incident board, device rails, audit.
- **Mailbox** — the email rail, both sides: registration emails, verification codes, invoices, guardian confirmations, notifications.
- **Wallet** — staff and student wallets, RFX credits, challenge reward payouts.
- **PDF contracts** — custom RFX Staff contracts, downloadable.
- **Demo trials** — prospective staff are trialled for 2 days / a week / a month; the manager (a robot) produces their report so no one can complain about unfair valuation. Success → email with a contract; failure → the customary "we'll keep you on file" letter. Demo staff are tagged in records, kept on speed-dial for future openings.

### The audit machinery

- **Machine Audit (OS, founder-only):** the building inspecting itself — the same regression audit that gates deploys, live.
- **audit-regression.pl:** one command, 13 sections: tree lockstep, version stamps, function contracts, handoff payload, OS stamp unity, coupon rail, store snapshot, device-trust rail, security layer, challenge sim, Forge Standard, Trade Journal, journal perf budget. ~30 seconds, ALL GREEN gates every deploy.
- **Incidents:** flags, fair-play reports, PII incidents on the audit page, audit trails on sensitive access.

---

## PART IX — TECHNICAL ARCHITECTURE

### The system at a glance (architecture map)

Every system below is real code — this is the organism the whole guide describes.

```
                        ┌──────────────────────────────────────────────┐
                        │            THE PUBLIC WEBSITE                │
                        │  reception · packages · coupons · age gate   │
                        └──────────────────────┬───────────────────────┘
                                               │  enroll / apply coupon
                                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  SYSTEM A — VERIFICATION & REGISTRATION (the security hub)               │
│  identity · device/location trust · guardian consent · staff consoles   │
│  registrar · audit · security · coupon analytics · mailbox · PII board   │
└───────────────────────┬────────────────────────────────────────────────┘
                        │  handshake rail — the approved identity
                        ▼  (the OS refuses entry without it)
┌──────────────────────────────────────────────────────────────────────────┐
│  SYSTEM B — THE RFX OS (the campus)                                     │
│  dashboard · journey · 13 chapters × 3 lanes · assessments · journal    │
│  trading arena · live studio · rooms · mentor · vault · hall of fame    │
└───────┬──────────────────┬─────────────────────┬───────────────────────┘
        │                  │                     │
        ▼                  ▼                     ▼
   audit rail          mail rail              DLP rail
   machine self-       Resend delivery        PII scanner →
   report (13 checks)  (emailed codes)        incident board
```

Three rails leave the campus, and all three are part of the machine: the
**audit rail** inspects the building before every change; the **mail rail**
carries official correspondence (registration, verification, guardian
confirmation, invoices); the **DLP rail** watches the chat and study spaces
so a student never accidentally sends a phone number or an ID into a room.

### The stack (plainly explained)

- **Frontend:** hand-built HTML/CSS/JS (no heavy framework) — because the whole institution runs as static-first, device-native pages that never depend on a server to teach. The lessons never go down with the API.
- **System A storage:** a localStorage-backed database (`db.js`) with versioned migrations, snapshots and backups — the demo carries the full institution on a student's device, and production plugs the same contracts into Netlify Functions.
- **The OS server** (`.freebuff/tools/os-handoff-server.pl`): the local rail that speaks the same protocol as production — handoff, sessions, device trust, rooms, leaderboard, PII incidents, audit.
- **Production API** (`netlify/functions/osapi.js`): the same contracts served from Netlify Functions on the live site; `_redirects` routes `/os/api/*` to the function.
- **Email:** Resend via the mail rail — registration emails, verification codes, invoices, guardian confirmations. `RESEND_API_KEY` + `RFX_MAIL_FROM` flip the demo code into a live emailed code worldwide. The vars are set as Netlify env vars, or baked automatically into the function bundle at deploy time from the local `secrets.env` (the free-plan path — `process.env` always wins, so UI-set vars override the bake).
- **Deployment:** `deploy-live.sh` — one command: audit gate → stage the OS → Netlify REST pipeline (content-addressed, only changed files upload) → verify live stamp + rails.
- **Hosting:** Netlify (free tier), global CDN, custom domains with SSL, serverless functions & storage.

### The communication rails

| Rail | Direction | Purpose |
|---|---|---|
| `/os/api/handoff` | A → B | Approve a student identity; mint their OS identity. |
| `/os/api/handoffs` | B → A | Greet verified students; read back the handoff. |
| `/os/api/session/*` | B ↔ | Single-session guard: claim, heartbeat, release. |
| `/os/api/device/*` | B ↔ | "Is this really you?" — unrecognized device/location challenge. |
| `/os/api/rooms*` | B ↔ | Live rooms, chat, bookings. |
| `/os/api/challenge/leaderboard` | B ↔ | Machine-signed challenge results. |
| `/os/api/pii-incidents` | B ↔ | DLP incident reporting. |
| `/os/api/flags/*` | B ↔ | Fair-play flags. |
| `/os/api/mail` | A → | Email rail (production). |
| `/os/api/audit` | B | The machine's self-report. |

### Security architecture

- **Role-based access control** — staff see only what their role needs; students own their information; the system protects and controls it; unauthorized users get nothing.
- **Access logging & audit trails** — every sensitive access is recorded and inspectable.
- **Data minimization & masking** — staff who only need a name and status don't see the phone number; sensitive fields are masked.
- **Device trust** — a new device/location triggers the "is this really you?" email code; students can mark "not me" and it's flagged for review.
- **Single-session guard** — one verified session at a time; a second device is refused and the event flagged.
- **Session security** — timeouts, heartbeat, release; an unattended session is not an open door.
- **DLP / PII guard** — chat fields are scanned for phone numbers, addresses, IDs, passwords, payment credentials; the system warns before sending, and blocks the worst patterns. The PII incident board logs everything.
- **Minors' safeguarding** — the age gate, guardian authorization flow, and visible privacy assurance for parents.
- **Backups protected like the live database** — snapshots before every change; a snapshot is a safety photo of the records, nothing more.

### Scalability & performance

- 600-position simulated portfolios hold at ~6.6 ms/tick by architecture (in-place updates, chart rail preserved, single tick driver) — and the audit enforces that architecture so a regression can't sneak back in.
- The system is designed to carry hundreds, then thousands: the same contracts run locally and on Netlify Functions, the same one-command deploy ships both trees, and the audit gates every change.

### Known limitations (honest)

- **Sim at 600+ open positions** starts to show lag — beyond normal usage, and the starting point for future optimization.
- **Email delivery** depends on the mail rail; when it's down, codes fall back to the demo path and the system says so.
- **The OS server** is a single local rail in the demo; production uses Netlify Functions — the protocol is identical, the failure mode is not.

---

## PART X — THE BIGGER PICTURE

The system is one organism:

```
             ┌─────────────────────────────────────────────┐
             │            THE PUBLIC WEBSITE               │
             │   marketing → programs → coupon → enroll    │
             └──────────────────┬──────────────────────────┘
                                ▼
             ┌─────────────────────────────────────────────┐
             │      SYSTEM A — THE REGISTRAR & SECURITY     │
             │  reception · register · member · wallet      │
             │  SRM · staff · admin · mailbox · coupons     │
             │  age gate · guardian · verify · handshake    │
             └──────────────────┬──────────────────────────┘
                                │ handoff (who is this student)
                                ▼
             ┌─────────────────────────────────────────────┐
             │      SYSTEM B — THE OS (ONLINE CAMPUS)       │
             │  dashboard · journey · lessons · assessments │
             │  laboratory · trading challenge · journal    │
             │  live rooms · studio · break · hall of fame  │
             │  mentor · vault · story · guide · audit      │
             └──────────────────┬──────────────────────────┘
                                │ machine-signed results
                                ▼
             ┌─────────────────────────────────────────────┐
             │   RECOGNITION · REWARDS · RECORDS · REPORTS  │
             │   hall of fame · wallet credits · contracts  │
             └─────────────────────────────────────────────┘
```

**Visitor → verified student → learner → trader → proven performer.** Every stage is a system; every system talks to the next one; every conversation is logged, guarded and audited. This is Reality FX — a connected digital trading education ecosystem.

---

*End of the Master Guide. Companion documents: the Investor & Partnership Presentation, and the University Student Experience.*
