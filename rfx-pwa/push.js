/* ============================================================
   Reality FX OS — Push notification scaffolding
   Web Push (VAPID) is the no-store path to "a message arrived"
   on Android + desktop Chrome. iOS supports web push from 16.4+
   once the app is on the home screen.

   STEP 1 (admin, one time):
     npx web-push generate-vapid-keys
     → paste the PUBLIC key below and store the PRIVATE key in
       .freebuff/tools/secrets.env as VAPID_PRIVATE_KEY (never in git).
   STEP 2 (server, production):
     POST /os/api/push/subscribe { endpoint, keys } from here;
     send via https://www.npmjs.com/package/web-push
   This file is scaffolding — the OS has no push UI until the
   endpoint above exists, exactly like the achievement rail.
   ============================================================ */
(function () {
  var VAPID_PUBLIC = "PASTE_YOUR_PUBLIC_VAPID_KEY_HERE";

  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
  if (VAPID_PUBLIC.indexOf("PASTE") === 0) return; // not configured yet

  function urlBase64ToUint8Array(base64) {
    var padding = "=".repeat((4 - (base64.length % 4)) % 4);
    var raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
    return new Uint8Array([].map.call(raw, function (c) { return c.charCodeAt(0); }));
  }

  window.RFXSubscribePush = function (onDone) {
    navigator.serviceWorker.ready
      .then(function (reg) { return reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC)
      }); })
      .then(function (sub) {
        var payload = sub.toJSON();
        return fetch("/os/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: payload.endpoint, keys: payload.keys })
        });
      })
      .then(function (r) { if (onDone) onDone(r.ok); })
      .catch(function (e) { console.warn("RFX push subscribe failed", e); if (onDone) onDone(false); });
  };
})();
