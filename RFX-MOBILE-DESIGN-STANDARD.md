# 👑 REALITY FX — MOBILE DESIGN STANDARD

*The founder's design law, written as a buildable spec. Every screen of the mobile app
must pass this page — it is the same law the web OS was built under, and it is
non-negotiable. If a screen does not meet it, it is not done.*

---

## 1. The palette (taken verbatim from the OS `:root`)

| Token | Value | Use |
|---|---|---|
| `--bg-primary` | `#0A0A0A` | App background (near-black) |
| `--bg-deep` | `#050505` | Deepest wells, modals, bottom sheets |
| `--bg-panel` | `#101010` | Panels, page sections |
| `--bg-card` | `#141414` | Cards, tiles |
| `--accent-gold` | `#C9A227` | The gold. Borders, icons, emphasis |
| `--accent-gold-light` | `#E5C158` | Gold text on dark, active states |
| `--accent-gold-dim` | `rgba(201,162,39,.14)` | Gold washes, hover fills |
| `--text-body` | `#E5E5E5` | Body text |
| `--text-muted` | `#8a8a8a` | Secondary text |
| `--text-dim` | `#5c5c5c` | Tertiary / captions |
| `--ok` | `#2e8b57` | Success (soft green — "live", "verified") |
| `--danger` | `#c0392b` | Errors, destructive actions |
| `--border-subtle` | `rgba(201,162,39,.18)` | Card borders — subtle, never loud |
| `--glass-border` | `rgba(255,255,255,.07)` | Hairline dividers |
| `--grad-gold` | `linear-gradient(135deg,#8a6d1f 0%,#C9A227 45%,#E5C158 60%,#C9A227 75%,#8a6d1f 100%)` | The signature gradient: brand marks, the crown, CTA fills |

**Never introduce a competing colour.** No other yellow, no blue, no purple. Green is
reserved for status ("live", "verified", "passed") and red for danger only.

## 2. Type

- **Headings:** Playfair Display (Georgia fallback), serif, gold or near-white. The
  Academy voice lives in serif — never a sans heading.
- **Body / UI:** Inter (system-ui fallback), sans.
- **Quotes:** Playfair italic — the Academy's voice ("Every lesson is a trade. Every
  trade is a lesson."). Must be readable; never thin or faded to invisibility.
- Uppercase + letterspacing (`letter-spacing: 1.5–2.5px`) for eyebrow labels and pills
  only — small, precise, never loud.

## 3. Spacing & layout laws

- **Breathing room over density.** Sections separate generously (26–46px rhythm); cards
  never touch ("kissing" is a defect — nothing kisses anything).
- **One alignment grid.** Everything lines up to the same vertical rhythm. A screen with
  two misaligned columns is a bug.
- **Auto-fill grids must balance.** Where cards auto-fill, the last row must never leave
  an orphan — use even 2×2 / 3×3 fills or the grid is wrong. (The 2,2,2 rule: rows
  complete before a new one starts.)
- **Full width, no cut-off text.** Never truncate to save space. Longer content gets more
  page, never smaller text. A page can be 20 pages if it must — it is never chopped.
- **Safe areas.** Respect status bar, gesture bar, notches. No content under the system
  chrome, no zoom jank, no horizontal overflow.

## 4. The pill standard

- **One pill rhythm OS-wide: 26px height, 30px radius, padding 0 12px.**
- Uppercase, letterspaced, gold border on dark (`rgba(212,175,55,.4)`), gold-light text.
- Status pills: green border/text for live/verified, neutral for idle, red for danger.
- Same height and length for pills that sit together — a row of mismatched pills is a
  defect (the founder's words: "make them all the same height and length").

## 5. Icons

- **Bare SVG, 1em stroke weight, inherited colour — never giant decorative images.**
- The crown is the only mark that may glow (a soft gold drop-shadow), and even it stays
  small and restrained. A huge icon is a defect.
- Icon + label always aligned on the same baseline; icon chips are 26px to match pills.
- Every icon must resolve — an unknown key falls back to a neutral mark, **never**
  "undefined".

## 6. Cards & the premium feel

- Cards: `#141414` fill, 1px `--border-subtle` border, rounded 12–14px.
- **Hover (desktop) / press (mobile):** a subtle gold treatment — border to
  `rgba(212,175,55,.35)`, a 2px lift, and a soft gold glow
  (`0 0 0 1px rgba(212,175,55,.22), 0 14px 36px rgba(212,175,55,.15)`). The icon scales
  ~1.2× with a gold drop-shadow. Restrained, never a neon button, never an aggressive
  pulse.
- **The travelling border (the founder's favourite):** on the single most important card
  of a screen (the selected lane, the active challenge), a very thin gold line
  continuously travels around the border. Subtle, smooth, alive. One per screen, never
  more, never neon.

## 7. Performance budget (architectural, not aspirational)

- **No timers, no polling loops** in the UI for its own sake. Static-first: state is
  read and painted on action.
- In-place updates only — never rebuild a list to change one row.
- Storage writes happen on action, batched, never per tick.
- Charts/sim feeds load once and are never re-rendered by ticks.

## 8. Honesty & trust

- **Nothing shows as already-won before it is won.** No fabricated leaderboards, no
  fabricated graduates, no fake counts. Empty walls say "the first name on this wall
  becomes the standard."
- Every identity surface shows the verified ID plainly (green dot + "(Verified!)").
- Errors are spoken plainly — the machine reports its own condition honestly.

## 9. Motion

- One transition rhythm: `all .35s cubic-bezier(.25,.46,.45,.94)`.
- Animations must be subtle, purposeful, and never block content. No spinner that never
  resolves; no infinite pulses on static content.

---

*Pass or fail. There is no "close enough" — the founder can see it from across the room.*
