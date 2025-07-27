document.addEventListener('DOMContentLoaded', () => {
  // Menu Toggle Functionality
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  const menuClose = document.querySelector('.menu-close');

  if (menuToggle && menu && menuClose) {
    // Handle both click and touchstart for better mobile support
    menuToggle.addEventListener('click', toggleMenu);
    menuToggle.addEventListener('touchstart', toggleMenu, { passive: true });

    menuClose.addEventListener('click', closeMenu);
    menuClose.addEventListener('touchstart', closeMenu, { passive: true });

    // Ensure menu links navigate correctly
    const menuLinks = document.querySelectorAll('.menu a');
    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Close menu on mobile after clicking a link
        if (window.innerWidth <= 768) {
          menu.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('no-scroll');
        }
      });
    });

    // Close menu on clicking outside
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !menuToggle.contains(e.target) && menu.classList.contains('open')) {
        closeMenu();
      }
    });

    // Close menu on touch outside (mobile)
    document.addEventListener('touchstart', (e) => {
      if (!menu.contains(e.target) && !menuToggle.contains(e.target) && menu.classList.contains('open')) {
        closeMenu();
      }
    }, { passive: true });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
      }
    });

    function toggleMenu(e) {
      e.preventDefault();
      const isOpen = menu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('no-scroll', isOpen);
      if (isOpen) {
        menu.querySelector('a').focus();
      }
    }

    function closeMenu() {
      menu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
      menuToggle.focus();
    }
  } else {
    console.warn('Menu toggle elements not found on this page');
  }

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
      "Meu peito aperta de saudade."
    ];
    const mensagemElement = document.getElementById('mensagemAleatoria');
    function mostrarMensagemAleatoria() {
      const randomIndex = Math.floor(Math.random() * mensagens.length);
      mensagemElement.textContent = mensagens[randomIndex];
    }
    mostrarMensagemAleatoria();
    setInterval(mostrarMensagemAleatoria, 5000);
  }

  // Reasons (motivos.html)
  if (window.location.pathname.includes('motivos.html')) {
    const motivos = [
      "Porque seu sorriso ilumina meu mundo.",
      "Porque você me faz querer ser uma pessoa melhor.",
      "Porque cada momento com você é inesquecível.",
      "Porque sua risada é minha música favorita.",
      "Porque você é meu porto seguro.",
      "Porque sonhar com você é melhor que qualquer realidade.",
      "Porque seu carinho me faz sentir completo.",
      "Porque você é a razão do meu coração bater mais forte.",
      "Porque cada detalhe seu é perfeito pra mim.",
      "Porque te amo mais a cada dia."
    ];
    const motivoElement = document.getElementById('motivo');
    window.mostrarOutroMotivo = function() {
      const randomIndex = Math.floor(Math.random() * motivos.length);
      motivoElement.textContent = motivos[randomIndex];
    };
    window.mostrarOutroMotivo();
  }

  // Relationship Counter (contador.html)
  if (window.location.pathname.includes('contador.html')) {
    const startDate = new Date('2024-11-09T00:00:00');
    const contadorElement = document.getElementById('contador');

    function updateCounter() {
      const now = new Date();
      const diff = now - startDate;

      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
      const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
      const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      contadorElement.innerHTML = `
        ${years > 0 ? `${years} ano${years > 1 ? 's' : ''}` : ''} 
        ${months > 0 ? `${months} mese${months > 1 ? 's' : ''}` : ''} 
        ${days} dia${days > 1 ? 's' : ''} 
        ${hours} hora${hours > 1 ? 's' : ''} 
        ${minutes} minuto${minutes > 1 ? 's' : ''} 
        ${seconds} segundo${seconds > 1 ? 's' : ''}
      `;
    }
    updateCounter();
    setInterval(updateCounter, 1000);
  }

  // Dreams Descriptions (sonhos.html)
  if (window.location.pathname.includes('sonhos.html')) {
    const dreamItems = document.querySelectorAll('#sonhos ul li');
    dreamItems.forEach(item => {
      item.addEventListener('click', handleDreamClick);
      item.addEventListener('touchstart', handleDreamClick, { passive: true });
    });

    function handleDreamClick(e) {
      e.preventDefault();
      const description = this.querySelector('.dream-description');
      const isActive = description.classList.contains('active');

      // Hide all descriptions
      document.querySelectorAll('.dream-description').forEach(desc => {
        desc.classList.remove('active');
      });

      // Toggle the clicked description
      if (!isActive) {
        description.classList.add('active');
      }
    }
  }

  // Back to Top Button
  const backToTopButton = document.querySelector('.back-to-top');
  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      backToTopButton.classList.toggle('visible', window.scrollY > 300);
    });
  }
});