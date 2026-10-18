const jwtPattern=/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

function sessionTokens(request,cookieGet){
 const tokens=new Set();
 for(const part of (request.headers.get('cookie')||'').split(';')){
  const at=part.indexOf('=');
  if(at<0||part.slice(0,at).trim()!=='nf_jwt')continue;
  try{tokens.add(decodeURIComponent(part.slice(at+1).trim()))}catch{}
 }
 const runtimeToken=cookieGet?.('nf_jwt');
 if(typeof runtimeToken==='string')tokens.add(runtimeToken);
 return [...tokens].filter(token=>token.length<=8192&&jwtPattern.test(token)).slice(0,4);
}

export async function verifiedSessionUser(request,{getUser,identityUrl,cookieGet,fetchUser=fetch}){
 const current=await getUser();
 if(current?.id)return current;
 if(!identityUrl)return null;
 let url;
 try{url=new URL(identityUrl.replace(/\/+$/,'')+'/user');if(url.protocol!=='https:')return null}catch{return null}
 for(const token of sessionTokens(request,cookieGet)){
  try{
   const response=await fetchUser(url,{headers:{Authorization:`Bearer ${token}`},cache:'no-store',signal:AbortSignal.timeout(5000)});
   if(!response.ok)continue;
   const user=await response.json();
   if(typeof user?.id!=='string'||!user.id||typeof user?.email!=='string'||!user.email)continue;
   return {id:user.id,email:user.email,name:user.user_metadata?.full_name||user.email,confirmedAt:user.confirmed_at||user.confirmedAt||null};
  }catch{}
 }
 return null;
}
