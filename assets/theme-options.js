/* Appearance is a device preference, separate from cloud-saved brand data. */
const BRAND_OS_THEME_KEY = 'krafted_brand_os_theme';
function readBrandOsTheme() {
  try { return localStorage.getItem(BRAND_OS_THEME_KEY) === 'light' ? 'light' : 'dark'; }
  catch { return 'dark'; }
}
function setBrandOsTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem(BRAND_OS_THEME_KEY, theme); } catch {}
  const button = document.getElementById('brandOsThemeSwitch');
  if (button) {
    const next = theme === 'dark' ? 'light' : 'dark';
    button.innerHTML = `<span class="theme-switch-icon" aria-hidden="true">${next === 'light' ? '☼' : '☾'}</span><span class="theme-switch-label">${next === 'light' ? 'Light mode' : 'Dark mode'}</span>`;
    button.setAttribute('aria-label', `Switch to ${next} mode`);
    button.setAttribute('title', `Switch to ${next} mode`);
    button.setAttribute('aria-pressed', String(theme === 'dark'));
  }
}
const themeSwitch = document.createElement('button');
themeSwitch.id = 'brandOsThemeSwitch';
themeSwitch.className = 'theme-switch';
themeSwitch.type = 'button';
themeSwitch.addEventListener('click', () => setBrandOsTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
document.querySelector('.top .userbox')?.prepend(themeSwitch);
setBrandOsTheme(readBrandOsTheme());

const archetypeResultBeforeDownload = archetypeResultPage;
archetypeResultPage = function (view) {
  archetypeResultBeforeDownload(view);
  const hero = view.querySelector('.hero');
  if (!hero) return;
  const actions = document.createElement('div');
  actions.className = 'archetype-result-actions';
  const complete = hero.querySelector('.pill.ok');
  if (complete) actions.append(complete);
  const button = document.createElement('button');
  button.className = 'btn orange archetype-download';
  button.type = 'button';
  button.textContent = '↓ Download result (PNG)';
  button.setAttribute('aria-label', 'Download your Brand Archetype result as a PNG image');
  button.addEventListener('click', () => downloadArchetypeResult(button));
  actions.append(button);
  hero.append(actions);
};

function roundedPanel(ctx, x, y, width, height, fill, stroke = '#3c472f') {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 24);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.stroke();
}
function wrappedLines(ctx, text, width) {
  const words = String(text ?? '').trim().split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > width) { lines.push(line); line = word; }
    else line = next;
  }
  if (line) lines.push(line);
  return lines;
}
function drawWrapped(ctx, text, x, y, width, lineHeight, maxLines = Infinity) {
  const lines = wrappedLines(ctx, text, width).slice(0, maxLines);
  for (const line of lines) { ctx.fillText(line, x, y); y += lineHeight; }
  return y;
}
function drawLabel(ctx, text, x, y) {
  ctx.fillStyle = '#c9f52c';
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.fillText(text.toUpperCase(), x, y);
}
function loadArchetypePortrait(key) {
  const source = typeof ARCHETYPE_PORTRAITS !== 'undefined' && ARCHETYPE_PORTRAITS[key]?.src;
  if (!source) return Promise.resolve(null);
  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = source;
  });
}
function drawArchetypeReport(ctx, profile, portrait) {
  const { primary, secondary, tertiary, anti, scores, ranked } = profile;
  const synthesis = archetypeSynthesis(profile);
  const roles = [['PRIMARY', primary], ['SECONDARY', secondary], ['TERTIARY', tertiary]];
  const brandName = state.brand.name?.trim() || 'My Brand';

  ctx.fillStyle = '#111711';
  ctx.fillRect(0, 0, 1400, 3340);
  ctx.fillStyle = '#c9f52c';
  ctx.fillRect(0, 0, 1400, 14);
  drawLabel(ctx, 'KRAFTED BRAND OS · PSYCHOLOGY PROFILE', 76, 88);
  ctx.fillStyle = '#f5eee8';
  ctx.font = 'bold 77px Arial, sans-serif';
  ctx.fillText('Your Brand Archetype', 76, 182);
  ctx.fillStyle = '#b9c3b2';
  ctx.font = '30px Arial, sans-serif';
  drawWrapped(ctx, `${brandName} · Primary, secondary, and tertiary direction from your assessment.`, 78, 234, 1220, 42, 2);

  roles.forEach(([label, key], index) => {
    const x = 76 + index * 422;
    roundedPanel(ctx, x, 312, 400, 218, index === 0 ? '#293a22' : '#20291e', index === 0 ? '#a7d452' : '#48583a');
    drawLabel(ctx, label, x + 26, 355);
    ctx.fillStyle = '#f5eee8';
    ctx.font = 'bold 41px Arial, sans-serif';
    ctx.fillText(ARCHETYPES[key].name, x + 26, 420);
    ctx.fillStyle = '#b9c3b2';
    ctx.font = '25px Arial, sans-serif';
    drawWrapped(ctx, `${scores[key] || 0} / ${archetypePossible(key)} selections`, x + 26, 465, 348, 33, 2);
  });

  roundedPanel(ctx, 76, 568, 1248, 550, '#1e281d');
  drawLabel(ctx, 'THE PRIMARY EXPRESSION', 112, 622);
  ctx.fillStyle = '#f5eee8';
  ctx.font = 'bold 60px Arial, sans-serif';
  ctx.fillText(ARCHETYPES[primary].name, 112, 700);
  ctx.fillStyle = '#d9e3d2';
  ctx.font = '28px Arial, sans-serif';
  let y = drawWrapped(ctx, ARCHETYPES[primary].essence, 112, 762, 695, 40, 6) + 24;
  ctx.fillStyle = '#c9f52c';
  ctx.font = 'bold 25px Arial, sans-serif';
  ctx.fillText('DIRECTION', 112, y);
  ctx.fillStyle = '#d9e3d2';
  ctx.font = '26px Arial, sans-serif';
  drawWrapped(ctx, ARCHETYPE_DEEP_GUIDANCE[primary].drive, 112, y + 46, 695, 38, 5);
  if (portrait) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(887, 596, 406, 494, 18);
    ctx.clip();
    const scale = Math.max(406 / portrait.width, 494 / portrait.height);
    const width = portrait.width * scale, height = portrait.height * scale;
    ctx.drawImage(portrait, 887 + (406 - width) / 2, 596 + (494 - height) / 2, width, height);
    ctx.restore();
  }

  drawLabel(ctx, 'HOW TO EXPRESS YOUR MIX', 76, 1190);
  roles.forEach(([label, key], index) => {
    const top = 1220 + index * 296;
    const a = ARCHETYPES[key], g = ARCHETYPE_DEEP_GUIDANCE[key];
    roundedPanel(ctx, 76, top, 1248, 274, '#1b231b');
    drawLabel(ctx, `${label} · ${a.name}`, 110, top + 42);
    ctx.fillStyle = '#f5eee8';
    ctx.font = 'bold 29px Arial, sans-serif';
    drawWrapped(ctx, g.drive, 110, top + 90, 1160, 38, 2);
    ctx.fillStyle = '#b9c3b2';
    ctx.font = '22px Arial, sans-serif';
    drawWrapped(ctx, `Voice: ${a.voice}. Visual: ${a.visual}. Content: ${a.content}.`, 110, top + 156, 1160, 31, 2);
    ctx.fillStyle = '#e5be9f';
    drawWrapped(ctx, `Watch for: ${g.watch}`, 110, top + 229, 1160, 30, 2);
  });

  roundedPanel(ctx, 76, 2140, 1248, 290, '#243222');
  drawLabel(ctx, `CROSS-ARCHETYPE · ${synthesis.crossName}`, 110, 2185);
  ctx.fillStyle = '#f5eee8';
  ctx.font = '25px Arial, sans-serif';
  const afterCross = drawWrapped(ctx, synthesis.cross, 110, 2240, 1160, 37, 3);
  ctx.fillStyle = '#b9c3b2';
  ctx.font = '22px Arial, sans-serif';
  drawWrapped(ctx, synthesis.application, 110, afterCross + 12, 1160, 31, 2);

  roundedPanel(ctx, 76, 2450, 1248, 202, '#26251d');
  drawLabel(ctx, `ANTI-ARCHETYPE · ${ARCHETYPES[anti].name}`, 110, 2495);
  ctx.fillStyle = '#e6d4c6';
  ctx.font = '25px Arial, sans-serif';
  drawWrapped(ctx, synthesis.anti, 110, 2552, 1160, 37, 3);

  drawLabel(ctx, 'FULL SCORE RANKING', 76, 2682);
  ranked.forEach((key, index) => {
    const col = index < 6 ? 0 : 1, row = index % 6;
    const x = 80 + col * 635, yy = 2735 + row * 73;
    ctx.fillStyle = index < 3 ? '#c9f52c' : '#b9c3b2';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.fillText(String(index + 1).padStart(2, '0'), x, yy);
    ctx.fillStyle = '#f5eee8';
    ctx.fillText(ARCHETYPES[key].name, x + 55, yy);
    ctx.fillStyle = '#b9c3b2';
    ctx.fillText(String(scores[key] || 0), x + 520, yy);
    ctx.fillStyle = '#36442e';
    ctx.fillRect(x, yy + 12, 560, 5);
    ctx.fillStyle = '#c9f52c';
    ctx.fillRect(x, yy + 12, Math.max(2, (scores[key] || 0) / Math.max(1, ...Object.values(scores)) * 560), 5);
  });
  ctx.fillStyle = '#aebba7';
  ctx.font = '22px Arial, sans-serif';
  ctx.fillText('Use this profile as strategic guidance, not a fixed identity.', 78, 3265);
  ctx.fillStyle = '#c9f52c';
  ctx.fillText('KRAFTED BRAND OS™', 1080, 3265);
}

async function downloadArchetypeResult(button) {
  if (state.archetype.status !== 'complete') return;
  button.disabled = true;
  button.textContent = 'Preparing image…';
  try {
    const profile = archetypeProfile();
    const portrait = await loadArchetypePortrait(profile.primary);
    const canvas = document.createElement('canvas');
    canvas.width = 1400;
    canvas.height = 3340;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is unavailable');
    drawArchetypeReport(ctx, profile, portrait);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('Image export failed');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const brand = (state.brand.name || 'brand').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'brand';
    link.href = url;
    link.download = `${brand}-archetype-result.png`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  } catch {
    toast('Could not download the result. Please try again.');
  } finally {
    button.disabled = false;
    button.textContent = '↓ Download result (PNG)';
  }
}

if (state.session && location.hash === '#archetype' && state.archetype.status === 'complete') render();
