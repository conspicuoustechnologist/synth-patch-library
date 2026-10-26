// Rebuild the category pages (patches/*.md) from data/patches.js, which is the source of truth.
// Run: npm run pages. Each page keeps its title and back link, gets one table per synth in a fixed order and a
// recomputed total. Read back from the old page: symphony's Brass/Strings split (new patches land in "Other"
// until moved on the page) and the TB-303 recipe under the Phatty bass table.
const fs = require('fs');
const path = require('path');
process.chdir(path.join(__dirname, '..'));
const { PATCHES } = require('../data/patches.js');
const PAGES = { bass: 'bass', lead: 'lead', pad: 'pad', percussion: 'percussion', keys: 'keys', arpeggio: 'arpeggio',
                sfx: 'sfx', symphony: 'symphony', guitar: 'guitar', vocal: 'vocal-choir', unknown: 'unknown', soundtrack: 'soundtrack' };
const ORDER = ['Modal Argon8', 'Moog Little Phatty', 'Yamaha PSR-730', 'Alesis Micron', 'Dave Smith Poly Evolver', 'Korg microKORG'];
const table = es => ['| Patch Name | Description |', '|------------|-------------|', ...es.map(e => `| ${e.name} | ${e.description} |`)];

for (const [key, file] of Object.entries(PAGES)) {
  const path = `patches/${file}.md`, old = fs.readFileSync(path, 'utf8').split('\n');
  const first = old.findIndex(l => l.startsWith('## '));
  // unknown.md had no synth sections, just a note saying everything was categorized
  const preamble = key === 'unknown' ? ['[← Back to Index](INDEX.md)', '', '# Unknown/Uncategorized Patches by Synthesizer', '', 'Patches in a .ins file that have no category yet.']
                                     : old.slice(0, first); while (preamble.length && !preamble[preamble.length - 1].trim()) preamble.pop();
  // things on the old page that aren't rows: the total line's wording, symphony's brass/strings split, the TB-303 recipe
  const label = (old.join('\n').match(/\*\*Total: \d+ (.*) patches across all synths\*\*/) || [])[1];
  const group = {}; let synth = null, sub = null;
  for (const l of old) {
    if (l.startsWith('## ')) { synth = ORDER.find(s => l.includes(s)); sub = null; }
    else if (l.startsWith('### ')) sub = l.slice(4).split(' (')[0].trim();
    else if (l.startsWith('| ') && synth && sub) { const n = l.split('|')[1].trim(); group[synth + '::' + n] ||= sub; }
  }
  const r0 = old.findIndex(l => l.startsWith('### Sound Design Recipe'));
  let recipe = [];
  if (r0 >= 0) { let r1 = old.findIndex((l, i) => i > r0 && (l.startsWith('## ') || l.startsWith('**Total'))); recipe = old.slice(r0, r1 < 0 ? undefined : r1);
                 while (recipe.length && !recipe[recipe.length - 1].trim()) recipe.pop(); }

  const out = [...preamble, '', ''];
  let total = 0, dupes = 0; const subTotals = {};
  for (const s of ORDER) {
    const seen = new Set(), es = [];
    for (const e of PATCHES[key] || []) if (e.synth === s) { if (seen.has(e.name)) { dupes++; continue; } seen.add(e.name); es.push(e); }
    if (!es.length) continue;
    total += es.length;
    out.push(`## ${s} (${es.length} patches)`, '');
    if (key === 'symphony') {
      for (const g of ['Brass', 'Strings', 'Other']) {
        const ge = es.filter(e => (group[s + '::' + e.name] || 'Other') === g);
        if (!ge.length) continue;
        subTotals[g] = (subTotals[g] || 0) + ge.length;
        out.push(`### ${g} (${ge.length} patches)`, '', ...table(ge), '');
      }
    } else {
      out.push(...table(es), '');
      if (s === 'Moog Little Phatty' && recipe.length) out.push(...recipe, '');
    }
  }
  out.push('---', '');
  if (key === 'symphony') out.push(`**Total: ${subTotals.Brass || 0} brass patches, ${subTotals.Strings || 0} string patches` +
                                   `${subTotals.Other ? `, ${subTotals.Other} other` : ''} (${total} symphony patches total)**`, '');
  else out.push(`**Total: ${total} ${label || key} patches across all synths**`, '');
  fs.writeFileSync(path, out.join('\n'));
  console.log(`${path}: ${total} patches${dupes ? `, ${dupes} duplicate entries in patches.js shown once` : ''}` +
              (key === 'symphony' ? ` (brass ${subTotals.Brass || 0}, strings ${subTotals.Strings || 0}, other ${subTotals.Other || 0})` : '') +
              (recipe.length && key === 'bass' ? `, TB-303 recipe kept (${recipe.length} lines)` : ''));
}
