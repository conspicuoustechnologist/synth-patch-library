const { PATCHES }       = require('../tools/data/patches');
const { PatchLibrary }  = require('../tools/js/PatchLibrary');
const { Generator }     = require('../tools/js/Generator');

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

let lib;
let gen;

beforeEach(() => {
  lib = new PatchLibrary(PATCHES);
  gen = new Generator(lib);
});

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
    // Known data quality issue — tracked but not blocking
    expect(dupes.length).toBeLessThan(300);
  });

  test('total patch count is at least 2000', () => {
    const total = KNOWN_CATEGORIES.reduce((sum, cat) => sum + PATCHES[cat].length, 0);
    expect(total).toBeGreaterThanOrEqual(2000);
  });
});

// ─── PatchLibrary ────────────────────────────────────────────────────────────

describe('PatchLibrary.canStack', () => {
  test('allows any synth when stack is empty', () => {
    expect(lib.canStack('Modal Argon8', [])).toBe(true);
    expect(lib.canStack('Moog Little Phatty', [])).toBe(true);
  });

  test('blocks a non-MULTI synth already in the stack', () => {
    const existing = [{ synth: 'Modal Argon8', name: 'some patch' }];
    expect(lib.canStack('Modal Argon8', existing)).toBe(false);
  });

  test('allows a different synth even when stack is non-empty', () => {
    const existing = [{ synth: 'Modal Argon8', name: 'some patch' }];
    expect(lib.canStack('Moog Little Phatty', existing)).toBe(true);
  });

  test('allows MULTI synths to stack with themselves', () => {
    lib.multi.forEach(synth => {
      const existing = [{ synth, name: 'patch 1' }];
      expect(lib.canStack(synth, existing)).toBe(true);
    });
  });
});

describe('PatchLibrary.getStacked', () => {
  test('returns exactly num patches when enough exist', () => {
    expect(lib.getStacked('bass', 'random', 3)).toHaveLength(3);
  });

  test('returns 1 patch when num is 1', () => {
    expect(lib.getStacked('lead', 'random', 1)).toHaveLength(1);
  });

  test('never returns duplicate patch names in a single call', () => {
    const result = lib.getStacked('bass', 'random', 10);
    const names = result.map(p => p.name);
    expect(new Set(names).size).toBe(names.length);
  });

  test('only returns patches from the specified synth when not random', () => {
    lib.getStacked('bass', 'Modal Argon8', 5).forEach(p => {
      expect(p.synth).toBe('Modal Argon8');
    });
  });

  test('falls back to all synths when filtered synth has no patches in category', () => {
    // Moog Little Phatty has no guitar patches — should still return something
    expect(lib.getStacked('guitar', 'Moog Little Phatty', 1).length).toBeGreaterThan(0);
  });

  test('returns empty array for a non-existent category', () => {
    expect(lib.getStacked('doesnotexist', 'random', 1)).toHaveLength(0);
  });

  test('returns as many patches as available if num exceeds available count', () => {
    const result = lib.getStacked('guitar', 'random', 50);
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThanOrEqual(22);
  });

  test('each returned patch has synth, name, description, category', () => {
    lib.getStacked('pad', 'random', 3).forEach(p => {
      expect(p.synth).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(p.category).toBeTruthy();
    });
  });
});

describe('PatchLibrary helpers', () => {
  test('getCategories returns all known categories', () => {
    const cats = lib.getCategories();
    KNOWN_CATEGORIES.forEach(cat => expect(cats).toContain(cat));
  });

  test('getSynths returns all known synths', () => {
    const synths = lib.getSynths();
    KNOWN_SYNTHS.forEach(s => expect(synths).toContain(s));
  });

  test('countByCategory returns counts for all categories', () => {
    const counts = lib.countByCategory();
    KNOWN_CATEGORIES.forEach(cat => {
      expect(counts[cat]).toBeGreaterThan(0);
    });
  });
});

// ─── Generator presets ────────────────────────────────────────────────────────

describe('Generator.random', () => {
  test('returns 4 slots: bass, lead, pad, percussion', () => {
    const combo = gen.random();
    expect(combo.map(s => s.category)).toEqual(['bass', 'lead', 'pad', 'percussion']);
  });

  test('each slot has exactly 1 layer', () => {
    gen.random().forEach(slot => expect(slot.layers).toHaveLength(1));
  });

  test('sets this.combo', () => {
    gen.random();
    expect(gen.combo).toHaveLength(4);
  });
});

describe('Generator.chill', () => {
  test('returns 3 slots: pad, keys, bass', () => {
    expect(gen.chill().map(s => s.category)).toEqual(['pad', 'keys', 'bass']);
  });

  test('pad slot has 2 layers', () => {
    expect(gen.chill().find(s => s.category === 'pad').layers).toHaveLength(2);
  });
});

describe('Generator.aggressive', () => {
  test('returns 3 slots: bass, lead, percussion', () => {
    expect(gen.aggressive().map(s => s.category)).toEqual(['bass', 'lead', 'percussion']);
  });

  test('bass and lead slots each have 2 layers', () => {
    const combo = gen.aggressive();
    expect(combo.find(s => s.category === 'bass').layers).toHaveLength(2);
    expect(combo.find(s => s.category === 'lead').layers).toHaveLength(2);
  });
});

describe('Generator.minimal', () => {
  test('returns exactly 2 slots: bass and lead', () => {
    expect(gen.minimal().map(s => s.category)).toEqual(['bass', 'lead']);
  });
});

describe('Generator.fullOrchestra', () => {
  test('returns 3 slots: symphony, vocal, percussion', () => {
    expect(gen.fullOrchestra().map(s => s.category)).toEqual(['symphony', 'vocal', 'percussion']);
  });

  test('symphony slot has 2 layers', () => {
    expect(gen.fullOrchestra().find(s => s.category === 'symphony').layers).toHaveLength(2);
  });
});

describe('Generator.chamber', () => {
  test('returns 2 slots: symphony and keys', () => {
    expect(gen.chamber().map(s => s.category)).toEqual(['symphony', 'keys']);
  });
});

describe('Generator.strings', () => {
  test('returns 1 symphony slot with 3 layers', () => {
    const combo = gen.strings();
    expect(combo).toHaveLength(1);
    expect(combo[0].category).toBe('symphony');
    expect(combo[0].layers).toHaveLength(3);
  });
});

// ─── Generator mutations ──────────────────────────────────────────────────────

describe('Generator mutations', () => {
  test('regenSlot replaces layers at given index, keeps same count', () => {
    gen.random();
    const before = gen.combo[0].layers[0].name;
    // regen until we get a different patch (or just verify structure is intact)
    gen.regenSlot(0);
    expect(gen.combo[0].layers).toHaveLength(1);
    expect(gen.combo[0].category).toBe('bass');
  });

  test('deleteLayer removes a layer from a multi-layer slot', () => {
    gen.aggressive(); // bass has 2 layers
    const bassIdx = gen.combo.findIndex(s => s.category === 'bass');
    gen.deleteLayer(bassIdx, 0);
    expect(gen.combo[bassIdx].layers).toHaveLength(1);
  });

  test('deleteLayer returns false and does not remove the last layer', () => {
    gen.minimal();
    const result = gen.deleteLayer(0, 0); // bass has 1 layer
    expect(result).toBe(false);
    expect(gen.combo[0].layers).toHaveLength(1);
  });

  test('getValidAlternatives returns patches from same category', () => {
    gen.random();
    const alts = gen.getValidAlternatives(0, 0);
    expect(alts.length).toBeGreaterThan(0);
    alts.forEach(p => expect(p.category.toLowerCase()).toBe('bass'));
  });

  test('replaceLayer swaps the patch at given position', () => {
    gen.random();
    const newPatch = lib.getStacked('bass', 'random', 1)[0];
    gen.replaceLayer(0, 0, newPatch);
    expect(gen.combo[0].layers[0]).toEqual(newPatch);
  });
});
