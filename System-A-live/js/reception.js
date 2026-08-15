/* Reception (index.html) */
(function () {
  'use strict';
  const db = RFX.db, ui = RFX.ui;

  function renderOpenLinks() {
    const card = document.getElementById('open-links');
    const open = db.enrollments().filter(e => e.registration && !e.registration.submittedAt && e.state === 'PENDING');
    if (!open.length) { card.style.display = 'none'; return; }
    card.style.display = 'block';
    const rows = open.map(e => {
      const link = location.href.split('/').slice(0, -1).join('/') + '/register.html?token=' + e.registration.token;
      return '<div style="display:flex;align-items:center;gap:14px;padding:11px 0;border-bottom:1px solid var(--border);flex-wrap:wrap;">' +
        '<span style="flex:1;min-width:200px;"><b style="color:var(--text);">' + ui.esc(e.payment.customerName) + '</b><br><span class="small">' + ui.esc(e.payment.email) + '</span></span>' +
        '<span class="small" style="color:var(--faint);">expires ' + db.fmtDateShort(e.registration.tokenExpiresAt) + '</span>' +
        '<a class="btn btn-ghost btn-sm" href="' + link + '" target="_blank">Open registration →</a>' +
        '</div>';
    }).join('');
    card.innerHTML = '<div class="eyebrow muted" style="margin-bottom:10px;">Active registration links (demo)</div>' + rows;
  }

  function renderDutyPill() {
    const pill = document.getElementById('on-duty-pill');
    if (!pill) return;
    const n = db.onDutyCount();
    pill.innerHTML = n > 0
      ? '<span class="dot ok pulse"></span> Reception · 24/7 · ' + n + ' team member' + (n === 1 ? '' : 's') + ' on duty now'
      : '<span class="dot warn"></span> Reception · 24/7 · checking coverage…';
  }

  /* ---------------- smart door --------------
     The dashboard already knows what you need next, before you click
     anything. One door carries the gold glow + a tag; the hint below
     says why. Priorities: a live registration link -> Members; no
     enrollments yet -> Staff Console; an approved student awaiting the
     handoff -> Staff Console; everyone active -> Members (the gateway). */
  function smartDoor() {
    const enrs = db.enrollments();
    const open = enrs.filter(e => e.registration && !e.registration.submittedAt && e.state === 'PENDING');
    if (open.length) return { key: 'member', hint: 'A registration link is live — complete your registration before it expires.' };
    if (!enrs.length) return { key: 'admin', hint: 'No paid enrollments yet — receive the first one here.' };
    const pendingHandoff = enrs.filter(e => e.state === 'APPROVED' && !e.handoff.confirmedAt);
    if (pendingHandoff.length) return { key: 'admin', hint: pendingHandoff.length + ' approved student' + (pendingHandoff.length === 1 ? '' : 's') + ' awaiting the RFX OS handoff — confirm the bridge.' };
    const active = enrs.filter(e => e.state === 'ACTIVE');
    if (active.length) return { key: 'member', hint: active.length + ' active student' + (active.length === 1 ? '' : 's') + ' — your identity, credit and gateway into RFX OS.' };
    return { key: 'member', hint: 'Your student identity, RFX credit and your gateway into RFX OS.' };
  }
  function renderSmartDoor() {
    const doors = Array.prototype.slice.call(document.querySelectorAll('.door'));
    if (!doors.length) return;
    const target = smartDoor();
    const tag = document.getElementById('smart-hint');
    doors.forEach(d => {
      const isSmart = d.dataset.smart === target.key;
      d.classList.toggle('card-gold', isSmart);
      const t = d.querySelector('.door-tag');
      if (t) {
        t.innerHTML = (RFX.icons && RFX.icons.sparkles ? RFX.icons.sparkles : '') + ' For you';
        t.hidden = !isSmart;
      }
    });
    if (tag) tag.textContent = target.hint;
  }

  renderOpenLinks();
  renderSmartDoor();
  /* ---------------- the Academy door ----------------
     "Enter the Academy" jumps straight into RFX OS. When an ACTIVE student
     exists on this device's store, the link deep-links to that identity
     (?sid=) so the OS greets them by name instead of a generic dashboard. */
  function renderAcademyDoor() {
    const door = document.getElementById('academy-door');
    if (!door) return;
    let url = db.osIndexUrl();
    // Prefer the EARLIEST active enrollment (the founding account on this
    // device) so the deep link greets the person who set the system up.
    const active = (db.enrollments() || [])
      .filter(e => e.state === 'ACTIVE' && e.studentId)
      .sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }))[0];
    if (active && active.studentId) url += '?sid=' + encodeURIComponent(active.studentId);
    door.setAttribute('href', url);
  }

  /* ---------------- RFX coupon (the golden ticket) ----------------
     Self-service: a prospect who was handed a code (partner, scholarship,
     easter egg) applies it right on the front door. Validation happens
     BEFORE any details are collected; redemption mints the enrollment
     (tagged with the coupon), fires the standard registration invite +
     emails, and returns the secure link — the registration phase is never
     skippable. Once-and-done: expired or fully-redeemed coupons are dead.
     Same feel as the demo pass: gold card, link + email delivery. */
  function couponCard() {
    const btn = document.getElementById('btn-coupon');
    if (!btn) return;
    btn.addEventListener('click', () => openCouponModal());
  }
  function couponCodeField() {
    return '<div class="field"><label>Your coupon code</label><input class="input mono" id="cp-code" placeholder="e.g. RFX-K4YLKX" style="text-transform:uppercase;" maxlength="20" autocomplete="off"></div>';
  }
  function openCouponModal(initialCode) {
    // the website deep-link (?coupon=CODE on the front door) pre-fills the
    // code and validates it immediately — the prospect never types it twice.
    const pre = (initialCode || '').trim().toUpperCase().slice(0, 20);
    const m = ui.modal(
      '<div class="coupon-flow">' +
      '<p class="small" style="margin-bottom:16px;">Enter the code you were given. If it is valid, you\'ll claim your course access — then complete the standard registration like every student. <b>Coupons are once-and-done:</b> expired or fully used, they cannot be renewed.</p>' +
      couponCodeField() +
      '<button class="btn btn-gold" id="cp-validate" style="width:100%;margin-top:4px;"><span data-icon="gift"></span> Check my coupon</button>' +
      '</div>');
    m.setTitle('Redeem your Reality FX coupon');
    if (pre) m.el.querySelector('#cp-code').value = pre;
    const go = () => {
      const code = (m.el.querySelector('#cp-code').value || '').trim();
      if (!code) { ui.toastErr('Enter the coupon code you were given.'); return; }
      const v = db.validateCoupon(code);
      if (!v.ok) { ui.toastErr(v.msg); return; }
      // valid — golden ticket revealed, then collect the student's details
      m.el.querySelector('.coupon-flow').innerHTML =
        '<div class="coupon-ok" style="border:1px solid rgba(29,122,51,.4);background:rgba(29,122,51,.08);border-radius:12px;padding:14px 16px;margin-bottom:16px;">' +
        '<p style="margin:0 0 4px;color:#2f9e5f;font-weight:700;">✓ ' + ui.esc(v.coupon.code) + ' — your coupon is valid</p>' +
        '<p class="small" style="margin:0;color:var(--text);"><b>' + ui.esc(v.label) + '</b> · ' + ui.esc(v.msg) + '</p></div>' +
        '<div class="field"><label>Your full name</label><input class="input" id="cp-name" placeholder="Full name as you want it registered"></div>' +
        '<div class="field"><label>Your email</label><input class="input" id="cp-email" type="email" placeholder="you@example.com"></div>' +
        '<button class="btn btn-gold" id="cp-redeem" style="width:100%;margin-top:4px;"><span data-icon="gift"></span> Claim my course access</button>' +
        '<p class="small faint" style="margin-top:12px;">Claiming sends your invoice + registration email now — your registration link is secure and single-use, and you cannot skip the registration phase.</p>';
      m.el.querySelector('#cp-redeem').addEventListener('click', () => {
        const name = m.el.querySelector('#cp-name').value.trim();
        const email = m.el.querySelector('#cp-email').value.trim();
        const r = db.redeemCoupon(code, name, email);
        if (!r.ok) { ui.toastErr(r.msg); return; }
        const base = location.href.split('/').slice(0, -1).join('/');
        const link = base + '/register.html?token=' + r.token;
        m.el.querySelector('.coupon-flow').innerHTML =
          '<div class="coupon-done" style="text-align:center;padding:10px 0 6px;">' +
          '<div class="door-ic" data-icon="gift" style="margin:0 auto 12px;"></div>' +
          '<h3 class="serif" style="font-size:21px;margin-bottom:6px;">' + (r.idempotent ? 'Already claimed — here\'s your link again' : 'Your course access is claimed') + '</h3>' +
          '<p class="small" style="color:var(--muted);margin-bottom:14px;">' + ui.esc(r.label) + (r.idempotent ? ' · we did not create a duplicate — same email, same access.' : ' · your invoice + registration email are on their way to your inbox.') + '</p>' +
          '<input class="input mono" id="cp-link" readonly value="' + ui.esc(link) + '" style="font-family:ui-monospace,monospace;font-size:12px;text-align:center;">' +
          '<div style="display:flex;gap:10px;margin-top:12px;">' +
          '<button class="btn btn-gold" id="cp-copy" style="flex:1;">Copy link</button>' +
          '<a class="btn btn-dark" id="cp-open" href="' + ui.esc(link) + '" target="_blank" style="flex:1;text-align:center;text-decoration:none;">Start registration</a></div>' +
          '<p class="small faint" style="margin-top:14px;">Your registration link is single-use and expires ' + ui.fmtRelative(r.expiresAt) + '. Complete the standard registration — verify your email, confirm you are human, and establish your identity. That is how every Reality FX student enters.</p>' +
          '</div>';
        m.el.querySelector('#cp-copy').addEventListener('click', () => ui.copyText(link));
        m.el.querySelector('#cp-link').addEventListener('click', e => e.target.select());
        ui.toastOk(r.idempotent ? 'Your existing access was found — link re-shown' : 'Coupon ' + r.code + ' redeemed — welcome to Reality FX');
      });
    };
    m.el.querySelector('#cp-validate').addEventListener('click', go);
    m.el.querySelector('#cp-code').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
    // auto-validate a deep-linked code — the golden ticket opens itself.
    if (pre) { setTimeout(go, 350); }
  }

  renderDutyPill();
  renderAcademyDoor();
  couponCard();
  // website deep-link: /index.html?coupon=CODE lands straight in the coupon
  // flow — the marketing site's "I have a coupon" buttons point here.
  (function () {
    const c = new URLSearchParams(location.search).get('coupon');
    if (c && c.trim()) setTimeout(function () { openCouponModal(c.trim()); }, 600);
  })();
  setInterval(renderOpenLinks, 3000);
  setInterval(renderSmartDoor, 4000);
  setInterval(renderDutyPill, 8000);
})();
