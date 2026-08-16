# 🏛️ REALITY FX — LAUNCH DAY PLAYBOOK

*30 September 2026. The doors open. One document, every move, in order.*

*Author: the machine · 17 Aug 2026 · companion to `RFX-LAUNCH-WEEK-CHECKLIST.md`
and the launch email sequence (`REALITY-FX-EMAIL-01/02/03`)*

---

## The night before (D-1, evening)

- [ ] **Site is live** — `deploy-live.sh` ran; the hero countdown reads
      **"1 day"** and the Reserve form is accepting names
- [ ] **Waitlist export**: pull the `waitlist` blob (Netlify dashboard →
      Blobs → waitlist). Segment: everyone on the list gets the Day-of email
      first — they asked to be first, so they are
- [ ] **Email sequence armed** in whatever sender we use: #3 (Day-of) queued
      for 08:00
- [ ] **Reception rota confirmed** — who is on the human line 08:00–20:00
- [ ] **Mailbox sweep**: every demo/enrollment mailbox cleared of test noise
- [ ] **Audit run, ALL GREEN**, screenshot saved
- [ ] All three launch emails + short-form pack on the phone of whoever posts
      (no last-minute file hunting)

## Opening morning (D-Day)

| Time | Move |
|---|---|
| 07:30 | **Reception opens** — staff clock in via the Staff Portal; on-duty pill green |
| 07:45 | **Audit** — one click, ALL GREEN; if not, the playbook stops here until it is |
| 08:00 | **Day-of email fires** (sequence #3): "The doors are open." Waitlist first, then the general list |
| 08:15 | **Social**: launch post goes out — IG + Facebook (caption from `REALITY-FX-LAUNCH-SHORTFORM.html`), Stories script follows at 10:00 |
| 08:30 | **Website check**: hero flipped to the green "The doors are open → Begin registration" state (the date check does it automatically — verify, don't assume) |
| 09:00 | **First enrollment** expected — first paid registration of the day gets the full red-carpet flow: welcome screen, founder quote, guardian path if under 18, approval, handoff |
| 10:00 | **Stories #1** (the countdown → open flip) |
| 12:00 | **Midday pulse**: registration queue cleared, approvals flowing, SRM relationships synced — the machine does the work; staff review the results |
| 15:00 | **Stories #2** (a real first-day moment — a student's first XP, first quiz pass) |
| 17:00 | **First trade sim session** — the challenge arena opens its first live challenge of the day |
| 20:00 | **Reception handover** — second shift clocks in; day one's approvals all synced to the OS |
| 21:00 | **Day-one recap** drafted: students enrolled, chapters started, first certificates earned (all anonymous unless a student opts in — the count stays private) |

## The human line (all day)

- **Sarrah (AI)** handles the instant stuff — the warm hand handles the
  moments that need one
- Every registration gets a **careful decision** (approve/reject with a
  reason). Never approve in a rush: identity checks exist for a reason
- Under-18 enrollments **pause at the guardian step** — no exceptions, no
  "let's just get them in"

## Incident responses (if something goes wrong)

| Symptom | First move |
|---|---|
| Site down / hero 500 | Run `deploy-live.sh` again; check Netlify dashboard for the credit gate |
| Registration link errors | Check the link-error screen — the waitlist capture is built in, so nobody is lost; reissue the link from the Staff Console |
| Email not sending | The Mailbox still holds every message (it is the record); send manually from the Mailbox, then fix the sender |
| OS can't adopt a handoff | Verify the handoff landed in `/os/api/handoffs`; re-sync the bridge from the Staff Console |
| A student reports a wrong link/version | Hard refresh guidance; the OS re-points stale academy links automatically on the stale verdict |
| Anything security-flavoured | PII incident board + access log first, then fix. Never paper over a guard hit |

## The first week after

- **Day 2**: thank-you / "your first steps" email to everyone who enrolled
  day one
- **Day 3**: first **challenge closes** — machine-graded, leaderboard signed
- **Day 7**: the first certificates are earned — announce the first cohort's
  first achievement (anonymously unless they opt in)
- **Week 1 review**: waitlist → enrollment conversion, approval times, audit
  history — the numbers the institution will learn from

---

## The promise, on the day

Every student walking through these doors is the future-traders line made
real: *"That was where it all started."* The machine's job on 30 September is
to make sure the doors open on time, the welcome is warm, the identity rail
holds, and the first lesson teaches. Everything else is already built and
audited — the playbook is just the day's script.
