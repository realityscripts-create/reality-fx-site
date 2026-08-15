# Build RFX-OS-DEPLOY.zip with forward-slash entry names (ZIP spec compliant)
# so Netlify's Linux unzipper extracts js/os.js as a real path, not a filename
# containing a literal backslash.
param(
  [string]$SourceDir,
  [string]$OutZip,
  [string]$ProjectRoot
)

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

if (Test-Path $OutZip) { Remove-Item $OutZip -Force }

$zip = [System.IO.Compression.ZipFile]::Open($OutZip, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  $base = (Resolve-Path $SourceDir).Path.TrimEnd('\')

  # Extra top-level items beyond the static site: the Netlify Function
  # (handoff/rooms/flags/session rail — zero dependencies by design) and
  # the _redirects that route /os/api/* and /api/* to it.
  $extras = @(
    @{ Path = (Join-Path $ProjectRoot 'netlify');  ZipPrefix = 'netlify' },
    @{ Path = (Join-Path $ProjectRoot '_redirects'); ZipPrefix = '' },
    @{ Path = (Join-Path $ProjectRoot 'rfx-pwa');  ZipPrefix = 'rfx-pwa' },
    @{ Path = (Join-Path $ProjectRoot 'rfx-pwa/_headers'); ZipPrefix = '' }
  )

  function Add-FileEntry([string]$fullPath, [string]$entryName) {
    $entry = $zip.CreateEntry($entryName, [System.IO.Compression.CompressionLevel]::Optimal)
    $in = [System.IO.File]::OpenRead($fullPath)
    try {
      $out = $entry.Open()
      try { $in.CopyTo($out) } finally { $out.Dispose() }
    } finally { $in.Dispose() }
  }

  $files = Get-ChildItem -Path $base -Recurse -File
  foreach ($f in $files) {
    $rel = $f.FullName.Substring($base.Length + 1)
    Add-FileEntry $f.FullName ($rel -replace '\\', '/')   # ZIP spec mandates forward slashes
  }

  foreach ($ex in $extras) {
    if (Test-Path $ex.Path) {
      if ((Get-Item $ex.Path).PSIsContainer) {
        $files2 = Get-ChildItem -Path $ex.Path -Recurse -File
        foreach ($f in $files2) {
          $rel = $f.FullName.Substring((Resolve-Path $ex.Path).Path.TrimEnd('\').Length + 1)
          $entryName = ($ex.ZipPrefix + '/' + $rel) -replace '\\', '/'
          Add-FileEntry $f.FullName $entryName
        }
      } else {
        $leaf = Split-Path $ex.Path -Leaf
        $entryName = if ($ex.ZipPrefix) { ($ex.ZipPrefix + '/' + $leaf) } else { $leaf }
        Add-FileEntry $ex.Path $entryName
      }
    }
  }
} finally {
  $zip.Dispose()
}

# Verify: count entries, confirm forward slashes, and report the key files
$check = [System.IO.Compression.ZipFile]::OpenRead($OutZip)
try {
  $n = $check.Entries.Count
  $bad = @($check.Entries | Where-Object { $_.FullName -match '\\' }).Count
  $fn = @($check.Entries | Where-Object { $_.FullName -like 'netlify/functions/*' -or $_.FullName -eq '_redirects' } | Select-Object -ExpandProperty FullName)
  Write-Output ("entries=$n backslashEntries=$bad apiRail=$($fn.Count)")
  Write-Output ($fn -join ', ')
} finally {
  $check.Dispose()
}
