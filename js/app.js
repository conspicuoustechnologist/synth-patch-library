// REAPER_TEMPLATE is defined in data/reaper-template.js
// PATCHES is defined in data/patches.js

const SYNTH_TRACK = {
  'Modal Argon8':           '4. Argon8 Midi -  ',
  'Moog Little Phatty':     'Midi To Moog #11',
  'Yamaha PSR-730':         'MidiKeyz-#1',
  'Alesis Micron':          'Midi To Micron #14',
  'Dave Smith Poly Evolver':'Midi to DSI #16',
  'Korg microKORG':         'Midi To MKorg #15',
};

// ─── Wire up app ────────────────────────────────────────────────────────────

const library   = new PatchLibrary(PATCHES);
const generator = new Generator(library);
const ui        = new UI(generator);

// Exposed globally so HTML onclick attributes can reach these
const app = {
  // Presets
  random:          () => { generator.random();          ui.display(); },
  chill:           () => { generator.chill();           ui.display(); },
  aggressive:      () => { generator.aggressive();      ui.display(); },
  minimal:         () => { generator.minimal();         ui.display(); },
  fullOrchestra:   () => { generator.fullOrchestra();   ui.display(); },
  chamber:         () => { generator.chamber();         ui.display(); },
  strings:         () => { generator.strings();         ui.display(); },

  // Custom (reads values from DOM)
  custom() {
    generator.custom({
      bass:       { synth: _val('bass-synth'),   count: _int('bass-stack') },
      lead:       { synth: _val('lead-synth'),   count: _int('lead-stack') },
      pad:        { synth: _val('pad-synth'),    count: _int('pad-stack') },
      percussion: { synth: _val('perc-synth'),   count: _int('perc-stack') },
    });
    ui.display();
  },

  customOrchestra() {
    generator.customOrchestra({
      strings:   { synth: _val('strings-synth'),   count: _int('strings-stack') },
      brass:     { synth: _val('brass-synth'),     count: _int('brass-stack') },
      woodwinds: { synth: _val('woodwinds-synth'), count: _int('woodwinds-stack') },
      vocal:     { synth: _val('vocal-synth'),     count: _int('vocal-stack') },
    });
    ui.display();
  },

  // Mutations
  regenSlot(i)          { generator.regenSlot(i);              ui.display(); },
  addLayer(i)           { if (!generator.addLayer(i)) alert('Cannot stack!');      else ui.display(); },
  deleteLayer(i, j)     { if (!generator.deleteLayer(i, j)) alert('Cannot delete last layer!'); else ui.display(); },
  editLayer(i, j)       { ui.editLayer(i, j); },

  // Export
  exportReaper() {
    const combo = generator.combo;
    if (!combo || combo.length === 0) { alert('Generate a combo first!'); return; }

    let rpp = atob(REAPER_TEMPLATE);
    const synthPatches = {};

    combo.forEach(item => {
      if (!item.layers) return;
      item.layers.forEach(p => {
        if (!synthPatches[p.synth]) synthPatches[p.synth] = [];
        synthPatches[p.synth].push(item.category.toUpperCase() + ': ' + p.name);
      });
    });

    Object.entries(synthPatches).forEach(([synth, patches]) => {
      const track = SYNTH_TRACK[synth];
      if (!track) return;
      const newName = track + ' :: ' + patches.join(' | ');
      rpp = rpp.split('NAME "' + track + '"').join('NAME "' + newName + '"');
    });

    const blob = new Blob([rpp], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'voodoo_combo_' + Date.now() + '.RPP';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Reaper template exported!');
  },
};

// Tab switching and slider updates go through UI directly
function switchTab(t)            { ui.switchTab(t); }
function updateStackValue(el, c) { ui.updateStackValue(el, c); }

// ─── Helpers ────────────────────────────────────────────────────────────────

function _val(id)  { return document.getElementById(id).value; }
function _int(id)  { return parseInt(document.getElementById(id).value, 10); }
