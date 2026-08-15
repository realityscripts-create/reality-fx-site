# Reality FX OS — PWA layer

The installable-app layer for the Academy. **Deliberately lives OUTSIDE the
OS file group** (`REALITY-FOREX-TRADING-/os/`) so the OS stays pure — this
folder is the only thing that knows about app-shell concerns.

```
rfx-pwa/
  manifest.json   – app identity, icons, standalone display, shortcuts
  sw.js           – service worker: offline shell + cache-first course assets
  register.js     – SW registration, native install prompt, iOS hint, slide warm
  push.js         – web-push (VAPID) scaffolding, FCM-ready (not yet configured)
  install.html    – the branded “put the Academy on your home screen” guide
  make-icons.ps1  – regenerates the crown icons (System.Drawing, no deps)
  _headers        – Netlify: Service-Worker-Allowed: / + no-cache on worker
```

## How it's wired (one tiny edit in the OS)
`os/index.html` adds three lines — a manifest link, the mobile metas, and the
register script. That's the whole OS-side footprint:

```html
<link rel="manifest" href="../rfx-pwa/manifest.json">
<meta name="theme-color" content="#C9A227">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<script defer src="../rfx-pwa/register.js"></script>
```

The OS can then use three zero-knowledge hooks without owning any PWA code:
- `window.RFXInstallApp()` → prompts install (native where supported, iOS hint otherwise)
- `window.RFXIsPwaInstalled()` → true once installed
- `window.RFXWarmSlides(urls)` → quietly caches a chapter's slide images

## Layout (one rule)
Production serves the OS at the **site root** — `deploy-live.sh` stages
`index.html`, `css/`, `js/` at `/`, and that is what the manifest and
service worker assume (`start_url: "/"`, shell paths under `/`). If the OS
is ever hosted under `/os/` instead (e.g. the drop-zip layout), prefix the
paths in `manifest.json` and `sw.js` with `/os` — that's the only change.

## Deploying (Netlify)
1. `rfx-pwa/` must be part of the deploy root (it is — the drop zip includes it).
2. `_headers` is picked up by Netlify automatically → the worker gains scope `/`.
3. Push: once configured (see `push.js` step 1), subscriptions POST to
   `/os/api/push/subscribe` and sends go through the `web-push` package.
   The OS shows no push UI until that endpoint exists — same rule as the
   achievement rail: nothing doubles, nothing pretends.

## Testing locally
Serve the site root (e.g. `python -m http.server 8000` at the repo root —
**not** inside `os/`, or the `../rfx-pwa/` paths break), open
`http://127.0.0.1:8000/index.html`, then DevTools → Application → Service
workers. The offline test: Network → Offline, reload — the shell and every
visited slide still render.
