# FOR-LEE — The OS Is LIVE (11 Aug 2026) — Read This Before You Touch Anything

> Short version: the handshake rail is deployed and verified on Netlify. Your
> bridge already targets it. Two things changed on your side — the key, and
> the deploy rule. Everything else is a checklist.

---

## 1. 🔑 The handoff key has been rotated — update yours NOW

The demo key is **dead** on the live rail (verified: it returns 403).

**New shared key:** `31wO3R5r7OTi00QfNbQeUybc7lpoIGp3`

**Your action:** set `handoffApiKey` to that value in System A's settings
(`db.js` state / the staff console settings panel). Until you do, the bridge
will be rejected with "handoff key mismatch" the moment demoMode goes off.

The key lives in Netlify env vars (`RFX_HANDOFF_KEY`) — if it ever rotates
again, the new value will be sent to you first. Never commit a key change
without coordinating both sides.

## 2. 🌐 The live endpoint (already wired in your bridge)

- Base: `https://reality-fx-os.netlify.app`
- `POST /api/handoff` — mint/refresh an identity (header `X-RFX-Handoff-Key`)
- `GET  /api/handoffs` — what the OS greets with
- `POST /api/mail` — live email delivery (Resend; see §4)
- Flags, sessions, device challenges and rooms ride the same rail —
  all verified live end-to-end today.

State is stored in **Netlify Blobs** — no database to run, nothing for you to
host. The OS greets a student only when the rail hands over their identity
(`?sid=` from your gates does exactly that).

## 3. 🚫 The deploy rule — this bit us today, read it twice

**Never deploy the OS through the drag-and-drop zone** (the site's Deploys
page OR app.netlify.com/drop). It silently drops the Netlify Function — the
site updates, the rail dies, students see 404s. It happened live today; we
caught it and restored within minutes.

The ONLY correct path is the **Build API** (`POST /api/v1/sites/{site_id}/builds`
with the zip) — it's the path that bundles the function AND injects the env
vars the rail needs. We now have a one-command script for this
(`.freebuff/deploy-os.sh`) — ask the founder to run it, or use it yourself.

## 4. ⏳ What's still open (founder's side, not yours)

- **Live email delivery:** the `/api/mail` rail is armed and answering, but
  delivery is off until the founder sets `RESEND_API_KEY` (free account at
  resend.com + a verified domain). Until then the Mailbox stays the record —
  nothing breaks, emails just don't leave the building yet.
- **Nothing else.** The rail, the guard, the flags and the rooms are all live
  and verified.

## 5. ✅ Your checklist before demoMode: false

1. Update `handoffApiKey` to the new key (§1).
2. Confirm the bridge POSTs to `https://reality-fx-os.netlify.app/api/handoff`
   (your `rfxOsEndpoint` already does).
3. When a real student is approved, watch for `received:true` and the student
   appearing in the OS when they arrive via `?sid=`.
4. Never deploy via the drop zone (§3) — the Build API or the one-command
   script only.
5. When the founder gives you the Resend key, live emails start flowing with
   zero code changes.

That's it — the handshake is done, the two systems hold hands. Any questions,
send them back through the founder. 🏫
