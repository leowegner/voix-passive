// ============================================================
// TENSE SELECTOR
// ============================================================
// Tenses that appear in conjugation table
const CONJ_TENSES = [
  'Présent', 'Imparfait', 'Passé composé', 'Passé simple',
  'Futur simple', 'Futur antérieur', 'Plus-que-parfait',
  'Conditionnel présent', 'Conditionnel passé',
  'Subjonctif présent', 'Subjonctif passé'
];
// Tenses that appear in transformExercises
const TRANS_TENSES = [
  'Présent', 'Imparfait', 'Passé composé', 'Passé simple',
  'Futur simple', 'Conditionnel', 'Plus-que-parfait'
];
// All unique tenses shown in selector
const ALL_TENSES = [...new Set([...CONJ_TENSES, ...TRANS_TENSES])];
// Common tenses (passé simple excluded by default)
const COMMON_TENSES = [
  'Présent', 'Imparfait', 'Passé composé', 'Futur simple',
  'Conditionnel présent', 'Conditionnel', 'Plus-que-parfait',
  'Subjonctif présent'
];

let activeTenses = new Set(COMMON_TENSES);

function initTenseSelector() {
  const grid = document.getElementById('tense-toggle-grid');
  if (!grid || grid.children.length) return;
  ALL_TENSES.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'tense-toggle-btn' + (activeTenses.has(t) ? ' active' : '');
    btn.textContent = t;
    btn.dataset.tense = t;
    btn.onclick = () => toggleTense(t, btn);
    grid.appendChild(btn);
  });
  updateTenseCount();
}

function toggleTense(t, btn) {
  if (activeTenses.has(t)) {
    if (activeTenses.size <= 1) return; // keep at least one
    activeTenses.delete(t);
    btn.classList.remove('active');
  } else {
    activeTenses.add(t);
    btn.classList.add('active');
  }
  updateTenseCount();
  renderTables();
}

function selectAllTenses() {
  ALL_TENSES.forEach(t => activeTenses.add(t));
  document.querySelectorAll('.tense-toggle-btn').forEach(b => b.classList.add('active'));
  updateTenseCount();
  renderTables();
}

function selectCommonTenses() {
  activeTenses = new Set(COMMON_TENSES);
  document.querySelectorAll('.tense-toggle-btn').forEach(b => {
    b.classList.toggle('active', activeTenses.has(b.dataset.tense));
  });
  updateTenseCount();
  renderTables();
}

function updateTenseCount() {
  const el = document.getElementById('tense-active-count');
  if (el) el.textContent = activeTenses.size + ' / ' + ALL_TENSES.length + ' seleccionados';
}

function isTenseActive(tenseName) {
  // Match against both exact and partial (e.g. 'Conditionnel' matches 'Conditionnel présent')
  if (activeTenses.has(tenseName)) return true;
  for (const t of activeTenses) {
    if (tenseName.startsWith(t) || t.startsWith(tenseName)) return true;
  }
  return false;
}
