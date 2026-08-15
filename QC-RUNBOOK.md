# REALITY FX — QUALITY CONTROL RUNBOOK
> The inspector's checklist. Every change lands through this door — the audit
> machine walks the building, then a human (or the founder) walks the questions.
> Keep it open whenever we touch either system.

**Version:** 1.0 · **Date:** 12 August 2026
**Owner:** Zorro (System B) + Lee (System A) — one institution, one bar.

---

## PART 1 — THE MACHINE (run first, it never sleeps)

```bash
perl audit-regression.pl        # from the project root
```

Exit `0` = green, exit `1` = findings — **fix findings before building further.**
It checks, every run:

| # | Check | Catches |
|---|-------|---------|
| 1 | **Tree lockstep** — served tree vs source tree byte-identical | the lineage break that crashed the member panel |
| 2 | **Version stamps** — every System A page: one version, every asset stamped | the "old cached version" gremlin hiding old code in browsers |
| 3 | **Function contracts** — every `db.*` call resolves in db.js | dead calls = runtime crash the day a page loads |
| 4 | **Handoff contract** — all 15 payload fields the OS reads are sent | the demo tour that silently never locked |
| 5 | **OS stamp unity** — one version per OS asset, files exist | mixed `v=11/13/15` loading three lineages at once |
| 6 | **Coupon rail** — website → reception deep-link wired, demo type present | the marketing funnel going cold |
| 7 | **Store snapshot** — shared state backed up before anything mutates it | the "verify, don't regex" insurance policy |

> The snapshot in check 7 is the reason we can *always* undo. It costs a
> file copy. Skip it never.

---

## PART 2 — THE QUESTIONS (the founder's inspection, every milestone)

Each new feature or fix must answer **all seven**, honestly:

### 1. Does the feature work on its own?
- Test it in the browser, not by reading code. Click the real buttons.
- Console clean of *new* errors (404/429 on the dev-only `/api/flags` rail is a known local-server gap — production Netlify has that route).

### 2. Does it work correctly with the other system?
- If it's System A → does the OS still handshake? (`api/handoffs`, `session/heartbeat` → 200)
- If it's System B → does it still consume System A's verification? (identity, student code, trust, demo pass all arrive)
- If it's the website → does the coupon still land in the reception and mint the right access?

### 3. Does adding it break anything that was already working?
- **Re-run `perl audit-regression.pl`.** If a previously green check now fails, that's the regression.
- Re-test the two pages most likely to be touched: the member panel and the dashboard.
- Nothing we ship may take another feature's seat.

### 4. Are the systems still secure?
- Single-session guard: one session per device type, new device = identity challenge.
- Unknown device/location emails go out (branded, with code + 10-min expiry).
- Demo access **must** ride `demoTourEndsAt` — a tour that never locks is a leak.
- The flag queue and fair-play monitors still ingest events.

### 5. Are the processes still reliable as the institution grows?
- The OS must survive offline — the course is the one thing that never goes down.
- Emails still deliver to *real* third-party inboxes (this needs the production sender domain + env vars — see the Lee brief).
- Coupons are one-shot; trials expire on the real clock; the manager's report freezes at expiry.

### 6. Can the architecture handle the additional functionality?
- Asset sizes: nothing added should push page weight up without a reason.
- Data lives where it belongs (course = OS, identity = System A, store = one source of truth).
- No duplicated lineages — if a file exists twice, the trees must be byte-identical or it's a bug.

### 7. Can we detect failures before they become failures for the students?
- This audit, run *before* every deploy.
- The OS heartbeat metrics (slides, assessments, per-lane split) are visible proof the machine reports its own health.
- When a bug IS found: fix it, add it to the next brief, and ask — *which check should have caught this?* — then add that check to Part 1.

---

## PART 3 — CADENCE

| When | What |
|------|------|
| Every code change | Run Part 1 (30 seconds) |
| Every milestone / feature | Run Part 1 + all seven questions in Part 2 |
| Before every deploy | Full Part 1 + Part 2, snapshot confirmed, brief updated for Lee |
| Weekly (growth check) | Full audit + the briefs on the founder's Desktop reviewed end-to-end |

---

*"We don't just want a huge machine. We want a huge machine we can trust."*
Every floor we add gets inspected against the foundation — while fixing is cheap.
