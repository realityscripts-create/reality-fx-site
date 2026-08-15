/* ============================================================
   Reality FX OS — PWA registration & install flow
   Loaded from os/index.html (outside the OS file group — this file
   lives in /rfx-pwa/). Registers the service worker at site scope,
   shows a native install prompt where supported, and teaches iOS
   users the Share → Add to Home Screen dance.
   ============================================================ */
(function () {
  if (!("serviceWorker" in navigator)) return;

  var SW = "/rfx-pwa/sw.js";
  var installedKey = "rfx_pwa_installed";

  /* 1. Register the worker — scope "/" (allowed via _headers). */
  window.addEventListener("load", function () {
    navigator.serviceWorker.register(SW, { scope: "/" }).catch(function (e) {
      console.warn("RFX PWA: service worker registration failed", e);
    });
  });

  /* 2. Capture the native install prompt and expose it as a custom event,
        so the OS can show an "Install the app" affordance without owning
        any PWA code of its own. */
  var deferred = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferred = e;
    window.dispatchEvent(new CustomEvent("rfx:pwa-installable", { detail: { prompt: e } }));
  });
  window.addEventListener("appinstalled", function () {
    try { localStorage.setItem(installedKey, "1"); } catch (e) {}
    deferred = null;
    window.dispatchEvent(new CustomEvent("rfx:pwa-installed"));
  });

  /* 3. OS hook: window.RFXInstallApp() — call it from a button click. */
  window.RFXInstallApp = function () {
    if (deferred) {
      deferred.prompt();
      deferred.userChoice.then(function (c) {
        if (c.outcome === "accepted") { try { localStorage.setItem(installedKey, "1"); } catch (e) {} }
        deferred = null;
      });
      return true;
    }
    // iOS (no beforeinstallprompt): teach the Share → Add to Home Screen step.
    var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (isIOS) {
      window.dispatchEvent(new CustomEvent("rfx:pwa-ios-hint"));
      return true;
    }
    return false;
  };

  /* 4. Installed check for the OS. */
  window.RFXIsPwaInstalled = function () {
    try {
      return localStorage.getItem(installedKey) === "1" ||
        window.matchMedia("(display-mode: standalone)").matches;
    } catch (e) { return false; }
  };

  /* 5. Warm the next chapter's slides when the tab is idle. */
  window.RFXWarmSlides = function (urls) {
    if (!navigator.serviceWorker || !urls || !urls.length) return;
    navigator.serviceWorker.ready.then(function () {
      navigator.serviceWorker.controller &&
        navigator.serviceWorker.controller.postMessage({ type: "WARM_SLIDES", urls: urls });
    });
  };
})();
