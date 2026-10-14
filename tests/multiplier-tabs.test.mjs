import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

test('Content Board renders as a fourth Content Multiplier tab and keeps old links working',()=>{
 const view={innerHTML:'',insertAdjacentHTML(_position,html){this.innerHTML=html+this.innerHTML},querySelectorAll(){return []},querySelector(){return {insertAdjacentHTML(){}}}};
 const location={hash:'#multiplier'};
 const sandbox={
  location,window:{brandOsBoardCloud:{workspaceId:()=>null}},
  state:{multiplier:{drafts:[],sourceIds:[]}},brandOsJob:null,
  esc:value=>String(value),toast(){},
  multiplierPage(v){v.innerHTML='<main>Current plan</main>'},
  contentBoardPage(v){v.innerHTML='<main>Board columns</main>'}
 };
 sandbox.render=()=>sandbox.multiplierPage(view);
 vm.createContext(sandbox);
 vm.runInContext(readFileSync(new URL('../assets/multiplier-library.js',import.meta.url),'utf8'),sandbox);

 sandbox.multiplierPage(view);
 assert.match(view.innerHTML,/Content Board<\/button>/);
 assert.match(view.innerHTML,/Current plan<\/main>/);

 vm.runInContext("mlTab('board')",sandbox);
 assert.match(view.innerHTML,/class="active" onclick="mlTab\('board'\)"/);
 assert.match(view.innerHTML,/Board columns<\/main>/);
 assert.equal(location.hash,'#multiplier');

 location.hash='#content-board';
 sandbox.contentBoardPage(view);
 assert.match(view.innerHTML,/Board columns<\/main>/);
 assert.match(view.innerHTML,/Content Multiplier sections/);
 vm.runInContext("mlTab('plan')",sandbox);
 assert.equal(location.hash,'multiplier');
 assert.match(view.innerHTML,/Current plan<\/main>/);
});
