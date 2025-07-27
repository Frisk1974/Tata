document.addEventListener('DOMContentLoaded', () => {
  // Fireworks Animation (runs on all pages)
  const canvas = document.getElementById('fogosCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  function resizeCanvas() {
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }

  if (canvas) {
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
  }

  // Confetti Animation (aniversario.html)
  if (window.location.pathname.includes('aniversario.html')) {
    const confettiCanvas = document.getElementById('confetti-canvas');
    const confettiInstance = confettiCanvas ? confetti.create(confettiCanvas, { resize: true }) : null;
    const triggerConfetti = () => {
      if (confettiInstance) {
        confettiInstance({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#F8CFE8', '#CC3366', '#FFF'],
        });
      }
    };
    const aniversarioSection = document.getElementById('aniversario');
    if (aniversarioSection) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          triggerConfetti();
        }
      }, { threshold: 0.5 });
      observer.observe(aniversarioSection);
    } else {
      console.warn('Element #aniversario not found on aniversario.html');
    }
  }

  // Music Player (musicas.html)
  if (window.location.pathname.includes('musicas.html')) {
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

    if (playAllButton) {
      playAllButton.addEventListener('click', () => {
        audios.forEach(audio => {
          audio.pause();
          audio.currentTime = 0;
          musicaContainers.forEach(container => container.classList.remove('playing'));
        });
        audios[0].play();
      });
    } else {
      console.warn('Play all button not found on musicas.html');
    }
  }

  // Lightbox for Gallery (galeria.html)
  if (window.location.pathname.includes('galeria.html')) {
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

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
      });
    }

    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          lightbox.classList.remove('active');
        }
      });
    } else {
      console.warn('Lightbox element not found on galeria.html');
    }
  }

  // Random Messages (recado.html)
  if (window.location.pathname.includes('recado.html')) {
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
      if (mensagemElemento) {
        const mensagemAleatoria = mensagens[Math.floor(Math.random() * mensagens.length)];
        mensagemElemento.textContent = `"${mensagemAleatoria}"`;
      } else {
        console.warn('Element #mensagemAleatoria not found on recado.html');
      }
    }

    novaMensagem();
    setInterval(novaMensagem, 5000);
  }

  // Relationship Time Counter (contador.html)
  if (window.location.pathname.includes('contador.html')) {
    const inicio = new Date("2024-11-09T00:00:00");

    function atualizarContador() {
      const agora = new Date();
      const diff = agora - inicio;

      let anos = agora.getFullYear() - inicio.getFullYear();
      let meses = agora.getMonth() - inicio.getMonth();
      let dias = agora.getDate() - inicio.getDate();
      let horas = agora.getHours() - inicio.getHours();
      let minutos = agora.getMinutes() - inicio.getMinutes();
      let segundos = agora.getSeconds() - inicio.getSeconds();

      if (segundos < 0) {
        segundos += 60;
        minutos--;
      }
      if (minutos < 0) {
        minutos += 60;
        horas--;
      }
      if (horas < 0) {
        horas += 24;
        dias--;
      }
      if (dias < 0) {
        dias += new Date(agora.getFullYear(), agora.getMonth(), 0).getDate();
        meses--;
      }
      if (meses < 0) {
        meses += 12;
        anos--;
      }

      const contadorElement = document.getElementById("contador");
      if (contadorElement) {
        contadorElement.textContent = `${anos} anos, ${meses} meses, ${dias} dias, ${horas.toString().padStart(2, '0')} horas, ${minutos.toString().padStart(2, '0')} minutos, ${segundos.toString().padStart(2, '0')} segundos`;
      } else {
        console.warn('Element #contador not found on contador.html');
      }
    }

    setInterval(atualizarContador, 1000);
    atualizarContador();
  }

  // Reasons I Love You (motivos.html)
  if (window.location.pathname.includes('motivos.html')) {
    const motivos = [
      "O jeito que você fica do meu lado",
      "As vezes que você faz questão de garantir que nada vai me machucar",
      "Quando eu tô triste, você tira a dor com uma piada",
      "Como você sempre olha fundo nos meus olhos",
      "Como você derrete meu coração com seus lábios suaves",
      "O jeito que você nunca solta minha mão",
      "Como você sempre cuida de mim",
      "Como você sempre sabe o que dizer quando eu fico bravo com você",
      "Quando você me dá presentes do nada",
      "Como você fala as coisas mais fofas várias vezes e nunca fica chato",
      "As vezes em que você fez de tudo pra eu não ficar bravo com você",
      "O sorriso que você dá depois que eu te beijo",
      "O jeito que você não tem vergonha de dizer ou fazer nada na minha frente",
      "Como você me defende sem medo nenhum",
      "O jeito que você anda quando fica triste",
      "Quando eu tô me sentindo um lixo e você me faz sentir a pessoa mais feliz",
      "O jeito brega que você canta pra mim",
      "Como você dirige horas só pra me ver por um dia",
      "Como você sempre termina minhas frases",
      "Como você é a única pessoa que não acha que eu sou esquisito",
      "Como só você entende minhas piadas… e ainda ri",
      "O jeito que a gente joga jogos idiotas, mas mesmo assim você joga comigo",
      "Como eu nunca consigo te odiar",
      "Como você me ama como ninguém mais ama",
      "Como você me conta histórias longas que não têm sentido, mas sabe que eu vou escutar mesmo assim",
      "Como você me ouve falar por horas",
      "Como você me perdoa quando eu erro",
      "O jeito que você me olha depois que eu digo 'eu te amo'",
      "O jeito que você não tem vergonha de me chamar de coisas fofas na frente dos outros",
      "O jeito que você me liga a cada maldito minuto",
      "Como você sempre dá um jeito de me ver ou falar comigo",
      "Como você me coloca acima dos seus amigos",
      "O jeito que você chama minha atenção",
      "O jeito que eu te deixo excitado sem nem fazer nada",
      "Como você não tem medo de me contar o que sente",
      "Como você deixa de ir pra festas só pra ficar a noite toda comigo em casa",
      "Como a gente passa a noite toda no telefone",
      "Como a gente se dá tão bem",
      "O jeito que você gasta todo o seu dinheiro comprando créditos pra me ligar",
      "Como você me faz sentir quando eu acho que não sou nada",
      "O jeito que você me inspira com seus pensamentos e sentimentos"
    ];

    let motivoAtual = -1;

    window.mostrarOutroMotivo = function() {
      let novoMotivo;
      do {
        novoMotivo = Math.floor(Math.random() * motivos.length);
      } while (novoMotivo === motivoAtual);
      motivoAtual = novoMotivo;

      const div = document.getElementById("motivo");
      if (div) {
        div.style.opacity = 0;
        setTimeout(() => {
          div.textContent = motivos[motivoAtual];
          div.style.opacity = 1;
        }, 200);
      } else {
        console.warn('Element #motivo not found on motivos.html');
      }
    };

    window.mostrarOutroMotivo();
  }

  // Back to Top Button
  const backToTopButton = document.querySelector('.back-to-top');
  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 200) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });
  }

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