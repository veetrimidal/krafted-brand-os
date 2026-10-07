/* Conversation deletion is local to this browser, like conversation storage. */
function deleteChatConversation(name,id){
 const store=name==='brandie'?brandieStore():kraftieStore(),c=store.conversations.find(x=>x.id===id);if(!c)return;
 if(!window.confirm('Delete “'+c.title+'”? This removes this conversation and its attachments from this browser.'))return;
 const requests=name==='brandie'?brandieRequests:kraftieRequests,drafts=name==='brandie'?brandieDrafts:kraftieDrafts;
 const before=store.conversations,active=store.activeId;store.conversations=before.filter(x=>x.id!==id);if(active===id)store.activeId=store.conversations[0]?.id||null;
 try{save()}catch{store.conversations=before;store.activeId=active;toast('Could not delete the conversation. Browser storage is unavailable.');return}
 requests.get(id)?.abort();requests.delete(id);drafts.delete(id);chatClearFiles(name,c);render();toast('Conversation deleted');
}
function chatDeleteControls(v,name){const store=name==='brandie'?brandieStore():kraftieStore();v.querySelectorAll('.brandie-conversation').forEach((button,index)=>{const conversation=store.conversations[index];if(!conversation)return;const row=document.createElement('div');row.className='chat-conversation-row';button.before(row);row.append(button);const del=document.createElement('button');del.type='button';del.className='chat-conversation-delete';del.textContent='×';del.title='Delete conversation';del.setAttribute('aria-label','Delete conversation: '+conversation.title);del.onclick=()=>deleteChatConversation(name,conversation.id);row.append(del)})}
const deletableBrandiePage=brandiePage;brandiePage=function(v){deletableBrandiePage(v);chatDeleteControls(v,'brandie')};
const deletableKraftiePage=kraftiePage;kraftiePage=function(v){deletableKraftiePage(v);chatDeleteControls(v,'kraftie')};
if(state.session)render();
