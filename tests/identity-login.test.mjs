import test from 'node:test';
import assert from 'node:assert/strict';
import {handleIdentityLogin} from '../server/identity-login.mjs';

const request=(body,origin='https://brand.example')=>new Request('https://brand.example/api/login',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});

test('login verifies origin and establishes the Identity session',async()=>{
 let called=false;
 const response=await handleIdentityLogin(request({email:' user@example.com ',password:'secret'}),{
  verifyOrigin(req){assert.equal(req.headers.get('origin'),'https://brand.example')},
  async login(email,password){called=true;assert.equal(email,'user@example.com');assert.equal(password,'secret');return {id:'user-1',email}},
 });
 assert.equal(called,true);
 assert.equal(response.status,200);
 assert.equal(response.headers.get('cache-control'),'no-store');
 assert.deepEqual(await response.json(),{user:{id:'user-1',email:'user@example.com'}});
});

test('login rejects an invalid origin before checking credentials',async()=>{
 const response=await handleIdentityLogin(request({email:'user@example.com',password:'secret'},'https://other.example'),{
  verifyOrigin(){throw Object.assign(new Error('Origin mismatch'),{status:403})},
  login(){throw Error('must not run')},
 });
 assert.equal(response.status,403);
});

test('login does not send malformed input to Identity',async()=>{
 const response=await handleIdentityLogin(request({email:'',password:''}),{verifyOrigin(){},login(){throw Error('must not run')}});
 assert.equal(response.status,400);
});
