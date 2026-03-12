// ============================================================
// PRACTICE
// ============================================================
let practiceFilter = 'actpas';

// Current set of rendered practice items — shared with error-study.js
// so checkPractice() always has the item without reading back from DOM
let practiceItems = [];

function setPracticeFilter(f, btn) {
  practiceFilter = f;
  document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  startPractice();
}

function buildPracticeItems() {
  const items = [];

  if (practiceFilter === 'actpas' || practiceFilter === 'all') {
    transformExercises.filter(ex => isTenseActive(ex.tense)).forEach(ex => {
      // Give active → write passive
      items.push({
        type: 'actpas',
        direction: 'active→passive',
        tense: ex.tense,
        question: ex.active,
        answer: ex.passive,
      });
      // Give passive → write active
      items.push({
        type: 'actpas',
        direction: 'passive→active',
        tense: ex.tense,
        question: ex.passive,
        answer: ex.active,
      });
    });
  }

  if (practiceFilter === 'conjugacion' || practiceFilter === 'all') {
    tenses.filter(t => (t.group === 'indicatif' || t.group === 'subj') && isTenseActive(t.name)).forEach(t => {
      t.rows.forEach(r => {
        items.push({
          type: 'conj',
          tense: `${t.name} (${t.es})`,
          question: `${r.pro} ___ (être)`,
          answer: r.fr,
        });
      });
    });
  }

  return shuffle(items).slice(0, 50);
}

function startPractice() {
  practiceItems = buildPracticeItems();
  if (!practiceItems.length) { document.getElementById('practice-cards').innerHTML = '<p style="color:var(--muted)">Sin ítems.</p>'; return; }
  const html = practiceItems.map((item, i) => {
    const isAP = item.type === 'actpas';
    const label = isAP
      ? (item.direction === 'active→passive' ? '🔄 Transforma al pasivo' : '🔄 Transforma al activo')
      : '🇫🇷 Conjuga être';
    const hint = isAP ? `Tiempo: ${item.tense}` : item.tense;
    return `<div class="practice-card" id="pcard-${i}">
      <div class="p-label">${label}</div>
      <div class="p-context">${hint}</div>
      <div class="p-question">${item.question}</div>
      <input class="p-input" id="pinp-${i}" placeholder="Ta réponse…" onkeydown="if(event.key==='Enter')checkPractice(${i})">
      <div class="p-feedback" id="pfb-${i}"></div>
    </div>`;
  }).join('');
  document.getElementById('practice-summary').style.display = 'none';
  document.getElementById('practice-cards').innerHTML = html;
}

function checkPractice(i) {
  const item = practiceItems[i];
  const card = document.getElementById(`pcard-${i}`);
  const input = document.getElementById(`pinp-${i}`);
  const fb = document.getElementById(`pfb-${i}`);
  const val = input.value.trim();
  if (!val) return;
  const ok = normalize(val) === normalize(item.answer);
  card.classList.toggle('correct', ok); card.classList.toggle('wrong', !ok);
  input.classList.toggle('correct', ok); input.classList.toggle('wrong', !ok);
  fb.className = 'p-feedback ' + (ok ? 'ok' : 'err');
  fb.textContent = ok ? '✓ ¡Correcto!' : `✗ Correcto: ${item.answer}`;
  input.disabled = true;
  if (!ok) {
    logError(item);
    updateErrorBadge();
  }
}

function checkAllPractice() {
  practiceItems.forEach((_, i) => checkPractice(i));
  // Show summary banner after correcting all
  const total = practiceItems.length;
  const wrong = document.querySelectorAll('.practice-card.wrong').length;
  if (wrong > 0) {
    const banner = document.getElementById('practice-summary');
    if (banner) {
      const analysis = analyzeErrors();
      banner.innerHTML = `<b style="color:var(--accent)">⚠️ ${wrong} de ${total} incorrectos</b> — ${buildRecommendation(analysis)}
        <div class="btn-row" style="margin-top:0.6rem">
          <button class="btn btn-ghost" style="border-color:var(--error);color:var(--error);font-size:0.72rem" onclick="studyErrors()">📌 Estudiar mis fallos (${errorLog.length})</button>
          <button class="btn btn-ghost" style="font-size:0.72rem" onclick="clearErrors();startPractice()">↺ Limpiar y empezar de nuevo</button>
        </div>`;
      banner.style.display = 'block';
    }
  }
}
