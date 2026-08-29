# LEE ↔ ZORRO — LIVE CHANNEL

> **Purpose:** Direct system-to-system communication. Each side updates its section.
> No more hunting for files across the haystack. Both sides read this file.

---

## SYSTEM A — LEE (Last updated: 29 Aug 2026, 14:30 SAST)

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
