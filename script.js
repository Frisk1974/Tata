document.addEventListener('DOMContentLoaded', () => {
  // Global error handler for debugging
  window.addEventListener('error', (e) => {
    console.error('Global error:', e.message, 'at', e.filename, e.lineno);
  });

  // Debounce utility for touch events
  let lastTap = 0;
  function debounceTouch(func) {
    return function (e) {
      const now = Date.now();
      if (now - lastTap < 200) return;
      lastTap = now;
      func(e);
    };
  }

  // Stars Animation (all pages except index.html)
  const starsContainer = document.querySelector('.stars-container');
  if (starsContainer && !window.location.pathname.includes('index.html')) {
    starsContainer.style.display = 'block';
  } else if (starsContainer) {
    starsContainer.style.display = 'none';
  }

  // Menu Toggle Functionality
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  const menuClose = document.querySelector('.menu-close');

  if (menuToggle && menu && menuClose) {
    const toggleMenu = (e, type) => {
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
    };

    const closeMenu = (e, type) => {
      console.log('Menu closed:', type);
      try {
        menu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
        menuToggle.focus();
      } catch (err) {
        console.error('Close menu error:', err);
      }
    };

    menuToggle.addEventListener('click', (e) => toggleMenu(e, 'click'));
    menuToggle.addEventListener('touchstart', debounceTouch((e) => {
      e.preventDefault();
      toggleMenu(e, 'touchstart');
    }), { passive: false });

    menuClose.addEventListener('click', (e) => closeMenu(e, 'click'));
    menuClose.addEventListener('touchstart', debounceTouch((e) => {
      e.preventDefault();
      closeMenu(e, 'touchstart');
    }), { passive: false });

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
      link.addEventListener('touchstart', debounceTouch((e) => {
        e.preventDefault();
        console.log('Menu link touched:', link.href);
        try {
          if (window.innerWidth <= 768) {
            menu.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
          }
          window.location.href = link.href;
        } catch (err) {
          console.error('Navigation touch error:', err);
        }
      }), { passive: false });
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !menuToggle.contains(e.target) && menu.classList.contains('open')) {
        closeMenu(e, 'click outside');
      }
    });

    document.addEventListener('touchstart', (e) => {
      if (!menu.contains(e.target) && !menuToggle.contains(e.target) && menu.classList.contains('open')) {
        debounceTouch((ev) => closeMenu(ev, 'touch outside'))(e);
      }
    }, { passive: false });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu(e, 'escape key');
      }
    });
  } else {
    console.warn('Menu toggle elements not found on this page');
  }

  // Hero Button (index.html)
  const heroButton = document.querySelector('.hero button');
  if (heroButton) {
    heroButton.addEventListener('click', (e) => {
      console.log('Hero button clicked, redirecting to aniversario.html');
      try {
        window.location.href = 'aniversario.html';
        confetti({
          particleCount: 100,
          spread: 70,
          colors: ['#F472B6', '#C4B5FD', '#FBBF24'],
        });
      } catch (err) {
        console.error('Hero button error:', err);
      }
    });
    heroButton.addEventListener('touchstart', debounceTouch((e) => {
      e.preventDefault();
      console.log('Hero button touched, redirecting to aniversario.html');
      try {
        window.location.href = 'aniversario.html';
        confetti({
          particleCount: 100,
          spread: 70,
          colors: ['#F472B6', '#C4B5FD', '#FBBF24'],
        });
      } catch (err) {
        console.error('Hero button touch error:', err);
      }
    }), { passive: false });
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
      const colors = ['#F472B6', '#C4B5FD', '#FBBF24'];

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
    let shuffleIndices = [];

    const tracks = Array.from(playlistItems).map(item => ({
      src: item.dataset.src,
      title: item.dataset.title,
      artist: item.dataset.artist,
      cover: item.dataset.cover,
    }));

    function loadTrack(index) {
      try {
        const track = tracks[index];
        audioPlayer.src = track.src || 'musicas/default.mp3';
        trackTitle.textContent = track.title;
        trackArtist.textContent = track.artist;
        trackCover.src = track.cover || 'images/default-cover.jpg';
        trackCover.alt = `Capa de ${track.title}`;
        playlistItems.forEach((item, i) => {
          item.classList.toggle('playing', i === index);
        });
        updateDuration();
        console.log('Loaded track:', track);
        audioPlayer.addEventListener('error', () => {
          console.error('Audio load error for:', track.src);
        }, { once: true });
      } catch (err) {
        console.error('Load track error:', err);
      }
    }

    function playTrack() {
      try {
        audioPlayer.play().catch(err => {
          console.error('Play error:', err);
        });
        isPlaying = true;
        isPlayingAll = false;
        playPauseBtn.textContent = '⏸';
        playPauseBtn.setAttribute('aria-label', 'Pausar');
        playAllButton.textContent = 'Tocar Tudo';
        playAllButton.classList.remove('playing');
        document.querySelector('.player-container').classList.add('playing');
      } catch (err) {
        console.error('Play track error:', err);
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
        console.error('Pause track error:', err);
      }
    }

    function playNextTrack() {
      try {
        let nextIndex;
        if (isShuffling) {
          if (!shuffleIndices.length) {
            shuffleIndices = [...Array(tracks.length).keys()].filter(i => i !== currentTrackIndex);
            shuffleIndices.sort(() => Math.random() - 0.5);
          }
          nextIndex = shuffleIndices.shift();
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
      playAllButton.addEventListener('touchstart', debounceTouch((e) => {
        e.preventDefault();
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
          console.error('Play all touch error:', err);
        }
      }), { passive: false });
    }

    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        console.log('Play/pause clicked');
        try {
          if (isPlaying) pauseTrack();
          else playTrack();
        } catch (err) {
          console.error('Play/pause error:', err);
        }
      });
      playPauseBtn.addEventListener('touchstart', debounceTouch((e) => {
        e.preventDefault();
        console.log('Play/pause touched');
        try {
          if (isPlaying) pauseTrack();
          else playTrack();
        } catch (err) {
          console.error('Play/pause touch error:', err);
        }
      }), { passive: false });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        console.log('Previous clicked');
        playPrevTrack();
      });
      prevBtn.addEventListener('touchstart', debounceTouch((e) => {
        e.preventDefault();
        console.log('Previous touched');
        playPrevTrack();
      }), { passive: false });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        console.log('Next clicked');
        playNextTrack();
      });
      nextBtn.addEventListener('touchstart', debounceTouch((e) => {
        e.preventDefault();
        console.log('Next touched');
        playNextTrack();
      }), { passive: false });
    }

    if (shuffleBtn) {
      playNextTrack();
      shuffleBtn.addEventListener('click', () => {
        console.log('Shuffle clicked');
        try {
          isShuffling = !isShuffling;
          shuffleBtn.classList.toggle('active', isShuffling);
          shuffleBtn.setAttribute('aria-pressed', isShuffling);
          shuffleIndices = [];
        } catch (err) {
          console.error('Shuffle error:', err);
        }
      });
      shuffleBtn.addEventListener('touchstart', debounceTouch((e) => {
        e.preventDefault();
        console.log('Shuffle touched');
        try {
          isShuffling = !isShuffling;
          shuffleBtn.classList.toggle('active', isShuffling);
          shuffleBtn.setAttribute('aria-pressed', isShuffling);
          shuffleIndices = [];
        } catch (err) {
          console.error('Shuffle touch error:', err);
        }
      }), { passive: false });
    }

    if (loopBtn) {
      loopBtn.addEventListener('click', () => {
        console.log('Loop clicked');
        try {
          isLooping = !isLooping;
          audioPlayer.loop = isLooping;
          loopBtn.classList.toggle('active', isLooping);
          loopBtn.setAttribute('aria-pressed', isLooping);
        } catch (err) {
          console.error('Loop error:', err);
        }
      });
      loopBtn.addEventListener('touchstart', debounceTouch((e) => {
        e.preventDefault();
        console.log('Loop touched');
        try {
          isLooping = !isLooping;
          audioPlayer.loop = isLooping;
          loopBtn.classList.toggle('active', isLooping);
          loopBtn.setAttribute('aria-pressed', isLooping);
        } catch (err) {
          console.error('Loop touch error:', err);
        }
      }), { passive: false });
    }

    if (volumeBtn) {
      volumeBtn.addEventListener('click', () => {
        console.log('Volume mute/unmute clicked');
        try {
          audioPlayer.muted = !audioPlayer.muted;
          volumeBtn.textContent = audioPlayer.muted ? '🔇' : '🔊';
          volumeBtn.setAttribute('aria-label', audioPlayer.muted ? 'Ativar som' : 'Desativar som');
        } catch (err) {
          console.error('Volume error:', err);
        }
      });
      volumeBtn.addEventListener('touchstart', debounceTouch((e) => {
        e.preventDefault();
        console.log('Volume mute/unmute touched');
        try {
          audioPlayer.muted = !audioPlayer.muted;
          volumeBtn.textContent = audioPlayer.muted ? '🔇' : '🔊';
          volumeBtn.setAttribute('aria-label', audioPlayer.muted ? 'Ativar som' : 'Desativar som');
        } catch (err) {
          console.error('Volume touch error:', err);
        }
      }), { passive: false });
    }

    if (volumeBar) {
      volumeBar.addEventListener('input', () => {
        try {
          audioPlayer.volume = volumeBar.value / 100;
          audioPlayer.muted = audioPlayer.volume === 0;
          volumeBtn.textContent = audioPlayer.muted ? '🔇' : '🔊';
        } catch (err) {
          console.error('Volume bar error:', err);
        }
      });
    }

    if (progressBar) {
      progressBar.addEventListener('input', () => {
        try {
          audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
        } catch (err) {
          console.error('Progress bar error:', err);
        }
      });
    }

    if (audioPlayer) {
      audioPlayer.addEventListener('timeupdate', updateProgress);
      audioPlayer.addEventListener('ended', () => {
        console.log('Track ended:', tracks[currentTrackIndex]);
        try {
          if (!isLooping && isPlayingAll) {
            playNextAll();
          } else if (!isLooping) {
            playNextTrack();
          }
        } catch (err) {
          console.error('Track ended error:', err);
        }
      });
    }

    playlistItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        console.log('Playlist item clicked:', tracks[index]);
        try {
          currentTrackIndex = index;
          loadTrack(currentTrackIndex);
          playTrack();
        } catch (err) {
          console.error('Playlist item error:', err);
        }
      });
      item.addEventListener('touchstart', debounceTouch((e) => {
        e.preventDefault();
        console.log('Playlist item touched:', tracks[index]);
        try {
          currentTrackIndex = index;
          loadTrack(currentTrackIndex);
          playTrack();
        } catch (err) {
          console.error('Playlist item touch error:', err);
        }
      }), { passive: false });
    });

    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === ' ') {
        e.preventDefault();
        try {
          if (isPlaying) pauseTrack();
          else playTrack();
        } catch (err) {
          console.error('Spacebar error:', err);
        }
      } else if (e.key === 'ArrowRight') {
        playNextTrack();
      } else if (e.key === 'ArrowLeft') {
        playPrevTrack();
      }
    });

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
        const colors = ['#F472B6', '#C4B5FD', '#FBBF24'];
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

    if (galleryImages.length === 0) {
      console.warn('No gallery images found on galeria.html');
    }

    galleryImages.forEach(img => {
      img.addEventListener('click', () => {
        console.log('Gallery image clicked:', img.src);
        try {
          if (lightbox && lightboxImg) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
          } else {
            console.error('Lightbox or lightbox-img not found');
          }
        } catch (err) {
          console.error('Gallery image error:', err);
        }
      });
      img.addEventListener('touchstart', debounceTouch((e) => {
        e.preventDefault();
        console.log('Gallery image touched:', img.src);
        try {
          if (lightbox && lightboxImg) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
          } else {
            console.error('Lightbox or lightbox-img not found');
          }
        } catch (err) {
          console.error('Gallery image touch error:', err);
        }
      }), { passive: false });
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
      lightboxClose.addEventListener('touchstart', debounceTouch((e) => {
        e.preventDefault();
        console.log('Lightbox close touched');
        try {
          lightbox.classList.remove('active');
        } catch (err) {
          console.error('Lightbox close touch error:', err);
        }
      }), { passive: false });
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
      lightbox.addEventListener('touchstart', (e) => {
        if (e.target === lightbox) {
          debounceTouch((ev) => {
            console.log('Lightbox background touched');
            try {
              lightbox.classList.remove('active');
            } catch (err) {
              console.error('Lightbox background touch error:', err);
            }
          })(e);
        }
      }, { passive: false });
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
        confetti({
          particleCount: 50,
          spread: 60,
          colors: ['#F472B6', '#C4B5FD', '#FBBF24'],
        });
      } catch (err) {
        console.error('Random message error:', err);
      }
    }
    if (mensagemElement) {
      mostrarMensagemAleatoria();
      const recadoButton = document.querySelector('.recado-container button');
      if (recadoButton) {
        recadoButton.addEventListener('click', () => {
          console.log('Recado button clicked');
          mostrarMensagemAleatoria();
        });
        recadoButton.addEventListener('touchstart', debounceTouch((e) => {
          e.preventDefault();
          console.log('Recado button touched');
          mostrarMensagemAleatoria();
        }), { passive: false });
      }
    }
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

    function mostrarMotivoAleatorio() {
      try {
        const randomIndex = Math.floor(Math.random() * motivos.length);
        motivoElement.textContent = motivos[randomIndex];
        confetti({
          particleCount: 50,
          spread: 60,
          colors: ['#F472B6', '#C4B5FD', '#FBBF24'],
        });
      } catch (err) {
        console.error('Random motivo error:', err);
      }
    }

    if (motivoButton && motivoElement) {
      motivoButton.addEventListener('click', () => {
        console.log('Motivo button clicked');
        mostrarMotivoAleatorio();
      });
      motivoButton.addEventListener('touchstart', debounceTouch((e) => {
        e.preventDefault();
        console.log('Motivo button touched');
        mostrarMotivoAleatorio();
      }), { passive: false });
      mostrarMotivoAleatorio();
    }
  }

  // Dreams (sonhos.html)
  if (window.location.pathname.includes('sonhos.html')) {
    const dreamItems = document.querySelectorAll('#sonhos ul li');
    dreamItems.forEach((li, index) => {
      const description = li.querySelector('.dream-description');
      if (description) {
        description.classList.add('active');
        li.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // Contador (contador.html)
  if (window.location.pathname.includes('contador.html')) {
    const contadorElement = document.getElementById('contador');
    const startDate = new Date('2024-11-09T13:00:00-03:00');

    function updateContador() {
      try {
        const now = new Date();
        const timeDiff = now - startDate;

        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30.42); // Média de dias por mês
        const years = Math.floor(months / 12);

        const remainingMonths = months % 12;
        const remainingDays = Math.floor(days % 30.42);
        const remainingHours = hours % 24;
        const remainingMinutes = minutes % 60;
        const remainingSeconds = seconds % 60;

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
});