export async function handleIdentityLogin(request,{verifyOrigin,login}){
 if(request.method!=='POST')return new Response(null,{status:405,headers:{Allow:'POST'}});
 try{
  verifyOrigin(request);
  const body=await request.json();
  const email=typeof body?.email==='string'?body.email.trim():'';
  const password=body?.password;
  if(!email||typeof password!=='string'||!password)return Response.json({error:'Enter your email and password.'},{status:400,headers:{'Cache-Control':'no-store'}});
  const user=await login(email,password);
  return Response.json({user:{id:user.id,email:user.email}},{headers:{'Cache-Control':'no-store'}});
 }catch(error){
  const status=Number.isInteger(error?.status)&&error.status>=400&&error.status<500?error.status:500;
  return Response.json({error:status===500?'Sign-in service is unavailable. Please try again.':error.message||'Sign in failed.'},{status,headers:{'Cache-Control':'no-store'}});
 }
}
