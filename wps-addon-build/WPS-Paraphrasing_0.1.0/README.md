WPS-Paraphrasing Add-on v0.1.0
==============================

Offline package for WPS Office add-on: context-aware English paraphrasing via DeepSeek API.

## Install on another device

1. Extract this folder to:
   %APPDATA%\kingsoft\wps\jsaddons\WPS-Paraphrasing_0.1.0\

2. Edit (or create) %APPDATA%\kingsoft\wps\jsaddons\publish.xml and add:

   <jspluginonline name= WPS-Paraphrasing type=wps url=file:///%APPDATA%/kingsoft/wps/jsaddons/WPS-Paraphrasing_0.1.0/ install=null enable=enable/>

   Note: replace %APPDATA% with the actual absolute path (e.g. C:/Users/<name>/AppData/Roaming/).

3. Restart WPS. Select an English word, right-click, choose the paraphrase item.

4. First use: enter your DeepSeek API key when prompted.
   The key is stored locally in WPS settings (not uploaded anywhere).

## Alternative: serve over HTTP

If file:// does not work on the target device, serve this folder:
   npx serve -p 3889
Then use url=http://127.0.0.1:3889/ in publish.xml.

## Files

- index.html      host page (hidden, defines Ribbon/context-menu callbacks)
- dialog.html     popup UI (API key input + candidate list + replacement)
- taskpane.html   settings page (reserved)
- ribbon.xml      context menu definition
- jsplugins.xml   WPS plugin manifest
