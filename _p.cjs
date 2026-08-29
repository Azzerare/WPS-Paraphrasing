var fs = require('fs');
var path = 'D:/tools/Cindy/WPS-Paraphrasing/public/dialog.html';
var html = fs.readFileSync(path, 'utf8');
var oldPrompt = 'You are an English writing assistant. Given a word and its sentence, recommend 5 contextually appropriate English synonyms. Same part of speech. Exclude the original and trivial variants. Sort by contextual fit. Give 1 short Chinese reason each. Output strictly a JSON array of {word, reason} objects, nothing else.';
var newPrompt = 'You are an English writing assistant. Given a word or phrase and its sentence, recommend 5 contextually appropriate alternatives. They can be single words or short phrases (2-4 words) if a phrase fits the context better than any single word. Match the part of speech. Exclude the original and trivial variants. Sort by contextual fit, best first. Give 1 short Chinese reason each. Output strictly a JSON array of {word, reason} objects, nothing else.';
if (html.indexOf(oldPrompt) > -1) {
  html = html.replace(oldPrompt, newPrompt);
  fs.writeFileSync(path, html, 'utf8');
  console.log('dialog.html prompt updated to allow phrases');
} else {
  console.log('old prompt not found exactly, checking...');
  var i = html.indexOf('You are an English writing assistant');
  console.log('prompt found at:', i);
  if (i > -1) {
    console.log('current:', html.substring(i, i + 300));
  }
}