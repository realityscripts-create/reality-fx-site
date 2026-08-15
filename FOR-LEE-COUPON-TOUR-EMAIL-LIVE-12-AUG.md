# FOR-LEE — Coupon Tour + Email + Live Wiring, 12 August (addendum)

> Built, verified live in the browser, and synced to BOTH System A trees
> (`System-A-live` + source folder — still byte-identical). The OS is at v=17,
> System A at `v=20260812-63`. Work top to bottom.

---

## 1. 🎁 THE WEBSITE COUPON → limited-access "academy tour" (done, both sides)

The founder's idea: a prospect applies a coupon to the packages on the website,
it looks like they own the course, but it is actually **time-limited access** —
the marketing illusion, built on the demo-pass machinery.

**Website (REALITY-FOREX-TRADING-):**
- `programs.html` now has a gold **"HAVE AN RFX COUPON?"** strip above the
  program cards. The "🎁 I have a coupon" button opens a modal (code input →
  deep-links to the reception with `?coupon=CODE`).
- `js/main.js` gained the modal + a `RECEPTION_URL` config
  (`window.RFX_RECEPTION_URL` or `?rfx-reception=URL` override; default
  `http://127.0.0.1:8123`).

**Reception (System A):**
- `index.html?coupon=CODE` auto-opens the coupon modal, **pre-fills the code
  and validates it automatically** (verified live — the golden ticket opens
  itself).
- **New coupon benefit type: `demo` (academy tour).** Admin console Coupons
  form gained "Academy tour (time-limited)" + a tour-length (hours) field.
  `createCoupon`/`couponBenefitLabel`/`redeemCoupon` all handle it.
- Redemption mints the enrollment with `demoPass: { hours, createdAt }`
  (default 48h → "2 days academy tour"), price 0, still fires the standard
  registration invite + emails, still consumed once-and-done. The student
  registers like everyone else — real verified identity, real Student Code.
  Verified live end-to-end (test data fully cleaned afterwards).

## 2. ⚠️ REAL BUG FOUND + FIXED — the demo tour never reached the OS

The OS reads `demoTourEndsAt` off the handoff and locks the tour when it
drains (`tourLocked()`), but **System A never sent it** — the bridge sent
`demoPass` only, so the OS saw no tour at all. Now `buildPayload` computes
`demoTourEndsAt = createdAt + hours` and sends it. The OS tour chip + lock
are already built; they now actually fire. **Please keep both fields in the
payload on your side when you mirror the handoff.**

## 3. 📧 Email branding — every email now says "Reality FX" loudly (done)

- `brandHtml()` / `footerHtml()` in `db.js` upgraded: gold crown + **Reality
  FX Academy** wordmark, "THE TRADING ACADEMY · ENROLLMENT · REGISTRATION ·
  IDENTITY", the house rule *"Every lesson is a trade. Every trade is a
  lesson."* in gold, and a signed footer ("This is official Reality FX
  correspondence…").
- The OS device-check email ("is this really you?") in `netlify/functions/
  osapi.js` now uses the same branded frame (`deviceCheckHTML`).

## 4. ⚠️ The real reason David's email never arrived — READ THIS

The sender is **`onboarding@resend.dev`** — Resend's TEST domain. Resend only
delivers test-domain mail to **the account owner's own verified inbox**. That
is exactly why the founder's email arrived (it's the account owner) and
David's (a real third-party address) did not. **This is not a bug in the
app** — the app's mail rail is correct; it is a sender-domain restriction.

**The fix (yours / founder's):** verify a real sender domain in Resend and set
`RFX_MAIL_FROM` + `RESEND_API_KEY` env vars on Netlify (currently the site's
env is empty). A real domain needs DNS records (SPF/DKIM/DMARC) — that is a
per-domain requirement on Resend, Brevo AND SendGrid alike; there is no $0
sender that lands in Gmail's inbox reliably. Interim $0 option if needed: a
free subdomain you control DNS for (e.g. an `is-a.dev` subdomain) verified in
Resend — real delivery, weaker reputation, fine for the demo phase.

## 5. 🎥 Live rooms — camera/mic now request the real hardware (done)

The host cam/mic toggles were UI-only (they "armed" nothing). Now in
`os.js` the room player:
- **Camera** → `navigator.mediaDevices.getUserMedia({video})`, shows your
  **live preview** in the room stage (with a "Your camera — host preview" tag),
  stops the stream on toggle-off (the camera light never stays on after
  leaving the room).
- **Mic** → `getUserMedia({audio})`, armed indicator, stops on toggle-off.
- **Quality selector** → re-arms the camera at 720p/1080p.
- Permission problems are explained in a toast ("Camera blocked — allow camera
  access…" / "No camera found…"). Works on localhost + HTTPS.
- White backdrop remains the studio-wall placeholder (real background removal
  comes with the broadcast provider).

## 6. ✒️ OS cursive — one voice everywhere (done)

Every italic element in the OS now uses the same quote face
(`--font-quote`, Playfair italic — the visible, classy one), **sizes
untouched**: `.native-sub`, `.pause-hint`, `.out-hint`, `.dd-voice`,
`.badge-empty`, `.tier-peek-line` all carry the family now.

---

### Housekeeping
- Version stamps: System A `v=20260812-63` (all pages, all assets), OS v=17.
  Bump on EVERY content edit — a stamp that doesn't change with the file is
  how stale caches bite.
- Both System A trees verified byte-identical.
- Test records (tour coupons, ENR-0049, probe emails) were fully removed from
  the shared store and the restore was verified — David Chirwa's record
  (ENR-0048) is intact.
