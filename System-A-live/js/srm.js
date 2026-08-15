/* Students (SRM) — srm.html
   The Student Relationship Manager: every enrollment is a relationship record.
   Search, filter, open a full profile (identity, wallet, awards, spend, audit).
   The moderator's two queues live here too: the OS Fair Play flags panel
   (integrity flags raised by the academy) and the review queue (identities
   that need eyes before approval). */
(function () {
  'use strict';
  const db = RFX.db, ui = RFX.ui;

  const $ = id => document.getElementById(id);

  /* Review queue — every identity carrying a flag (selfie quality, duplicate
     photo, phone/name/email reuse) gets a row here so the moderator actions
     them in one screen. Flags stay review triggers, never verdicts. */
  function isFlagged(e) {
    const reg = e.registration || {};
    return reg.selfieQuality === 'suspicious' || !!reg.selfieDuplicate || !!((reg.identitySignals || []).length);
  }
  function flagPills(e) {
    const reg = e.registration || {};
    const pills = [];
    if (reg.selfieQuality === 'suspicious') pills.push('selfie flagged');
    if (reg.selfieDuplicate) pills.push('duplicate photo');
    (reg.identitySignals || []).forEach(s => pills.push(s.signal.replace(/_/g, ' ').toLowerCase()));
    return pills;
  }
  function renderQueue() {
    const flagged = db.enrollments().filter(isFlagged);
    const box = $('srm-queue');
    if (!box) return;
    if (!flagged.length) {
      box.innerHTML = '<p class="small" style="color:var(--faint);margin:0;">No flags — every identity is clear.</p>';
      return;
    }
    box.innerHTML = flagged.map(e =>
      '<div style="display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--border);flex-wrap:wrap;">' +
      '<div style="flex:1;min-width:220px;"><b style="color:var(--text);">' + ui.esc(e.payment.customerName) + '</b> <span class="mono small faint">' + ui.esc(e.studentId || e.id) + '</span>' +
      '<div class="small faint">' + ui.esc(db.maskEmail(e.payment.email)) + ' · ' + ui.statePill(e.state) + '</div></div>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;">' + flagPills(e).map(p => '<span class="pill warn" style="font-size:9px;">' + ui.esc(p) + '</span>').join('') + '</div>' +
      '<span class="btn btn-dark btn-sm" data-open="' + e.id + '">Review</span></div>'
    ).join('');
    box.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => openProfile(b.dataset.open)));
  }

  function kpis() {
    const all = db.enrollments();
    const active = all.filter(e => e.state === 'ACTIVE').length;
    const approved = all.filter(e => e.state === 'APPROVED' || e.state === 'RFX_OS_CONFIRMED' || e.state === 'SYNCING_WITH_RFX_OS').length;
    const wallets = db.wallets().filter(w => w.balance > 0).length;
    const flagged = all.filter(isFlagged).length;
    $('srm-count').innerHTML = '<span class="dot gold"></span> ' + all.length + ' records · ' + active + ' active';
    $('srm-chips').innerHTML = [
      '<span class="pill ok">' + active + ' active</span>',
      '<span class="pill info">' + approved + ' approved</span>',
      '<span class="pill gold">' + wallets + ' wallets with credit</span>',
      (flagged ? '<span class="pill warn">' + flagged + ' flagged for review</span>' : ''),
    ].join(' ');
  }

  function countryOf(e) {
    return (e.registration && e.registration.personal && e.registration.personal.country) || '—';
  }

  /* ---- OS Fair Play flags panel ----
     The OS raises integrity flags (fast answers, suspicious perfect scores)
     and reports them to its handoff server. The moderator pulls the queue
     here and decides: WARN (a measured Trust Bar penalty, recorded against
     the identity) or DISMISS (flag cleared, no move — flags stay review
     triggers, never auto-verdicts). The decision is written back to the OS
     server so both systems agree the flag is resolved. */
  function studentBySid(sid) {
    return db.enrollments().find(e => e.studentId === sid) || null;
  }
  /* Review SLA — the same honest-clock philosophy as registration review.
     A flag should normally be decided within this window; past it, the panel
     says so plainly and the count badge turns warn-red, so a queue that's
     backing up is visible at a glance instead of quietly ageing. */
  function osfSlaMinutes() {
    return Number((db.getSettings() && db.getSettings().security && db.getSettings().security.reviewSlaMinutes) || 120);
  }
  function osfWaitLabel(f) {
    // ts is epoch ms (the OS client sends Date.now()); older/demo records may
    // hold seconds, so normalise defensively.
    const raw = Number(f.ts) || 0;
    const raised = raw < 1e12 ? raw * 1000 : raw; // seconds → ms
    const mins = Math.max(0, Math.round((Date.now() - raised) / 60000));
    const sla = osfSlaMinutes();
    const overdue = mins > sla;
    const wait = mins < 60 ? mins + 'm' : (Math.floor(mins / 60) + 'h' + (mins % 60 ? ' ' + mins % 60 + 'm' : ''));
    return { mins, wait, overdue, sla };
  }
  /* Moderator-facing labels for every flag type the OS can raise. */
  function osfTypeLabel(type) {
    return type === 'perfect-fast' ? 'Suspicious perfect score'
      : type === 'retake-abuse' ? 'Retake without review'
      : type === 'uniform-timing' ? 'Robotic response rhythm'
      : type === 'no-reading' ? 'Answers don\'t track question length'
      : type === 'instant-streak' ? '5+ instant correct answers'
      : type === 'pattern-picks' ? 'Mechanical answer pattern'
      : type === 'jump-retake' ? '40+ point jump, minimal review'
      : type === 'paused-search' ? 'Pause then fast near-perfect run'
      : 'Fast answer (<1.4s)';
  }
  function osfRows(flags) {
    if (!flags.length) return '<p class="small" style="color:var(--faint);margin:0;">No flags reported by the academy yet. Answering a quiz suspiciously fast (or a perfect score in seconds) raises one here.</p>';
    return flags.map(f => {
      const e = studentBySid(f.studentId);
      const name = e ? (e.payment.customerName || '—') : '<span class="faint">unknown student</span>';
      const sid = '<span class="mono small">' + ui.esc(f.studentId) + '</span>';
      const rawTs = Number(f.ts) || 0;
      const when = db.fmtDateShort(rawTs ? new Date(rawTs < 1e12 ? rawTs * 1000 : rawTs).toISOString() : null);
      const w = osfWaitLabel(f);
      const waitHtml = '<span class="pill ' + (w.overdue ? 'warn' : '') + '" style="font-size:9px;" title="Review SLA: normally decided within ~' + w.sla + ' min">' +
        (w.overdue ? '⚠ ' : '') + 'awaiting moderator ' + w.wait + (w.overdue ? ' · past ~' + w.sla + 'm SLA' : '') + '</span>';
      const typeTxt = osfTypeLabel(f.type);
      return '<div style="display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--border);flex-wrap:wrap;">' +
        '<div style="flex:1;min-width:230px;"><b style="color:var(--text);">' + name + '</b> ' + sid +
        '<div class="small faint">' + ui.esc(typeTxt) + (f.ch ? ' · Chapter ' + ui.esc(f.ch) + (f.qi ? ' Q' + ui.esc(f.qi) : '') : '') + (f.ms ? ' · ' + f.ms + 'ms' : '') + (when ? ' · ' + when : '') + ' ' + waitHtml + '</div>' +
        '<div class="small faint" style="margin-top:2px;">' + ui.esc(f.note || '') + '</div></div>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
        (e ? '<button class="btn btn-gold btn-sm" data-warn="' + f.id + '">Warn · Trust −10</button>' : '<span class="pill warn" style="font-size:9px;">not approved yet</span>') +
        '<button class="btn btn-dark btn-sm" data-dismiss="' + f.id + '">Dismiss</button>' +
        '</div></div>';
    }).join('');
  }
  /* Email the moderator the moment new flags land — one email per batch, so
     a flood of flags is one digest, never an inbox storm. The finance address
     is the house default; the email lands in the Mailbox like every other
     system message (production swaps db.email for the real provider). */
  function emailModeratorNewFlags(pending) {
    if (!pending.length) return;
    const lastSeen = localStorage.getItem('osf-last-emailed') || '';
    const fresh = pending.filter(f => (f.id || '') > lastSeen);
    if (!fresh.length) return;
    localStorage.setItem('osf-last-emailed', fresh[fresh.length - 1].id);
    const finance = (db.getSettings() && db.getSettings().financeEmail) || 'realityfx20@gmail.com';
    const rows = fresh.map(f => {
      const e = studentBySid(f.studentId);
      return '<div style="background:#f6f1e3;border:1px solid #d4af37;border-radius:8px;padding:10px 14px;margin-bottom:8px;font-family:Arial,sans-serif;font-size:12.5px;color:#333;">' +
        '<b>' + ui.esc(e ? (e.payment.customerName || '—') : f.studentId) + '</b> · <span class="mono">' + ui.esc(f.studentId) + '</span> · <b>' + ui.esc(f.type) + '</b>' +
        (f.ch ? ' · Chapter ' + ui.esc(f.ch) + (f.qi ? ' Q' + ui.esc(f.qi) : '') : '') +
        (f.ms ? ' · ' + f.ms + 'ms' : '') +
        '<br/><span style="color:#666;">' + ui.esc(f.note || '') + '</span></div>';
    }).join('');
    db.email('moderator', finance,
      fresh.length + ' OS Fair Play flag' + (fresh.length > 1 ? 's' : '') + ' awaiting review — Reality FX',
      '<div style="background:#0b0b0b;padding:28px;border-radius:14px;">' +
      '<div style="font-family:Georgia,serif;font-size:22px;color:#d4af37;letter-spacing:1px;margin-bottom:6px;">REALITY FX</div>' +
      '<div style="font-family:Arial,sans-serif;font-size:12px;color:#999;letter-spacing:3px;margin-bottom:18px;">INTEGRITY · FAIR PLAY · MODERATOR DIGEST</div>' +
      '<p style="font-family:Arial,sans-serif;font-size:14px;color:#eee;">The academy raised <b style="color:#d4af37;">' + fresh.length + ' new flag' + (fresh.length > 1 ? 's' : '') + '</b> that need your eyes. Open the Students (SRM) page — the OS Fair Play flags panel — to warn (Trust Bar −10) or dismiss each one. Flags stay review triggers, never auto-verdicts: your call is the verdict.</p>' +
      rows +
      '<p style="font-family:Arial,sans-serif;font-size:12px;color:#999;">Review SLA: flags are normally decided within ~' + osfSlaMinutes() + ' minutes.</p></div>');
  }
  function renderOsFlags() {
    const panel = $('osf-panel');
    if (!panel) return;
    panel.innerHTML = '<p class="small" style="color:var(--faint);margin:0;">Syncing with the academy server…</p>';
    db.listOsFlags().then(function (flags) {
      const pending = flags.filter(f => f.status === 'pending').slice().reverse();
      const cnt = $('osf-count');
      if (cnt) {
        const overdue = pending.filter(f => osfWaitLabel(f).overdue).length;
        cnt.innerHTML = pending.length + ' pending' + (overdue ? ' · ' + overdue + ' past SLA' : '');
        cnt.className = 'pill ' + (overdue ? 'warn' : (pending.length ? 'gold' : ''));
      }
      panel.innerHTML = osfRows(pending);
      panel.querySelectorAll('[data-warn]').forEach(b => b.addEventListener('click', () => osfWarn(b.dataset.warn)));
      panel.querySelectorAll('[data-dismiss]').forEach(b => b.addEventListener('click', () => osfDismiss(b.dataset.dismiss)));
      emailModeratorNewFlags(pending);
    }).catch(function () {
      const cnt = $('osf-count');
      if (cnt) cnt.innerHTML = 'offline';
      panel.innerHTML = '<p class="small" style="color:var(--faint);margin:0;">The academy server is offline (' + db.osFlagsServer() + '). Start the OS handoff server to pull the flag queue.</p>';
    });
  }
  function osfWarn(id) {
    db.listOsFlags().then(function (flags) {
      const flag = flags.find(x => x.id === id);
      if (!flag) return;
      const e = studentBySid(flag.studentId);
      if (!e) { ui.toastWarn('This flag has no approved student yet — nothing to move on the Trust Bar.'); return; }
      const r = db.adjustTrust(e, { delta: -10, kind: 'penalty', by: 'Staff', ref: id, reason: 'OS Fair Play flag — ' + flag.type + (flag.ch ? ' (Chapter ' + flag.ch + ')' : '') + ': ' + (flag.note || 'integrity signal') });
      db.resolveOsFlag(id, 'warned', 'Staff', 'Trust Bar −10 · ' + r.score + '%').then(function () {
        ui.toastOk('Warning applied → Trust Bar at ' + r.score + '% · flag resolved');
        renderOsFlags();
      });
    });
  }
  function osfDismiss(id) {
    db.resolveOsFlag(id, 'dismissed', 'Staff', 'Dismissed — no Trust Bar move').then(function () {
      ui.toastOk('Flag dismissed — no Trust Bar move');
      renderOsFlags();
    });
  }

  function render() {
    const q = $('srm-q').value.trim().toLowerCase();
    const f = $('srm-filter').value;
    const all = db.enrollments();
    const list = all.filter(e => {
      if (f === 'FLAGGED') return isFlagged(e);
      if (f && e.state !== f) return false;
      if (!q) return true;
      const hay = [
        e.payment.customerName, e.payment.email, e.payment.course,
        e.studentId || '', e.studentCode || '', e.id, countryOf(e),
      ].join(' ').toLowerCase();
      return hay.indexOf(q) !== -1;
    });
    const box = $('srm-list');
    if (!all.length) {
      box.innerHTML = '<div class="empty-state"><div class="e-ic">' + (RFX.icons.users || '') + '</div><div class="e-t">No students yet</div>' +
        '<p class="small">Every enrollment becomes a relationship record the moment it is created — approved or not. Create one in the Staff Console to see it here.</p></div>';
      return;
    }
    if (!list.length) {
      box.innerHTML = '<div class="empty-state" style="padding:26px;"><div class="e-t">No records match</div><p class="small">Try a different search or clear the stage filter.</p></div>';
      return;
    }
    box.innerHTML = '<table class="tbl"><thead><tr>' +
      '<th>Student</th><th>ID</th><th>Course</th><th>Country</th><th>Wallet</th><th>State</th><th></th>' +
      '</tr></thead><tbody>' +
      list.map(e => {
        const w = db.getWallet(e.payment.email);
        return '<tr data-id="' + e.id + '">' +
          '<td><b style="color:var(--text);">' + ui.esc(e.payment.customerName) + '</b><div class="small faint">' + ui.esc(db.maskEmail(e.payment.email)) + '</div></td>' +
          '<td class="mono small">' + (e.studentId || '<span class="faint">—</span>') + '</td>' +
          '<td class="small" style="color:var(--muted);">' + ui.esc(e.payment.course) + '<div class="small faint">' + db.money(e.payment.price, e.payment.currency) + (e.coupon ? ' · <span class="pill gold" style="font-size:8px;">' + ui.esc(e.coupon.code) + '</span>' : '') + '</div></td>' +
          '<td class="small">' + ui.esc(countryOf(e)) + '</td>' +
          '<td class="small" style="color:var(--muted);">' + (w.balance > 0 ? '<span class="gold">' + db.money(w.balance, w.currency) + '</span>' : '<span class="faint">R0.00</span>') + '</td>' +
          '<td>' + ui.statePill(e.state) + '</td>' +
          '<td style="text-align:right;"><span class="btn btn-dark btn-sm">Profile</span></td>' +
          '</tr>';
      }).join('') + '</tbody></table>';
    box.querySelectorAll('tbody tr').forEach(tr => tr.addEventListener('click', () => openProfile(tr.dataset.id)));
    renderQueue();
  }

  /* ---------------- profile ---------------- */
  function merchLine(e) {
    const mine = db.merchByEmail(e.payment.email);
    if (!mine.length) return '';
    const bits = mine.map(o => o.kind === 'earned'
      ? 'reward (avg ' + o.average + '%) — ' + (db.MERCH_STATUS_LABELS[o.status] || o.status)
      : (o.items[0] ? o.items[0].name : 'merch') + ' — ' + (db.MERCH_STATUS_LABELS[o.status] || o.status)).join('; ');
    return '<dt>Merch</dt><dd>' + ui.esc(bits) + '</dd>';
  }
  function printLine(e) {
    const pt = e.printTrust || {};
    if (pt.level === 'trusted') {
      return '<dt>Print access</dt><dd><span class="pill ok" style="font-size:9px;">trusted</span> granted ' + db.fmtDateShort(pt.grantedAt) + ' by ' + ui.esc(pt.grantedBy || '—') +
        ' <button class="btn btn-dark btn-sm" style="margin-left:8px;" onclick="RFX.srmRevokePrint(\'' + e.id + '\')">Revoke</button></dd>';
    }
    if (pt.revokedAt) {
      return '<dt>Print access</dt><dd><span class="pill danger" style="font-size:9px;">revoked</span> ' + db.fmtDateShort(pt.revokedAt) + ' <button class="btn btn-ghost btn-sm" style="margin-left:8px;" onclick="RFX.srmGrantPrint(\'' + e.id + '\')">Re-grant</button></dd>';
    }
    return '<dt>Print access</dt><dd><span class="pill" style="font-size:9px;">standard</span> watermarked · print blacked out' +
      ' <button class="btn btn-ghost btn-sm" style="margin-left:8px;" onclick="RFX.srmGrantPrint(\'' + e.id + '\')">Grant (earned trust)</button></dd>';
  }
  function cooldownLine(e) {
    if (e.cooldownFlag) {
      return '<dt>Cooldown</dt><dd><span class="pill warn" style="font-size:9px;">refunded identity</span> re-enrollment blocked until ' + db.fmtDateShort(e.cooldownFlag.until) + ' <span class="small faint">(' + e.cooldownFlag.daysLeft + 'd left · prior refund ' + e.cooldownFlag.priorRefund + ')</span></dd>';
    }
    if (e.resolution && e.resolution.materialRevoked) {
      return '<dt>Revoked</dt><dd><span class="pill danger" style="font-size:9px;">material rights revoked</span> on refund — re-enroll eligible ' + db.fmtDateShort(e.resolution.reapplyEligibleAt) + '</dd>';
    }
    return '';
  }

  function openProfile(id) {
    const e = db.byId(id);
    if (!e) return;
    // Access logging — opening a student's record is recorded: who, when, what.
    db.logAccess(e.payment.customerName + (e.studentId ? ' (' + e.studentId + ')' : ''), 'profile opened', 'SRM profile view');
    const w = db.getWallet(e.payment.email);
    const I = RFX.icons || {};
    const reg = e.registration || {};
    const ledger = (w.ledger || []).slice().reverse().slice(0, 12);
    const audit = (e.audit || []).slice().reverse().slice(0, 10);
    const identity = reg.personal || {};

    const ledgerRows = ledger.length
      ? ledger.map(x => {
        const signed = x.amount < 0
          ? '<b style="color:#f0a89c;">-' + db.money(Math.abs(x.amount), w.currency) + '</b>'
          : '<b style="color:#7ee2a4;">+' + db.money(x.amount, w.currency) + '</b>';
        return '<li><span class="a-time">' + db.fmtDateShort(x.at) + '</span><span class="a-txt">' + signed + ' ' + ui.esc(x.note || '') + ' <span class="small faint">(' + ui.esc(x.ref || x.type || '') + ')</span></span></li>';
      }).join('')
      : '<li><span class="a-txt faint">No wallet activity yet — balance starts at R0.00.</span></li>';

    const auditRows = audit.length
      ? audit.map(a => '<li><span class="a-time">' + db.fmtDateShort(a.at) + '</span><span class="a-txt"><b>' + ui.esc(a.event) + '</b> — ' + ui.esc(a.detail) + '</span></li>').join('')
      : '<li><span class="a-txt faint">No events recorded.</span></li>';

    const m = ui.modal(
      '<div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;flex-wrap:wrap;">' +
      '<div class="avatar-lg">' + (e.payment.customerName || '?').charAt(0).toUpperCase() + '</div>' +
      '<div style="flex:1;"><h3 class="serif" style="font-size:21px;margin-bottom:2px;">' + ui.esc(e.payment.customerName) + '</h3>' +
      '<div class="small faint">' + ui.esc(db.maskEmail(e.payment.email)) + ' <button class="btn btn-dark btn-sm" style="padding:1px 7px;font-size:9px;" onclick="RFX.srmRevealEmail(\'' + e.id + '\', this)">reveal</button> · ' + ui.esc(countryOf(e)) + '</div></div>' +
      ui.statePill(e.state) + '</div>' +
      '<dl class="kv" style="margin-bottom:16px;">' +
      '<dt>Student ID</dt><dd class="mono gold">' + (e.studentId || '—') + '</dd>' +
      '<dt>Student Code</dt><dd class="mono">' + (e.studentCode ? 'RFX-••••' : '—') + '</dd>' +
      '<dt>Enrollment</dt><dd class="mono">' + e.id + '</dd>' +
      '<dt>Course</dt><dd>' + ui.esc(e.payment.course) + '</dd>' +
      '<dt>Paid</dt><dd>' + db.money(e.payment.price, e.payment.currency) + ' · ' + db.fmtDateShort(e.payment.paidAt) + '</dd>' +
      '<dt>Invoice</dt><dd class="mono">' + e.invoice.number + '</dd>' +
      (e.coupon ? '<dt>Coupon origin</dt><dd><span class="pill gold" style="font-size:9px;">' + ui.esc(e.coupon.code) + '</span>' + (e.coupon.benefit && e.coupon.benefit.type === 'percent' ? ' ' + ui.esc(e.coupon.benefit.value) + '% off' : ' course covered') + ' · redeemed ' + db.fmtDateShort(e.coupon.redeemedAt) + '</dd>' : '') +
      '<dt>Wallet</dt><dd class="mono">' + w.walletNo + '</dd>' +
      '<dt>Balance</dt><dd><b class="gold">' + db.money(w.balance, w.currency) + '</b> · ' + db.money(db.spendable(e.payment.email), w.currency) + ' spendable</dd>' +
      (identity.fullName ? '<dt>Full name</dt><dd>' + ui.esc(identity.fullName) + '</dd>' : '') +
      (reg.emailVerifiedAt ? '<dt>Email</dt><dd><span class="pill ok" style="font-size:9px;">verified</span> ' + db.fmtDateShort(reg.emailVerifiedAt) + '</dd>' : '') +
      (reg.captchaPassedAt ? '<dt>Human</dt><dd><span class="pill ok" style="font-size:9px;">captcha passed</span></dd>' : '') +
      (reg.termsAcceptedAt ? '<dt>Agreements</dt><dd>accepted ' + db.fmtDateShort(reg.termsAcceptedAt) + ' <span class="small faint">(v' + ui.esc(reg.agreementVersion || '?') + ')</span></dd>' : '') +
      (e.handoff && e.handoff.confirmedAt ? '<dt>RFX OS</dt><dd><span class="pill ok" style="font-size:9px;">handshake confirmed</span> ' + db.fmtDateShort(e.handoff.confirmedAt) + '</dd>' : '') +
      merchLine(e) + cooldownLine(e) + printLine(e) +
      '</dl>' +
      identityFlagLine(e) +
      trustLine(e) +
      '<div class="grid2" style="align-items:start;margin-top:10px;gap:14px;">' +
      '<div><div class="eyebrow muted" style="margin-bottom:6px;">Trust Bar history</div>' +
      '<ul class="audit srm-scroll" id="tb-history">' + trustRows(e) + '</ul></div>' +
      '<div><div class="eyebrow muted" style="margin-bottom:6px;">Wallet ledger</div>' +
      '<ul class="audit srm-scroll">' + ledgerRows + '</ul></div>' +
      '</div>' +
      '<div class="eyebrow muted" style="margin:16px 0 6px;">Journey &amp; events</div>' +
      '<ul class="audit srm-scroll">' + auditRows + '</ul>');
    m.setTitle('Student relationship · ' + ui.esc(e.payment.customerName));
  }

  /* Gold identity-signal pills on the SRM profile — selfie quality, duplicate
     selfie, identity reuse. Review triggers; the moderator's call is final. */
  function identityFlagLine(e) {
    const flags = db.identityFlags ? db.identityFlags(e) : [];
    if (!flags.length) return '';
    return '<div style="border:1px solid rgba(212,175,55,0.4);border-radius:10px;padding:10px 14px;margin-bottom:14px;">' +
      '<div class="eyebrow gold" style="margin-bottom:6px;">Identity signals · flagged for review</div>' +
      flags.map(f => '<span class="pill" style="border-color:rgba(212,175,55,0.45);color:#e0c36a;margin:2px 6px 2px 0;font-size:10px;">' + ui.esc(f.label) + '</span>').join('') +
      '</div>';
  }

  /* print-trust controls (exposed for inline onclick) */
  RFX.srmGrantPrint = function (id) {
    const e = db.byId(id);
    if (!e) return;
    const rules = db.printTrustRules ? db.printTrustRules() : [];
    const rulesHtml = rules.map(r => '<li style="margin-bottom:6px;">' + ui.esc(r) + '</li>').join('');
    const m = ui.modal('<div class="eyebrow" style="margin-bottom:12px;">Grant print access</div>' +
      '<p class="small" style="margin-bottom:16px;">Printing course material is a <b style="color:var(--text);">privilege earned through trust</b>, not smarts. Grant it only to students the Academy trusts not to resell or redistribute material. The grant is recorded against the identity and rides the handoff payload so the OS enforces it at the backend.</p>' +
      '<div style="border:1px solid rgba(212,175,55,0.3);border-radius:12px;padding:14px 16px;margin-bottom:16px;background:rgba(212,175,55,0.05);">' +
      '<div class="small" style="color:var(--gold-bright);font-weight:600;margin-bottom:8px;">The print-trust rules</div>' +
      '<ul style="margin:0;padding-left:18px;font-size:12px;color:var(--muted);line-height:1.6;">' + rulesHtml + '</ul></div>' +
      '<div class="field"><label>Reason (recorded in the audit log)</label>' +
      '<input class="input" id="pt-note" placeholder="e.g. Maintained 85% average and a clean integrity record"></div>' +
      '<div style="display:flex;gap:10px;justify-content:flex-end;">' +
      '<button class="btn btn-dark btn-sm" onclick="this.closest(\'.modal-back\').remove()">Cancel</button>' +
      '<button class="btn btn-gold btn-sm" onclick="RFX.srmGrantPrintConfirm(\'' + id + '\')">Grant print access</button></div>');
    m.setTitle('Print access · ' + ui.esc(e.payment.customerName));
  };
  RFX.srmGrantPrintConfirm = function (id) {
    const e = db.byId(id);
    if (!e) return;
    const note = document.getElementById('pt-note') ? document.getElementById('pt-note').value.trim() : '';
    db.grantPrintTrust(e, 'Staff', note || 'Earned trust');
    ui.toastOk('Print access granted to ' + ui.esc(e.payment.customerName) + ' — OS will honour it on next sync.');
    // close every open modal, then refresh the profile so it shows the granted state
    document.querySelectorAll('.modal-back').forEach(m => m.remove());
    render();
    openProfile(id);
  };
  RFX.srmRevokePrint = function (id) {
    const e = db.byId(id);
    if (!e) return;
    db.revokePrintTrust(e, 'Staff', 'Trust withdrawn');
    ui.toastErr('Print access revoked from ' + ui.esc(e.payment.customerName) + ' — OS watermark + print blackout restored.');
    document.querySelectorAll('.modal-back').forEach(m => m.remove());
    render();
    openProfile(id); // refresh the profile so it shows the revoked state
  };

  /* ---- Trust Bar controls (staff) ----
     The Trust Bar is how the Academy reads a student at a glance. Staff apply
     measured penalties for conduct events (or credit genuine good conduct),
     and can simulate an OS trust event so the referral-buddy penalty is
     visible in the demo. Flags stay review triggers — the bar records, the
     moderator decides. */
  RFX.srmTrustAdjust = function (id, delta, reason) {
    const e = db.byId(id);
    if (!e) return;
    const r = db.adjustTrust(e, { delta: delta, reason: reason, by: 'Staff' });
    ui.toastOk((delta > 0 ? '+' : '') + delta + '% applied → Trust Bar at ' + r.score + '% · ' + r.tier);
    document.querySelectorAll('.modal-back').forEach(m => m.remove());
    render();
    openProfile(id);
  };
  RFX.srmTrustPenalty = function (id) {
    const e = db.byId(id);
    if (!e) return;
    const m = ui.modal(
      '<div class="eyebrow" style="margin-bottom:10px;">Apply a Trust Bar penalty</div>' +
      '<p class="small" style="margin-bottom:14px;">The bar never sways on a whim — penalties are measured and recorded against the identity. Serious violations also ripple to the referrer (they vouched for who they brought in).</p>' +
      '<div class="field" style="margin-bottom:12px;"><label>Severity</label>' +
      '<select class="select" id="tb-sev"><option value="-5">Minor · −5</option><option value="-10" selected>Warning · −10</option><option value="-20">Serious · −20</option></select></div>' +
      '<div class="field"><label>Reason <span style="color:#f0a89c;">* required</span> <span class="small faint">— recorded on the bar and in the audit log</span></label>' +
      '<input class="input" id="tb-reason" placeholder="e.g. Shared account access with a non-student — Fair Usage Policy breach" required></div>' +
      '<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px;">' +
      '<button class="btn btn-dark btn-sm" onclick="this.closest(\'.modal-back\').remove()">Cancel</button>' +
      '<button class="btn btn-gold btn-sm" onclick="RFX.srmTrustConfirmPenalty(\'' + id + '\')">Apply penalty</button></div>');
    m.setTitle('Trust Bar · ' + ui.esc(e.payment.customerName));
  };
  RFX.srmTrustConfirmPenalty = function (id) {
    const e = db.byId(id);
    if (!e) return;
    const reason = ((document.getElementById('tb-reason') || {}).value || '').trim();
    // a reason is MANDATORY — every bar move must carry its cause, so the
    // student and the moderator both see WHY the bar moved. No reason, no move.
    if (!reason) {
      ui.toastErr('A reason is required — every Trust Bar penalty must record its cause.');
      const inp = document.getElementById('tb-reason');
      if (inp) { inp.focus(); inp.style.borderColor = 'rgba(231,111,81,0.6)'; setTimeout(() => { inp.style.borderColor = ''; }, 1600); }
      return;
    }
    const sev = Number((document.getElementById('tb-sev') || {}).value || -10);
    RFX.srmTrustAdjust(id, sev, reason);
  };
  RFX.srmTrustCredit = function (id) {
    const e = db.byId(id);
    if (!e) return;
    const m = ui.modal(
      '<div class="eyebrow" style="margin-bottom:10px;">Credit good conduct</div>' +
      '<p class="small" style="margin-bottom:14px;">Recovery is earned, not given. Credit a student for genuine good conduct — maintained discipline, integrity-clean quizzes, helping the Academy.</p>' +
      '<div class="field" style="margin-bottom:12px;"><label>Amount</label>' +
      '<select class="select" id="tb-credit"><option value="3" selected>Small · +3</option><option value="5">Solid · +5</option><option value="10">Milestone · +10</option></select></div>' +
      '<div class="field"><label>Reason <span style="color:#f0a89c;">* required</span></label>' +
      '<input class="input" id="tb-creason" placeholder="e.g. Two months with a clean integrity record" required></div>' +
      '<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px;">' +
      '<button class="btn btn-dark btn-sm" onclick="this.closest(\'.modal-back\').remove()">Cancel</button>' +
      '<button class="btn btn-gold btn-sm" onclick="RFX.srmTrustConfirmCredit(\'' + id + '\')">Credit conduct</button></div>');
    m.setTitle('Trust Bar · ' + ui.esc(e.payment.customerName));
  };
  RFX.srmTrustConfirmCredit = function (id) {
    const e = db.byId(id);
    if (!e) return;
    const reason = ((document.getElementById('tb-creason') || {}).value || '').trim();
    // a reason is MANDATORY — every bar move must carry its cause, so the
    // student and the moderator both see WHY the bar moved. No reason, no move.
    if (!reason) {
      ui.toastErr('A reason is required — every Trust Bar credit must record its cause.');
      const inp = document.getElementById('tb-creason');
      if (inp) { inp.focus(); inp.style.borderColor = 'rgba(231,111,81,0.6)'; setTimeout(() => { inp.style.borderColor = ''; }, 1600); }
      return;
    }
    const amt = Number((document.getElementById('tb-credit') || {}).value || 5);
    RFX.srmTrustAdjust(id, amt, reason);
  };
  /* Demo helper: simulate a serious OS integrity event (like the real bridge
     event in production) so staff can see the referred-student penalty fire. */
  RFX.srmSimulateTrustEvent = function (id) {
    const e = db.byId(id);
    if (!e) return;
    const r = db.referralTrustPenalty(e, 'integrity violation reported by RFX OS');
    if (r) ui.toastOk('Referral ripple applied: ' + r.before + '% → ' + r.score + '% on the referrer\'s bar (' + r.delta + ').');
    else ui.toastWarn('No active referral record — this student was not referred (or the referrer is the same identity).');
    document.querySelectorAll('.modal-back').forEach(m => m.remove());
    render();
    openProfile(id);
  };
  /* Trust Bar history rows for the profile modal. */
  function trustRows(e) {
    const evs = db.trustEvents(e);
    if (!evs.length) return '<li><span class="a-txt faint">No moves recorded — the bar is untouched, which is exactly how it should be.</span></li>';
    return evs.slice(0, 8).map(x =>
      '<li><span class="a-time">' + db.fmtDateShort(x.at) + '</span>' +
      '<span class="a-txt"><b style="color:' + (x.delta < 0 ? '#f0a89c' : '#7ee2a4') + ';">' + (x.delta > 0 ? '+' : '') + x.delta + '</b> ' + ui.esc(x.reason || '') +
      (x.ref ? ' <span class="small faint">(' + ui.esc(x.ref) + ')</span>' : '') + '</span></li>').join('');
  }
  /* Trust section rendered inside the profile modal. */
  function trustLine(e) {
    if (!e.studentId) return '';
    const ts = db.trustStatus(e);
    const n = db.trustEvents(e).length;
    const tierCls = ts.tier === 'caution' ? 'caution' : (ts.tier === 'danger') ? 'low' : (ts.tier === 'restricted' ? 'crit' : '');
    return '<div style="margin:14px 0 4px;">' +
      '<div style="display:flex;align-items:center;gap:22px;flex-wrap:wrap;">' +
      ui.trustRingHTML(ts.score, { tierCls: tierCls, cap: 'trust' }) +
      '<div style="flex:1;min-width:220px;">' +
      '<div class="eyebrow muted" style="margin-bottom:4px;">Trust Ring</div>' +
      '<div style="font-size:13.5px;color:var(--text);font-weight:600;">' + ui.esc(ts.label) + '</div>' +
      '<div class="small faint" style="margin-top:4px;">' + n + ' recorded ' + (n === 1 ? 'move' : 'moves') + ' · every penalty and credit is ledgered against the identity.</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">' +
      '<button class="btn btn-gold btn-sm" onclick="RFX.srmTrustPenalty(\'' + e.id + '\')">Apply penalty</button>' +
      '<button class="btn btn-dark btn-sm" onclick="RFX.srmTrustCredit(\'' + e.id + '\')">Credit conduct</button>' +
      '<button class="btn btn-dark btn-sm" onclick="RFX.srmSimulateTrustEvent(\'' + e.id + '\')">Simulate OS violation</button>' +
      '</div></div></div></div>';
  }

  $('srm-q').addEventListener('input', render);
  $('srm-filter').addEventListener('change', render);
  render();
  renderOsFlags();
  setInterval(() => { kpis(); render(); }, 4000);
  setInterval(renderOsFlags, 45000); // keep the moderator's queue honest

  /* Reveal a masked email — logged, because it is: the act of showing a
     contact address is recorded in the access log with who + when. */
  window.RFX.srmRevealEmail = function (id, btn) {
    const e = db.byId(id);
    if (!e) return;
    db.logAccess(e.payment.customerName + (e.studentId ? ' (' + e.studentId + ')' : ''), 'email revealed', 'SRM profile — masked email shown');
    btn.outerHTML = ui.esc(e.payment.email);
  };
})();
