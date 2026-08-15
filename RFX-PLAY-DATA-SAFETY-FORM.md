# 📱 REALITY FX — GOOGLE PLAY "DATA SAFETY" FORM (DRAFT)

*Prepared 15 August 2026 · for the Play Console Data safety section, ready to fill in the day we submit.*
*Every answer below is grounded in the actual system (System A registration/identity, RFX OS, the PWA layer) — not aspirational wording. Review before submission; the sources column points at where each answer lives in the machine.*

---

## 1 · POLICY COMPLIANCE (declarations)

| Question | Answer |
|---|---|
| Does your app collect or share any of the required user data types? | **YES** — it is an educational institution platform (registration, identity, learning records). |
| Is all user data encrypted in transit? | **YES** — every rail is HTTPS (Netlify edge + functions; the OS and System A are served over TLS only; the PWA registers a service worker that only installs on secure contexts). |
| Do you provide a way for users to request data deletion? | **YES** — in-app support rail in the Member panel (My RFX Account) and support email; the Registrar processes deletion/rectification requests. *(Recommended: add an explicit "Request my data / Delete my account" button in the OS Settings before store submission.)* |
| Is any data shared with third parties? | **No data is sold, rented, or shared for advertising or analytics.** Only function-necessary processing (see §3). |

---

## 2 · DATA TYPES — WHAT THE APP COLLECTS

Legend: **Collected** = the app sends/stores this. **Processed** = handled only to make a feature work. **Shared** = transmitted to a third party.

### Location
| Data | Collected | Shared | Notes / source |
|---|---|---|---|
| Approximate location | **YES** | No | Derived from IP address for login-verification anomaly checks (new device/location → "Is this really you?" code). Stored in access logs. No GPS. |
| Precise location | **NO** | — | Never requested. |

### Personal info
| Data | Collected | Shared | Notes / source |
|---|---|---|---|
| Name (first + surname) | **YES** | No | Registration; appears on certificate, Hall of Fame if earned. |
| Email address | **YES** | Function only | Delivered via the mail rail (Resend) for codes/invoices/confirmations. |
| Phone number | **YES** | No | Registration + identity verification. |
| Physical address | **YES** | No | Registration. |
| Date of birth / age | **YES** | No | Registration; drives the 18+/under-18 consent path. |
| **Government ID / passport number** | **NO** | — | **Explicitly never collected.** The field is hidden by default (`idNumber: 'off'` in config); the form states: *"Reality FX does not collect government ID or passport numbers — ever."* |
| Race / ethnicity / religion / sexual orientation / other sensitive categories | **NO** | — | Not collected. |

### Financial info
| Data | Collected | Shared | Notes / source |
|---|---|---|---|
| Payment info (card numbers, bank credentials) | **NO** | — | Payments happen through external channels (bank transfer / PayPal / manual rails); the system records the *result* of a payment, never the card or account credentials. |
| Purchase history | **YES** | No | Enrollment/package records, invoices, coupons. |
| Other financial info | **YES** | No | Internal wallet balances, RFX credits, challenge reward payouts — the institution's own currency, not real-money balances. |

### Health & fitness — **NO** (not collected)

### Messages
| Data | Collected | Shared | Notes / source |
|---|---|---|---|
| Emails (support) | **YES** | Function only | Member-panel support rail + mailbox. |
| In-app messages (Study Rooms / Live Chat) | **YES** | No | Chat content stored for the session; **PII scanner** warns/blocks before sensitive info is sent. |

### Photos & videos
| Data | Collected | Shared | Notes / source |
|---|---|---|---|
| Photos | **YES** | No | Identity selfie at registration (stored securely, used only for identity verification); optional profile photo. |
| Videos | **NO** | — | Live Rooms transmit cam video in real time (WebRTC); **not recorded, not stored**. |

### Audio
| Data | Collected | Shared | Notes / source |
|---|---|---|---|
| Audio files | **NO** | — | Live Rooms transmit microphone audio in real time; **not recorded, not stored**. *(If Play's definition counts real-time transmission as collection, declare "YES — ephemeral, not stored"; we recommend the honest "ephemeral" note in Additional Information.)* |

### Files & docs — **NO** (no document collection; the identity selfie is listed under Photos)

### Calendar — **NO** · Contacts — **NO** · Web browsing — **NO** (no in-app browser, no browsing history)

### App activity
| Data | Collected | Shared | Notes / source |
|---|---|---|---|
| App interactions | **YES** | No | Course progress, assessments, accuracy, chapter completion, trust bar. |
| In-app search history | **YES** | No | OS Guide / directory searches (minor). |
| Other user-generated content | **YES** | No | Trade Journal entries, challenge entries, leaderboard/Hall of Fame records, chat messages. |
| Other actions | **YES** | No | Challenge participation, device checks, session events. |

### App info & performance
| Data | Collected | Shared | Notes / source |
|---|---|---|---|
| Crash logs | **YES** | No | Frontend error rail in the OS. |
| Diagnostics | **YES** | No | Heartbeat/uptime metrics. |
| Other app performance data | **YES** | No | Session telemetry used to keep the machine healthy. |

### Device or other IDs
| Data | Collected | Shared | Notes / source |
|---|---|---|---|
| Device or other IDs | **YES** | No | Device fingerprint used for login verification and session guarding (never sold; stored in access logs). |

---

## 3 · DATA SHARING & THIRD PARTIES

- **No advertising, no ad SDKs, no analytics trackers, no data brokers, no selling.** The app contains no third-party ad or analytics SDK.
- Function-necessary processors only:
  - **Netlify** — hosting, edge TLS, serverless functions, storage. Student records live in the platform's managed storage (encrypted at rest by the provider).
  - **Resend** — transactional email delivery (registration emails, verification codes, invoices, guardian confirmations, welcome/install emails). Only the email address and the email's content are transmitted; no email is ever sold.
  - **TradingView (embedded chart widget in the Trading Arena)** — the widget renders market data; **no student personal data is sent to TradingView**. The student's orders, P/L and records never leave the OS.
- The machine's own audit (15 sections) verifies the handshake rails and security posture before every deploy.

---

## 4 · SECURITY PRACTICES

| Practice | Status |
|---|---|
| Data encrypted in transit | **YES** — HTTPS everywhere, PWA on secure context only. |
| Data encrypted at rest | **YES** — platform-managed storage encryption (Netlify); credentials never stored in the client. |
| Users can request data deletion | **YES** — support rail + Registrar process. *(Add the explicit in-OS button before submission.)* |
| Independent security review (e.g. MSA) | **Not yet** — internal machine audit today; we recommend an independent review (e.g. Google MSA or a reputable assessor) as the store submission step. |
| Data minimization | **YES** — role-based staff access (staff see only what their job needs), field masking, PII scanning in chats, government ID never collected. |
| Access logging & audit trails | **YES** — 35+ security event kinds logged; access log records who looked at what, when. |
| Guardian consent for minors | **YES** — under-18 enrollment requires parent/legal guardian name + email authorization before activation. |

---

## 5 · FAMILIES / CHILDREN'S PRIVACY

- The app is **not designed for children under 13** and contains no child-directed content or features.
- It is an educational trading institution that serves **students 13+ and adults**. For minors, enrollment enforces **parent/legal guardian authorization** (name + email + consent step) before the student is activated — visible in the registration flow and the enrolment policy.
- Recommended Play declaration: *"Not designed for children. May be used by teens with guardian consent."* — and add the guardianship language to the store description so parents see it before install.

---

## 6 · ADDITIONAL INFORMATION (free-text, store-ready)

> Reality FX is a digital trading education institution. The app (the RFX OS + student portal) lets a student learn 13 chapters across three difficulty lanes, practice in a simulated trading arena, journal trades, take machine-graded challenges, and build a verified track record. Registration collects identity and contact details and requires parental/guardian authorization for students under 18. All data is encrypted in transit, protected by role-based staff access, access-logged, and never sold or shared for advertising. The institution does not collect government ID or passport numbers, does not hold or manage student money (the arena is simulation; wallet credits are internal), and provides a data-deletion path through its support rail. Live-room audio/video is transmitted in real time for the session and is not recorded or stored. Chat messages are screened by a privacy layer that warns before sensitive information is shared. The system runs a self-audit before every update and publishes the results.

---

## 7 · PRE-SUBMISSION CHECKLIST

- [x] **"Request my data / Delete my account"** is live in the OS (My Profile → Privacy & your data) — filed to the `/api/data-requests` rail with a reference number, reviewed by the Registrar, visible on the Staff Console's Data-requests board. *(Built 15 Aug 2026, v=68.)*
- [ ] Decide the **Audio** declaration (ephemeral real-time → recommend declaring YES with "not stored").
- [ ] One independent security review (MSA or assessor) for the "reviewed" badge.
- [ ] Add the guardian-consent language to the store description.
- [ ] Keep this document synced whenever a data flow changes (any new collection → re-answer §2).
