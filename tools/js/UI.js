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
             '<div class="patch-name">' + p.name + '</div>' +
             '<div class="patch-description">' + p.description + '</div>' +
             '</div>';
      });

      h += '<button class="add-stack-btn" onclick="app.addLayer(' + ci + ')">+ STACK LAYER</button></div>';
    });

    r.innerHTML = h;
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
