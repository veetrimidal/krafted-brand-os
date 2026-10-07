import { build } from 'esbuild';
import { rm, mkdir, copyFile, cp } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
// Explicit allowlist: never publish .env files, server instructions, or source folders.
await copyFile('index.html', 'dist/index.html');
await cp('assets', 'dist/assets', { recursive: true });
await build({entryPoints:['client/standalone.js'],bundle:true,platform:'browser',format:'iife',target:'es2022',outfile:'dist/assets/standalone.js',minify:true});
console.log('Built public files in dist/.');
