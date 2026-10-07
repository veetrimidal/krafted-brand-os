import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { existsSync, readFileSync } from 'node:fs';

const source = readFileSync('assets/archetype-portraits.js', 'utf8');
const archetypes = ['innocent', 'sage', 'explorer', 'outlaw', 'magician', 'hero', 'lover', 'jester', 'everyman', 'caregiver', 'ruler', 'creator'];

test('every archetype portrait maps to a bundled image and accessible description', () => {
  const context = { state: { session: false }, archetypeResultPage() {}, archetypeProfile() {}, document: {} };
  vm.createContext(context);
  vm.runInContext(source, context);
  const portraits = vm.runInContext('ARCHETYPE_PORTRAITS', context);
  assert.deepEqual(Object.keys(portraits), archetypes);
  for (const [key, portrait] of Object.entries(portraits)) {
    assert.ok(existsSync(portrait.src), `${key} image is bundled`);
    assert.ok(portrait.alt.length > 10, `${key} image has descriptive alt text`);
  }
});

test('primary, secondary, and tertiary result cards show their matching portraits', () => {
  let baseRendered = false;
  const images = [];
  const cards = Array.from({ length: 3 }, () => {
    const card = { image: null, iconRemoved: false };
    card.querySelector = selector => selector === '.kicker'
      ? { insertAdjacentElement(_position, image) { card.image = image; } }
      : { remove() { card.iconRemoved = true; } };
    return card;
  });
  const context = {
    state: { session: false },
    archetypeProfile: () => ({ primary: 'sage', secondary: 'lover', tertiary: 'creator' }),
    archetypeResultPage() { baseRendered = true; },
    document: { createElement(tag) { assert.equal(tag, 'img'); const image = {}; images.push(image); return image; } }
  };
  vm.createContext(context);
  vm.runInContext(source, context);
  context.archetypeResultPage({ querySelectorAll: () => cards });
  assert.equal(baseRendered, true);
  assert.deepEqual(images.map(image => image.src), [
    'assets/archetypes/sage.png',
    'assets/archetypes/lover.png',
    'assets/archetypes/creator.png'
  ]);
  assert.ok(cards.every((card, index) => card.image === images[index] && card.iconRemoved));
});
