import type {Config} from '@netlify/functions';
import {handleContentBoard} from '../../server/content-board.mjs';
import {accountDependencies} from '../../server/account-runtime.mjs';
export default async(request:Request)=>handleContentBoard(request,accountDependencies());
export const config:Config={path:'/api/content-board'};
