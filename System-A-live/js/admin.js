/* Staff Console (admin.html) */
(function () {
  'use strict';
  const db = RFX.db, ui = RFX.ui;

  let currentModal = null; // { id, tab }
  let openModal = null; // { el, iv } — the live modal, so re-renders replace it instead of stacking

  /* ================= KPIs ================= */
  function kpis() {
    const all = db.enrollments();
    const awaitingReg = all.filter(e => e.state === 'PENDING' && !(e.registration && e.registration.submittedAt)).length;
    const awaitingApp = all.filter(e => e.state === 'PENDING' && e.registration && e.registration.submittedAt).length;
    const active = all.filter(e => e.state === 'ACTIVE').length;
    const failed = all.filter(e => e.state === 'SYNC_FAILED').length;
    const I = RFX.icons || {};
    const cards = [
      { ic: I.clipboard, num: all.length, lab: 'Enrollments' },
      { ic: I.mail, num: awaitingReg, lab: 'Awaiting registration' },
      { ic: I.search, num: awaitingApp, lab: 'Awaiting approval' },
      { ic: I.grad, num: active, lab: 'Active students' },
      { ic: I.alert, num: failed, lab: 'Sync failed' },
    ];
    document.getElementById('kpis').innerHTML = cards.map(c =>
      '<div class="card kpi"><div class="kpi-top"><span class="kpi-ic">' + c.ic + '</span></div>' +
      '<div class="kpi-num">' + c.num + '</div><div class="kpi-lab">' + c.lab + '</div></div>'
    ).join('');
  }

  /* ================= enrollment list ================= */
  function renderList() {
    const all = db.enrollments();
    const box = document.getElementById('enr-list');
    if (!all.length) {
      box.innerHTML = '<div class="empty-state"><div class="e-ic">' + (RFX.icons.cart || '') + '</div><div class="e-t">No enrollments yet</div>' +
        'Create the first one on the left — or hit “Load Pedro (demo)” to see the full journey.</div>';
      return;
    }
    const rows = all.map(e => {
      const sid = e.studentId ? '<div class="small gold" style="font-family:ui-monospace,monospace;">' + e.studentId + '</div>' : '';
      return '<tr data-id="' + e.id + '">' +
        '<td><b style="color:var(--text);">' + ui.esc(e.payment.customerName) + '</b>' + sid +
        '<div class="small faint">' + ui.esc(e.payment.email) + '</div></td>' +
        '<td class="small" style="color:var(--muted);">' + e.id + '<div class="small faint">' + ui.fmtRelative(e.createdAt) + '</div></td>' +
        '<td class="small" style="color:var(--muted);">' + db.money(e.payment.price, e.payment.currency) + '</td>' +
        '<td>' + ui.statePill(e.state) + '</td>' +
        '<td style="text-align:right;"><span class="btn btn-dark btn-sm">View</span></td>' +
        '</tr>';
    }).join('');
    box.innerHTML = '<table class="tbl"><thead><tr>' +
      '<th>Student</th><th>Enrollment</th><th>Paid</th><th>State</th><th></th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table>';
    box.querySelectorAll('tbody tr').forEach(tr => tr.addEventListener('click', () => openDetail(tr.dataset.id)));
  }

  /* ================= create enrollment ================= */
  function fillMethods() {
    const sel = document.getElementById('f-method');
    sel.innerHTML = db.getSettings().course.paymentMethods.map(m => '<option>' + ui.esc(m) + '</option>').join('');
  }
  function readForm() {
    const name = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    if (!name) { ui.toastErr('Please enter the customer name.'); return null; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { ui.toastErr('Please enter a valid email address.'); return null; }
    const price = parseFloat(document.getElementById('f-price').value);
    if (!(price > 0)) { ui.toastErr('Please enter a valid amount.'); return null; }
    return {
      customerName: name,
      email,
      course: document.getElementById('f-course').value.trim() || db.getSettings().course.name,
      price,
      currency: document.getElementById('f-currency').value.trim() || 'R',
      paymentMethod: document.getElementById('f-method').value,
      transactionId: document.getElementById('f-txn').value.trim(),
      referralCode: document.getElementById('f-ref') ? document.getElementById('f-ref').value.trim() : '',
    };
  }
  function onCreate() {
    const pay = readForm();
    if (!pay) return;
    const enr = db.createEnrollment(pay);
    // Payment-webhook idempotency: a duplicate transaction ID returns the
    // existing enrollment — never a second record, second invoice, or second
    // batch of emails. A fresh enrollment has no registration invite yet.
    const isNew = !(enr.registration && enr.registration.token);
    if (isNew) {
      db.createRegistrationInvite(enr);
      db.sendInviteEmails(enr);
      ui.toastOk('Enrollment ' + enr.id + ' created. Invoice ' + enr.invoice.number + ' generated. Emails sent.');
    } else {
      ui.toastWarn('Transaction ' + pay.transactionId + ' was already enrolled (' + enr.id + ') — no duplicate created, no emails re-sent.');
    }
    renderAll();
    openDetail(enr.id);
  }
  function onDemo() {
    const p = db.loadDemoPayment();
    document.getElementById('f-name').value = p.customerName;
    document.getElementById('f-email').value = p.email;
    document.getElementById('f-price').value = p.price;
    document.getElementById('f-txn').value = p.transactionId;
    ui.toast('Pedro loaded into the form — ready to create.', 'info');
  }

  /* One-click simulation of the REAL inbound: PayPal approves a payment on
     the website, the website calls System A's enrollment endpoint, and the
     machine takes over from there — enrollment, invoice, invoice email,
     registration email. This is exactly what Lee's webhook will send. */
  const WEBHOOK_POOL = [
    { name: 'Aisha Nkosi', email: 'aisha.nkosi@gmail.com' },
    { name: 'Thabo Mokoena', email: 'thabo.mokoena@gmail.com' },
    { name: 'Lerato Dlamini', email: 'lerato.dlamini@gmail.com' },
    { name: 'Sipho Ngubane', email: 'sipho.ngubane@gmail.com' },
    { name: 'Chantelle van Wyk', email: 'chantelle.vw@gmail.com' },
  ];
  function onWebhook() {
    const pick = WEBHOOK_POOL[Math.floor(Math.random() * WEBHOOK_POOL.length)];
    document.getElementById('f-name').value = pick.name;
    document.getElementById('f-email').value = pick.email;
    document.getElementById('f-price').value = 3510;
    document.getElementById('f-txn').value = 'PP-' + Date.now() + '-' + Math.floor(Math.random() * 1e6);
    onCreate();
    ui.toast('PayPal webhook simulated — payment approved, System A enrolled ' + pick.name + ', invoice + registration email fired automatically. See the Mailbox.', 'info');
  }

  /* The marketing engine — a free 24-hour tour. Mint one, share the link,
     let the draining gold life bar do the selling. Idempotent on the
     DEMO-TOUR transaction: re-running returns the same pass, never a
     duplicate student or duplicate emails. */
  function onDemoPass() {
    const m = ui.modal(
      '<div class="demo-pass-form">' +
      '<p class="small" style="margin-bottom:14px;">Mint a <b>free 24-hour tour</b> for a prospect — the marketing engine. They get the full registration wizard and the gold life bar draining; when it empties they feel the loss — and buy. Idempotent on the <span class="mono" style="font-size:11px;">DEMO-TOUR</span> transaction: re-running returns the same pass, never a duplicate.</p>' +
      '<div class="field"><label>Tour student name</label><input class="input" id="dp-name" placeholder="e.g. Sipho the prospect"></div>' +
      '<div class="field"><label>Email</label><input class="input" id="dp-email" placeholder="prospect@example.com"></div>' +
      '<div class="field"><label>Tour length</label><select class="input" id="dp-hours">' +
      '<option value="24">24 hours (standard)</option>' +
      '<option value="48">48 hours</option>' +
      '<option value="72">72 hours</option>' +
      '</select></div>' +
      '<button class="btn btn-gold" id="dp-go" style="width:100%;margin-top:4px;"><span data-icon="send"></span> Create demo pass</button>' +
      '</div>');
    m.setTitle('Create demo pass');
    m.el.querySelector('#dp-go').addEventListener('click', () => {
      const name = m.el.querySelector('#dp-name').value.trim();
      const email = m.el.querySelector('#dp-email').value.trim();
      const hours = parseInt(m.el.querySelector('#dp-hours').value, 10) || 24;
      if (!name) { ui.toastErr('Please enter the tour student\'s name.'); return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { ui.toastErr('Please enter a valid email.'); return; }
      const res = db.createDemoPass({ name, email, hours });
      if (!res.ok) { ui.toastErr(res.msg || 'Could not create the demo pass.'); return; }
      const link = location.origin + '/register.html?token=' + res.token;
      m.el.querySelector('.demo-pass-form').innerHTML =
        '<div class="demo-pass-done">' +
        (res.fresh
          ? '<p style="margin-bottom:12px;">Tour minted for <b>' + ui.esc(name) + '</b> — invoice + registration email fired automatically. Share this link:</p>'
          : '<p style="margin-bottom:12px;">This tour already exists for <b>' + ui.esc(name) + '</b> — same pass, fresh link (expires ' + ui.fmtRelative(res.expiresAt) + ' from now). Share it:</p>') +
        '<input class="input" id="dp-link" readonly value="' + ui.esc(link) + '" style="font-family:ui-monospace,monospace;font-size:12px;">' +
        '<div style="display:flex;gap:10px;margin-top:12px;">' +
        '<button class="btn btn-gold" id="dp-copy" style="flex:1;">Copy link</button>' +
        '<a class="btn btn-dark" id="dp-open" href="' + ui.esc(link) + '" target="_blank" style="flex:1;text-align:center;text-decoration:none;">Open tour</a></div>' +
        '<p class="small faint" style="margin-top:14px;">The registration email is also in the Mailbox. The gold life bar starts full and drains from the moment the pass is approved — share the link now, and let the countdown do the selling.</p>' +
        '</div>';
      m.el.querySelector('#dp-copy').addEventListener('click', () => ui.copyText(link));
      m.el.querySelector('#dp-link').addEventListener('click', e => e.target.select());
      ui.toastOk('Demo pass created for ' + name);
    });
  }

  /* Registration funnel — who opened their link, who registered, how long. */
  function funnel() {
    const box = document.getElementById('funnel');
    if (!box) return;
    const f = db.regStats();
    const fmt = ms => ms == null ? '—' : (ms < 1000 ? '<1s' : (ms >= 60000 ? Math.round(ms / 60000) + 'm ' + Math.round((ms % 60000) / 1000) + 's' : Math.round(ms / 1000) + 's'));
    const item = (v, l, extra) => '<div><span style="font-family:var(--font-body);font-size:22px;font-weight:700;color:#fff;font-variant-numeric:tabular-nums;">' + v + '</span><div class="small faint">' + l + '</div>' + (extra || '') + '</div>';
    box.innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;">' +
      item(f.sent, 'links sent') +
      item(f.opened, 'links opened', '<div class="small" style="color:var(--muted);">' + f.openedPct + '% of sent</div>') +
      item(f.submitted, 'registrations submitted') +
      item(f.approved, 'approved / active') +
      item(fmt(f.avgDurationMs), 'avg time to register') +
      '</div>' +
      '<p class="small faint" style="margin-top:12px;">Every link open is recorded once (first click) with a security event; the time from first open to submission is the funnel metric. In production the email provider reports opens too — this is the System A side of the record.</p>';
  }

  /* ================= detail modal ================= */
  function openDetail(id) {
    const e = db.byId(id);
    if (e) db.logAccess(e.payment.customerName + (e.studentId ? ' (' + e.studentId + ')' : ''), 'record opened', 'Staff console — enrollment detail');
    currentModal = { id, tab: 'overview', lastLoggedTab: null };
    renderModal();
  }
  function renderModal() {
    if (!currentModal) return;
    if (openModal) { clearInterval(openModal.iv); openModal.el.remove(); openModal = null; }
    const enr = db.byId(currentModal.id);
    if (!enr) { currentModal = null; return; }
    const m = ui.modal('<div id="detail-root"></div>');
    openModal = { el: m.el, iv: null };
    m.setTitle('<span style="font-family:var(--font-serif);">' + ui.esc(enr.payment.customerName) + '</span> <span class="small faint">· ' + enr.id + '</span>');
    renderDetailTab(m, enr);
    const closeIt = () => { clearInterval(openModal.iv); openModal = null; currentModal = null; m.close(); };
    m.el.querySelector('.modal-x').addEventListener('click', closeIt);
    m.el.addEventListener('click', e => { if (e.target === m.el) closeIt(); });
    // keep the modal fresh while open (sync status, retries…)
    openModal.iv = setInterval(() => {
      const cur = db.byId(enr.id);
      if (cur && currentModal && currentModal.id === enr.id) renderDetailTab(m, cur);
    }, 2000);
  }

  function renderDetailTab(m, enr) {
    const tabs = [
      ['overview', 'Overview'],
      ['invoice', 'Invoice'],
      ['registration', 'Registration & Approval'],
      ['handoff', 'Handoff to RFX OS'],
      ['audit', 'Audit log'],
    ];
    const tabsHtml = '<div class="tabs">' + tabs.map(t =>
      '<button class="tab ' + (t[0] === currentModal.tab ? 'active' : '') + '" data-tab="' + t[0] + '">' + t[1] + '</button>'
    ).join('') + '</div>';
    const content = {
      overview: tabOverview(enr),
      invoice: tabInvoice(enr),
      registration: tabRegistration(enr),
      handoff: tabHandoff(enr),
      audit: tabAudit(enr),
    }[currentModal.tab];

    m.el.querySelector('.modal-body').innerHTML = tabsHtml + '<div id="tab-content">' + content + '</div>';
    m.el.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => {
      currentModal.tab = btn.dataset.tab;
      renderDetailTab(m, db.byId(enr.id));
    }));
    // Access logging — one entry per identity view, not one per re-render:
    // the modal refreshes every 2s while open, and a poll must never spam
    // the access log.
    if (currentModal.tab === 'registration' && currentModal.lastLoggedTab !== 'registration') {
      currentModal.lastLoggedTab = 'registration';
      const e2 = db.byId(enr.id);
      if (e2) db.logAccess(e2.payment.customerName + (e2.studentId ? ' (' + e2.studentId + ')' : ''), 'identity viewed', 'Registration & Approval — identity tab');
    }
  }

  function tabOverview(enr) {
    const reg = enr.registration || {};
    let html = '<div class="card card-gold" style="margin-bottom:18px;">' +
      '<div class="eyebrow" style="margin-bottom:12px;">The five pillars</div>' + ui.pillarBar(enr) + '</div>';

    html += '<div class="row">' +
      '<div class="card col">' +
        '<div class="eyebrow muted" style="margin-bottom:12px;">Payment & invoice</div>' +
        '<dl class="kv">' +
          '<dt>Course</dt><dd>' + ui.esc(enr.payment.course) + '</dd>' +
          '<dt>Paid</dt><dd>' + db.money(enr.payment.price, enr.payment.currency) + ' · <span class="pill ok" style="font-size:10px;">paid</span></dd>' +
          '<dt>Method</dt><dd>' + ui.esc(enr.payment.paymentMethod) + '</dd>' +
          '<dt>Transaction</dt><dd class="mono">' + ui.esc(enr.payment.transactionId) + '</dd>' +
          '<dt>Invoice</dt><dd class="mono">' + enr.invoice.number + '</dd>' +
          '<dt>Purchased</dt><dd>' + db.fmtDate(enr.payment.paidAt) + '</dd>' +
        '</dl></div>' +
      '<div class="card col">' +
        '<div class="eyebrow muted" style="margin-bottom:12px;">Student identity</div>' +
        (enr.studentId
          ? '<dl class="kv">' +
              '<dt>Student ID</dt><dd class="mono gold" style="font-size:17px;font-weight:700;">' + enr.studentId + '</dd>' +
              '<dt>Student code</dt><dd class="mono">RFX-•••• <button class="btn btn-dark btn-sm" onclick="RFX.adminRevealCode(\'' + enr.id + '\')">Reveal</button></dd>' +
              '<dt>Status</dt><dd>' + ui.statePill(enr.state) + '</dd>' +
            '</dl>'
          : '<p class="small" style="color:var(--faint);">No identity yet — the Student ID and Student Code are created at approval.</p>') +
      '</div></div>';

    if (reg.submittedAt) {
      html += '<div class="card" style="margin-top:16px;"><div class="eyebrow muted" style="margin-bottom:12px;">Registration progress</div>' +
        '<dl class="kv">' +
          '<dt>Submitted</dt><dd>' + db.fmtDate(reg.submittedAt) + '</dd>' +
          '<dt>Email verified</dt><dd>' + (reg.emailVerifiedAt ? '<span class="pill ok">yes</span> · ' + db.fmtDate(reg.emailVerifiedAt) : '<span class="pill warn">no</span>') + '</dd>' +
          '<dt>Human verified</dt><dd>' + (reg.captchaPassedAt ? '<span class="pill ok">yes</span>' : '<span class="pill warn">no</span>') + '</dd>' +
          '<dt>Agreements</dt><dd>' + (reg.agreements && reg.agreements.length ? reg.agreements.length + ' signed (v' + reg.agreements.map(a => a.version).join(', v') + ')' : '<span class="pill warn">none</span>') + '</dd>' +
        '</dl></div>';
    }
    return html;
  }

  function tabInvoice(enr) {
    return ui.invoiceHTML(enr) +
      '<div style="margin-top:18px;display:flex;gap:10px;justify-content:flex-end;" class="no-print">' +
      '<button class="btn btn-ghost" onclick="RFX.adminDownloadPdf(\'' + enr.id + '\')">' + (RFX.icons.download || '') + ' Download PDF</button>' +
      '<button class="btn btn-ghost" onclick="RFX.adminPrint()">' + (RFX.icons.printer || '') + ' Print</button>' +
      '</div>';
  }

  function tabRegistration(enr) {
    const reg = enr.registration;
    if (!reg) {
      return '<div class="empty-state"><div class="e-ic">' + (RFX.icons.mail || '') + '</div><div class="e-t">No registration invite yet</div>' +
        '<p class="small">Issue the secure registration link and emails now.</p>' +
        '<button class="btn btn-gold" onclick="RFX.adminResend(\'' + enr.id + '\')">Send registration email</button></div>';
    }
    const checks = db.verificationChecklist(enr);
    const chk = Object.entries(checks).map(([k, v]) => {
      // selfie quality is a FLAG, not a gate — render it as a distinct warning
      // row so the moderator's eyes are drawn to it before they decide.
      if (k === 'selfieQuality') {
        if (v === 'suspicious') {
          return '<div class="chk-item warn"><span class="chk-ic">⚠</span>Selfie quality · <b>flagged for review</b> — inspect the photo before deciding</div>';
        }
        if (v) {
          return '<div class="chk-item pass"><span class="chk-ic">' + (RFX.icons.checkCircle || '✓') + '</span>Selfie quality · photo verified</div>';
        }
        return '<div class="chk-item pend"><span class="chk-ic">' + (RFX.icons.clock || '…') + '</span>Selfie quality · pending</div>';
      }
      // identity signals (phone/name/email reuse across enrollments) — a FLAG,
      // not a gate: the moderator sees the match before deciding.
      if (k === 'identitySignals') {
        if (v && v.length) {
          return '<div class="chk-item warn"><span class="chk-ic">⚠</span>Identity signals · <b>flagged</b> — ' + ui.esc(v[0].detail) + '</div>';
        }
        if (reg.identity) {
          return '<div class="chk-item pass"><span class="chk-ic">' + (RFX.icons.checkCircle || '✓') + '</span>Identity signals · no cross-identity matches</div>';
        }
        return '<div class="chk-item pend"><span class="chk-ic">' + (RFX.icons.clock || '…') + '</span>Identity signals · pending</div>';
      }
      const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
      return '<div class="chk-item ' + (v ? 'pass' : 'pend') + '"><span class="chk-ic">' + (v ? (RFX.icons.checkCircle || '✓') : (RFX.icons.clock || '…')) + '</span>' + label + '</div>';
    }).join('');
    const reapplyBanner = (reg.reapplyCount || 0) > 0
      ? '<div class="card" style="border-color:rgba(143,182,232,0.35);margin-bottom:16px;">' +
        '<p class="small">↻ <b style="color:var(--text);">Re-application attempt ' + reg.reapplyCount + '</b> — reopened ' + db.fmtDate(reg.reappliedAt) +
        (reg.submittedAt ? ' · resubmitted ' + db.fmtDate(reg.submittedAt) : ' — awaiting corrections') + '.</p></div>'
      : '';

    let html = reapplyBanner + '<div class="card" style="margin-bottom:16px;">' +
      '<div class="eyebrow muted" style="margin-bottom:12px;">Automated verification</div>' +
      '<div class="checklist">' + chk + '</div></div>';

    if (reg.submittedAt) {
      // Defensive: a registration can be mid-flight (identity not saved yet) when staff
      // opens the detail — never crash the tab on partially-complete data.
      const personal = reg.personal || {};
      const identity = reg.identity || {};
      const op = db.currentOperator();
      if (db.canViewIdentity(op.role)) {
        // authorized identity roles (admin / approver / reception) see the
        // full submission — they are the people who verify a person. The
        // view itself is access-logged once per open (see renderDetailTab).
        html += '<div class="card" style="margin-bottom:16px;"><div class="eyebrow muted" style="margin-bottom:12px;">Identity submitted</div>' +
          '<dl class="kv">' +
            '<dt>Full name</dt><dd>' + ui.esc(personal.fullName || '—') + '</dd>' +
            '<dt>Date of birth</dt><dd>' + ui.esc(personal.dob || '—') + '</dd>' +
            '<dt>Country</dt><dd>' + ui.esc(personal.country || '—') + '</dd>' +
            '<dt>Phone</dt><dd>' + ui.esc(identity.phone || '—') + '</dd>' +
            '<dt>Address</dt><dd>' + ui.esc(identity.address || '—') + '</dd>' +
            '<dt>Gov. ID</dt><dd class="small faint">not collected</dd>' +
            '<dt>Selfie</dt><dd>' + (reg.selfieDataUrl ? '<img src="' + reg.selfieDataUrl + '" style="height:110px;border-radius:8px;border:1px solid var(--border-gold);">' + (reg.selfieQuality === 'suspicious' ? ' <span class="pill warn">flagged — verify the face</span>' : (reg.selfieQuality ? ' <span class="pill ok">quality ok</span>' : '')) : '<span class="pill warn">missing</span>') + '</dd>' +
            (reg.identitySignals && reg.identitySignals.length ? '<dt>Identity flags</dt><dd>' + reg.identitySignals.map(s => '<span class="pill warn">' + ui.esc(s.signal.replace(/_/g, ' ')) + '</span>').join(' ') + ' <span class="small faint">' + ui.esc(reg.identitySignals[0].detail) + '</span></dd>' : '') +
          '</dl></div>';
      } else {
        // data minimization — a role that doesn't verify people doesn't need
        // their phone, address, DOB or selfie. Show the decision aids, not the data.
        html += '<div class="card" style="margin-bottom:16px;"><div class="eyebrow muted" style="margin-bottom:12px;">Identity submitted</div>' +
          '<p class="small" style="color:var(--faint);">Restricted — this role doesn\'t verify identities. Contact an approver to review ' +
          (reg.selfieQuality === 'suspicious' ? '<span class="pill warn" style="font-size:9px;">selfie flagged for review</span>' : (reg.selfieQuality ? '<span class="pill ok" style="font-size:9px;">selfie quality ok</span>' : '<span class="pill" style="font-size:9px;">selfie pending</span>')) + '</p></div>';
      }
    }
    if (reg.agreements && reg.agreements.length) {
      html += '<div class="card" style="margin-bottom:16px;"><div class="eyebrow muted" style="margin-bottom:12px;">Electronic agreements — exact version + time</div>' +
        reg.agreements.map(a =>
          '<div style="display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid var(--border);font-size:13px;">' +
          '<span class="pill gold">v' + a.version + '</span><span style="flex:1;color:var(--text);">' + ui.esc(a.name) + '</span>' +
          '<span class="small faint">' + db.fmtDate(a.acceptedAt) + '</span></div>').join('') + '</div>';
    }

    // actions
    if (enr.state === 'PENDING' && !reg.submittedAt) {
      html += '<div class="card"><p class="small" style="color:var(--faint);">Waiting for the student to complete registration.</p>' +
        '<button class="btn btn-ghost btn-sm" style="margin-top:10px;" onclick="RFX.adminResend(\'' + enr.id + '\')">↻ Resend registration link</button></div>';
    }
    if (enr.state === 'PENDING' && reg.submittedAt) {
      const canApprove = db.checksPass(enr);
      html += '<div class="card">' +
        '<p class="small" style="margin-bottom:14px;">Everything above is a <b style="color:var(--text);">review trigger, not a verdict</b>. ' +
        (canApprove ? 'All automated checks passed — you may approve.' : 'Some checks are still pending.') + '</p>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
        '<button class="btn btn-gold" ' + (canApprove ? '' : 'disabled') + ' onclick="RFX.adminApprove(\'' + enr.id + '\')">' + (RFX.icons.checkCircle || '') + ' Approve — create identity</button>' +
        '<button class="btn btn-danger" onclick="RFX.adminReject(\'' + enr.id + '\')">✕ Reject</button>' +
        '</div></div>';
    }
    if (enr.state === 'APPROVED') {
      html += '<div class="card card-gold"><div class="eyebrow" style="margin-bottom:10px;">Identity created</div>' +
        '<dl class="kv">' +
          '<dt>Student ID</dt><dd class="mono" style="font-size:18px;font-weight:700;color:var(--gold-bright);">' + enr.studentId + '</dd>' +
          '<dt>Student code</dt><dd class="mono">' + (enr._codeShown ? enr.studentCode : 'RFX-••••') + ' <button class="btn btn-dark btn-sm" onclick="RFX.adminRevealCode(\'' + enr.id + '\')">' + (enr._codeShown ? 'Hide' : 'Reveal') + '</button></dd>' +
          '<dt>Decision</dt><dd>' + db.fmtDate(enr.registration.decision && enr.registration.decision.at) + ' · by ' + ui.esc((enr.registration.decision && enr.registration.decision.by) || '—') + '</dd>' +
        '</dl>' +
        '<button class="btn btn-gold" style="margin-top:14px;" onclick="RFX.adminSync(\'' + enr.id + '\')">' + (RFX.icons.link || '') + ' Hand off to RFX OS</button></div>';
    }
    if (enr.state === 'REJECTED') {
      html += renderRejectionResolution(enr);
    }
    return html;
  }

  function tabHandoff(enr) {
    const settings = db.getSettings();
    const attempts = (enr.handoff.attempts || []).slice().reverse();
    let html = '<div class="card" style="margin-bottom:16px;">' +
      '<div class="eyebrow muted" style="margin-bottom:12px;">The handshake · idempotent by design</div>' +
      '<p class="small" style="margin-bottom:14px;">Every request carries <b style="color:var(--text);">' + db.IDEMPOTENCY_KEY_FIELD + '</b> as its idempotency key. ' +
      'RFX OS can only ever create one identity per Student ID — a retried request can never produce a duplicate.</p>' +
      '<dl class="kv">' +
        '<dt>Idempotency key</dt><dd class="mono gold">' + (enr.studentId || '— (approve first)') + '</dd>' +
        '<dt>State</dt><dd>' + ui.statePill(enr.state) + '</dd>' +
        (enr.handoff.confirmedAt ? '<dt>Confirmed</dt><dd>' + db.fmtDate(enr.handoff.confirmedAt) + '</dd>' : '') +
        (enr.handoff.lastError ? '<dt>Last error</dt><dd style="color:#f0a89c;">' + ui.esc(enr.handoff.lastError) + '</dd>' : '') +
      '</dl></div>';

    if (enr.studentId && enr.state !== 'RFX_OS_CONFIRMED' && enr.state !== 'ACTIVE') {
      const label = enr.state === 'SYNC_FAILED' ? 'Retry handshake (idempotent)' : 'Hand off to RFX OS';
      const ic = enr.state === 'SYNC_FAILED' ? (RFX.icons.refresh || '') : (RFX.icons.link || '');
      html += '<div style="margin-bottom:16px;"><button class="btn ' + (enr.state === 'SYNC_FAILED' ? 'btn-ghost' : 'btn-gold') + '" onclick="RFX.adminSync(\'' + enr.id + '\')">' + ic + ' ' + label + '</button>' +
        (enr.state === 'SYNC_FAILED' ? ' <span class="small faint">Automatic retry with backoff is also scheduled.</span>' : '') + '</div>';
    }
    if (enr.state === 'RFX_OS_CONFIRMED' || enr.state === 'ACTIVE') {
      html += '<div class="card" style="border-color:rgba(74,222,128,0.35);margin-bottom:16px;">' +
        '<p style="color:#7ee2a4;font-weight:600;">✓ RFX OS confirmed receipt. Student is ACTIVE.</p>' +
        '<p class="small">“Got him. ' + enr.studentId + ' exists here. Details match. Course entitlement recorded.”</p></div>';
    }

    // attempts log
    html += '<div class="eyebrow muted" style="margin-bottom:8px;">Attempts</div><ul class="audit">' +
      (attempts.length ? attempts.map(a =>
        '<li><span class="a-time">' + db.fmtDate(a.at) + '</span><span class="a-txt">' +
        (a.event === 'SYNC_OK' ? (RFX.icons.checkCircle || '') + ' ' : a.event === 'SYNC_ERROR' ? (RFX.icons.x || '') + ' ' : (RFX.icons.refresh || '') + ' ') + ui.esc(a.event.replace(/_/g, ' ')) +
        (a.idempotencyKey ? ' · key <b class="mono">' + a.idempotencyKey + '</b>' : '') +
        (a.error ? ' · <span style="color:#f0a89c;">' + ui.esc(a.error) + '</span>' : '') +
        (a.note ? ' · <span class="small faint">' + ui.esc(a.note) + '</span>' : '') +
        '</span></li>').join('')
      : '<li><span class="a-time">—</span><span class="a-txt faint">No handshake attempted yet.</span></li>') +
      '</ul>';

    // payload preview
    if (enr.studentId) {
      html += '<div style="margin-top:18px;"><div class="eyebrow muted" style="margin-bottom:8px;">Payload sent to RFX OS</div>' +
        '<pre style="background:var(--bg-raise);border:1px solid var(--border);border-radius:10px;padding:16px;font-size:12px;overflow-x:auto;color:var(--muted);font-family:ui-monospace,monospace;">' +
        ui.esc(JSON.stringify(RFX.bridge.buildPayload(enr), null, 2)) + '</pre></div>';
    }

    // settings
    html += '<div style="margin-top:22px;padding-top:16px;border-top:1px solid var(--border);">' +
      '<div class="eyebrow muted" style="margin-bottom:10px;">Bridge settings</div>' +
      '<div class="field"><label>RFX OS Academy endpoint</label>' +
      '<input class="input" id="set-endpoint" value="' + ui.esc(settings.rfxOsEndpoint) + '"></div>' +
      '<div class="check" style="margin-bottom:14px;"><input type="checkbox" id="set-demo" ' + (settings.demoMode ? 'checked' : '') + '>' +
      '<div class="check-body"><b>Demo mode</b> — simulate RFX OS responding (no real server yet). Uncheck to send real HTTP requests.</div></div>' +
      '<button class="btn btn-dark btn-sm" onclick="RFX.adminSaveSettings()">Save bridge settings</button></div>';

    return html;
  }

  function tabAudit(enr) {
    const log = (enr.audit || []).slice().reverse();
    return '<div class="card"><div class="eyebrow muted" style="margin-bottom:8px;">Security & event log</div><ul class="audit">' +
      (log.length ? log.map(a =>
        '<li><span class="a-time">' + db.fmtDate(a.at) + '</span><span class="a-txt"><b>' + ui.esc(a.event.replace(/_/g, ' ')) + '</b>' +
        (a.detail ? ' — ' + ui.esc(a.detail) : '') + '</span></li>').join('')
      : '<li><span class="a-time">—</span><span class="a-txt faint">No events recorded.</span></li>') +
      '</ul></div>';
  }

  function renderRejectionResolution(enr) {
    const res = enr.resolution || {};
    const country = regCountry(enr);
    const settings = db.getSettings();
    const crossBorder = country && country.toLowerCase() !== String(settings.homeCountry).toLowerCase();
    const rp = db.canReapply(enr);
    const histCount = (enr.registration.rejections || []).length;
    const reps = enr.registration.reapplyCount || 0;
    let html = '<div class="card" style="border-color:rgba(224,96,79,0.4);margin-bottom:16px;">' +
      '<p style="color:#f0a89c;font-weight:600;">✕ Registration rejected</p>' +
      '<p class="small">' + ui.esc(enr.registration.decision.reason || 'No reason recorded') + '</p>' +
      (rp.ok
        ? '<p class="small" style="color:var(--ok);margin-top:10px;">↻ Fixable — ' + ui.esc(enr.payment.customerName) + ' may correct and re-apply until ' + db.fmtDateShort(rp.reapplyBy) + ' (' + rp.attemptsLeft + ' attempt' + (rp.attemptsLeft === 1 ? '' : 's') + ' left).</p>'
        : '<p class="small faint" style="margin-top:10px;">' + ui.esc(rp.reason || 'No re-application available.') + '</p>') +
      (reps > 0 ? '<p class="small faint" style="margin-top:6px;">History: ' + histCount + ' rejection' + (histCount === 1 ? '' : 's') + ' · ' + reps + ' re-application' + (reps === 1 ? '' : 's') + '.</p>' : '') +
      '<div style="margin-top:12px;"><dl class="kv">' +
        '<dt>Country</dt><dd>' + ui.esc(country || '—') + (crossBorder ? ' <span class="pill warn" style="font-size:9px;">cross-border</span>' : ' <span class="pill ok" style="font-size:9px;">local</span>') + '</dd>' +
        '<dt>Paid</dt><dd>' + db.money(enr.payment.price, enr.payment.currency) + '</dd>' +
      '</dl>' + (crossBorder ?
        '<p class="small" style="color:var(--warn);">Cross-border student — a cash refund may incur transfer and FX fees. RFX account credit is fee-free and keeps the funds inside Reality FX.</p>' : '') +
      '</div></div>';

    if (res.choice) {
      html += '<div class="card" style="margin-bottom:16px;"><div class="eyebrow muted" style="margin-bottom:8px;">Student\'s choice</div>' +
        '<p class="small">' + ui.esc(enr.payment.customerName) + ' chose <b style="color:var(--text);">' + (res.choice === 'credit' ? 'RFX account credit' : 'cash refund') + '</b> at ' + db.fmtDate(res.choiceAt) + '.</p></div>';
    }

    if (res.method && res.executedAt) {
      // already executed — show result
      html += '<div class="card" style="margin-bottom:16px;"><div class="eyebrow muted" style="margin-bottom:8px;">Resolution executed</div>' +
        '<p class="small">' + (res.method === 'credit'
          ? (RFX.icons.checkCircle || '') + ' ' + db.money(res.amount, enr.payment.currency) + ' credited to ' + ui.esc(enr.payment.email) + ' (RFX balance now ' + db.money(db.walletBalance(enr.payment.email), enr.payment.currency) + '). Confirmation email sent.'
          : (RFX.icons.clock || '') + ' ' + db.money(res.amount, enr.payment.currency) + ' queued for the consolidated monthly batch (' + ui.esc(res.payoutId || '') + '). Confirmation email sent.') + '</p></div>';
    } else {
      html += '<div class="card"><div class="eyebrow muted" style="margin-bottom:10px;">Execute resolution</div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
        '<button class="btn btn-gold" onclick="RFX.adminIssueCredit(\'' + enr.id + '\')">' + (RFX.icons.card || '') + ' Issue credit — ' + db.money(enr.payment.price, enr.payment.currency) + '</button>' +
        '<button class="btn btn-ghost" onclick="RFX.adminQueueRefund(\'' + enr.id + '\')">' + (RFX.icons.send || '') + ' Add to refund batch</button>' +
        '</div>' +
        (res.choice === 'credit'
          ? '<p class="small faint" style="margin-top:10px;">Student requested credit — this is the fee-free option.</p>'
          : res.choice === 'refund'
            ? '<p class="small faint" style="margin-top:10px;">Student requested a cash refund — it joins the monthly batch.</p>'
            : '<p class="small faint" style="margin-top:10px;">Student has not chosen yet — you may still resolve it; the student can change their mind until execution.</p>') +
        '</div>';
    }
    return html;
  }

  function regCountry(enr) {
    const p = enr.registration && enr.registration.personal;
    return (p && p.country) || '';
  }

  function doIssueCredit(id) {
    const enr = db.byId(id);
    if (!enr) return;
    const r = db.issueCredit(enr, enr.payment.price, 'Staff');
    if (r.ok) { ui.toastOk('Credit issued — RFX balance ' + db.money(r.balance, enr.payment.currency) + '. Confirmation emailed.'); }
    else ui.toastWarn(r.msg);
    renderAll();
  }
  function doQueueRefund(id) {
    const enr = db.byId(id);
    if (!enr) return;
    const r = db.queueRefund(enr, enr.payment.price, 'Staff');
    if (r.ok) { ui.toastOk('Refund queued (' + r.payout.id + ') — joins the monthly batch.'); }
    else ui.toastWarn(r.msg);
    renderAll();
  }

  /* ================= actions ================= */
  function doApprove(id) {
    const enr = db.byId(id);
    if (!enr) return;
    db.approve(enr, { verdict: 'APPROVED', by: 'Staff' });
    ui.toastOk('Approved — identity ' + enr.studentId + ' created. Handing off to RFX OS…');
    renderAll();
    setTimeout(() => { RFX.bridge.sync(enr); }, 1200);
  }
  function doReject(id) {
    const enr = db.byId(id);
    if (!enr) return;
    const m = ui.modal('<div class="eyebrow muted" style="margin-bottom:12px;">Reject registration</div>' +
      '<p class="small" style="margin-bottom:16px;">Rejections are final and recorded in the audit log. Provide the reason shown to the student.</p>' +
      '<div class="field"><label>Reason</label><textarea class="textarea" id="rej-reason" rows="3" placeholder="e.g. The selfie was not clear enough — the student may retake it and re-apply."></textarea></div>' +
      '<div class="field"><label>Rejection type</label>' +
      '<select class="select" id="rej-fixable">' +
      '<option value="fixable" selected>Fixable — student may correct &amp; re-apply within 7 days (recommended)</option>' +
      '<option value="final">Final — no re-application, resolution (credit/refund) only</option>' +
      '</select><div class="hint">Most rejections are fixable — a blurry selfie or a typo shouldn\'t force a refund.</div></div>' +
      '<div style="display:flex;gap:10px;justify-content:flex-end;">' +
      '<button class="btn btn-dark btn-sm" onclick="this.closest(\'.modal-back\').remove()">Cancel</button>' +
      '<button class="btn btn-danger btn-sm" onclick="RFX.adminConfirmReject(\'' + id + '\')">Reject</button></div>');
    m.setTitle('Reject — ' + ui.esc(enr.payment.customerName));
  }
  function confirmReject(id) {
    const reason = document.getElementById('rej-reason') ? document.getElementById('rej-reason').value.trim() : '';
    const fixable = !document.getElementById('rej-fixable') || document.getElementById('rej-fixable').value !== 'final';
    const enr = db.byId(id);
    if (enr) {
      db.approve(enr, { verdict: 'REJECTED', by: 'Staff', reason: reason || 'No reason provided.', fixable });
      ui.toastWarn(fixable ? 'Rejected as fixable — the student can correct and re-apply.' : 'Rejected as final — the student will choose credit or refund.');
    }
    document.querySelectorAll('.modal-back').forEach(b => b.remove());
    renderAll();
  }
  function doResend(id) {
    const enr = db.byId(id);
    if (!enr) return;
    db.resendRegistrationEmail(enr);
    ui.toastOk('New secure link issued and emailed (previous link invalidated).');
    renderAll();
  }
  function doSync(id) {
    const enr = db.byId(id);
    if (!enr) return;
    ui.toast('Handshake with RFX OS started…', 'info');
    RFX.bridge.sync(enr).then(r => {
      if (r.ok) ui.toastOk(r.already ? 'Already confirmed — reconciled. No duplicate created.' : 'RFX OS confirmed. Student is ACTIVE.');
      else ui.toastErr('Handshake failed: ' + r.error + ' (automatic retry scheduled)');
      renderAll();
    });
  }
  function revealCode(id) {
    const enr = db.byId(id);
    if (!enr) return;
    enr._codeShown = !enr._codeShown;
    renderModal();
  }
  function doSaveSettings() {
    const endpoint = document.getElementById('set-endpoint') ? document.getElementById('set-endpoint').value.trim() : '';
    const demo = document.getElementById('set-demo') ? document.getElementById('set-demo').checked : true;
    db.updateSettings({ rfxOsEndpoint: endpoint, demoMode: demo });
    ui.toastOk('Bridge settings saved.');
    renderAll();
  }
  function doPrint() {
    window.print();
  }

  /* ================= pipeline demo / footer ================= */
  function pipelineDemo() {
    const all = db.enrollments();
    const best = all.slice().sort((a, b) => {
      const sc = e => (e.progress.active ? 6 : e.progress.handoffConfirmed ? 5 : e.progress.approved ? 4 : e.progress.registrationSubmitted ? 3 : e.progress.invoiceEmail ? 2 : 1);
      return sc(b) - sc(a);
    })[0];
    const box = document.getElementById('pipeline-demo');
    if (!best) {
      box.innerHTML = '<div class="empty-state" style="padding:24px;"><div class="e-t">Create an enrollment to see the pillars light up</div></div>';
      return;
    }
    const done = RFX.ui.pillarProgress(best).length;
    box.innerHTML = ui.pillarBar(best) +
      '<p class="small faint" style="margin-top:14px;text-align:center;">' + ui.esc(best.payment.customerName) + ' · ' + best.id +
      (best.state === 'ACTIVE' ? ' · <span style="color:#7ee2a4;">The five links held.</span>' : ' · ' + ui.STATE_LABELS[best.state]) + '</p>';
  }

  function footState() {
    const s = db.getSettings();
    document.getElementById('foot-state').innerHTML = 'Bridge: ' + (s.demoMode ? 'demo (simulated)' : 'live → ' + ui.esc(s.rfxOsEndpoint));
  }
  function mailCount() {
    const el = document.getElementById('mail-count');
    if (el) el.textContent = db.unreadCount();
    const pc = document.getElementById('payout-count');
    if (pc) pc.textContent = db.payouts().filter(p => p.status === 'queued').length;
  }

  /* ================= security & data hygiene ================= */
  const POSTURE = [
    'Registration links are single-use and expire after 7 days.',
    'Email verification codes lock after repeated wrong entries (brute-force guard).',
    'CAPTCHA challenges expire after too many attempts.',
    'Member sign-in throttles and locks after repeated failures — lockouts are logged.',
    'Student codes are masked by default and shown once, on request.',
    'Government IDs are not collected at all — data minimisation by design.',
    'Verification selfies are purged once a decision is made (unless retention is set to keep).',
    'The RFX OS handshake is idempotent — retried requests can never create duplicate identities.',
    'Every handoff payload and security event is logged for the moderator.',
  ];
  function renderSecurity() {
    const sec = db.getSettings().security || {};
    const el = document.getElementById('sec-posture');
    if (!el) return;
    el.innerHTML = POSTURE.map(p =>
      '<li><span class="a-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;color:var(--ok);"><polyline points="20 6 9 17 4 12"/></svg></span>' +
      '<span class="a-txt">' + p + '</span></li>').join('');
    const st = db.securityStatus();
    const hygiene = document.getElementById('sec-hygiene');
    hygiene.innerHTML = '<span class="ic">' + (RFX.icons.shield || '') + '</span>' +
      '<span>' + st.retainedSelfies + ' enrollment' + (st.retainedSelfies === 1 ? '' : 's') + ' still hold' + (st.retainedSelfies === 1 ? 's' : '') + ' a verification selfie · ' + st.lockedLogins + ' account' + (st.lockedLogins === 1 ? '' : 's') + ' locked ' +
      '<button class="btn btn-dark btn-sm" style="margin-left:10px;" onclick="RFX.adminPurgeSelfies()">Purge decided selfies</button></span>';
    const ev = document.getElementById('sec-events');
    ev.innerHTML = (st.events.length ? st.events.map(e =>
      '<li><span class="a-time">' + db.fmtDateShort(e.at) + '</span><span class="a-txt"><b>' + ui.esc(e.event.replace(/_/g, ' ')) + '</b> — ' + ui.esc(e.detail) + '</span></li>').join('')
      : '<li><span class="a-time">—</span><span class="a-txt faint">No security events yet.</span></li>');
    const ax = document.getElementById('sec-access');
    const logs = db.accessLogs();
    ax.innerHTML = (logs.length ? logs.slice(0, 24).map(a =>
      '<li><span class="a-time">' + db.fmtDateShort(a.at) + '</span><span class="a-txt"><b>' + ui.esc(a.who) + '</b>' + (a.role ? ' <span class="pill" style="font-size:8px;">' + ui.esc(a.role) + '</span>' : '') + ' · ' + ui.esc(a.action) + ' → ' + ui.esc(a.target) + '</span></li>').join('')
      : '<li><span class="a-time">—</span><span class="a-txt faint">No access recorded yet — opens and reveals log themselves here.</span></li>');
    // fill settings inputs (only when not focused, so typing isn't clobbered by the 3s refresh)
    const syncVal = (id, v) => { const i = document.getElementById(id); if (i && document.activeElement !== i) i.value = v; };
    syncVal('sec-login-attempts', sec.maxLoginAttempts);
    syncVal('sec-lockout-mins', sec.lockoutMinutes);
    syncVal('sec-code-attempts', sec.verifyCodeAttempts);
    syncVal('sec-selfies', sec.retainSelfies || 'untilDecision');
    syncVal('sec-session', sec.sessionTimeoutMinutes || 15);
  }
  /* PII incident board — blocked chat attempts, read from the OS rail.
     Client-side catches and bypass attempts both land here (one store,
     two sources). Fetched on demand — never on the 3s refresh, so the
     rail isn't hammered. */
  function osApiBase() {
    let ep = String(db.getSettings().rfxOsEndpoint || 'http://127.0.0.1:49270/os/api/handoff').trim();
    if (ep.indexOf('/api/') !== -1) ep = ep.split('/api/')[0];
    return ep.replace(/\/+$/, '') + '/api';
  }
  function renderPii() {
    const el = document.getElementById('sec-pii');
    const cnt = document.getElementById('pii-count');
    if (!el) return;
    el.innerHTML = '<li><span class="a-time">—</span><span class="a-txt faint">Checking the OS rail…</span></li>';
    // Try the configured bridge first (production: the deployed function);
    // fall back to the local OS rail so the demo board works on this machine.
    const tryRail = (base) => fetch(base + '/pii-incidents', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject(r.status));
    const localRail = 'http://127.0.0.1:49270/os/api';
    const primary = osApiBase() === localRail ? localRail : osApiBase();
    tryRail(primary).catch(() => primary === localRail ? Promise.reject() : tryRail(localRail))
      .then(j => {
        const inc = j.incidents || [];
        if (cnt) cnt.textContent = inc.length + ' blocked attempt' + (inc.length === 1 ? '' : 's');
        el.innerHTML = (inc.length ? inc.slice(0, 24).map(x =>
          '<li><span class="a-time">' + (new Date(x.at * 1000).toLocaleString().slice(0, 17)) + '</span>' +
          '<span class="a-txt"><b>' + ui.esc(x.name) + '</b> <span class="pill" style="font-size:8px;">' + ui.esc(x.role) + '</span> · ' + ui.esc(x.room) + ' · ' +
          '<b style="color:#f0a89c;">' + ui.esc(x.reason) + '</b><div class="small faint" style="margin-top:2px;">' + ui.esc(x.sample || '') + '</div></span></li>').join('')
          : '<li><span class="a-time">—</span><span class="a-txt faint">No blocked attempts recorded — the chat guard is quiet.</span></li>');
      })
      .catch(() => {
        if (cnt) cnt.textContent = '';
        el.innerHTML = '<li><span class="a-time">—</span><span class="a-txt faint">OS rail unreachable right now — the guard itself still runs on every device; only this board needs the rail.</span></li>';
      });
  }
  const piiRefresh = document.getElementById('pii-refresh');
  if (piiRefresh) piiRefresh.addEventListener('click', renderPii);
  const piiClear = document.getElementById('pii-clear');
  if (piiClear) piiClear.addEventListener('click', () => {
    fetch(osApiBase() + '/pii-incidents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'clear' }) })
      .then(r => { if (r.ok) { renderPii(); ui.toastOk('Incident board cleared.'); } })
      .catch(() => ui.toastErr('Could not reach the OS rail to clear the board.'));
  });
  /* Data-requests board — students exercising their rights from the OS
     profile room (copy of data / account deletion). Same rail pattern as
     the PII board: fetched on demand, never on the 3s refresh. */
  function renderDataRequests() {
    const el = document.getElementById('sec-dreq');
    const cnt = document.getElementById('dreq-count');
    if (!el) return;
    el.innerHTML = '<li><span class="a-time">—</span><span class="a-txt faint">Checking the OS rail…</span></li>';
    const tryRail = (base) => fetch(base + '/data-requests', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject(r.status));
    const localRail = 'http://127.0.0.1:49270/os/api';
    const primary = osApiBase() === localRail ? localRail : osApiBase();
    tryRail(primary).catch(() => primary === localRail ? Promise.reject() : tryRail(localRail))
      .then(j => {
        const reqs = j.requests || [];
        if (cnt) cnt.textContent = reqs.length ? reqs.length + ' request' + (reqs.length === 1 ? '' : 's') : 'no requests yet';
        el.innerHTML = (reqs.length ? reqs.slice(0, 24).map(x =>
          '<li><span class="a-time">' + (new Date(x.at * 1000).toLocaleString().slice(0, 17)) + '</span>' +
          '<span class="a-txt"><b>' + ui.esc(x.ref) + '</b> <span class="pill" style="font-size:8px;background:rgba(212,175,55,.16);color:var(--gold);">' + (x.kind === 'delete' ? 'DELETION' : 'DATA COPY') + '</span> · ' + ui.esc(x.name) + (x.email ? ' · ' + ui.esc(x.email) : '') + (x.studentId ? ' · <b>' + ui.esc(x.studentId) + '</b>' : '') +
          '<div class="small faint" style="margin-top:2px;">' + ui.esc(x.note || '') + '</div></span></li>').join('')
          : '<li><span class="a-time">—</span><span class="a-txt faint">No data requests filed — the rights rail is quiet.</span></li>');
      })
      .catch(() => {
        if (cnt) cnt.textContent = '';
        el.innerHTML = '<li><span class="a-time">—</span><span class="a-txt faint">OS rail unreachable right now — requests filed while offline are stored on the student\'s device and will sync when the rail returns.</span></li>';
      });
  }
  const dreqRefresh = document.getElementById('dreq-refresh');
  if (dreqRefresh) dreqRefresh.addEventListener('click', renderDataRequests);
  function doSelfTest() {
    const results = db.securitySelfTest();
    const el = document.getElementById('sec-selftest-results');
    el.innerHTML = results.map(r =>
      '<li><span class="a-time">' + (r.pass
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><polyline points="20 6 9 17 4 12"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="#e0604f" stroke-width="2" stroke-linecap="round" style="width:14px;height:14px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>') + '</span>' +
      '<span class="a-txt"><b style="color:' + (r.pass ? '#7ee2a4' : '#f0a89c') + ';">' + (r.pass ? 'PASS' : 'FAIL') + '</b> — ' + ui.esc(r.name) + '. ' + ui.esc(r.detail) + '</span></li>').join('') ||
      '<li><span class="a-time">—</span><span class="a-txt faint">No guards to test.</span></li>';
    ui.toastOk(results.every(r => r.pass) ? 'Self-test passed — every guard fired.' : 'Self-test found a guard that did not fire!');
    renderAll();
  }
  function renderStorage() {
    const el = document.getElementById('sec-storage');
    if (!el) return;
    const m = db.storageMeter();
    const pct = m.percent;
    const warn = pct > 60;
    el.innerHTML =
      '<div style="display:flex;align-items:center;gap:14px;margin-bottom:10px;">' +
      '<div style="flex:1;height:9px;border-radius:99px;background:rgba(255,255,255,0.06);overflow:hidden;">' +
      '<div style="width:' + Math.max(2, pct) + '%;height:100%;border-radius:99px;background:' + (warn ? 'var(--warn)' : 'linear-gradient(90deg,#a8842a,var(--gold))') + ';"></div></div>' +
      '<span style="font-size:12px;color:' + (warn ? 'var(--warn)' : 'var(--muted)') + ';white-space:nowrap;">' + pct + '% of ' + m.quotaMB + ' MB</span></div>' +
      '<dl class="kv" style="font-size:12.5px;">' +
      '<dt>Stored</dt><dd>' + m.kb + ' KB <span class="faint">(≈ ' + m.mb + ' MB)</span></dd>' +
      '<dt>Students held</dt><dd>' + m.enrollments + '</dd>' +
      '<dt>Per student</dt><dd>≈ ' + m.perStudentKB + ' KB each</dd>' +
      '<dt>Headroom</dt><dd><b style="color:var(--text);">≈ ' + m.headroomStudents.toLocaleString() + ' more students</b> <span class="faint">at current size</span></dd>' +
      '</dl>' +
      '<p class="small faint" style="margin-top:10px;">This is the demo\'s browser store (≈5 MB per origin). Production moves to Firebase/Firestore where capacity is effectively unlimited — see FOR-LEE.md.</p>';
  }
  function doSaveSecurity() {
    const n = v => Math.max(1, parseInt(document.getElementById(v).value, 10) || 1);
    db.updateSettings({
      security: Object.assign({}, db.getSettings().security, {
        maxLoginAttempts: n('sec-login-attempts'),
        lockoutMinutes: n('sec-lockout-mins'),
        verifyCodeAttempts: n('sec-code-attempts'),
        retainSelfies: document.getElementById('sec-selfies').value,
        sessionTimeoutMinutes: Math.max(1, parseInt(document.getElementById('sec-session').value, 10) || 15),
      }),
    });
    ui.toastOk('Security settings saved.');
    renderSecurity();
  }
  function doPurgeSelfies() {
    const n = db.purgeRetainedSelfies();
    ui.toastOk(n ? 'Purged ' + n + ' decided selfie' + (n === 1 ? '' : 's') + '.' : 'Nothing to purge — no retained selfies with a decision yet.');
    renderAll();
  }

  function renderAll() {
    kpis(); funnel(); renderList(); pipelineDemo(); footState(); mailCount(); renderSecurity(); renderStorage();
  }

  // the PII incident board + data-requests board load once on boot + on demand
  // (Refresh) — never on the 3s renderAll, so the OS rail isn't polled.
  setTimeout(() => { try { renderPii(); } catch (e) { /* rail unavailable */ } }, 600);
  setTimeout(() => { try { renderDataRequests(); } catch (e) { /* rail unavailable */ } }, 700);

  /* ================= RFX coupons (the golden ticket) =================
     Staff mints coupon codes for people who deserve them (partners,
     scholarships, easter eggs hidden around social spaces). A prospect
     applies the code on the reception, gets routed into the standard
     registration with the course included/discounted, and the coupon is
     consumed. Once-and-done: expired or fully redeemed, never renewed. */
  function onCoupons() {
    const m = ui.modal(
      '<div class="coupon-admin">' +
      '<p class="small" style="margin-bottom:16px;">Mint an <b>RFX course coupon</b> — a golden ticket for someone who deserves it. The prospect applies it on the reception, registers exactly like every student (never skippable), and the coupon is consumed. <b>Once-and-done:</b> expired or fully redeemed, a coupon can never be renewed.</p>' +
      '<div class="card" style="padding:14px;margin-bottom:14px;">' +
      '<div class="eyebrow" style="margin-bottom:10px;">Mint a coupon</div>' +
      '<div class="field"><label>Code <span class="small faint">(blank = auto-generate, e.g. RFX-K4YLKX)</span></label><input class="input mono" id="cp-code" placeholder="RFX-PARTNER-2026" style="text-transform:uppercase;" maxlength="20"></div>' +
      '<div class="field"><label>Note / purpose</label><input class="input" id="cp-note" placeholder="e.g. Lilongwe partner programme scholarship"></div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;">' +
      '<div class="field"><label>Benefit</label><select class="select" id="cp-benefit"><option value="free">Full course (free)</option><option value="percent">% off</option><option value="demo">Academy tour (time-limited)</option></select></div>' +
      '<div class="field" id="cp-pct-wrap" hidden><label>Percent off</label><input class="input" id="cp-pct" type="number" min="1" max="99" value="5"></div>' +
      '<div class="field" id="cp-demo-wrap" hidden><label>Tour length (hours)</label><input class="input" id="cp-demo-hours" type="number" min="1" max="168" value="48"></div>' +
      '<div class="field"><label>Max uses</label><input class="input" id="cp-uses" type="number" min="1" max="1000" value="1"></div>' +
      '<div class="field"><label>Expiry</label><select class="select" id="cp-exp"><option value="0">Never expires</option><option value="7">7 days</option><option value="30" selected>30 days</option><option value="90">90 days</option><option value="365">1 year</option></select></div>' +
      '</div>' +
      '<button class="btn btn-gold" id="cp-create" style="width:100%;margin-top:8px;"><span data-icon="gift"></span> Mint coupon</button>' +
      '</div>' +
      '<div class="eyebrow" style="margin-bottom:8px;">Existing coupons</div>' +
      '<div id="cp-list" style="display:flex;flex-direction:column;gap:8px;"></div>' +
      '<div class="card" style="padding:14px;margin-top:14px;">' +
      '<div class="eyebrow" style="margin-bottom:10px;">Coupon analytics</div>' +
      '<div id="cp-analytics" class="small"></div>' +
      '</div>' +
      '</div>');
    m.setTitle('RFX course coupons');
    const list = () => {
      const box = m.el.querySelector('#cp-list');
      const rows = db.listCoupons();
      const analytics = m.el.querySelector('#cp-analytics');
      if (analytics) {
        const total = rows.length;
        const active = rows.filter(r => r.status.key === 'active').length;
        const redeemed = rows.reduce((s, r) => s + r.used, 0);
        const students = rows.reduce((s, r) => s + r.redemptions, 0);
        const fullCourse = rows.filter(r => /full course access/i.test(r.benefit)).length;
        const top = rows.slice().sort((a, b) => b.used - a.used).slice(0, 3).filter(r => r.used > 0)
          .map(r => '<b class="mono">' + ui.esc(r.code) + '</b> (' + r.used + '×)').join(' · ');
        analytics.innerHTML =
          '<div style="display:flex;gap:22px;flex-wrap:wrap;margin-bottom:8px;">' +
          '<span><b class="gold">' + total + '</b> coupons</span>' +
          '<span><b class="gold">' + active + '</b> active</span>' +
          '<span><b class="gold">' + redeemed + '</b> uses consumed</span>' +
          '<span><b class="gold">' + students + '</b> students enrolled via coupon</span>' +
          '<span><b class="gold">' + fullCourse + '</b> full-course gifts</span>' +
          '</div>' +
          (top ? '<div class="small faint">Most used: ' + top + '</div>' : '<div class="small faint">No redemptions yet — share a code and watch it fly.</div>');
      }
      if (!rows.length) { box.innerHTML = '<p class="small faint">No coupons yet — mint the first one above.</p>'; return; }
      box.innerHTML = rows.map(c => {
        const pill = c.status.key === 'active' ? '#2f9e5f' : c.status.key === 'paused' ? '#c98f1b' : '#c0392b';
        const act = c.status.key === 'active'
          ? '<button class="btn btn-dark btn-sm" data-cp-act="pause:' + ui.esc(c.code) + '">Pause</button><button class="btn btn-dark btn-sm" data-cp-act="revoke:' + ui.esc(c.code) + '" style="color:#e07a6a;">Revoke</button>'
          : c.status.key === 'paused'
            ? '<button class="btn btn-dark btn-sm" data-cp-act="active:' + ui.esc(c.code) + '">Resume</button>'
            : '';
        return '<div style="border:1px solid var(--border);border-radius:10px;padding:10px 12px;">' +
          '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">' +
          '<b class="mono" style="color:var(--text);">' + ui.esc(c.code) + '</b>' +
          '<span style="font-size:11px;font-weight:700;color:' + pill + ';">' + c.status.label.toUpperCase() + '</span>' +
          '<span class="small faint">' + c.used + '/' + c.totalUses + ' uses · ' + ui.esc(c.benefit) + '</span>' +
          '<span class="small faint">' + (c.expiresAt ? 'expires ' + db.fmtDateShort(c.expiresAt) : 'no expiry') + '</span>' +
          '<span style="margin-left:auto;display:flex;gap:6px;">' + act + '</span>' +
          '</div>' +
          (c.note ? '<p class="small faint" style="margin:6px 0 0;">' + ui.esc(c.note) + ' — by ' + ui.esc(c.createdBy) + ' · ' + c.redemptions + ' redeemed</p>' : '') +
          '</div>';
      }).join('');
      box.querySelectorAll('[data-cp-act]').forEach(b => b.addEventListener('click', () => {
        const [status, code] = b.dataset.cpAct.split(':');
        const r = db.setCouponStatus(code, status);
        if (r.ok) ui.toastOk('Coupon ' + code + ' → ' + status);
        else ui.toastErr(r.msg);
        list();
      }));
    };
    const expDays = () => parseInt(m.el.querySelector('#cp-exp').value, 10) || 0;
    m.el.querySelector('#cp-benefit').addEventListener('change', () => {
      const v = m.el.querySelector('#cp-benefit').value;
      m.el.querySelector('#cp-pct-wrap').hidden = v !== 'percent';
      m.el.querySelector('#cp-demo-wrap').hidden = v !== 'demo';
    });
    m.el.querySelector('#cp-create').addEventListener('click', () => {
      const days = expDays();
      const expiresAt = days ? new Date(Date.now() + days * 86400000).toISOString() : null;
      const res = db.createCoupon({
        code: m.el.querySelector('#cp-code').value,
        note: m.el.querySelector('#cp-note').value,
        totalUses: m.el.querySelector('#cp-uses').value,
        expiresAt: expiresAt,
        benefit: m.el.querySelector('#cp-benefit').value === 'percent'
          ? { type: 'percent', value: m.el.querySelector('#cp-pct').value }
          : m.el.querySelector('#cp-benefit').value === 'demo'
            ? { type: 'demo', value: m.el.querySelector('#cp-demo-hours').value || 48 }
            : { type: 'free' },
        createdBy: 'Staff console',
      });
      if (!res.ok) { ui.toastErr(res.msg); return; }
      ui.toastOk('Coupon ' + res.coupon.code + ' minted — share it with someone who deserves it');
      m.el.querySelector('#cp-code').value = '';
      m.el.querySelector('#cp-note').value = '';
      list();
    });
    list();
  }

  /* ================= price-increase notice (copy-ready email) =================
     The founder's "prices are going up — refer before it does" letter. Shown as
     a draft card so staff can copy it into the real email rail (production:
     send via the email provider to all ACTIVE students + parents who pay).
     Small, warm, honest — the referral angle is a gift, never a scare. */
  function onPriceNotice() {
    const body =
      '<div style="font-family:Georgia,serif;color:#080808;max-width:560px;margin:0 auto;">' +
      '<div style="border-bottom:2px solid #d4af37;padding-bottom:14px;margin-bottom:20px;">' +
      '<span style="font-size:22px;font-weight:700;">Reality FX</span> <span style="font-size:13px;font-style:italic;color:#a8842a;">Academy</span>' +
      '<div style="font-size:10px;letter-spacing:3px;color:#8a8a8a;font-family:Arial,sans-serif;">A NOTE BEFORE PRICES CHANGE</div></div>' +
      '<p style="font-family:Arial,sans-serif;font-size:14px;color:#333;">Dear Reality FX family,</p>' +
      '<p style="font-family:Arial,sans-serif;font-size:14px;color:#333;line-height:1.6;">From <b>1 September</b>, course fees will increase as we deepen the Academy — more lessons, more assessments, more live sessions, and the same one-on-one care that has carried every student so far.</p>' +
      '<p style="font-family:Arial,sans-serif;font-size:14px;color:#333;line-height:1.6;">For students and families paying for themselves, here is the honest part: <b>enrol today at the current price</b>, and that price is locked to you forever — your seat never goes up, no matter how the fee changes for newcomers.</p>' +
      '<p style="font-family:Arial,sans-serif;font-size:14px;color:#333;line-height:1.6;">And if someone you care about has been meaning to start? <b>Bring them in before the change.</b> Share your personal referral code from your members panel — they enrol at today\'s price, and you earn up to 30% commission once they are fully locked in. It is a gift that pays both ways.</p>' +
      '<p style="font-family:Arial,sans-serif;font-size:13px;color:#666;line-height:1.6;">The Academy stays deliberately small and personal — enrolment is capped, so the current price only applies while seats last. After the increase, no exceptions and no grandfathering for new students: the window is real.</p>' +
      '<p style="font-family:Arial,sans-serif;font-size:14px;color:#333;">With you in the family,<br>The Reality FX team</p>' +
      '<div style="border-top:1px solid #eee;margin-top:22px;padding-top:12px;font-family:Arial,sans-serif;font-size:11px;color:#999;">Questions? Reply to this email or message Sarrah on the members panel — the human line is always on.</div></div>';
    const m = ui.modal(
      '<p class="small" style="margin-bottom:12px;">Copy-ready letter for the price increase — send it to every ACTIVE student (and parents who pay) before the change. The referral angle is a gift, never a scare: today\'s price is locked to existing students, and friends who join before the increase earn you up to 30%. Edit the date before sending.</p>' +
      '<div style="border:1px solid var(--border);border-radius:10px;padding:16px;max-height:340px;overflow:auto;background:#fff;">' + body + '</div>' +
      '<div style="display:flex;gap:10px;margin-top:14px;align-items:center;">' +
      '<button class="btn btn-gold" id="pn-copy">' + (RFX.icons && RFX.icons.copy ? RFX.icons.copy : '') + ' Copy HTML</button>' +
      '<span class="small faint">Paste into your email provider\'s editor, or let the team send it from the Mailbox rail.</span></div>');
    m.setTitle('Price increase — draft notice');
    m.el.querySelector('#pn-copy').addEventListener('click', () => {
      ui.copyText(body);
      ui.toastOk('Email HTML copied — ready to send.');
    });
  }

  /* ================= init ================= */
  function init() {
    fillMethods();
    document.getElementById('btn-create').addEventListener('click', onCreate);
    document.getElementById('btn-demo').addEventListener('click', onDemo);
    document.getElementById('btn-webhook').addEventListener('click', onWebhook);
    document.getElementById('btn-demo-pass').addEventListener('click', onDemoPass);
    document.getElementById('btn-coupons').addEventListener('click', onCoupons);
    document.getElementById('btn-price-notice').addEventListener('click', onPriceNotice);
    document.getElementById('btn-refresh').addEventListener('click', renderAll);
    document.getElementById('sec-save').addEventListener('click', doSaveSecurity);
    document.getElementById('sec-selftest').addEventListener('click', doSelfTest);
    RFX.bridge.onSync(renderAll);
    renderAll();
    setInterval(renderAll, 3000);
  }

  /* expose for inline onclick handlers */
  RFX.adminApprove = doApprove;
  RFX.adminReject = doReject;
  RFX.adminConfirmReject = confirmReject;
  RFX.adminResend = doResend;
  RFX.adminSync = doSync;
  RFX.adminRevealCode = revealCode;
  RFX.adminSaveSettings = doSaveSettings;
  RFX.adminPrint = doPrint;
  function doDownloadPdf(id) {
    const enr = db.byId(id);
    if (enr && RFX.pdf) RFX.pdf.downloadInvoice(enr);
  }
  RFX.adminDownloadPdf = doDownloadPdf;
  RFX.adminIssueCredit = doIssueCredit;
  RFX.adminQueueRefund = doQueueRefund;
  RFX.adminRefresh = renderAll;
  RFX.adminPurgeSelfies = doPurgeSelfies;

  /* ---------------- the website enroll rail (demo) ---------------- */
  /* FOR-LEE 9.15: in PRODUCTION the website never creates enrollments — a
     server-side webhook receives PayPal's verified notification and calls
     System A's POST /api/enroll. The demo has no server, so the website's
     simulated checkout posts the approved-payment facts here (via a hidden
     iframe + postMessage) and System A's own machine runs the REAL pipeline
     — enrollment, invoice, invoice email, registration email, link. Same
     code path the webhook uses; the secret below stands in for the webhook
     signature check (a demo stand-in, never a production gate). */
  const WEBSITE_ENROLL_SECRET = 'rfx-demo-website-bridge';
  window.addEventListener('message', function (ev) {
    const d = ev.data || {};
    if (d.type !== 'RFX_ENROLL' || d.secret !== WEBSITE_ENROLL_SECRET) return;
    const pay = d.payment || {};
    if (!pay.customerName || !pay.email || !pay.transactionId) {
      try { ev.source.postMessage({ type: 'RFX_ENROLL_OK', ok: false, msg: 'Missing payment facts.' }, '*'); } catch (e) {}
      return;
    }
    const enr = db.createEnrollment(pay);
    const isNew = !(enr.registration && enr.registration.token);
    if (isNew) { db.createRegistrationInvite(enr); db.sendInviteEmails(enr); }
    const link = location.origin + '/register.html?token=' + enr.registration.token;
    try {
      ev.source.postMessage({
        type: 'RFX_ENROLL_OK', ok: true, enrId: enr.id, fresh: isNew,
        invoice: enr.invoice.number, link: link,
      }, '*');
    } catch (e) {}
    renderAll();
  });

  document.addEventListener('DOMContentLoaded', init);
})();
