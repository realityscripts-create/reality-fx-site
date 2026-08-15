# Running the Reality FX demo (this worktree)

Two static apps, two Perl servers (Git for Windows ships Perl; core modules only).

## Reproduce the artifacts

Nothing needs copying or installing — there is no `.env.local`, no npm, no build step.
Both apps are pure static HTML/CSS/JS served by Perl `HTTP::Daemon` servers:

- OS app: `REALITY-FOREX-TRADING-/os/` (self-contained, relative paths).
- System A (registrar): `System-A-live/` (self-contained, relative paths).
- Shared state files live under `.freebuff/tools/`:
  - `os-handoffs.json` — OS handoff/identity records.
  - `os-rooms.json` (auto-created) — live rooms store (Studio, Live Rooms, chat, presence, time requests).
  - `f8123.json` / the System A store — registrar data, written via `System-A-live`'s own server.

## Run the servers

Terminal 1 — System A (registrar) on **8123**:
```bash
cd "C:/Users/user/Downloads/REALITY FX TRADING/reality-fx-site/System-A-live" && RFX_ROOT="$(pwd)" RFX_PORT=8123 perl ../.freebuff/serve_fork.pl
```

Terminal 2 — the OS on **49270** (from the repo root):
```bash
cd "C:/Users/user/Downloads/REALITY FX TRADING/reality-fx-site" && perl .freebuff/tools/os-handoff-server.pl "REALITY-FOREX-TRADING-" 49270 ".freebuff/tools/os-handoffs.json"
```

Open:
- OS: http://127.0.0.1:49270/os/index.html
- System A: http://127.0.0.1:8123/index.html (reception) / `admin.html` (staff console) / `member.html` (student panel)

Notes:
- The OS server also exposes `/os/api/rooms` (live rooms rail) and `/os/api/handoff`.
- After editing `os-handoff-server.pl`, restart the OS server so the rooms API picks up new endpoints.
- `file://` browsing works for pages but the shared store (registration links across browsers, live rooms) requires the servers.
