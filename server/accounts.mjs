import { randomUUID } from 'node:crypto';
export class AccountError extends Error{constructor(message,status=400){super(message);this.status=status}}
export const reply=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export function sameOrigin(request){if(!['GET','HEAD'].includes(request.method)&&request.headers.get('origin')!==new URL(request.url).origin)throw new AccountError('This action must be sent from Brand OS.',403)}
export function registrationAccess(user,ownerEmail){
 if(!user?.id||!user.confirmedAt)return {allowed:false,reason:'verification_required'};
 return {allowed:true,reason:ownerEmail&&user.email?.toLowerCase()===ownerEmail.toLowerCase()?'owner':'registered'};
}
export async function accountContext(deps){let user=await deps.getUser();if(!user?.id)throw new AccountError('Sign in to continue.',401);if(!user.confirmedAt){let identityUser;try{identityUser=await deps.getIdentityUser?.(user.id)}catch{throw new AccountError('Account verification could not be checked right now. Please retry.',503)}if(!identityUser||identityUser.id!==user.id)throw new AccountError('Account verification could not be checked right now. Please retry.',503);if(!identityUser.confirmedAt)throw new AccountError('Verify your email before continuing.',403);user={...user,...identityUser}}const {db,ownerEmail}=deps;await db.query('INSERT INTO brand_accounts(id,email) VALUES($1,$2) ON CONFLICT(id) DO UPDATE SET email=EXCLUDED.email',[user.id,user.email||'']);return {user,access:registrationAccess(user,ownerEmail)}}
export async function authorize(deps,{ai=false}={}){const account=await accountContext(deps);if(!account.access.allowed)throw new AccountError('Verify your email to access Brand OS.',403);if(ai){const {rows}=await deps.db.query(`INSERT INTO brand_ai_usage(account_id,minute,requests) VALUES($1,date_trunc('minute',now()),1) ON CONFLICT(account_id,minute) DO UPDATE SET requests=brand_ai_usage.requests+1 WHERE brand_ai_usage.requests<20 RETURNING requests`,[account.user.id]);if(!rows.length)throw new AccountError('Too many AI requests. Please wait a minute.',429)}return account}
export function safeWorkspace(data){if(!data||typeof data!=='object'||Array.isArray(data))throw new AccountError('Workspace data must be an object.');const keys=['brand','archetype','clarity','dna','multiplier','funnel','guidelines','assets','brandie','kraftie','websiteBrief','visualAxes'];const clean=Object.fromEntries(keys.filter(k=>Object.hasOwn(data,k)).map(k=>[k,data[k]]));if(JSON.stringify(clean).length>3500000)throw new AccountError('This workspace exceeds the 3.5 MB save limit. Remove large image assets and retry.',413);return clean}
async function readJson(request){const reader=request.body?.getReader();if(!reader)throw new AccountError('Request body required.');let size=0;const chunks=[];for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>4500000){await reader.cancel();throw new AccountError('Workspace request is too large.',413)}chunks.push(value)}const all=new Uint8Array(size);let at=0;for(const chunk of chunks){all.set(chunk,at);at+=chunk.length}try{return JSON.parse(new TextDecoder().decode(all))}catch{throw new AccountError('Invalid JSON request.')}}
export async function handleAccount(request,deps){try{if(request.method!=='GET')throw new AccountError('Use GET.',405);const account=await accountContext(deps);return reply({user:{id:account.user.id,email:account.user.email,name:account.user.name||''},access:account.access,checkoutReady:false})}catch(error){return accountFailure(error)}}
export async function handleWorkspaces(request,deps){try{
 sameOrigin(request);const {user}=await authorize(deps),url=new URL(request.url),id=url.searchParams.get('id');
 if(id&&!/^[0-9a-f-]{36}$/i.test(id))throw new AccountError('Invalid workspace ID.');
 if(request.method==='GET'){
  if(id){const {rows}=await deps.db.query('SELECT id,name,kind,data,revision FROM brand_workspaces WHERE id=$1 AND account_id=$2',[id,user.id]);if(!rows.length)throw new AccountError('Workspace not found.',404);return reply(rows[0])}
  await deps.db.query("INSERT INTO brand_workspaces(id,account_id,kind,name) VALUES($1,$2,'founder','My Brand') ON CONFLICT DO NOTHING",[randomUUID(),user.id]);
  const {rows}=await deps.db.query('SELECT id,name,kind,revision FROM brand_workspaces WHERE account_id=$1 ORDER BY kind DESC,created_at',[user.id]);return reply({workspaces:rows});
 }
 if(request.method==='POST'){
  const body=await readJson(request),name=body.name?.trim();if(!name||name.length>80)throw new AccountError('Use a client name of 1–80 characters.');
  const {rows}=await deps.db.query("INSERT INTO brand_workspaces(id,account_id,kind,name,data) VALUES($1,$2,'client',$3,$4::jsonb) RETURNING id,name,kind,data,revision",[randomUUID(),user.id,name,JSON.stringify(safeWorkspace(body.data||{}))]);return reply(rows[0],201);
 }
 if(!id)throw new AccountError('Choose a workspace.');
 if(request.method==='PUT'){
  const body=await readJson(request);if(!Number.isSafeInteger(body.revision)||body.revision<1)throw new AccountError('A workspace revision is required.');
  const data=safeWorkspace(body.data),name=data.brand?.name?.trim()?.slice(0,80)||'My Brand';
  const {rows}=await deps.db.query('UPDATE brand_workspaces SET data=$1::jsonb,name=$2,revision=revision+1,updated_at=now() WHERE id=$3 AND account_id=$4 AND revision=$5 RETURNING revision',[JSON.stringify(data),name,id,user.id,body.revision]);
  if(!rows.length){const existing=await deps.db.query('SELECT id FROM brand_workspaces WHERE id=$1 AND account_id=$2',[id,user.id]);throw new AccountError(existing.rows.length?'This workspace changed in another tab. Reload before saving to avoid overwriting newer work.':'Workspace not found.',existing.rows.length?409:404)}return reply(rows[0]);
 }
 if(request.method==='DELETE'){
  const {rows}=await deps.db.query("DELETE FROM brand_workspaces WHERE id=$1 AND account_id=$2 AND kind='client' RETURNING id",[id,user.id]);if(!rows.length)throw new AccountError('Client workspace not found. Founder Mode cannot be deleted.',404);return reply({deleted:true});
 }
 throw new AccountError('Method not allowed.',405);
 }catch(error){return accountFailure(error)}}
export function accountFailure(error){return reply({error:error instanceof AccountError?error.message:'Account services are temporarily unavailable. Please retry.'},error instanceof AccountError?error.status:503)}
