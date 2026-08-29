$ErrorActionPreference = "Stop"

$srcDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$jsaddons = Join-Path $env:APPDATA "kingsoft\wps\jsaddons"
$dstDir = Join-Path $jsaddons "WPS-Paraphrasing"

# Copy files
if (-not (Test-Path $jsaddons)) { New-Item -ItemType Directory -Path $jsaddons -Force | Out-Null }
if (Test-Path $dstDir) { Remove-Item $dstDir -Recurse -Force }
Copy-Item $srcDir $dstDir -Recurse -Force

# Startup shortcut
$startup = [Environment]::GetFolderPath("Startup")
$wsh = New-Object -ComObject WScript.Shell
$sc = $wsh.CreateShortcut((Join-Path $startup "WPS-Paraphrasing-Server.lnk"))
$sc.TargetPath = "powershell.exe"
$srvArgs = "-NoProfile -WindowStyle Hidden -EP Bypass -File " + $dstDir + "\server.ps1"
$sc.Arguments = $srvArgs
$sc.WindowStyle = 7
$sc.Save()

# publish.xml
Copy-Item (Join-Path $srcDir "publish-template.xml") (Join-Path $jsaddons "publish.xml") -Force

# Start server
$srvArgs2 = "-NoProfile -WindowStyle Hidden -EP Bypass -File " + $dstDir + "\server.ps1"
Start-Process powershell.exe -ArgumentList ($srvArgs2 + " -WindowStyle Hidden")

Write-Host "Installed. Server started. Please restart WPS."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
