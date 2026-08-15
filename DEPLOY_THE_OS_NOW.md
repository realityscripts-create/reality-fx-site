# ✅ GO LIVE — DONE (11 Aug 2026, ~11:35 local)

**The OS is live and the handshake rail is answering. The two screens now match.**

---

## ⚠️ STATUS UPDATE (11 Aug, afternoon) — BUILD CREDITS EXHAUSTED

**Everything is live EXCEPT the new Live-Trade Scenario content, which is
staged and verified but cannot be deployed until the account has build
credits.** Netlify skipped the last builds with:

> `Skipped due to account credit usage exceeded`

The free plan includes 300 credits/month (no rollover, no overages); the
many 237MB deploys today consumed them. The Build API is the ONLY deploy path
that keeps the security rail alive (the drop zone drops the function, and
direct-upload functions never receive the site's env vars — tested twice), so
this is a hard block until credits exist again.

**Live right now:** os.js v=11 · slides metric (0/1,067 across all three lanes) ·
email rail delivering real codes (demo-code fallback gone) · handoff rail 200 ·
old key still 403.

**Staged in `RFX-OS-DEPLOY.zip` (v=14), verified in the real player:**

1. **27 Live-Trade Scenario slides** across all 9 tier decks (Challenging
   ch1–6, Elite ch1–3) — the first-live-trade walkthrough, the derivative
   hold, the NFP two-way spike, breakout-vs-fakeout, the reversal you
   anticipated, in-trade psychology protocols — plus repaired deck layouts in
   ch3/ch4/ch5/ch6 that were silently inconsistent.
2. **Completion-time recognition + the Trust Bar hall pass** — the OS now
   times every attempt; a chapter finished well ahead of the honest estimate
   on a high Trust Bar earns a public “well done” card (verified end-to-end:
   100% pass in 4 min vs ~60 min expected → recognition fired, zero flags),
   while the same speed with a low bar stays evidence for the moderator. All
   timing heuristics (fast answers, perfect-fast, rhythm/reading/streak/
   pattern/jump-retake/paused-search) are gated behind the Trust Bar, and the
   trust score now loads at boot so the hall pass works on the very first
   lesson (a live test caught it only loading on the dashboard — fixed).
3. **White-number theme** — ring labels, stat cards, session timer, exam
   clock, drawdown figures, poll percents now render white numbers next to
   the gold icons instead of clashing gold-on-gold.
4. **Study Hall pill no longer kisses the trader identity card** (dash-live
   bottom margin 2px → 24px).
5. **Reflection-pause CTA guard** — when the only unfinished chapter is
   locked behind its reflection window, the dashboard now says “Review —
   [chapter] · retake unlocks in Xm” instead of misleadingly offering
   “Claim your certificate” to a 0% student.

**Verified live in the real player:** a full Challenging chapter-1 run
answered all 10 checkpoint questions correctly in ~4 minutes (vs ~60 min
expected) with the founder's 100% Trust Bar — the recognition card fired
("Well done — that was fast…"), and the integrity heuristics raised zero
flags (the hall pass). The founder's own record was restored byte-for-byte
after the test (54 XP · 0% course · 89% accuracy — unchanged).

**To ship it the moment credits exist:** `bash .freebuff/deploy-os.sh`
(the upload is now unstall-proof: Expect:-disabled + speed-limit retry).
Options: (1) check the Netlify dashboard credit meter, (2) upgrade or ask
Netlify support for a credit grace, (3) wait for the monthly reset (~Sep 10).
Future deploys should bundle changes — each 237MB build spends real credits.

- **https://reality-fx-os.netlify.app** — the OS, latest build (v6 cache-bust stamps)
- **https://reality-fx-os.netlify.app/api/handoffs** → returns JSON (not 404)
- **https://reality-fx-os.netlify.app/os/api/handoff** → mints verified identities
  (tested live: minted RFX-10482 · Leeroy Chirwa · founder → greeted back)

Everything rides the same rail: single-session guard, device gate, fair-play
flags, live rooms, email relay. It is genuinely live.

---

## How to deploy updates from now on (IMPORTANT — verified 11 Aug 2026)

**The site's drag-and-drop zone silently DROPS the function** — proven the
hard way: dropping `RFX-OS-DEPLOY.zip` on reality-fx-os → Deploys updated the
static OS but killed the rail (`/api/*` 404, no function). The drop zone only
uploads static files; the Build API is the ONLY path that wires the function
and injects the env vars.

So: **always deploy via the Build API.** Never use app.netlify.com/drop
(creates a new site) and never the site's drop zone (drops the function).

**ONE-COMMAND DEPLOY — the only command you'll ever need:**

```bash
bash .freebuff/deploy-os.sh
```

It syncs the working files, bumps the cache-bust stamp, builds the zip,
uploads via the Build API, waits for it to go live, and verifies the rail
(handoffs 200 · old key 403 · new key 200). ~5 minutes, done. The Netlify
token lives in `.freebuff/tools/netlify-token.txt` (it can also come from the
`NETLIFY_TOKEN` env var). If the upload ever hits a gateway 502, just run it
again — the script is idempotent.

**Env vars set on the site** (they only reach functions via the build pipeline):
- `NETLIFY_BLOBS_CONTEXT` + `RFX_BLOBS_CONTEXT` — blob-store credentials the
  rail reads to store handoffs/flags/sessions/rooms.
- ⚠️ They contain the personal access token (`nfp_…`). If you ever rotate that
  token, update BOTH vars (base64 JSON: `{"apiURL":"https://api.netlify.com",
  "token":"…","siteID":"3c3b9935-9865-47dc-9db0-80de5f8e4591"}`).

---

## ✅ Handoff key — ROTATED (11 Aug 2026)

The demo key is **dead**. The rail now requires:

`RFX_HANDOFF_KEY = 31wO3R5r7OTi00QfNbQeUybc7lpoIGp3`

Verified live: old demo key → 403 rejected, new key → accepted.

**LEE — ACTION REQUIRED:** set `handoffApiKey` to the value above in System A's
settings (db.js state / the staff console settings panel). Until he does, the
bridge will be rejected when demoMode is turned off. The key lives in the
Netlify env vars; if it ever needs rotating again, change it there and redeploy
via the build pipeline (drop zone on the real site).

---

## Cleanup

- `cool-chaja-b9ec6e` — the accidental Drop site. Harmless; delete it from the
  Netlify dashboard whenever you like (Projects → … → Delete project).
- Three inert "uploading" deploys remain on reality-fx-os from earlier API
  experiments — they never published, they can't be deleted via API, ignore them.

---

## What Lee needs to know (copy-paste for him)

> The OS handshake rail is LIVE on Netlify. `POST /api/handoff` (key header
> `X-RFX-Handoff-Key`) mints identities into the Netlify Blobs store and
> `GET /api/handoffs` serves them to the OS. I tested it end-to-end with the
> founder's identity — received:true, greeted back. Your bridge.js already
> targets this exact endpoint. Next steps on your side: (1) set `demoMode:
> false` when you're ready for real traffic, (2) the handoff key will rotate
> before real students — I'll send you the new value, (3) never deploy the OS
> via app.netlify.com/drop (it creates a new site and can't run functions) —
> use the site's own Deploys drop zone.
