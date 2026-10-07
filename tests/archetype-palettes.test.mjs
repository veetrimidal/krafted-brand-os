import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

function harness(){
  const state={session:false,archetype:{status:'complete',primary:'sage',secondary:'lover',tertiary:'creator'},assets:{colors:[],items:[]}};
  const archetypes=Object.fromEntries(['sage','lover','creator'].map(key=>[key,{name:key}]));
  const context={state,ARCHETYPES:archetypes,GUIDELINE_DEPENDENCIES:{},assetStore:()=>state.assets,archetypeResultPage(){},assetsPage(){},addColor(){},guidelineData:()=>({visual:[['Colors','',false]]}),guidelineSource:()=>JSON.stringify({colors:[]}),guidelineSourceFields:()=>({assets:{colors:''},archetype:{}}),guidelineBookPages:()=>[{title:'Cover',html:'<div style="--book-accent:#c9f52c"></div>'},{title:'Visual direction',html:'<div class="book-page"><div class="book-swatches">old</div></div>'}],guideTextColor:()=> '#fff',document:{getElementById:()=>({value:'#112233'})},save(){},render(){},toast(){},esc:String};
  vm.createContext(context);
  vm.runInContext(readFileSync('assets/archetype-palettes.js','utf8'),context);
  return context;
}

test('completed archetype produces five distinct, valid five-color suggestions',()=>{
  const context=harness(),options=vm.runInContext('archetypePaletteOptions()',context);
  assert.equal(options.length,5);
  assert.equal(new Set(options.map(option=>option.colors.map(c=>c.hex).join(','))).size,5);
  for(const option of options){assert.deepEqual(Array.from(option.colors,c=>c.role),['Primary','Secondary','Accent','Neutral','Ink']);for(const color of option.colors)assert.match(color.hex,/^#[0-9A-F]{6}$/)}
});

test('chosen archetype palette updates guideline colors without deleting manual colors',()=>{
  const context=harness(),manual=[{hex:'#112233',name:'Saved',role:'Primary'}];context.state.assets.colors=manual;
  assert.equal(context.effectiveBrandPalette().source,'manual');
  context.selectArchetypePalette(2);
  assert.equal(context.state.assets.colors,manual);
  assert.equal(context.effectiveBrandPalette().name,'Fresh perspective');
  assert.equal(context.guidelineData().visual[0][1].includes('Accent'),true);
  const pages=context.guidelineBookPages();
  assert.equal(pages.find(page=>page.title==='Color palette')?.html.includes('Fresh perspective'),true);
  assert.equal(pages.find(page=>page.title==='Visual direction')?.html.includes('old'),false);
  context.useManualBrandPalette();
  assert.equal(context.effectiveBrandPalette().colors,manual);
});

test('first palette applies automatically only when no manual colors exist',()=>{
  const context=harness();assert.equal(context.effectiveBrandPalette().name,'Signature');
  context.state.assets.colors=[{hex:'#123456',role:'Primary'}];assert.equal(context.effectiveBrandPalette().source,'manual');
  context.state.archetype.status='not_started';assert.equal(context.effectiveBrandPalette().source,'manual');
});

test('all twelve archetypes retain five distinct options even without secondary influences',()=>{const context=harness();for(const key of vm.runInContext('Object.keys(ARCHETYPE_COLOR_SEEDS)',context)){context.state.archetype={status:'complete',primary:key,secondary:key,tertiary:key};const options=context.archetypePaletteOptions();assert.equal(new Set(options.map(o=>o.colors.map(c=>c.hex).join(','))).size,5,key)}});
test('automatic palette follows a changed quiz result and selected option survives saving',()=>{const context=harness();context.selectArchetypePalette(3);const before=JSON.stringify(context.effectiveBrandPalette().colors);context.state.archetype.primary='lover';assert.notEqual(JSON.stringify(context.effectiveBrandPalette().colors),before);assert.equal(context.effectiveBrandPalette().index,3);assert.equal(context.state.assets.paletteMode,'suggested')});
