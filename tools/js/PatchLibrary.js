class PatchLibrary {
  constructor(patches) {
    this.patches = patches;
    this.multi = ['Yamaha PSR-730', 'Alesis Micron'];
  }

  // Returns true if synth can be added to an existing layer set
  canStack(synth, existingLayers) {
    return this.multi.includes(synth) || !existingLayers.some(l => l.synth === synth);
  }

  // Returns up to `count` non-duplicate patches from category/synth
  getStacked(category, synth, count) {
    let pool = this.patches[category] || [];
    if (synth !== 'random') pool = pool.filter(p => p.synth === synth);
    if (!pool.length) pool = this.patches[category] || [];

    const layers = [];
    const used = new Set();

    for (let i = 0; i < count; i++) {
      let avail = pool.filter(p => !used.has(p.name) && this.canStack(p.synth, layers));
      if (!avail.length) avail = pool.filter(p => !used.has(p.name));
      if (!avail.length) break;
      const pick = avail[Math.floor(Math.random() * avail.length)];
      layers.push(pick);
      used.add(pick.name);
    }

    return layers;
  }

  getCategories() {
    return Object.keys(this.patches);
  }

  getSynths() {
    const all = Object.values(this.patches).flat().map(p => p.synth);
    return [...new Set(all)].sort();
  }

  countByCategory() {
    const result = {};
    this.getCategories().forEach(cat => {
      result[cat] = this.patches[cat].length;
    });
    return result;
  }
}

if (typeof module !== 'undefined') module.exports = { PatchLibrary };
