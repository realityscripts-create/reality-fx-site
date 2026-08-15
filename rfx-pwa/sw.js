/* ============================================================
   Reality FX OS — Service Worker
   Offline-first for the whole course. The OS is device-native
   (progress lives in localStorage); this worker makes the shell
   and every course asset work with no connection at all.

   Scope note: this file lives at /rfx-pwa/sw.js but is allowed to
   control the whole site (scope "/") via the Service-Worker-Allowed
   header set in rfx-pwa/_headers on Netlify.
   ============================================================ */

/* Production layout: deploy-live.sh stages the OS at the SITE ROOT
   (index.html, css/, js/ at "/"). If the OS is ever hosted under
   /os/, prefix every path below with /os. */
const VERSION = "rfx-pwa-v1";
const SHELL = [
  "/index.html",
  "/css/os.css",
  "/js/os.js",
  "/js/icons.js",
  "/js/data.js",
  "/js/sim.js",
  "/js/journal.js",
  "/rfx-pwa/manifest.json",
  "/rfx-pwa/icon-192.png",
  "/rfx-pwa/icon-512.png"
];

/* Assets we never cache: live endpoints must always hit the network. */
const NEVER_CACHE = [
  "/api/", "/os/api/", "/os/rooms/", "gate", "handoff", "sessions"
];

self.addEventListener("install", (ev) => {
  ev.waitUntil(
    caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (ev) => {
  ev.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

function isNeverCached(url) {
  return NEVER_CACHE.some((frag) => url.indexOf(frag) !== -1);
}

self.addEventListener("fetch", (ev) => {
  const req = ev.request;
  if (req.method !== "GET") return;
  const url = req.url;

  // Live rails always hit the network (gate probe, rooms, sessions, handoff).
  if (isNeverCached(url)) return;

  // Navigation: network-first with offline fallback to the cached shell.
  if (req.mode === "navigate") {
    ev.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  // Everything else: cache-first, then network, caching what we fetch.
  ev.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match("/index.html"));
    })
  );
});

/* Background slide warm: when the page is idle, quietly cache the next
   chapter's slide images so the first lesson offline is instant. */
self.addEventListener("message", (ev) => {
  if (ev.data && ev.data.type === "WARM_SLIDES") {
    const urls = ev.data.urls || [];
    ev.waitUntil(
      caches.open(VERSION).then((c) => Promise.all(
        urls.map((u) => caches.match(u).then((hit) => hit || fetch(u).then((r) => { c.put(u, r); })))
      ))
    );
  }
});
