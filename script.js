document.addEventListener('DOMContentLoaded', () => {
  // Fireworks Animation
  const canvas = document.getElementById('fogosCanvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let particles = [];

  function createFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height / 2;
    const colors = ['#ff4d4d', '#ffcc00', '#66ff66', '#66ccff', '#ff99cc'];

    for (let i = 0; i < 25; i++) {
      particles.push({
        x: x,
        y: y,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * 2 * Math.PI,
        speed: Math.random() * 5 + 2,
        alpha: 1
      });
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, index) => {
      const vx = Math.cos(p.angle) * p.speed;
      const vy = Math.sin(p.angle) * p.speed;

      p.x += vx;
      p.y += vy;
      p.alpha -= 0.02;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(${hexToRgb(p.color)}, ${p.alpha})`;
      ctx.fill();

      if (p.alpha <= 0) {
        particles.splice(index, 1);
      }
    });

    requestAnimationFrame(animateParticles);
  }

  function hexToRgb(hex) {
    const bigint = parseInt(hex.replace('#', ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r},${g},${b}`;
  }

  setInterval(createFirework, 1500);
  animateParticles();

  // Random Messages
  const mensagens = [
    "Sinto sua falta o tempo todo.",
    "Te amo mais do que consigo explicar.",
    "Você é meu lugar seguro.",
    "Queria te abraçar agora.",
    "Mesmo longe, você tá em mim.",
    "Tudo lembra você.",
    "Você me acalma só de existir.",
    "Hoje eu pensei em você de novo (como sempre).",
    "Queria poder te olhar agora.",
    "Meu peito aperta de saudade.",
    "Te encontrar mudou tudo.",
    "Sou mais eu quando tô com você.",
    "Você é minha melhor escolha.",
    "Te amo por tudo o que você é.",
    "Sorte a minha te ter na vida.",
    "A gente é um milagre.",
    "Tem amor aqui por você todos os dias.",
    "Eu ainda me lembro do Hopi Hari...",
    "Você fez morada em mim.",
    "Você é a luz no meu caos.",
    "Acordar pensando em você já virou rotina.",
    "Se eu pudesse, ia até você agora.",
    "A saudade grita quando você não tá.",
    "Você é minha meta de paz.",
    "Você é meu descanso favorito.",
    "Te amo com todas as minhas versões.",
    "Te amo até nos silêncios.",
    "Tudo com você tem mais sentido.",
    "Você é o lar que escolhi amar.",
    "Mesmo nos dias difíceis, você me faz melhor."
  ];

  function novaMensagem() {
    const mensagemElemento = document.getElementById("mensagemAleatoria");
    const mensagemAleatoria = mensagens[Math.floor(Math.random() * mensagens.length)];
    mensagemElemento.textContent = `"${mensagemAleatoria}"`;
  }

  novaMensagem();
  setInterval(novaMensagem, 5000);

  // Confetti Animation
  const confettiCanvas = document.getElementById('confetti-canvas');
  const confettiInstance = confetti.create(confettiCanvas, { resize: true });
  const triggerConfetti = () => {
    confettiInstance({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#F8CFE8', '#CC3366', '#FFF'],
    });
  };
  const aniversarioSection = document.getElementById('aniversario');
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      triggerConfetti();
    }
  }, { threshold: 0.5 });
  observer.observe(aniversarioSection);

  // Music Player
  const audios = document.querySelectorAll('audio');
  const musicaContainers = document.querySelectorAll('.musica');
  const playAllButton = document.querySelector('.play-all');

  audios.forEach((audio, index) => {
    audio.addEventListener('play', () => {
      audios.forEach((otherAudio, otherIndex) => {
        if (otherAudio !== audio) {
          otherAudio.pause();
          otherAudio.currentTime = 0;
          musicaContainers[otherIndex].classList.remove('playing');
        }
      });
      musicaContainers[index].classList.add('playing');
    });

    audio.addEventListener('pause', () => {
      musicaContainers[index].classList.remove('playing');
    });

    audio.addEventListener('ended', () => {
      musicaContainers[index].classList.remove('playing');
      if (index < audios.length - 1) {
        audios[index + 1].play();
      }
    });
  });

  playAllButton.addEventListener('click', () => {
    audios.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
      musicaContainers.forEach(container => container.classList.remove('playing'));
    });
    audios[0].play();
  });

  // Lightbox for Gallery
  const galleryImages = document.querySelectorAll('.gallery-img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  galleryImages.forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
    });
  });

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });

  // Download Birthday Card
  const downloadButton = document.querySelector('.download-card');
  downloadButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = 'birthday_card.pdf';
    link.download = 'Cartao_Aniversario_Tata.pdf';
    link.click();
  });

  // Back to Top Button
  const backToTopButton = document.querySelector('.back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });

  // Section Animations
  const sections = document.querySelectorAll('.section');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = '0.2s';
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => sectionObserver.observe(section));
});