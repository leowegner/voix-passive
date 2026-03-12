// ============================================================
// RENDER TABLES
// ============================================================
function renderTables() {
  const groups = { indicatif: 'indicatif-grid', subj: 'subj-grid', other: 'other-grid' };
  Object.values(groups).forEach(id => document.getElementById(id).innerHTML = '');
  tenses.forEach(t => {
    if (t.group !== 'other' && !isTenseActive(t.name)) return;
    const html = `<div class="tense-card">
      <div class="tense-card-header">
        <span class="tense-name">${t.name}</span>
        <span class="tense-es">${t.es}</span>
      </div>
      <div class="tense-rows">
        ${t.rows.map(r => `<div class="tense-row">
          <span class="tense-pronoun">${r.pro}</span>
          <span class="tense-fr">${r.fr}</span>
          <span class="tense-esp">${r.esp}</span>
        </div>`).join('')}
      </div>
      <div class="tense-usage">💡 ${t.usage}</div>
    </div>`;
    document.getElementById(groups[t.group]).insertAdjacentHTML('beforeend', html);
  });
}

// ============================================================
// RENDER ACTIVO/PASIVO
// ============================================================
function renderActivoPasivo() {
  // Transforms
  document.getElementById('transforms-container').innerHTML = transforms.map(t => `
    <div class="transform-card">
      <div class="transform-title">${t.title}</div>
      <div class="sentence-row">
        <span class="sentence-tag tag-active">Activa</span>
        <div><div class="sentence-text">${t.active.fr}</div><div class="sentence-es">${t.active.es}</div></div>
      </div>
      <div class="sentence-row">
        <span class="sentence-tag tag-passive">Pasiva</span>
        <div><div class="sentence-text">${t.passive.fr}</div><div class="sentence-es">${t.passive.es}</div></div>
      </div>
    </div>`).join('');

  // Passive tenses table
  document.getElementById('passive-tenses-container').innerHTML = `
    <div class="transform-card">
      <table style="width:100%;border-collapse:collapse;font-size:0.82rem;">
        <thead>
          <tr style="border-bottom:2px solid var(--border)">
            <th style="text-align:left;padding:0.5rem 0.75rem;color:var(--muted);font-weight:500;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.08em">Tiempo</th>
            <th style="text-align:left;padding:0.5rem 0.75rem;color:var(--muted);font-weight:500;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.08em">Fórmula (être)</th>
            <th style="text-align:left;padding:0.5rem 0.75rem;color:var(--muted);font-weight:500;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.08em">Ejemplo</th>
          </tr>
        </thead>
        <tbody>
          ${passiveTenses.map(p => `<tr style="border-bottom:1px solid var(--card)">
            <td style="padding:0.55rem 0.75rem;font-style:italic;color:var(--ink)">${p.tense}</td>
            <td style="padding:0.55rem 0.75rem;color:var(--accent2)">${p.formula}</td>
            <td style="padding:0.55rem 0.75rem">
              <div>${p.example}</div>
              <div style="color:var(--muted);font-size:0.72rem;font-style:italic">${p.es}</div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}
