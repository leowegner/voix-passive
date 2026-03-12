function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function normalize(s) {
  return s.toLowerCase()
    // Remove accents loosely — é=e, è=e, ê=e, etc.
    .replace(/[àâä]/g, 'a').replace(/[éêëè]/g, 'e').replace(/[îï]/g, 'i')
    .replace(/[ôö]/g, 'o').replace(/[ûü]/g, 'u').replace(/ç/g, 'c')
    // Remove apostrophes and quotes entirely so "c'est" matches "cest"
    .replace(/[''´`']/g, '')
    // Remove remaining punctuation
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ').trim();
}
