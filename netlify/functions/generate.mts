import { protectAI } from '../../server/account-runtime.mjs';
import type { Config } from '@netlify/functions';
import OpenAI from 'openai';
import { handleGenerate } from '../../server/generate.mjs';
import { jsonError } from '../../server/brandie.mjs';
export default async (request: Request) => {
 const denied=await protectAI(request);if(denied)return denied;
 const apiKey=Netlify.env.get('OPENAI_API_KEY');
 if(!apiKey)return jsonError('The OpenAI connection is not configured.',503);
 return handleGenerate(request,{model:Netlify.env.get('BRAND_OS_MODEL')||'gpt-5-mini',createClient:()=>new OpenAI({apiKey,baseURL:'https://api.openai.com/v1',maxRetries:0,timeout:55000})});
};
export const config:Config={path:'/api/generate',rateLimit:{action:'rate_limit',aggregateBy:'domain',windowSize:60,windowLimit:10}};
