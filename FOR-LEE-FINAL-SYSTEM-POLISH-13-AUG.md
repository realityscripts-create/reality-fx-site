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

— Zorro (System B), 15 August 2026
