# FOR ZORRO — System A Handoff · 25 August 2026

**From:** Lee (System A)
**Status:** System A is LIVE and SECURITY-FROZEN
**Priority:** P0 — Integration verification

---

## 1. WHAT'S LIVE

System A production Cloud Functions are deployed and verified:

| Endpoint | URL |
|----------|-----|
| Token Issuance | `https://us-central1-reality-fx-production-25796.cloudfunctions.net/openOs` |
| Token Verification | `https://us-central1-reality-fx-production-25796.cloudfunctions.net/verifyToken` |
| Member Panel | `https://reality-fx-production-25796.web.app` |

---

## 2. WHAT YOU NEED TO DO

### Step 1: Wire your auth gate to production verifyToken

Your OS auth gate should POST to:
```
https://us-central1-reality-fx-production-25796.cloudfunctions.net/verifyToken
```

Request body:
```json
{ "token": "<the JWT from the URL ?token= parameter>" }
```

### Step 2: Handle the response

**200 (authenticated):**
```json
{
  "valid": true,
  "identity": {
    "studentId": "RFX-XXXXX",
    "verifiedName": "Student Name",
    "email": "student@example.com",
    "founder": false,
    "status": "ACTIVE",
    "permissions": null
  },
  "trust": { "score": 85, "restricted": false }
}
```
→ Create OS session from `identity`, NOT from the raw JWT.

**401 (invalid/expired):**
→ Redirect to System A login.

**403 (not permitted):**
→ Show "Access denied" message.

**409 (replay):**
→ Redirect to System A login.

**500/503 (server error):**
→ Enter degraded state (preserve existing session if one exists).

### Step 3: Scrub the token

After verification succeeds, remove the token from the URL:
```javascript
history.replaceState({}, '', window.location.pathname);
```

### Step 4: Never store the raw JWT

- ❌ Do NOT put the JWT in `localStorage`
- ❌ Do NOT put the JWT in `S.handoff`
- ❌ Do NOT render the JWT to the user
- ❌ Do NOT log the JWT

The verified `identity` object IS the auth state.

---

## 3. CORS — YOU'RE ALREADY ALLOWED

Your OS origin `https://os.realityfx.com` is in the CORS allowlist.

If you're developing locally at `http://127.0.0.1:49270`, that's also allowed.

---

## 4. PROVEN EVIDENCE

- 21/21 production attacks blocked (see `PRODUCTION-PROOF-EVIDENCE.md`)
- Full positive flow proven: issue → verify → replay detected
- RS256 signing (not HMAC)
- Atomic JTI consumption via Firestore transaction
- SECURITY-FROZEN: no architecture changes without founder approval

---

## 5. WHAT I NEED FROM YOU

After you wire the auth gate, please confirm:

1. [ ] The OS hits `verifyToken` with the JWT from the URL
2. [ ] The OS creates a session from the verified identity response
3. [ ] The token is scrubbed from the URL after verification
4. [ ] The raw JWT is never stored in localStorage
5. [ ] The full handshake works end-to-end

---

## 6. COMMUNICATION CHANNEL

Both sides now have a shared channel:
**`reality-fx-site/LEE-ZORRO-CHANNEL.md`**

Update your section there. No more relay through the founder.

---

**System A is waiting. The boundary holds. Let's prove the handshake.** 🛡️
