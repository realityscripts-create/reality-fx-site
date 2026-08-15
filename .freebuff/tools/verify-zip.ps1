param([string]$ZipPath = 'RFX-OS-DEPLOY-READY.zip')
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$z = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path $ZipPath))
try {
  $slides = @($z.Entries | Where-Object { $_.FullName -like '*slide-*.png' })
  Write-Output ('slides=' + $slides.Count)
  $z.Entries | Where-Object { $_.FullName -like '*slide-*.png' } | Select-Object -First 3 | ForEach-Object { Write-Output ('slide-example: ' + $_.FullName) }
  $os = @($z.Entries | Where-Object { $_.FullName -like 'os/*' })
  Write-Output ("slides=" + $slides.Count + " osFiles=" + $os.Count + " total=" + $z.Entries.Count)
  $d = $z.Entries | Where-Object { $_.FullName -eq 'os/index.html' }
  $sr = New-Object System.IO.StreamReader($d.Open())
  $html = $sr.ReadToEnd()
  $sr.Close()
  Write-Output ("stamp_v64=" + $html.Contains('v=64'))
  $data = $z.Entries | Where-Object { $_.FullName -eq 'os/js/data.js' }
  $sr2 = New-Object System.IO.StreamReader($data.Open())
  $js = $sr2.ReadToEnd()
  $sr2.Close()
  $deep = ([regex]::Matches($js, 'quizSlides: \[20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37\]')).Count
  Write-Output ("deep18_lanes=" + $deep)
} finally {
  $z.Dispose()
}
