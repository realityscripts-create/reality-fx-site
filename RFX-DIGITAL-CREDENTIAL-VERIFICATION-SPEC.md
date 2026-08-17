# RFX Digital Certificate Verification System

> Developer brief · Reality FX Academy · the credential rail behind every RFX certificate.

## 1. Purpose

Every RFX certificate issued to a student carries a **unique digital identity** that
anyone can verify online. The physical certificate is the credential's presentation;
the QR code connects it to the official RFX registry, so a third party can confirm the
credential was genuinely issued by Reality FX and has not been revoked.

The digital infrastructure is built **now**; premium physical certificates (embossing,
foil, holograms) come later and plug into the same verification rail.

## 2. Core concept

Every certificate receives a unique credential ID, minted at registration:

```
RFX-2026-000127
```

The certificate renders a QR code that encodes **only the public verification URL** —
never the student's name, email, or any other personal data:

```
https://www.realityfxacademy.com/verify/RFX-2026-000127
```

Scanning opens the public verification record. The QR is a **pointer to the registry,
not the security itself** — because the registry always displays the true holder, a QR
copied onto a fake certificate immediately exposes the forgery.

### What the OS already does (live in the RFX OS today)

- Every certificate is minted with `RFX-<year>-<hex>` — deterministic from the verified
  identity, stable for the life of the credential, never reused.
- The certificate room renders a gold-on-black QR encoding the verification URL
  (`os/js/qrcode.js`, MIT `qrcode-generator`, vendored) beside the credential ID.
- The QR renders only on the **earned** certificate — locked certificates show the
  "NOT YET EARNED" stamp with no QR, because the credential has not been issued.

## 3. The verification page (to build)

`GET /verify/<credential_id>` — public, responsive, no login. Three states:

| State | What it shows |
|---|---|
| **VALID** | Gold "VERIFIED" panel: holder name, credential (`RFX Certified Trader`), Certificate ID, issue date, status, "Issued by Reality FX Academy" |
| **NOT VERIFIED** | "The credential number provided could not be verified in the RFX credential registry." + contact line |
| **REVOKED** | "This credential is no longer considered valid by Reality FX Academy." |

Never an empty page. The page displays only what is needed to establish authenticity —
no phone, email, address, internal IDs, or financial data.

## 4. Credential record

```
credential_id   RFX-2026-000127   (never reused)
student_id      (link to the verified identity)
student_name
credential_name RFX Certified Trader
issue_date
status          VALID | REVOKED   (later: SUSPENDED, EXPIRED)
revoked_at / revocation_reason    (internal only)
created_at / updated_at
```

Historical fields (issue date, holder) are immutable; administrators can change status
but never silently rewrite history — every change records an audit event.

## 5. Security requirements

- The QR encodes **only** the verification URL — never passwords, tokens, emails,
  phone numbers, database IDs, or private records.
- The registry, not the QR, is the source of truth (copying a QR shows the true holder).
- Manual entry fallback: a "Verify a credential" box accepting the Certificate ID,
  for damaged QR codes and desktop checks.
- Verification activity is logged (time, credential, outcome) without storing the
  scanner's identity.

## 6. Development phases

1. **Core** — credential registry, unique IDs, public `/verify` endpoint, QR on the
   certificate (already live in the OS), valid/not-verified states, mobile-responsive page.
2. **Administration** — management console: search, status changes, revocation, audit trail.
3. **Hardening** — signed verification tokens, rate limiting, abuse protection.
4. **Premium physical** — foil, embossing, holograms, serialized stock; the same QR rail
   keeps working behind them.

## 7. Final principle

The QR exists so **every RFX credential is independently verifiable** — scan → verify →
trust. The registry establishes whether a credential is genuine and currently valid,
which is what gives the certificate — and the institution behind it — its credibility.
