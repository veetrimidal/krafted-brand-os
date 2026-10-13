import test from 'node:test';
import assert from 'node:assert/strict';
import {NetlifyDB} from '@netlify/database-dev';
import {handleWorkspaces} from '../server/accounts.mjs';
import {handleContentBoard} from '../server/content-board.mjs';

const owner={id:'board-owner',email:'owner@example.com',confirmedAt:'2026-10-14'};
const outsider={id:'board-outsider',email:'outsider@example.com',confirmedAt:'2026-10-14'};
const request=(path,method='GET',body,origin='https://example.com')=>new Request('https://example.com'+path,{method,headers:{origin,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
test('content board is workspace-scoped, idempotent, and keeps AI source immutable',async()=>{
 const db=new NetlifyDB({logger:()=>{}});await db.start();try{await db.applyMigrations('netlify/database/migrations');const deps={db,getUser:async()=>owner},other={db,getUser:async()=>outsider};
 const created=await handleWorkspaces(request('/api/workspaces','POST',{name:'Sample brand',data:{multiplier:{drafts:[{title:'A strong hook',format:'LinkedIn post',body:'Original generated text',ai:{generatedAt:'2026-10-14T00:00:00Z'}}]}}}),deps);assert.equal(created.status,201);const workspace=await created.json(),path='/api/content-board?workspaceId='+workspace.id;
 assert.equal((await handleContentBoard(request(path),other)).status,404);
 assert.equal((await handleContentBoard(request(path,'POST',{action:'sendDraft',index:0},'https://evil.example'),deps)).status,403);
 const first=await handleContentBoard(request(path,'POST',{action:'sendDraft',index:0}),deps);assert.equal(first.status,201);const {item}=await first.json();assert.equal(item.status,'Drafts');assert.equal(item.data.originalDraft.body,'Original generated text');
 const repeat=await (await handleContentBoard(request(path,'POST',{action:'sendDraft',index:0}),deps)).json();assert.equal(repeat.item.id,item.id);assert.equal(repeat.alreadyAdded,true);
 const changed=await handleContentBoard(request(path+'&id='+item.id,'PUT',{revision:item.revision,status:'Review',data:{...item.data,body:'Working copy',originalDraft:{body:'tampered'}}}),deps);assert.equal(changed.status,200);const latest=(await changed.json()).item;assert.equal(latest.data.originalDraft.body,'Original generated text');assert.equal(latest.data.body,'Working copy');
 assert.equal((await handleContentBoard(request(path+'&id='+item.id,'PUT',{revision:item.revision,status:'Published',data:latest.data}),deps)).status,409);
 assert.equal((await handleContentBoard(request(path+'&id='+item.id,'DELETE',{revision:latest.revision}),other)).status,404);
 const listed=(await (await handleContentBoard(request(path),deps)).json()).items;assert.equal(listed.length,1);assert.equal(listed[0].status,'Review');
 }finally{await db.stop()}
});
