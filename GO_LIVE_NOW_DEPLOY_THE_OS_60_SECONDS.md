# 🚀 GO LIVE NOW — DEPLOY THE OS — 60 SECONDS 🚀

**THE OS STATIC APP IS READY ON YOUR DESKTOP: `RFX-OS-DEPLOY.zip` (237 MB — the whole course).**
**This is the "students can ALWAYS reach the Academy" fix. Do this now — it takes one minute and needs no code, no terminal, no credit card.**

---

## ✅ DO THIS (60 seconds, your browser only)

1. Open **https://app.netlify.com/drop** (free — no card, no sign-up required beyond a free account).
2. **Drag `RFX-OS-DEPLOY.zip`** from your Desktop onto the page.
3. Netlify uploads it and gives you a **live HTTPS link instantly** — something like `https://glittery-mermaid-abc123.netlify.app`.
4. **Rename it to something worthy:** Site settings → *Change site name* → `reality-fx-os` → your URL becomes **`https://reality-fx-os.netlify.app`**.
5. **That's it.** The Academy — every chapter, every slide, every quiz, the Journey, the certificate — is now **always-on, reachable from any device, anywhere**. This is the "the course survives an apocalypse" promise, made real.

**Bonus (later):** the same zip can be dropped onto Vercel (`vercel.com/new`) or Firebase Hosting the same way. One account, one drop, done.

---

## 📌 What works NOW on the hosted OS

- ✅ The **full course**: Journey, 13 chapters, every slide image, quizzes, XP, badges, certificates — all local to the app.
- ✅ The calm **"Academy link offline"** state is built in — the OS never looks broken; it tells the truth when the System A link isn't reachable yet.

## 📌 What still needs Lee (the production half — unchanged)

- The **handshake with System A** (Firebase Auth + the handoff Cloud Function + Firestore) — that's what lets an approved student's identity and progress follow them to the hosted OS. His go-live brief §2.1–2.6 is the checklist.
- The **member panel / wallet** stays on System A until then.

---

## 🔁 To update the site after this session

1. Re-run the bundle (or just re-copy the updated `os/` folder from the project).
2. Drag it onto **app.netlify.com/drop** again — it creates a new URL, or use *Deploys → drag & drop* on the existing site to keep the same URL.

---

*The founder's rule: "students must always have access to the OS — with that being off, we are screwed." This zip is that rule, shipped.*

---

## 🆕 UPDATE — your Netlify account is ready (from the founder's account)

Your account (`realityfx20@gmail.com`, team **Reality Fx**) is perfect for this — **no new account needed**.

- ✅ **Use the drag-and-drop area** on the Projects page: drag `RFX-OS-DEPLOY.zip` in, it becomes a new project (suggested name `reality-fx-os`).
- ⛔ **Leave `aeden-mw` alone** — that's the client project (Aeden), untouched.
- The **`realityfx`** project is your site (Game Changers) — leave it as is, or host the OS under a **new project** so the two never mix.
- No card needed: the free Netlify plan hosts a static site like ours with no problem.

## 🆕 What shipped since this brief was written (all verified live)

The OS is much bigger than the zip description above now — everything below is in `RFX-OS-DEPLOY.zip` / the `os/` folder and will be live the moment you drop it:

- **Live Studio v2** — pick the lesson + difficulty (Standard/Challenging/Elite), the format (small group / **1-on-1** / **interview room** / staff / **university lecture**), the broadcast provider (Whereby / YouTube / Zoom / Meet / StreamYard / custom), schedule days ahead with the **mentor calendar**, and share it.
- **Mentor booking calendar** — students book slots; the mentor confirms/declines from the room; confirmed bookings **lock 3 hours before the start** (no last-minute cancellations on students); 1-on-1 sessions give **mentor-course students first priority**.
- **Interview room with a waiting room** — candidates queue outside, the interviewer lets them in one at a time with a 30s countdown.
- **The Study Hall** — an always-open room (code HALL5), no host needed, pinned at the top of Live Rooms.
- **Room player** — embeds the broadcast link (Whereby/YouTube embed automatically; Zoom/Meet open their own window), host controls for **cam / mic / white backdrop / quality**.
- **Break Room** — cool-down timer, breathing drills, stretches, Wisdom Shelf, **reset journal**, and **soft light** (dims the whole Academy); a **break nudge** appears after every quiz.
- **The Story** — the making-of wall (7 chapters), Course scope protocol, dashboard duration strip, unified white/tabular numbers, tidy fixed grids everywhere.

## 📌 THE FINAL CONTRACT FOR LEE (what's his, what's done)

**Done on our side (System A + OS):** registration → approval → handoff → ACTIVE; entitlements list; Trust Bar; demo pass; single-session guard; the handoff endpoint contract; live rooms rail (demo store on the OS server); the full audit 21/21; the OS is a static app ready to host.

**Still his (§2.1–2.6 of his brief — unchanged, this is what unblocks everything):**
1. **Always-on hosting** — any static host works (Netlify/Vercel/Firebase Hosting). We're dropping the OS on Netlify from the founder's account now; he doesn't need to do this part.
2. **Firebase Auth** — email+password sign-in, **one session per student** (his lane; the OS already sends the signals).
3. **Handoff Cloud Function** — the endpoint the OS calls; must reply `{ received: true, already?: boolean }` and be **idempotent by Student ID**.
4. **Firestore + rules** — identity, trust, entitlements; server-side rate limits.
5. **Email provider** — verification codes, confirmations (incl. **booking confirmations** — when a mentor confirms a slot, the student gets an email; production goes through his provider; the demo records it in the room).
6. **DNS** — point the domain at the host.

**New since his brief — production notes for the live rail:** the Live Rooms store is a JSON file on the OS server today; in production it becomes Firestore realtime (rooms, chat, presence, bookings, waiting room) so every student sees the same rooms from anywhere. The room/booking endpoints are already shaped for it — the swap is the same seam as everything else.
