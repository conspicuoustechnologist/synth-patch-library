class Generator {
  constructor(library) {
    this.lib = library;
    this.combo = [];
  }

  // ─── Preset generators ───────────────────────────────────────────────────

  random() {
    this.combo = [
      { category: 'bass',       layers: this.lib.getStacked('bass',       'random', 1) },
      { category: 'lead',       layers: this.lib.getStacked('lead',       'random', 1) },
      { category: 'pad',        layers: this.lib.getStacked('pad',        'random', 1) },
      { category: 'percussion', layers: this.lib.getStacked('percussion', 'random', 1) },
    ];
    return this.combo;
  }

  chill() {
    this.combo = [
      { category: 'pad',  layers: this.lib.getStacked('pad',  'random', 2) },
      { category: 'keys', layers: this.lib.getStacked('keys', 'random', 1) },
      { category: 'bass', layers: this.lib.getStacked('bass', 'random', 1) },
    ];
    return this.combo;
  }

  aggressive() {
    this.combo = [
      { category: 'bass',       layers: this.lib.getStacked('bass',       'random', 2) },
      { category: 'lead',       layers: this.lib.getStacked('lead',       'random', 2) },
      { category: 'percussion', layers: this.lib.getStacked('percussion', 'random', 1) },
    ];
    return this.combo;
  }

  minimal() {
    this.combo = [
      { category: 'bass', layers: this.lib.getStacked('bass', 'random', 1) },
      { category: 'lead', layers: this.lib.getStacked('lead', 'random', 1) },
    ];
    return this.combo;
  }

  fullOrchestra() {
    this.combo = [
      { category: 'symphony',   layers: this.lib.getStacked('symphony',   'random', 2) },
      { category: 'vocal',      layers: this.lib.getStacked('vocal',      'random', 1) },
      { category: 'percussion', layers: this.lib.getStacked('percussion', 'random', 1) },
    ];
    return this.combo;
  }

  chamber() {
    this.combo = [
      { category: 'symphony', layers: this.lib.getStacked('symphony', 'random', 1) },
      { category: 'keys',     layers: this.lib.getStacked('keys',     'random', 1) },
    ];
    return this.combo;
  }

  strings() {
    this.combo = [
      { category: 'symphony', layers: this.lib.getStacked('symphony', 'random', 3) },
    ];
    return this.combo;
  }

  custom({ bass, lead, pad, percussion }) {
    this.combo = [
      { category: 'bass',       layers: this.lib.getStacked('bass',       bass.synth,       bass.count) },
      { category: 'lead',       layers: this.lib.getStacked('lead',       lead.synth,       lead.count) },
      { category: 'pad',        layers: this.lib.getStacked('pad',        pad.synth,        pad.count) },
      { category: 'percussion', layers: this.lib.getStacked('percussion', percussion.synth, percussion.count) },
    ];
    return this.combo;
  }

  customOrchestra({ strings, brass, woodwinds, vocal }) {
    this.combo = [
      { category: 'symphony', layers: this.lib.getStacked('symphony', strings.synth,   strings.count) },
      { category: 'symphony', layers: this.lib.getStacked('symphony', brass.synth,     brass.count) },
      { category: 'symphony', layers: this.lib.getStacked('symphony', woodwinds.synth, woodwinds.count) },
      { category: 'vocal',    layers: this.lib.getStacked('vocal',    vocal.synth,     vocal.count) },
    ];
    return this.combo;
  }

  // ─── Combo mutations ─────────────────────────────────────────────────────

  regenSlot(index) {
    const slot = this.combo[index];
    slot.layers = this.lib.getStacked(slot.category, 'random', slot.layers.length);
    return this.combo;
  }

  addLayer(index) {
    const slot = this.combo[index];
    const candidate = this.lib.getStacked(slot.category, 'random', 1);
    if (
      candidate.length > 0 &&
      this.lib.canStack(candidate[0].synth, slot.layers) &&
      !slot.layers.some(l => l.name === candidate[0].name)
    ) {
      slot.layers.push(candidate[0]);
      return true;
    }
    return false;
  }

  deleteLayer(slotIndex, layerIndex) {
    if (this.combo[slotIndex].layers.length <= 1) return false;
    this.combo[slotIndex].layers.splice(layerIndex, 1);
    return true;
  }

  getValidAlternatives(slotIndex, layerIndex) {
    const slot = this.combo[slotIndex];
    const pool = this.lib.patches[slot.category] || [];
    const otherLayers = slot.layers.filter((_, i) => i !== layerIndex);
    return pool.filter(p => this.lib.canStack(p.synth, otherLayers));
  }

  replaceLayer(slotIndex, layerIndex, patch) {
    this.combo[slotIndex].layers[layerIndex] = patch;
    return this.combo;
  }
}

if (typeof module !== 'undefined') module.exports = { Generator };
