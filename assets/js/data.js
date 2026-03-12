// ============================================================
// DATA LOADER
// Fetches assets/data/data.json and boots the app.
// Requires a local HTTP server (e.g. VSCode Live Server).
// ============================================================
fetch('assets/data/data.json')
  .then(r => r.json())
  .then(data => {
    window.tenses            = data.tenses;
    window.transforms        = data.transforms;
    window.passiveTenses     = data.passiveTenses;
    window.transformExercises = data.transformExercises;
    initApp();
  })
  .catch(err => {
    document.body.innerHTML =
      '<p style="padding:2rem;color:red">Error cargando datos: ' + err.message +
      '<br>Abre la app con un servidor local (p. ej. VSCode Live Server).</p>';
  });
