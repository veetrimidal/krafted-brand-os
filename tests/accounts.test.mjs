import test from 'node:test';
import assert from 'node:assert/strict';
import {NetlifyDB} from '@netlify/database-dev';
import {handleAccount,handleWorkspaces,registrationAccess,safeWorkspace,authorize} from '../server/accounts.mjs';
const verified={id:'one',email:'owner@example.com',confirmedAt:'2026-01-01'};
const req=(method='GET',body,id,origin='https://example.com')=>new Request('https://example.com/api/workspaces'+(id?'?id='+id:''),{method,headers:{origin,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
test('registration grants access only to verified identities, with owner recognized separately',()=>{assert.equal(registrationAccess(null,'').allowed,false);assert.equal(registrationAccess({...verified,confirmedAt:null},verified.email).allowed,false);assert.deepEqual(registrationAccess(verified,verified.email),{allowed:true,reason:'owner'});assert.deepEqual(registrationAccess(verified,'someone@example.com'),{allowed:true,reason:'registered'})});
test('workspace payload cannot set account or subscription privileges',()=>{assert.deepEqual(safeWorkspace({brand:{name:'Test'},session:true,user:{id:'other'},subscriptions:{active:true},role:'owner'}),{brand:{name:'Test'}});assert.throws(()=>safeWorkspace({assets:'x'.repeat(3500001)}),/save limit/)});
test('real database ownership, access, revisions, deletion and AI quota',async t=>{
 const db=new NetlifyDB({logger:()=>{}});await db.start();try{await db.applyMigrations('netlify/database/migrations');const owner={db,getUser:async()=>verified,ownerEmail:verified.email};const otherUser={id:'two',email:'two@example.com',confirmedAt:'2026-01-01'},other={db,getUser:async()=>otherUser,ownerEmail:otherUser.email};
 await t.test('anonymous and unverified access is denied; verified registration needs no payment',async()=>{assert.equal((await handleAccount(req(),{db,getUser:async()=>null})).status,401);assert.equal((await handleWorkspaces(req(),{db,getUser:async()=>({...otherUser,confirmedAt:null}),ownerEmail:''})).status,403)});
 assert.equal((await handleWorkspaces(req(),{db,getUser:async()=>otherUser,ownerEmail:''})).status,200);
 const personal=(await (await handleWorkspaces(req(),owner)).json()).workspaces[0];assert.equal(personal.kind,'founder');
 let client;
 await t.test('workspace create and read are tied to authenticated owner',async()=>{const created=await handleWorkspaces(req('POST',{name:'Client',data:{brand:{name:'Client'},dna:{data:{purpose:'Private'}}}}),owner);assert.equal(created.status,201);client=await created.json();assert.equal((await handleWorkspaces(req('GET',null,client.id),other)).status,404);assert.equal((await handleWorkspaces(req('DELETE',null,client.id),other)).status,404);assert.equal((await handleWorkspaces(req('PUT',{revision:1,data:{}},client.id),other)).status,404)});
 await t.test('CAS revision rejects stale writers without losing saved state',async()=>{assert.equal((await handleWorkspaces(req('PUT',{revision:1,data:{brand:{name:'Updated'}}},client.id),owner)).status,200);assert.equal((await handleWorkspaces(req('PUT',{revision:1,data:{brand:{name:'Old'}}},client.id),owner)).status,409);assert.equal((await (await handleWorkspaces(req('GET',null,client.id),owner)).json()).data.brand.name,'Updated')});
 await t.test('CSRF, founder deletion and resurrection are blocked',async()=>{assert.equal((await handleWorkspaces(req('POST',{name:'Bad'},null,'https://evil.example'),owner)).status,403);assert.equal((await handleWorkspaces(req('DELETE',null,personal.id),owner)).status,404);assert.equal((await handleWorkspaces(req('DELETE',null,client.id),owner)).status,200);assert.equal((await handleWorkspaces(req('PUT',{revision:2,data:{}},client.id),owner)).status,404)});
 await t.test('AI rate limit is account-specific and server-enforced',async()=>{for(let i=0;i<20;i++)await authorize(owner,{ai:true});await assert.rejects(()=>authorize(owner,{ai:true}),e=>e.status===429);await authorize(other,{ai:true})});
 }finally{await db.stop()}
});

test('anonymous requests never initialize the database',async()=>{const response=await handleAccount(req(),{getUser:async()=>null,get db(){throw new Error('must not connect')}});assert.equal(response.status,401)});
