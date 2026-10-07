import { protectAI } from '../../server/account-runtime.mjs';
import type { Config } from '@netlify/functions';
import OpenAI from 'openai';
import { handleBrandie, jsonError } from '../../server/brandie.mjs';

export default async (request: Request) => {
 const denied=await protectAI(request);if(denied)return denied;
  const apiKey=Netlify.env.get('OPENAI_API_KEY');
  if(!apiKey)return jsonError('Brandie is not connected yet. The site owner needs to configure the API key.',503);
  return handleBrandie(request, {
    model:Netlify.env.get('BRANDIE_MODEL') || 'gpt-5-mini',
    createClient:()=>new OpenAI({apiKey,baseURL:'https://api.openai.com/v1',maxRetries:0,timeout:45000})
  });
};
export const config: Config = {
  path:'/api/brandie',
  rateLimit:{action:'rate_limit',aggregateBy:'domain',windowSize:60,windowLimit:10}
};
