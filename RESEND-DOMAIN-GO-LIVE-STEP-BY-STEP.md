# 📧 RESEND — GO LIVE ON EMAIL, STEP BY STEP (12 AUG 2026)

**Why this is the one step left:** `onboarding@resend.dev` is Resend's *test* sender. It only
delivers to YOUR OWN inbox — that's exactly why David never got his registration email. Real
students need a **verified sending domain**. Every serious provider (Resend, Brevo, Mailgun,
Postmark, SendGrid) requires the same thing: a domain you control with SPF + DKIM DNS records.
There is no $0 workaround that lands in real inboxes — but a free domain costs nothing but ~2
days of patience.

The system side is already done — **no code changes needed**. The mail rail reads three
environment variables at runtime and you simply point the `from` at your verified domain.

---

## PART A — Get a domain (pick ONE)

### Option 1 (free): eu.org — takes 24–72h to approve
1. Go to https://nic.eu.org → **Register** → create an account (real email needed).
2. After login: **Request a domain** → enter the domain you want, e.g. `realityfx.eu.org`.
   You do NOT need to choose the "hosted" option — pick any free subdomain name under eu.org.
3. Wait for the approval email (usually 1–3 days). Once approved you manage DNS at nic.eu.org
   → **Your domains** → the domain → **Edit** → **Nameservers / DNS**.
4. eu.org's editor is basic but fine — you add the TXT records from Part B below there.

### Option 2 (cheap, ~$3–5/yr, instant): a real domain
- A `.com`/`.net` is ~$10/yr; cheaper TLDs (`.xyz`, `.site`, `.top`, `.online`) are often
  $1–3 for the first year at Namecheap / Porkbun / Cloudflare.
- Buy it, point it at any DNS host (Cloudflare is free and makes record editing easy), then
  add the TXT records from Part B.

> Recommended: start with eu.org now (free, no risk). If you want it live this week instead,
> spend the few dollars — your call, Captain.

---

## PART B — Verify the domain in Resend (takes 5 minutes)

1. Log in at https://resend.com → **Domains** → **Add Domain**.
2. Enter your chosen domain (e.g. `realityfx.eu.org`).
3. Resend shows you **three records** to add in your DNS provider:
   - One **SPF** TXT record (value starts with `v=spf1 include:amazonses.com ~all`)
   - One **DKIM** TXT record (name like `resend._domainkey`)
   - One **DMARC** TXT record (name `_dmarc`, value `v=DMARC1; p=none;` — strictness up to you)
4. Add each record EXACTLY as Resend shows it — name, type, value, TTL. Double-check
   whitespace; TXT records are unforgiving.
5. In Resend, click **Verify** (or just wait — it polls). Status flips to **Verified**
   once DNS propagates (usually minutes–24h).
6. While you're there: **Domains → your domain → Send from** — copy the exact
   `from` address Resend gives you, e.g. `Reality FX <onboarding@realityfx.eu.org>`.

---

## PART C — Flip the mail rail to production (2 minutes, no deploy)

In **Netlify → Site → Site configuration → Environment variables**, edit/confirm three values:

| Variable | Current | New |
|---|---|---|
| `RESEND_API_KEY` | already set | keep (re-generate only if you suspect a leak) |
| `RFX_MAIL_FROM` | `Reality FX Academy <onboarding@resend.dev>` | `Reality FX Academy <onboarding@realityfx.eu.org>` |
| `RFX_MAIL_REPLY_TO` | set | keep — students reply to you directly |

Then trigger any deploy (or just wait for the next one) — **the function reads env at runtime,
no code change**. Every email the system sends (verification codes, registration links, guardian
authorization, prep guide, handoff) now arrives from your branded address.

---

## PART D — Prove it end-to-end (5 minutes)

1. Open the system, send yourself a verification code (or use the staff console "Email" actions).
2. Check the inbox — it must land in **Inbox**, not spam. If it lands in spam, add the DKIM/
   SPF check again — 99% of spam-folder drops are a mistyped TXT record.
3. Send a test to a **second, separate** address (not yours) — David's is the perfect canary.
   If he gets it, real students will too.

---

## What this does NOT change
- No code edits. No redeploy logic. No system behavior — same emails, branded sender.
- The OS offline course still works with zero network. This is only the mail rail.

— Zorro (System B), 12 August 2026
