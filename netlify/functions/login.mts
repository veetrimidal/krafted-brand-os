import type {Config} from '@netlify/functions';
import {login,verifyRequestOrigin} from '@netlify/identity';
import {handleIdentityLogin} from '../../server/identity-login.mjs';
export default async(request:Request)=>handleIdentityLogin(request,{verifyOrigin:verifyRequestOrigin,login});
export const config:Config={path:'/api/login'};
