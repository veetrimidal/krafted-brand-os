/* File contents stay in page memory, never in localStorage. */
const chatFileDrafts=new Map(), chatFileData=new Map(), chatFileLoading=new Set();
function chatFileKey(name,id){return name+':'+id}
function chatFiles(name,id){return chatFileDrafts.get(chatFileKey(name,id))||[]}
function chatFilesBusy(name,id){return chatFileLoading.has(chatFileKey(name,id))}
function chatChooseFiles(name){let c=name==='brandie'?currentBrandieConversation():currentKraftieConversation();if(!c){(name==='brandie'?brandieNewConversation:kraftieNewConversation)();}document.getElementById(name+'Files').click()}
async function chatAddFiles(name,input){
 const c=name==='brandie'?currentBrandieConversation():currentKraftieConversation();if(!c)return;
 const key=chatFileKey(name,c.id),files=[...input.files],current=chatFiles(name,c.id);input.value='';
 if(current.length+files.length>3){toast('Attach up to 3 files per message.');return}
 if(current.reduce((n,x)=>n+x.size,0)+files.reduce((n,x)=>n+x.size,0)>2*1024*1024){toast('Attachments must total 2 MB or less.');return}
 chatFileLoading.add(key);render();
 const loaded=[];
 try{
  for(const file of files){
   const ext=file.name.split('.').pop().toLowerCase(),types={png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',pdf:'application/pdf',txt:'text/plain',md:'text/plain',csv:'text/plain'};
   const type=types[ext];if(!type)throw new Error('Use PNG, JPG, WEBP, PDF, TXT, MD, or CSV files.');
   if(!file.size||file.name.length>180)throw new Error('Choose a non-empty file with a shorter filename.');
   const item={id:crypto.randomUUID(),name:file.name,type,size:file.size};
   if(type==='text/plain'){if(file.size>100000)throw new Error('Text files must be under 100 KB.');item.text=await file.text();if(!item.text.trim()||item.text.includes('\0'))throw new Error('This file does not contain readable text.');}
   else item.data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(`data:${type};base64,${String(reader.result).split(',')[1]}`);reader.onerror=()=>reject(new Error('Could not read the file.'));reader.readAsDataURL(file)});
   loaded.push(item);
  }
  if(!chatFileLoading.has(key))return;
  loaded.forEach(item=>chatFileData.set(item.id,item));chatFileDrafts.set(key,[...current,...loaded]);
 }catch(error){toast(error.message)}finally{chatFileLoading.delete(key);if(location.hash==='#'+name)render()}
}
function chatRemoveFile(name,id,fileId){const key=chatFileKey(name,id);chatFileDrafts.set(key,chatFiles(name,id).filter(x=>x.id!==fileId));chatFileData.delete(fileId);render()}
function chatTakeFiles(name,id){const key=chatFileKey(name,id),files=chatFiles(name,id);chatFileDrafts.delete(key);return files.map(({id,name,type,size})=>({id,name,type,size}))}
function chatClearFiles(name,c){const key=chatFileKey(name,c.id);[...chatFiles(name,c.id),...c.messages.flatMap(m=>m.attachments||[])].forEach(f=>chatFileData.delete(f.id));chatFileLoading.delete(key);chatFileDrafts.delete(key)}
function chatMessagePayload(m,last){
 const result={role:m.role,content:m.text};
 if(m.attachments?.length){
  if(last){result.attachments=m.attachments.map(meta=>{const file=chatFileData.get(meta.id);if(!file)throw new Error('Please reattach the files and send a new message; files are not kept after a page refresh.');const {name,type,data,text}=file;return {name,type,...(data?{data}:{text})}})}
  else result.content+='\n[Earlier attachments, not included in this request: '+m.attachments.map(f=>f.name).join(', ')+']';
 }
 return result;
}
function chatFileBadges(m){return m.attachments?.length?`<div class="chat-file-badges">${m.attachments.map(f=>`<span>📎 ${esc(f.name)}</span>`).join('')}</div>`:''}
function chatRenderFiles(v,name,c,pending){
 const composer=v.querySelector('.brandie-composer'),files=chatFiles(name,c?.id),busy=chatFilesBusy(name,c?.id);
 composer.querySelector('.btn.orange').disabled=!!pending||busy;
 composer.insertAdjacentHTML('beforeend',`<div class="chat-file-controls"><button type="button" class="btn secondary" onclick="chatChooseFiles('${name}')" ${pending||busy?'disabled':''}>${busy?'Reading files…':'📎 Attach files'}</button><input id="${name}Files" type="file" hidden multiple accept=".png,.jpg,.jpeg,.webp,.pdf,.txt,.md,.csv" onchange="chatAddFiles('${name}',this)"><small>Up to 3 files · 2 MB total · text files up to 100 KB</small></div><div class="chat-file-list">${files.map(f=>`<div class="chat-file-card">${f.type.startsWith('image/')?`<img src="${esc(f.data)}" alt="Preview of ${esc(f.name)}">`:'<span aria-hidden="true">📄</span>'}<span>${esc(f.name)}<small>${Math.ceil(f.size/1024)} KB</small></span><button type="button" class="btn secondary" aria-label="Remove ${esc(f.name)}" onclick="chatRemoveFile('${name}','${c.id}','${f.id}')" ${pending||busy?'disabled':''}>×</button></div>`).join('')}</div><small class="muted">Files are sent to OpenAI with this message and may increase token usage. Reattach for a later review; file contents are not saved after refresh.</small>`);
}
