const fs = require('fs');
const p = 'D:/tools/Cindy/WPS-Paraphrasing/src/wps/lifecycle.js';
let c = fs.readFileSync(p, 'utf8');
c = c.replace('wps.CreateTaskPane("./index.html")', 'wps.CreateTaskPane(location.origin + "/index.html")');
fs.writeFileSync(p, c, 'utf8');
console.log('CreateTaskPane path fixed');