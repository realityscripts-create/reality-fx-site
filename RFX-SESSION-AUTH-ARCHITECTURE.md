# Reality FX OS — System A Authentication, OS Sessions & Time Banking Architecture

> **Authoritative architecture document.** Every engineer, including Lee, must read this
> before touching the auth or session layer. The founder approved this spec on 19 August 2026.

---

## 1. The Non-Negotiable Architecture

Reality FX should have **one identity system and one authentication authority**.

### System A = THE FORT

System A is the only system responsible for:

- Student identity
- Login credentials
- Authentication
- Student ID
- Enrolment
- Course status
- Permissions
- Account status
- SRM / student records
- Access rights

### System B = REALITY FX OS

Reality FX OS is the student's operating environment.

It is responsible for:

- OS interface
- OS session
- Live session timer
- Activity / inactivity detection
- Time banking
- Session history
- OS-specific functionality

### Critical rule

**System B must NEVER independently authenticate a student.**

There must be:

- **ONE student account.**
- **ONE set of credentials.**
- **ONE source of truth for identity and access: System A.**

---

## 2. The Golden Rule

> **A student can only enter Reality FX OS through a valid authenticated and authorised System A identity.**

This must remain true regardless of how the student attempts to access the OS.

### Route 1 — Student Portal

```
Student → System A Login → Authenticated → Student Portal → Reality FX OS
```

### Route 2 — OS Shortcut App

```
Student → Reality FX OS Shortcut → System A Authentication Check → Authenticated? → YES → Reality FX OS
```

### Route 3 — Direct URL

```
Student → /OS → System A Authentication Check → Authenticated? → YES → OS | NO → System A Login
```

### Route 4 — Old/bookmarked OS URL

```
Bookmark → OS → System A Authentication Check → Valid System A session? → YES → OS | NO → System A Login
```

**There should be no route that bypasses System A.**

---

## 3. The Shortcut App Is NOT a Second Login

The shortcut app is simply a **launcher**.

It should NOT contain:

- A second username
- A second password
- A second student database
- Separate OS credentials
- Independent authentication

Instead:

```
OS Shortcut → "Take me to Reality FX OS" → System A authentication check → Authorised? → Reality FX OS
```

The shortcut is effectively just another door leading to the **same front door**.

---

## 4. Seamless Re-entry

If a student already has a valid System A authentication session:

```
Tap OS → System A validates identity → OS receives trusted authentication → OS session begins
```

From the student's perspective: **Tap OS → OS opens.**

---

## 5. No Valid Authentication

```
Student opens OS → System A authentication check → No valid authentication → Redirect to System A Login → Student logs in → System A verifies credentials → System A confirms identity/permissions → Student returned to OS → OS session created
```

The OS itself should never ask: "What's your OS password?" — **there is no such thing.**

---

## 6. Bypass Protection

Every protected OS route must validate the authenticated System A identity.

Nobody should be able to:

- manipulate a URL
- bookmark an internal OS page
- access a hidden OS route
- manually construct an OS URL
- use the shortcut app
- use browser history

to bypass System A.

---

## 7. System A Authentication vs OS Session

Two different concepts:

| Concept | Answers |
|---------|---------|
| **System A Authentication** | "Who is this person and are they authorised to use Reality FX?" |
| **Reality FX OS Session** | "Is this authorised student currently using the OS?" |

---

## 8. The OS Login Event

Entering the OS creates an **OS session** from the already-authenticated System A identity.

```
System A Student ID:  RFX-00127
System A Authentication: VALID
        ↓
Reality FX OS Session Created
Session ID:     RFX-OS-8F92A
Started:        13:04:21
Status:         ACTIVE
```

---

## 9. OS Logout

The OS should have a clearly visible **LOG OUT** button.

This means: **End my current Reality FX OS session.**

It does NOT mean: Delete/logout my entire System A authentication session.

```
OS LOGOUT → End OS Session → Calculate session duration → Bank session time → Destroy OS session
```

---

## 10. Time Banking

| Value | Behaviour |
|-------|-----------|
| **TOTAL TIME** | Permanently banked time. Static during session. |
| **LIVE SESSION** | Current session duration. Increases while active. |

### Example

```
Login:   TOTAL 10h 00m | LIVE 00h 00m
+4h:     TOTAL 10h 00m | LIVE 04h 00m
Logout:  TOTAL → 14h 00m (banked)
Next:    TOTAL 14h 00m | LIVE 00h 00m
```

---

## 11. Database Storage

Store time as **seconds**, not formatted strings.

```sql
total_session_seconds = 52320  -- displayed as "14h 32m"
```

---

## 12. Session Record

Every OS session should have its own record:

```
session_id
student_id
started_at
last_activity_at
ended_at
duration_seconds
status
termination_reason
credited
```

---

## 13. Heartbeat / Checkpoint vs Bank

**Critical distinction:**

| Action | What it does | When it fires | Modifies `S.secs`? |
|--------|-------------|---------------|---------------------|
| **Checkpoint** | Saves the active session state (start time, last activity) | Every 30s, on tab hide, on browser close | **NO** |
| **Bank** | Deposits session duration into `S.secs` (TOTAL) | **Only on Logout** or server-side session expiry | **YES** |

`S.secs` (TOTAL) must remain **completely static** throughout an active session.

Even after 100 checkpoint events, if TOTAL = 10h at login, it must still be 10h.

Only the Logout button (or future server-side session expiry) triggers the bank:

```
10h (TOTAL) + 4h (LIVE SESSION) = 14h (new TOTAL)
```

**`visibilitychange` must NOT bank time** — students may simply switch tabs temporarily.

### Heartbeat (future Phase 2)

While an OS session is active, the browser periodically communicates with the backend:

```
Browser → "I'm still active." → Backend → Update last_activity_at
```

If communication stops, the backend knows the session may no longer be active.

---

## 14. Session States

| State | Meaning |
|-------|---------|
| **ACTIVE** | Student is currently using the OS |
| **IDLE** | No activity detected for the configured period |
| **PAUSED** | Session timer stopped due to inactivity |
| **COMPLETED** | Student explicitly logged out |
| **EXPIRED** | System terminated the session after timeout |

---

## 15. Active Time vs Login Time

Future capability — not day one:

```
Logged into OS: 09:00–16:00 = 7h
Active:         09:00–11:30 + 12:00–14:00 + 15:00–15:30 = 5h
```

Architecture should support this later.

---

## 16. Multiple Devices / Multiple Tabs

**ONE ACTIVE OS SESSION AT A TIME.**

If the student tries to open another:

> "Reality FX OS is already active on another device."

Option: **Continue Here** — safely terminates the previous session and starts the new one.

---

## 17. Security Model

The OS must NEVER trust:

- localStorage
- client-side variables
- URL parameters
- browser cookies created solely by the OS
- frontend flags

to determine whether someone is a valid student.

The OS should receive a trusted authentication assertion/token from System A.

---

## 18. Atomic Logout + Time Banking

When the student clicks Logout:

1. Capture server time
2. Calculate duration
3. Add duration to Total Time
4. Mark `credited = TRUE`
5. If logout request fires twice, second request recognises already credited → refuses double-count

---

## 19. The Banking Animation

On logout, visually transfer Live Session → Total:

```
TOTAL:        14h 00m
              ↑ +03h 42m ↑
LIVE SESSION: 03h 42m → ENDED
```

Total animates: 14h 00m → 14h 15m → 15h 30m → 17h 00m → 17h 42m

---

## 20. Recommended Architecture

```
┌───────────────────────────┐
│     SYSTEM A — THE FORT   │
│                           │
│  Identity                 │
│  Credentials              │
│  Authentication           │
│  Student Records          │
│  Enrolment                │
│  Permissions              │
│  SRM                      │
└─────────────┬─────────────┘
              │
     ONLY AUTHORITY
              │
              ▼
┌───────────────────────────┐
│       REALITY FX OS       │
│                           │
│  Authenticated Identity  │
│  OS Session               │
│  Live Session             │
│  Activity Detection       │
│  Time Banking             │
│  Session History          │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│     SESSION DATABASE      │
│                           │
│  Session ID               │
│  Student ID               │
│  Start                    │
│  Activity                 │
│  End                      │
│  Duration                 │
│  Status                   │
│  Termination Reason       │
│  Credited                 │
└───────────────────────────┘
```

---

## 21. Implementation Phases

### Phase 1 — Establish the Fort
- [ ] Confirm System A is the sole authentication authority
- [ ] Ensure every OS route requires valid System A authentication
- [ ] Ensure the shortcut app cannot bypass System A
- [ ] Ensure direct OS URLs cannot bypass System A
- [ ] Ensure there is only one student identity/account
- [ ] Implement secure authentication handoff between System A and OS

### Phase 2 — Build the OS Session
- [ ] Create OS session after successful System A authentication
- [ ] Generate unique session ID
- [ ] Record server-side start timestamp
- [ ] Add visible OS Logout button
- [ ] Allow only one active OS session per student
- [ ] Prevent duplicate sessions from multiple tabs

### Phase 3 — Build the Time Bank
- [ ] Separate Total Time from Live Session
- [ ] Store time as seconds
- [ ] Calculate duration server-side
- [ ] Bank time only when the session ends
- [ ] Prevent double-crediting
- [ ] Keep session history

### Phase 4 — Make It Resilient
- [ ] Heartbeat
- [ ] Activity detection
- [ ] Inactivity warning
- [ ] Automatic session expiration
- [ ] Browser-close protection
- [ ] Internet interruption handling
- [ ] Computer sleep handling

### Phase 5 — Polish
- [ ] Logout confirmation
- [ ] Banking animation
- [ ] Session status indicator
- [ ] Session history
- [ ] Active/Idle/Paused states
- [ ] Future learning analytics

---

## The Student's Mental Model

```
System A     → "This is my Reality FX account."
Reality FX OS → "This is my Academy workspace."
OS Login     → "I'm entering the Academy."
Live Session → "I'm here right now."
Logout       → "I'm done for now."
Time Bank    → "That time has now been permanently credited to my Academy history."
```

**There is never a second Reality FX OS account. There is never a second password. There is never an alternative authentication route.**

The shortcut is simply a shortcut.

**The Fort remains the Fort.**

---

## 30. Security Hardening — Production Requirements

> These requirements were added after the initial architecture review. They tighten
> the protocol to prevent avoidable holes before implementation begins.

### 30.1 — Asymmetric Signing (Non-Negotiable)

System A must use **asymmetric signing** (RS256 or EdDSA), NOT symmetric/shared-secret (HS256).

| Entity | Holds | Can do |
|---|---|---|
| System A | **Private key** | Sign tokens |
| OS | **Public key** (or verification endpoint) | Verify tokens |

The OS must **never** possess the signing secret. This preserves the trust boundary: the OS can verify authenticity but cannot manufacture a valid token.

Key rotation: include a `kid` (key ID) header in the JWT so System A can rotate keys without breaking existing sessions.

### 30.2 — Bearer Token Protection

The signed token must NOT sit exposed in URLs longer than necessary.

**Preferred flow (Phase 1):**

```
System A → short-lived one-time authorization code → OS → server-side exchange → OS session
```

**If using signed JWT during Phase 1:**

- HTTPS only
- Very short-lived (5 minutes max)
- Single-use where practical
- Immediately removed from the URL after capture (`history.replaceState`)
- **Never** stored in localStorage
- **Never** written to analytics or logging
- Captured from URL param or HTTP-only cookie, then deleted from the URL

### 30.3 — Authentication ≠ Trust (Separation of Concerns)

A valid System A token establishes:

> **"This is RFX-00127 and System A authenticated this user."**

It does NOT mean the OS should blindly accept every future local value as authoritative.

**Hierarchy:**

```
Verified System A token
  → Identity / enrollment / founder / permissions
  → OS creates its local session
  → OS displays trust/standing based on verified claims + authorized academy data
```

The current `S.handoff.founder → 100%` fallback is useful for **development/graceful degradation only**. Once token authentication is live, **production trust MUST require a verified System A identity.**

We must not create a loophole where `founder=true` in a locally forged handoff produces 100% trust.

### 30.4 — OS Session as a Separate Object

Two distinct data structures must exist:

**AUTHENTICATED IDENTITY** (from System A token):

```
studentId, verifiedName, founder, enrollment/status,
permissions, authentication timestamp, token expiry
```

**OS SESSION** (created by the OS after validation):

```
sessionId, startedAt, lastActivity, current session duration,
status, banked duration, logout/finalization state
```

Restarting the OS does not create a new identity. An expired authentication token does not corrupt historical study time.

### 30.5 — Heartbeat Distinguishes Auth from Activity

The 30-second heartbeat must answer:

> **"Is this authenticated OS session still valid, and is the user still active?"**

- Identity was established at authentication time.
- The heartbeat maintains session liveness.
- If System A temporarily goes down, the OS must **NOT** destroy the user's current session or reset TRUST to null.

**Degraded state rules:**

| State | Behavior |
|---|---|
| **Unauthenticated** | No verified session → redirect to System A |
| **Authenticated + connected** | Full operation |
| **Authenticated + temporarily disconnected** | Retain existing session per expiry/grace rules. Show degraded connectivity state. Do NOT manufacture or erase identity. |

### 30.6 — Logout/Time Banking Is Idempotent

Logout must produce **exactly one final banking event.**

If the browser fires logout twice, the network retries, or the request is duplicated, the system must NOT bank the same session twice.

**Implementation:**

```
finalizationId = UUID or session-specific nonce
```

System A must treat duplicate finalization requests (same `sessionId + finalizationId`) as the same transaction.

**Rules:**
- Checkpoint = save state (fired on interval/tab-hide)
- Logout/finalization = bank accumulated duration **exactly once**

### 30.7 — Direct OS Access (Unauthenticated vs Disconnected)

Two different states must be distinguished:

| State | Behavior |
|---|---|
| **Unauthenticated** | User has no verified session → redirect to System A |
| **Authenticated but temporarily disconnected** | Retain existing OS session per expiry/grace rules. Show degraded connectivity. Do NOT manufacture or erase identity. |

**Do NOT destroy the local UI just because System A is temporarily unreachable.**

---

## 31. Token Protocol Specification

### 31.1 — Token Claims (JWT Payload)

```json
{
  "sub": "RFX-00127",
  "name": "Leeroy Chirwa",
  "founder": true,
  "status": "ACTIVE",
  "printTrust": "trusted",
  "enrolled": [1,2,3,4,5,6,7,8,9,10,11,12,13],
  "iat": 1692453600,
  "exp": 1692453900,
  "jti": "unique-token-id"
}
```

### 31.2 — Verification Endpoint

```
POST /api/verify-token
Body: { token: "<jwt>" }
Response: {
  valid: true,
  studentId: "RFX-00127",
  verifiedName: "Leeroy Chirwa",
  founder: true,
  status: "ACTIVE",
  trust: { score: 95, restricted: false },
  printTrust: "trusted",
  enrolled: [1,2,3,4,5,6,7,8,9,10,11,12,13]
}
```

### 31.3 — Error Responses

| Scenario | Response |
|---|---|
| Expired token | `{ valid: false, error: "expired" }` |
| Forged/malformed token | `{ valid: false, error: "invalid" }` |
| Revoked token | `{ valid: false, error: "revoked" }` |
| Wrong student | `{ valid: false, error: "identity_mismatch" }` |
| System A down | OS enters degraded state, retains existing session |

---

## 32. Implementation Phases

### Phase 1 — System A (Lee)

- [ ] Generate asymmetric signing keys (RS256 or EdDSA)
- [ ] Define exact token claims/schema (see §31.1)
- [ ] Generate short-lived auth credentials after successful login
- [ ] Build `/api/verify-token` endpoint
- [ ] Add key rotation/versioning (`kid` header)
- [ ] Test: valid, expired, malformed, forged, wrong-student, revoked credentials
- [ ] HTTPS enforced on all auth endpoints

### Phase 2 — OS (Lee + Buffy)

- [ ] Capture credential from URL param or HTTP-only cookie
- [ ] Remove credential from URL immediately (`history.replaceState`)
- [ ] Validate via `/api/verify-token`
- [ ] Create OS session ONLY after successful validation
- [ ] Populate identity from verified response (not from localStorage)
- [ ] Reject direct unauthenticated access → redirect to System A
- [ ] Implement degraded state (System A unreachable = retain session, show warning)

### Phase 3 — Session Lifecycle

- [ ] Heartbeat: 30s ping to System A (auth check + activity signal)
- [ ] Checkpoint: save session state on interval/tab-hide (does NOT bank time)
- [ ] Temporary System A outage handling (grace period, degraded state)
- [ ] Logout: finalization with idempotent banking (sessionId + finalizationId)
- [ ] Exactly-once time finalization on System A side
- [ ] Re-login / session replacement (new token = new session, old one finalized)

### Phase 4 — Regression Test Matrix

- [ ] Founder authenticates → 100% Excellent standing
- [ ] Normal student authenticates → correct trust score
- [ ] Forged token → rejected
- [ ] Expired token → rejected
- [ ] Missing token → redirected to System A
- [ ] Academy/System A temporarily unavailable → existing authenticated session persists
- [ ] Founder logout → another student login → **no founder identity/trust leakage**
- [ ] Duplicate logout → **no double banking**
- [ ] Page refresh → same OS session, not a new session
- [ ] Close/reopen → correct session recovery rules
- [ ] Direct `/os/` access → cannot bypass authentication
- [ ] Token removed from URL after capture (browser history clean)
- [ ] localStorage contains NO tokens (only session metadata)
- [ ] Forged `S.handoff.founder=true` in localStorage → trust bar stays "—" (no verified identity)

---

*Document created: 19 August 2026 · Founder-approved architecture*
*Security hardening added: 19 August 2026 · Founder-reviewed security requirements*
