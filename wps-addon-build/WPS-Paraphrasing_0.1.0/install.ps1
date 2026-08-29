$ErrorActionPreference = "Stop"
$pluginName = "WPS-Paraphrasing"
$srcDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$jsaddonsDir = Join-Path $env:APPDATA "kingsoft\wps\jsaddons"
$dstDir = Join-Path $jsaddonsDir $pluginName

if (-not (Test-Path $jsaddonsDir)) {
    New-Item -ItemType Directory -Path $jsaddonsDir -Force | Out-Null
}

if (Test-Path $dstDir) {
    Remove-Item $dstDir -Recurse -Force
}
Copy-Item $srcDir $dstDir -Recurse -Force

$publishXmlPath = Join-Path $jsaddonsDir "publish.xml"
$pluginUrl = "file:///" + $dstDir.Replace('\','/') + "/"

if (Test-Path $publishXmlPath) {
    [xml]$doc = Get-Content $publishXmlPath -Encoding UTF8
} else {
    $doc = New-Object System.Xml.XmlDocument
    $declaration = $doc.CreateXmlDeclaration("1.0","UTF-8",$null)
    $doc.AppendChild($declaration) | Out-Null
    $root = $doc.CreateElement("jsplugins")
    $doc.AppendChild($root) | Out-Null
}

$root = $doc.DocumentElement
$xpath = "//jspluginonline[@name='$pluginName']"
$existing = $root.SelectNodes($xpath)
foreach ($node in $existing) { $root.RemoveChild($node) | Out-Null }

$entry = $doc.CreateElement("jspluginonline")
$entry.SetAttribute("name", $pluginName)
$entry.SetAttribute("type", "wps")
$entry.SetAttribute("url", $pluginUrl)
$entry.SetAttribute("install", "null")
$entry.SetAttribute("enable", "enable")
$root.AppendChild($entry) | Out-Null

$doc.Save($publishXmlPath)
Write-Host "Installed successfully. Please restart WPS."
Write-Host "Plugin location: " + $dstDir
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
