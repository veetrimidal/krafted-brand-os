import type {Config} from '@netlify/functions';
import {handleWorkspaces,accountFailure} from '../../server/accounts.mjs';
import {accountDependencies} from '../../server/account-runtime.mjs';
export default async(request:Request)=>{try{return await handleWorkspaces(request,accountDependencies())}catch(error){return accountFailure(error)}};
export const config:Config={path:'/api/workspaces'};
