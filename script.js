document.addEventListener('DOMContentLoaded', () => {
  // Global error handler for debugging
  window.addEventListener('error', (e) => {
    console.error('Global error:', e.message, 'at', e.filename, e.lineno);
  });

  // Menu Toggle Functionality
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  const menuClose = document.querySelector('.menu-close');

  if (menuToggle && menu && menuClose) {
    let lastTap = 0;
    menuToggle.addEventListener('click', (e) => toggleMenu(e, 'click'));
    menuToggle.addEventListener('touchstart', (e) => toggleMenu(e, 'touchstart'), { passive: true });
    menuToggle.addEventListener('touchend', (e) => toggleMenu(e, 'touchend'), { passive: true });

    menuClose.addEventListener('click', (e) => closeMenu(e, 'click'));
    menuClose.addEventListener('touchstart', (e) => closeMenu(e, 'touchstart'), { passive: true });
    menuClose.addEventListener('touchend', (e) => closeMenu(e, 'touchend'), { passive: true });

    const menuLinks = document.querySelectorAll('.menu a');
    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        console.log('Menu link clicked:', link.href);
        try {
          if (window.innerWidth <= 768) {
            menu.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
          }
          window.location.href = link.href;
        } catch (err) {
          console.error('Navigation error:', err);
        }
      });
      link.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTap < 300) return; // Debounce rapid taps
        lastTap = now;
        console.log('Menu link touched:', link.href);
        try {
          if (window.innerWidth <= 768) {
            menu.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
          }
          window.location.href = link.href;
        } catch (err) {
          console.error('Navigation error:', err);
        }
      }, { passive: true });
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !menuToggle.contains(e.target) && menu.classList.contains('open')) {
        closeMenu(e, 'click outside');
      }
    });

    document.addEventListener('touchend', (e) => {
      if (!menu.contains(e.target) && !menuToggle.contains(e.target) && menu.classList.contains('open')) {
        closeMenu(e, 'touch outside');
      }
    }, { passive: true });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu(e, 'escape key');
      }
    });

    function toggleMenu(e, type) {
      const now = Date.now();
      if (now - lastTap < 300) return; // Debounce rapid taps
      lastTap = now;
      e.preventDefault();
      console.log('Menu toggle triggered:', type);
      try {
        const isOpen = menu.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
        document.body.classList.toggle('no-scroll', isOpen);
        if (isOpen) {
          menu.querySelector('a').focus();
        }
      } catch (err) {
        console.error('Toggle menu error:', err);
      }
    }

    function closeMenu(e, type) {
      console.log('Menu closed:', type);
      try {
        menu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
        menuToggle.focus();
      } catch (err) {
        console.error('Close menu error:', err);
      }
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
    const audios = document.querySelectorAll>('audio');
    const musicaContainers = document.querySelectorAll('.musica');
    const playAllButton = document.querySelector('.play-all');

    if (playAllButton) {
      playAllButton.addEventListener('click', () => {
        console.log('Play all button clicked');
        try {
          audios.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
            musicaContainers.forEach(container => container.classList.remove('playing'));
          });
          audios[0].play();
        } catch (err) {
          console.error('Play all error:', err);
        }
      });
      playAllButton.addEventListener('touchend', () => {
        const now = Date.now();
        if (now - lastTap < 300) return;
        lastTap = now;
        console.log('Play all button touched');
        try {
          audios.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
            musicaContainers.forEach(container => container.classList.remove('playing'));
          });
          audios[0].play();
        } catch (err) {
          console.error('Play all error:', err);
        }
      }, { passive: true });
    } else {
      console.warn('Play all button not found on musicas.html');
    }

    audios.forEach((audio, index) => {
      audio.addEventListener('play', () => {
        console.log('Audio playing:', audio.src);
        try {
          audios.forEach((otherAudio, otherIndex) => {
            if (otherAudio !== audio) {
              otherAudio.pause();
              otherAudio.currentTime = 0;
              musicaContainers[otherIndex].classList.remove('playing');
            }
          });
          musicaContainers[index].classList.add('playing');
        } catch (err) {
          console.error('Audio play error:', err);
        }
      });

      audio.addEventListener('pause', () => {
        console.log('Audio paused:', audio.src);
        try {
          musicaContainers[index].classList.remove('playing');
        } catch (err) {
          console.error('Audio pause error:', err);
        }
      });

      audio.addEventListener('ended', () => {
        console.log('Audio ended:', audio.src);
        try {
          musicaContainers[index].classList.remove('playing');
          if (index < audios.length - 1) {
            audios[index + 1].play();
          }
        } catch (err) {
          console.error('Audio ended error:', err);
        }
      });
    });
  }

  // Lightbox for Gallery (galeria.html)
  if (window.location.pathname.includes('galeria.html')) {
    const galleryImages = document.querySelectorAll('.gallery-img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    galleryImages.forEach(img => {
      img.addEventListener('click', () => {
        console.log('Gallery image clicked:', img.src);
        try {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.classList.add('active');
        } catch (err) {
          console.error('Gallery image error:', err);
        }
      });
      img.addEventListener('touchend', () => {
        const now = Date.now();
        if (now - lastTap < 300) return;
        lastTap = now;
        console.log('Gallery image touched:', img.src);
        try {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.classList.add('active');
        } catch (err) {
          console.error('Gallery image error:', err);
        }
      }, { passive: true });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        console.log('Lightbox close clicked');
        try {
          lightbox.classList.remove('active');
        } catch (err) {
          console.error('Lightbox close error:', err);
        }
      });
      lightboxClose.addEventListener('touchend', () => {
        const now = Date.now();
        if (now - lastTap < 300) return;
        lastTap = now;
        console.log('Lightbox close touched');
        try {
          lightbox.classList.remove('active');
        } catch (err) {
          console.error('Lightbox close error:', err);
        }
      }, { passive: true });
    }

    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          console.log('Lightbox background clicked');
          try {
            lightbox.classList.remove('active');
          } catch (err) {
            console.error('Lightbox background error:', err);
          }
        }
      });
      lightbox.addEventListener('touchend', (e) => {
        if (e.target === lightbox) {
          const now = Date.now();
          if (now - lastTap < 300) return;
          lastTap = now;
          console.log('Lightbox background touched');
          try {
            lightbox.classList.remove('active');
          } catch (err) {
            console.error('Lightbox background error:', err);
          }
        }
      }, { passive: true });
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
      try {
        const randomIndex = Math.floor(Math.random() * mensagens.length);
        mensagemElement.textContent = mensagens[randomIndex];
      } catch (err) {
        console.error('Random message error:', err);
      }
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
    const motivoButton = document.querySelector('.motivos button');
    function mostrarOutroMotivo() {
      try {
        const randomIndex = Math.floor(Math.random() * motivos.length);
        motivoElement.textContent = motivos[randomIndex];
      } catch (err) {
        console.error('Motivo error:', err);
      }
    }
    window.mostrarOutroMotivo = mostrarOutroMotivo;
    if (motivoButton) {
      let lastTap = 0;
      motivoButton.addEventListener('click', () => {
        console.log('Motivo button clicked');
        mostrarOutroMotivo();
      });
      motivoButton.addEventListener('touchend', () => {
        const now = Date.now();
        if (now - lastTap < 300) return;
        lastTap = now;
        console.log('Motivo button touched');
        mostrarOutroMotivo();
      }, { passive: true });
    }
    mostrarOutroMotivo();
  }

  // Relationship Counter (contador.html)
  if (window.location.pathname.includes('contador.html')) {
    const startDate = new Date('2024-11-09T00:00:00');
    const contadorElement = document.getElementById('contador');

    function updateCounter() {
      try {
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
      } catch (err) {
        console.error('Counter error:', err);
      }
    }
    updateCounter();
    setInterval(updateCounter, 1000);
  }

  // Dreams Descriptions (sonhos.html)
  if (window.location.pathname.includes('sonhos.html')) {
    const dreamItems = document.querySelectorAll('#sonhos ul li');
    let lastTap = 0;
    dreamItems.forEach(item => {
      item.addEventListener('click', handleDreamClick);
      item.addEventListener('touchstart', handleDreamClick, { passive: true });
      item.addEventListener('touchend', handleDreamClick, { passive: true });
    });

    function handleDreamClick(e) {
      const now = Date.now();
      if (now - lastTap < 300) return; // Debounce rapid taps
      lastTap = now;
      e.preventDefault();
      console.log('Dream item triggered:', e.type, this.textContent.trim());
      try {
        const description = this.querySelector('.dream-description');
        const isActive = description.classList.contains('active');

        document.querySelectorAll('.dream-description').forEach(desc => {
          desc.classList.remove('active');
        });

        if (!isActive) {
          description.classList.add('active');
        }
      } catch (err) {
        console.error('Dream click error:', err);
      }
    }
  }

  // Back to Top Button
  const backToTopButton = document.querySelector('.back-to-top');
  if (backToTopButton) {
    let lastTap = 0;
    backToTopButton.addEventListener('click', () => {
      console.log('Back to top clicked');
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error('Back to top error:', err);
      }
    });
    backToTopButton.addEventListener('touchend', () => {
      const now = Date.now();
      if (now - lastTap < 300) return;
      lastTap = now;
      console.log('Back to top touched');
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error('Back to top error:', err);
      }
    }, { passive: true });

    window.addEventListener('scroll', () => {
      backToTopButton.classList.toggle('visible', window.scrollY > 300);
    });
  }
});