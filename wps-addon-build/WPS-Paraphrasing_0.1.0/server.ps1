$ErrorActionPreference = "SilentlyContinue"
$root = Join-Path $env:APPDATA "kingsoft\wps\jsaddons\WPS-Paraphrasing"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:3889/")
$listener.Start()
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $p = $ctx.Request.Url.AbsolutePath
  if ($p -eq "/") { $p = "/index.html" }
  $fp = Join-Path $root ($p.TrimStart("/"))
  if (-not (Test-Path $fp -PathType Leaf)) {
    $ctx.Response.StatusCode = 404
    $ctx.Response.Close()
    continue
  }
  $ext = [IO.Path]::GetExtension($fp).ToLower()
  $mime = "text/html"
  if ($ext -eq ".js") { $mime = "application/javascript" }
  if ($ext -eq ".css") { $mime = "text/css" }
  if ($ext -eq ".xml") { $mime = "text/xml" }
  $ctx.Response.ContentType = $mime
  $ctx.Response.Headers.Add("Access-Control-Allow-Origin","*")
  $buf = [IO.File]::ReadAllBytes($fp)
  $ctx.Response.ContentLength64 = $buf.Length
  $ctx.Response.OutputStream.Write($buf, 0, $buf.Length)
  $ctx.Response.Close()
}
