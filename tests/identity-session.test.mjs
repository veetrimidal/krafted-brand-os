import test from 'node:test';
import assert from 'node:assert/strict';
import {verifiedSessionUser} from '../server/identity-session.mjs';

const validToken='header.payload.signature';
const request=cookie=>new Request('https://kraftedbrandos.netlify.app/api/account',{headers:cookie?{cookie}:{}});
const identityUrl='https://kraftedbrandos.netlify.app/.netlify/identity';

test('verified SDK user is used without a second Identity request',async()=>{
 const user={id:'one',email:'one@example.com',confirmedAt:'2026-10-01'};
 assert.equal(await verifiedSessionUser(request(),{getUser:async()=>user,identityUrl,fetchUser:()=>{throw Error('must not fetch')}}),user);
});

test('a cookie session is accepted only after Identity verifies it',async()=>{
 const seen=[];
 const user=await verifiedSessionUser(request(`nf_jwt=${validToken}`),{getUser:async()=>null,identityUrl,fetchUser:async(url,options)=>{seen.push({url:String(url),authorization:options.headers.Authorization});return Response.json({id:'one',email:'one@example.com',confirmed_at:'2026-10-01',user_metadata:{full_name:'One'}})}});
 assert.deepEqual(user,{id:'one',email:'one@example.com',name:'One',confirmedAt:'2026-10-01'});
 assert.deepEqual(seen,[{url:identityUrl+'/user',authorization:'Bearer '+validToken}]);
});

test('an invalid or rejected cookie cannot authorize a user',async()=>{
 const denied=await verifiedSessionUser(request(`nf_jwt=${validToken}`),{getUser:async()=>null,identityUrl,fetchUser:async()=>new Response(null,{status:401})});
 assert.equal(denied,null);
 let calls=0;
 const malformed=await verifiedSessionUser(request('nf_jwt=not-a-jwt'),{getUser:async()=>null,identityUrl,fetchUser:async()=>{calls++;return Response.json({id:'one',email:'one@example.com'})}});
 assert.equal(malformed,null);assert.equal(calls,0);
});

test('a valid cookie can be recovered when a stale duplicate appears first',async()=>{
 const calls=[];
 const user=await verifiedSessionUser(request(`nf_jwt=old.token.value; nf_jwt=${validToken}`),{getUser:async()=>null,identityUrl,fetchUser:async(_url,options)=>{calls.push(options.headers.Authorization);return options.headers.Authorization==='Bearer '+validToken?Response.json({id:'one',email:'one@example.com',confirmed_at:'2026-10-01'}):new Response(null,{status:400})}});
 assert.equal(user?.id,'one');assert.deepEqual(calls,['Bearer old.token.value','Bearer '+validToken]);
});

test('request host cannot redirect session token verification',async()=>{
 const evilRequest=new Request('https://example.invalid/api/account',{headers:{cookie:`nf_jwt=${validToken}`}});
 let url;
 await verifiedSessionUser(evilRequest,{getUser:async()=>null,identityUrl,fetchUser:async value=>{url=String(value);return new Response(null,{status:401})}});
 assert.equal(url,identityUrl+'/user');
});
