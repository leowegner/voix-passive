// ============================================================
// QUIZ
// ============================================================
let quizItems = [], quizIndex = 0, quizScore = 0, quizWrong = [];

function startQuiz() {
  const conj = [];
  tenses.filter(t => isTenseActive(t.name)).forEach(t => t.rows.forEach(r => conj.push({
    q: r.pro + ' ___ (être) — ' + t.name,
    hint: t.es,
    correct: r.fr,
    pool: tenses.flatMap(tt => tt.rows.map(rr => rr.fr)),
    type: 'conj', tense: t.name, context: t.name + ' — ' + t.es,
    question: r.pro + ' ___ (être)', answer: r.fr,
  })));
  const pasv = passiveTenses.filter(p => isTenseActive(p.tense)).map(p => ({
    q: 'Être en ' + p.tense + ' — ¿cuál es la fórmula pasiva?',
    hint: p.es,
    correct: p.formula,
    pool: passiveTenses.map(pp => pp.formula),
    type: 'conj', tense: p.tense, context: 'Fórmula pasiva — ' + p.tense,
    question: 'Être en ' + p.tense, answer: p.formula,
  }));
  quizItems = shuffle([...conj, ...pasv]).slice(0, 200);
  quizIndex = 0; quizScore = 0; quizWrong = [];
  renderQuiz();
}

function renderQuiz() {
  if (quizIndex >= quizItems.length) {
    const pct = Math.round(quizScore / quizItems.length * 100);
    const cls = pct >= 70 ? 'good' : pct >= 40 ? 'mid' : 'bad';
    const analysis = quizWrong.length ? analyzeErrors() : null;
    document.getElementById('quiz-area').innerHTML =
      '<div class="results-box">'
      + '<div class="results-score ' + cls + '">' + quizScore + '/' + quizItems.length + '</div>'
      + '<p style="color:var(--muted);margin-top:0.75rem">' + pct + '% de aciertos</p>'
      + '<p style="color:var(--ink);margin-top:0.5rem;font-family:\'Playfair Display\',serif;font-style:italic">' + (pct >= 70 ? '¡Très bien! 🎉' : pct >= 40 ? 'Pas mal, continue! 💪' : 'Il faut travailler encore! 📚') + '</p>'
      + (quizWrong.length ? '<div style="background:rgba(192,57,43,0.07);border:1px solid rgba(192,57,43,0.25);border-radius:0.5rem;padding:1rem;margin-top:1.5rem;text-align:left;font-size:0.83rem"><b style="color:var(--accent)">⚠️ ' + quizWrong.length + ' errores registrados</b><br><span style="color:var(--muted)">' + buildRecommendation(analysis) + '</span></div>' : '')
      + '<div class="btn-row" style="justify-content:center;margin-top:2rem;flex-wrap:wrap">'
      + '<button class="btn btn-primary" onclick="startQuiz()">🔄 Repetir quiz</button>'
      + (quizWrong.length ? '<button class="btn btn-ghost" style="border-color:var(--error);color:var(--error)" onclick="studyErrors()">📌 Estudiar fallos (' + quizWrong.length + ')</button>' : '')
      + '</div></div>';
    updateErrorBadge();
    return;
  }
  const item = quizItems[quizIndex];
  const wrongs = shuffle([...new Set(item.pool)].filter(v => normalize(v) !== normalize(item.correct))).slice(0, 3);
  const opts = shuffle([item.correct, ...wrongs]);
  document.getElementById('quiz-area').innerHTML =
    '<div class="quiz-score-bar"><span>' + (quizIndex + 1) + ' / ' + quizItems.length + '</span><span>Puntos: <span class="quiz-score-val">' + quizScore + '</span></span></div>'
    + '<div class="quiz-card"><div class="quiz-q">' + item.q + '</div><div class="quiz-hint">' + item.hint + '</div>'
    + '<div class="quiz-options">' + opts.map(o => '<div class="quiz-opt" onclick="selectQuiz(this,\'' + o.replace(/'/g, "\\'") + '\',\'' + item.correct.replace(/'/g, "\\'") + '\',' + quizIndex + ')">' + o + '</div>').join('') + '</div></div>';
}

function selectQuiz(el, chosen, correct, idx) {
  document.querySelectorAll('.quiz-opt').forEach(o => o.classList.add('disabled'));
  if (chosen === correct) { el.classList.add('correct'); quizScore++; }
  else {
    el.classList.add('wrong');
    document.querySelectorAll('.quiz-opt').forEach(o => { if (o.textContent.trim() === correct) o.classList.add('correct'); });
    const item = quizItems[idx];
    logError(item);
    quizWrong.push(item);
    updateErrorBadge();
  }
  setTimeout(() => { quizIndex++; renderQuiz(); }, 1100);
}
