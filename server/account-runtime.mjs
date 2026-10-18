import {getUser,admin,getIdentityConfig} from '@netlify/identity';
import {getDatabase} from '@netlify/database';
import {authorize,accountFailure} from './accounts.mjs';
import {verifiedSessionUser} from './identity-session.mjs';
export function accountDependencies(request){return {getUser:()=>verifiedSessionUser(request,{getUser,identityUrl:getIdentityConfig()?.url,cookieGet:name=>Netlify.context?.cookies?.get(name)}),getIdentityUser:id=>admin.getUser(id),get db(){return getDatabase({connectionString:Netlify.env.get('NETLIFY_DB_URL')||process.env.NETLIFY_DB_URL}).pool},ownerEmail:Netlify.env.get('BRAND_OS_OWNER_EMAIL')||''}}
export async function protectAI(request){try{if(request.method!=='POST')return new Response(null,{status:405});await authorize(accountDependencies(request),{ai:true});return null}catch(error){return accountFailure(error)}}
