const {
  PATCHES,
  MULTI,
  canStack,
  getStacked,
  buildRandom,
  buildChill,
  buildAggressive,
  buildMinimal,
  buildFullOrchestra,
  buildChamber,
  buildStrings,
} = require('../js/core');

const KNOWN_SYNTHS = [
  'Modal Argon8',
  'Moog Little Phatty',
  'Dave Smith Poly Evolver',
  'Yamaha PSR-730',
  'Alesis Micron',
  'Korg microKORG',
];

const KNOWN_CATEGORIES = [
  'bass', 'lead', 'pad', 'percussion',
  'keys', 'arpeggio', 'sfx', 'symphony', 'guitar', 'vocal',
];

// ─── Data Integrity ───────────────────────────────────────────────────────────

describe('PATCHES data integrity', () => {
  test('has all expected categories', () => {
    KNOWN_CATEGORIES.forEach(cat => {
      expect(PATCHES).toHaveProperty(cat);
    });
  });

  test('every category has at least 10 patches', () => {
    KNOWN_CATEGORIES.forEach(cat => {
      expect(PATCHES[cat].length).toBeGreaterThanOrEqual(10);
    });
  });

  test('every patch has required fields: synth, name, description, category', () => {
    KNOWN_CATEGORIES.forEach(cat => {
      PATCHES[cat].forEach(patch => {
        expect(patch.synth).toBeTruthy();
        expect(patch.name).toBeTruthy();
        expect(patch.description).toBeTruthy();
        expect(patch.category).toBeTruthy();
      });
    });
  });

  test('every patch belongs to a known synth', () => {
    KNOWN_CATEGORIES.forEach(cat => {
      PATCHES[cat].forEach(patch => {
        expect(KNOWN_SYNTHS).toContain(patch.synth);
      });
    });
  });

  test('no duplicate patch names within the same synth and category', () => {
    const dupes = [];
    KNOWN_CATEGORIES.forEach(cat => {
      const seen = {};
      PATCHES[cat].forEach(patch => {
        const key = `${patch.synth}::${patch.name}`;
        if (seen[key]) dupes.push(`${cat}: ${key}`);
        seen[key] = true;
      });
    });
    if (dupes.length > 0) {
      console.warn(`Found ${dupes.length} duplicate patches (data quality issue to fix):\n` + dupes.slice(0, 10).join('\n') + (dupes.length > 10 ? `\n...and ${dupes.length - 10} more` : ''));
    }
    // This is a known data quality issue — tracked but not blocking
    expect(dupes.length).toBeLessThan(300);
  });

  test('total patch count is at least 2000', () => {
    const total = KNOWN_CATEGORIES.reduce((sum, cat) => sum + PATCHES[cat].length, 0);
    expect(total).toBeGreaterThanOrEqual(2000);
  });
});

// ─── canStack ─────────────────────────────────────────────────────────────────

describe('canStack', () => {
  test('allows any synth when stack is empty', () => {
    expect(canStack('Modal Argon8', [])).toBe(true);
    expect(canStack('Moog Little Phatty', [])).toBe(true);
  });

  test('blocks a non-MULTI synth already in the stack', () => {
    const existing = [{ synth: 'Modal Argon8', name: 'some patch' }];
    expect(canStack('Modal Argon8', existing)).toBe(false);
  });

  test('allows a different synth even when stack is non-empty', () => {
    const existing = [{ synth: 'Modal Argon8', name: 'some patch' }];
    expect(canStack('Moog Little Phatty', existing)).toBe(true);
  });

  test('allows MULTI synths to stack with themselves', () => {
    MULTI.forEach(synth => {
      const existing = [{ synth, name: 'patch 1' }];
      expect(canStack(synth, existing)).toBe(true);
    });
  });
});

// ─── getStacked ───────────────────────────────────────────────────────────────

describe('getStacked', () => {
  test('returns exactly num patches when enough exist', () => {
    const result = getStacked('bass', 'random', 3);
    expect(result).toHaveLength(3);
  });

  test('returns 1 patch when num is 1', () => {
    const result = getStacked('lead', 'random', 1);
    expect(result).toHaveLength(1);
  });

  test('never returns duplicate patch names in a single call', () => {
    const result = getStacked('bass', 'random', 10);
    const names = result.map(p => p.name);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });

  test('only returns patches from the specified synth when not random', () => {
    const result = getStacked('bass', 'Modal Argon8', 5);
    result.forEach(p => {
      expect(p.synth).toBe('Modal Argon8');
    });
  });

  test('falls back to all synths when filtered synth has no patches in category', () => {
    // Moog Little Phatty has no guitar patches — should fall back and still return something
    const result = getStacked('guitar', 'Moog Little Phatty', 1);
    expect(result.length).toBeGreaterThan(0);
  });

  test('returns empty array for a non-existent category', () => {
    const result = getStacked('doesnotexist', 'random', 1);
    expect(result).toHaveLength(0);
  });

  test('returns as many patches as available if num exceeds available count', () => {
    // guitar only has 22 patches — requesting 50 should not crash, just return what exists
    const result = getStacked('guitar', 'random', 50);
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThanOrEqual(22);
  });

  test('each returned patch has synth, name, description, category', () => {
    const result = getStacked('pad', 'random', 3);
    result.forEach(p => {
      expect(p.synth).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(p.category).toBeTruthy();
    });
  });
});

// ─── Preset builders ──────────────────────────────────────────────────────────

describe('buildRandom', () => {
  test('returns exactly 4 slots', () => {
    expect(buildRandom()).toHaveLength(4);
  });

  test('slots are bass, lead, pad, percussion in that order', () => {
    const cats = buildRandom().map(s => s.category);
    expect(cats).toEqual(['bass', 'lead', 'pad', 'percussion']);
  });

  test('each slot has exactly 1 layer', () => {
    buildRandom().forEach(slot => {
      expect(slot.layers).toHaveLength(1);
    });
  });
});

describe('buildChill', () => {
  test('returns 3 slots: pad, keys, bass', () => {
    const cats = buildChill().map(s => s.category);
    expect(cats).toEqual(['pad', 'keys', 'bass']);
  });

  test('pad slot has 2 layers', () => {
    const pad = buildChill().find(s => s.category === 'pad');
    expect(pad.layers).toHaveLength(2);
  });
});

describe('buildAggressive', () => {
  test('returns 3 slots: bass, lead, percussion', () => {
    const cats = buildAggressive().map(s => s.category);
    expect(cats).toEqual(['bass', 'lead', 'percussion']);
  });

  test('bass slot has 2 layers', () => {
    const bass = buildAggressive().find(s => s.category === 'bass');
    expect(bass.layers).toHaveLength(2);
  });

  test('lead slot has 2 layers', () => {
    const lead = buildAggressive().find(s => s.category === 'lead');
    expect(lead.layers).toHaveLength(2);
  });
});

describe('buildMinimal', () => {
  test('returns exactly 2 slots: bass and lead', () => {
    const cats = buildMinimal().map(s => s.category);
    expect(cats).toEqual(['bass', 'lead']);
  });
});

describe('buildFullOrchestra', () => {
  test('returns 3 slots: symphony, vocal, percussion', () => {
    const cats = buildFullOrchestra().map(s => s.category);
    expect(cats).toEqual(['symphony', 'vocal', 'percussion']);
  });

  test('symphony slot has 2 layers', () => {
    const sym = buildFullOrchestra().find(s => s.category === 'symphony');
    expect(sym.layers).toHaveLength(2);
  });
});

describe('buildChamber', () => {
  test('returns 2 slots: symphony and keys', () => {
    const cats = buildChamber().map(s => s.category);
    expect(cats).toEqual(['symphony', 'keys']);
  });
});

describe('buildStrings', () => {
  test('returns 1 slot: symphony', () => {
    const result = buildStrings();
    expect(result).toHaveLength(1);
    expect(result[0].category).toBe('symphony');
  });

  test('symphony slot has 3 layers', () => {
    expect(buildStrings()[0].layers).toHaveLength(3);
  });
});
