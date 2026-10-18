// The Identity browser SDK writes nf_jwt after a successful login. Ignore old
// duplicate cookies and let the API verify the selected token itself.
export function freshIdentityToken(cookieHeader,now=Date.now()){
 let selected='',latestExpiry=0;
 for(const part of cookieHeader.split(';')){
  const [name,...value]=part.trim().split('=');
  if(name!=='nf_jwt'||!value.length)continue;
  try{
   const token=decodeURIComponent(value.join('='));
   if(!/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token))continue;
   const payload=JSON.parse(atob(token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));
   if(Number.isFinite(payload.exp)&&payload.exp>Math.floor(now/1000)+30&&payload.exp>latestExpiry){selected=token;latestExpiry=payload.exp}
  }catch{}
 }
 return selected;
}
