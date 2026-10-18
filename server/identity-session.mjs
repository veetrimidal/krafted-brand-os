const jwtPattern=/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

function sessionTokens(request,cookieGet){
 const tokens=new Set();
 const bearer=/^Bearer\s+(.+)$/i.exec(request.headers.get('authorization')||'');
 if(bearer)tokens.add(bearer[1].trim());
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
 if(!identityUrl)return await getUser();
 let url;
 try{url=new URL(identityUrl.replace(/\/+$/,'')+'/user');if(url.protocol!=='https:')return null}catch{return null}
 const tokens=sessionTokens(request,cookieGet);
 console.info('brand-session-diagnostic',JSON.stringify({bearer:request.headers.has('authorization'),rawCookie:request.headers.has('cookie'),runtimeCookie:!!cookieGet?.('nf_jwt'),tokenCount:tokens.length,identityHostMatchesRequest:url.host===new URL(request.url).host,identityPath:url.pathname}));
 for(const token of tokens){
  try{
   const response=await fetchUser(url,{headers:{Authorization:`Bearer ${token}`},cache:'no-store',signal:AbortSignal.timeout(5000)});
   if(!response.ok){
    const body=await response.clone().json().catch(()=>null);
    const description=[body?.msg,body?.error,body?.error_description].filter(value=>typeof value==='string').join(' ');
    console.info('brand-session-verification',JSON.stringify({status:response.status,contentType:response.headers.get('content-type'),invalid:/invalid/i.test(description),expired:/expir/i.test(description),missing:/missing|absent|required/i.test(description),errorKeys:body&&typeof body==='object'?Object.keys(body).slice(0,8):[]}));
   }
   if(!response.ok)continue;
   const user=await response.json();
   if(typeof user?.id!=='string'||!user.id||typeof user?.email!=='string'||!user.email)continue;
   return {id:user.id,email:user.email,name:user.user_metadata?.full_name||user.email,confirmedAt:user.confirmed_at||user.confirmedAt||null};
  }catch{}
 }
 return await getUser();
}
