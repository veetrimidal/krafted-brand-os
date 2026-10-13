import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../assets/theme-options.js', import.meta.url), 'utf8');

function setup() {
  const saved = new Map();
  const elements = new Map();
  const downloads = [];
  function element(tag) {
    return {
      tag,
      children: [],
      attributes: {},
      listeners: {},
      append(...children) { this.children.push(...children); },
      prepend(...children) { this.children.unshift(...children); children.forEach(child => { if (child.id) elements.set(child.id, child); }); },
      remove() {},
      setAttribute(key, value) { this.attributes[key] = value; },
      addEventListener(key, listener) { this.listeners[key] = listener; },
      click() { if (tag === 'a') downloads.push({ name: this.download, url: this.href }); }
    };
  }
  const hero = element('div');
  const pill = element('span');
  hero.querySelector = selector => selector === '.pill.ok' ? pill : null;
  const view = { querySelector: selector => selector === '.hero' ? hero : null };
  const userbox = element('div');
  const drawing = {
    beginPath() {}, roundRect() {}, fill() {}, stroke() {}, fillRect() {},
    fillText() {}, save() {}, clip() {}, drawImage() {}, restore() {},
    measureText(text) { return { width: text.length * 12 }; }
  };
  const canvas = { getContext: () => drawing, toBlob: callback => callback(new Blob(['png'], { type: 'image/png' })) };
  const document = {
    documentElement: { dataset: {} },
    body: { append() {} },
    createElement: tag => tag === 'canvas' ? canvas : element(tag),
    getElementById: id => elements.get(id),
    querySelector: selector => selector === '.top .userbox' ? userbox : null
  };
  const keys = ['sage', 'lover', 'creator', 'innocent', 'explorer', 'outlaw', 'magician', 'hero', 'jester', 'everyman', 'caregiver', 'ruler'];
  const ARCHETYPES = Object.fromEntries(keys.map(key => [key, {
    name: key[0].toUpperCase() + key.slice(1), essence: 'A clear brand promise',
    voice: 'Clear', visual: 'Expressive', content: 'Helpful', traits: ['Thoughtful']
  }]));
  const ARCHETYPE_DEEP_GUIDANCE = Object.fromEntries(keys.map(key => [key, { drive: 'Lead with a thoughtful point of view.', watch: 'Avoid vague promises.' }]));
  const context = {
    document, Blob,
    localStorage: { getItem: key => saved.get(key), setItem: (key, value) => saved.set(key, value) },
    state: { session: false, archetype: { status: 'complete' }, brand: { name: 'Test Brand' } },
    location: { hash: '#archetype' },
    archetypeResultPage() {},
    archetypeProfile: () => ({ primary: 'sage', secondary: 'lover', tertiary: 'creator', anti: 'outlaw', ranked: keys, scores: { sage: 8, lover: 5, creator: 3 } }),
    archetypeSynthesis: () => ({ crossName: 'Sage × Lover', cross: 'Lead with clarity and warmth.', application: 'Use both voices consistently.', anti: 'Avoid provocation without purpose.' }),
    archetypePossible: () => 20,
    ARCHETYPES, ARCHETYPE_DEEP_GUIDANCE, ARCHETYPE_PORTRAITS: {},
    URL: { createObjectURL: () => 'blob:archetype', revokeObjectURL() {} },
    setTimeout() {}, toast() {}, render() {}
  };
  runInNewContext(source, context);
  return { context, saved, hero, view, downloads };
}

test('light and dark toggle updates the visible control and persists on this device', () => {
  const { context, saved } = setup();
  const button = context.document.getElementById('brandOsThemeSwitch');
  assert.equal(context.document.documentElement.dataset.theme, 'dark');
  assert.match(button.attributes['aria-label'], /light mode/);
  button.listeners.click();
  assert.equal(context.document.documentElement.dataset.theme, 'light');
  assert.equal(saved.get('krafted_brand_os_theme'), 'light');
  assert.match(button.attributes['aria-label'], /dark mode/);
});

test('completed result offers a PNG download containing the ranked profile', async () => {
  const { context, view, hero, downloads } = setup();
  context.archetypeResultPage(view);
  const actions = hero.children[0];
  const button = actions.children[1];
  assert.match(button.textContent, /Download result \(PNG\)/);
  await context.downloadArchetypeResult(button);
  assert.equal(downloads.length, 1);
  assert.equal(downloads[0].name, 'test-brand-archetype-result.png');
  assert.equal(button.disabled, false);
});
