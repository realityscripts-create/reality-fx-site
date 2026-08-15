$procs = Get-CimInstance Win32_Process -Filter "name='chrome.exe'" -ErrorAction SilentlyContinue
Write-Output ("chrome processes found: " + @($procs).Count)
foreach ($p in $procs) {
    $cmd = ""
    if ($p.CommandLine) { $cmd = $p.CommandLine.Substring(0, [Math]::Min(110, $p.CommandLine.Length)) }
    Write-Output ("  PID " + $p.ProcessId + " parent " + $p.ParentProcessId + " :: " + $cmd)
}
Write-Output "--- stopping ---"
foreach ($p in $procs) {
    try {
        Stop-Process -Id $p.ProcessId -Force -ErrorAction Stop
        Write-Output ("  killed " + $p.ProcessId)
    } catch {
        Write-Output ("  DENIED " + $p.ProcessId + " : " + $_.Exception.Message)
    }
}
Start-Sleep -Seconds 2
$left = @(Get-CimInstance Win32_Process -Filter "name='chrome.exe'" -ErrorAction SilentlyContinue)
Write-Output ("remaining: " + @($left).Count)
