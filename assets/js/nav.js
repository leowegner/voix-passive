// ============================================================
// NAV
// ============================================================
function switchMode(mode) {
  document.querySelectorAll('.mode-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + mode).classList.add('active');
  event.currentTarget.classList.add('active');
  if (mode === 'practice') startPractice();
  else if (mode === 'quiz') startQuiz();
  else if (mode === 'exam') renderExamStart();
}

// ============================================================
// INIT
// ============================================================
renderTables();
renderActivoPasivo();
initTenseSelector();
updateErrorBadge();
