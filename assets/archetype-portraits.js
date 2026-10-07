/* Portraits supplied for the twelve Brand Archetype results. */
const ARCHETYPE_PORTRAITS = {
  innocent: { src: 'assets/archetypes/innocent.png', alt: 'Hopeful woman holding a white daisy' },
  sage: { src: 'assets/archetypes/sage.png', alt: 'Wise Sage holding an antique book' },
  explorer: { src: 'assets/archetypes/explorer.png', alt: 'Explorer holding a brass compass' },
  outlaw: { src: 'assets/archetypes/outlaw.png', alt: 'Rebel holding a broken chain' },
  magician: { src: 'assets/archetypes/magician.png', alt: 'Magician holding a glowing crystal orb' },
  hero: { src: 'assets/archetypes/hero.png', alt: 'Hero carrying a round shield' },
  lover: { src: 'assets/archetypes/lover.png', alt: 'Lover holding a deep red rose' },
  jester: { src: 'assets/archetypes/jester.png', alt: 'Jester holding a playful mask' },
  everyman: { src: 'assets/archetypes/everyman.png', alt: 'Everyman smiling with a coffee mug' },
  caregiver: { src: 'assets/archetypes/caregiver.png', alt: 'Caregiver holding a first aid kit' },
  ruler: { src: 'assets/archetypes/ruler.png', alt: 'Crowned Ruler holding a scepter' },
  creator: { src: 'assets/archetypes/creator.png', alt: 'Creator holding paintbrushes and a palette' }
};

const archetypeResultWithoutPortraits = archetypeResultPage;
archetypeResultPage = function (view) {
  archetypeResultWithoutPortraits(view);
  const { primary, secondary, tertiary } = archetypeProfile();
  [primary, secondary, tertiary].forEach((key, index) => {
    const portrait = ARCHETYPE_PORTRAITS[key];
    const card = view.querySelectorAll('.archetype-rank-card')[index];
    if (!portrait || !card) return;

    const image = document.createElement('img');
    image.className = 'archetype-portrait';
    image.src = portrait.src;
    image.alt = portrait.alt;
    image.width = 1024;
    image.height = 1536;
    image.loading = index === 0 ? 'eager' : 'lazy';
    image.decoding = 'async';
    card.querySelector('.kicker')?.insertAdjacentElement('afterend', image);
    card.querySelector('div[style*="font-size:30px"]')?.remove();
  });
};

if (state.session) render();
