import type {Config} from '@netlify/functions';
import OpenAI from 'openai';
import {accountDependencies} from '../../server/account-runtime.mjs';
import {handleMultiplierLibrary} from '../../server/multiplier-library.mjs';
export default async(request:Request)=>{const deps=accountDependencies(),apiKey=Netlify.env.get('OPENAI_API_KEY');return handleMultiplierLibrary(request,{...deps,createClient:apiKey?()=>new OpenAI({apiKey,baseURL:'https://api.openai.com/v1',maxRetries:0,timeout:55000}):null})};
export const config:Config={path:'/api/multiplier-library',rateLimit:{action:'rate_limit',aggregateBy:'domain',windowSize:60,windowLimit:20}};
