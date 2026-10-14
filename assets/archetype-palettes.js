/* Curated from the supplied archetype color references. Saved manual colors remain the owner's choice.
   Each option is Primary, Secondary, Accent, Neutral, Ink. Values without printed hex labels
   are visually matched to the supplied image, so they are a direction rather than a source file. */
const ARCHETYPE_COLOR_REFERENCES={
  innocent:[
    ['#FDF2F1','#C6CBDF','#F5926C','#F0E09E','#515460'],
    ['#C9D3DE','#E69FA3','#F5B14B','#F9F0EC','#A3492E'],
    ['#397D19','#A88B73','#C48923','#FFFFFF','#5D6568'],
    ['#B5BEB0','#B9AB9F','#EADCD5','#E5E6DD','#5D6568'],
    ['#F5B14B','#F9E0A6','#F5926C','#E6D9D1','#515460']
  ],
  sage:[
    ['#557355','#B6C8B2','#AB783D','#D7D5CA','#0D2B43'],
    ['#44625B','#AFAD93','#D7D5CA','#F1E9E0','#0B211E'],
    ['#819847','#9DB4C4','#FFEDCA','#F1E9E0','#432220'],
    ['#2A5261','#8AA38E','#7F9261','#D9E4E8','#0C2635'],
    ['#553D1E','#98BEDF','#AB783D','#FFEDCA','#0D2B43']
  ],
  explorer:[
    ['#5B714E','#7E6192','#DC6F3A','#E8B867','#3A6F9D'],
    ['#9DBB4C','#E8B867','#FC7F24','#7C5072','#4B3658'],
    ['#8C7D3E','#3F3518','#E8A740','#F5F0E5','#5E1E17'],
    ['#5E7C21','#4073CF','#483D4B','#E8B867','#394A24'],
    ['#139217','#911393','#FA0D1B','#E8B867','#031092']
  ],
  outlaw:[
    ['#F38323','#F3401F','#F90D1B','#ECECEC','#000000'],
    ['#DE3338','#F16E5A','#363538','#ECECEC','#191A1D'],
    ['#E0173B','#4C0E5F','#8C8E8D','#FFFFFF','#000000'],
    ['#9F2CD4','#E526F2','#D2CED7','#ECECEC','#000000'],
    ['#C30913','#FC7F24','#FA0D1B','#ECECEC','#010101']
  ],
  magician:[
    ['#800080','#EE82EE','#F08080','#FCC996','#570953'],
    ['#61448B','#8879B7','#9D5B7F','#F5F1F7','#583163'],
    ['#124657','#8879B7','#D7076D','#F5F1F7','#570953'],
    ['#8C3CEA','#2AF875','#D4FB4E','#F5F1F7','#0A0A0A'],
    ['#931290','#9497FB','#FC28F9','#FD9496','#583163']
  ],
  hero:[
    ['#182B54','#AAC2CE','#C54036','#DCE1E3','#2B2F42'],
    ['#0E6A8C','#031F4D','#EF3525','#DCE1E3','#2B2F42'],
    ['#0190DE','#AAC2CE','#93080B','#DCE1E3','#303437'],
    ['#002F45','#17EEFF','#B00800','#F1F4F4','#851100'],
    ['#C90813','#031F4D','#FA0C1B','#DCE1E3','#000000']
  ],
  lover:[
    ['#F6969C','#FF9FCA','#FC2B30','#91FFD5','#4B2E7E'],
    ['#B20B37','#D91A63','#EC5AD3','#FFFFFF','#4B2E7E'],
    ['#B78FB0','#EBC1D4','#EC5AD3','#B1FFB4','#693B50'],
    ['#7D9D75','#FFB6CD','#FA6A9E','#FEE8EB','#4B2E7E'],
    ['#FD9495','#FD96FB','#FA0D1B','#97FE99','#693B50']
  ],
  jester:[
    ['#48BDBD','#EA7DAD','#FA641F','#FFF7F1','#5A5724'],
    ['#3593A8','#CAE9E8','#F4CF4E','#ECEAE4','#5A5724'],
    ['#FF160C','#FF4942','#FFC900','#FFF7F1','#5A5724'],
    ['#7B2794','#F456D4','#FF8000','#FFF7F1','#2F263C'],
    ['#0A94E8','#F500A7','#8FFC00','#FFF7F1','#2F263C']
  ],
  everyman:[
    ['#9D271D','#CB6614','#FFFFFF','#EFECE4','#39435E'],
    ['#B5662A','#929292','#5F4945','#EFECE4','#000000'],
    ['#40352F','#A9CADD','#FAAF1A','#EFECE4','#39435E'],
    ['#343399','#89CDFF','#CA0813','#FFCC00','#041096'],
    ['#924A11','#9497FA','#CA0813','#FFFFFF','#041096']
  ],
  caregiver:[
    ['#436CA5','#CADEE1','#D5AE36','#D4BBAF','#263D47'],
    ['#C3D3C9','#E7E3F1','#D2C43D','#FCC996','#436CA5'],
    ['#6DDBEF','#A7F6ED','#F1AACD','#F6D0DB','#436CA5'],
    ['#9A7AD1','#AABEE2','#B7B780','#DCE8E1','#436CA5'],
    ['#9497FA','#98FE99','#FD97FB','#FEFE9D','#436CA5']
  ],
  ruler:[
    ['#1E3C47','#3D757E','#7A0E14','#B8B8B6','#090F15'],
    ['#3B549E','#1A2A57','#F90D1B','#B8B8B6','#000000'],
    ['#34295D','#744877','#70B858','#C2D99E','#090F15'],
    ['#022045','#44552B','#7A0E2E','#F1FCFF','#090F15'],
    ['#041090','#0B23F6','#C30913','#B8B8B6','#010101']
  ],
  creator:[
    ['#A77AB4','#D1CADE','#EB5F28','#FBF8EC','#382F2B'],
    ['#D5DF35','#D1CADE','#EB5F28','#FBF8EC','#382F2B'],
    ['#074BFF','#00E6EA','#F000E8','#CCFF00','#000000'],
    ['#7A00EF','#F35286','#FF9B00','#FBF8EC','#382F2B'],
    ['#00D36B','#F6E000','#F000E8','#FBF8EC','#000000']
  ]
};
const ARCHETYPE_PALETTE_ROLES=['Primary','Secondary','Accent','Neutral','Ink'];
function archetypePaletteOptions(){
  const palettes=ARCHETYPE_COLOR_REFERENCES[state.archetype.primary];
  if(state.archetype.status!=='complete'||!palettes)return [];
  const make=(name,description,hexes)=>({name,description,colors:hexes.map((hex,i)=>({name:ARCHETYPE_PALETTE_ROLES[i],role:ARCHETYPE_PALETTE_ROLES[i],hex:hex.toUpperCase()}))});
  const names=['Signature','Human blend','Fresh perspective','Bold contrast','Soft editorial'];
  const descriptions=['The core expression from your archetype references.','A warmer or more approachable color direction.','An alternate balance of the supplied colors.','A higher-energy direction with stronger contrast.','A quieter or more spacious interpretation.'];
  return palettes.map((hexes,index)=>make(names[index],descriptions[index],hexes));
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
  return `<section class="card archetype-palette-section"><div class="kicker">Color direction · based on your results</div><h2>Five palettes for ${esc(primary)}</h2><p class="muted">Curated from the supplied ${esc(primary)} color references. Your ${esc(secondary)} and ${esc(tertiary)} results can help you choose the tone that fits best. Review brand fit and contrast before production; saved manual colors are never erased.</p><div class="archetype-palette-grid">${options.map((option,index)=>`<button type="button" class="archetype-palette-option ${active.source==='archetype'&&active.index===index?'selected':''}" aria-pressed="${active.source==='archetype'&&active.index===index}" onclick="selectArchetypePalette(${index})"><span class="archetype-palette-bars">${option.colors.map(c=>`<i style="background:${c.hex}" title="${esc(c.role)} ${c.hex}"></i>`).join('')}</span><strong>${esc(option.name)}</strong><small>${esc(option.description)}</small><span class="archetype-palette-action">${active.source==='archetype'&&active.index===index?'Using in Guidelines':'Use this palette →'}</span></button>`).join('')}</div>${active.source==='manual'?'<p class="muted archetype-palette-note">Manual colors are currently active in Brand Guidelines. Choose a suggestion to switch; your manual colors stay saved.</p>':''}</section>`;
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
  const note=palette.source==='archetype'?`Curated from the supplied ${esc(ARCHETYPES[state.archetype.primary].name)} color references · ${esc(palette.name)}. Review and approve for production.`:'Selected manually in Assets. Keep application and contrast consistent.';
  const page={title:'Color palette',html:`<div class="book-page brand-color-page"><div class="book-overline">Visual identity · color palette</div><h1>Color with purpose.</h1><p class="logo-method-intro">${note}</p><div class="brand-color-grid">${colors.map(c=>`<div class="brand-color-tile"><div class="brand-color-sample" style="background:${c.hex};color:${guideTextColor(c.hex)}">${esc(c.role)}</div><b>${esc(c.name||c.role)}</b><span>${c.hex}</span></div>`).join('')}</div><div class="book-callout">Use the primary color to anchor recognition, secondary to support hierarchy, accent for emphasis, neutral for breathing room, and ink for readable type. Check contrast in each real application.</div></div>`};
  const existing=pages.findIndex(p=>p.title==='Color palette');if(existing>=0)pages[existing]=page;else pages.splice(index>=0?index+1:pages.length,0,page);
  return pages;
};
if(state.session)render();
