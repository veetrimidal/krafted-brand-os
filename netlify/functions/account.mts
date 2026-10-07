import type {Config} from '@netlify/functions';
import {handleAccount,accountFailure} from '../../server/accounts.mjs';
import {accountDependencies} from '../../server/account-runtime.mjs';
export default async(request:Request)=>{try{return await handleAccount(request,accountDependencies())}catch(error){return accountFailure(error)}};
export const config:Config={path:'/api/account'};
