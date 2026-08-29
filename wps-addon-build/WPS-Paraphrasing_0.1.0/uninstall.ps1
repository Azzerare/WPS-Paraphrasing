$ErrorActionPreference = "Stop"
$pluginName = "WPS-Paraphrasing"
$jsaddonsDir = Join-Path $env:APPDATA "kingsoft\wps\jsaddons"
$dstDir = Join-Path $jsaddonsDir $pluginName

if (Test-Path $dstDir) {
    Remove-Item $dstDir -Recurse -Force
}

$publishXmlPath = Join-Path $jsaddonsDir "publish.xml"
if (Test-Path $publishXmlPath) {
    [xml]$doc = Get-Content $publishXmlPath -Encoding UTF8
    $root = $doc.DocumentElement
    $xpath = "//jspluginonline[@name='$pluginName']"
    $existing = $root.SelectNodes($xpath)
    foreach ($node in $existing) { $root.RemoveChild($node) | Out-Null }
    $doc.Save($publishXmlPath)
}

Write-Host "Uninstalled successfully."
Write-Host "Please restart WPS."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
