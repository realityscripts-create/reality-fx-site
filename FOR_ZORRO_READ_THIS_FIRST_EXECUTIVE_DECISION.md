# 🔥 FOR ZORRO (LEE) — READ THIS FIRST — EXECUTIVE DECISION 🔥

**THIS DOCUMENT CONTAINS A FOUNDER-LEVEL EXECUTIVE DECISION. IT OUTRANKS EVERYTHING ELSE. PLEASE READ THE TOP SECTION BEFORE TOUCHING ANY RECEPTION / FRONT-DESK / CAMPUS CODE.**

---

## ⚖️ THE EXECUTIVE DECISION — THE CAMPUS MAP IS REMOVED FROM THE RECEPTION

**Decision:** The **campus map and its self-driving "camera" are REMOVED from the Reception (index.html). Permanently.** This was decided collectively at founder level after the camera's zoom produced unacceptable text shaking on the map.

**The rule that drove it (the founder's words):** *"It's either we have it at quality or not have it at all, and maintain performance."*

- ❌ **Do NOT re-add** the map, the camera, the `cam-hud`, `campus-tour.js`, or any auto-panning/zooming element to the **Reception / index.html**.
- ✅ The map **may live in the operating guide only** — a CCTV-style camera (viewport-masked, rasterized once, no text re-rasterization) is being trialled there right now, and will only ship if it passes the same quality bar.
- 🧠 If you ever rebuild the map for the reception: the camera must move a **viewport** (a masked container), never scale the text layer — continuous scaling of SVG text is the shake, and it is not acceptable at any quality level.

---

## 📋 What was fixed on the OS / System A side this pass (for your awareness)

1. **The full audit now passes 21/21 — "System verified."** Two things were found and fixed:
   - **The audit's Trust Bar check read the wrong field** (`e.trustEvents` instead of `e.trust.events`), so it falsely flagged every penalised student. Fixed and live-proven (a student at score 80 with two recorded penalties now reconciles as PASS).
   - **ENR-0099 was ACTIVE with no approval decision on record** — her approval predated a store merge and never stamped `registration.decision`. Backfilled (APPROVED, timestamped, by Moderator) without touching state, trust, or handoff.
2. **The one-store rule is now enforced in the demo:** ports 8123, 8124 and 8125 all serve the SAME build and the SAME state file. A student can never be "missing" on one port again. This is the exact incident class your Firestore design already prevents in production — the demo now matches it.
3. **Reception / guide layout hardening:** all card grids were switched from `repeat(auto-fit, …)` (which produced ragged last rows like 4,2 or 5,1 on wide screens) to fixed responsive columns — gate steps are always 2,2,2; role cards 3,3 / 2,2,2; the selfie pose grid 5,5 / 2×5.

---

## 🚀 Go-live status — the OS static app is being deployed NOW

- The OS static app (the course — which must survive an apocalypse) is being prepared for a **free always-on host** this session. The course will be reachable from anywhere.
- **Your critical path remains §2.1–§2.6 of the go-live brief:** always-on hosting, Firebase Auth (one session per student, second login revokes the first, `SESSION_REVOKED` logged), the handoff Cloud Function (API-key gate, idempotent, `entitlements[]` MERGE), Firestore + rules, and DNS. The demo is production-shaped; your pieces make it production.

---

*Signed — the founder's office, August 2026. Quality over speed, always. When in doubt: the founder's rule wins — "quality or not at all."*
