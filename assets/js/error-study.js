// ============================================================
// ERROR STUDY
// ============================================================
function studyErrors() {
  if (!errorLog.length) { alert('¡No tienes fallos guardados! 🎉'); return; }
  document.querySelectorAll('.mode-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-practice').classList.add('active');
  document.querySelector('nav button[onclick*="practice"]').classList.add('active');

  const items = shuffle(errorLog).slice(0, 50);
  const analysis = analyzeErrors();
  const html = '<div style="background:rgba(192,57,43,0.07);border:1px solid rgba(192,57,43,0.3);border-radius:0.5rem;padding:1rem 1.2rem;margin-bottom:1.2rem;font-size:0.85rem">'
    + '<b style="color:var(--accent)">📌 Practicando tus ' + errorLog.length + ' fallos</b><br>'
    + '<span style="color:var(--muted)">' + buildRecommendation(analysis) + '</span>'
    + '<div class="btn-row" style="margin-top:0.75rem">'
    + '<button class="btn btn-ghost" onclick="clearErrors();startPractice()" style="font-size:0.7rem;padding:0.4rem 0.8rem">✓ Limpiar fallos</button>'
    + '<button class="btn btn-ghost" onclick="checkAllPractice()" style="font-size:0.7rem;padding:0.4rem 0.8rem">✓ Corregir todo</button>'
    + '</div></div>'
    + items.map((item, i) => {
      const isAP = item.type === 'actpas';
      const label = isAP ? (item.direction === 'active→passive' ? '🔄 Transforma al pasivo' : '🔄 Transforma al activo') : '🇫🇷 Conjuga être';
      return '<div class="practice-card" id="pcard-' + i + '" data-answer="' + (item.answer || '').replace(/"/g, '&quot;') + '">'
        + '<div class="p-label">' + label + ' <span style="color:var(--error);font-size:0.65rem;margin-left:0.5rem">— fallo anterior</span></div>'
        + '<div class="p-context">' + (item.tense || item.context || '') + '</div>'
        + '<div class="p-question">' + item.question + '</div>'
        + '<input class="p-input" id="pinp-' + i + '" placeholder="Ta réponse…" onkeydown="if(event.key===\'Enter\')checkPractice(' + i + ')">'
        + '<div class="p-feedback" id="pfb-' + i + '"></div>'
        + '</div>';
    }).join('');
  document.getElementById('practice-cards').innerHTML = html;
}
