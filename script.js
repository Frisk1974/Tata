const bilhetes = [
  "Você é minha luz em dia nublado.",
  "Seu sorriso é meu lugar favorito.",
  "Sinto saudade até quando ainda tô com você.",
  "Você é o meu porto seguro, sempre.",
  "Cada instante contigo é um tesouro.",
  "Te amo além das palavras.",
  "Você me faz querer ser melhor a cada dia.",
  "Nosso amor é meu melhor presente.",
  "Sem você, o mundo perde cor.",
  "Teu abraço é meu refúgio.",
  "Com você, qualquer lugar vira lar.",
  "Você é meu sonho acordado.",
  "Nada é impossível quando estamos juntos.",
  "A tua voz é minha melodia favorita.",
  "Você me completa de um jeito único.",
  "Nosso amor é a história que mais quero contar.",
  "Te amar é meu ato mais corajoso.",
  "Cada momento contigo vale por mil.",
  "Somos poesia em movimento.",
  "Com você, descobri o que é felicidade.",
];

const musics = [
  { title: "505 – Arctic Monkeys", snippet: `"I'm going back to 505..."` },
  { title: "Best Part – Daniel Caesar", snippet: `"You're my end and my beginning..."` },
  { title: "Love On The Brain – Rihanna", snippet: `"Must be love on the brain..."` },
  { title: "Chasing Cars – Snow Patrol", snippet: `"If I lay here, if I just lay here..."` },
  { title: "The Night We Met – Lord Huron", snippet: `"I had all and then most of you..."` },
  { title: "All Of Me – John Legend", snippet: `"Cause all of me loves all of you..."` },
  { title: "Fix You – Coldplay", snippet: `"Lights will guide you home..."` },
  { title: "Yellow – Coldplay", snippet: `"Look at the stars, look how they shine for you..."` },
  { title: "Someone Like You – Adele", snippet: `"Never mind, I'll find someone like you..."` },
  { title: "Happier – Ed Sheeran", snippet: `"Cause baby you look happier..."` },
];

window.onload = () => {
  // Bilhetes
  const bArea = document.getElementById("bilheteArea");
  bilhetes.forEach((txt) => {
    const div = document.createElement("div");
    div.className = "bilhete";
    div.textContent = txt;
    bArea.appendChild(div);
  });

  // Música
  const mArea = document.getElementById("musicCards");
  musics.forEach((m) => {
    const c = document.createElement("div");
    c.className = "card";
    c.innerHTML = `<p>${m.title}</p><small>${m.snippet}</small>`;
    mArea.appendChild(c);
  });

  // Scroll buttons bilhetes
  const scrollLeftBtn = document.querySelector(".scroll-left");
  const scrollRightBtn = document.querySelector(".scroll-right");
  const bilheteArea = document.getElementById("bilheteArea");

  scrollLeftBtn.addEventListener("click", () => {
    bilheteArea.scrollBy({ left: -250, behavior: "smooth" });
  });

  scrollRightBtn.addEventListener("click", () => {
    bilheteArea.scrollBy({ left: 250, behavior: "smooth" });
  });
};
