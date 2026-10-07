/* Live Brandie: credentials and private instructions remain on the server. */
const brandieRequests = new Map();
const brandieDrafts = new Map();
function brandieSaveSafely(){try{save()}catch{toast('Browser storage is full. This conversation may not persist.')}}
function brandieLiveContext(){const c=brandieContext();return {...c,assets:c.assets?{colors:c.assets.colors,items:c.assets.items.map(({name,group,type})=>({name,group,type}))}:null,approval:{dna:!!state.dna.approved,guidelines:!!guidelineStore().approved}}}
function brandieSharedSources(c){return [['brandDNA','Brand DNA'],['guidelines','Guidelines'],['archetype','Archetype'],['assets','Asset names + colors'],['funnel','Funnel Clarity']].filter(([key])=>c[key]).map(([,label])=>label)}
brandieNewConversation=function(seed=''){
 const s=brandieStore(),id='brandie_'+crypto.randomUUID();
 s.conversations.unshift({id,title:'New brand conversation',messages:[],snapshot:brandieContext().snapshot,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});s.activeId=id;
 if(seed)brandieDrafts.set(id,seed);brandieSaveSafely();render();document.getElementById('brandieInput')?.focus();
};
const brandieStarters=[
 ['alignment','Check Brand Alignment','Review my selected brand context and help me check whether my current direction aligns with my brand. Identify any gaps and ask me for missing details.'],
 ['rewrite','Define My Brand Voice','Help me define a clear brand voice using my selected brand context. Suggest tone principles, words to use and avoid, and examples. Ask for missing details first.'],
 ['positioning','Refine My Positioning','Help me refine my brand positioning: who I serve, the problem I solve, and what makes my brand different. Use my selected context and ask about any gaps.'],
 ['messaging','Review My Messaging','Help me review my brand messaging for clarity and consistency. Use my selected brand context and ask me to share the message I want reviewed.'],
 ['decision','Choose My Brand Direction','Help me compare possible brand directions against my audience, values, and positioning. Ask me which options I am considering.'],
 ['copy','Define Messaging Pillars','Help me develop messaging pillars grounded in my selected brand context. Explain the role of each pillar and ask for any missing details.']
];
brandieQuick=function(type){const prompt=brandieStarters.find(([key])=>key===type)?.[2];if(!prompt)return;const c=currentBrandieConversation();if(c&&brandieRequests.has(c.id))return;const input=document.getElementById('brandieInput');brandieDrafts.set(c?.id||'new',prompt);if(input){input.value=prompt;input.focus()}};
brandieClear=function(){const c=currentBrandieConversation();if(!c)return;brandieRequests.get(c.id)?.abort();brandieRequests.delete(c.id);brandieDrafts.delete(c.id);chatClearFiles('brandie',c);c.messages=[];c.title='New brand conversation';brandieSaveSafely();render()};
function brandieCancel(){const c=currentBrandieConversation();if(c)brandieRequests.get(c.id)?.abort()}
async function brandieRetry(){const c=currentBrandieConversation();if(!c||brandieRequests.has(c.id))return;const last=c.messages.at(-1);if(last?.role==='assistant'&&last.error)c.messages.pop();await brandieRequest(c)}
brandieSend=async function(){const input=document.getElementById('brandieInput'),text=input?.value.trim()||(chatFiles('brandie',currentBrandieConversation()?.id).length?'Please review the attached files.':'');if(!text)return;if(chatFilesBusy('brandie',currentBrandieConversation()?.id))return;if(text.length>8000){toast('Please keep your message under 8,000 characters.');return}let c=currentBrandieConversation();if(c&&brandieRequests.has(c.id))return;if(!c){brandieNewConversation();c=currentBrandieConversation()}
 c.messages.push({role:'user',text,attachments:chatTakeFiles('brandie',c.id),at:new Date().toISOString()});c.title=c.title==='New brand conversation'?text.slice(0,45):c.title;brandieDrafts.delete(c.id);await brandieRequest(c);
};
async function brandieRequest(c){
 if(brandieRequests.has(c.id)||c.messages.at(-1)?.role!=='user')return;
 const context=brandieLiveContext();let messages;try{const history=c.messages.filter(m=>m.role==='user'||(m.live&&!m.error)).slice(-20);messages=history.map((m,i)=>chatMessagePayload(m,i===history.length-1))}catch(error){toast(error.message);return}
 const responseMessage={role:'assistant',text:'',live:true,pending:true,at:new Date().toISOString(),sources:brandieSharedSources(context)};
 c.messages.push(responseMessage);c.snapshot=context.snapshot;
 const controller=new AbortController();brandieRequests.set(c.id,controller);const timeout=setTimeout(()=>controller.abort(),55000);
 brandieSaveSafely();render();
 try{
  const response=await fetch('/api/brandie',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages,context}),signal:controller.signal});
  if(!response.ok){let message=response.status===429?'Brandie is busy. Please try again in a minute.':'Brandie is unavailable. Please try again.';if(response.status===404)message='The Brandie backend is not deployed on this site yet.';try{message=(await response.json()).error||message}catch{}throw new Error(message)}
  if(!response.headers.get('content-type')?.includes('application/x-ndjson')||!response.body)throw new Error('The Brandie backend is not available on this site yet.');
  const reader=response.body.getReader(),decoder=new TextDecoder();let buffer='',done=false;
  const consume=line=>{if(!line.trim())return;const event=JSON.parse(line);if(event.type==='delta'){responseMessage.text+=event.text;if(currentBrandieConversation()?.id===c.id&&location.hash==='#brandie')render()}if(event.type==='done')done=true;if(event.type==='error')throw new Error(event.message)};
  while(true){const part=await reader.read();if(part.done)break;buffer+=decoder.decode(part.value,{stream:true});const lines=buffer.split('\n');buffer=lines.pop();for(const line of lines)consume(line)}
  buffer+=decoder.decode();if(buffer.trim())consume(buffer);
  if(!done||!responseMessage.text.trim())throw new Error('Brandie’s reply was interrupted. Please try again.');
 }catch(error){controller.abort();responseMessage.error=error.name==='AbortError'?'Response stopped. You can retry your saved message.':error.message;}
 finally{clearTimeout(timeout);responseMessage.pending=false;if(brandieRequests.get(c.id)===controller)brandieRequests.delete(c.id);c.updatedAt=new Date().toISOString();brandieSaveSafely();if(location.hash==='#brandie')render()}
}
const brandiePrototypePage=brandiePage;
brandiePage=function(v){
 brandiePrototypePage(v);const c=currentBrandieConversation(),pending=c&&brandieRequests.has(c.id);
 const hero=v.querySelector('.hero');hero.classList.add('assistant-hero');hero.insertAdjacentHTML('afterbegin','<img class="assistant-page-avatar" src="assets/brandie-avatar.png" alt="Brandie" width="140" height="140">');
 const link=v.querySelector('.approval a');if(link)link.remove();const approval=v.querySelector('.approval');if(approval&&!approval.children.length)approval.remove();
 const intro=v.querySelector('.brandie-messages .notice');if(intro)intro.innerHTML='<b>Brandie, connected to your brand.</b><br>Ask about strategy, positioning, identity, or voice. Selected brand context and recent messages are sent to OpenAI when you send a message. Conversations remain saved in this browser.';
 const notice=v.querySelector('.hero + .notice');if(notice){const first=notice.childNodes;for(const n of first)if(n.nodeType===3)n.textContent=n.textContent.replace('You can still explore local guidance below.','You can still ask Brandie to help clarify your foundation.');}
 let starters=v.querySelector('.brandie-quick');if(!starters){starters=document.createElement('div');starters.className='brandie-quick';v.querySelector('.brandie-composer').before(starters)}starters.setAttribute('aria-label','Brandie starting prompts');starters.innerHTML=brandieStarters.map(([key,label])=>`<button type="button" onclick="brandieQuick('${key}')" ${pending?'disabled':''}>${label}</button>`).join('');
 if(c){const messages=v.querySelector('.brandie-messages');messages.setAttribute('aria-live','polite');messages.innerHTML=c.messages.map(m=>`<div class="brandie-message ${m.role==='user'?'user':''}">${m.role==='assistant'?`<div class="kicker">Brandie · ${m.live?'AI response':'Earlier local preview'}</div>`:''}<div style="white-space:pre-wrap">${esc(m.text|| (m.pending&&pending?'Brandie is thinking…':''))}</div>${chatFileBadges(m)}${m.error?`<div class="notice" role="alert" style="margin-top:10px">${esc(m.error)}</div>`:m.pending&&!pending?'<div class="notice">This response was interrupted. Send your question again.</div>':''}${m.live&&m.sources?.length?`<div class="brandie-sources">Context shared: ${m.sources.map(esc).join(' · ')}</div>`:''}</div>`).join('');if(pending)messages.scrollTop=messages.scrollHeight;}
 const input=document.getElementById('brandieInput');input.setAttribute('aria-label','Message Brandie');input.maxLength=8000;input.disabled=!!pending;input.value=brandieDrafts.get(c?.id||'new')||'';input.oninput=()=>brandieDrafts.set(c?.id||'new',input.value);input.onkeydown=e=>{if(e.key==='Enter'&&(e.metaKey||e.ctrlKey)){e.preventDefault();brandieSend()}};
 const composer=v.querySelector('.brandie-composer'),send=composer.querySelector('.btn.orange');send.disabled=!!pending;send.textContent=pending?'Thinking…':'↑ Send';
 if(pending)composer.insertAdjacentHTML('beforeend','<button class="btn secondary" onclick="brandieCancel()">Stop</button>');
 if(c?.messages.at(-1)?.error&&!pending)composer.insertAdjacentHTML('beforeend','<button class="btn secondary" onclick="brandieRetry()">Retry last message</button>');
 composer.insertAdjacentHTML('beforeend','<small class="muted" style="flex-basis:100%">Selected context is sent to OpenAI. Advice does not change your approved brand. Ctrl/⌘ + Enter to send.</small>');
 chatRenderFiles(v,'brandie',c,pending);
};
if(state.session)render();
