class UI {
  constructor(generator) {
    this.gen = generator;
  }

  display() {
    const r = document.getElementById('results');
    const combo = this.gen.combo;

    if (!combo || combo.length === 0) {
      r.innerHTML = '<div class="loading">:: NO DATA ::</div>';
      return;
    }

    let h = '<div class="combo-title">⚡ VOODOO PATCH COMBO ⚡</div>' +
            '<div class="export-container"><button class="export-btn" onclick="app.exportReaper()">💾 EXPORT TO REAPER</button></div>';

    combo.forEach((item, ci) => {
      if (!item.layers || item.layers.length === 0) return;

      h += '<div class="patch-card">' +
           '<button class="regenerate-btn" onclick="app.regenSlot(' + ci + ')">🔄 REGENERATE</button>' +
           '<div class="patch-category">' + item.category.toUpperCase() + '</div>';

      item.layers.forEach((p, li) => {
        h += '<div class="stack-layer">';
        if (item.layers.length > 1) {
          h += '<div class="layer-controls">' +
               '<button class="edit-btn" onclick="app.editLayer(' + ci + ',' + li + ')">✏️ EDIT</button>' +
               '<button class="delete-btn" onclick="app.deleteLayer(' + ci + ',' + li + ')">🗑️ DELETE</button>' +
               '</div>';
        }
        h += '<div class="patch-synth">' + p.synth + '</div>' +
             '<div class="patch-name">' + p.name + '</div>' + this.previews(p) +
             '<div class="patch-description">' + p.description + '</div>' +
             '</div>';
      });

      h += '<button class="add-stack-btn" onclick="app.addLayer(' + ci + ')">+ STACK LAYER</button></div>';
    });

    r.innerHTML = h;
  }

  // play buttons for the patch's preview clips (data/previews.js, made by patchprint; absent until it runs)
  previews(p) {
    const clips = (typeof PREVIEWS !== 'undefined' && PREVIEWS[p.synth + '::' + p.name]) || {};
    const notes = ['C1', 'C3', 'C6'].filter(n => clips[n]);
    if (!notes.length) return '';
    return '<div class="previews">' + notes.map(n =>
      '<button class="preview-btn" data-src="' + clips[n] + '">&#9654; ' + n + '</button>').join('') + '</div>';
  }

  // one player for the whole page: a click plays that clip, clicking the playing one stops it
  play(btn) {
    const a = this.audio || (this.audio = new Audio());
    const same = a.dataset.src === btn.dataset.src && !a.paused;
    a.pause();
    document.querySelectorAll('.preview-btn.playing').forEach(b => b.classList.remove('playing'));
    if (same) { a.dataset.src = ''; return; }
    a.src = btn.dataset.src; a.dataset.src = btn.dataset.src;
    a.onended = () => btn.classList.remove('playing');
    btn.classList.add('playing');
    a.play();
  }

  switchTab(t) {
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('tab-' + t).classList.add('active');
  }

  updateStackValue(el, id) {
    document.getElementById(id + '-stack-value').textContent = el.value + 'x';
  }

  editLayer(slotIndex, layerIndex) {
    const valid = this.gen.getValidAlternatives(slotIndex, layerIndex);
    const opts = valid.map((p, idx) =>
      '<option value="' + idx + '">' + p.synth + ' :: ' + p.name + '</option>'
    ).join('');

    const sel = document.createElement('select');
    sel.className = 'patch-dropdown';
    sel.innerHTML = opts;
    sel.onchange = () => {
      this.gen.replaceLayer(slotIndex, layerIndex, valid[sel.value]);
      this.display();
    };

    const cont = event.target.parentElement;
    const existing = cont.querySelector('.patch-dropdown');
    if (existing) existing.remove();
    else cont.appendChild(sel);
  }
}
