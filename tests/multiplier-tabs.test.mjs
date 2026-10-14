import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

test('Content Multiplier sections live in the sidebar and old Content Board links still work',()=>{
 const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 for(const tab of ['plan','history','sources','board'])assert.match(index,new RegExp(`data-multiplier-tab="${tab}"`));
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
 assert.doesNotMatch(view.innerHTML,/Content Multiplier sections/);
 assert.match(view.innerHTML,/Current plan<\/main>/);

 location.hash='#overview';
 vm.runInContext("mlTab('history')",sandbox);
 assert.equal(location.hash,'multiplier');
 assert.match(view.innerHTML,/Multiplication history\./);

 vm.runInContext("mlTab('board')",sandbox);
 assert.match(view.innerHTML,/Board columns<\/main>/);
 assert.doesNotMatch(view.innerHTML,/Content Multiplier sections/);

 location.hash='#content-board';
 sandbox.contentBoardPage(view);
 assert.match(view.innerHTML,/Board columns<\/main>/);
 vm.runInContext("mlTab('plan')",sandbox);
 assert.equal(location.hash,'multiplier');
 assert.match(view.innerHTML,/Current plan<\/main>/);
});
