# Lee — Build the OS Auth Endpoint

**What:** `POST /api/verify-token` on System A.

**Spec:** FOR-LEE §51 (§51.1–§51.9). The code is ready to adapt — Node.js/Express examples included.

**The one rule to remember:** The 5-minute JWT is an authorization credential, not the OS session. Once the OS verifies it, the token becomes irrelevant. The OS session governs ongoing activity.

---

## Build in this order

1. **Keys** — generate RS256 keypair, store private key securely
2. **Database** — create `consumed_tokens` with UNIQUE constraint on `jti`
3. **Token generation** — `generateOsToken(enrollment)` with all 12 claims, 5-min expiry, unique jti
4. **`/open-os` route** — only authenticated System A users. Generate token → INSERT jti → redirect to `/os/?token=...`
5. **`POST /api/verify-token`** — verify signature + claims + enrollment + permission + replay (atomic consume)
6. **Test with §51.8 checklist**

---

## Atomic consume — don't skip this

The replay check and consume MUST be one atomic operation:

```sql
UPDATE consumed_tokens SET consumed = TRUE WHERE jti = ? AND consumed = FALSE;
```

`affected_rows === 1` → success. `0` → replay → return 409.

Never SELECT then UPDATE as two separate operations.

---

## Required proof before we start Phase 3

### Positive flow

One successful real end-to-end:

```
Student logs into System A
  → clicks "Open Reality FX OS"
  → System A creates jti, persists it, signs 5-min token
  → redirects to /os/?token=...
  → OS captures token, scrubs URL immediately
  → OS calls POST /api/verify-token
  → System A: signature ✓, claims ✓, jti ✓, enrollment ✓
  → returns 200 with identity + trust
  → OS: AUTH populated, OS_SESSION created, TRUST_VERIFIED = true
  → correct name, ID, trust score displayed
```

### Negative tests

Run these and bring the results:

| # | Test | Expected |
|---|---|---|
| 1 | Modify payload (keep signature) | 401 `invalid` |
| 2 | Fake signature | 401 `invalid` |
| 3 | Expired token | 401 `expired` |
| 4 | Wrong issuer (`iss !== "realityfx"`) | 401 `wrong-issuer` |
| 5 | Wrong audience (`aud !== "rfx-os"`) | 401 `wrong-audience` |
| 6 | Reused jti | 409 `replay-detected` |
| 7 | Unenrolled/suspended student | 403 `not-permitted` |
| 8 | Missing token | 400 `malformed` |
| 9 | Token visible in URL after OS loads | Should be scrubbed (URL = `/os/`) |
| 10 | Token in localStorage | Should be absent |
| 11 | Token in `S.handoff` | Should be absent |
| 12 | Token in server logs | Should be absent |

### Race test

Send two verification requests with the **exact same token** as close together as possible.

```
Request A → 200
Request B → 409
```

**Never 200 + 200.** That proves atomicity, not just documentation of atomicity.

---

## What NOT to build yet

Don't touch heartbeat. Don't touch session liveness. Don't touch time banking.

Just: **keys → DB → token gen → /open-os → /api/verify-token → test → bring results.**

Once these pass, we start Phase 3.

— Zorro
