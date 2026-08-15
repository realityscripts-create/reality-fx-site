# PDF Printing — the SAFE recipe (read before touching the pipeline)

**Incident (13 Aug):** a headless Chrome run with a *relative* `--user-data-dir`
(`.freebuff/tools/chrome-profile`) left orphaned, elevated Chrome background
processes alive. Those processes hijacked every subsequent normal Chrome
launch — Chrome opened, found the broken profile path, showed *"Failed to
create data directory: .freebuff/tools/chrome-profile"*, and closed instantly.
Fix required an elevated `taskkill /F /T /IM chrome.exe`.

## Hard rules (never break these)

1. **Never pass `--user-data-dir` with a relative path.** If a profile dir is
   needed, use an absolute path under `%TEMP%` (e.g. `$TEMP/rfx-pdf-profile`)
   and delete it afterwards.
2. **Prefer NO `--user-data-dir` at all** — headless Chrome/Edge use a
   throwaway temp profile automatically and leave nothing behind.
3. **Never `taskkill /F /IM chrome.exe`** (kills the founder's real Chrome).
   Kill only the exact PID(s) you spawned, and only if they're still alive.
4. **Never run Chrome/Edge from the project directory with a bare relative
   path** — a subsequent normal launch of the browser inherits the broken
   command line and dies.

## The safe print command

Serve the build dir over HTTP (see `pdf-serve.pl`), then:

```bash
# Edge — no profile flag, throwaway temp profile, self-contained:
"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" \
  --headless=new --disable-gpu --no-sandbox \
  --print-to-pdf="C:/absolute/path/out.pdf" \
  --no-pdf-header-footer "http://127.0.0.1:49300/page.html"
```

Wait ~12s after launch, then verify the PDF exists and its `/Count` shows more
than 1 page before trusting it. If a print hangs, kill only that run's PID.

## Why the PDFs are still good

The three RFX PDFs on the Desktop were produced by valid runs (13/9/7 pages,
verified) before the stuck processes appeared — they are unaffected.
