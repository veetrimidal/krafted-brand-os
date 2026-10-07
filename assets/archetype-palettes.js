/* Archetype-led color suggestions. Saved manual colors remain the owner's choice. */
const ARCHETYPE_COLOR_SEEDS={
  innocent:['#547C7B','#B9D9CD','#E5C56D','#F8F7ED','#263D3B'],
  sage:['#294C55','#9CBEC1','#D1A363','#F5F2E9','#172E35'],
  explorer:['#2C6159','#B0B58B','#D88358','#F5F0E5','#203C38'],
  outlaw:['#402C39','#91635D','#E95F3A','#F4EDE6','#241C24'],
  magician:['#43335E','#8B82B6','#CFAE68','#F5F1F7','#28213D'],
  hero:['#234A62','#7DA9B2','#EE794B','#F5F3EC','#182E3B'],
  lover:['#693B50','#C58D91','#D9A65C','#FAF2EF','#3E2632'],
  jester:['#514165','#9BAA62','#F3914C','#FFF7EA','#2F263C'],
  everyman:['#465B50','#A6B5A1','#CD9B70','#F5F2EA','#293A32'],
  caregiver:['#426475','#A9C8C6','#D7A474','#F8F5EE','#263D47'],
  ruler:['#283D48','#8A9A91','#C5A36A','#F4F1E9','#192931'],
  creator:['#374B63','#92A7A7','#DB7955','#F7F3EB','#253345']
};
const ARCHETYPE_PALETTE_ROLES=['Primary','Secondary','Accent','Neutral','Ink'];
function paletteMix(a,b,weight){const read=x=>[1,3,5].map(i=>parseInt(x.slice(i,i+2),16));const first=read(a),second=read(b);return '#'+first.map((value,i)=>Math.round(value*(1-weight)+second[i]*weight).toString(16).padStart(2,'0')).join('').toUpperCase()}
function archetypePaletteOptions(){
  if(state.archetype.status!=='complete'||!ARCHETYPE_COLOR_SEEDS[state.archetype.primary])return [];
  const p=ARCHETYPE_COLOR_SEEDS[state.archetype.primary],s=ARCHETYPE_COLOR_SEEDS[state.archetype.secondary]||p,t=ARCHETYPE_COLOR_SEEDS[state.archetype.tertiary]||s;
  const make=(name,description,hexes)=>({name,description,colors:hexes.map((hex,i)=>({name:ARCHETYPE_PALETTE_ROLES[i],role:ARCHETYPE_PALETTE_ROLES[i],hex:hex.toUpperCase()}))});
  return [
    make('Signature','Primary archetype leads; supporting tones keep it balanced.',[p[0],paletteMix(p[1],s[1],.25),paletteMix(p[2],t[2],.2),p[3],p[4]]),
    make('Human blend','A warmer expression shaped by your secondary archetype.',[paletteMix(paletteMix(p[0],s[0],.3),'#9A5440',.12),s[1],paletteMix(p[2],s[2],.5),paletteMix(p[3],s[3],.35),p[4]]),
    make('Fresh perspective','A more distinctive accent from your tertiary archetype.',[p[0],paletteMix(s[1],t[1],.5),paletteMix(t[2],'#547C7B',.22),t[3],paletteMix(p[4],t[4],.3)]),
    make('Bold contrast','Deeper grounding with a clearer statement accent.',[paletteMix(p[0],p[4],.4),paletteMix(p[1],s[0],.22),paletteMix(p[2],t[2],.48),p[3],p[4]]),
    make('Soft editorial','A quieter palette for refined, spacious applications.',[paletteMix(p[0],p[1],.28),paletteMix(p[1],s[1],.55),paletteMix(p[2],s[1],.3),paletteMix(p[3],s[3],.4),paletteMix(p[4],p[0],.2)])
  ];
}
function effectiveBrandPalette(){
  const assets=assetStore(),options=archetypePaletteOptions();
  if(assets.paletteMode==='manual'&&assets.colors.length)return {colors:assets.colors,source:'manual',name:'Manual palette'};
  if(options.length&&(assets.paletteMode==='suggested'||!assets.colors.length)){
    const index=Number.isInteger(assets.paletteIndex)&&assets.paletteIndex>=0&&assets.paletteIndex<5?assets.paletteIndex:0;
    return {colors:options[index].colors,source:'archetype',name:options[index].name,index};
  }
  if(assets.colors.length)return {colors:assets.colors,source:'manual',name:'Manual palette'};
  return {colors:[],source:'none',name:'No palette yet'};
}
function selectArchetypePalette(index){
  const options=archetypePaletteOptions();if(!Number.isInteger(index)||!options[index])return;
  const assets=assetStore();assets.paletteMode='suggested';assets.paletteIndex=index;assets.updatedAt='';save();render();toast(`${options[index].name} palette applied to Brand Guidelines`);
}
function useManualBrandPalette(){const assets=assetStore();if(!assets.colors.length){toast('Add a manual color in Assets first.');return}assets.paletteMode='manual';assets.updatedAt='';save();render();toast('Manual colors applied to Brand Guidelines')}
function useArchetypePalette(){if(!archetypePaletteOptions().length){toast('Complete the Brand Archetype quiz first.');return}const assets=assetStore();assets.paletteMode='suggested';assets.paletteIndex=0;assets.updatedAt='';save();render()}
function paletteSuggestionMarkup(){
  const options=archetypePaletteOptions();if(!options.length)return '';
  const active=effectiveBrandPalette(),primary=ARCHETYPES[state.archetype.primary].name,secondary=ARCHETYPES[state.archetype.secondary]?.name||primary,tertiary=ARCHETYPES[state.archetype.tertiary]?.name||secondary;
  return `<section class="card archetype-palette-section"><div class="kicker">Color direction · based on your results</div><h2>Five palettes for your archetype mix</h2><p class="muted">Built from ${esc(primary)} with ${esc(secondary)} and ${esc(tertiary)} influences. These are starting points—review brand fit and contrast before production. Your saved manual colors are never erased.</p><div class="archetype-palette-grid">${options.map((option,index)=>`<button type="button" class="archetype-palette-option ${active.source==='archetype'&&active.index===index?'selected':''}" aria-pressed="${active.source==='archetype'&&active.index===index}" onclick="selectArchetypePalette(${index})"><span class="archetype-palette-bars">${option.colors.map(c=>`<i style="background:${c.hex}" title="${esc(c.role)} ${c.hex}"></i>`).join('')}</span><strong>${esc(option.name)}</strong><small>${esc(option.description)}</small><span class="archetype-palette-action">${active.source==='archetype'&&active.index===index?'Using in Guidelines':'Use this palette →'}</span></button>`).join('')}</div>${active.source==='manual'?'<p class="muted archetype-palette-note">Manual colors are currently active in Brand Guidelines. Choose a suggestion to switch; your manual colors stay saved.</p>':''}</section>`;
}
const archetypeResultWithPalettes=archetypeResultPage;
archetypeResultPage=function(v){archetypeResultWithPalettes(v);const anchor=v.querySelector('.archetype-top-three');if(anchor)anchor.insertAdjacentHTML('afterend',paletteSuggestionMarkup());else v.insertAdjacentHTML('beforeend',paletteSuggestionMarkup())};
const assetsPageWithPalettes=assetsPage;
assetsPage=function(v){assetsPageWithPalettes(v);const palette=effectiveBrandPalette(),options=archetypePaletteOptions();if(!options.length)return;const manual=assetStore().colors.length;v.insertAdjacentHTML('beforeend',`<section class="card archetype-asset-palette"><div class="row"><div><div class="kicker">Guidelines color source</div><h2 style="margin:5px 0">${esc(palette.source==='archetype'?palette.name:'Your manual palette')}</h2><p class="muted" style="margin:0">${palette.source==='archetype'?'The selected archetype palette automatically fills the Guidelines color system.':'Your saved Assets colors currently fill the Guidelines color system.'}</p></div><div class="archetype-palette-controls"><button class="btn secondary" onclick="location.hash='archetype'">See 5 suggestions</button>${manual?`<button class="btn ${palette.source==='manual'?'orange':'secondary'}" onclick="useManualBrandPalette()">Use manual colors</button>`:''}<button class="btn ${palette.source==='archetype'?'orange':'secondary'}" onclick="useArchetypePalette()">Use archetype default</button></div></div></section>`)};
const addColorWithPaletteMode=addColor;
addColor=function(){const hex=document.getElementById('assetColorHex')?.value.trim();if(/^#[0-9a-f]{6}$/i.test(hex||''))assetStore().paletteMode='manual';return addColorWithPaletteMode()};
const guidelineDataWithPalette=guidelineData;
guidelineData=function(){const data=guidelineDataWithPalette(),palette=effectiveBrandPalette();if(palette.colors.length){const row=data.visual?.find(item=>item[0]==='Colors');if(row){row[1]=palette.colors.map(c=>`${c.role} · ${c.name||c.hex} (${c.hex})`).join(' · ');row[2]=palette.source==='manual'}}return data};
const guidelineSourceWithPalette=guidelineSource;
guidelineSource=function(){const source=JSON.parse(guidelineSourceWithPalette()),palette=effectiveBrandPalette();source.colors=palette.colors;source.paletteSource=palette.source;source.paletteName=palette.name;return JSON.stringify(source)};
const guidelineSourceFieldsWithPalette=guidelineSourceFields;
guidelineSourceFields=function(){const fields=guidelineSourceFieldsWithPalette(),palette=effectiveBrandPalette();fields.assets.colors=palette.colors.map(c=>`${c.role}:${c.hex}`).join('|');fields.assets.palette=palette.source+':'+palette.name;fields.archetype.tertiary=state.archetype.tertiary||'';return fields};
GUIDELINE_DEPENDENCIES['assets.palette']=['visual','applications'];
GUIDELINE_DEPENDENCIES['archetype.secondary']=['personality','verbal','visual'];
GUIDELINE_DEPENDENCIES['archetype.tertiary']=['personality','visual'];
function guidelinePaletteSwatches(colors){return colors.map(c=>`<div class="book-swatch" style="background:${c.hex};color:${guideTextColor(c.hex)}"><b>${esc(c.name||c.hex)}</b><span>${esc(c.role)} · ${c.hex}</span></div>`).join('')}
const guidelineBookWithPalette=guidelineBookPages;
guidelineBookPages=function(){
  const pages=guidelineBookWithPalette(),palette=effectiveBrandPalette(),colors=palette.colors;
  if(!colors.length)return pages;
  const visual=pages.find(p=>p.title==='Visual direction');
  if(visual){const start=visual.html.indexOf('<div class="book-swatches">'),end=visual.html.lastIndexOf('</div></div>');if(start>=0&&end>start)visual.html=visual.html.slice(0,start)+`<div class="book-swatches">${guidelinePaletteSwatches(colors)}</div></div>`}
  for(const page of pages.filter(p=>p.title==='Cover'||p.title==='North Star'))page.html=page.html.replace(/--book-accent:#[0-9a-f]{6}/i,`--book-accent:${(colors.find(c=>c.role==='Accent')||colors[0]).hex}`);
  const index=pages.findIndex(p=>p.title==='Visual direction');
  const note=palette.source==='archetype'?`Suggested from your ${esc(ARCHETYPES[state.archetype.primary].name)} / ${esc(ARCHETYPES[state.archetype.secondary]?.name||'')} / ${esc(ARCHETYPES[state.archetype.tertiary]?.name||'')} archetype mix · ${esc(palette.name)}. Review and approve for production.`:'Selected manually in Assets. Keep application and contrast consistent.';
  const page={title:'Color palette',html:`<div class="book-page brand-color-page"><div class="book-overline">Visual identity · color palette</div><h1>Color with purpose.</h1><p class="logo-method-intro">${note}</p><div class="brand-color-grid">${colors.map(c=>`<div class="brand-color-tile"><div class="brand-color-sample" style="background:${c.hex};color:${guideTextColor(c.hex)}">${esc(c.role)}</div><b>${esc(c.name||c.role)}</b><span>${c.hex}</span></div>`).join('')}</div><div class="book-callout">Use the primary color to anchor recognition, secondary to support hierarchy, accent for emphasis, neutral for breathing room, and ink for readable type. Check contrast in each real application.</div></div>`};
  const existing=pages.findIndex(p=>p.title==='Color palette');if(existing>=0)pages[existing]=page;else pages.splice(index>=0?index+1:pages.length,0,page);
  return pages;
};
if(state.session)render();
