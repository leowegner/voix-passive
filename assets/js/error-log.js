// ============================================================
// GLOBAL ERROR TRACKER
// ============================================================
let errorLog = [];

function logError(item) {
  if (!errorLog.find(e => e.question === item.question && e.answer === item.answer)) {
    errorLog.push({ ...item });
  }
}

function clearErrors() {
  errorLog = [];
  updateErrorBadge();
}

function updateErrorBadge() {
  const hdr = document.getElementById('error-header');
  const cnt = document.getElementById('error-count');
  const btn = hdr ? hdr.querySelector('.error-btn') : null;
  const hasErrors = errorLog.length > 0;
  if (cnt) cnt.textContent = '(' + errorLog.length + ')';
  if (hdr) hdr.classList.toggle('is-empty', !hasErrors);
  if (btn) {
    btn.classList.toggle('is-disabled', !hasErrors);
    btn.toggleAttribute('disabled', !hasErrors);
  }
}

function analyzeErrors() {
  if (!errorLog.length) return null;
  const byTense = {};
  const byType = { conj: 0, actpas: 0 };
  errorLog.forEach(e => {
    const t = e.tense || e.context || 'Otro';
    byTense[t] = (byTense[t] || 0) + 1;
    if (e.type === 'conj') byType.conj++;
    else byType.actpas++;
  });
  const worstTense = Object.entries(byTense).sort((a, b) => b[1] - a[1])[0];
  return { byTense, byType, worstTense, total: errorLog.length };
}

function buildRecommendation(analysis) {
  if (!analysis) return '';
  const lines = [];
  if (analysis.byType.conj > 0 && analysis.byType.actpas > 0) {
    lines.push('Tienes fallos en <b>conjugación</b> (' + analysis.byType.conj + ') y en <b>transformaciones</b> (' + analysis.byType.actpas + ').');
  } else if (analysis.byType.conj > 0) {
    lines.push('Tus fallos son principalmente de <b>conjugación</b> (' + analysis.byType.conj + ').');
  } else {
    lines.push('Tus fallos son principalmente de <b>transformaciones activo↔pasivo</b> (' + analysis.byType.actpas + ').');
  }
  if (analysis.worstTense) {
    lines.push('El tiempo con más errores es <b>' + analysis.worstTense[0] + '</b> (' + analysis.worstTense[1] + ' fallos). Revisa esa sección en las Tablas.');
  }
  return lines.join(' ');
}
