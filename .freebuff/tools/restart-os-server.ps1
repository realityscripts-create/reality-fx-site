$ErrorActionPreference = "SilentlyContinue"
$root = "C:/Users/user/Downloads/REALITY FX TRADING/reality-fx-site"
Get-CimInstance Win32_Process -Filter "Name='perl.exe'" | Where-Object { $_.CommandLine -match 'os-handoff' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
Start-Sleep -Milliseconds 1200
Start-Process -FilePath "C:\Program Files\Git\usr\bin\perl.exe" -ArgumentList @(
  ".freebuff/tools/os-handoff-server.pl",
  "$root/REALITY-FOREX-TRADING-",
  "49270",
  "$root/.freebuff/tools/os-handoffs.json"
) -WindowStyle Hidden
Start-Sleep -Seconds 2
Write-Output "restarted"
