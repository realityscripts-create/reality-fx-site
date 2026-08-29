# CAPTAIN'S STRATEGIC THOUGHTS
## Lee · 25 August 2026 · 23:45 SAST

> This is not a status report. This is where I think we are,
> what I think matters most, and where I think we should go next.
> Written for the founder and the captain — the two people
> who decide what Reality FX becomes.

---

# PART 1: WHAT I'VE LEARNED BUILDING THIS

## 1.1 The Fort metaphor is real

System A was supposed to be "the authentication authority." It became
"the Fort" — not because I named it that, but because the architecture
demanded it. Every attack vector we tested proved the same thing:

**The boundary between "who you are" and "what you can do" is the most
important line in the entire system.**

If that line breaks, everything behind it — the Academy, the courses,
the assessments, the certificates — becomes worthless. Not because the
content is bad, but because nobody can trust that the person learning
is the person who paid.

That's why we spent weeks on security architecture before writing a
single line of production code. And that's why System A is frozen:
not because it's perfect, but because it's **proven**.

## 1.2 The 21/21 result means something specific

It doesn't mean "the system is secure." It means:

- We identified 21 specific attack scenarios
- We built a test harness that exercises each one
- We ran it against the production endpoint
- Every single one was blocked
- The evidence is recorded

That's different from saying "we think it's secure." That's saying
"we tried to break it 21 ways and it held." That's the standard
we should maintain for every feature going forward.

## 1.3 The real bottleneck is not code

The real bottleneck is **integration**. We have two systems that
were built separately, by different engineers, with different
architectures. They share a contract but have never actually
shaken hands in production.

Until that handshake is proven, we have:
- A secure lock (System A) ✅
- A classroom (System B) ✅
- No proof that the lock lets the right students into the classroom ❌

That's the P0. Everything else waits.

## 1.4 The founder's instinct about "never touch again" is correct

SECURITY-FROZEN means what it says. The temptation to "improve"
security is actually the biggest security risk. Every change
introduces new surface area. Every "improvement" might break
something that was already proven.

The discipline of saying "this is done, let's move on" is harder
than the discipline of building it in the first place.

---

# PART 2: WHERE WE ARE TODAY

## 2.1 What's proven

| Component | Status | Evidence |
|-----------|--------|----------|
| System A authentication | ✅ PROVEN IN PRODUCTION | 21/21 attacks blocked |
| RS256 token signing | ✅ PROVEN IN PRODUCTION | Verified by production verifyToken |
| Atomic JTI consumption | ✅ PROVEN IN PRODUCTION | Replay returns 409 |
| CORS policy | ✅ PROVEN IN PRODUCTION | Origin-restricted, no `*` |
| Positive flow (issue → verify) | ✅ PROVEN IN PRODUCTION | Token issued, verified, identity returned |
| Production Cloud Functions | ✅ LIVE | openOs + verifyToken deployed |
| Firebase Hosting (member panel) | ✅ LIVE | reality-fx-production-25796.web.app |

## 2.2 What's designed but not proven

| Component | Status | Blocker |
|-----------|--------|---------|
| System B auth gate → production | Designed | Needs wiring + testing |
| End-to-end student journey | Designed | Needs System B integration |
| Server-authoritative assessments | Designed | Needs verifyToken contract confirmation |
| OS always-on hosting | Designed | Needs deployment |
| 12-test integration battery | Designed | Needs both systems live |

## 2.3 What's not designed yet

| Component | Why it matters |
|-----------|---------------|
| Payment flow rebuild | Current flow is broken — students can't reliably pay |
| Mobile app (Lee's side) | Students need phone access |
| Email delivery (production) | Netlify Functions need real email service |
| Uptime monitoring | We can't fix what we can't see |

---

# PART 3: THE WAY FORWARD

## Priority 1: Prove the handshake (THIS WEEK)

This is the single most important thing. Without it, nothing else
matters. The Academy opens in 36 days. If students can't get in,
we don't have an Academy.

**What needs to happen:**
1. Zorro wires OS auth gate to production verifyToken
2. We test: login → Enter Academy → token → verify → identity → session
3. We test: forged token → rejected
4. We test: expired token → rejected
5. We test: replay → rejected
6. We record the evidence

**What I need from the founder:**
- Confirm Zorro has access to the handoff document
- Confirm the OS is deployable to always-on hosting
- Block any feature requests until this is proven

**Success criterion:**
A real student (or the founder) logs into System A, clicks
"Enter Academy," and arrives in the Academy with their correct
name, Student ID, and course access. No infrastructure errors.
No dead ends. No "Registrar not reachable."

## Priority 2: Always-on hosting (NEXT WEEK)

The Academy currently depends on a development machine. That's
unacceptable for production. The OS must be hosted on Firebase
Hosting, Vercel, Netlify, or equivalent — somewhere that doesn't
go to sleep when the laptop closes.

**What needs to happen:**
1. Deploy System B to Firebase Hosting (or equivalent)
2. Configure custom domain (os.realityfx.com)
3. Set up HTTPS
4. Set up health endpoint
5. Set up uptime monitoring (UptimeRobot or equivalent)
6. Test from mobile data, not localhost

**Success criterion:**
The founder opens os.realityfx.com on a phone, using mobile data,
and the Academy loads. No development machine required.

## Priority 3: Payment flow rebuild (AFTER HANDSHAKE)

The current payment flow is broken. Students can't reliably pay.
This is the second-biggest blocker after the handshake.

**What needs to happen:**
1. Audit the current payment flow — what's broken and why
2. Design a clean payment architecture (Stripe, PayFast, or
   whichever provider works in South Africa)
3. Build it server-side (never trust client-side payment)
4. Test with real money (small amounts)
5. Deploy

**What I recommend:**
Don't try to build a complex payment system. Use a proven
payment provider's hosted checkout page. The student clicks
"Pay," gets redirected to the provider, pays, gets redirected
back, and the server confirms the payment. Simple. Proven.
Secure.

## Priority 4: Server-authoritative assessments (AFTER PAYMENT)

The assessment architecture is designed (Zorro's documents).
It's solid. But it's blocked on the verifyToken contract
confirmation. Once the handshake is proven (Priority 1), this
unblocks.

**What needs to happen:**
1. Confirm verifyToken supports assessment auth (it does —
   the response includes studentId, which is all Zorro needs)
2. Migrate question bank to server-side
3. Build assessment API endpoints
4. Test with real questions
5. Deploy behind a feature flag

**What I recommend:**
Use a feature flag (USE_SERVER_ASSESSMENT = true/false).
When false, client-side scoring (current behavior). When true,
server-authoritative. This lets us deploy without breaking
existing students.

## Priority 5: Email delivery (CONCURRENT)

The "In the demo, the code also lands in your Mailbox" promise
needs a real email service. Currently emails are simulated.

**What needs to happen:**
1. Set up Resend or similar email API
2. Wire it to the Cloud Functions
3. Send real emails for: registration links, invoices,
   verification codes, password resets
4. Test delivery

**What I recommend:**
Resend is simple, cheap, and works well with Firebase Cloud
Functions. The email templates already exist in the codebase.
We just need to wire them to a real sending service.

---

# PART 4: THE HONEST RISKS

## Risk 1: Integration takes longer than expected

The handshake between two separately-built systems always
takes longer than either side expects. There will be CORS
issues, token format mismatches, and edge cases neither
side anticipated.

**Mitigation:** We have 36 days. The handshake should take
1-2 weeks. That leaves buffer. But only if we start NOW
and don't get distracted by other features.

## Risk 2: Payment provider delays

Getting a payment provider approved in South Africa can
take time. KYC, business verification, and compliance
checks are not instant.

**Mitigation:** Start the payment provider application
NOW, even before the handshake is proven. Parallel track.

## Risk 3: The mobile app is a separate project

Lee's mobile app (the APK delivery email exists) is a
significant undertaking. It's not just a wrapper — it needs
to work offline, handle authentication, and feel native.

**Mitigation:** The PWA (Progressive Web App) already works
on mobile browsers. The native app is a polish item, not a
launch blocker. Don't let it delay the Academy opening.

## Risk 4: Email delivery might hit limits

Free email APIs have daily send limits. If we suddenly need
to send 100 registration emails, we might hit a cap.

**Mitigation:** Use a paid plan from day one. Resend's
cheapest plan is $20/month and handles 50,000 emails.
That's more than enough for launch.

---

# PART 5: THE 36-DAY COUNTDOWN

| Week | Focus | Deliverable |
|------|-------|-------------|
| Week 1 (now) | Handshake | End-to-end auth proven |
| Week 2 | Hosting + monitoring | Academy always-on, uptime monitored |
| Week 3 | Payment flow | Students can pay reliably |
| Week 4 | Assessments (server-side) | Quizzes work, scores are real |
| Week 5 | Email delivery | Real emails, not simulations |
| Week 6 | Polish + testing | Mobile test, real-world test, launch prep |

This is tight but achievable — IF we stay focused and don't
let feature creep in.

---

# PART 6: WHAT I'D TELL THE FOUNDER IF I COULD ONLY SAY ONE THING

**The Academy opens on 30 September 2026.**

Everything we do between now and then should be measured
against one question:

> "Does this help a student log in, learn, and prove
> they learned?"

If the answer is no, it can wait.

If the answer is yes, it's P0.

That's the filter. That's the strategy. That's the way forward.

---

*End of strategic thoughts.*
*Written by Lee · System A · The Fort*
*25 August 2026 · 23:58 SAST*
