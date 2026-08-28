var app = document.getElementById('app');
var DEFAULT_BASE_URL = 'https://api.deepseek.com/v1';
var DEFAULT_MODEL = 'deepseek-chat';
var SYS_PROMPT = [
  'You are an English writing assistant. User gives an English word and its sentence.',
  'Recommend 5 contextually appropriate synonyms.',
  'Same part of speech; exclude the original and trivial variants; sort by contextual fit.',
  'Give 1 short Chinese reason each.'
].join('\n');
function getProfiles(){try{var raw=localStorage.getItem('PARAPHRASE_PROFILES');var l=raw?JSON.parse(raw):[];return Array.isArray(l)?l:[]}catch(e){return[]}}
function saveProfiles(l){localStorage.setItem('PARAPHRASE_PROFILES',JSON.stringify(l))}
function getActiveId(){return localStorage.getItem('PARAPHRASE_ACTIVE_PROFILE')||''}
function setActiveId(id){localStorage.setItem('PARAPHRASE_ACTIVE_PROFILE',id)}
function getActiveProfile(){var id=getActiveId();var l=getProfiles();for(var i=0;i<l.length;i++){if(l[i].id===id)return l[i]}return null}
function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}
function $(id){return document.getElementById(id)}
var T={title:'�w^~)�v��y��yۧu����w^~)�v',back:'�w^~)�t+�u���T�w^~)�v',add:'+"��y��yۧu���^',apiCfg:'API Key �w^~)�v��y��y�',noCfg:+�u���X�w^~)�v��y��yۧu���M�w^~)�v��y��yۧu���y�w^~)�v��y��yۧu���p�w^~)�v��y��y�',name:&��y��yۧu���p',namePh:&��y��yۧu���ZDeepSeek',apiKey:'API Key',save:'�w^~)�v��y��y�',nameReq:&��y��yۧu���p�w^~)�t API Key"��y��yۧu���}�w^~)�v��y��y�',use:'�w^~)�v��y��y�',edit:&��y��yۧu���Q',del:&��y��yۧu���d',using:'�w^~)�v��y��yۧu���m',delConfirm:+�u���n�w^~)�v��y��yۧu���d�w^~)�w',curCfg:+�u���S�w^~)�v��y��yۧu���n�w^~)�v',settings:&��y��yۧu���n',hint:+�u���h�w^~)�v��y��yۧu���m�w^~)�v��y��yۧu���q�w^~)�v��y��yۧu���M�w^~)�v��y��yۧu���n�w^~)�v��y��yۧu���L�w^~)�v��y��yۧu����w^~)�v��y��yۧu���@�w^~)�v��y��y�',loading:&��y��yۧu���h�w^~)�v��y��yۧu���Y�w^~)�v��y��yۧu���f',noWord:&��y��yۧu���H�w^~)�v��y��yۧu���c�w^~)�v��y��yۧu���m�w^~)�v��y��yۧu���q�w^~)�v��y��yۧu���M',errNoProfile:&��y��yۧu���j�w^~)�v��y��y� API Kez��y��yۧu���w�w^~)�v��y��yۧu���`�w^~)�v'};
function renderSettings(){
  var list=getProfiles();var activeId=getActiveId();
  var html='<div class="settings"><div class="toolbar"><button id="btnBack" class="ghost">'+T.back+'</button><span class="title">'+T.apiCfg+'</span><button id="btnAdd">'+T.add+'</button></div>';
  if(list.length===0){
    html+='<p class="hint">'+T.noCfg+'</p>';
  }else{
    html+='<ul style="list-style:none;padding:0">';
    for(var i=0;i<list.length;i++){var p=list[i];var active=p.id===activeId;
      var mask=p.apiKey.length>8?p.apiKey.slice(0,4)+'****'+p.apiKey.slice(-4):'****';
      html+='<li class="'+(active?'profile active':'profile')+'">';
      html+='<div class="row"><span>'+esc(p.name)+'</span><span class="model">'+esc(p.model)+'</span></div>';
      html+='<div class="row meta"><span>'+mask+'</span><span class="actions">';
      if(active){html+='<span class="badge">'+T.using+'</span>'}
      else{html+='<button class="btnUse" data-i="'+i+'">'+T.use+'</button>'}
      html+='<button class="btnEdit" data-i="'+i+'">'+T.edit+'</button><button class="btnDel" data-i="'+i+'">'+T.del+'</button></span></div>';
      html+='</li>';
    }
    html+='</ul>';
  }
  html+='</div>';
  app.innerHTML=html;
  $('btnBack').onclick=renderMain;
  $('btnAdd').onclick=function(){renderForm(null)};
  var uses=app.querySelectorAll('.btnUse');
  for(var j=0;j<uses.length;j++){
    uses[j].onclick=function(){var idx=+this.dataset.i;var l2=getProfiles();if(l2[idx]){setActiveId(l2[idx].id);renderSettings()}};
  }
  var dels=app.querySelectorAll('.btnDel');
  for(var k=0;k<dels.length;k++){
    dels[k].onclick=function(){var idx=+this.dataset.i;if(confirm(T.delConfirm)){var l3=getProfiles();l3.splice(idx,1);saveProfiles(l3);renderSettings()}};
  }
}
function renderForm(editProfile){
  var p=editProfile||{name:'',apiKey:'',baseUrl:'',model:''};
  var html='<div class="settings"><div class="toolbar"><button id="btnBack" class="ghost">'+T.back+'</button><span class="title">'+(editProfile?T.edit:T.add)+'</span></div><form id="profileForm">';
  html+='<label>'+T.name+'<input name="name" value="'+esc(p.name)+'" placeholder="'+T.namePh+'" required maxlength="30"></label>';
  html+='<label>'+T.apiKey+'<input name="apiKey" type="password" value="'+esc(p.apiKey)+'" required></label>';
  html+='<label>Base URL<input name="baseUrl" value="'+esc(p.baseUrl)+'"></label>';
  html+='<label>Model<input name="model" value="'+esc(p.model)+'"></label>';
  html+='<div class="form-actions"><button type="submit">'+T.save+'</button></div></form></div>';
  app.innerHTML=html;
  $('btnBack').onclick=renderSettings;
  $('profileForm').onsubmit=function(e){
    e.preventDefault();
    var name=this.name.value.trim();var apiKey=this.apiKey.value.trim();
    if(!name||!apiKey){alert(T.nameReq);return}
    var baseUrl=this.baseUrl.value.trim()||DEFAULT_BASE_URL;
    var model=this.model.value.trim()||DEFAULT_MODEL;
    var list=getProfiles();
    if(editProfile){
      for(var i=0;i<list.length;i++){if(list[i].id===editProfile.id){list[i].name=name;list[i].apiKey=apiKey;list[i].baseUrl=baseUrl;list[i].model=model}}
    }else{
      var id='p_'+Date.now();
      list.push({id:id,name:name,apiKey:apiKey,baseUrl:baseUrl,model:model});
      if(!getActiveId())setActiveId(id);
    }
    saveProfiles(list);renderSettings();
  };
}
function renderMain(){
  var profile=getActiveProfile();
  if(!profile){renderSettings();return}
  var html='<div class="panel"><div class="topbar"><span class="status ok">'+T.curCfg+esc(profile.name)+'</span><button id="btnSettings" class="ghost">'+T.settings+'</button></div><p class="hint">'+T.hint+'</p><div id="result"></div></div>';
  app.innerHTML=html;
  $('btnSettings').onclick=renderSettings;
}
function renderLoading(msg){var el=$('result');if(el)el.innerHTML='<p class="loading">'+(msg||T.loading)+'</p>'}
function renderError(msg){var el=$('result');if(el)el.innerHTML='<p class="error">'+esc(msg)+'</p>'}
function fetchCandidates(){
  var profile=getActiveProfile();
  if(!profile){renderSettings();return}
  var wpsApi=window.Application||window.wps;
  var sel=null;
  try{sel=wpsApi.ActiveDocument.Application.Selection}catch(e1){}
  if(!sel){try{sel=wpsApi.Selection}catch(e2){}}
  if(!sel){renderError('WPS API unavailable');return}
  var word=(sel.Text||'').trim();
  if(!word){renderError(T.noWord);return}
  renderLoading();
  var sentence='';
  try{sentence=sel.Paragraphs(1).Range.Text||''}catch(e3){sentence=''}
  var prompt='Word: '+word+'\nSentence: '+(sentence.trim()||'N/A');
  fetch(profile.baseUrl.replace(/\/$/,'')+'/chat/completions',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':'Bearer '+profile.apiKey},
    body:JSON.stringify({model:profile.model,messages:[{role:'system',content:SYS_PROMPT},{role:'user',content:prompt}],temperature:0.3})
  }).then(function(r){
    if(!r.ok)throw new Error('HTTP '+r.status);
    return r.json();
  }).then(function(data){
    var raw=data&&data.choices&&data.choices[0]&&data.choices[0].message&&data.choices[0].message.content||'';
    var candidates;
    try{candidates=JSON.parse(raw)}catch(pe){
      var m=raw.match(/\[[\s\S]*\]/);
      if(!m)throw new Error('Cannot parse LLM response');
      candidates=JSON.parse(m[0]);
    }
    if(!Array.isArray(candidates))throw new Error('Unexpected LLM response shape');
    showCandidates(candidates.slice(0,5));
  }).catch(function(err){renderError(err.message||String(err))});
}
function showCandidates(candidates){
  var html='<ol class="candidates">';
  for(var i=0;i<candidates.length;i++){
    html+='<li data-word="'+esc(candidates[i].word)+'"><div class="word">'+esc(candidates[i].word)+'</div><div class="reason">'+esc(candidates[i].reason||'')+'</div></li>';
  }
  html+='</ol>';
  $('result').innerHTML=html;
  var items=app.querySelectorAll('.candidates li');
  for(var j=0;j<items.length;j++){
    items[j].onclick=function(){replaceSelection(this.dataset.word)};
  }
}
function replaceSelection(newWord){
  var wpsApi=window.Application||window.wps;
  var sel=null;
  try{sel=wpsApi.ActiveDocument.Application.Selection}catch(e1){}
  if(!sel){try{sel=wpsApi.Selection}catch(e2){}}
  if(!sel)return;
  var original=sel.Text||'';
  var replacement=newWord;
  if(original&&original===original.toUpperCase()&&original.length>1)replacement=newWord.toUpperCase();
  else if(original&&/^[A-Z]/.test(original))replacement=newWord.charAt(0).toUpperCase()+newWord.slice(1);
  sel.TypeText(replacement);
}
window.addEventListener('storage',function(e){if(e.key==='PARAPHRASE_FETCH_SIGNAL')fetchCandidates()});
try{var ch=new BroadcastChannel('wps-paraphrasing');ch.onmessage=function(e){if(e.data&&e.data.type==='paraphrase:fetch')fetchCandidates()}}catch(e){}
renderMain();

