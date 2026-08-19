# FOR-LEE — FINAL SYSTEM POLISH · 13 Aug 2026

> System B's answer to the founder's polish punch-list. Everything below is
> built, verified live in the browser, and covered by the regression audit
> (ALL GREEN, 10/10). Work the list top to bottom — nothing here needs a
> second pair of hands except the deploy.

---

## 1. The Word from the Founder — back on the enrollment form

The welcome screen's founder-quote card was a dead "—": the markup existed but
nothing ever filled it. It now plays the same curated founder voice that greets
members on the dashboard (`db.quoteOfMonth()`), so the human element is part of
enrollment again. Verified end-to-end: a fresh demo pass opens the welcome
screen with the quote rendered.

## 2. Trading Challenge — the market chart now belongs in the arena

- **The TradingView chart auto-loads** the moment the trade view opens — no more
  "Load the chart" button hiding the market.
- **It loads exactly once.** We found the real cause of the old stalls and
  flicker: re-rendering the panel every 5s **detached and reloaded the iframe**
  (Chrome reloads a re-inserted iframe — every tick was a full widget load).
  The trade view is now split into a **chart rail** (created once, never
  re-rendered) and the live panels around it. Verified: one widget request in
  minutes of ticks, zero stalls, orders survive.
- **Honest offline fallback** — if the chart provider is unreachable, the box
  shows a clean note ("the market feed is still live — the chart is a window,
  not the market") with a one-tap retry. Never a dead black box.
- **Place Order layout fixed** — Direction / Stop-loss no longer poke out of the
  box: the grid is min-width-0, controls fill their cells, and the risk line
  spans the full width in the dash number style.

## 3. Challenge rewards — the machine pays what it signs

A PASS is now a signed result with a **machine-signed reward**: a badge
("Risk Officer", "Consistency master", "FTMO Challenge finisher",
"Institutional-grade pass") and RFX credit paid to the student's wallet
(R1,500–R5,000). The reward renders on the results screen and a rewards strip
sits on the challenge hub. Same philosophy as the rest: no staff hand, no
negotiation — the machine's verdict carries the payment.

## 4. Hall of Fame — premium hover + a living 2026 wall

- **The collision is gone.** The honour reveal no longer pushes the box
  underneath — it now **floats above the wall** as a glass popover (gold
  hairline, soft shadow, caret, blur) with smooth scale/fade motion. Nothing
  jumps; nothing collides.
- **The 2026 wall is seeded** with realistic machine-plausible performers
  (5 Standard, 3 Challenging, 1 Elite leader — the summit still feels hard to
  reach), replacing a stale cache via a versioned seed. Real academy records
  still replace the seed the moment they arrive.
- The reveal is hidden from screen readers until hovered (visibility gating).

## 5. Trial expiry alerts — the amber tier added

The staff console already turned red the moment a demo trial lapsed. It now
**warns a full day early**: an amber banner when a trial closes tomorrow, so the
admin reviews and signs before the member is ever locked out waiting.

## 6. Incidents on the Machine Audit page

The founder's inspection room now carries the behavioural board too: **PII
incidents — blocked sensitive-data attempts** sits under the audit verdict,
refreshing with it. Every refused chat message (who, role, room, reason,
sample) is on the same wall as the structural checks.

## 7. OS Guide — the full ecosystem is documented

The operating guide grew from 12 to **17 cards**: Live Rooms, Trading Challenge,
Break Room, Study Hall and The Story joined, and the Getting-help / data cards
were refreshed to match the current system.

## 8. UI consistency sweep — one number style everywhere

Numbers across the OS now speak one language: **white, Inter, tabular** — the
dash-ring style. Applied to the certification teaser's chapter count, the
Journey course-scope totals (13 · 617 · 256 · ~21h), the Break Room's timer, the
sim risk line, and the admin console's funnel stats. A `.num` design token
documents the rule so future features inherit it instead of inventing a new
gold figure.

---

## What this means for you (Lee)

- **Stamps:** OS `v=42`, System A `20260812-72` — both trees identical, single
  stamp per page (the audit enforces it).
- **Deploy:** the same zip/publish flow as before. Nothing new to configure —
  the chart, rewards, incidents and guide are all client-side or existing rails.
- **One honest note:** the TradingView widget needs an internet path to
  `s.tradingview.com`. In a fully sandboxed preview it shows the offline
  fallback by design; on the live site with normal connectivity it renders the
  chart. If it ever fails for a student, the fallback keeps the arena usable —
  that is the outage-mirror philosophy applied to the chart.

**Regression audit: ALL GREEN — 10/10**, including the new sim and incident
checks. The machine is structurally sound.

---

## Addendum — left-panel nav rebuild + the Forge Standard (13 Aug, evening)

**The sidebar is now a building directory.** Four labelled sections — Identity
& Account · The Course · The Rooms · The OS — each ending in a fading gold
hairline, with real breathing room so no item ever kisses its neighbour.
Per the founder: **Reception then My RFX Account, in that order**, so the
Academy link sits exactly between Reception and the Dashboard. My Profile,
Reception and My RFX Account now live together in one cluster.

**A latent bug the rebuild flushed out:** the nav router was marking every item
*without* a `data-route` (the two Academy links, Trade Journal) as ACTIVE on
the dashboard — three gold highlights at once. Fixed: only real routes light
up. The mobile drawer (burger ⇄ ✕ ⇄ backdrop ⇄ destination pick) verified
closing cleanly.

**The Forge Standard is now codified and enforced.** `CHAPTER-FORGE-STANDARD.md`
(Teach → Demonstrate → Challenge → Assess → Explain → Verify) is the
institution's law for every chapter. The chapter verifier was rebuilt — the
old one silently validated a merged blob since the chapter blocks moved from
2-space to 4-space indentation (a REAL finding: the checker had been
meaningless for chapters 1-11). The new verifier derives chapter spans from
the actual brace structure (string-aware), validates **per lane**
(standard/challenging/elite: declared slides == native slots, quizSlides ==
quiz entries, and every quiz position must land on a null slot), checks every
quiz entry carries an explain, and checks slide anatomy.

**And it caught a live content bug:** Chapter 8's Challenging deck declared
34 slides with 12 quizzes at positions 23-34 — but its native array had only
22 slides and zero quiz slots. The player uses native.length, so the chapter
ended at slide 22 and **all 12 quizzes were silently unreachable**. Fixed by
appending the 12 null quiz slots (deck now genuinely 34 slides, quizzes at
23-34). The verifier now guards this exact failure — quiz positions must sit
on nulls — and the check is wired into the audit as section 11.

**What this means for you (Lee):** OS `v=45`, System A untouched. Audit now
11 sections, **ALL GREEN**. Nothing new to deploy for this — data.js, os.js
and the CSS ride the same publish flow.

---

## 7. Addendum — 13 Aug, 11:00 local — Challenge P/L, sim performance, System A polish

**Trading Challenge — P/L amount boxes.** Under the account stats, next to the
% drawdown, the trader now sees the **actual money**: Unrealized P/L and
Total P/L in rand amounts (plus Balance, Equity, Open positions, Violations).
Verified live: a placed order moved the amounts on every tick
(+/-$ with the feed), and closing booked the realized P/L into the history
and the Total P/L. The open-position list now updates **in place** on ticks
instead of rebuilding — verified with a 600-position stress test: 6.6ms per
tick for 600 rows vs the old full rebuild's ~55ms-plus-iframe-reload (the
source of the freezes you saw). No chart reload, no stalls.

**Challenge reward philosophy embedded.** The machine-signed reward message
now carries the institution's intent: *"What you accomplished under pressure
is proof this environment works. This credit is our appreciation — and a seed
for your first real trading account."* Badges + R1,500–R5,000 RFX credit as
before.

**System A registration polish.** The quote font is now Playfair Display
(the OS cursive standard) instead of the old Cormorant — one cursive voice
across both systems. The student-safety line now uses the gold shield SVG
(RFX style), not an emoji. Form field spacing re-verified (uniform 6px/16px
tokens). Government ID field confirmed hidden by default — Reality FX does
not collect it, ever.

**One button standard.** Every Resume/Begin/action button on chapter cards
now sits bottom-right of its card (auto width, never a full-width slab),
matching the quick-resume strip — verified across all 13 chapter cards.

**⚠ A real bug found and fixed — the device rail was crashing.** The
"Is this really you?" challenge handler was silently broken: the
Trading Challenge leaderboard store redefined `load_challenges`/
`save_challenges` (later in the file), clobbering the device-trust versions —
so requesting a device code crashed the handler with "Not an ARRAY
reference" and students would get "Try again" with no code. Renamed the
leaderboard pair to `load_board`/`save_board`. **The audit's section 8 now
live-probes the rail** (POSTs a real challenge, requires a demoCode back) so
a crashed handler can never pass a presence-only check again — this is
exactly the class of failure it now catches.

**What this means for you (Lee):** OS `v=46` (sim.js + os.css), System A on
`20260813-01` (system.css + register.html), both trees in lockstep. Audit
**ALL GREEN — 11 sections, incl. the new live device probe**. Same publish
flow as always; nothing else required on your end.

---

## 8. Addendum — 13 Aug, 12:00 local — One-button standard, icons, audit depth, ch9 forge

**One button standard extended to the challenge arena.** The challenge cards
(FTMO / Risk / Consistency / Prop) now anchor their Resume/Enter button to the
card's bottom edge — every button in a row sits on the same line no matter how
much content the card carries (verified live: all four at identical offsets).
The chapter cards already followed this rule; now the whole OS does.

**Left-panel icons fixed.** Trading Challenge was rendering a blank placeholder
— the nav referenced an icon (`trendDown`) that existed in the OS's internal
set but not the shared icon library, so nothing painted. Added `trendDown` to
`icons.js` (plus `institution` for the Prop-Style challenge card, which was
silently falling back to a trophy). Every nav item and challenge card now
paints its own stroke icon.

**Machine Audit access — answer: founder only, and now enforced twice.** The
nav door was already hidden from non-founders, but the ROUTE itself was not
gated — a student who typed `#/audit` could open the building's inspection
report (including the PII incident board). The route now checks `isFounder()`
and shows a polite founder-only door to anyone else, same as the Live Studio
gate. The building's inspection report is not for the classroom.

**Audit depth: every rail now live-probed, plus a sim perf budget.** Section 8
grew from presence checks to LIVE probes — handoff (handshake accepted),
session (claim → heartbeat → release, self-cleaning), leaderboard (boards
served), mail (production contract present), on top of the device rail probe
added this morning. A crashed handler can no longer pass by existing. Section
10 gained a **performance budget check**: the sim's architecture (in-place row
updates, chart rail preserved, single tick driver) is now structurally
enforced — the measured 6.6ms/tick at 600 positions can't regress silently.

**Chapter 9 forged — Market Orders · Challenging.** The new deck follows the
forge standard end to end: intro brief + 19 Depth slides + pause + close (the
house anatomy), 12 assessments with full multi-paragraph explains ending in
"The deeper layer". Content covers slippage physics, the spread tax, gap risk,
OCO brackets, trailing stops, liquidity depth, fade-vs-chase, the execution
journal, the kill switch and the precision standard — the Challenging lane's
depth-above-Standard promise. Verified: verifier ALL GREEN (slides 34 =
native slots, quizSlides 23-34 all on nulls, 12 quiz entries, every explain
present), Journey shows "34 slides · 12 assessment Qs", and the deck loads in
the live OS.

**What this means for you (Lee):** OS `v=47` (icons.js, os.js, os.css,
data.js — the ch9 deck rides in data.js), System A unchanged. Audit
**ALL GREEN — 11 sections** (device/handoff/session/leaderboard live probes +
sim perf budget + Forge Standard). Same one-command publish; nothing else
required on your end.

---

## 9. Addendum — 13 Aug, 12:30 local — ch10 forged, demo-code clarification

**Chapter 10 forged — Technical Indicators · Challenging.** Same house
anatomy as ch9: intro brief + 19 Depth slides + pause + close, 12
assessments with full explains ending in "The deeper layer". Content covers
the built-in lag of every indicator, the average-as-a-system, the moving
average stack, RSI failure swings and the 40-50 recharge zone, divergence as
warning-not-signal, the squeeze engine, bands in trends vs ranges, the
histogram's whisper, the zero-line trade, true confluence, the curve-fit
trap, the Christmas-tree chart, indicators vs news, structure-first
checklists, timeframe alignment, the indicator journal, the silence skill and
the confirmation identity. Verifier ALL GREEN; Journey shows "34 slides · 12
assessment Qs"; deck loads live.

**Demo code — answer (for your support inbox).** The "demo code" a student
sees on screen only exists while the mail rail is unconfigured — the local
build rides the code back in the response so the flow stays testable. In
production (`RESEND_API_KEY` set), the SAME code goes only to the student's
registered email — `demoCode` comes back empty and the screen never shows it.
Students worldwide signing in from new devices get the 6-digit code in their
inbox; nothing else changes. One config line flips the whole system from demo
to live email.

**Course totals (current, Challenging lane, 10/13 decks forged):** 573
slides · 222 assessment questions · ≈19h 35m, growing as chapters 11-13 get
their decks. Standard remains the full 774-slide education; Elite (3/13
forged) is the densest per slide. The scope card is honest: Challenging is
"fewer, denser slides" by design — depth in the content, not the count.

**What this means for you (Lee):** OS `v=48` (data.js — the ch10 deck
rides in data.js), System A unchanged. Audit ALL GREEN — 11 sections.
Same one-command publish.

## 10. Addendum — 13 Aug, 13:00 local — the full forge + the Trade Journal

**The forge is finished.** All 13 chapters now carry Standard +
Challenging + Elite lanes. Challenging decks were forged for ch9–13
(the remaining five) and Elite decks for ch4–13 (ch1–3 already had
theirs) — every lane verified against the Forge Standard: per-lane
slide/quiz positions on nulls, every assessment with its deeper-layer
explanation, house anatomy intact. Quiz counts: Challenging = 12 per
chapter, Elite = 10 five-option per chapter. The Journey map, scope
card and heartbeat totals now read the real inventory.

**The Trade Journal is live — the last room on the roadmap.**
`js/journal.js` (new, wired as its own route `#/journal`, nav item,
dashboard chip and Operating Guide card all live). It is the trader's
mirror: a ticket form (pair, direction, entry/exit/stop, lot size,
setup, notes) that computes pips, P/L and the R multiple as you type;
a stats rail (trades, win rate, net P/L, profit factor, total pips,
avg R — six cards, always balanced 3+3 or 2+2+2, white tabular
numbers per the design system); and a filterable entry list
(All/Wins/Losses/Breakeven) with in-place delete. Local-only by
design — the journal lives on the student's device and never leaves
it, so it needs no server rail and no PII exposure. Standard-lot
math is disclosed in the footer (\$10/pip/lot FX, \$10 per 0.10 gold).

**What this means for you (Lee):** OS `v=50` — one new file
(`js/journal.js`), index.html now loads it, and the CSS gained the
journal block. Nothing on System A changed. Audit ALL GREEN — 11
sections. Same one-command publish.

## 11. Addendum — 13 Aug, 13:30 local — journal stats rail + audit depth

The journal's stats rail is now **six cards** (added Total pips next to
trades, win rate, net P/L, profit factor, avg R) so the grid balances at
every width — 2,2,2 on narrow screens, 3,3 on desktop — never the
lopsided 2,2,1. The machine now enforces it: the regression audit gained
**section 12 (Trade Journal)** with nine checks — module present, wired
in the shell, nav route, router call, six-stat rail with exactly the
right names, the auto-fit grid that guarantees the balance, and the
local-only guarantee (zero server rails, zero PII fields, the
local-storage key and the "never leaves this device" disclosure). The
founder's Machine Audit page reports **12 / 12 ALL GREEN** live.

**What this means for you (Lee):** no deploy change beyond the existing
one-command publish — the audit lives in `audit-regression.pl`, which
already gates every deploy, so a future editor who breaks the journal's
balance or adds a server rail gets stopped at the gate. OS `v=50`,
System A unchanged.

— Zorro (System B), 13 August 2026

## 12. Addendum — 13 Aug, 14:00 local — Nearpod purge + the three master documents

**Nearpod is fully gone.** Swept both systems: the one live user-facing
reference left (a "Virtual platform access (Nearpod)" line in
`programs.html`) is replaced, the historical code comments in the OS CSS
and JS are cleaned, the raw Nearpod slide exports in
`.freebuff/course-extract/` are deleted, and the deploy trees regenerate
clean. The only remaining mentions are in two org history docs (the
blueprint and registration notes) — records of the migration itself, not
slide content. The OS boots clean, and the regression audit is
**ALL GREEN** after the sweep.

**The founder's master documentation system is delivered.** Three
documents, three audiences, all on the Desktop:

1. `REALITY-FX-MASTER-GUIDE.md` — the ecosystem handbook (Parts I–X):
   organization → public site → student journey → the OS room by room →
   the trading environment → educational infrastructure → challenges &
   recognition → administration → technical architecture → the bigger
   picture. Written from a live architecture map of the real code, with
   honest limitations (e.g. the 600-position sim ceiling) documented.
2. `REALITY-FX-INVESTOR-PRESENTATION.md` — investor/partner deck:
   executive overview, market opportunity, business model, scenario
   projections (marked honestly where figures await founder data),
   technology moat, **candid governance section** (education, not a
   regulated financial service — no invented regulatory claims),
   sponsorship models, and growth strategy 1/3/5 years.
3. `REALITY-FX-UNIVERSITY-STUDENT-EXPERIENCE.md` — campus-tour script:
   the story, the ecosystem in plain language, the hard questions with
   honest answers, a live Q&A cheat-sheet, and what to tell a student
   who wants to join.

**What this means for you (Lee):** nothing ships that affects System A
or the OS — this is documentation and cleanup. The three files live at
the project root and on the Desktop. If the founder asks you to extend
any of them, the Master Guide is the canonical map: every room, rail,
and system it names is real code, so keep it in sync when features
change.

— Zorro (System B), 13 August 2026

## 13. Addendum — 13 Aug, 14:20 local — tier composition, live email pipeline, cam/mic, journal perf budget

**Challenging/Elite are no longer thin — they're composed, not replaced.**
The root cause of the "underwhelming" feel was architectural: the tier decks
*replaced* the standard deck, so a Challenging student read ~30-38 slides
while Standard got 38-77. Fixed in `os.js` — `composeTier()` now stacks the
lanes: **Challenging = Standard + the drill field (847 slides)**, **Elite =
Standard + Challenging + the full depth (1,065 slides)**, Standard stays
774. The scope card, heartbeat totals and the dashboard duration split all
count the composed decks, so every number a student sees matches what they
already read. All 13 chapters × both lanes verified — every composed quiz
position lands on a null slot, the player flows standard → drills in
order, and the Journey cards show the real lengths. OS `v=52`.

**Email — the live-sender pipeline is built, deploy is credit-blocked.**
Netlify's env-var create API needs a paid plan (account-scoped POST → 403,
site-scoped has no create endpoint), so the mail rail now supports
deploy-baked secrets: `deploy-live.sh` generates `rfx-env.js` from the
local `.freebuff/tools/secrets.env` (never committed, never uploaded as a
static file), `deploy-flow.pl` zips it beside `osapi.js`, and `osapi.js`
falls back to it via `rfxEnv()` — `process.env` always wins. The bake was
verified end to end. **Two honest blockers remain:** (1) the Netlify
credit gate is CLOSED ("Account credit usage exceeded — deploys blocked
until credits are added"; both sites are on the one account, so it's
account-wide) — the moment credits land, `bash deploy-live.sh` pushes
everything in one command; a complete drop-ready `RFX-OS-DEPLOY-READY.zip`
(v=52, functions + baked secrets included) sits at the repo root as the
fallback. (2) Resend has **zero verified domains** — even with the key
live, `onboarding@resend.dev` only delivers to the account owner's own
inbox. Real worldwide delivery needs one verified domain (eu.org is free,
~1-3 days). The demo-code fallback keeps development unblocked.

**Cam/mic verified live.** `getUserMedia` was granted real video AND audio
tracks in the preview (secure context), and the studio's `requestCam`/
`requestMic` buttons are correctly wired to the same path with proper
permission/not-found error toasts. If a device doesn't open, it's the
browser permission or an insecure origin — not the code.

**Journal perf budget is now machine-enforced.** The regression audit
gained section 13: no polling/network loops (the one allowed timer is the
toast dismiss), in-place refresh path, single batched list write, storage
writes exactly on the two user actions (log + delete), and event-driven
live math. First run the harness caught its own loose regexes (the toast
timer and the `save()` definition counted as violations) — fixed, then
ALL GREEN, 13 sections live on the founder's audit page.

**What this means for you (Lee):** the code is ready and staged; only the
Netlify credit gate stands between this and production. When it opens:
`bash deploy-live.sh`. If the founder adds site env vars in the Netlify UI
later, they override the baked values automatically.

— Zorro (System B), 13 August 2026

## 14. Addendum — 13 Aug, 14:10 local — journal hover glow + PDFs + architecture map

**Trade Journal — premium hover glow.** Every surface in the journal now
answers a hover with a soft gold bloom: the six stat cards lift 2px with a
gold ring + shadow, journal rows sweep 3px right with a gold-gradient
backdrop and inner glow, filter chips bloom, form fields warm up, and the
empty state catches a glow of its own. All transitions are slow and smooth
(.28-.35s) — no jumps, no collisions, matching the Hall of Fame standard.
Verified live (rules loaded at `v=53`, every selector matches; audit stays
ALL GREEN). Journal store left in a clean first-visit state.

**The three master documents now ship as RFX-branded PDFs.** Built with a
small markdown→HTML pipeline (`.freebuff/tools/md2html.pl` + a local static
server + headless Chrome): gold-crowned masthead, the house tagline, styled
tables and the full Part IX architecture map. On the Desktop:
`RFX-MASTER-GUIDE.pdf` (13 pp), `RFX-INVESTOR.pdf` (9 pp),
`RFX-UNIVERSITY.pdf` (7 pp). The HTML sources stay in `.freebuff/tools/`
for re-printing after any doc edit (`perl .freebuff/tools/md2html.pl ...`).

**Master Guide gained the architecture map.** Part IX now opens with a
full-system ASCII diagram: public website → System A (verification hub) →
handshake rail → System B (the OS campus) → the three leaving rails (audit
self-report, mail delivery, DLP incident board). It is the canonical visual
of the organism — keep it in sync when the machine changes.

— Zorro (System B), 13 August 2026

## 15. Addendum — 13 Aug, 14:30 local — PDF refresh (v1.1) + full audit green

The three PDFs were refreshed and re-dropped into the founder's files in the
**true black-and-gold OS theme** (the first run was light ivory — the founder
caught it). The Master Guide metadata now reads **v1.1 with 13 audit
sections** (it had gone stale at 12 after the journal perf-budget section
landed); the same stale count was fixed in the Machine Audit description and
the audit-tooling bullet. Verified on disk: Master Guide 13 pp,
Investor 9 pp, University 7 pp. A full regression audit was then run end to
end: **ALL GREEN — 13 sections, 62 checks**, including live rail probes
(handoff, session, leaderboard, mail contract), the security layer, the Forge
Standard (all 13 chapters), the Trade Journal and its perf budget.

— Zorro (System B), 13 August 2026

## 16. Addendum — 13 Aug, 14:40 local — Chrome incident resolved

The PDF tooling left orphaned elevated Chrome background processes that
hijacked normal Chrome launches ("Failed to create data directory:"
.freebuff/tools/chrome-profile"). Fixed with an elevated taskkill; 0 Chrome
processes remain, no leftover profile dirs, PDFs unaffected. The safe recipe
is documented in .freebuff/tools/PDF-PRINTING-SAFE-RECIPE.md — never a
relative --user-data-dir, never a blanket chrome kill, prefer no profile
flag at all.

— Zorro (System B), 13 August 2026

## 17. Addendum — 13 Aug, 15:00 local — challenge hub 2x2 + milestone framing

The Trading Challenge hub grid was auto-fill (3,1 / 2,1,1 stagger at
different widths) — the founder wanted exactly 2,2, neat, every card
filled. `.sim-cards` is now a fixed 2-column grid (1 column under 720px):
RFX FTMO + Risk Management pair on row one (both 5 rules), Consistency +
Prop-Style pair on row two (both 4 rules), so rows align perfectly. The
Academy-grows privacy line on the dashboard was restructured from a
closed-sounding 'numbers kept private until 1,000' to milestone framing:
'the exact count stays private until we reach 1,000 students, then the
whole class celebrates the milestone together, out loud.' Verified live
(`v=54`): grid reports columns=2, rows [2,2]; new message renders on the
dashboard. Audit ALL GREEN.

## 18. Addendum — 14 Aug, 03:00 local — the layout punch-list round (`v=55`)

Founder's punch-list from the screenshots — every item landed, verified live:

1. **Student count — fully anonymous.** The "exact count stays private until
   1,000" milestone text is removed entirely from the system status card.
   No numbers, no tease — just silence on the count.
2. **Dashboard stats — proper 2,2,2.** Added a sixth card ("Course progress",
   live % of the full course) so the standing cards now sit 2 per row × 3 rows:
   Chapters completed · Slides explored · Assessments passed · Discipline
   streak · Distinction streak · Course progress. Verified: 6 cards, 2 cols.
3. **Trade Journal stats — 2,2,2.** The six-stat rail is now a fixed two-column
   grid (was auto-fit, which rendered 5+1). Audit rule updated to match: the
   rail must stay `repeat(2, minmax(0,1fr))` — the harness now FAILS if anyone
   re-introduces auto-fit.
4. **Live Rooms — 2,2.** Grid locked to two balanced columns (was auto-fill
   leaving a dangling row); Studio button moved out of the floating corner
   into the page head — title left, button right.
5. **Performance — equal bars, no kissing.** Difficulty chips get a fixed
   width (112px) so the Brutal label no longer shortens its track — all 13
   grade tracks are identical length (verified: single width across rows).
   The Areas to sharpen / Your strengths cards and the Your Path Edge/Watch
   cards now carry proper top/bottom margins — nothing kisses the panel
   above or the Insight gems below.
6. **Trading Challenge — empty zone under the chart is gone.** Open positions
   + Trade history moved out of the cramped side column into a full-width
   two-column row below the desk (matches the layout the founder liked);
   chart height raised 430→470px to balance the desk. Order-form overflow
   from the earlier report was already fixed (box-sizing/minmax).
7. **PDFs — no more cut-off text.** Root cause found: the print CSS pinned a
   hard 800px page width, so lines and table cells past the printable edge
   were silently clipped. Now `@page` (A4 + margins) defines the canvas and
   content flows inside it; long code wraps instead of clipping. All three
   PDFs re-printed and replaced on the Desktop (Master Guide 12, Investor 8,
   University 6 pages — denser, complete lines).
8. **Glow extended across the OS.** The premium gold hover bloom now covers
   challenge cards, dashboard/performance stat cards, lab cards, live room
   cards, calendar cards and the style-engagement card — same slow-warm
   standard as the journal and Hall of Fame.
9. **Auto-fill sweep.** Fixed grids where a dangling row was possible: sim
   prices (4-across), machine assessment rows (4-across → 2×2 on phones),
   live grid (2×2), studio mine (2×2), journal rail (2×2), mentor calendar
   (auto-fit), dashboard stats (2×2).
10. **Deploy fallback made whole.** Found that the old drop-ready zip carried
    only 12 core files — the 741 slide images were missing (the OS loads them
    from `assets/slides/...`, so a drop would have shipped a visualess
    course). Rebuilt `RFX-OS-DEPLOY-READY.zip` complete: 756 entries, all
    assets, v=55, functions + baked mail secrets, forward-slash entry names.

Audit: ALL GREEN (13 sections) at `v=55`. The audit's own journal-rail rule
was updated to the new fixed-2-column standard — it caught the old rule and
forced the fix, which is the machine doing its job.

## 19. Addendum — 14 Aug, 05:20 local — Journey scope redesign to the founder's benchmark (`v=57`)

The Course Scope card (Journey page) was rebuilt to the reference concept:
spacious → organized → precise → premium → subtle. **No lane numbers, labels
or descriptions changed** — same honest live totals (774/337/≈22h56m, 847/150/
≈29h11m, 1065/130/≈39h), new presentation around them.

- **Header** — eyebrow + title + subtitle ("never staged." in gold), with a
  new **Your lane pill** top-right (shield icon, lane name).
- **Metric cards** — four cards, each with an icon in a gold circle, large
  value, uppercase sub-label and a description line; generous 4-across grid
  with real padding (2×2 on tablets, 1-up on phones).
- **Split banner** — reading vs answering segments in one bordered strip
  (icons, gold totals).
- **Pacing banner** — clock + "finish around {date}" in gold with the
  "clock is yours" sub-line beneath.
- **Lane rows** — aligned columns (Slides / Assessment questions / Est.
  study time / Chapters) with a lane icon box + name + description; 14px
  separation between rows.
- **Only the student's lane is highlighted** — the Operational Excellence
  treatment from the website's meter boxes: a **thin gold arc travelling the
  border** (same conic-gradient language, slowed to 8s and dimmed so it reads
  elegant, never neon) plus a restrained 1px gold border and a whisper of
  glow. Challenging and Elite stay visible in their own green/orange accents,
  calm and secondary.
- **Responsive** — full 6-column row on wide screens; at ≤1180px the
  description drops to its own line; at ≤900px the row stacks with metrics
  2×2; at ≤720px everything goes single column. Verified live with zero text
  overlap at every tier.

`RFX-OS-DEPLOY-READY.zip` refreshed to `v=57` (756 entries, all 741 slide
assets, functions + baked secrets). Audit ALL GREEN (13 sections).

## 20. Addendum — 14 Aug, 05:40 local — clean dashboard + heartbeat redesign (`v=58`)

Two asks, both verified live:

1. **Academy · FAQ & Fair Usage left the dashboard.** The full block (7 FAQ
   items + the Fair Usage policy) moved into the **Operating Guide**, under a
   "The fine print" divider — the dash now carries only what a student needs
   promptly. The block itself is unchanged (same questions, same rules, same
   accordions). Founder's recommendation honoured: the Guide is the OS's
   knowledge hub, so policy lives where students look for "how things work";
   System A stays the identity/registration front door, not a policy shelf.
2. **System status card redesigned to the founder's heartbeat concept**
   (screenshot-matched): five rows, each with an icon in a gold-bordered
   rounded square (book / shield / clock / robot / link), the title + detail
   stacked in the middle, and a green outlined status pill on the right —
   ALWAYS ON · ARMED · 3/3 ARMED · ALWAYS ON · LIVE. The monitoring pulse is
   now white "MONITORING" with a bright green dot, and the academy-link row
   still flips live (Live / Stale copy / Down) with the reassurance banner
   beneath it. Rows collapse gracefully on phones (icon + text, pill below).

`RFX-OS-DEPLOY-READY.zip` refreshed to `v=58` (756 entries, all 741 slide
assets, functions + baked secrets). Audit ALL GREEN (13 sections).

## 21. Addendum — 14 Aug 2026, 22:50 local — achievement bridge wired + heartbeat re-confirmed (`v=59`)

**Achievement bridge (your §6b) — now live on the OS side.** System A doesn't
grade; the OS owns averages, so the OS now fires the merch-reward event
itself. The moment a VERIFIED student's course average crosses the 80%
threshold, `maybeSendAchievement()` records one entry keyed by
`ACH-2026-S1-<studentId>` (idempotent — a retry can never double-claim) and:

- Production: POSTs `{ studentId, average, reference, source }` to System A's
  `/api/achievement` — the endpoint lives in one constant
  (`ACHIEVEMENT_ENDPOINT` in `os.js`); flip it when the Cloud Function lands.
- Demo: no HTTP rail exists on System A's side yet, so the moment is recorded
  locally and celebrated with the founder's tone ("your free tee + hoody is
  waiting at the front desk") — System A's own staff button simulates the
  claim, so nothing is double-minted.
- The event fires on quiz completion (`finishChapter`), local students never
  trigger it (the reward belongs to a registered identity), and the record
  survives refreshes so the moment is one-time, ever.

**Heartbeat re-confirmed against the founder's screenshot.** The "System
status · Academy heartbeat" card is the finished standard — five rows with
icons in gold-bordered squares (book/shield/clock/robot/link), stacked
title+detail, green outlined pills (ALWAYS ON · ARMED · 3/3 ARMED · ALWAYS
ON · LIVE), white MONITORING pulse with the bright green dot, and the
academy-link row flipping live (Live / Stale / Down) — verified live at v=59.

**State of the union — the OS already carries the contract:** the Machinery
card (gold rings, honest headroom, no counts), Founder's Day + rotating
quotes (1 Nov, anonymous), the ghost-town rule (zero student counts on any
student surface), the Operating Guide, watermark + print blackout + trusted
printing, the Trust Bar from the synced score, the demo-tour expiry
enforcement, the founder flag — all standing.

`RFX-OS-DEPLOY-READY.zip` refreshed to `v=59` (752 entries, all 741 slide
assets, functions + `_redirects`). Audit ALL GREEN (13 sections).

## 22. Addendum — 14 Aug 2026, 23:45 local — THE GATE WIRED on the OS + Founder's Day SVG parity (`v=60`)

**The gatekeeper contract is now live on the OS side (your §9.61–9.63 + the
`RFX-OS-GATE-FUNCTION-FOR-LEE.md` snippet).** System A holds ALL the power of
who gets in; the OS never decides — it only follows. Three layers landed:

1. **Frontend — every session claim asks the gate first.** `sessClaim()` now
   calls System A's `/api/gate?email=…` before touching the session rail:
   locked → the OS refuses with a branded lock card — live countdown in
   tabular figures + a gold **"Forgot password? Recover now"** button straight
   to the member portal (your recovery path). The gate origin is cached after
   the first answer, so the 8s heartbeat probe is one quiet call, never a
   sweep. Demo tolerance: an unreachable academy falls back to the local read
   (your own §9.62 "demo never breaks" rule) — production fails closed per
   the doc.
2. **Backend (osapi.js) — fail-closed `askTheGate`.** The production OS
   function now refuses to mint a session without System A's say-so:
   `SYSTEM_A_GATE_URL` env var (or baked rfx-env fallback), 4s timeout,
   unconfigured OR unreachable → `GATE_DENIED` (logged to a `security`
   gateEvents store) and no session; allowed → `GATE_ALLOWED` logged. The
   exact contract from the snippet: gate first, always, no OS-side
   authorization, never fails open.
3. **Heartbeat gate row — visible, probed-live.** The "System status ·
   Academy heartbeat" card grew a sixth row: **"The gate — System A holds
   the door"**, probing the real endpoint (throttled ~8s, mirroring your
   §9.63): *Open · 319 ms — identity cleared* / *Locked · X ms — Forgot
   password? to recover* / *Unreachable — local read stands in*. Verified
   live against your 8125 gate: **"Open · 319 ms"** with a zero-error
   console (the probe now skips the legacy 8123/8124 forks that 404, so the
   dev console stays clean).
4. **Founder's Day parity (your §9.58/9.57).** Every ⚜ emoji mark on the OS
   (Founder's Day banner, Machinery footer, Hall of Fame footer, guide
   footer) is now the inline gold crown SVG — same mark as System A, no raw
   emoji anywhere.

**Password parity (your §9.58):** the OS demo deliberately runs NO password
world of its own — verified identities sign in via System A's flow, and the
handoff carries `email` + `passwordSet` for production, where both systems
share ONE Firebase Auth project. Noted, not duplicated.

`RFX-OS-DEPLOY-READY.zip` refreshed to `v=60` (752 entries, all 741 slide
assets, functions + `_redirects`). Audit ALL GREEN (13 sections), console
clean.

## §23 — Challenging & Elite depth push, wave one (ch1–4) · v=61

The founder called it: Challenging/Elite felt underwhelming — thinner than
they should be for a lane that must feel earned. The forge measured the gap
(`lane-depth-report.pl` — a new reusable tool in `.freebuff/tools/`):
**every Elite lane sat at 30 slides / 10 questions, and Challenging averaged
~11.5 questions vs Standard's ~26**. Wave one fixed the four opening
chapters — the ones every student meets first:

| Chapter | Challenging | Elite |
|---|---|---|
| 1 · The Forex Market | 38 slides / **18** Qs (was 10) | 38 / **18** (was 10) |
| 2 · Fx Terminology & Concepts | 38 / **18** | 38 / **18** |
| 3 · Fundamental Analysis | 39 / **18** | 38 / **18** |
| 4 · Candlesticks | 44 / **18** (was 12) | 38 / **18** |

Each +8 set is written in the lane's own voice — Challenging drills with
4-option applied questions, Elite 5-option institutional-layer questions
with the "deeper layer" explanations — and every one follows the forge
contract: `slides`/`quizSlides`/null slots/quiz count all re-synced, pause
texts updated, verified by `check-chapters.pl` (ALL 13 CHAPTERS VERIFIED)
and the depth report (zero thin lanes). Live-verified at v=61: a full
Challenging chapter plays start-to-finish (64 composed slides, checkpoints,
chapter-complete card, reflection, score reveal) with a zero-error console.

Course-wide totals now: **Standard 774/337 · Challenging 877/180 · Elite
1,097/162** — the Journey scope card, dashboard heartbeat and pacing
banners all recompute these live; no hardcoded counts anywhere.

`RFX-OS-DEPLOY-READY.zip` refreshed to `v=61` (772 entries, all 741 slide
assets, functions + `_redirects`). Audit ALL GREEN (13 sections), console
clean.

**Roadmap (next waves):** ch5–13 Challenging (37/34/34/34/34/34/34/34/34
slides, all 12 Qs) and ch5–13 Elite (30/30/30/30/30/30/30/30/30, all 10 Qs)
are the remaining thin lanes — same +8-per-lane treatment, chapter by
chapter. The founder's standard is explicit: teach → demonstrate →
challenge → assess → explain → verify, every time.

## §24 — Gate lock-test (live) + heartbeat pill uniformity · v=62

**The lock-test — the gate refused entry, on purpose, live.** System A's
live demo gate answers `locked:false` for every identity, so a real lockout
couldn't be exercised against it. Built a throwaway stub gate
(`.freebuff/tools/gate-lock-test-server.pl`, port 8126, never touches
System A's fork) answering `locked:true` + `minutesLeft` + `lockedUntil`,
pointed the OS's saved academy base at it, and reloaded the preview. The
OS honoured the contract exactly: **no session was issued** — the
heartbeat gate pill flipped to red `LOCKED · 2 MIN` and the lock card rose
with the live countdown (`Lock lifts in 1:19 → 1:06`, ticking), the
recovery CTA pointing at the member portal (`Forgot password? Recover
now`). Restored the real base (8123) and the OS returned to green `OPEN ·
394 MS` — nothing leaked, nothing was permanently changed, and the stub
was killed after the test. Also exercised incidentally: the single-session
guard revoked the preview session across reloads (device re-auth modal)
— the `SESSION_REVOKE` rail is visibly alive.

**Heartbeat pills — one size, one voice.** The five status pills (plus the
gate) previously shrink-wrapped to their text: `LIVE` was tiny next to
`3/3 ARMED`. All six now render at a uniform **148×26 px** — centered
labels, equal height and width, verified by measurement (148×26 on every
row) and on screen. The gate label was reworked to fit the rail:
`OPEN · 405 MS` (detail moved to a tooltip: "identity cleared"),
`LOCKED · N MIN` (tooltip: "recover via Forgot password? on your member
portal"), `UNREACHABLE` (tooltip: "local read stands in"). No layout
jump, no overflow at any width.

`RFX-OS-DEPLOY-READY.zip` refreshed to `v=62` (772 entries, all 741 slide
assets, functions + `_redirects`). Audit ALL GREEN (13 sections), console
clean.

## §25 — Pill standard swept OS-wide · v=63

Founder order: "sweep the pill standard OS-wide, neatness always." One
vertical rhythm now runs through every status pill, chip and badge in the
OS: **26px tall, pill radius, centered inline-flex content, 0 horizontal
padding, no vertical padding, nowrap** — with per-family width overrides
only where a rail needs them (heartbeat 148px, grade chips 112px, Hall of
Fame states 92px, badge-tier 20px inline mini).

Families unified: heartbeat `.sys-state` (done v=62), `.live-pill`
(LIVE/UPCOMING/ENDED/ALWAYS OPEN), `.lesson-badge`, `.diff-chip`,
`.rec-chip`, `.tour-chip`, `.sim-reward-chip`, `.tier-pill`, `.hof-state`
(+ earned green variant), `.lane-you-pill`, `.badge-tier`.

**One genuine defect found by the sweep:** the Trading Challenge card's
state pill (`.pill` — open / in progress / completed) had **no base style
at all** — it rendered as unstyled text. Added the `.pill` / `.pill.ok` /
`.pill.gold` standard (green in-progress, gold open, neutral completed).
Verified live at v=63: sim pills 26px, live pills 26px (ALWAYS OPEN 132 /
LIVE 69 / ENDED 68), hof states 26×92, sys pills still 148×26, zero
console errors.

`RFX-OS-DEPLOY-READY.zip` refreshed to `v=63` (772 entries, all 741 slide
assets, functions + `_redirects`). Audit ALL GREEN (13 sections).

## §26 — The giant Founder's Day crowns, removed + root cause · v=64

Founder order: the Founder's Day icons were "huge icons that have ruined
the dash". Root cause: the ICON helper emits `<svg viewBox>` with **no
width/height**, and the footer lines (`.mach-foot`, `.hof-foot`,
`.guide-foot`) had no icon-sizing rule — so the browser rendered those
inline crowns at the full panel width (~705×705 px), a giant grey crown
watermark smeared across the middle of the dashboard.

Fixed twice, belt and braces:
1. **Removed the crown glyphs** from the three footer lines — the text
   remains ("Founder's Day — 1 November. The founder stays anonymous —
   the learning is the point.").
2. **Root-cause safety net:** a base `svg { width:1em; height:1em;
   vertical-align:-0.12em }` rule — any bare inline SVG now inherits the
   surrounding text size instead of ballooning to its container. Every
   explicit icon size in the OS (rings, chips, badges, brand crown) wins
   over it, verified: the 705px offenders are gone, the progress rings
   (170/148/84px) and every small icon render exactly as designed.

Also swept the same pattern elsewhere (recognition card crown,
rank-note, hof-prize, hof-unclaimed) — all already sized, now guarded by
the base rule. Audit ALL GREEN, console clean, dash verified on screen at
v=64.

`RFX-OS-DEPLOY-READY.zip` refreshed to `v=64` (772 entries, all 741 slide
assets, functions + `_redirects`).

---

## §27 — 15 Aug 2026, pre-dawn autopilot round (v=65, the PWA + publishing night)

**Git is now real.** The OS repo (`realityscripts-create/REALITY-FOREX-TRADING-`)
received everything from the last week: `3d9d4e6` on `main` — the v65 OS with the
gate lock contract, uniform pill standard, giant-icon guard, sim.js, journal.js
and the ch1–4 Challenging/Elite depth push (14,627 insertions). The outer repo
(whole ecosystem: System A, netlify functions, docs, tooling) is committed too,
waiting only for a GitHub repo to be created to receive it (one command, below).

**PWA layer built — and it is NOT in the OS file group.** `rfx-pwa/` lives at the
repo root: manifest, service worker, register/push scaffolding, branded
install guide, crown icons. The OS's only footprint is three lines in
`index.html`. Verified in the production layout (OS staged at site root): all
nine paths answer 200, manifest JSON valid, `start_url: "/"` matches how
deploy-live.sh actually ships. The one rule documented in `rfx-pwa/README.md`:
if the OS ever hosts under `/os/`, prefix the paths in manifest.json + sw.js.

**Distribution playbook** — `RFX-DISTRIBUTION-PLAYBOOK.md` at repo root: PWA
first (email link → install guide → home screen), APK only for Android
power-users with a published SHA-256 (anti-phishing), stores deferred as a
marketing badge, not a dependency. Also in the playbook: the dashboard now
ends on the certification card (Laboratory / AI Mentor / Trade Journal pills
moved above it), and the last two pill families (soon-chip, badge-tier) were
brought onto the 26px standard so the whole OS is one size, one voice.

**Audit grew a 14th section** — pill standard (13 families must carry the 26px
rhythm) + giant-icon guard (bare svg defaults to 1em; footers carry no inline
svg) — ALL GREEN at v=65, along with the corrected cross-tree asset check for
the `../rfx-pwa/` wiring. Drop zip refreshed to v=65 (764 entries, 741 slides,
rfx-pwa inside, verified).

**To push the outer repo once you create it on GitHub:**
```bash
cd "C:/Users/user/Downloads/REALITY FX TRADING/reality-fx-site"
git remote add origin https://github.com/<you>/reality-fx-site.git
git push -u origin main
```
(The OS repo is already pushed — that one's done.)

---

## §28 — 15 Aug 2026, day session: PWA install wired into onboarding

The install guide is now linked in the three places a student first meets the
Academy, all derived from the configured OS endpoint via a new `osInstallUrl()`
(db.js, beside `osIndexUrl`) — never a hardcoded machine address:

1. **Welcome email** (bridge.js) — "Put the Academy on your phone — Android &
iPhone (works offline)" under the Enter RFX OS button, sent the moment the
handshake lands.
2. **Registration completion screen** (register.html + register.js) — a
"Put the Academy on your phone" ghost button under Enter the Academy.
3. **Member panel access card** (member.js, ACTIVE state) — "Get the Academy
app — works on any phone" under the Enter button.

Mirrored to both System A trees (lockstep green). Audit ALL GREEN.

The System A twin repo (`Zorrothegreat-Lee/Reality-Fx-Registration-and-Member-s-panel`)
has the change committed locally (`b18ca0c`) — the push needs Lee's own GitHub
credentials (the machine's cached token belongs to realityscripts-create and
denied 403). One `git push` from his machine.

---

## §29 — 15 Aug 2026, day session: the in-OS Install button + a deploy bug caught

The sidebar now carries an **Install app** button (v=66): 26px pill standard,
download icon added to the OS stroke set, and it appears only when the device
can actually install — `rfx:pwa-installable` on Android/Chrome/Edge, the
Share → Add to Home Screen hint on iOS, hidden once installed. Wired in `os.js`
(`wirePwaInstall`), guarded by the audit's pill-family list (14 families now).

**A real deploy bug was caught while verifying:** `deploy-live.sh` never staged
`rfx-pwa/` or `_headers` — the PWA would have shipped in the drop zip but been
404 on the live site. Fixed (both are staged now), and the audit grew section 15
"PWA + deploy rails": deploy stages the app layer, manifest/sw match the root
layout, OS shell wired. Audit ALL GREEN at v=66 (15 sections). OS pushed to
GitHub (`7958342`).

---

## §30 — 15 Aug 2026, day session: install hint + live PWA probe + a discovery

**One-time install hint (v=67).** The sidebar Install button now pulses a soft
gold glow the first time it appears per device (`S.pwaHintShown` flag) — a
~3.2s subtle heartbeat in the brand's restrained language, gone on click, never
repeated. Verified live: shows on the installable event, never re-nudges.

**Live PWA probe in the audit.** Section 16, run with `LIVE_PROBE=1` — checks
the deployed site really carries the app: manifest (valid, root layout), the
service worker's `Service-Worker-Allowed: /` header (without it every install
is blocked), the install guide, and the live-vs-local stamp. Deliberately
non-gating (a fresh bump would otherwise block its own first deploy);
`deploy-live.sh` gained a step 5 that runs the same probes AFTER the upload,
with retries, and refuses to declare victory if the app layer didn't ship.

**Discovery:** the first live probe shows production is at **v=10** — the v65–67
builds never reached the live site (Netlify credits have been exhausted, so
deploys are blocked: "credit usage exceeded"). The machine is honest about it:
`LIVE_PROBE=1` reports the gap. The moment credits land, `bash deploy-live.sh`
now walks the whole building AND proves the app layer is live in one command.

— Zorro (System B), 15 August 2026

---

## §31 · The PDF rebuild (no more chopped pages) + Play Data Safety draft — 15 Aug 2026

**The complaint was right.** The three PDFs (Master Guide, Investor, University)
on the Desktop were printed from HTML generated by an *older* converter — fixed
800px body, no A4 `@page` rule. That clipped text at the page edge, broke words
mid-word in narrow table columns ("Dimensio/n"), and the fixed footer overlapped
full pages (page 8 of the Master Guide had the access-log list tangled with the
footer line). The OneDrive copies were an even older generation. All rebuilt
from the current markdown with a hardened converter:

1. **Flowing A4 layout** — `@page A4` + margins, no fixed width; content makes a
   new page instead of being squeezed. Nothing is cut off to save space.
2. **No fixed footer** — the closing band is now an in-flow block at the end.
   Chrome repeats `position: fixed` footers *over* the content box on any page
   that fills to the bottom; that class of overlap is gone for good.
3. **Tables break at word boundaries** (`break-word`, not `anywhere`) — the
   comparison table reads "Dimension / Typical trading course / Reality FX".
4. **Page-break hygiene** — headings keep with their paragraph; rows,
   blockquotes and code blocks never split mid-block.

Verified page-by-page with poppler (12/8/6 A4 pages, zero near-empty pages,
zero mid-word cuts, footer only at the end). New PDFs are on the Desktop
(OneDrive). The build recipe (`PDF-PRINTING-SAFE-RECIPE.md`) documents the
incident and the fix.

**Play Data Safety** — `RFX-PLAY-DATA-SAFETY-FORM.md` drafts the Google Play
"Data safety" questionnaire, every answer grounded in the real system: no
government IDs (the registration form states *"we do not collect government ID
or passport numbers — ever"*), no precise location, no card/bank credentials,
no ads/analytics/trackers, guardian consent for minors, encryption in transit,
deletion via the support rail. Pre-submission checklist included (add the
in-OS "delete my account" button, one independent security review).

**Live site** — probed again: still **v=10**, no PWA layer; the Netlify gate is
still closed ("credit usage exceeded — new deploys are blocked"). Nothing is
broken that a deploy wouldn't fix; `bash deploy-live.sh` remains the single
command the moment credits land.

— Zorro (System B), 15 August 2026

---

## §32 · The data-rights rail + crown covers — 15 Aug 2026

**"Request my data / Delete my account" is now a real action in the OS.**
My Profile gained a *Privacy & your data* panel: a student can request a
copy of their data or an account deletion. The request is filed to a new
`/api/data-requests` rail (local server + the production function) with a
reference number (`DR-xxxx`) as the receipt, and the Staff Console now has a
**Data-requests board** right under the PII board showing every request —
who, what kind, when, status. Verified end-to-end live: a real click from
the OS profile room filed `DR-2781-3930` for the signed-in student and the
board read it back. This is what makes the Play Data Safety deletion claim
true *today*, not on submission day. v=68, OS pushed (`2a270ea`).

**The PDFs grew a crown cover.** `make-cover.pl` prepends a full-bleed A4
cover to each of the three documents: a big gold crown (hand-drawn SVG,
gradient + orbs + band), double-line gold frame, brand line, title, eyebrow,
tagline and version/date — all in the black & gold house language. The cover
prints full-bleed (`@page :first { margin: 0 }`) while the body keeps the
fixed A4 margins, so nothing that was fixed in §31 can regress. Final
counts: Master Guide 13 · Investor 9 · University 7 pages. Verified: crown
pixels ~4.7% of the cover, background ~90% dark, zero near-empty body pages.
New PDFs are on the Desktop (OneDrive).

**Live site** — gate still closed; the v=68 build + covers are staged and
waiting; `bash deploy-live.sh` remains the one command.

## 33. Data-rights receipt email + audit rail + a deploy bug caught · 15 Aug 2026

**The receipt is now a real email.** Filing a data copy/deletion request from
My Profile → Privacy & your data emails the student a branded gold-crown
receipt with their DR- reference — "nothing is deleted instantly, you can
change your mind" — the moment it lands on the rail. Best-effort by design:
no Resend key → the request still files and the ref is still the receipt
(receiptEmail: pending), never a failed request. Production sends via Resend;
local dev returns pending, same philosophy as the demo-code rail. The OS UI
now tells the student "a confirmation email is on its way" when it sent.

**Audit section 16 — Data-rights rail** (all green): production function GET+
POST data-requests with DR- refs + receipt email wired; local server mirrors;
OS profile panel has both buttons + ref/email status; and a data-minimisation
guard — the payload may only carry name, email, studentId (no phone, no
address, no government ID). OS bumped to v=69, pushed to GitHub (9b3b7be).

**Found while verifying — a real deploy bug.** deploy-live.sh staged only
index/css/js — never `os/assets` — so a live deploy would have shipped the OS
**without its 741 chapter slides** (the OS loads them at runtime). Fixed:
assets now stage with every deploy, the audit's section 15 now tripwires it,
and the drop zip is rebuilt complete: 741 slides, v=69, PWA layer, 237 MB.

**Push status** — OS pushed (9b3b7be). Outer repo committed locally (f881e32);
still no remote of its own, and the twin panel repo is ahead 2 of origin,
waiting on Zorrothegreat-Lee's GitHub login (one `git push origin HEAD`).

## 34. House-crown covers + RFX University opening-soon · 15 Aug 2026

**The crown the founder loves.** Feedback: the geometric cover crown read
"cheap"; the crown the brand loves is the classic chess-queen silhouette
(U+265B) that rides every document masthead. The cover crown was redrawn to
match it exactly — five beaded peaks (a bead on ALL five), a band with two
etched stripes, filled silhouette, gold gradient + soft glow. Cover and
mastheads now speak the same crown, one voice cover to cover. All three PDFs
rebuilt and re-verified (13/9/7 pages, zero near-empty, closing bands
intact) and dropped on both Desktops.

**RFX University opening soon.** The University document now carries a
prominent callout: Semester One begins the day the campus opens — the exact
day our live platform's credits are restored. No fake date: the opening day
IS the restore day, and every student who registers before it starts
Semester One on the same line.

**GitHub confirmation** — the founder asked which repo was "the GitHub":
`realityscripts-create/REALITY-FOREX-TRADING-` is the OS (all pushed,
latest `9b3b7be`). The twin panel repo `Zorrothegreat-Lee/...` still needs
the founder's own login to push (2 commits ahead locally) — never share
tokens in chat; one `git push origin HEAD` from their machine does it.

## 35. The sculptural crown + full page spice · 15 Aug 2026

Founder's reference sent: a sculptural 3D crown (gold spheres on all five
peaks, BLACK diamonds in the band, engraved scrollwork, riveted rim, floor
glow) and a "1st page" with the RF monogram + gold number badges. Both are
now the standard:

- **Cover crown** redrawn to the sculptural reference — per-peak sphere
gradients, dark-faceted diamond jewels (one large centre + four flanking),
engraved veins, rivet row, under-glow. Cover frame gained ornate corner
flourishes; the title divider carries the ❖ filigree ornament.
- **Page spice** — mastheads open with the RF monogram in a gold box +
letterspaced wordmark; ordered lists render as gold circular number badges;
blockquotes are rounded gold callout cards with a ✳ marker.
- **Rebuilt + verified**: 13/9/7 pages, all full, closing bands intact, zero
mid-word cuts. Dropped on both Desktops. Committed (`77a5bd0`).

## 36. The founder's crown, embedded + the outer-repo push prep · 15 Aug 2026

**The crown is now the founder's own render.** No more hand-drawn SVG — the
cover embeds the crown cropped straight from the approved "concept 1 cover
page.png" (gold-bbox located programmatically, 620x385 crop stored as
`.freebuff/tools/crown-src.png`, base64 data URI + radial edge-fade mask so
it melts into the black). Corner frame + filigree divider stay. All three
PDFs rebuilt and verified (13/9/7, bands intact), delivered to both
Desktops. Committed (`7411f0f`).

**Outer repo made pushable.** The founder is pushing `reality-fx-site`
(221 tracked files) to GitHub. History held ~330MB of junk blobs — desktop
cache DBs and an old zip — which GitHub hard-rejects (>100MB per blob).
Purged from local history with filter-branch + gc: pack dropped 517MB →
2.1MB, all 19 commits intact, submodule pointer intact, backup bundle at
`C:/tmp/rfx-outer-backup.bundle`. Ready for one `git remote add origin` +
`git push` — the founder does the GitHub-side steps (create repo, push).

## 37. Crown-top cut-off killed, Final Exam becomes the journey's capstone,
1% Risk Checker + workshop drill, gate guarded in the audit · 15 Aug 2026

**The crown top was being cut off in the delivered PDFs — two root causes,
both killed.** (1) The crop itself: the earlier bbox started BELOW the
peak spheres (which begin ~420 of the concept's 1470px height), so the crop
sliced the peaks off. Re-profiled the concept row-by-row and re-cropped
x 194..870, y 390..825 → 676x435 with 30px headroom above the spheres.
(2) The radial edge-fade mask on `.cover-crown img` — its ellipse faded
the top ~69px of a 435px image to transparent, which is exactly where the
peak spheres sit. Mask removed (the crop carries dark margins of its own).
All three PDFs rebuilt and re-verified: 13/9/7 pages, crown pixel-checked
on every cover, peaks + spheres fully visible. Delivered to both Desktops
and refreshed the `.freebuff/tools` copies (the stale crownless ones).

**The Final Examination is now the Journey's capstone.** Reasoning: the
exam is the certificate's last door — it belongs at the END of the linear
journey, not as a parallel room. The Journey now draws a 14th node after
Chapter 13 — the capstone — locked until every chapter passes, then
"Begin the Final Examination", then "Passed · best %". The exam room still
exists (the node links to it; the nav keeps it reachable). Crucially, the
certificate gate was found to be too loose: it unlocked at 100% chapters
WITHOUT the exam. Now the certificate is gated on chapters AND the exam
pass — a 100%-but-no-exam student is sent to the exam, and the dashboard
CTA leads there first too. Verified live end to end (locked → open →
begin → pass → certificate renders with "Final Examination: passed").

**The 1% Risk Checker + the workshop drill.** The question students ask
most — "how do I know a trade is 1%?" — now has a machine answer. The
Laboratory leads with a **1% Risk Checker** (account size, position size,
entry, stop, target, direction → exact money at risk, % of account, verdict
inside/over the 1% rule, reward:risk, and the max size that stays inside).
The **Risk Workshop** gained a hands-on 1% drill: the student builds a
trade and the machine judges it live, then must compute the money at risk
themselves and verify their own arithmetic before the quiz. Workshops stay
practical — this adds doing, not more questions.

**The gate is guarded in the audit.** New section 18 — the fork server
answers `/api/gate` off the throttle record, 8125 is in start-demo.sh AND
the watchdog (a restart can never silently kill the lock again), the OS
heartbeat polls it, and the locked-card countdown renders. Audit ALL GREEN
across all 18 sections.

## 38. A real workshop: the Moving Averages workbench + drill rewards · 15 Aug 2026

**The workshops finally FEEL like workshops — build it, tune it, break it.**
New 7th workshop: **The Moving Averages Workshop**, built around a live
workbench — a seeded synthetic market (the same market for every student)
with fast/slow SMA sliders, golden/death cross markers drawn on the chart, a
crossover sim scoring trades, P/L and win rate on every change, and five
presets: Classic 10/30, Whipsaw 2/5, Lag 5/120, Inverted 45/10, Smooth
20/50. The machine names what the student's tuning just did — "inverted,
your fast line is slower than your slow line", "whipsaw machine, both lines
chase every wiggle", "lag — signals fire near the end of the move" — so
breaking it IS the lesson. Verified live: whipsaw jumps to 7 crosses vs 2
healthy, inverted flips the same market to −3%, lag kills the signals
altogether. Sim P/L is simple non-compounding return so the number stays
honest at every setting.

**Drill rewards.** The 1% drill and the workbench each grant **+5 XP** the
first time the skill actually lands — correct arithmetic / a healthy MA
configuration — once per student, preserved through workshop completion
(the submit path now keeps the drill flag). Workshops are now seven: Risk,
Psychology, Structure, Journal, Prop, Exam-Prep, Moving Averages.

**Guide updated** — the exam card calls the Final Examination the Journey's
capstone (the final node after Chapter 13) and the workshops card describes
the build-tune-break wing. OS v75, audit ALL GREEN, and the live audit
status page reports all 18 sections green straight from the OS server's own
`/os/api/audit`.

## 39. Psychology icon fixed, "free tier" scrubbed, white edges killed · 15 Aug 2026

**The Psychology Workshop "Undefined" icon.** Root cause: the workshop cards
read `ICONS.brain`, but the os.js icon table never had a `brain` entry (only
icons.js did) — so the card rendered the literal string "undefined" where
the brain should be. Added the brain path to os.js's ICONS; verified live at
v76 that all seven workshop cards (and the detail page) render real SVG
icons, zero undefined anywhere.

**"Free tier hosting" scrubbed from the public Master Guide.** The founder
asked — rightly — why a public-facing document tells the world we don't pay
for hosting. The honest answer on thinking: the Master Guide is the
architectural reference, and the detail crept in as engineering fact, not
strategy. But the founder is right that "free tier" reads as cost-cutting,
not institution — and it isn't even a stable claim (the plan can change).
Reworded to capability, not billing: "Netlify's global edge network —
world-class CDN, custom domains with SSL, serverless functions & storage";
the "free-plan path" email line is now "environment variables". All three
public docs swept for other free-tier mentions — clean.

**White document edges — killed.** The founder didn't like the white frame
around the dark pages. Found the real cause empirically: Chrome prints the
`@page` margin box as white paper no matter what background html/body carry
— the only thing that reaches the paper edge is the `@page { background }`
descriptor itself (with a literal hex; CSS vars inside @page are unreliable
in Chromium). All three PDFs rebuilt and verified: page corners now RGB
14,13,10 (the RFX dark) instead of 255,255,255, on body pages AND covers.
Delivered to both Desktops. Recipe updated with the rule.

## 40. Finalizing round — OS v77 · 15 Aug 2026

**Certificate = trophy.** The certificate room now sits in a glass case — a
subtle panel with a soft gold halo and two thin illuminated lines travelling
the border (restrained, on-theme; the certificate itself untouched).

**MA workbench: breakout drill + a permanent home in the Lab.** The workbench
now includes the sizing drill every student asks about: a live cross signal,
account + entry + stop distance, and the machine asks HOW MANY units keeps
risk at exactly 1% — verified arithmetic, +5 XP first correct. The same
workbench is now a permanent Laboratory tool (MA Strategy Workbench), so the
Lab isn't just arithmetic — it's a whole strategy sandbox.

**System integrity self-check** sits on its own line with the verdict below
it — no more kissing the panel text above.

**Stale academy link, killed at the root.** The OS→member-panel return link
used to stay pointing at an older server copy; a hard refresh didn't help
because the base was cached. Now a "stale" health verdict triggers discovery
— the OS finds the freshest server holding the student's record and re-points
every return link on the spot.

**Audit section 19 (new).** The workshops & drills rail is now guarded: all
7 workshops, both drills, the breakout sizing, the XP rewards, and the Lab
sandbox. Audit ALL GREEN across all 19 sections. OS v77, committed and pushed.

## 41. Undefined sweep + icon tripwire + the certificate · OS v78 · 15 Aug 2026

**Undefined sweep OS-wide.** Every `ICONS.<key>` reference in the OS resolves
against the icon table (39 used / 43 defined). The remaining DYNAMIC lookups
(nudge cards, rank cards) now go through an `ic()` safety net — an unknown
key falls back to a neutral mark instead of printing the literal string
"undefined". Route-by-route live sweep: zero "undefined" anywhere.

**Audit section 20 (new).** The icon tripwire — a future missing icon key
fails the audit at deploy time, and the workbench wiring (breakout trigger,
facts, verify, lab suffix, seeded market) is guarded inside section 19.
Audit ALL GREEN across all 20 sections.

**The certificate, delivered.** A print-perfect A4-landscape certificate PDF
is on the founder's Desktop (`RFX-CERTIFICATE-Leeroy-Chirwa.pdf`) — full-bleed
dark, gold on black, all text verified. Inspect it and send your touch-ups.

## 42. Print certificate (PDF) button · OS v79 · 15 Aug 2026

The certificate room now carries a **Print certificate (PDF)** button that
builds the exact delivered standard from the student's LIVE record — name,
certificate ID, XP, rank, exam status, earned badges — as a self-contained
A4-landscape page and opens it print-ready (save as PDF or print). The
certificate route also gained the matching full-bleed print CSS as a
fallback when popups are blocked. Generation verified byte-exact; audit
ALL GREEN across all 20 sections.

## 43. The launch pack — 30 September 2026 · OS v80 · 15 Aug 2026

**Emails on the Desktop.** Four branded HTML emails (gold/black, crown,
RFX voice): the main launch-day announcement, plus the three-part sequence
— ONE-WEEK (what's waiting inside), FORTY-EIGHT (the first cohort sets the
standard), DAY-OF (the doors are open, proof not just a certificate).
**Short-form pack.** Social captions (IG/FB), a WhatsApp broadcast block,
Stories slides and countdown captions — all ready to paste.

**In-OS countdown.** The dashboard now carries a quiet gold banner —
"THE ACADEMY OPENS IN 46 DAYS" with a Reserve-your-place CTA — that
flips to a green "THE DOORS ARE OPEN" state on 30 September. Static,
on-theme, no timers; hidden for the founder. Audit ALL GREEN across all
20 sections; OS v80.

## 44. Correction — the countdown belongs on the website · OS v81 · 15 Aug 2026

The founder's own catch, and he was right: a "Reserve your place" CTA in
the OS only reaches people already enrolled — the guarded classroom — so
nobody who actually needed the button could ever see it. 😄 The countdown
now lives on the **System A hero** (index.html), between the welcome line
and the doors grid, where prospective students see it: "The Academy opens
in 46 days" with a gold Reserve-your-place button wired to register.html,
flipping to a green "The doors are open → Begin registration" state on
30 September. The OS dashboard is clean again. Mirrored to the System A
repo; audit ALL GREEN; OS v81.

— Zorro (System B), 15 August 2026

## 45. Launch waitlist + the Android wrapper + the print-rail guard · 17 Aug 2026

**The Reserve button is now a real waitlist.** The hero's "Reserve my
place" is an inline email capture that POSTs to a new `/api/waitlist` rail
in the production function (email-keyed blob, spam-safe, branded
confirmation email when Resend is live — and no public count ever, per
the founder's anonymous-student-count call). Register.html gained the
opening-day band ("The Academy opens 30 September 2026 — in N days") and
a waitlist rescue on the link-error screen so nobody with a stale link is
lost. Verified live on the hero: reserve → "Reserving…" → ✓ confirmed.

**The Android wrapper is built** — `android-wrapper/` in the repo root:
Capacitor project, one-command `bash build-apk.sh` (or `build-apk.ps1`),
composing the OS + PWA into the exact production layout (764 files, 741
slides) with the service worker moved to root scope so the whole shell
caches offline inside the APK, plus a crown-icon installer. No Java/Node
on this machine, so the APK itself builds on Lee's box: `npm install` →
`npm run android:init` → `bash build-apk.sh` → `dist/RFX-OS-Android.apk`
with the SHA-256 printed for the email. The composed payload was booted
live in the preview — full OS, all rooms, SW registered.

**Careers salaries fixed** — the fantasy figures (R55k/mo Senior Trader)
are now realistic SA market rates (R24–38k), because the salaries page is
read by the very people we want to hire.

**Audit section 21** — the certificate print rail is machine-guarded
(button → certPageHTML → A4-landscape standalone; print CSS geometry).
Audit ALL GREEN across all 21 sections. Also delivered:
`RFX-LAUNCH-DAY-PLAYBOOK.md` (the 30 September runbook, hour by hour,
with incident responses) and `RFX-MOBILE-AUDIT-CHECKLIST.md` (every build
walks it top to bottom before a single student's phone sees it).

Pushed: outer `0405c6d` · OS `362ffa8` · System A `6ab3675`.

— Zorro (System B), 17 August 2026

## 46. Performance-based trader model — the careers ladder + the OS trader track · 17 Aug 2026

The founder's standing decision, now encoded on both surfaces: **Reality FX does not put traders on fixed monthly salaries.** Trading compensation is a share of risk-adjusted performance on allocated capital — when the trader wins, the firm wins. Fixed salaries remain only for genuine staff roles (analysts, risk manager, mentor, support, VA).

**The careers page** (`careers.html`) now shows the full capital ladder in order:

| Rung | Capital | Compensation |
|---|---|---|
| Apprentice | Simulated | Performance-tracked, no monetary comp |
| Junior | Small allocation | Performance share |
| Prop/Funded | Funded allocation | Higher performance share |
| Senior | Significant allocation | Negotiated performance share |
| Portfolio | Strategic allocation | Profit participation |

A department intro states the scoring basis explicitly: profitability, risk management, consistency, maximum drawdown, rule adherence, capital preservation. The apply-form position dropdown was updated with the two new rungs (Apprentice, Portfolio) — the "Apply Now" pre-fill silently failed before this, verified fixed live.

**The OS trader track** (`sim.js` → Trading Challenge hub): the same five-rung ladder rendered in gold, with the rung **derived live from the machine-signed challenge results** — never a stored claim. Apprentice by default; Junior = a completed challenge scored 50+; Funded = one signed PASS; Senior = PASSes on 2+ challenges; Portfolio = the Prop-Style institutional pass + another PASS. Verified: a fresh student shows Apprentice; one PASS lifts to Funded; two PASSes to Senior; prop+another to Portfolio (all five lit). This is the student-facing proof path into the careers ladder — the sim measures, the machine signs, the rung moves.

**Site-wide 24/7** — all "24/5" references on the public site (homepage Customer Care + Operational Excellence meter, Why Choose Us stats, Our Services coverage) now read 24/7: machines plus the double-shift team never stop.

**Production note for Lee:** the OS track needs no server state — it derives from the same signed results the leaderboard rail already carries. If Firebase adoption ever replaces the sim store, keep deriving the rung from signed assessment records; a rung must never be settable by the client.

## 47. The leaderboard honesty standard + audit-stamp fix + the marketing site ID · 17 Aug 2026

**Leaderboard honesty (the awards lesson, applied to the challenge wall).** The seeded leaderboard looked like everyone had already passed every challenge — demotivating and fake, and exactly the trap we fixed on the Hall of Fame. The new standard: **one person, one PASS, once.** The wall shows the challenge has been *tried* and that passing is *possible* — never that it has already been done by many. The seed (`seed-challenges.pl`) now fabricates exactly one entry (Sipho Ngubane, FTMO, PASS 84), every other board reads "No completed assessments yet — the first name on this wall becomes the standard," and **audit section 10 machine-guards the seed** (exactly 1 row, 1 PASS) so a mass-victory seed can never silently return. The live local store was reset to the single entry and verified over the rail. Production note: never seed the blob store with fabricated victories; the empty wall is the honest wall until real students fill it.

**Audit stamp — the time now updates after every audit.** Two bugs made the "last run" stamp lie: the local server forks per connection, so two concurrent 20-second audit walks could finish out of order and paint an OLDER time over a newer one; and the stamp was emitted in UTC (`gmtime`), so on a SA machine it always read ~2 hours behind the wall clock. Fixed: the server now caches the completed audit (file + flock, so fork children never stampede), serves it instantly to the polling page, and the timestamp is the local completion time (`localtime` + `atEpoch`). The "Run the audit now" button forces a fresh walk past the cache (`?refresh=1`), and the page ignores out-of-order responses. The wall always shows when the last audit actually completed — updated automatically.

**The rung rides every room.** The trader track rung (Apprentice → Portfolio) is no longer only visible inside the Trading Challenge hub — the sidebar now wears it under the XP line on every room of the OS (`RFXSim.rung()` exported, `sideRankRung` refreshed on every route change). A student always knows where they stand on the Academy's ladder, not just inside the arena.

**The marketing site is on its own account — recorded for Lee.** The public site (`realityfx.netlify.app` — the one showing the old careers salaries) lives on **realityfx20@gmail.com**, site ID **`334794d1-1439-4a7e-bdd8-b59c9f55cefb`** — a different Netlify account than the OS deploy token. The founder's word: **credits restore on 10 September** — no more polling the gate. `deploy-live.sh` now supports `bash deploy-live.sh --marketing`, which stages the full public tree (marketing pages at root, OS under `/os/`, PWA + functions riding along — 758 files, all 741 slides), deploys to the marketing site ID (override with `NETLIFY_MARKETING_TOKEN`/`NETLIFY_MARKETING_SITE_ID`), and verifies the careers page shows the realistic rates. When the gate opens and the marketing token is available, that one command ships the salaries fix, the 24/7 sweep and the careers ladder to the public doors.

## 48. Honours-wall honesty + the mobile build package · 17 Aug 2026

**The Hall of Fame is honest now — the biggest wall in the OS.** It showed three years of fabricated winners: a 2024 graduate cohort, a 2025 Elite summit (Amara Okafor, "FIRST TO THE SUMMIT") and nine 2026 current-year leaders — every one of them an invented win before the doors have opened on 30 September 2026. The founder's standard, applied exactly as on the challenge leaderboard: **nothing shows as already-won before launch.** All fabricated rosters are gone; the past-year walls now stand with honest notes ("the Academy had not opened its doors — the first names land with the first cohort") and the nine tier blocks carry the unclaimed-summit language; the current-year wall shows only the student's own live card ("Ranked #1 of 1 — the first name on a new wall is the rarest invitation"). Seed version bumped 3→4 so any cached fabricated roster steps aside. **Audit section 22 (`Honours-wall honesty`) machine-guards it** — ten invented names, an empty current-year seed and no multi-entry past rosters, so a fake wall can never silently return. Verified live: zero fabricated cards, nine honest empty states. The wall fills as the Academy actually grows, never before.

**The mobile build package is on the desk for the new thread.** Three pieces: (1) `REALITY-FX-APK-DELIVERY-EMAIL.html` — the branded gold-on-black email students receive with the signed APK: install steps, the SHA-256 fingerprint block (placeholder — fill at build time), the "only our file, with our fingerprint" security note, and the offline pitch. (2) `RFX-MOBILE-DESIGN-STANDARD.md` — the founder's design law as a buildable spec: the exact palette tokens from the OS `:root` (`#0A0A0A`/`#C9A227`/`#E5C158`/grad-gold), Playfair+Inter type, the spacing laws (no kissing, no orphans, 2,2,2 fills, no cut-off text), the 26px pill rhythm, bare-SVG 1em icons, the restrained hover glow + the one travelling gold border, the perf budget (no timers, in-place updates), and the honesty rules. (3) **Wrapper readiness verified** — `android-wrapper/` is fully scaffolded and syntax-checked (package.json scripts, capacitor.config.json `za.co.realityfx.os`, all build scripts pass `bash -n`, `www/` composes 764 files incl. all 741 slides), but the `android/` project does NOT exist yet: `npm run android:init` generates it on the first build and needs Node 18+ + Android Studio (not on this machine). The run doc (`.freebuff/run.md`) now documents the wrapper so the new thread finds it cold.

**Certificate delivery fixed.** The certificate sample was previously copied to `C:\Users\user\Desktop` — the *legacy* folder — while the founder's real desktop is `C:\Users\user\OneDrive\Desktop` (Windows OneDrive redirection). Re-delivered to the visible desktop. Note for Lee: any future "put it on my desk" deliveries must target the OneDrive Desktop path.

## 49. The certificate is the concept — QR verification rail · 17 Aug 2026

**The certificate is now the founder's approved concept, exactly.** The drawn SVG interpretation is gone. The concept art (crown, crest ribbon, RX seal, double frame) ships as the certificate's base (`os/assets/cert-base.png`, concept raster with the five dynamic fields erased), and the live student record overlays those exact positions — name, the details line, issue date (value + long form) and the credential ID. The bull watermark is gone (the founder never asked for it). No cut-off, no invention: the design the founder picked is the design that prints.

**Every certificate is now a verifiable credential.** Three changes from the founder: (1) the number font is the standard sans (Inter), not the serif — matching the concept's values; (2) the QR is black-and-gold (gold modules on a near-black tile), not white-and-black; (3) the QR lives in the top-right of the certificate instead of beside the ID. The credential ID is minted as `RFX-<year>-<hex>` (launch-year-locked so it never shifts), the QR encodes only the public verification URL (`https://www.realityfxacademy.com/verify/<id>` — never student data), and the QR renders only on the earned certificate — the locked trophy shows the gold "NOT YET EARNED" stamp with no QR, because the credential hasn't been issued yet. The QR encoder is vendored (`os/js/qrcode.js`, MIT qrcode-generator, classic script — no build step), and `RFX-DIGITAL-CREDENTIAL-VERIFICATION-SPEC.md` on the repo root is the developer brief for the `/verify` registry (VALID / NOT VERIFIED / REVOKED states, revocation, audit trail, phases).

**The room came alive with value cards.** "What this certificate contains" — four gold cards (competence certified, one identity forever, graded by the machine, built to be verified) in a 2×2 rail under the trophy, speaking to why the credential is worth holding without pretending to answer a skeptic's interrogation. The desk sample (`RFX-CERTIFICATE-SAMPLE.html`, OneDrive Desktop) is rebuilt with the concept art embedded, ready for the founder's polish. Audit **ALL GREEN (91 checks, 22 sections)** — the print rail (section 21) still guards button → `certPageHTML` → A4 landscape, and the stamp/QR/locked logic all verified live in both the earned and not-yet-earned states.

## 50. The certificate PDF + live QR scan proof · 17 Aug 2026 (later)

**The certificate is now a deliverable, not just a room.** `RFX-CERTIFICATE.pdf` printed from the exact page the OS's "Print certificate (PDF)" button opens (the standalone A4-landscape `certPageHTML` with the concept art embedded) — 1 page, exact A4 landscape (841.92 × 594.96 pts), 88.8% dark page, gold art/name/QR all pixel-verified in place, crown fully visible (no top cut-off). Copies on the founder's desk (OneDrive Desktop), Desktop, and `.freebuff/tools/`.

**The QR was verified by actually decoding it — twice.** Using jsQR (the same engine phone cameras use): (1) the QR SVG from the certificate page decodes to `https://www.realityfxacademy.com/verify/RFX-2026-10482` — exact match; (2) the QR region cropped from a 300-dpi render of the printed PDF decodes to the same URL — exact match. That is the same pixel stream a phone camera captures, so the scan path is proven end-to-end: concept art → page → PDF → decode → correct verification URL. The sample is the honest preview: name THANDIWE MOKOENA, ID RFX-2026-10482.

**The /verify registry page is the one remaining build.** The QR points at `www.realityfxacademy.com/verify/<id>`; `RFX-DIGITAL-CREDENTIAL-VERIFICATION-SPEC.md` is the full brief (VALID / NOT VERIFIED / REVOKED, revocation, audit trail, phases) — it becomes real the day the OS ships beside System A on the live domain. No OS code changed for this step, so the audit's 91 checks were untouched and remain green.

## 51. The /verify credential registry — built and proven live · 17 Aug 2026 (final)

**The registry page is no longer "the one remaining build" — it is built.** `os/verify.html` is the public verification page: standalone, mobile-first, gold/black, three states (VALID gold panel with holder / credential / ID / issue date / status; REVOKED with the "no longer considered valid" message; NOT VERIFIED with the contact line), a manual "Verify another credential" box, and the seal footer. It reads the credential from `?id=`, the hash, or the `/verify/<id>` path, canonicalises (RFX-2026-10482 ≡ "rfx 2026 10482"), and never stores or asks for scanner identity. Every lookup outcome is logged (id + outcome + time only) to the activity rail.

**The rail is wired end-to-end, demo and production.** Demo: `os-handoff-server.pl` serves `GET /os/api/credentials` from `.freebuff/tools/os-credentials.json` (seeded with the desk sample — RFX-2026-10482 / Thandiwe Mokoena, VALID — plus a labelled demo REVOKED record so every state is testable; the file is now committed via a gitignore exception since the audit guards it) and `POST /os/api/credentials/activity`. Production: `netlify/functions/osapi.js` serves the same two endpoints from the `credentials` / `credActivity` blob stores, and `deploy-live.sh` stages `verify.html` with the mode-correct `/verify/*` rewrite (root in OS mode, `/os/` in marketing mode) so a certificate QR scan lands on the page on the live domain. Before launch the production registry is empty by design — every scan honestly returns NOT VERIFIED until real credentials are minted via the Phase 2 admin console.

**Verified live in the preview, all three states.** VALID (RFX-2026-10482 → Thandiwe Mokoena), REVOKED (RFX-2026-000127), NOT VERIFIED (RFX-2026-999999); manual entry with lowercase/spaces canonicalises correctly; the activity log recorded each outcome; and a 390px mobile render confirmed the page holds its layout at phone width (the way the QR is actually scanned). **Audit ALL GREEN — 22 sections, now including section 23 "Credential verification rail" (5 checks: page states + lookup, registry seed, demo server, production function, deploy rewrite).** Commits: OS + outer pushed.

## 52. Phase 2 — the Registry Console + register-on-issue · 17 Aug 2026 (final)

**The registry now runs itself — the moment a certificate is earned, it is minted.** The OS's certificate room calls `api/credentials/register` when the trophy is earned: once per credential (`credRegistered` guard client-side, idempotent server-side — an existing record is never overwritten, so a copied QR always resolves to the true holder), only for verified identities (the server double-checks the studentId against its own handoff store — a stranger's registration is refused 403), and the green line under the trophy confirms it: "Registered in the RFX verification registry — the QR is live." Proven end-to-end in the preview: the founder's earned certificate (RFX-2026-31B1F9 · Leeroy Chirwa) auto-registered, then the /verify page resolved it VALID.

**The Registry Console is a real room in the OS — `#/registry`, founder/admin only.** Hidden nav door (like the Machine Audit), route-gated client-side and re-checked server-side: mint, revoke, search and the verification audit trail. Live stats rail (credentials / valid / revoked / lookups), a mint form that derives the credential ID deterministically from the verified name (the same `certCode` mint the OS uses — so a minted record and the student's own certificate always agree), the registry table with VALID/REVOKED pills and Revoke, and the audit trail (credential, verdict, time — never the scanner's identity). The demo server gained `register/mint/revoke/activity` endpoints with a `registry_auth` gate (founder or role=admin, read from the server's own handoffs store — plus `role` is now persisted on handoff); the Netlify function mirrors them via `registryAuth` against the handoff blob. Verified live: mint (Sarah Mokoena → RFX-2026-B10048), revoke, and every non-admin write refused 403; the seed stays clean (the committed registry is the two canonical records; runtime registrations live only on this machine). Stamp v=87. **Audit ALL GREEN — section 23 now 10 checks.** Commits: OS + outer pushed.

— Zorro (System B), 17 August 2026

## 34. The Hidden Accumulation — the bonus chapter · 18 August 2026

**The founder's epiphany — a live case study that became the Academy's deepest lesson.** The founder traded Volatility 10 (1s) Index live: layered buys across 9,387–9,647 as the structure held, stop at 9,307, targets at 9,707/9,855/10,240. $10,000 balance → $11,357.63 equity (+$1,357.63). The trade started losing. The founder held. The market recovered. And in that sequence, an entire philosophy was born: noise vs invalidation, RET → IMP → COR, the three gates of scaling, the Trade Checkpoint, the "No More Fuel" rule. This chapter is the accumulation of that philosophy — card-native, no PDF, no slide deck.

**Where it lives — between Chapter 13 and the Final Examination.** NOT Chapter 14: the 13-chapter spine, the 78-question exam paper, the certificate line, and the journey grids are all untouched. The Hidden Accumulation reveals itself the moment all 13 chapters are complete — a hidden door with a breathing gold glow that says "come here" without screaming. It is the last thing a student reads before the exam: the psychology they will need under pressure.

**The journey node — restrained, inviting, earned.** A travelling gold border (the Operational Excellence treatment), a diamond icon, and a breathing glow animation that inhales and exhales light — classy, not noisy. The motivational note: "You have completed the thirteen chapters. That puts you ahead of every trader who ever opened a chart without studying the psychology behind it." Button: "Enter The Accumulation". Badges: the Accumulator (rarest on the journey).

**26 base cards + 8 elite cards = 34 cards of pure psychology.** The base deck covers all five gems (the secret sentence, noise vs invalidation, RET → IMP → COR, resistance becomes support, early ≠ wrong), the complete live case study (5 frames with the actual trade screenshots embedded), the scaling discipline (three gates, No More Fuel, the break-even illusion, honest limits), the Trade Checkpoint, the Mentor-in-Your-Head exercise, the Research Protocol, building your personal trade database, and the mantra. Every card carries the founder's insight — not just content, but the emotional resonance of someone who lived it.

**Elite sub-deck — the mathematics behind the art.** 8 elite-only cards that add: multi-timeframe integration (D1 → H2 → execution), weighted average entry calculation, Kelly criterion and scaling, institutional parallel (how banks accumulate), portfolio-level scaling (correlated risk), the Research Framework (turning the 7/10 into data), the Elite Decision Tree (11-question checkpoint), and the synthesis card. Plus a 6-question elite quiz (deeper than the base 6). Elite students get the full experience without needing to go back to a lower tier.

**Local-only guarantee holds.** Case study screenshots staged in `os/assets/case/` (frame-1.png = thesis chart, frame-2.png = positions table). The server, the deploy, and the audit all guard local-only. Stamp v=88. **Audit section 24: ALL GREEN — 11 checks** (bonus chapter defined, renamed, flagged, 6 quiz Qs, 26 base cards, elite sub-deck, lesson resolution, unlock gate, journey node, Accumulator badge, exam untouched, case receipts local). Commits: OS + outer pushed.

## 36. Tier-aware Final Examination — Elite gets the full gauntlet · 18 Aug 2026

The Final Examination is no longer one-size-fits-all. Each lane now draws a different depth of assessment:

| Lane | Questions/chapter | Total questions | Time limit |
| --- | --- | --- | --- |
| Standard | 6 | 78 | 2h 30m (150 min) |
| Challenging | 7 | 91 | 3h 00m (180 min) |
| Elite | 8 | 104 | 3h 30m (210 min) |

**How it works.** `examQuestionsPerCh()` and `examMinutes()` are dynamic helpers that read the current tier. `buildExamPaper()` slices each chapter's shuffled deck to the tier's per-chapter count. The exam intro, rules text, capstone node stats, and deadline are all derived from these helpers — nothing is hardcoded. A locked exam preserves its original deadline (stored in `finalExamRun.minutes`).

**The exam gate text** dynamically shows "Six/Seven/Eight questions per chapter" and the correct time for the student's lane. Elite students face 104 questions across 3.5 hours — a genuine endurance test that matches the depth of their training.

**Audit guard updated.** Section 24 now checks for `CHAPTERS.length * examQuestionsPerCh` instead of the old static `CHAPTERS.length * 6`. Stamp v=89. **Audit: ALL GREEN**. Commits: OS + outer pushed.

— Zorro (System B), 18 August 2026

## 37. Anti-piracy protection — 24h gate, 80% pass, quiz randomisation, rapid progression detection · 18 Aug 2026

**The fort is sealed.** Four layers of protection now guard the course material against mass-extraction:

### Layer 1 — 1-chapter-per-24-hour cooldown
`isUnlocked()` now enforces a 24-hour cooldown after each chapter pass. Even if a student passes immediately, the next chapter cannot unlock until 24 hours have passed. The journey map shows the countdown on locked chapters ("Unlocks in 23h 42m"). The `completedAt` timestamp is stamped the moment a chapter passes and is never overwritten.

### Layer 2 — 80% pass mark (up from 70%)
`PASS_PCT = 80` in data.js. The higher bar means a student must genuinely understand the material — memorising answer positions is no longer enough. The pass mark is referenced dynamically everywhere (reveal score, FAQ, guide text, lesson banners).

### Layer 3 — Quiz randomisation
When a lesson opens for a fresh attempt, the quiz questions are shuffled (`shuf(activeCh.quiz)`) AND each question's answer choices are shuffled with a tracked permutation that keeps the correct answer index consistent. The original data is never mutated — the shuffled deck lives only in `session.ch`. A student who photographs answers gets a different order on the next sitting.

### Layer 4 — Rapid progression detection
After every chapter pass, the system counts how many chapters were completed within the last 60 minutes. If the count reaches 3+ and the student's Trust Bar is not high, a `rapid-progression` flag is raised and synced to the moderator. This catches a student who somehow bypasses the 24h gate or brute-forces during a trial.

### Supporting changes
- Journey subtitle: "One chapter per day, 80%+ to pass, randomized questions every time."
- Locked chapter button: shows "Unlocks in Xm" countdown instead of generic "Complete previous chapter."
- Score reveal: "Passed — the next chapter unlocks in 24 hours."
- FAQ: mentions 80% pass mark and 24h cooldown.
- Guide: lessons section and Fair Play section updated.

**Audit section 25: ALL GREEN — 12 checks** (PASS_PCT, cooldown constant, 24h value, isUnlocked enforcement, cooldown helper, completedAt stamp, quiz shuffle, answer shuffle, rapid-progression flag, threshold, journey subtitle, countdown display). Stamp v=90. Commits: OS + outer.

---

## 50. System A Authentication + OS Session Architecture · 19 Aug 2026

The founder has approved the definitive architecture for how System A and Reality FX OS interact. **Read the full spec:** `RFX-SESSION-AUTH-ARCHITECTURE.md` in the repo root.

### The one rule

> **System A is the only door and the only authority.**
>
> Every Reality FX OS entry — whether from the Student Portal, shortcut app, bookmark, direct URL, or any other route — must first be backed by a valid System A authentication and authorisation state.

### What Lee must know

1. **System A = THE FORT.** It owns identity, credentials, authentication, student ID, enrolment, course status, permissions, SRM, and access rights. No exceptions.

2. **Reality FX OS = THE WORKSPACE.** It owns the OS interface, OS session, live session timer, activity detection, time banking, and session history. It never authenticates independently.

3. **The shortcut app is NOT a second login.** It is a launcher that checks System A authentication before opening the OS. Same front door, different approach.

4. **There is ONE student account, ONE set of credentials, ONE source of truth.**

5. **Session states:** ACTIVE → IDLE → PAUSED → COMPLETED / EXPIRED. One active session per student at a time. Multi-tab reuse, not multi-session.

6. **Time banking:** Total Time (banked, static during session) vs Live Session (counting up). Duration calculated server-side from timestamps. Stored as seconds. Banked only on session end. Atomic — no double-crediting.

   **CRITICAL: Checkpoint vs Bank distinction:**
   - `sesCheckpoint()` = saves active session state (start time, last activity). Does NOT modify `S.secs`. Fires on 30s interval, tab hide, browser close.
   - `sesBank()` = deposits session duration into `S.secs`. Fires ONLY on Logout button click or server-side session expiry.
   - `S.secs` (TOTAL) must remain completely static throughout an active session. Even after 100 checkpoints, TOTAL stays the same.
   - `visibilitychange` must NOT bank — students may switch tabs temporarily.

7. **Security:** The OS must NEVER trust localStorage, URL parameters, frontend flags, or browser cookies to authenticate. It must receive a trusted token/assertion from System A.

### Security Hardening (Production Requirements)

These are non-negotiable before go-live:

**H1 — Asymmetric Signing:** Use RS256 or EdDSA, NOT HS256. System A holds the private key. OS has only the public key (or verification endpoint). Include `kid` header for key rotation.

**H2 — Token Protection:** Short-lived one-time auth code preferred. If JWT: HTTPS only, 5-min expiry, single-use, removed from URL immediately via `history.replaceState`, NEVER stored in localStorage, NEVER logged.

**H3 — Auth ≠ Trust (Structurally Enforced):** A valid token proves identity, NOT that the OS should accept all local values as authoritative. The `S.handoff.founder → 100%` fallback is **DEV-ONLY** (gated by `IS_DEV = location.hostname === "localhost"`). In production, this code path is **structurally dead**. A forged `S.handoff.founder=true` in localStorage produces nothing. Additionally, a `TRUST_VERIFIED` flag gates ALL trust UI — `standingCard()`, `trustHigh()`, and the Founder's Circle badge all require `TRUST_VERIFIED === true` before rendering any score. This flag is ONLY set by `fetchTrust()` (when the academy server returns valid enrollment data) or `initTrustFromHandoff()` (dev-only). **Production trust can ONLY originate from verified System A authentication.** This is not an intention — it is a structural guarantee.

**H4 — Separate Objects:** AUTHENTICATED IDENTITY (from token) ≠ OS SESSION (created after validation). Restarting OS does not create new identity. Expired token does not corrupt study time.

**H5 — Heartbeat:** 30s ping distinguishes auth from activity. System A outage = degraded state (retain session, show warning), NOT session destruction.

**H6 — Idempotent Logout:** Finalization uses `sessionId + finalizationId`. Duplicate logout = same transaction, no double banking.

**H7 — Direct Access:** Unauthenticated → redirect to System A. Authenticated but disconnected → retain session per grace rules. Do NOT destroy UI for temporary outages.

### §51 — Definitive Token Contract (Lee Implementation Guide)

This is the **finalized** endpoint spec. Build from this, not from earlier descriptions.

---

#### 51.1 — Signing Keys

Generate an **asymmetric key pair** (RS256 or EdDSA):

- **Private key:** held by System A, used to sign tokens. NEVER leaves System A's server.
- **Public key:** distributed to the OS (or exposed via a JWKS endpoint at `/.well-known/jwks.json`). Used to verify tokens.
- **Key rotation:** include a `kid` (key ID) in each token header. System A tracks active keys. Old keys remain valid until their last token expires.

The OS must NEVER possess the signing secret. It can verify but cannot manufacture.

---

#### 51.2 — Token Generation (on System A login)

When a student logs in through System A and requests OS access:

1. System A authenticates the student (existing login flow)
2. System A generates a short-lived signed JWT with these claims:

```json
{
  "sub": "RFX-00127",
  "name": "Leeroy Chirwa",
  "founder": false,
  "status": "ACTIVE",
  "permissions": null,
  "printTrust": "trusted",
  "enrolled": [1,2,3,4,5,6,7,8,9,10,11,12,13],
  "iat": 1692453600,
  "exp": 1692453900,
  "jti": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "iss": "realityfx",
  "aud": "rfx-os"
}
```

**Header:**
```json
{
  "alg": "RS256",
  "kid": "key-2026-08"
}
```

**Required claims:**

| Claim | Type | Description |
|---|---|---|---|
| `sub` | string | Student ID (`RFX-XXXXX`) |
| `name` | string | Verified full name |
| `founder` | boolean | Founder status |
| `status` | string | `ACTIVE`, `SUSPENDED`, `DEMO`, etc. |
| `permissions` | object\|null | OS-specific permissions (future use) |
| `printTrust` | string | `standard` or `trusted` |
| `enrolled` | array | Chapter numbers the student is enrolled in |
| `iat` | number | Issued at (Unix timestamp) |
| `exp` | number | Expires at (Unix timestamp) — **max 5 minutes from iat** |
| `jti` | string | Unique token ID (UUID v4) — **single-use** |
| `iss` | string | Must be `realityfx` |
| `aud` | string | Must be `rfx-os` |

**Token lifetime:** maximum **5 minutes**. This is an authentication handoff, not a persistent session credential.

3. System A redirects the student to:
```
/os/?token=<signed_jwt>
```

4. System A records the `jti` in a consumed-tokens table (for replay protection).

---

#### 51.3 — Verification Endpoint

```
POST /api/verify-token
Content-Type: application/json

{
  "token": "<raw_jwt_string>"
}
```

**System A must validate (in order):**

1. **Structure:** Is this a valid JWT with 3 parts (header.payload.signature)?
2. **Algorithm:** Is the header `alg` one we support (RS256/EdDSA)?
3. **Key:** Does the `kid` header match a known active key?
4. **Signature:** Does the signature verify against the public key?
5. **Issuer:** Does `iss === "realityfx"`?
6. **Audience:** Does `aud === "rfx-os"`?
7. **Expiry:** Is `exp > now()`?
8. **Replay:** Has this `jti` been consumed? If yes → reject.
9. **Identity:** Does `sub` match a real, active enrollment?
10. **Enrollment:** Is the student's status compatible with OS access?
11. **Trust:** Fetch current trust score from the enrollment record.

---

#### 51.4 — Success Response (200)

```json
{
  "authenticated": true,
  "identity": {
    "studentId": "RFX-00127",
    "verifiedName": "Leeroy Chirwa",
    "founder": false,
    "status": "ACTIVE",
    "permissions": null,
    "printTrust": "trusted",
    "enrolled": [1,2,3,4,5,6,7,8,9,10,11,12,13]
  },
  "trust": {
    "score": 95,
    "restricted": false
  },
  "token": {
    "issuedAt": 1692453600,
    "expiresAt": 1692453900,
    "jti": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
  }
}
```

**Critical: `founder: true` is NOT equivalent to `trust: 100`.** Identity and trust are logically separate even though System A owns both. A founder's trust score comes from their enrollment record, not from the founder flag.

After returning 200, the `jti` is marked as consumed. Duplicate verification of the same `jti` must return 409.

---

#### 51.5 — Error Responses

| HTTP | Error Code | Meaning | When |
|---|---|---|---|
| **400** | `malformed` | Bad request | Missing `token` field, not a string, not 3-part JWT |
| **401** | `invalid` | Bad signature | Signature doesn't verify against any active key |
| **401** | `expired` | Token expired | `exp < now()` |
| **401** | `wrong-issuer` | Unknown issuer | `iss !== "realityfx"` |
| **401** | `wrong-audience` | Wrong audience | `aud !== "rfx-os"` |
| **403** | `not-permitted` | Identity valid, OS access denied | Student status = SUSPENDED, or not enrolled |
| **409** | `replay-detected` | JTI already consumed | `jti` found in consumed-tokens table |
| **500** | `verification-error` | System A internal error | Key lookup failed, DB error, etc. |
| **503** | `unavailable` | Verification service down | System A cannot process right now |

**Error response format:**
```json
{
  "authenticated": false,
  "error": "expired",
  "message": "Token has expired"
}
```

The OS must distinguish three fundamentally different states:
- **401 (any):** "You are not authenticated" → redirect to System A
- **403:** "You are authenticated but not permitted" → show authorization error
- **500/503:** "We cannot verify right now" → degraded state (retain existing session)

---

#### 51.6 — OS-Side Flow (already implemented in v113)

The OS auth gate (`rfxAuthGate()`) is already built. Here's what it does:

```
1. Capture ?token= from URL
2. Scrub URL immediately (history.replaceState)
3. POST token to /api/verify-token
4. If 200 → populate AUTH from response, create OS session, set TRUST_VERIFIED
5. If 401 → redirect to System A (production) / fallback (dev)
6. If 403 → show authorization error
7. If 500/503 → degraded state (existing session retained)
8. Raw token is NEVER stored in localStorage, S.handoff, or logs
```

---

#### 51.7 — Login Page Redirect Flow

On System A's member panel, when a student clicks "Open Reality FX OS":

1. System A generates a fresh JWT (max 5 min expiry, unique jti)
2. System A records the jti as "consumed"
3. System A redirects to: `/os/?token=<jwt>`
4. OS receives, validates, establishes auth, scrubs URL
5. Student is in the OS with verified identity

---

#### 51.8 — Testing Checklist for Lee

Before marking the endpoint as done, verify:

- [ ] Valid token → 200 with correct identity + trust
- [ ] Modified payload (forged signature) → 401 `invalid`
- [ ] Expired token → 401 `expired`
- [ ] Wrong issuer → 401 `wrong-issuer`
- [ ] Wrong audience → 401 `wrong-audience`
- [ ] Replayed jti → 409 `replay-detected`
- [ ] Missing token → 400 `malformed`
- [ ] Suspended student → 403 `not-permitted`
- [ ] Founder trust comes from enrollment record, not founder flag
- [ ] Key rotation works (old kid → rejected, new kid → accepted)
- [ ] Token lifetime is max 5 minutes

---

### OS-Side Auth Gate (v113 — Implemented)

**What's already built in `os.js`:**
- `rfxAuthGate()` — captures token, validates, populates AUTH from verified response, creates OS session, scrubs URL
- `AUTH` object — authentication state (separate from OS session)
- `OS_SESSION` object — study session (created AFTER auth)
- `TRUST_VERIFIED` — ONLY set inside `rfxAuthGate()`'s success path
- `wireOsLogout()` — clears AUTH + TRUST + OS_SESSION on logout
- Production: no token / invalid token → redirects to System A
- Dev: falls through to `loadHandshake()` (IS_DEV gate)
- Token NEVER stored in localStorage, S.handoff, or logs
- `S.handoff` populated from verified RESPONSE, not from the token

### Regression Test Matrix

**Production auth tests:**
- [ ] Founder authenticates → 100% Excellent
- [ ] Normal student authenticates → correct trust score
- [ ] Forged token → rejected (401)
- [ ] Expired token → rejected (401)
- [ ] Wrong audience → rejected (401)
- [ ] Replay → rejected (409)
- [ ] Missing token → redirected to System A
- [ ] Suspended student → 403 (not permitted)
- [ ] System A down → existing session persists (degraded)
- [ ] Direct `/os/` → cannot bypass auth

**Identity boundary tests:**
- [ ] Founder logout → next login = no identity leakage
- [ ] Duplicate logout → no double banking
- [ ] Refresh → same OS session
- [ ] Forged `S.handoff.founder=true` in localStorage → trust bar stays "—"
- [ ] localStorage manipulation → AUTH unchanged (Attack J)
- [ ] Post-auth URL manipulation → AUTH not reconstructed from storage (Attack H)

### Implementation Phases

| Phase | Scope | Status |
|-------|-------|--------|
| **1 — The Fort** | System A sole auth authority. Token generation. | 🔨 Lee builds endpoint |
| **2 — OS Gate** | Auth gate, credential lifecycle, production boundary. | ✅ v113 done |
| **3 — Session Liveness** | Heartbeat, auth expiry, degraded state, recovery. | ⏳ After endpoint works |
| **4 — Time Banking** | Exactly-once finalization, bank on logout. | ⏳ After heartbeat |

> **Do not start Phase 3 until `/api/verify-token` is implemented, tested, and one successful end-to-end authentication works. Build heartbeat around the real contract, not assumptions.**

### Implementation phases (in order)

| Phase | Scope |
|-------|-------|
| **1 — The Fort** | System A sole authority. Every OS route requires valid auth. Shortcut app cannot bypass. Direct URLs cannot bypass. One identity. Secure handoff. |
| **2 — OS Session** | Create session after auth. Unique session ID. Server-side timestamps. Visible Logout button. One session per student. Multi-tab guard. |
| **3 — Time Bank** | Separate Total from Live. Store seconds. Server-side duration. Bank on end. No double-credit. Session history. |
| **4 — Resilience** | Heartbeat. Activity detection. Inactivity warning. Auto-expiration. Browser-close protection. Network/sleep handling. |
| **5 — Polish** | Logout confirmation. Banking animation. Session status indicator. Session history display. Active/Idle/Paused states. |

### The student's mental model

```
System A     → "This is my Reality FX account."
Reality FX OS → "This is my Academy workspace."
OS Login     → "I'm entering the Academy."
Live Session → "I'm here right now."
Logout       → "I'm done for now."
Time Bank    → "That time has been permanently credited."
```

**There is never a second OS account. There is never a second password. The Fort remains the Fort.**

— Zorro (System B), 19 August 2026
