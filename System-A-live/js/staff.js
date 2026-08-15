/* RFX Staff Portal — invite activation, sign-in, shift clock in/out, roster */
(function () {
  'use strict';

  const db = RFX.db, ui = RFX.ui;

  let me = null; // current staff member

  /* ---------------- url helpers ---------------- */
  function param(name) {
    const p = new URLSearchParams(location.search);
    return p.get(name);
  }

  /* ---------------- views ---------------- */
  function show(view) {
    ['screen-invite', 'screen-login', 'screen-panel'].forEach(v => {
      document.getElementById(v).hidden = v !== view;
    });
  }

  function roleLabel(role) {
    return role === 'admin' ? 'Admin' : role === 'reception' ? 'Reception' : role === 'approver' ? 'Approver' : 'Finance';
  }

  /* ---------------- invite activation ---------------- */
  function initInvite() {
    const token = param('invite');
    if (!token) return false;
    const v = db.validateStaffInvite(token);
    if (!v.ok) {
      // show the invite card WITH the error so the holder knows the link is dead
      document.getElementById('inv-name').textContent = 'Invite not available';
      document.getElementById('inv-code').disabled = true;
      document.getElementById('btn-activate').disabled = true;
      document.getElementById('inv-err').textContent = v.msg;
      document.getElementById('inv-err').hidden = false;
      show('screen-invite');
      return true;
    }
    const s = v.staff;
    document.getElementById('inv-name').textContent = s.name + ' — ' + roleLabel(s.role);
    show('screen-invite');
    return true;
  }

  function doActivate() {
    const token = param('invite');
    const code = document.getElementById('inv-code').value.trim();
    const res = db.activateStaff(token, code);
    if (!res.ok) {
      ui.toastErr(res.msg || 'Could not activate invite.');
      return;
    }
    ui.toastOk('Staff access activated — welcome aboard.');
    me = res.staff;
    showPanel();
    startSessionGuard();
  }

  /* ---------------- sign in ---------------- */
  let panelIv = null;
  function doLogin() {
    const email = document.getElementById('s-email').value.trim();
    const code = document.getElementById('s-code').value;
    const lock = document.getElementById('s-lockout');
    lock.hidden = true;
    const res = db.staffLogin(email, code);
    if (!res.ok) {
      if (res.locked) {
        lock.textContent = res.msg;
        lock.hidden = false;
      } else {
        ui.toastErr(res.msg || 'Sign-in failed.');
      }
      return;
    }
    ui.toastOk('Signed in — good to work.');
    me = res.staff;
    // operator marker — the Staff Console reads this so repairs and support
    // replies carry the real person's name, not a generic console label
    try { sessionStorage.setItem('rfx_staff', JSON.stringify({ id: me.id, name: me.name, role: me.role })); } catch (e) { /* no session — generic attribution */ }
    showPanel();
    startSessionGuard();
  }

  /* ---------------- panel ---------------- */
  function showPanel() {
    show('screen-panel');
    document.getElementById('st-name').textContent = me.name;
    document.getElementById('st-role').textContent = roleLabel(me.role);
    const trialTxt = me.trial ? (me.trial.status === 'passed' ? ' · trial passed' : me.trial.status === 'not-passed' ? ' · trial on file' : me.trial.status === 'expired' ? ' · trial ended' : (function () { const l = db.staffTrialDaysLeft(me); return ' · trial ' + (l > 0 ? l + 'd left' : ' · due review'); })()) : '';
    document.getElementById('st-shift').innerHTML = '<span class="pill gold">' + me.id + ' · ' + roleLabel(me.role) + trialTxt + '</span>';
    // admin-only: hire section + trial reviews
    document.getElementById('admin-invite').hidden = me.role !== 'admin';
    renderTrialReviews();
    renderShift();
    renderRoster();
    renderMyWallet();
    renderOsUptime();
    renderDuties();
    renderMyPerf();
    refreshPill();
    if (panelIv) clearInterval(panelIv);
    panelIv = setInterval(function () { renderRoster(); refreshPill(); renderMyWallet(); renderOsUptime(); renderDuties(); renderMyPerf(); renderTrialReviews(); }, 8000);
  }

  /* ---------------- my RFX wallet ---------------- */
  /* Academy uptime board — staff read the shared outage ledger AND probe the
     OS live themselves, so the status line is never stale: the panel's own
     no-cors probe (3.5s abort, same as the member side) tells the truth right
     now, and the ledger below is the recorded history. */
  function renderOsUptime() {
    const box = document.getElementById('os-uptime');
    if (!box) return;
    const sum = db.osOutageSummary();
    const log = db.osOutageLog().slice().reverse(); // newest first
    // live probe — never trust a stale label: the panel asks the Academy itself
    let live = 'checking';
    try {
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), 3500);
      fetch(db.osIndexUrl(), { method: 'GET', mode: 'no-cors', cache: 'no-store', signal: ctl.signal })
        .then(() => { clearTimeout(t); renderOsUptimeHead(true); })
        .catch(() => { clearTimeout(t); renderOsUptimeHead(false); });
    } catch (e) { live = 'down'; }
    const renderOsUptimeHead = (up) => {
      let head;
      if (up) {
        head = '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;padding:12px 14px;border-radius:10px;background:rgba(74,222,128,0.07);border:1px solid rgba(74,222,128,0.35);">' +
          '<span class="dot ok pulse"></span>' +
          '<div><b style="color:#7ee2a4;">The Academy is online.</b> <span class="small faint">' + (sum.last ? 'Last recorded outage was resolved after ' + db.fmtDuration(sum.last.durationSec) + '.' : 'No recorded outages on this device yet.') + '</span></div></div>';
      } else {
        const open = db.osOutageLog().find(o => o.downAt && !o.upAt);
        const mins = open ? Math.max(1, Math.round((Date.now() - new Date(open.downAt).getTime()) / 60000)) : 1;
        head = '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;padding:12px 14px;border-radius:10px;background:rgba(224,96,79,0.08);border:1px solid rgba(224,96,79,0.4);">' +
          '<span class="dot warn pulse"></span>' +
          '<div><b style="color:#f0a89c;">The Academy is DOWN right now.</b> <span class="small faint">' + (open ? 'Power has been out for ' + mins + ' minute' + (mins === 1 ? '' : 's') + '. ' : '') + 'It self-recovers the moment the next probe succeeds.</span></div></div>';
      }
      box.innerHTML = head + renderOsUptimeLedger();
    };
    const renderOsUptimeLedger = () => {
    const rows = log.length
      ? log.map(function (o) {
          const down = o.downAt ? new Date(o.downAt) : null;
          const up = o.upAt ? new Date(o.upAt) : null;
          const dStr = down ? String(down.getDate()).padStart(2, '0') + '/' + String(down.getMonth() + 1).padStart(2, '0') + ' ' + String(down.getHours()).padStart(2, '0') + ':' + String(down.getMinutes()).padStart(2, '0') : '—';
          const status = o.upAt
            ? '<span style="color:#7ee2a4;">restored</span> · ' + db.fmtDuration(o.durationSec)
            : '<span style="color:#f0a89c;">down now</span>';
          return '<li style="display:flex;gap:10px;align-items:baseline;"><span class="a-time">' + dStr + '</span><span class="a-txt small">' + status + (up ? ' · ' + String(up.getHours()).padStart(2, '0') + ':' + String(up.getMinutes()).padStart(2, '0') : '') + '</span></li>';
        }).join('')
      : '<li class="small faint">No outages recorded yet — the monitor is watching.</li>';
      return '<div class="eyebrow muted" style="margin:4px 0 6px;">Outage ledger</div>' +
      '<ul class="audit" style="max-height:180px;overflow:auto;">' + rows + '</ul>' +
      '<div class="small faint" style="margin-top:10px;border-top:1px solid var(--border);padding-top:10px;">' +
      (sum.count ? '<b>' + sum.count + '</b> outage' + (sum.count === 1 ? '' : 's') + ' on record · ' : '') +
      (sum.totalSec ? 'total downtime <b class="mono gold">' + db.fmtDuration(sum.totalSec) + '</b> · ' : '') +
      'status probed live every refresh · Lee\'s host must be always-on — see FOR-LEE §9.42.</div>';
    };
    // initial paint while the live probe is in flight
    const bootHead = live === 'down' ? null : '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;"><span class="dot pulse"></span><span class="small faint">Checking the Academy…</span></div>';
    box.innerHTML = (bootHead || '') + renderOsUptimeLedger();
  }

  /* TODAY'S DUTIES — the robotic manager's board. Duties come from LIVE system
     state (registration queue, identity flags, support threads, merch queue,
     plus the daily audit/sync/security/outage routines). Manual duties get a
     Complete button that runs the real work first; auto duties close
     themselves when their queue clears; overdue duties are recorded once. */
  const DUTY_ICONS = { audit: 'shieldCheck', sync: 'link', outage: 'zap', security: 'shield', reviews: 'checkCircle', identity: 'search', sessions: 'lock', support: 'headset', merch: 'cart', finance: 'card' };
  function renderDuties() {
    const list = document.getElementById('duties-list');
    const count = document.getElementById('duty-count');
    if (!list || !me) return;
    const duties = db.dutiesFor(me);
    const open = duties.filter(d => !d.doneAt).length;
    const done = duties.filter(d => d.doneAt).length;
    if (count) count.textContent = open ? open + ' open · ' + done + ' done' : 'all done';
    // the manager's note follows the standing — it never nags a gold bar
    const note = document.getElementById('manager-note');
    if (note) {
      const st = db.staffPerfStatus(me);
      if (st.tier === 'excellent') note.textContent = 'All clear, ' + me.name.split(' ')[0] + ' — the bar stays gold by staying thorough.';
      else if (st.tier === 'stable') note.textContent = 'Solid work keeps the bar gold. Overdue duties are the only way it slips.';
      else if (st.tier === 'caution') note.textContent = 'The bar is watching — clear your duties on time and the standing rebuilds fast.';
      else note.textContent = 'The bar is low. Complete every duty on time — the manager records exactly what the work deserves.';
    }
    const I = window.RFX.icons || {};
    const ic = k => I[DUTY_ICONS[k]] || I.clipboard || '';
    const rows = duties.map(function (d) {
      const overdue = !d.doneAt && d.overdue;
      let right;
      if (d.doneAt) right = '<span class="pill ok" style="font-size:9px;">done ' + db.fmtDateShort(d.doneAt) + '</span>';
      else if (d.manual) right = '<button class="btn btn-gold btn-sm" onclick="RFX.staffDutyComplete(\'' + d.id + '\', this)">' + (I.check || '') + ' Complete</button>';
      else { const n = db.dutyQueueCount(d.kind); right = '<span class="pill ' + (n > 0 ? 'warn' : 'ok') + '" style="font-size:9px;">' + (n > 0 ? n + ' in queue' : 'auto-closes') + '</span>'; }
      const statusPill = d.doneAt ? '' : (overdue ? '<span class="pill danger" style="font-size:9px;">overdue</span>' : '');
      return '<div style="display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--border);">' +
        '<span class="ic" style="color:var(--gold-bright);flex:none;">' + ic(d.kind) + '</span>' +
        '<div style="flex:1;min-width:0;"><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;"><b style="font-size:13px;color:var(--text);">' + ui.esc(d.title) + '</b>' + statusPill + '</div>' +
        '<div class="small faint">' + ui.esc(d.desc) + '</div></div>' + right + '</div>';
    }).join('');
    list.innerHTML = rows || '<p class="small faint">No duties for your role today — the manager assigns work as it appears.</p>';
  }
  /* The manager never accepts an empty checkbox: each manual duty runs its
     real work first (audit, sync, security review…), then closes and credits. */
  window.RFX.staffDutyComplete = function (id, btn) {
    if (!me) return;
    const d = (db.dutiesFor(me) || []).find(x => x.id === id);
    if (!d) return ui.toastErr('Duty not found.');
    if (d.doneAt) return ui.toastWarn('Already done.');
    // the click lands, the button answers: spinner first, then the real work —
    // the staff member always sees the machine acknowledge the action.
    if (btn && !btn.disabled) { ui.busyButton(btn, true, d.kind === 'audit' ? 'Auditing…' : 'Running…'); }
    // give the spinner one paint cycle before the real work runs — the click
    // is always acknowledged, even when the machine finishes in a blink.
    setTimeout(function () {
      let msg = '';
      switch (d.kind) {
        case 'audit': { const a = db.fullAudit(); msg = a.passed + '/' + a.total + ' system checks green — the audit is on record.'; break; }
        case 'sync': { db.reconcileSweep(); msg = 'Bridge synced and reconciled — the rail is clean.'; break; }
        case 'security': {
          const evs = db.securityEvents();
          const today = evs.filter(e => (e.at || '').slice(0, 10) === new Date().toISOString().slice(0, 10)).length;
          msg = 'Security feed reviewed — ' + today + ' event' + (today === 1 ? '' : 's') + ' recorded today.'; break;
        }
        case 'outage': { const b = document.getElementById('os-uptime-card'); if (b) b.scrollIntoView({ behavior: 'smooth', block: 'center' }); msg = 'Uptime board reviewed — the Academy status is right below.'; break; }
        case 'sessions': { const active = db.enrollments().filter(e => e.session && e.session.token).length; msg = 'Session audit done — ' + active + ' active session' + (active === 1 ? '' : 's') + ', one per student enforced automatically.'; break; }
        case 'finance': { const q = (db.payouts ? db.payouts().filter(p => p.status === 'queued').length : 0); msg = 'Payout & refund queue reviewed — ' + q + ' item' + (q === 1 ? '' : 's') + ' in the next consolidated batch.'; break; }
        default: msg = 'Marked complete.';
      }
      const r = db.completeDuty(me, id);
      if (r.ok) { ui.toastOk('Duty complete — ' + (msg || d.title) + ' (+1 on your bar).'); renderDuties(); renderMyPerf(); }
      else { if (btn) ui.busyButton(btn, false); ui.toastWarn(r.msg); }
    }, 450);
  };

  /* MY PERFORMANCE — the staff trust bar. Same gold ring as the students,
     same honesty: completed work and quality decisions raise it; overdue
     duties lower it. The ledger never lies to the person who earns it. */
  function renderMyPerf() {
    const box = document.getElementById('perf-content');
    if (!box || !me) return;
    const st = db.staffPerfStatus(me);
    const events = st.events.slice(0, 6);
    const rows = events.length
      ? '<ul class="audit">' + events.map(function (e) {
          const sign = e.delta > 0 ? '<b style="color:#7ee2a4;">+' + e.delta + '</b>' : e.delta < 0 ? '<b style="color:#f0a89c;">' + e.delta + '</b>' : '<b style="color:var(--gold);">·</b>';
          return '<li><span class="a-time">' + db.fmtDateShort(e.at) + '</span><span class="a-txt">' + sign + ' — ' + ui.esc(e.note || '') + '</span></li>';
        }).join('') + '</ul>'
      : '<p class="small faint">No activity yet — your first completed duty is recorded here. Keep the bar gold.</p>';
    const tierColor = st.tier === 'excellent' ? '#7ee2a4' : (st.tier === 'danger' || st.tier === 'standdown') ? '#f0a89c' : st.tier === 'caution' ? 'var(--warn)' : 'var(--text)';
    box.innerHTML =
      '<div style="display:flex;align-items:center;gap:16px;margin-bottom:10px;">' +
      ui.trustRingHTML(st.score, { cap: 'staff' }) +
      '<div><div class="stat-num" style="font-size:26px;">' + st.score + '%</div>' +
      '<div class="small" style="color:' + tierColor + ';font-weight:600;">' + st.label + '</div>' +
      '<div class="small faint">the robotic manager watches the work</div></div></div>' + rows;
  }

  function renderMyWallet() {
    const box = document.getElementById('my-wallet');
    if (!box || !me) return;
    const w = db.staffWalletFor(me.id);
    const rows = (w.ledger || []).slice().reverse().slice(0, 6);
    box.innerHTML =
      '<div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:12px;">' +
      '<span class="stat-num" style="font-size:26px;">' + db.money(w.balance, w.currency) + '</span>' +
      '<span class="mono small" style="color:var(--gold-bright);">' + w.walletNo + '</span>' +
      '<span class="small faint">your RFX money</span></div>' +
      (rows.length
        ? '<div class="eyebrow muted" style="margin:4px 0 6px;">Recent</div><ul class="audit">' + rows.map(e =>
          '<li><span class="a-time">' + db.fmtDate(e.at) + '</span><span class="a-txt"><b style="color:#7ee2a4;">+' + db.money(e.amount, w.currency) + '</b> — ' + ui.esc(e.note || '') + ' <span class="small faint">(' + ui.esc(e.reference || '') + ')</span></span></li>'
        ).join('') + '</ul>'
        : '<p class="small faint">No funds yet. Finance adds money to this wallet when it is earned or approved.</p>');
  }

  function renderShift() {
    const shift = db.currentShift(me.id);
    const st = document.getElementById('shift-status');
    const outBtn = document.getElementById('btn-clock-out');
    if (shift) {
      st.innerHTML = '<span class="dot ok pulse"></span> On duty now · <b>' + (shift.type === 'night' ? 'night shift' : 'day shift') + '</b> since ' + new Date(shift.in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      outBtn.hidden = false;
    } else {
      const last = me.shifts.length ? me.shifts[me.shifts.length - 1] : null;
      st.textContent = last ? ('Last shift ended ' + ui.fmtRelative(last.out) + '. Clock in to start a new shift.') : 'Not on a shift yet. Clock in to start.';
      outBtn.hidden = true;
    }
    renderMyShifts();
  }

  function renderMyShifts() {
    const list = document.getElementById('my-shifts');
    const shifts = (me.shifts || []).slice().reverse().slice(0, 8);
    if (!shifts.length) {
      list.innerHTML = '<li><span class="a-time">—</span><span class="a-txt faint">No shifts recorded yet.</span></li>';
      return;
    }
    const ic = RFX.icons && RFX.icons.clock ? RFX.icons.clock : '';
    list.innerHTML = shifts.map(sh => {
      const hrs = sh.out ? ((new Date(sh.out) - new Date(sh.in)) / 3600000).toFixed(1) : '…';
      return '<li><span class="a-time">' + new Date(sh.in).toLocaleDateString([], { day: '2-digit', month: 'short' }) + ' · ' + (sh.type === 'night' ? 'night' : 'day') + '</span>' +
        '<span class="a-txt"><b>' + (sh.type === 'night' ? 'Night' : 'Day') + '</b> · ' + new Date(sh.in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
        (sh.out ? ' → ' + new Date(sh.out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + hrs + 'h' : ' · in progress') + '</span>' +
        '<span style="margin-left:auto;">' + ic + '</span></li>';
    }).join('');
  }

  function doClock(type) {
    const res = db.clockIn(me.id, type);
    if (!res.ok) { ui.toastErr(res.msg); return; }
    ui.toastOk('Clocked in — ' + (type === 'night' ? 'night' : 'day') + ' shift started.');
    me = db.staffById(me.id);
    renderShift(); renderRoster(); refreshPill();
  }

  function doClockOut() {
    const res = db.clockOut(me.id);
    if (!res.ok) { ui.toastErr(res.msg); return; }
    ui.toastOk('Clocked out — shift ended. Thank you.');
    me = db.staffById(me.id);
    renderShift(); renderRoster(); refreshPill();
  }

  /* ---------------- roster ---------------- */
  function rosterRow(s) {
    const shift = db.currentShift(s.id);
    const since = shift ? 'since ' + new Date(shift.in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    return '<li><span class="a-time">' + (s.id) + '</span>' +
      '<span class="a-txt"><b>' + ui.esc(s.name) + '</b> · ' + (s.role === 'admin' ? 'Admin' : s.role === 'reception' ? 'Reception' : s.role === 'approver' ? 'Approver' : 'Finance') +
      (shift ? ' <span class="dot ok pulse" style="vertical-align:middle;"></span>' : '') + '</span>' +
      '<span style="margin-left:auto;white-space:nowrap;display:flex;gap:8px;align-items:center;">' + trialPill(s) + (shift ? '<span class="pill ok">On duty ' + since + '</span>' : '<span class="pill soon">Off</span>') + '</span></li>';
  }

  function renderRoster() {
    const onDuty = document.getElementById('roster');
    const all = document.getElementById('team-list');
    const duty = db.onDutyStaff();
    onDuty.innerHTML = duty.length ? duty.map(rosterRow).join('') : '<li><span class="a-txt faint">No one on duty right now — coverage gap.</span></li>';
    all.innerHTML = db.staff().map(rosterRow).join('');
  }

  /* ---------------- reception pill ---------------- */
  function refreshPill() {
    const pill = document.getElementById('on-duty-pill');
    if (!pill) return;
    const n = db.onDutyCount();
    pill.innerHTML = n > 0
      ? '<span class="dot ok pulse"></span> Reception · 24/7 · ' + n + ' on duty'
      : '<span class="dot warn"></span> Reception · 24/7 · checking coverage…';
  }

  /* ---------------- hire (admin) ---------------- */
  function doHire() {
    const name = document.getElementById('h-name').value.trim();
    const email = document.getElementById('h-email').value.trim();
    const role = document.getElementById('h-role').value;
    const trialDays = parseInt(document.getElementById('h-trial').value, 10) || 0;
    const out = document.getElementById('hire-result');
    const res = db.createStaff({ name, email, role, trialDays, by: me ? me.name : 'Reality FX Admin' });
    if (!res.ok) { out.innerHTML = '<span class="small" style="color:#f0a89c;">' + ui.esc(res.msg) + '</span>'; return; }
    document.getElementById('h-name').value = '';
    document.getElementById('h-email').value = '';
    out.innerHTML = '<span class="small" style="color:#7ee2a4;">' + (RFX.icons && RFX.icons.checkCircle ? '<span style="vertical-align:middle;">' + RFX.icons.checkCircle + '</span> ' : '') + ui.esc(res.staff.name) + (trialDays ? ' — demo trial started, the invite email is in the <a href="mailbox.html" style="color:var(--gold-bright);">Mailbox</a>. The robotic manager is already watching.' : ' invited — the invite email is in the <a href="mailbox.html" style="color:var(--gold-bright);">Mailbox</a>. One-time link, 7-day expiry.') + '</span>';
    renderRoster();
    renderTrialReviews();
  }

  /* ---------------- demo trials (admin reviews) ---------------- */
  function trialPill(s) {
    if (!s.trial) return '';
    if (s.trial.status === 'passed') return '<span class="pill ok" style="font-size:9px;">trial · passed</span>';
    if (s.trial.status === 'not-passed') return '<span class="pill warn" style="font-size:9px;">trial · on file</span>';
    if (s.trial.status === 'expired') return '<span class="pill danger" style="font-size:9px;">trial · ended</span>';
    const left = db.staffTrialDaysLeft(s);
    return left > 0
      ? '<span class="pill gold" style="font-size:9px;">trial · ' + left + 'd left</span>'
      : '<span class="pill danger" style="font-size:9px;">trial · due review</span>';
  }

  function renderTrialReviews() {
    const card = document.getElementById('trial-review-card');
    const list = document.getElementById('trial-review-list');
    if (!card || !list || !me || me.role !== 'admin') return;
    const trials = db.staffTrials();
    if (!trials.length) { card.hidden = true; return; }
    card.hidden = false;
    const I = RFX.icons || {};
    // the expiry sweep: a trial that lapsed without a signature is loud —
    // the admin sees an overdue banner the moment the board opens, so a
    // frozen report can never sit unseen
    const overdue = trials.filter(function (s) { return s.trial.status === 'expired'; });
    const dueNow = trials.filter(function (s) { return s.trial.status === 'active' && db.staffTrialDaysLeft(s) === 0; });
    const dueSoon = trials.filter(function (s) { return s.trial.status === 'active' && db.staffTrialDaysLeft(s) === 1; });
    const awaiting = overdue.length + dueNow.length;
    const banner = awaiting
      ? '<div style="border:1px solid rgba(224,82,82,0.45);background:rgba(224,82,82,0.08);color:#f0a69e;padding:10px 12px;border-radius:10px;margin-bottom:12px;font-size:12.5px;display:flex;align-items:center;gap:9px;">' +
        '<span style="font-size:15px;flex:none;">' + (I.alert || '!') + '</span>' +
        '<span><b>' + awaiting + ' trial' + (awaiting === 1 ? ' has' : 's have') + ' ended and ' + (awaiting === 1 ? 'is' : 'are') + ' awaiting your signature</b> — the manager&#39;s report' + (awaiting === 1 ? ' is' : 's are') + ' frozen. The member' + (awaiting === 1 ? ' is' : 's are') + ' locked out until you sign. Review &amp; sign below.</span></div>'
      : dueSoon.length
        ? '<div style="border:1px solid rgba(212,175,55,0.45);background:rgba(212,175,55,0.07);color:#e8d9a8;padding:10px 12px;border-radius:10px;margin-bottom:12px;font-size:12.5px;display:flex;align-items:center;gap:9px;">' +
          '<span style="font-size:15px;flex:none;">' + (I.alert || '!') + '</span>' +
          '<span><b>' + dueSoon.length + ' trial' + (dueSoon.length === 1 ? ' closes' : 's close') + ' tomorrow</b> — the manager&#39;s report will freeze the moment the window ends. Open the report now and sign before the deadline, so the member is never locked out waiting on you.</span></div>'
        : '';
    list.innerHTML = banner + trials.map(function (s) {
      const left = db.staffTrialDaysLeft(s);
      const active = s.trial.status === 'active';
      const expired = s.trial.status === 'expired';
      const decidable = active || expired;
      const statusTxt = s.trial.status === 'passed' ? 'Passed — contract sent'
        : s.trial.status === 'not-passed' ? 'Not passed — reconsideration sent'
        : expired ? 'Trial ended — the manager\'s report is frozen · awaiting your signature'
        : (left > 0 ? left + ' day' + (left === 1 ? '' : 's') + ' left' : 'Trial window over — review now');
      const btn = decidable
        ? '<button class="btn btn-gold btn-sm" onclick="RFX.openTrialReview(\'' + s.id + '\')">' + (I.clipboard || '') + (expired ? ' Review & sign' : ' Review report') + '</button>'
        : '<span class="small faint" style="margin-left:auto;">' + statusTxt + '</span>';
      return '<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);">' +
        '<span class="ic" style="color:var(--gold-bright);flex:none;">' + (I.user || '') + '</span>' +
        '<div style="flex:1;min-width:0;"><b style="font-size:13px;">' + ui.esc(s.name) + '</b> <span class="small faint">· ' + roleLabel(s.role) + ' · ' + s.trial.days + 'd trial</span>' +
        '<div class="small" style="margin-top:2px;">' + statusTxt + '</div></div>' + btn + '</div>';
    }).join('');
  }

  window.RFX.openTrialReview = function (id) {
    const s = db.staffById(id);
    if (!s || !s.trial) return ui.toastErr('Trial not found.');
    const rep = db.staffTrialReport(id);
    if (!rep) return ui.toastErr('No report yet.');
    const I = RFX.icons || {};
    const recTxt = rep.recommendation === 'pass' ? '<span class="pill ok">manager recommends: pass</span>' : rep.recommendation === 'fail' ? '<span class="pill danger">manager recommends: don\'t pass</span>' : rep.recommendation === 'no-show' ? '<span class="pill warn">no shifts recorded — review before deciding</span>' : '<span class="pill gold">manager: review</span>';
    const m = ui.modal(
      '<div style="margin-bottom:14px;"><div class="eyebrow" style="margin-bottom:2px;">Robotic manager\'s report — ' + ui.esc(s.name) + '</div>' +
      '<div class="small faint">Every number below is pulled live from the records. The manager counts; you sign.</div></div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;">' + recTxt +
      (s.trial.status === 'expired' ? ' <span class="pill danger">deadline passed — seat closed</span>' : (s.trial.status === 'active' && db.staffTrialDaysLeft(s) <= 0 ? ' <span class="pill danger">window closed</span>' : '')) + '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">' +
      statBox('Shifts worked', rep.shifts) + statBox('Hours on the job', rep.hours + 'h') +
      statBox('Duties done', rep.dutiesDone + ' / ' + rep.duties) + statBox('Duties overdue', rep.dutiesOverdue) +
      statBox('Trust bar', rep.perfNow + '%') + statBox('Bar movement', (rep.perfDelta >= 0 ? '+' : '') + rep.perfDelta) +
      statBox('Security events', rep.securityEvents) + statBox('Wallet funded', db.money(rep.walletFunded, 'R')) +
      '</div>' +
      (s.trial.status === 'active' || s.trial.status === 'expired'
        ? '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
          '<button class="btn btn-gold" id="trial-pass">' + (I.checkCircle || '') + ' Pass — send the contract</button>' +
          '<button class="btn btn-danger" id="trial-fail">' + (I.x || '') + ' Don\'t pass — send reconsideration</button>' +
          '</div>'
        : '<p class="small faint" style="color:#7ee2a4;">Decided ' + db.fmtDateShort(s.trial.decidedAt) + ' by ' + ui.esc(s.trial.decidedBy || 'admin') + ' — ' + (s.trial.status === 'passed' ? 'the contract was sent.' : 'the reconsideration note was sent.') + '</p>' +
          (s.trial.status === 'passed' && RFX.pdf && RFX.pdf.downloadContract
            ? '<div style="margin-top:14px;"><button class="btn btn-gold" onclick="RFX.pdf.downloadContract(db.staffById(\'' + s.id + '\'))">' + (I.download || '') + ' Download contract (PDF)</button></div>'
            : '')),
      { onClose: function () { renderTrialReviews(); } }
    );
    m.setTitle('Demo trial review');
    const pass = document.getElementById('trial-pass');
    const fail = document.getElementById('trial-fail');
    if (pass) pass.addEventListener('click', function () { const r = db.decideStaffTrial(id, true, me ? me.name : 'admin'); if (r.ok) { ui.toastOk('Trial passed — the staff contract email has been sent.'); m.close(); } else ui.toastErr(r.msg); });
    if (fail) fail.addEventListener('click', function () { const r = db.decideStaffTrial(id, false, me ? me.name : 'admin'); if (r.ok) { ui.toastOk('Recorded — the reconsideration note has been sent.'); m.close(); } else ui.toastErr(r.msg); });
  };

  function statBox(label, val) {
    return '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:10px 12px;">' +
      '<div class="small faint">' + label + '</div><div class="stat-num" style="font-size:20px;margin-top:2px;">' + val + '</div></div>';
  }

  /* ---------------- multi-tab safety ---------------- */
  // If another tab adopts a newer store revision, refresh our staff reference so
  // clock-in/out and roster actions always land on the live record.
  window.addEventListener('rfx:sync', function () {
    if (!me) return;
    const live = db.staffById(me.id);
    if (live && live !== me) {
      me = live;
      if (document.getElementById('screen-panel') && !document.getElementById('screen-panel').hidden) {
        renderShift(); renderRoster(); renderMyWallet(); refreshPill();
      }
    }
  });

  /* ---------------- session guard ---------------- */
  // An unattended staff console must not stay open: after STAFF_IDLE_MIN of
  // no mouse or keyboard activity the session signs itself out (with a
  // 60-second warning first). A compromised desk is a locked desk.
  const STAFF_IDLE_MIN = 30;
  let idleWarned = false;
  function touchSession() {
    try { sessionStorage.setItem('rfx_staff_ts', String(Date.now())); } catch (e) { /* no session */ }
  }
  function startSessionGuard() {
    touchSession();
    idleWarned = false;
    ['click', 'keydown', 'mousemove', 'touchstart'].forEach(ev =>
      document.addEventListener(ev, touchSession, { passive: true }));
    if (sessionIv) clearInterval(sessionIv);
    sessionIv = setInterval(function () {
      const ts = Number(sessionStorage.getItem('rfx_staff_ts') || 0);
      const idleMin = (Date.now() - ts) / 60000;
      if (idleMin >= STAFF_IDLE_MIN) {
        clearInterval(sessionIv);
        sessionIv = null;
        ui.toastErr('Signed out after ' + STAFF_IDLE_MIN + ' min of inactivity — the console never stays open unattended.');
        doLogout();
      } else if (idleMin >= STAFF_IDLE_MIN - 1 && !idleWarned) {
        idleWarned = true;
        ui.toastErr('Session expiring in ~1 min of inactivity — move the mouse to stay signed in.');
      }
    }, 30000);
  }
  let sessionIv = null;

  /* ---------------- sign out ---------------- */
  function doLogout() {
    if (panelIv) { clearInterval(panelIv); panelIv = null; }
    if (sessionIv) { clearInterval(sessionIv); sessionIv = null; }
    try { sessionStorage.removeItem('rfx_staff'); } catch (e) { /* no session */ }
    me = null;
    show('screen-login');
    ui.toastOk('Signed out.');
  }

  /* ---------------- boot ---------------- */
  document.addEventListener('DOMContentLoaded', function () {
    if (initInvite()) {
      document.getElementById('btn-activate').addEventListener('click', doActivate);
    } else {
      show('screen-login');
      document.getElementById('btn-staff-login').addEventListener('click', doLogin);
      document.getElementById('s-code').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
    }
    document.getElementById('btn-logout').addEventListener('click', doLogout);
    document.getElementById('btn-clock-day').addEventListener('click', () => doClock('day'));
    document.getElementById('btn-clock-night').addEventListener('click', () => doClock('night'));
    document.getElementById('btn-clock-out').addEventListener('click', doClockOut);
    document.getElementById('btn-hire').addEventListener('click', doHire);
    refreshPill();
  });
})();
