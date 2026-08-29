var fs = require('fs');
var p = 'D:/tools/Cindy/WPS-Paraphrasing/src/wps/lifecycle.js';
var js = fs.readFileSync(p, 'utf8');
var oldP = 'You are an English writing assistant. Given a word and its sentence, recommend 5 contextually appropriate English synonyms. Same part of speech. Exclude the original and trivial variants. Sort by contextual fit. Give 1 short Chinese reason each. Output strictly a JSON array of {word, reason} objects, nothing else.';
var newP = 'You are an English writing assistant. Given a word or phrase and its sentence, recommend 5 contextually appropriate alternatives. They can be single words or short phrases (2-4 words) if a phrase fits the context better than any single word. Match the part of speech. Exclude the original and trivial variants. Sort by contextual fit, best first. Give 1 short Chinese reason each. Output strictly a JSON array of {word, reason} objects, nothing else.';
if (js.indexOf(oldP) > -1) {
  js = js.replace(oldP, newP);
  fs.writeFileSync(p, js, 'utf8');
  console.log('lifecycle.js prompt updated');
} else {
  console.log('prompt not found in lifecycle.js (may not be there)');
}
var ei = js.indexOf('export {');
if (ei > -1) js = js.substring(0, ei);
js = js.trim();
var html = fs.readFileSync('D:/tools/Cindy/WPS-Paraphrasing/index.html', 'utf8');
var bs = html.indexOf('<body>');
var be = html.indexOf('</body>');
if (bs > -1 && be > -1) {
  var out = html.substring(0, bs + 6) + '\n<script>\n' + js + '\n</' + 'script>\n</body>\n</html>\n';
  fs.writeFileSync('D:/tools/Cindy/WPS-Paraphrasing/index.html', out, 'utf8');
  console.log('index.html refreshed');
}