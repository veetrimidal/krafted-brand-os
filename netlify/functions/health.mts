import {getDatabase} from '@netlify/database';
export default async () => {
 try {const rows=await getDatabase({connectionString:Netlify.env.get('NETLIFY_DB_URL')||process.env.NETLIFY_DB_URL}).sql`SELECT to_regclass('public.brand_workspaces') IS NOT NULL AS ready`;return Response.json({ready:rows[0]?.ready===true},{headers:{'Cache-Control':'no-store'}})}
 catch(error){console.error('Database readiness failed',error instanceof Error?error.name:'Unknown');return Response.json({ready:false},{status:503})}
};
export const config={path:'/api/health'};
