// ============================================================
// EXAMEN
// ============================================================
let examRunning = false, examTimer, examItems2 = [], examAnswers2 = [];

function renderExamStart() {
  examRunning = false;
  clearInterval(examTimer);
  const hasErrors = errorLog.length > 0;
  document.getElementById('exam-area').innerHTML =
    '<div style="text-align:center;padding:3rem 1rem">'
    + '<div style="font-family:\'Playfair Display\',serif;font-size:2rem;font-weight:900;color:var(--accent);margin-bottom:0.75rem;font-style:italic">Examen final</div>'
    + '<p style="color:var(--muted);font-size:0.9rem;margin-bottom:2rem;line-height:1.7">Mezcla de conjugaciones de <em>être</em> y transformaciones activo↔pasivo.<br>20 preguntas · 6 minutos · Las tildes no penalizan.</p>'
    + '<div class="btn-row" style="justify-content:center;flex-wrap:wrap">'
    + '<button class="btn btn-primary" onclick="startExam(false)">Comenzar examen</button>'
    + (hasErrors ? '<button class="btn btn-ghost" style="border-color:var(--error);color:var(--error)" onclick="startExam(true)">📌 Examen con mis fallos (' + errorLog.length + ')</button>' : '')
    + '</div></div>';
}

function startExam(fromErrors) {
  const conjItems = [];
  tenses.filter(t => t.group === 'indicatif' && isTenseActive(t.name)).forEach(t => {
    t.rows.forEach(r => conjItems.push({
      label: '🇫🇷 Conjuga être', type: 'conj',
      context: t.name + ' — ' + t.es, tense: t.name,
      question: r.pro + ' ___ (être)', answer: r.fr,
    }));
  });
  const transItems = [];
  transformExercises.filter(ex => isTenseActive(ex.tense)).forEach(ex => {
    transItems.push({ label: '🔄 Transforma al pasivo', type: 'actpas', direction: 'active→passive', context: 'Tiempo: ' + ex.tense, tense: ex.tense, question: ex.active, answer: ex.passive });
    transItems.push({ label: '🔄 Transforma al activo', type: 'actpas', direction: 'passive→active', context: 'Tiempo: ' + ex.tense, tense: ex.tense, question: ex.passive, answer: ex.active });
  });

  if (fromErrors && errorLog.length > 0) {
    const errConj = shuffle(errorLog.filter(e => e.type === 'conj')).slice(0, 10);
    const errAP = shuffle(errorLog.filter(e => e.type === 'actpas')).slice(0, 10);
    const extra = shuffle([...conjItems, ...transItems]).filter(i => !errorLog.find(e => e.question === i.question)).slice(0, 20 - errConj.length - errAP.length);
    examItems2 = shuffle([...errConj, ...errAP, ...extra]).slice(0, 20);
  } else {
    examItems2 = shuffle([...shuffle(conjItems).slice(0, 10), ...shuffle(transItems).slice(0, 10)]);
  }

  examAnswers2 = new Array(examItems2.length).fill('');
  examRunning = true;
  const TOTAL = 360;
  let elapsed = 0;

  let html = '<div style="background:var(--card);border:1px solid var(--border);border-radius:0.5rem;padding:1rem 1.5rem;margin-bottom:1.5rem;display:flex;justify-content:space-between;align-items:center">'
    + '<div><div style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted)">Tiempo</div>'
    + '<div id="exam-timer" style="font-family:\'Playfair Display\',serif;font-size:2rem;font-weight:900;color:var(--accent)">6:00</div></div>'
    + '<div>' + (fromErrors ? '<div style="font-size:0.7rem;color:var(--error)">📌 Modo fallos</div>' : '') + '</div>'
    + '<div style="text-align:right"><div style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted)">Preguntas</div>'
    + '<div style="font-family:\'Playfair Display\',serif;font-size:1.8rem;font-weight:900">' + examItems2.length + '</div></div></div>'
    + '<div style="display:flex;flex-direction:column;gap:1rem">';

  examItems2.forEach((item, i) => {
    html += '<div class="practice-card" id="ecard-' + i + '">'
      + '<div class="p-label">' + item.label + '</div>'
      + '<div class="p-context">' + item.context + '</div>'
      + '<div class="p-question">' + item.question + '</div>'
      + '<input class="p-input" id="einp-' + i + '" placeholder="Ta réponse…"'
      + ' onkeydown="if(event.key===\'Enter\'&&' + i + '<' + (examItems2.length - 1) + ')document.getElementById(\'einp-' + (i + 1) + '\').focus()">'
      + '</div>';
  });

  html += '</div><div class="btn-row" style="justify-content:center;margin-top:1.5rem">'
    + '<button class="btn btn-primary" onclick="finishExam()">Entregar examen ✓</button></div>';

  document.getElementById('exam-area').innerHTML = html;
  document.getElementById('einp-0').focus();

  examTimer = setInterval(() => {
    elapsed++;
    const rem = TOTAL - elapsed;
    const timerEl = document.getElementById('exam-timer');
    if (!timerEl) { clearInterval(examTimer); return; }
    const m = Math.floor(rem / 60), s = rem % 60;
    timerEl.textContent = m + ':' + s.toString().padStart(2, '0');
    if (rem <= 30) timerEl.style.color = 'var(--error)';
    if (rem <= 0) finishExam();
  }, 1000);
}

function finishExam() {
  if (!examRunning) return;
  examRunning = false;
  clearInterval(examTimer);
  examItems2.forEach((_, i) => {
    const inp = document.getElementById('einp-' + i);
    if (inp) examAnswers2[i] = inp.value.trim();
  });
  let correct = 0;
  const details = examItems2.map((item, i) => {
    const val = examAnswers2[i] || '';
    const ok = normalize(val) === normalize(item.answer);
    if (ok) correct++;
    else logError(item);
    return { ...item, given: val, ok };
  });
  updateErrorBadge();
  const pct = Math.round(correct / examItems2.length * 100);
  const cls = pct >= 70 ? 'good' : pct >= 40 ? 'mid' : 'bad';
  const failed = details.filter(d => !d.ok);
  const analysis = failed.length ? analyzeErrors() : null;

  let html = '<div class="results-box">'
    + '<div class="results-score ' + cls + '">' + correct + '/' + examItems2.length + '</div>'
    + '<div style="color:var(--muted);margin-top:0.5rem">' + pct + '% de aciertos</div>'
    + '<div style="font-family:\'Playfair Display\',serif;font-style:italic;margin-top:0.5rem">' + (pct >= 70 ? 'Très bien fait ! 🎉' : pct >= 40 ? 'Pas mal, continue ! 💪' : 'Il faut encore travailler ! 📚') + '</div>';

  if (failed.length) {
    html += '<div style="background:rgba(192,57,43,0.07);border:1px solid rgba(192,57,43,0.25);border-radius:0.5rem;padding:1rem;margin-top:1.2rem;text-align:left;font-size:0.83rem">'
      + '<b style="color:var(--accent)">⚠️ Análisis de fallos</b><br>'
      + '<span style="color:var(--muted)">' + buildRecommendation(analysis) + '</span></div>';
  }

  html += '<div style="margin-top:1.5rem;text-align:left;display:flex;flex-direction:column;gap:0.6rem;max-height:400px;overflow-y:auto">';
  details.forEach(d => {
    html += '<div style="padding:0.7rem 1rem;border-radius:0.4rem;font-size:0.8rem;background:' + (d.ok ? 'rgba(39,112,74,0.08)' : 'rgba(192,57,43,0.08)') + ';border:1px solid ' + (d.ok ? 'rgba(39,112,74,0.3)' : 'rgba(192,57,43,0.3)') + '">'
      + '<div style="color:var(--muted);font-size:0.65rem;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.3rem">' + d.context + '</div>'
      + '<div style="font-style:italic;margin-bottom:0.4rem">' + d.question + '</div>'
      + (d.ok ? '<div style="color:var(--success)">✓ ' + d.given + '</div>'
        : '<div style="color:var(--error)">✗ Tu respuesta: "' + (d.given || '—') + '"</div><div style="color:var(--accent2);margin-top:0.2rem">→ ' + d.answer + '</div>')
      + '</div>';
  });

  html += '</div><div class="btn-row" style="justify-content:center;margin-top:2rem;flex-wrap:wrap">'
    + '<button class="btn btn-primary" onclick="startExam(false)">🔄 Repetir</button>'
    + (failed.length ? '<button class="btn btn-ghost" style="border-color:var(--error);color:var(--error)" onclick="studyErrors()">📌 Estudiar fallos (' + errorLog.length + ')</button>' : '')
    + '<button class="btn btn-ghost" onclick="renderExamStart()">Menú</button>'
    + '</div></div>';

  document.getElementById('exam-area').innerHTML = html;
}
