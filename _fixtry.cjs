const fs = require('fs');
const p = 'D:/tools/Cindy/WPS-Paraphrasing/src/wps/lifecycle.js';
let c = fs.readFileSync(p, 'utf8');

// Wrap onContextMenuParaphrase body in try-catch
const oldFn = 'export function onContextMenuParaphrase() {\n  onShowPane();';
const newFn = 'export function onContextMenuParaphrase() {\n  try {\n    onShowPane();';
if (c.includes(oldFn)) {
  c = c.replace(oldFn, newFn);
  c = c.replace(
    'localStorage.setItem("PARAPHRASE_FETCH_SIGNAL", String(Date.now()));\n  }\n}',
    'localStorage.setItem("PARAPHRASE_FETCH_SIGNAL", String(Date.now()));\n    } catch (e) {\n    }\n  } catch (err) {\n    console.error("onContextMenuParaphrase error:", err);\n  }\n}'
  );
  fs.writeFileSync(p, c, 'utf8');
  console.log('try-catch added');
} else {
  console.log('pattern not found, skipping');
}