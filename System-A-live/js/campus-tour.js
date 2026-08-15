/* ============================================================
   THE CAMPUS CCTV CAMERA — a self-driving pan across the map,
   framed like a security-camera viewport.
   ------------------------------------------------------------
   Why this one does not shake: the pan/zoom animates the plain
   HTML .campus wrapper (a GPU-composited texture), never the SVG
   internals. The map text is rasterized ONCE at 2x resolution and
   then just glides — no per-frame glyph re-render, and the pan
   translate is snapped to whole pixels so nothing lands between
   pixels. Hover to pause; click a building or station to focus.
   Guide-only: the reception no longer carries the map.
   ============================================================ */
(function () {
  var vp = document.querySelector('.cam-viewport');
  var stage = document.querySelector('.cam-stage');
  var hud = document.querySelector('.cam-hud');
  var labelEl = hud ? hud.querySelector('.cam-label') : null;
  var timeEl = hud ? hud.querySelector('.cam-time') : null;
  if (!vp || !stage) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* The map viewBox is 0 0 1000 590; the stage is laid out at 2x
     (2000px wide) so even the closest zoom stays crisp. Scale values
     below are MULTIPLIERS over the "whole campus fits" base. */
  var RES = 2;

  /* cx/cy = map point the camera centres on · s = zoom multiplier
     move = glide ms into the shot · hold = dwell ms · label = HUD */
  var shots = [
    { cx: 500, cy: 295, s: 1.00, move: 0,    hold: 3800, label: 'The whole campus' },
    { cx: 165, cy: 245, s: 2.45, move: 2400, hold: 2800, label: 'The Front Desk' },
    { cx: 500, cy: 295, s: 1.00, move: 1900, hold: 900,  label: 'The whole campus' },
    { cx: 500, cy: 245, s: 2.45, move: 2400, hold: 2800, label: 'The Registration Gate' },
    { cx: 500, cy: 295, s: 1.00, move: 1900, hold: 900,  label: 'The whole campus' },
    { cx: 835, cy: 245, s: 2.45, move: 2400, hold: 2800, label: 'RFX OS Academy' },
    { cx: 500, cy: 295, s: 1.00, move: 2200, hold: 900,  label: 'Home again' }
  ];
  var idx = 0, t = 0;
  var pos = { cx: shots[0].cx, cy: shots[0].cy, s: shots[0].s };
  var manual = null;   /* { shot, t } while a clicked focus is playing */
  var paused = false;  /* hover-paused */
  var inView = true;   /* off-screen → the loop idles to save power */
  var last = null, shown = '';

  function ease(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }

  function applyTo(target) {
    /* The whole-campus base is whatever scale fits the viewport; the
       shot's multiplier rides on top. The pan translate is rounded to
       whole pixels so the texture never sits between pixels. */
    var vw = vp.clientWidth, vh = vp.clientHeight;
    var base = vw / (1000 * RES);
    var s = Math.round(target.s * base * 1000) / 1000;
    var tx = vw / 2 - target.cx * RES * s;
    var ty = vh / 2 - target.cy * RES * s;
    stage.style.transform = 'translate(' + Math.round(tx) + 'px,' + Math.round(ty) + 'px) scale(' + s + ')';
  }

  function setLabel(txt) {
    if (!labelEl || shown === txt) return;
    shown = txt;
    labelEl.textContent = txt;
  }

  function advance() {
    if (manual) { var m = shots[idx]; manual = null; t = 0; return m; }
    idx = (idx + 1) % shots.length;
    t = 0;
    return shots[idx];
  }

  function focusOf(el) {
    var stn = el.querySelector('.stn');
    if (stn) return { cx: parseFloat(stn.getAttribute('cx')), cy: parseFloat(stn.getAttribute('cy')) };
    var r = el.querySelector('.b-bg');
    if (r) return {
      cx: parseFloat(r.getAttribute('x')) + parseFloat(r.getAttribute('width')) / 2,
      cy: parseFloat(r.getAttribute('y')) + parseFloat(r.getAttribute('height')) / 2
    };
    return null;
  }

  /* click a building or a station → the camera walks over and holds */
  vp.addEventListener('click', function (e) {
    var g = e.target && e.target.closest ? e.target.closest('.bldg, .origin') : null;
    if (!g || !vp.contains(g)) return;
    var f = focusOf(g);
    if (!f) return;
    var nm = g.querySelector('.b-name, .o-lbl');
    var label = nm ? nm.textContent.trim() : 'This stop';
    manual = { shot: { cx: f.cx, cy: f.cy, s: 2.45, move: 2000, hold: 5600, label: label }, t: 0 };
    paused = false;
    if (hud) hud.classList.remove('paused');
  });

  vp.addEventListener('pointerenter', function () {
    paused = true;
    if (hud) hud.classList.add('paused');
    setLabel('Tour paused');
  });
  vp.addEventListener('pointerleave', function () {
    paused = false;
    if (hud) hud.classList.remove('paused');
  });

  /* a live CCTV timestamp in the HUD */
  if (timeEl) {
    var tick = function () {
      var d = new Date();
      timeEl.textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    };
    tick();
    setInterval(tick, 15000);
  }

  /* never burn frames while the map is off-screen */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inView = entries.some(function (e) { return e.isIntersecting; });
    }, { threshold: 0.02 }).observe(vp);
  }

  applyTo(pos);
  function frame(ts) {
    if (!last) last = ts;
    var dt = Math.min(ts - last, 100); /* a tab-switch can never cause a jump */
    last = ts;
    if (!paused && inView) {
      var sh = manual ? manual.shot : shots[idx];
      t += dt;
      if (t >= sh.move + sh.hold) sh = advance();
      var k = sh.move > 0 ? Math.min(t / sh.move, 1) : 1;
      var e = ease(k);
      var target = {
        cx: pos.cx + (sh.cx - pos.cx) * e,
        cy: pos.cy + (sh.cy - pos.cy) * e,
        s:  pos.s  + (sh.s  - pos.s)  * e
      };
      if (k >= 1) pos = { cx: sh.cx, cy: sh.cy, s: sh.s };
      applyTo(target);
      setLabel(k >= 1 ? sh.label : 'Panning to ' + sh.label);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
