const bilhetes = [
  "Você é minha luz em dia nublado.",
  "Seu sorriso é meu lugar favorito.",
  "Sinto saudade até quando ainda tô com você.",
  /* ... mais bilhetes ... */
];

const musics = [
  {title:"505 – Arctic Monkeys", snippet:"\"I'm going back to 505...\""},
  {title:"Best Part – Daniel Caesar", snippet:"\"You're my end and my beginning...\""},
  {title:"Love On The Brain – Rihanna", snippet:"\"Must be love on the brain...\""},
  /* ... */
];

window.onload = () => {
  const bArea = document.getElementById('bilheteArea');
  bilhetes.forEach(txt => {
    const div = document.createElement('div');
    div.className = 'bilhete';
    div.textContent = txt;
    bArea.appendChild(div);
  });

  const mArea = document.getElementById('musicCards');
  musics.forEach(m => {
    const c = document.createElement('div');
    c.className = 'card';
    c.innerHTML = `<p>${m.title}</p><small>${m.snippet}</small>`;
    mArea.appendChild(c);
  });
};
