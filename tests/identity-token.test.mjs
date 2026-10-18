import test from 'node:test';
import assert from 'node:assert/strict';
import {freshIdentityToken} from '../client/identity-token.js';

const now=Date.parse('2026-10-19T00:00:00Z');
const token=exp=>`header.${Buffer.from(JSON.stringify({exp})).toString('base64url')}.signature`;

test('selects a fresh Identity cookie over an expired duplicate',()=>{
 const stale=token(now/1000-3600),fresh=token(now/1000+3600);
 assert.equal(freshIdentityToken(`nf_jwt=${stale}; nf_jwt=${fresh}`,now),fresh);
 assert.equal(freshIdentityToken(`nf_jwt=${fresh}; nf_jwt=${stale}`,now),fresh);
});

test('ignores expired and malformed Identity cookies',()=>{
 assert.equal(freshIdentityToken(`nf_jwt=${token(now/1000-1)}`,now),'');
 assert.equal(freshIdentityToken('nf_jwt=not-a-jwt; other=value',now),'');
});
