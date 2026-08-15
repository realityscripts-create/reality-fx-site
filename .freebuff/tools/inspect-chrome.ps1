$root = Get-CimInstance Win32_Process -Filter "name='chrome.exe'" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -notmatch "--type=" } | Select-Object -First 3
foreach ($r in $root) {
    $parent = Get-CimInstance Win32_Process -Filter ("ProcessId=" + $r.ParentProcessId) -ErrorAction SilentlyContinue
    $owner = ""
    try { $owner = (Invoke-CimMethod -InputObject $r -MethodName GetOwner -ErrorAction Stop).User } catch { $owner = "?" }
    Write-Output ("chrome root PID " + $r.ProcessId + " parent " + $r.ParentProcessId + " (" + $parent.Name + ") owner " + $owner)
    if ($r.CommandLine) { Write-Output ("  cmd: " + $r.CommandLine.Substring(0, [Math]::Min(180, $r.CommandLine.Length))) }
}
