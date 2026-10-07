import {getUser,admin} from '@netlify/identity';
import {getDatabase} from '@netlify/database';
import {authorize,accountFailure} from './accounts.mjs';
export function accountDependencies(){return {getUser,getIdentityUser:id=>admin.getUser(id),get db(){return getDatabase({connectionString:Netlify.env.get('NETLIFY_DB_URL')||process.env.NETLIFY_DB_URL}).pool},ownerEmail:Netlify.env.get('BRAND_OS_OWNER_EMAIL')||''}}
export async function protectAI(request){try{if(request.method!=='POST')return new Response(null,{status:405});await authorize(accountDependencies(),{ai:true});return null}catch(error){return accountFailure(error)}}
