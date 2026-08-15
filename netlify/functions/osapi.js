/* ============================================================
   RFX OS — Netlify Function: the production OS API rail
   ------------------------------------------------------------
   System A's bridge POSTs approved identities to /os/api/handoff;
   the OS greets them from /os/api/handoffs; the Live Rooms, Fair
   Play flags and single-session guard ride the same rail.

   ZERO dependencies on purpose: this file talks to the Netlify
   Blobs REST API directly (Bearer token + siteID come from the
   runtime's NETLIFY_BLOBS_CONTEXT), so Netlify Drop always
   bundles it — no node_modules, no build step.

   Served via `_redirects`:
     /os/api/*  /.netlify/functions/osapi/:splat  200
     /api/*     /.netlify/functions/osapi/:splat  200
   ============================================================ */

"use strict";

/* ---------- deploy-baked secrets fallback (free-plan env) ----------
   Netlify's env-var create API requires a paid account, so deploy-live.sh
   bakes rfx-env.js (generated from .freebuff/tools/secrets.env — never
   committed) into the function bundle. process.env always wins, so vars
   set in the Netlify UI later override the baked fallback. */
let RFX_ENV = {};
try { RFX_ENV = require("./rfx-env") || {}; } catch (e) { RFX_ENV = {}; }
function rfxEnv(k) { return process.env[k] || RFX_ENV[k] || ""; }

/* ---------- Blobs REST client (dependency-free) ---------- */

function blobEnv() {
  // RFX_BLOBS_CONTEXT is our own fallback: Netlify only auto-injects
  // NETLIFY_BLOBS_CONTEXT on git/CI builds, and the platform shadows the
  // reserved name on manual deploys — so we set our own site env var with
  // the same base64 JSON payload and read it here.
  const raw = process.env.NETLIFY_BLOBS_CONTEXT || process.env.RFX_BLOBS_CONTEXT || "";
  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch (e) {
    return {};
  }
}
const ctx = blobEnv();
const API = ctx.apiURL || "https://api.netlify.com";
const AUTH = { authorization: "Bearer " + (ctx.token || "") };

async function blobGet(store, key) {
  if (!ctx.siteID || !ctx.token) throw new Error("blobs env missing");
  const res = await fetch(API + "/api/v1/blobs/" + ctx.siteID + "/" + store + "/" + key, { headers: AUTH });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("blobs GET " + res.status);
  const text = await res.text();
  return { etag: res.headers.get("etag") || "", value: text ? JSON.parse(text) : null };
}

/* Conditional write: `ifMatch` (etag) makes the write atomic — a
   concurrent writer's change fails with 412 instead of being silently
   clobbered, so two browsers can never lose each other's records. */
async function blobPut(store, key, value, ifMatch) {
  if (!ctx.siteID || !ctx.token) throw new Error("blobs env missing");
  const headers = Object.assign({ "Content-Type": "application/json" }, AUTH);
  if (ifMatch) headers["if-match"] = ifMatch;
  const res = await fetch(API + "/api/v1/blobs/" + ctx.siteID + "/" + store + "/" + key, {
    method: "PUT", headers, body: JSON.stringify(value),
  });
  if (res.status === 412) return false;
  if (!res.ok) throw new Error("blobs PUT " + res.status);
  return true;
}

/* ---------- helpers ---------- */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-RFX-Handoff-Key",
  "Cache-Control": "no-store",
};

function json(code, obj) {
  return { statusCode: code, headers: Object.assign({ "Content-Type": "application/json" }, CORS), body: JSON.stringify(obj) };
}
function ok(obj) { return json(200, obj); }
function bad(reason) { return json(400, { ok: false, reason }); }

function parseBody(event) {
  try { return event.body ? JSON.parse(event.body) : {}; } catch (e) { return null; }
}

function routePath(event) {
  let p = String(event.path || "").split("?")[0];
  p = p.replace(/^\/os\/api\//, "").replace(/^\/api\//, "").replace(/^\/\.netlify\/functions\/osapi\//, "").replace(/^\/+/, "");
  return p;
}

function nowIso() { return new Date().toISOString(); }
function nowSec() { return Math.floor(Date.now() / 1000); }

/* Safe read-modify-write with etag retry (see blobPut above). */
async function mutate(store, key, fn) {
  for (let i = 0; i < 6; i++) {
    const cur = await blobGet(store, key);
    const list = cur ? cur.value : [];
    const next = fn(list);
    const written = await blobPut(store, key, next, cur ? cur.etag : "");
    if (written) return next;
  }
  const fallback = await blobGet(store, key);
  return fn(fallback ? fallback.value : []);
}

function genRoomCode() {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) code += c[Math.floor(Math.random() * c.length)];
  return code;
}

/* ---------- endpoint handlers ---------- */

async function postHandoff(pl) {
  if (!pl || typeof pl !== "object" || !pl.studentId) return bad("missing studentId");
  let existing = false;
  await mutate("handoffs", "handoffs", (list) => {
    existing = list.some((h) => h.studentId === pl.studentId);
    if (existing) return list;
    list.push({
      studentId: pl.studentId,
      studentCode: pl.studentCode || "",
      verifiedName: pl.verifiedName || pl.name || "",
      email: pl.email || "",
      course: pl.course || "",
      entitlements: pl.entitlements || {},
      printTrust: pl.printTrust || "standard",
      status: pl.status || "ready",
      founder: !!pl.founder,
      role: pl.role || "",
      demoTourEndsAt: pl.demoTourEndsAt || "",
      trust: pl.trust && typeof pl.trust === "object" ? pl.trust : {},
      receivedAt: nowIso(),
    });
    return list;
  });
  return ok({ received: true, already: existing, confirmedAt: nowIso() });
}

/* ---------- live email rail (Resend) ----------
   System A's db.js relays every email it writes here when it is in live
   mode — the Mailbox stays the record, this is the delivery. No key set →
   503 with a clear reason, so the demo never breaks and the moment
   RESEND_API_KEY + RFX_MAIL_FROM exist in Netlify env vars, delivery
   is live with zero code changes. */
async function postMail(pl) {
  if (!pl || !pl.to || !pl.subject || !pl.html) return bad("to, subject and html required");
  const key = rfxEnv("RESEND_API_KEY");
  const from = rfxEnv("RFX_MAIL_FROM");
  if (!key || !from) {
    return json(503, { ok: false, reason: "mail not configured — set RESEND_API_KEY and RFX_MAIL_FROM in Netlify env vars" });
  }
  let res;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({ from: from, to: pl.to, subject: pl.subject, html: pl.html, reply_to: rfxEnv("RFX_MAIL_REPLY_TO") || from }),
    });
  } catch (e) {
    return json(502, { ok: false, reason: "resend unreachable" });
  }
  const body = await res.text().catch(function () { return ""; });
  if (!res.ok) return json(502, { ok: false, reason: "resend " + res.status + " " + body.slice(0, 200) });
  let id = "";
  try { id = JSON.parse(body).id || ""; } catch (e) { /* no body */ }
  return ok({ ok: true, id: id });
}

/* The branded device-check email — same gold crown wordmark + house rule as
   every System A email, so a student can never doubt it is us. */
function deviceCheckHTML(code) {
  return "<div style=\"border-bottom:2px solid #d4af37;padding-bottom:16px;margin-bottom:22px;\">" +
    "<div style=\"font-family:Georgia,serif;color:#080808;font-size:24px;font-weight:700;\">&#9819; Reality FX <span style=\"color:#a8842a;\">Academy</span></div>" +
    "<div style=\"font-size:9px;letter-spacing:3px;color:#8a8a8a;font-family:Arial,sans-serif;margin-top:2px;\">THE TRADING ACADEMY · IDENTITY · SECURITY</div>" +
    "<div style=\"font-family:Georgia,serif;font-style:italic;font-size:12px;color:#a8842a;margin-top:8px;\">&quot;Every lesson is a trade. Every trade is a lesson.&quot;</div></div>" +
    "<p style=\"font-family:Arial,sans-serif;font-size:14px;color:#333;\">We don't recognise this device or location on your Reality FX account.</p>" +
    "<p style=\"font-family:Arial,sans-serif;font-size:14px;color:#333;\">If this was you, your confirmation code is: <b style=\"font-size:20px;color:#a8842a;letter-spacing:2px;\">" + code + "</b></p>" +
    "<p style=\"font-family:Arial,sans-serif;font-size:13px;color:#777;\">If this was NOT you, someone else may have your access — sign in, mark it as not you, and we'll flag it for review. The code expires in 10 minutes.</p>" +
    "<div style=\"margin-top:26px;padding-top:14px;border-top:1px dashed #c9b37a;font-size:11px;color:#8a8a8a;font-family:Arial,sans-serif;\">" +
    "<div style=\"font-family:Georgia,serif;font-size:13px;color:#a8842a;font-weight:700;\">Reality FX — The Trading Academy</div>" +
    "This is official Reality FX correspondence. Not expecting it? Contact the reception desk at realityfx20@gmail.com.<br/>" +
    "realityfx.netlify.app · &quot;Every lesson is a trade. Every trade is a lesson.&quot;</div>";
}

async function postFlagsReport(pl) {
  if (!pl || !pl.studentId || !Array.isArray(pl.flags)) return json(400, { accepted: false, reason: "studentId and flags[] required" });
  let added = 0;
  await mutate("flags", "flags", (list) => {
    for (const f of pl.flags) {
      if (!f || typeof f !== "object" || !f.type) continue;
      const dup = list.some((x) =>
        x.studentId === pl.studentId && x.type === f.type &&
        (x.ch || "") === (f.ch || "") && (x.qi || "") === (f.qi || ""));
      if (dup) continue;
      list.push({
        id: "OSF-" + String(list.length + 1).padStart(4, "0"),
        studentId: pl.studentId,
        type: f.type, ch: f.ch || "", qi: f.qi || "", ms: f.ms || 0,
        ts: f.ts || nowSec(), note: f.note || "", status: "pending", actions: [],
        reportedAt: nowIso(),
      });
      added++;
    }
    return list;
  });
  const total = await blobGet("flags", "flags");
  return ok({ accepted: true, added, total: total ? total.value.length : 0 });
}

async function postFlagsResolve(pl) {
  if (!pl || !pl.id) return bad("flag id required");
  let found = false;
  await mutate("flags", "flags", (list) => {
    for (const x of list) {
      if (x.id !== pl.id) continue;
      found = true;
      x.status = pl.status || "dismissed";
      x.resolvedBy = pl.resolvedBy || "Staff";
      x.resolvedAt = nowIso();
      x.resolution = pl.resolution || "";
      x.actions = x.actions || [];
      x.actions.push({ status: x.status, by: x.resolvedBy, at: x.resolvedAt, resolution: x.resolution });
    }
    return list;
  });
  return ok({ ok: found });
}

/* ---------- The gate (FOR-LEE §9.61–9.63 + RFX-OS-GATE-FUNCTION-FOR-LEE.md) ----------
   System A holds ALL the power of who gets in; the OS never decides, it only
   follows. Every session-issuing path asks the gate FIRST. The answer is a
   live read of System A's own throttle record and it is authoritative:
   locked → no session, GATE_DENIED logged. NEVER fails open — an unreachable
   gate also refuses (the recovery path is System A's Forgot password?).
   SYSTEM_A_GATE_URL is set at deploy; until it is, refuse — a session minted
   without the gate is a bug, not a convenience. */
const GATE_TIMEOUT_MS = 4000;
function systemAGateURL() {
  return rfxEnv("SYSTEM_A_GATE_URL") || rfxEnv("SYSTEM_A_GATE") || "";
}
async function askTheGate(email) {
  const url = systemAGateURL();
  if (!url) return { allowed: false, reason: "gate_unconfigured" };
  const ctl = new AbortController();
  const timer = setTimeout(function () { ctl.abort(); }, GATE_TIMEOUT_MS);
  try {
    const res = await fetch(url + (url.indexOf("?") >= 0 ? "&" : "?") + "email=" + encodeURIComponent(email), {
      headers: { Accept: "application/json" },
      signal: ctl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error("gate http " + res.status);
    const g = await res.json();
    if (g && g.locked === true) {
      return { allowed: false, reason: "locked", minutesLeft: g.minutesLeft || null, lockedUntil: g.lockedUntil || null };
    }
    return { allowed: true };
  } catch (err) {
    clearTimeout(timer);
    // Fail closed — an unreachable gate is an incident, not a shrug.
    return { allowed: false, reason: "gate_unreachable" };
  }
}
async function logGate(event, email, extra) {
  try {
    await mutate("security", "gateEvents", function (list) {
      list = list || [];
      list.push(Object.assign({ event: event, email: email, at: new Date().toISOString() }, extra || {}));
      return list;
    });
  } catch (e) { /* logging never blocks a session answer */ }
}

async function postSessionClaim(pl) {
  if (!pl || !pl.studentId || !pl.token || !pl.deviceId) return bad("studentId, token and deviceId required");
  // THE GATE — System A decides first. Nothing below runs if it says no.
  const gEmail = String(pl.email || "").trim().toLowerCase();
  if (gEmail) {
    const gate = await askTheGate(gEmail);
    if (!gate.allowed) {
      await logGate("GATE_DENIED", gEmail, { studentId: pl.studentId, reason: gate.reason, minutesLeft: gate.minutesLeft || null });
      return ok({
        ok: false, active: false, reason: gate.reason, minutesLeft: gate.minutesLeft || null,
        message: gate.reason === "locked"
          ? "Sign-in is temporarily locked. You can try again in a few minutes, or use Forgot password? on the member portal to recover now."
          : "The gate could not be reached. Please try again in a moment.",
      });
    }
    await logGate("GATE_ALLOWED", gEmail, { studentId: pl.studentId });
  }
  let kicked = false;
  await mutate("sessions", "sessions", (list) => {
    const kept = list.filter((s) => !(s.studentId === pl.studentId && s.deviceId !== pl.deviceId));
    kicked = kept.length !== list.length;
    const found = kept.some((s) =>
      s.studentId === pl.studentId && s.deviceId === pl.deviceId && s.token === pl.token);
    if (!found) kept.push({
      studentId: pl.studentId, deviceId: pl.deviceId,
      deviceType: pl.deviceType || "desktop", token: pl.token, lastSeen: nowSec(),
    });
    return kept;
  });
  return ok({ ok: true, active: true, kicked });
}

async function postSessionHeartbeat(pl, isHeartbeat) {
  if (!pl || !pl.studentId || !pl.token) return bad("studentId and token required");
  let active = false;
  await mutate("sessions", "sessions", (list) => {
    for (const s of list) {
      if (s.studentId === pl.studentId && s.token === pl.token) {
        active = true;
        if (isHeartbeat) s.lastSeen = nowSec();
      }
    }
    return list;
  });
  return ok({ ok: true, active });
}

async function postSessionRelease(pl) {
  if (!pl || !pl.studentId || !pl.token) return bad("studentId and token required");
  await mutate("sessions", "sessions", (list) =>
    list.filter((s) => !(s.studentId === pl.studentId && s.token === pl.token)));
  return ok({ ok: true });
}

/* ---------- device trust store ("Is this really you?") ----------
   The Google-style gate: every verified student has a list of known
   devices. A sign-in from an unrecognised device/location triggers a
   challenge — a 6-digit code emailed to the student's address — and the
   device only becomes known after the code is confirmed. Repeated wrong
   codes leave the device unknown; the OS flags the event for the
   moderator. The store is per-studentId (blob key), so the check rides
   the same cloud rail as the handoff. */
const DEVICE_CODE_TTL = 10 * 60; // seconds
const DEVICE_MAX_ATTEMPTS = 3;

async function postDeviceCheck(pl) {
  if (!pl || !pl.studentId || !pl.fp) return bad("studentId and fp required");
  const rec = await blobGet("devices", pl.studentId);
  const devs = rec ? rec.value : [];
  const known = devs.some(function (d) { return d.fp === pl.fp; });
  return ok({
    known: known,
    devices: devs.map(function (d) { return { label: d.label || "", location: d.location || "", firstSeen: d.firstSeen, lastSeen: d.lastSeen }; }),
    lastLocation: devs.length ? (devs[devs.length - 1].location || "") : "",
  });
}

async function postDeviceChallenge(pl) {
  if (!pl || !pl.studentId || !pl.fp) return bad("studentId and fp required");
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const rec = await blobGet("deviceChallenges", pl.studentId);
  const list = rec ? rec.value : [];
  const ch = {
    fp: pl.fp,
    code: code,
    attempts: 0,
    label: String(pl.label || "New device").slice(0, 80),
    location: String(pl.location || "").slice(0, 120),
    createdAt: nowSec(),
    expiresAt: nowSec() + DEVICE_CODE_TTL,
  };
  list.push(ch);
  if (list.length > 20) list.splice(0, list.length - 20);
  const written = await blobPut("deviceChallenges", pl.studentId, list, rec ? rec.etag : "");
  if (!written) return json(409, { ok: false, reason: "concurrent challenge — try again" });
  // hand the code to the student's own inbox via the mail rail; when the rail
  // is not configured (demo), the response carries the code so the demo can
  // show it — in production with RESEND_API_KEY set, only the email knows it.
  const mailKey = rfxEnv("RESEND_API_KEY");
  if (mailKey) {
    postMail({ to: pl.email, subject: "Reality FX — is this really you?", html: deviceCheckHTML(code) }).catch(function () { /* mail rail may be down — the code still lives on the challenge */ });
  }
  return ok({ ok: true, codeSent: !!mailKey, demoCode: mailKey ? "" : code, expiresAt: ch.expiresAt });
}

async function postDeviceConfirm(pl) {
  if (!pl || !pl.studentId || !pl.fp || !pl.code) return bad("studentId, fp and code required");
  const rec = await blobGet("deviceChallenges", pl.studentId);
  const list = rec ? rec.value : [];
  const ch = list.filter(function (c) { return c.fp === pl.fp; }).pop() || null;
  if (!ch) return ok({ ok: false, reason: "no challenge — request a code first" });
  if (ch.expiresAt < nowSec()) return ok({ ok: false, reason: "code expired — request a new one" });
  if (ch.attempts >= DEVICE_MAX_ATTEMPTS) return ok({ ok: false, reason: "too many wrong codes — request a new one" });
  if (String(ch.code) !== String(pl.code).trim()) {
    ch.attempts++;
    await blobPut("deviceChallenges", pl.studentId, list, rec.etag);
    return ok({ ok: false, reason: "wrong code — " + (DEVICE_MAX_ATTEMPTS - ch.attempts) + " attempt" + (DEVICE_MAX_ATTEMPTS - ch.attempts === 1 ? "" : "s") + " left" });
  }
  // confirmed — this device becomes known
  const drec = await blobGet("devices", pl.studentId);
  const devs = drec ? drec.value : [];
  const now = nowSec();
  const existing = devs.find(function (d) { return d.fp === pl.fp; });
  if (existing) existing.lastSeen = now;
  else devs.push({ fp: pl.fp, label: ch.label, location: ch.location, firstSeen: now, lastSeen: now });
  if (devs.length > 12) devs.splice(0, devs.length - 12);
  await blobPut("devices", pl.studentId, devs, drec ? drec.etag : "");
  list.splice(list.indexOf(ch), 1); // consume the challenge
  await blobPut("deviceChallenges", pl.studentId, list, rec.etag);
  return ok({ ok: true, added: true, device: { label: ch.label, location: ch.location, firstSeen: now } });
}

const HALL = {
  code: "HALL5", title: "The Study Hall", kind: "mentor", format: "hall",
  provider: "custom", lesson: "", startsAt: 0, capacity: 0,
  calendarShare: false, host: "The Academy", hostId: "academy",
  broadcastUrl: "", note: "Always open — drop in, study with whoever is here, keep each other sharp. No host, no schedule: the room is the campus.",
  status: "live", scheduledAt: 0, liveAt: 0, endsAt: 0,
  chat: [], present: [], requests: [], bookings: [], waiting: [],
  createdAt: 0,
};

async function getRooms() {
  const rooms = await mutate("rooms", "rooms", (list) => {
    const hasHall = list.some((r) => r.code === "HALL5");
    if (!hasHall) {
      list.push(Object.assign({}, HALL, { liveAt: nowSec(), createdAt: nowSec() }));
    }
    return list;
  });
  return ok({ rooms });
}

async function postRooms(pl) {
  if (!pl || typeof pl !== "object" || !pl.hostId) return bad("hostId required");
  if (!pl.code && !pl.title) return bad("title required for a new room");
  let room = null;
  let missing = false, forbidden = false;
  await mutate("rooms", "rooms", (list) => {
    if (pl.code) {
      room = list.find((r) => r.code === pl.code) || null;
      if (!room) { missing = true; return list; }
      if (room.hostId !== pl.hostId) { forbidden = true; return list; }
      if (pl.title !== undefined) room.title = pl.title;
      if (pl.kind !== undefined) room.kind = pl.kind;
      if (pl.broadcastUrl !== undefined) room.broadcastUrl = pl.broadcastUrl;
      if (pl.note !== undefined) room.note = pl.note;
      if (pl.status === "live" && !room.liveAt) room.liveAt = nowSec();
      if (pl.status === "ended") room.endsAt = nowSec();
      if (pl.status !== undefined) room.status = pl.status;
      return list;
    }
    room = {
      code: genRoomCode(),
      title: pl.title,
      kind: pl.kind || "mentor",
      format: pl.format || (pl.kind === "staff" ? "staff" : "group"),
      provider: pl.provider || "custom",
      lesson: pl.lesson || "",
      startsAt: pl.startsAt || 0,
      capacity: pl.capacity || 0,
      calendarShare: !!pl.calendarShare,
      bookings: [], waiting: [],
      host: pl.host || "Mentor",
      hostId: pl.hostId,
      broadcastUrl: pl.broadcastUrl || "",
      note: pl.note || "",
      status: pl.status || "scheduled",
      scheduledAt: pl.scheduledAt || 0,
      liveAt: pl.status === "live" ? nowSec() : 0,
      endsAt: 0, chat: [], present: [], requests: [],
      createdAt: nowSec(),
    };
    list.push(room);
    return list;
  });
  if (missing) return json(404, { ok: false, reason: "room not found" });
  if (forbidden) return json(403, { ok: false, reason: "host only" });
  return ok({ ok: true, room });
}

async function postRoomAction(pl, action) {
  if (!pl || !pl.code) return bad("code required");
  let found = false, forbidden = false, result = null;
  await mutate("rooms", "rooms", (list) => {
    const room = list.find((r) => r.code === pl.code) || null;
    if (!room) return list;
    found = true;
    const needsHost = action === "booking" || action === "admit" || action === "end";
    if (needsHost && room.hostId !== pl.hostId) { forbidden = true; return list; }

    if (action === "chat") {
      if (!pl.msg || pl.msg === "") { result = "msg required"; return list; }
      const dlp = dlpHit(String(pl.msg));
      if (dlp) {
        // every blocked attempt lands on the PII incident board
        const inc = {
          at: nowSec(), room: String(pl.code || "").slice(0, 40), name: String(pl.name || "Unknown").slice(0, 60),
          role: String(pl.role || "student").slice(0, 20), reason: dlp.slice(0, 60), sample: String(pl.msg).slice(0, 80),
        };
        await mutate("pii", "pii-incidents", (list) => { list.unshift(inc); return list.slice(0, 200); });
        forbidden = false; result = { dlp: "That message looks like " + dlp + " — this chat is not private and staff never ask for that here." }; return list;
      }
      room.chat = room.chat || [];
      room.chat.push({ name: pl.name || "Student", role: pl.role || "student", msg: String(pl.msg).slice(0, 400), ts: nowSec() });
      if (room.chat.length > 200) room.chat = room.chat.slice(-200);
    } else if (action === "book") {
      if (!pl.name || !pl.dateLabel) { result = "code, name and date required"; return list; }
      room.bookings = room.bookings || [];
      room.bookings.push({
        id: "BK" + Math.floor(Math.random() * 90000 + 10000),
        name: pl.name, who: pl.who || "",
        dateLabel: String(pl.dateLabel).slice(0, 60),
        timeLabel: String(pl.timeLabel || "Any time").slice(0, 40),
        priority: !!pl.priority, status: "pending", ts: nowSec(), confirmedAt: 0, declinedAt: 0,
      });
      if (room.bookings.length > 100) room.bookings = room.bookings.slice(-100);
      result = room.bookings[room.bookings.length - 1];
    } else if (action === "booking") {
      for (const bk of room.bookings || []) {
        if (bk.id === pl.id && bk.status === "pending") {
          if (pl.action === "confirm") { bk.status = "confirmed"; bk.confirmedAt = nowSec(); }
          else if (pl.action === "decline") { bk.status = "declined"; bk.declinedAt = nowSec(); }
        }
      }
    } else if (action === "wait") {
      if (!pl.name) { result = "code and name required"; return list; }
      room.waiting = room.waiting || [];
      const inRoom = room.waiting.some((w) => (w.who || "") === (pl.who || "") && w.admittedAt === 0);
      if (!inRoom) room.waiting.push({ name: pl.name, who: pl.who || "", joinedAt: nowSec(), admittedAt: 0 });
    } else if (action === "admit") {
      if (!pl.who) { result = "code, hostId and who required"; return list; }
      for (const w of room.waiting || []) {
        if ((w.who || "") === (pl.who || "") && w.admittedAt === 0) w.admittedAt = nowSec();
      }
    } else if (action === "request") {
      if (!pl.name || pl.name === "") { result = "code and name required"; return list; }
      room.requests = room.requests || [];
      room.requests.push({ name: pl.name, who: pl.who || "", want: String(pl.want || "Any time that suits the mentor").slice(0, 200), ts: nowSec() });
      if (room.requests.length > 100) room.requests = room.requests.slice(-100);
    } else if (action === "presence") {
      if (!pl.who) { result = "code and who required"; return list; }
      const now = nowSec();
      let foundP = false;
      room.present = room.present || [];
      for (const p of room.present) {
        if (p.who === pl.who) { p.lastSeen = now; p.name = pl.name || p.name; p.role = pl.role || p.role; foundP = true; break; }
      }
      if (!foundP) room.present.push({ who: pl.who, name: pl.name || "Student", role: pl.role || "student", joinedAt: now, lastSeen: now });
      room.present = room.present.filter((p) => now - p.lastSeen < 75);
      result = { present: room.present.length };
    } else if (action === "end") {
      room.status = "ended";
      room.endsAt = nowSec();
    }
    return list;
  });
  if (!found) return json(404, { ok: false, reason: "room not found" });
  if (forbidden) return json(403, { ok: false, reason: "host only" });
  if (result && typeof result === "object" && result.dlp) return json(403, { ok: false, reason: result.dlp });
  if (result && typeof result === "string") return bad(result);
  if (action === "book") return ok({ ok: true, booking: result });
  if (action === "presence") return ok({ ok: true, present: result ? result.present : 0 });
  return ok({ ok: true });
}

/* PII scanner — the chat guard's server half. Mirrors the client's hard-block
   list so a bypassed client still can't post card numbers, bank/IBAN details,
   national IDs, SSNs, passport & licence numbers, crypto wallets, passwords
   or live 2FA codes into a room chat. */
function dlpHit(t) {
  const rules = [
    [/\b(?:\d[ -]?){13,19}\b/, "a card or long account number"],
    [/\b\d{13}\b/, "a national ID number"],
    [/\b\d{3}-\d{2}-\d{4}\b/, "a Social Security number"],
    [/\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b/, "an IBAN / international bank account"],
    [/\b(?:bank|account|acc)\b\s*(?:no\.?|number|#)?\s*(?:is|:|=|#)?\s*\d{6,17}\b/i, "a bank account number"],
    [/\b(?:routing|aba|sort)\s*code\s*(?:is|:|=|#)?\s*\d{6,9}\b/i, "a routing or sort code"],
    [/\b(?:passport|travel\s*doc)\b\s*(?:is|:|=|#)?\s*[A-Z]{1,2}\d{6,9}\b/i, "a passport number"],
    [/\b(?:driver'?s|driving)\s*licen[cs]e\s*(?:is|:|=|#)?\s*[A-Z0-9-]{6,16}\b/i, "a driving licence number"],
    [/\b(?:bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}\b/, "a crypto wallet address"],
    [/0x[a-fA-F0-9]{40}\b/, "a crypto wallet address"],
    [/\b(?:password|passwd|pwd|pin|secret)\b\s*(?:[:=]|\bis\s+)\S+/i, "a password or PIN"],
    [/\b(?:otp|2fa|two[- ]factor)\b\s*(?:code|pin)?\s*(?:is|:|=|#)?\s*\d{4,8}\b/i, "a live login / 2FA code"],
    [/\b(?:login|verification|confirm(?:ation)?|one[- ]time)\s+code\s*(?:is|:|=|#)?\s*\d{4,8}\b/i, "a live login / 2FA code"]
  ];
  for (const r of rules) if (r[0].test(t)) return r[1];
  return "";
}

/* Trading Challenge leaderboard — machine-signed results, one store */
async function getChallengeBoards() {
  const rec = await blobGet("challenges", "challenges");
  return ok(rec && rec.value ? { boards: rec.value } : { boards: {} });
}

async function postChallengeResult(pl) {
  if (!pl || !pl.challenge || typeof pl.score !== "number") return bad("challenge and score required");
  const key = String(pl.challenge).slice(0, 30);
  await mutate("challenges", "challenges", (boards) => {
    boards[key] = boards[key] || [];
    boards[key].push({
      studentId: String(pl.studentId || "RFX-DEMO").slice(0, 24),
      name: String(pl.name || "Student").slice(0, 60),
      score: Math.round(pl.score),
      verdict: pl.verdict === "PASS" ? "PASS" : "REVIEW",
      returnPct: Math.round(pl.returnPct || 0),
      trades: Math.round(pl.trades || 0),
      at: nowSec(),
    });
    boards[key].sort((a, b) => b.score - a.score);
    if (boards[key].length > 60) boards[key] = boards[key].slice(0, 60);
    return boards;
  });
  return ok({ ok: true });
}

/* ---------- the handler ---------- */

exports.handler = async (event) => {
  const path = routePath(event);
  const method = event.httpMethod || "GET";

  if (method === "OPTIONS") return { statusCode: 204, headers: CORS, body: "" };

  // The handshake minting rail is the one that must be locked. The shared
  // key rides a header; knowing the URL alone can never mint an identity.
  // Rotate by setting RFX_HANDOFF_KEY in Netlify env vars.
  if (method === "POST" && path === "handoff") {
    const key = (event.headers && (event.headers["x-rfx-handoff-key"] || event.headers["X-RFX-Handoff-Key"])) || "";
    const expected = process.env.RFX_HANDOFF_KEY || "rfx-handoff-demo-key";
    if (key !== expected) return json(403, { received: false, reason: "handoff key mismatch" });
    return postHandoff(parseBody(event));
  }
  if (method === "GET" && path === "handoffs") {
    const rec = await blobGet("handoffs", "handoffs");
    return ok(rec ? rec.value : []);
  }
  if (method === "POST" && path === "mail") return postMail(parseBody(event));

  if (method === "POST" && path === "flags/report") return postFlagsReport(parseBody(event));
  if (method === "GET" && path === "flags") {
    const rec = await blobGet("flags", "flags");
    return ok(rec ? rec.value : []);
  }
  if (method === "POST" && path === "flags/resolve") return postFlagsResolve(parseBody(event));

  if (method === "POST" && path === "session/claim") return postSessionClaim(parseBody(event));
  if (method === "POST" && path === "session/heartbeat") return postSessionHeartbeat(parseBody(event), true);
  if (method === "POST" && path === "session/check") return postSessionHeartbeat(parseBody(event), false);
  if (method === "POST" && path === "session/release") return postSessionRelease(parseBody(event));

  if (method === "POST" && path === "device/check") return postDeviceCheck(parseBody(event));
  if (method === "POST" && path === "device/challenge") return postDeviceChallenge(parseBody(event));
  if (method === "POST" && path === "device/confirm") return postDeviceConfirm(parseBody(event));

  if (method === "GET" && path === "challenge/leaderboard") return getChallengeBoards();
  if (method === "POST" && path === "challenge/leaderboard") return postChallengeResult(parseBody(event));

  if (method === "GET" && path === "pii-incidents") {
    const rec = await blobGet("pii", "pii-incidents");
    return ok(rec && rec.value ? { incidents: rec.value } : { incidents: [] });
  }
  if (method === "POST" && path === "pii-incidents") {
    const pl = parseBody(event);
    if (pl && pl.action === "clear") { await mutate("pii", "pii-incidents", () => []); return ok({ ok: true }); }
    if (pl && pl.reason) {
      const inc = {
        at: nowSec(), room: String(pl.room || "").slice(0, 40), name: String(pl.name || "Unknown").slice(0, 60),
        role: String(pl.role || "student").slice(0, 20), reason: String(pl.reason).slice(0, 60), sample: String(pl.sample || "").slice(0, 80),
      };
      await mutate("pii", "pii-incidents", (list) => { list.unshift(inc); return list.slice(0, 200); });
      return ok({ ok: true });
    }
    return bad("reason or action required");
  }

  if (method === "GET" && path === "rooms") return getRooms();
  if (method === "POST" && path === "rooms") return postRooms(parseBody(event));
  const roomActions = ["chat", "book", "booking", "wait", "admit", "request", "presence", "end"];
  for (const a of roomActions) {
    if (method === "POST" && path === "rooms/" + a) return postRoomAction(parseBody(event), a);
  }

  return json(404, { error: "not found" });
};
