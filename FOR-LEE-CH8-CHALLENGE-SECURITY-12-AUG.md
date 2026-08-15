# FOR-LEE — Chapter 8 Forged · Trading Challenge Sim · Security Sweep · 12 Aug 2026

> System B (OS) report. Audit is now **10/10 ALL GREEN** (was 9). Work
> below is built and verified live (OS v31, System A v20260812-66).

---

## 1. ⚖️ Chapter 8 Challenging — "Pairs" forged (8/13 deep-dived)

34 slides (22 depth slides + 12 assessments) on choosing your battlefield:
the pair as a two-currency fight, pip-value math on the cross, correlation
grids and the hidden position, session liquidity maps, pair personalities,
the carry engine, the exotic spread tax (USD/ZAR), base/quote mindset,
crosses as middlemen, news as a currency event, slippage and fills, the
home-currency trap, building the shortlist, swaps/rollover/weekend gaps,
baskets and the DXY, and the pair-reading routine. Verified live in the
browser — journey shows Chapter 8 · 34 slides in the Challenging lane.

## 2. 🏆 The Trading Challenge sim — the RFX FTMO Challenge, reborn institution-grade

The founder's idea, built: a controlled demo-trading arena where **the
machine grades ability, not profit**.

- **Four challenges**: RFX FTMO Challenge ($10k, +8% target, 2% risk cap,
  10% drawdown line), Risk Management Challenge (1% leash — the tightest),
  Consistency Challenge (15+ trades, R-steadiness scored), Prop-Style
  Challenge (two-phase, $50k). All demo — no real money ever.
- **A real trading floor**: order engine (market entries, stop-loss /
  take-profit hard fills), live price feed from a free market API with an
  offline-safe simulated path, and a **TradingView live chart** (loads on
  demand — the page stays fast).
- **The machine enforces the rules**: risk-per-trade caps (oversized
  orders rejected with a suggested size), the drawdown red line (locks the
  account with the lesson intact), revenge-sizing detection, overtrading
  detection.
- **The machine grades**: profitability (28%), risk-adjusted (25%),
  discipline (27%), consistency (20%) → a score, PASS/REVIEW verdict, and
  a signed leaderboard entry. Verified end-to-end in the browser: gate
  blocked, order opened, closed at +0.45R, machine scored it 48/100,
  leaderboard showed "1 · Leeroy Chirwa · RFX-10482 · 48/100".
- Found + fixed during testing: a 5s poller was eating half-typed order
  forms (draft preserved now) and rebuilding the chart iframe every tick
  (now preserved / on-demand).

## 3. 🔴 Red-audit alert

When any Machine Audit check is red (or the rail dies), the founder now
hears it: a persistent red banner at the top of the audit page, a toast on
every red run, and a ⚠ AUDIT RED tab-title badge until it's green again.

## 4. 🪪 Government ID — verified off, forever

The founder spotted "Government ID / passport" under registration identity.
Confirmed: Reality FX does **not** collect IDs (`idNumber: 'off'` is forced
in the store), and the field was already JS-hidden — but it could flash on
stale caches. Now the field is `hidden` **in the markup itself** and only
reveals if a future setting ever asks for it. The review screen already
states "not collected — Reality FX does not request ID or passport numbers."

## 5. ✉️ Free domain for live email — the honest path

Everything on our side is armed (env vars set, branded templates, rail
tested). The only missing piece is a **verified sender domain** in Resend —
the free option that actually works is **eu.org** (a free subdomain, DNS
control, ~days-weeks approval), with the "fast but ~$4/yr" alternative of
a cheap TLD. The moment any domain is verified, set `RFX_MAIL_FROM` to
`hello@<domain>` and real students receive mail — no code changes.

## What I still need from you

1. The **Netlify build credits** before the next live deploy can land
   (the one-command deploy is ready and credit-gated).
2. The **domain step above** when you're ready to go live on email.
3. When Firebase lands, the challenge leaderboard, DLP and access log
   mirror server-side automatically — the browser layer is the demo
   surface, the platform is the enforcement layer.
