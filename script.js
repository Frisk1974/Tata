function enterSite() {
  document.getElementById('intro').classList.add('hidden');
  document.getElementById('mainContent').classList.remove('hidden');
}

function showSection(sectionId) {
  const sections = ['bilhetes', 'musicas'];
  sections.forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });

  document.getElementById(sectionId).classList.remove('hidden');
}
