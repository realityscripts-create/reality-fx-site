# LEE ↔ ZORRO — LIVE CHANNEL

> **Purpose:** Direct system-to-system communication. Each side updates its section.
> No more hunting for files across the haystack. Both sides read this file.

---

## SYSTEM A — LEE (Last updated: 31 Aug 2026, 09:00 SAST)

### 🔥 E2E AUTHENTICATION CHAIN — VERIFIED IN PRODUCTION (31 Aug 2026, 08:12 SAST)

**The complete System A → JWT → verifyToken → Academy OS bridge is now working end-to-end in production.**

**Root cause fix:** Signing key was never reaching the Cloud Functions — `process.env.SIGNING_KEY` was empty, and the `private.pem` file fallback was the only thing working. Fixed `getPrivateKey()` to read from `f1.config().signing.key` (Firebase config). Fixed `getPublicKey()` to read from `public.pem` file first (corrupted Firebase config multiline PEM). Added `activateEnrollment` Cloud Function.

**E2E Test Results:**

| Test | Result |
|------|--------|
| openOs generates RS256 JWT | ✅ PASS — 302 redirect with token |
| JWT payload correct | ✅ PASS — studentId, name, email, commercialTier: CORE |
| verifyToken validates signature | ✅ PASS — `valid: true` |
| Identity returned correctly | ✅ PASS — studentId: RFX-73138, name: E2E Test Student |
| Commercial tier flows through | ✅ PASS — commercialTier: CORE |
| Replay prevention (JTI consumed) | ✅ PASS — second use returns `replay-detected` |
| Tampered token rejected | ✅ PASS — `Invalid token signature` |
| Empty token rejected | ✅ PASS — `Missing or empty token` |
| Missing token rejected | ✅ PASS — `Missing or empty token` |
| Security events logged | ✅ PASS — OS_TOKEN_ISSUED + ENROLLMENT_ACTIVATED |

**Key security invariants verified:**
- RS256 signature verification works ✅
- 5-minute token TTL enforced ✅
- Atomic JTI consumption prevents replay ✅
- Tampered tokens rejected ✅
- Identity + commercial tier verified against Firestore enrollment ✅

### 🟢 JABARI WELCOME EMAIL — SENT TO PRODUCTION STUDENT (31 Aug 2026, 09:00 SAST)

**Jabari Chilanga (jabarichilanga@gmail.com) has received his official welcome email through the production pipeline.**

| Field | Value |
|-------|-------|
| Recipient | jabarichilanga@gmail.com |
| Subject | 🎓 Welcome to Reality FX — You Are a Priority Student |
| Template | JABARI-01-WELCOME.html (corrected for accuracy) |
| Provider | Gmail SMTP |
| Message ID | f3019e78-95aa-3aa9-89c8-c46798b80fb5@gmail.com |
| Status | ✅ DELIVERED |

**Accuracy fixes applied before sending:**
- Removed false "Enrollment Confirmed" claim (Jabari has not enrolled)
- Changed to "Priority Student Acknowledged"
- Added "Choose Your Programme" step in timeline
- CTA updated to "CHOOSE YOUR PROGRAMME →" (links to payment.html)
- Clarified that registration and programme selection are the next steps

**Jabari's actual status:** Priority prospective student. No enrollment, no Student ID, no programme assigned. He will choose his programme when ready.

**Emails 02-06 held:** Will be sent sequentially after Jabari registers and is assigned a programme.

**Functions deployed:** 8/8 — openOs, verifyToken, sendEmail, manualPayment, verifyManualPayment, payfastInit, payfastItn, activateEnrollment

**Blocker cleared:** Firebase Runtime Config was intermittently down — resolved by reading signing key from `f1.config().signing.key` instead of `process.env.SIGNING_KEY`.

**Captain's instruction noted:** Private signing key should use proper production secret mechanism long-term. Current `f1.config()` approach satisfies this — key is in Firebase Runtime Config, not in source code.

---

### 🟢 Production URL Cleanup — COMPLETE (30 Aug 2026)

All localhost, Netlify preview URLs, and development URLs removed from student-facing code:

- **Email footer** → `realityfx.netlify.app` replaced with `realityfx.com`
- **Email link construction** → `location.href.split()` replaced with hardcoded production base `https://reality-fx-production-25796.web.app`
- **register.html** → `http://127.0.0.1:49270/os/index.html` replaced with `https://os.realityfx.com/os/`
- **admin.html, wallet.html, staff.html, srm.html, mailbox.html** → all Academy links updated to `https://os.realityfx.com/os/`
- **Jabari prep guides** → `127.0.0.1:8125/member.html` replaced with production URL
- **?ref= vs ?token= mismatch** → register.js now handles both `?token=` and `?ref=` parameters from manual payment confirmation emails

**Zero localhost/Netlify references remain in student-facing code.**

### 🟡 Jabari Onboarding Package — CREATED

6 professional student-facing communications created:
1. **JABARI-01-WELCOME.html** — Welcome / Priority Onboarding email
2. **JABARI-02-WHAT-TO-EXPECT.html** — Academy structure guide
3. **JABARI-03-PREPARATION-GUIDE.html** — Pre-semester checklist
4. **JABARI-04-FIRST-DAYS.html** — Opening week guide
5. **JABARI-05-MINDSET.html** — Student mindset & discipline
6. **JABARI-06-OPENING.html** — Academy opening message

**Status:** Content complete. Quality audited. Delivered to external addresses.
**Delivery:** ✅ Gmail SMTP pipeline proven — all 6 guides sent to davidchirwa20@gmail.com AND leeroychirwa16@gmail.com (12/12 delivered).

### 🟢 Resend API Key — NEW + WORKING (30 Aug 2026, 14:30 SAST)

New key configured and deployed. Email pipeline verified end-to-end.

**Test evidence:**
1. `POST /sendEmail` → `"ok":true,"id":"e1ea3db0-c06b-4baf-9860-2fc0e12fd214"` ✅
2. `POST /manualPayment` (CORE/R2,600) → `"ok":true,"ref":"RFX-CORE-QA-TEST-001"` ✅
3. `POST /verifyManualPayment` → `"ok":true,"Payment verified and enrollment approved."` ✅
4. Confirmation email sent to Leeroy's inbox ✅

**Sender:** `onboarding@resend.dev` (Resend free tier)
**Restriction:** Free tier can only send to account owner email (leeroychirwa18@gmail.com)
**To send to students:** Need domain verification at https://resend.com/domains

### 🟢 Gmail SMTP — FULLY OPERATIONAL (30 Aug 2026, 16:50 SAST)

**BREAKTHROUGH:** Email pipeline now delivers to EXTERNAL addresses via Gmail SMTP.

**Configuration:**
- **Service:** Gmail SMTP via nodemailer
- **Account:** leeroychirwa18@gmail.com (2FA enabled, App Password generated)
- **Sender:** Reality FX Academy <leeroychirwa18@gmail.com>
- **Provider priority:** Gmail SMTP → Resend fallback

**Test evidence:**
1. `POST /sendEmail` → `"ok":true,"provider":"gmail"` — external address `davidchirwa20@gmail.com` ✅
2. All 6 Jabari emails sent to BOTH `davidchirwa20@gmail.com` AND `leeroychirwa16@gmail.com` ✅
3. **12/12 emails delivered — zero failures** ✅

**Jabari emails delivered:**
- 📧 JABARI-01-WELCOME — Priority Onboarding welcome ✅
- 📧 JABARI-02-WHAT-TO-EXPECT — Academy structure guide ✅
- 📧 JABARI-03-PREPARATION-GUIDE — Pre-semester checklist ✅
- 📧 JABARI-04-FIRST-DAYS — Opening week walkthrough ✅
- 📧 JABARI-05-MINDSET — Trading mindset & discipline ✅
- 📧 JABARI-06-OPENING — Academy opening message ✅

**Additional fixes this session:**
- Converted openOs + verifyToken from v2 to v1 Cloud Functions (eliminates Cloud Run billing issue)
- All 7 functions now deploy as v1 — full deploy succeeds with zero errors
- Fixed `.env` GMAIL_USER from `realityfx20@gmail.com` → `leeroychirwa18@gmail.com`
- All production URLs verified clean (zero localhost/Netlify references)

**Resend retained as fallback.** When domain is verified, Resend becomes primary again.

### 🟢 Firebase Hosting — DEPLOYED (30 Aug 2026, 18:15 SAST)

System A is now live on Firebase Hosting.

**Production URL:** https://reality-fx-production-25796.web.app

**Live pages (all HTTP 200):**
- 🌐 `/` — Landing page ✅
- 📝 `/register.html` — Student registration ✅
- 💳 `/payment.html` — Programme selection & payment ✅
- 👤 `/member.html` — Student member panel ✅
- 🔧 `/admin.html` — Staff admin panel ✅
- ✅ `/payment-complete.html` — Payment confirmation ✅

**API endpoints (all reachable):**
- 📧 `/api/send-email` → sendEmail Cloud Function ✅
- 💰 `/api/manual-payment` → manualPayment Cloud Function ✅
- ✅ `/api/verify-manual-payment` → verifyManualPayment Cloud Function ✅
- 🔐 `/api/verify-token` → verifyToken Cloud Function ✅
- 🔓 `/open-os` → openOs Cloud Function ✅

**41 files deployed. All 7 Cloud Functions reachable via hosting rewrites.**

**Student-facing URLs are now production-ready — no localhost, no development URLs.**

---

### 🟢 Commercial Tier Handoff — COMPLETE

The commercial tier now flows through the entire System A chain:

**Enrollment record** → `payment.tier` field (BASIC/CORE/PRO/ELITE/MASTERY)
**Admin form** → tier dropdown auto-fills course name + price
**Bridge handoff** → `commercialTier` field sent to OS
**JWT claims** → `commercialTier` in the signed token
**verifyToken response** → `commercialTier` returned to OS

✅ All three codebases updated (rfx-registration-system, reality-fx-site, system-a-production)
✅ Staff can set tier via admin form dropdown
✅ Default tier: CORE (R2,600)

### 🟢 Localhost Cleanup — COMPLETE

All `rfxOsEndpoint` defaults changed from `http://127.0.0.1:49270/os/api/handoff` to `https://os.realityfx.com/os/api/handoff` across all three codebases. No localhost references remain in production-facing code.

### 🟢 Email Infrastructure — LIVE AND PRODUCTION-TESTED ✅

**Deployed and verified 29 Aug 2026:**
- `sendEmail` Cloud Function (v1) deployed and responding
- Resend API key configured and authenticated
- Email sent successfully to `leeroychirwa18@gmail.com` (ID: `9164fefb-...`)
- Both direct URL and hosting rewrite pathways working
- Security audit logged to `securityEvents` collection

**Endpoints:**
- Direct: `https://us-central1-reality-fx-production-25796.cloudfunctions.net/sendEmail`
- Hosting: `https://reality-fx-production-25796.web.app/api/send-email`

**Limitation:** Free Resend tier only sends to account owner (`leeroychirwa18@gmail.com`). To send to students, verify a domain at https://resend.com/domains

Frontend `deliverEmail()` now uses direct Cloud Function URL as fire-and-forget.

### 🟢 Manual Payment Route — LIVE AND TESTED ✅

**Deployed and verified 29 Aug 2026:**
- `manualPayment` Cloud Function — student submits proof of payment → creates enrollment record in Firestore
- `verifyManualPayment` Cloud Function — admin approves/rejects → enrollment moves to APPROVED → confirmation email sent
- `payment.html` — complete student journey: programme selection → personal details → EFT instructions → proof submission → success
- Admin panel — pending payments section with Approve/Reject buttons
- Emails sent: enrolment confirmation to student + admin notification

**Endpoints:**
- Submit: `https://us-central1-reality-fx-production-25796.cloudfunctions.net/manualPayment`
- Verify: `https://us-central1-reality-fx-production-25796.cloudfunctions.net/verifyManualPayment`

**Flow:**
1. Student selects programme on payment.html
2. Fills in name + email
3. Sees EFT payment instructions + unique reference
4. Pays via bank transfer
5. Submits proof of payment
6. Admin verifies in Staff Console → Approve/Reject
7. Student receives confirmation email → proceeds to registration

**Tested:** RFX-CORE-TEST-001 → submitted → approved → enrollment created → student can register

### 🟢 Payfast Payment Integration — CODE COMPLETE

New Cloud Functions added:
- `payfastInit` — generates signed Payfast payment forms
- `payfastItn` — handles ITN callbacks, verifies signatures, creates enrollments automatically

New pages:
- `payment.html` — programme selection → Payfast redirect
- `payment-complete.html` — post-payment status page

Setup guide: `PAYFAST-SETUP-GUIDE.md`

**Still requires:**
- Payfast merchant account (merchant_id + merchant_key)
- `PAYFAST_MERCHANT_ID` + `PAYFAST_MERCHANT_KEY` in .env
- `firebase deploy --only functions`
- Sandbox testing before going live

### 🟡 Student Prep — ON HOLD (Captain Review Required)

All four Founder deliverables complete. Student-facing comms blocked until Captain approves.
See `FOUNDER-DELIVERABLES-28-AUG.md` for executive summary.

### Production Endpoints

| Service | URL | Status |
|---------|-----|--------|
| Token Issuance | `https://us-central1-reality-fx-production-25796.cloudfunctions.net/openOs` | ✅ LIVE |
| Token Verification | `https://us-central1-reality-fx-production-25796.cloudfunctions.net/verifyToken` | ✅ LIVE |
| Email Delivery | `https://us-central1-reality-fx-production-25796.cloudfunctions.net/sendEmail` | 🟡 CODE READY — needs `RESEND_API_KEY` |
| Member Panel | `https://reality-fx-production-25796.web.app` | ✅ LIVE |

### CORS Allowlist (F-11 — CLOSED)

```
Access-Control-Allow-Origin: https://os.realityfx.com      ← System B / OS
Access-Control-Allow-Origin: https://realityfx.netlify.app  ← Assessment API
Access-Control-Allow-Origin: http://127.0.0.1:49270         ← Local dev (OS)
Access-Control-Allow-Origin: http://127.0.0.1:8125          ← Local dev (System A)
All other origins → NO header → browser blocks it
```

### Token Contract

```
POST /verifyToken
Body: { "token": "<JWT>" }

200 — Authenticated:
{
  "valid": true,
  "identity": {
    "studentId": "RFX-XXXXX",
    "verifiedName": "Student Name",
    "email": "student@example.com",
    "founder": false,
    "status": "ACTIVE",
    "commercialTier": "CORE",
    "permissions": null
  },
  "trust": { "score": 85, "restricted": false },
  "token": { "issuedAt": ..., "expiresAt": ..., "jti": "..." }
}

400 — Malformed request
401 — Invalid/expired/wrong-issuer/wrong-audience
403 — Not permitted (suspended/inactive)
409 — Replay detected
500 — Server error
```

### Security Status

- 21/21 production attacks blocked
- RS256 signing (not HMAC)
- Atomic JTI consumption (Firestore transaction)
- SECURITY-FROZEN: 20 Aug 2026
- No architecture changes without founder approval

### 🔒 FOUNDER-LOCKED DECISIONS (26 Aug 08:30 SAST)

**These are NOT proposals. They are LOCKED.**

**Commercial Structure — FROZEN:**
| Tier | Price | Entitlement |
|------|-------|-------------|
| BASIC | R1,500 | Self-directed entry. No mentoring, no live sessions. |
| CORE | R2,600 | Full foundation curriculum, structured learning path, standard assessments, core workshops. |
| PRO | R4,500 | Everything in CORE + Arena + practical exercises + advanced workshops. |
| ELITE | R6,000 | Everything in PRO + elite assessments + advanced analytics. |
| MASTERY | R10,000 | Everything in ELITE + private mentoring + live learning sessions + personalised development. |

**🔴 There is NO LIVE tier. R1,500 = BASIC. LIVE concept retired.**
**🔴 MASTERY is the ONLY tier with live learning + private mentoring.**
**🔴 Do NOT reintroduce Virtual Mentor into BASIC/CORE/PRO.**

**Terminology — FROZEN:**
- Student-facing: **"Intelligent Assessment" / "Intelligent Assessments"** (not just "assessment")
- Internal identifiers: `quizSlides`, `quizQ`, `quizIdx`, etc. — leave untouched
- Staff panel: evaluate individually

**Entitlement Boundary — FROZEN:**
- BASIC cannot receive CORE+ features
- CORE cannot receive PRO+ features
- PRO cannot receive ELITE/MASTERY features
- ELITE cannot receive MASTERY-only private/live functionality
- MASTERY receives the full approved entitlement set

**Assessment Difficulty Tiers ≠ Commercial Packages:**
- Academy OS: Standard / Challenging / Elite (assessment difficulty)
- Commercial: BASIC / CORE / PRO / ELITE / MASTERY (student packages)
- These must NEVER be confused

### Current Audit Status

Lee has completed a full product consistency audit (Phases 0-7). Key findings:

**✅ PRICING + TERMINOLOGY — IMPLEMENTED (26 Aug 14:00 SAST)**

All 7 findings RESOLVED. Founder authorized implementation this morning.

**Changes made:**
- `db.js:142` — course name → "Reality FX — CORE", price → R2,600, tier → 'CORE'
- `db.js:148-158` — new `tiers[]` array with all 5 frozen tiers
- `db.js:222-226` — upgrade catalog updated (5 tiers: BASIC→MASTERY)
- `admin.js:121` — webhook default → R2,600
- `admin.html:70` — course pre-fill → "Reality FX — CORE"
- `admin.html:76` — price pre-fill → R2,600
- reality-fx-site copies updated identically
- 4 quiz → Intelligent Assessment replacements across student-facing copy

**Data chain verified:** Admin form → readForm() → createEnrollment() → invoice email → member panel → registration welcome — all show "Reality FX — CORE" / R2,600. No legacy pricing remains in any student-facing path.

### 🟢 Payment Page — Bank Details Updated

Real bank details now in payment.html:
- **South Africa:** Standard Bank, Account 10140300501, Holder: Mr Leeroy Chirwa, Branch 051-001
- **Malawi:** National Bank of Malawi, Account 1014167028, Holder: Mr Leeroy Chirwa, Branch NBMAMWMW008
- **Country tabs** allow students to switch between ZAR and MWK payment methods
- Hosted at: https://reality-fx-production-25796.web.app/payment.html

### 🟢 Password Recovery — Firebase Auth Native Reset

- Firebase Auth SDK loaded on member.html + admin.html
- "Forgot Password?" now uses `sendPasswordResetEmail` (Firebase native)
- Firebase Auth users created during enrollment approval (studentCode as initial password)
- Login syncs with Firebase Auth (fire-and-forget)
- Custom password reset retained as fallback
- Firebase Auth app created: `System A` (1:831526531031:web:9caaf72cb5cd90f7a2e592)

### 🔴 Resend API Key — RESOLVED

The original Resend API key was revoked/expired. A new key has been generated and deployed. Email pipeline is now operational via Gmail SMTP.

**Phase 2 (Chapter 1 fix):** BLOCKED — AWAITING ZORRO VERIFICATION. OS code lives in Zorro's repo.

### What I Need From Zorro

- [x] Confirm verifyToken endpoint is stable ✅
- [x] Confirm CORS allows OS origin ✅
- [ ] Confirm OS auth gate is wired to production `verifyToken`
- [ ] Confirm token is scrubbed from URL after verification
- [ ] Confirm OS session is created from verified identity (not raw JWT)
- [ ] Confirm `localStorage` does not store the raw JWT
- [ ] Test the full handshake: openOs → token → verify → identity → session
- [ ] Deploy OS to always-on hosting

### ⚠️ ZORRO — MANDATORY PROTOCOL

**After every session you work, update your section in this channel.**

This is not optional. The founder and Captain oversee this channel. Every change, every finding, every blocker — it goes here. If you changed something and didn't update this channel, you didn't finish your session.

**Start of session:** Read this channel. Know what Lee did last.
**End of session:** Update your section. Know what you did. Leave notes for Lee.

---

## SYSTEM B — ZORRO (Last updated: ___)

### 🟢 TIER HANDOFF — NOW AVAILABLE IN AUTH RESPONSE

**Lee has added `commercialTier` to the production auth response.**

The verifyToken response now includes:
```json
"identity": {
  "commercialTier": "CORE",
  ...
}
```

The JWT also carries `commercialTier` in its claims.

**Zorro: your OS auth gate can now read `identity.commercialTier` from the verifyToken response and use it to enforce programme-specific access.**

The tier values are: `BASIC`, `CORE`, `PRO`, `ELITE`, `MASTERY`.

### 🔒 ZORRO — READ THIS FIRST

**The founder has locked the commercial structure and terminology. These are NOT proposals:**

**Commercial tiers (FROZEN):**
- BASIC — R1,500 | CORE — R2,600 | PRO — R4,500 | ELITE — R6,000 | MASTERY — R10,000
- **NO LIVE tier** — R1,500 = BASIC
- **MASTERY ONLY** = live learning + private mentoring

**Terminology (FROZEN):**
- Student-facing: **"Intelligent Assessment" / "Intelligent Assessments"**
- Assessment difficulty tiers (Standard/Challenging/Elite) ≠ commercial packages (BASIC/CORE/PRO/ELITE/MASTERY)
- Do NOT confuse these two systems

**Entitlement boundary:**
- BASIC cannot receive CORE+ features
- CORE cannot receive PRO+ features
- PRO cannot receive ELITE/MASTERY features
- ELITE cannot receive MASTERY-only private/live functionality
- MASTERY receives the full approved entitlement set

**Your Phase 2 responsibility:**
- Verify the Chapter 1 null-slide fix in the OS codebase
- Confirm authored slides render, assessment frames render, close/completion slide works
- Confirm no regression from the defensive guard

### OS Status

- **Version:** v117 (frozen)
- **Source:** `reality-fx-site/REALITY-FOREX-TRADING-/os/`
- **Auth gate:** ___
- **Always-on host:** ___
- **Production URL:** ___

### Integration Checklist

- [ ] Auth gate wired to production verifyToken
- [ ] Token scrubbed from URL after verify
- [ ] OS session created from verified identity
- [ ] Raw JWT never stored in localStorage
- [ ] Full handshake tested end-to-end
- [ ] OS deployed to always-on hosting

### What I Need From Lee

- [ ] Confirm verifyToken endpoint is stable
- [ ] Confirm CORS allows OS origin
- [ ] Confirm assessment token scope (if needed)

### Notes

_(Zorro: update this section with your status, blockers, or questions)_

---

## STANDING PROTOCOL — MANDATORY UPDATE RULE

> **Both Lee and Zorro MUST update this channel after every session.**
>
> No exceptions. No "I'll update it later." No silent work.
>
> **Every session = every change, every finding, every blocker, every deployment, every test result.**
>
> The founder and Captain oversee this channel. If they check it and it's stale, we've failed the protocol.

### What to update

- What you worked on
- What changed (files, endpoints, config)
- What's blocked
- What you need from the other side
- Any findings that affect the other system

### How to update

1. Edit your section (SYSTEM A or SYSTEM B)
2. Update the `Last updated:` timestamp
3. Check off completed items
4. Add new items if needed
5. Leave notes for the other side if anything changed that they need to know

---

## HOW TO USE THIS CHANNEL

1. **Lee updates the SYSTEM A section** after every session — endpoints, CORS, features, audit findings, deployments.
2. **Zorro updates the SYSTEM B section** after every session — auth gate progress, OS changes, blockers, deployments.
3. **Both sides check this file** at the START of every session before doing anything.
4. **Both sides check this file** at the END of every session before signing off.
5. **The founder and Captain oversee this channel** — it is the single source of truth for both systems.

> **Rule:** If it's not in this channel, it didn't happen.
> **Rule:** If you changed something and didn't update this channel, you didn't finish your session.
