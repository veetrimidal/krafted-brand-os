import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {NetlifyDB} from '@netlify/database-dev';
import {handleWorkspaces} from '../server/accounts.mjs';
import {handleMultiplierLibrary} from '../server/multiplier-library.mjs';

const origin='https://example.com';
const owner={id:'multiplier-owner',email:'owner@example.com',confirmedAt:'2026-10-14'};
const outsider={id:'multiplier-outsider',email:'other@example.com',confirmedAt:'2026-10-14'};
const req=(path,method='GET',body,from=origin)=>new Request(origin+path,{method,headers:{origin:from,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
test('source library and rounds stay workspace-scoped, reusable, and idempotent',async()=>{
 const db=new NetlifyDB({logger:()=>{}});await db.start();try{await db.applyMigrations('netlify/database/migrations');const deps={db,getUser:async()=>owner},other={db,getUser:async()=>outsider};
 const created=await handleWorkspaces(req('/api/workspaces','POST',{name:'Example',data:{}}),deps);const workspace=await created.json(),base='/api/multiplier-library?workspaceId='+workspace.id;
 assert.equal((await handleMultiplierLibrary(req(base+'&entity=sources'),other)).status,404);
 assert.equal((await handleMultiplierLibrary(req(base+'&entity=sources','POST',{kind:'text',title:'A',text:'One idea'},'https://evil.example'),deps)).status,403);
 const sourceRes=await handleMultiplierLibrary(req(base+'&entity=sources','POST',{kind:'text',title:'Original memo',text:'Pressure reveals what matters.',sourceType:'Memo'}),deps);assert.equal(sourceRes.status,201);const {source}=await sourceRes.json();assert.equal(source.text,'Pressure reveals what matters.');
 const link=await handleMultiplierLibrary(req(base+'&entity=sources','POST',{kind:'link',title:'Reference',url:'https://example.org/doc',text:'A copied excerpt',sourceType:'Link'}),deps);assert.equal(link.status,201);
 const badLink=await handleMultiplierLibrary(req(base+'&entity=sources','POST',{kind:'link',title:'Bad',url:'http://127.0.0.1/a',text:'x'}),deps);assert.equal(badLink.status,400);
 const projectId=randomUUID(),key=randomUUID(),result={thesis:'One idea',insights:['Pressure'],angles:['Education'],calendar:[{day:1,platform:'LinkedIn',format:'Post',angle:'Education',goal:'Authority',title:'A story'}]};const roundBody={title:'Original plan',idempotencyKey:key,projectId,parentRoundId:null,sourceIds:[source.id],config:{source:source.text,sourceType:'Memo',goal:'Balanced Growth',frequency:'3 posts/week',duration:'14 Days',platforms:['LinkedIn']},result};
 const saved=await handleMultiplierLibrary(req(base+'&entity=rounds','POST',roundBody),deps);assert.equal(saved.status,201);const {round}=await saved.json();assert.equal(round.projectId,projectId);
 const retry=await (await handleMultiplierLibrary(req(base+'&entity=rounds','POST',roundBody),deps)).json();assert.equal(retry.round.id,round.id);
 const next=await (await handleMultiplierLibrary(req(base+'&entity=rounds','POST',{...roundBody,idempotencyKey:randomUUID(),parentRoundId:round.id,title:'Another round'}),deps)).json();assert.equal(next.round.parentRoundId,round.id);
 const renamed=await handleMultiplierLibrary(req(base+'&entity=rounds&id='+round.id,'PUT',{title:'Renamed plan',revision:round.revision}),deps);assert.equal(renamed.status,200);
 assert.equal((await handleMultiplierLibrary(req(base+'&entity=rounds&id='+round.id,'PUT',{title:'Stale',revision:round.revision}),deps)).status,409);
 const current=(await renamed.json()).round,edited={...result,thesis:'Edited thesis',calendar:[{...result.calendar[0],title:'A better story',direction:'Open with the founder insight.'}]};const updated=await handleMultiplierLibrary(req(base+'&entity=rounds&id='+round.id,'PUT',{title:'Edited plan',revision:current.revision,result:edited}),deps);assert.equal(updated.status,200);assert.equal((await updated.json()).round.result.calendar[0].title,'A better story');
 assert.equal((await handleMultiplierLibrary(req(base+'&entity=rounds'),other)).status,404);
 const form=new FormData();form.set('file',new File(['A readable text source.'],'note.txt',{type:'text/plain'}));form.set('sourceType','Memo');const upload=new Request(origin+base+'&entity=sources',{method:'POST',headers:{origin},body:form});const uploaded=await handleMultiplierLibrary(upload,deps);assert.equal(uploaded.status,201);assert.equal((await uploaded.json()).source.text,'A readable text source.');
 const calls={transcription:0,document:0},aiDeps={...deps,createClient:()=>({audio:{transcriptions:{create:async()=>{calls.transcription++;return {text:'A recorded founder insight.'}}}},responses:{create:async()=>{calls.document++;return {output_text:'A faithful document excerpt.'}}}})};
 const audio=new FormData();audio.set('file',new File(['audio bytes'],'note.mp3',{type:'audio/mpeg'}));const audioRes=await handleMultiplierLibrary(new Request(origin+base+'&entity=sources',{method:'POST',headers:{origin},body:audio}),aiDeps);assert.equal(audioRes.status,201);assert.equal((await audioRes.json()).source.text,'A recorded founder insight.');
 const pdf=new FormData();pdf.set('file',new File(['%PDF-sample'],'brief.pdf',{type:'application/pdf'}));const pdfRes=await handleMultiplierLibrary(new Request(origin+base+'&entity=sources',{method:'POST',headers:{origin},body:pdf}),aiDeps);assert.equal(pdfRes.status,201);assert.equal((await pdfRes.json()).source.text,'A faithful document excerpt.');assert.deepEqual(calls,{transcription:1,document:1});
 }finally{await db.stop()}
});
