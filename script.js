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
        if (now - lastTap < 300) return;
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
      if (now - lastTap < 300) return;
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

  // Music Player (musicas.html)
  if (window.location.pathname.includes('musicas.html')) {
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.querySelector('.play-pause-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const shuffleBtn = document.querySelector('.shuffle-btn');
    const loopBtn = document.querySelector('.loop-btn');
    const volumeBtn = document.querySelector('.volume-btn');
    const progressBar = document.querySelector('.progress-bar');
    const volumeBar = document.querySelector('.volume-bar');
    const currentTime = document.querySelector('.current-time');
    const duration = document.querySelector('.duration');
    const trackCover = document.querySelector('.track-cover');
    const trackTitle = document.querySelector('.current-track .track-title');
    const trackArtist = document.querySelector('.current-track .track-artist');
    const playlistItems = document.querySelectorAll('.playlist li');
    const playAllButton = document.querySelector('.play-all');
    let currentTrackIndex = -1;
    let isPlaying = false;
    let isShuffling = false;
    let isLooping = false;
    let isPlayingAll = false;
    let lastTap = 0;

    // Track list from playlist
    const tracks = Array.from(playlistItems).map(item => ({
      src: item.dataset.src,
      title: item.dataset.title,
      artist: item.dataset.artist,
      cover: item.dataset.cover,
    }));

    function loadTrack(index) {
      try {
        const track = tracks[index];
        audioPlayer.src = track.src;
        trackTitle.textContent = track.title;
        trackArtist.textContent = track.artist;
        trackCover.src = track.cover || 'images/default-cover.jpg';
        trackCover.alt = `Capa de ${track.title}`;
        playlistItems.forEach((item, i) => {
          item.classList.toggle('playing', i === index);
        });
        updateDuration();
        console.log('Loaded track:', track);
      } catch (err) {
        console.error('Load track error:', err);
      }
    }

    function playTrack() {
      try {
        audioPlayer.play();
        isPlaying = true;
        isPlayingAll = false;
        playPauseBtn.textContent = '⏸';
        playPauseBtn.setAttribute('aria-label', 'Pausar');
        playAllButton.textContent = 'Tocar Tudo';
        playAllButton.classList.remove('playing');
        document.querySelector('.player-container').classList.add('playing');
      } catch (err) {
        console.error('Play error:', err);
      }
    }

    function pauseTrack() {
      try {
        audioPlayer.pause();
        isPlaying = false;
        isPlayingAll = false;
        playPauseBtn.textContent = '▶️';
        playPauseBtn.setAttribute('aria-label', 'Tocar');
        playAllButton.textContent = 'Tocar Tudo';
        playAllButton.classList.remove('playing');
        document.querySelector('.player-container').classList.remove('playing');
      } catch (err) {
        console.error('Pause error:', err);
      }
    }

    function playNextTrack() {
      try {
        let nextIndex;
        if (isShuffling) {
          nextIndex = Math.floor(Math.random() * tracks.length);
        } else {
          nextIndex = (currentTrackIndex + 1) % tracks.length;
        }
        currentTrackIndex = nextIndex;
        loadTrack(currentTrackIndex);
        if (isPlaying || isPlayingAll) playTrack();
      } catch (err) {
        console.error('Next track error:', err);
      }
    }

    function playPrevTrack() {
      try {
        const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        currentTrackIndex = prevIndex;
        loadTrack(currentTrackIndex);
        if (isPlaying || isPlayingAll) playTrack();
      } catch (err) {
        console.error('Prev track error:', err);
      }
    }

    function playNextAll() {
      try {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(currentTrackIndex);
        playTrack();
      } catch (err) {
        console.error('Play next all error:', err);
      }
    }

    function updateProgress() {
      try {
        const current = audioPlayer.currentTime;
        const total = audioPlayer.duration || 0;
        progressBar.value = total ? (current / total) * 100 : 0;
        currentTime.textContent = formatTime(current);
        duration.textContent = formatTime(total);
      } catch (err) {
        console.error('Update progress error:', err);
      }
    }

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updateDuration() {
      audioPlayer.addEventListener('loadedmetadata', () => {
        duration.textContent = formatTime(audioPlayer.duration);
      }, { once: true });
    }

    // Event Listeners
    if (playAllButton) {
      playAllButton.addEventListener('click', () => {
        console.log('Play all clicked');
        try {
          if (isPlayingAll) {
            pauseTrack();
            isPlayingAll = false;
            playAllButton.textContent = 'Tocar Tudo';
            playAllButton.classList.remove('playing');
          } else {
            if (currentTrackIndex === -1) currentTrackIndex = 0;
            loadTrack(currentTrackIndex);
            playTrack();
            isPlayingAll = true;
            playAllButton.textContent = 'Parar';
            playAllButton.classList.add('playing');
          }
        } catch (err) {
          console.error('Play all error:', err);
        }
      });
      playAllButton.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTap < 300) return;
        lastTap = now;
        console.log('Play all touched');
        try {
          if (isPlayingAll) {
            pauseTrack();
            isPlayingAll = false;
            playAllButton.textContent = 'Tocar Tudo';
            playAllButton.classList.remove('playing');
          } else {
            if (currentTrackIndex === -1) currentTrackIndex = 0;
            loadTrack(currentTrackIndex);
            playTrack();
            isPlayingAll = true;
            playAllButton.textContent = 'Parar';
            playAllButton.classList.add('playing');
          }
        } catch (err) {
          console.error('Play all error:', err);
        }
      }, { passive: true });
    }

    playPauseBtn.addEventListener('click', () => {
      console.log('Play/pause clicked');
      if (isPlaying) pauseTrack();
      else playTrack();
    });
    playPauseBtn.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTap < 300) return;
      lastTap = now;
      console.log('Play/pause touched');
      if (isPlaying) pauseTrack();
      else playTrack();
    }, { passive: true });

    prevBtn.addEventListener('click', () => {
      console.log('Previous clicked');
      playPrevTrack();
    });
    prevBtn.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTap < 300) return;
      lastTap = now;
      console.log('Previous touched');
      playPrevTrack();
    }, { passive: true });

    nextBtn.addEventListener('click', () => {
      console.log('Next clicked');
      playNextTrack();
    });
    nextBtn.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTap < 300) return;
      lastTap = now;
      console.log('Next touched');
      playNextTrack();
    }, { passive: true });

    shuffleBtn.addEventListener('click', () => {
      console.log('Shuffle toggled');
      isShuffling = !isShuffling;
      shuffleBtn.classList.toggle('active', isShuffling);
      shuffleBtn.setAttribute('aria-pressed', isShuffling);
    });
    shuffleBtn.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTap < 300) return;
      lastTap = now;
      console.log('Shuffle touched');
      isShuffling = !isShuffling;
      shuffleBtn.classList.toggle('active', isShuffling);
      shuffleBtn.setAttribute('aria-pressed', isShuffling);
    }, { passive: true });

    loopBtn.addEventListener('click', () => {
      console.log('Loop toggled');
      isLooping = !isLooping;
      audioPlayer.loop = isLooping;
      loopBtn.classList.toggle('active', isLooping);
      loopBtn.setAttribute('aria-pressed', isLooping);
    });
    loopBtn.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTap < 300) return;
      lastTap = now;
      console.log('Loop touched');
      isLooping = !isLooping;
      audioPlayer.loop = isLooping;
      loopBtn.classList.toggle('active', isLooping);
      loopBtn.setAttribute('aria-pressed', isLooping);
    }, { passive: true });

    volumeBtn.addEventListener('click', () => {
      console.log('Volume mute/unmute');
      audioPlayer.muted = !audioPlayer.muted;
      volumeBtn.textContent = audioPlayer.muted ? '🔇' : '🔊';
      volumeBtn.setAttribute('aria-label', audioPlayer.muted ? 'Ativar som' : 'Desativar som');
    });
    volumeBtn.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTap < 300) return;
      lastTap = now;
      console.log('Volume mute/unmute touched');
      audioPlayer.muted = !audioPlayer.muted;
      volumeBtn.textContent = audioPlayer.muted ? '🔇' : '🔊';
      volumeBtn.setAttribute('aria-label', audioPlayer.muted ? 'Ativar som' : 'Desativar som');
    }, { passive: true });

    volumeBar.addEventListener('input', () => {
      audioPlayer.volume = volumeBar.value / 100;
      volumeBtn.textContent = audioPlayer.volume === 0 ? '🔇' : '🔊';
    });

    progressBar.addEventListener('input', () => {
      try {
        audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
      } catch (err) {
        console.error('Progress bar error:', err);
      }
    });

    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', () => {
      console.log('Track ended:', tracks[currentTrackIndex]);
      if (!isLooping && isPlayingAll) {
        playNextAll();
      } else if (!isLooping) {
        playNextTrack();
      }
    });

    playlistItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        console.log('Playlist item clicked:', tracks[index]);
        currentTrackIndex = index;
        loadTrack(currentTrackIndex);
        playTrack();
      });
      item.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTap < 300) return;
        lastTap = now;
        console.log('Playlist item touched:', tracks[index]);
        currentTrackIndex = index;
        loadTrack(currentTrackIndex);
        playTrack();
      }, { passive: true });
    });

    // Keyboard accessibility
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === ' ') {
        e.preventDefault();
        if (isPlaying) pauseTrack();
        else playTrack();
      } else if (e.key === 'ArrowRight') {
        playNextTrack();
      } else if (e.key === 'ArrowLeft') {
        playPrevTrack();
      }
    });

    // Load first track
    if (tracks.length > 0) {
      currentTrackIndex = 0;
      loadTrack(currentTrackIndex);
    }
  }

  // Confetti Animation (aniversario.html)
  if (window.location.pathname.includes('aniversario.html')) {
    const confettiCanvas = document.getElementById('confetti-canvas');
    if (confettiCanvas) {
      const ctx = confettiCanvas.getContext('2d');
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;

      let confettiParticles = [];

      function createConfetti() {
        const colors = ['#ff4d4d', '#ffcc00', '#66ff66', '#66ccff', '#ff99cc'];
        confettiParticles.push({
          x: Math.random() * confettiCanvas.width,
          y: -10,
          speedY: Math.random() * 3 + 2,
          speedX: (Math.random() - 0.5) * 2,
          size: Math.random() * 5 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          angle: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 5
        });
      }

      function animateConfetti() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiParticles.forEach((p, index) => {
          p.y += p.speedY;
          p.x += p.speedX;
          p.angle += p.rotationSpeed;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.angle * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();

          if (p.y > confettiCanvas.height) {
            confettiParticles.splice(index, 1);
          }
        });
        requestAnimationFrame(animateConfetti);
      }

      window.addEventListener('resize', () => {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
      });

      setInterval(createConfetti, 100);
      animateConfetti();
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
      "Porque te amo mais a cada dia.",
      "Porque seu olhar me faz perder o fôlego.",
      "Porque você transforma meus dias em poesia.",
      "Porque seu toque é meu lugar favorito.",
      "Porque com você, o tempo para de existir.",
      "Porque você é a calma no meio da minha tempestade.",
      "Porque seu jeito me faz sorrir sem motivo.",
      "Porque você é o sonho que eu nunca quero acordar.",
      "Porque cada abraço seu é um lar.",
      "Porque você me ensina o que é amor todos os dias.",
      "Porque seu perfume é minha memória mais doce.",
      "Porque você é a estrela que guia minha noite.",
      "Porque com você, tudo faz sentido.",
      "Porque sua voz é a melodia que acalma meu coração.",
      "Porque você é o motivo de eu acreditar no amor.",
      "Porque cada palavra sua é um presente.",
      "Porque você me faz sentir vivo como nunca antes.",
      "Porque seu amor é minha maior aventura.",
      "Porque você é a peça que faltava em mim.",
      "Porque te vejo em cada pôr do sol.",
      "Porque seu carinho é meu refúgio.",
      "Porque você é a razão dos meus melhores dias.",
      "Porque com você, o futuro parece perfeito.",
      "Porque seu sorriso é minha luz no escuro.",
      "Porque você é a história que quero contar sempre.",
      "Porque seu amor me faz voar sem asas.",
      "Porque você é o calor nos meus dias frios.",
      "Porque cada momento contigo é um tesouro.",
      "Porque você é a minha certeza em meio às dúvidas.",
      "Porque seu olhar guarda todos os meus segredos.",
      "Porque você é a música que não sai da minha cabeça.",
      "Porque com você, até o silêncio é lindo.",
      "Porque você me faz querer viver mil vidas ao seu lado.",
      "Porque seu amor é o que me mantém inteiro.",
      "Porque você é a poesia que eu nunca soube escrever.",
      "Porque cada beijo seu é uma promessa eterna.",
      "Porque você é o motivo de eu acordar sorrindo.",
      "Porque seu coração é onde quero morar para sempre.",
      "Porque você é a minha definição de felicidade.",
      "Porque com você, o mundo é mais bonito.",
      "Porque seu amor é a força que me faz seguir.",
      "Porque você é o sonho que se tornou realidade.",
      "Porque sua presença faz tudo valer a pena.",
      "Porque você é a minha inspiração diária.",
      "Porque seu toque me faz esquecer do resto do mundo.",
      "Porque você é o motivo de eu acreditar em finais felizes."
    ];
    const motivoElement = document.getElementById('motivo');
    const motivoButton = document.querySelector('.motivos button');

    function mostrarMotivoAleatorio() {
      try {
        const randomIndex = Math.floor(Math.random() * motivos.length);
        motivoElement.textContent = motivos[randomIndex];
      } catch (err) {
        console.error('Random motivo error:', err);
      }
    }

    if (motivoButton && motivoElement) {
      motivoButton.addEventListener('click', () => {
        console.log('Motivo button clicked');
        mostrarMotivoAleatorio();
      });
      motivoButton.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTap < 300) return;
        lastTap = now;
        console.log('Motivo button touched');
        mostrarMotivoAleatorio();
      }, { passive: true });
      mostrarMotivoAleatorio();
    }
  }

  // Dreams (sonhos.html)
  if (window.location.pathname.includes('sonhos.html')) {
    const sonhos = [
      {
        title: "Viajar juntos",
        description: "Explorar o mundo de mãos dadas, descobrindo novos lugares e criando memórias inesquecíveis."
      },
      {
        title: "Construir uma família",
        description: "Formar nosso lar, cheio de amor, risadas e momentos que aquecem o coração."
      },
      {
        title: "Noites de filme",
        description: "Passar noites abraçados, assistindo nossos filmes favoritos com pipoca e carinho."
      },
      {
        title: "Aventura na natureza",
        description: "Caminhar por florestas, acampar sob as estrelas e sentir a liberdade juntos."
      },
      {
        title: "Cozinhar juntos",
        description: "Fazer receitas novas, rir dos erros e criar pratos cheios de amor."
      },
      {
        title: "Dançar sem motivo",
        description: "Girar pela sala ao som de uma música qualquer, só porque estamos juntos."
      },
      {
        title: "Ver o pôr do sol",
        description: "Sentar lado a lado, vendo o céu mudar de cor e sentindo a paz de estar com você."
      },
      {
        title: "Escrever nossa história",
        description: "Registrar cada momento especial, para um dia contar aos nossos filhos e netos."
      },
      {
        title: "Adotar um pet",
        description: "Ter um companheiro peludo para alegrar ainda mais nossos dias."
      },
      {
        title: "Crescer juntos",
        description: "Aprender, evoluir e enfrentar a vida como uma equipe, sempre juntos."
      }
    ];

    const sonhosList = document.querySelector('#sonhos ul');
    let lastTap = 0;

    sonhos.forEach((sonho, index) => {
      const li = document.createElement('li');
      li.textContent = sonho.title;
      li.setAttribute('aria-expanded', 'false');
      li.setAttribute('role', 'button');
      li.setAttribute('tabindex', '0');

      const description = document.createElement('div');
      description.classList.add('dream-description');
      description.textContent = sonho.description;

      li.appendChild(description);

      li.addEventListener('click', () => {
        console.log('Sonho clicked:', sonho.title);
        toggleDreamDescription(li, description);
      });

      li.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTap < 300) return;
        lastTap = now;
        console.log('Sonho touched:', sonho.title);
        toggleDreamDescription(li, description);
      }, { passive: true });

      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          console.log('Sonho keydown:', sonho.title);
          toggleDreamDescription(li, description);
        }
      });

      sonhosList.appendChild(li);
    });

    function toggleDreamDescription(li, description) {
      try {
        const isExpanded = description.classList.contains('active');
        document.querySelectorAll('.dream-description').forEach(desc => {
          desc.classList.remove('active');
          desc.parentElement.setAttribute('aria-expanded', 'false');
        });
        if (!isExpanded) {
          description.classList.add('active');
          li.setAttribute('aria-expanded', 'true');
        }
      } catch (err) {
        console.error('Toggle dream description error:', err);
      }
    }
  }

  // Contador (contador.html)
  if (window.location.pathname.includes('contador.html')) {
    const contadorElement = document.getElementById('contador');
    const startDate = new Date('2024-11-09T13:00:00-03:00');

    function updateContador() {
      try {
        const now = new Date();
        const timeDiff = now - startDate;
        console.log('Counter timeDiff:', timeDiff);

        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        const remainingMonths = months % 12;
        const remainingDays = days % 30;
        const remainingHours = hours % 24;
        const remainingMinutes = minutes % 60;
        const remainingSeconds = seconds % 60;

        console.log('Counter calc:', { years, remainingMonths, remainingDays, remainingHours, remainingMinutes, remainingSeconds });

        contadorElement.innerHTML = `
          ${years > 0 ? `<span>${years} ano${years > 1 ? 's' : ''}</span>` : ''}
          ${remainingMonths > 0 ? `<span>${remainingMonths} mese${remainingMonths > 1 ? 's' : ''}</span>` : ''}
          ${remainingDays > 0 ? `<span>${remainingDays} dia${remainingDays > 1 ? 's' : ''}</span>` : ''}
          ${remainingHours > 0 ? `<span>${remainingHours} hora${remainingHours > 1 ? 's' : ''}</span>` : ''}
          ${remainingMinutes > 0 ? `<span>${remainingMinutes} minuto${remainingMinutes > 1 ? 's' : ''}</span>` : ''}
          ${remainingSeconds > 0 ? `<span>${remainingSeconds} segundo${remainingSeconds > 1 ? 's' : ''}</span>` : ''}
        `;
      } catch (err) {
        console.error('Contador error:', err);
      }
    }

    updateContador();
    setInterval(updateContador, 1000);
  }

  // Back to Top Button
  const backToTopButton = document.querySelector('.back-to-top');
  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });

    backToTopButton.addEventListener('click', () => {
      console.log('Back to top clicked');
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error('Back to top error:', err);
      }
    });

    backToTopButton.addEventListener('touchend', (e) => {
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
  }
});