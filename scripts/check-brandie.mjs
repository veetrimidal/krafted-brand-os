import OpenAI from 'openai';
import {handleBrandie} from '../server/brandie.mjs';
const request=new Request('https://kraftedbrandos.netlify.app/api/brandie',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({context:{brand:{name:'Integration Test'},brandDNA:{audience:'Independent designers',positioningStatement:'Practical brand strategy for independent designers'},approval:{dna:true}},messages:[{role:'user',content:'In one sentence, tell me who our audience is based on the supplied context.'}]})});
const response=await handleBrandie(request,{model:'gpt-5-mini',createClient:()=>new OpenAI({maxRetries:0})});
const text=await response.text();
console.log(JSON.stringify({status:response.status,result:text}));
if(!response.ok||!text.includes('"done"'))process.exitCode=1;
