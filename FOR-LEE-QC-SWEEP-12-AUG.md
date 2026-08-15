# FOR-LEE — Full QC Sweep, 12 August (both systems)

> Everything below is built, verified live in the browser, and synced to BOTH
> trees (`System-A-live` + `Reality-Fx-Registration-and-Member-s-panel`), which
> are now **byte-identical**. The OS (`REALITY-FOREX-TRADING-/os`) got its own
> unified version stamp. Work through the sections top to bottom.

---

## 1. ⚠️ THE BIG ONE — both trees are now ONE lineage (please keep it that way)

The source folder had drifted far behind the live copy — `member.js` 718 lines
vs 1,624, `ui.js` 160 vs 470, `staff.js` 244 vs 497, `pdf.js` 136 vs 431,
`bridge.js` 193 vs 228, plus css, assets and four HTML pages. **This drift is
exactly what caused the db.js lineage break** (member panel crash) — an old
lineage got copied over the rich one.

**Fixed:** every JS, CSS, asset and HTML file in the source tree is now a
byte-for-byte copy of the live-served tree. Verified with `cmp` — zero diffs
remaining, and `operating-guide.html` (which only existed in the served tree)
is now in the source too.

**The rule from now on:** the live-served `System-A-live` folder is the master.
After ANY edit, copy it into the source folder. Never copy the other direction
until you've diffed the exports. Add a `cmp -s` loop to your workflow if you
can — this is the third time tree drift has bitten us.

---

## 2. Reception — journey strip removed (done)

The 11-step "The journey" card is gone from the front desk (both trees —
HTML + the `renderJourney` code in `reception.js`). The reception now opens
straight into the six doors, the coupon card and the registration links. Clean,
no unnecessary decoration. Verified live: no empty `#journey` element, no
overflow, no cards touching.

## 3. Cache-buster — every System A page (done)

All 9 pages now stamp every JS and CSS asset with a single unified version
string: **`v=20260812-61`** (previously three pages — admin, index,
operating-guide — had NO stamps at all, so stale caches were serving old
code). The stamp must be bumped on EVERY content edit — that discipline is the
whole point. OS assets unified to `v=16` (was a mix of 11/13/15).

## 4. Staff console — duty buttons now show a load state (done)

Every manual duty's "Complete" button (including **"Run the full system
audit"**) now shows a spinner + "Running…" / "Auditing…" + disabled state the
instant it's clicked, then runs the real work and closes. Staff always see the
machine acknowledge the click — no more dead-looking buttons. Verified live:
spinner shows, button disables, duty completes, bar +1.

## 5. Numbers — white body figures everywhere (done)

The gold-serif numerals are gone from the staff console:

- Staff trust score (next to the ring): white Inter bold, tabular
- Wallet balance: white Inter bold, tabular
- Stat boxes (duty/report metrics): white Inter bold, tabular
- **Trust-ring centre number** (`.tr-pct`): now matches the OS rings —
  white body font, tabular, weight 700 (was gold serif). The caution/low/crit
  tints are kept — they carry meaning (amber/orange/red standing tiers).

Verified live on the console: balance `R2,000.00` and ring `88%` both render
`rgb(255,255,255)`, Inter, 700.

## 6. Layout audit — nothing is kissing (verified)

Measured live, not eyeballed:

- Reception → zero horizontal overflow, no touching cards
- OS dashboard → live-room cards to trader identity: **117px gap** (healthy)
- Admin console → registration funnel to the enrollments form below:
  **26px gap** (healthy)
- Machinery section stacks 1-per-row at narrow widths (correct responsive
  behaviour); on the OS the rings + labels render clean
- OS mobile menu opens and closes correctly: burger opens, and the ✕ button,
  the dimmed backdrop AND picking any destination all close it (verified by
  driving the real DOM)

## 7. Handshake chain — live and healthy (verified)

From the browser network log on the OS page:

- `GET /os/api/handoffs` → **200**
- `POST /os/api/session/heartbeat` → **200**
- System A store sync → **200**

The sidebar "My RFX Account" + "Reception" return-trip links are present and
live ("Academy link · live — your record is held"). The only console noise is
the known dev-only gap: the local Perl server lacks `/api/flags` (404/429) —
**production Netlify has those routes**; it is a local-server limitation, not
an app bug.

## 8. Course scope — the journey is fully alive (verified)

All 13 chapters render with per-lane scope, counted live from the decks:

- **Standard** — 774 slides · 337 assessment questions · ≈22h 56m (13/13 chapters)
- **Challenging** — 681 slides · 283 questions · ≈21h 52m (6/13 deep-dive decks)
- **Elite** — 729 slides · 304 questions · ≈22h 14m (3/13 deep-dive decks)

Ch. 1 "The Forex Market" is live with Begin; the rest lock behind it as
designed. The "0/1067 slides explored" figure on the dashboard now counts the
full inventory.

---

## What's left / for you

- **Firestore (your #1):** coupons, staff trials, calendar + support threads —
  transactional guarantees (two prospects must never burn the last coupon use
  at once). See the production brief.
- The OS stamp discipline applies to Netlify too — every deploy rebuilds the
  zip from the folder with the current stamps, so the live site always matches
  the served tree.
