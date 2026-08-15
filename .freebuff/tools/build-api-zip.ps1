# Build a deploy zip from rfx-os-deploy with forward-slash entry names (ZIP spec
# compliant — backslash entries break Netlify's Linux unzipper).
param(
  [string]$SourceDir = 'C:/Users/user/Desktop/rfx-os-deploy',
  [string]$OutZip = 'C:/Users/user/Desktop/RFX-BUILD-API.zip'
)

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

if (Test-Path $OutZip) { Remove-Item $OutZip -Force }

$base = (Resolve-Path $SourceDir).Path.TrimEnd('\')
$zip = [System.IO.Compression.ZipFile]::Open($OutZip, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  $files = Get-ChildItem -Path $base -Recurse -File
  foreach ($f in $files) {
    $rel = $f.FullName.Substring($base.Length + 1)
    $rel = $rel.Replace('\', '/')
    $e = $zip.CreateEntry($rel, [System.IO.Compression.CompressionLevel]::Optimal)
    $in = [System.IO.File]::OpenRead($f.FullName)
    try {
      $out = $e.Open()
      try { $in.CopyTo($out) } finally { $out.Dispose() }
    } finally { $in.Dispose() }
  }
} finally {
  $zip.Dispose()
}

$c = [System.IO.Compression.ZipFile]::OpenRead($OutZip)
try {
  $n = $c.Entries.Count
  $bad = @($c.Entries | Where-Object { $_.FullName -match '\\' }).Count
  $fn = @($c.Entries | Where-Object { $_.FullName -like 'netlify/functions/*' -or $_.FullName -eq '_redirects' -or $_.FullName -eq 'index.html' } | Select-Object -ExpandProperty FullName)
  Write-Output ("entries=$n backslashEntries=$bad")
  Write-Output ($fn -join ', ')
} finally {
  $c.Dispose()
}
