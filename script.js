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
    menuToggle.addEventListener('touchend', (e) => toggleMenu(e, 'touchend'), { passive: false });

    menuClose.addEventListener('click', (e) => closeMenu(e, 'click'));
    menuClose.addEventListener('touchend', (e) => closeMenu(e, 'touchend'), { passive: false });

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
        if (now - lastTap < 500) return;
        lastTap = now;
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
          console.error('Navigation error:', err);
        }
      }, { passive: false });
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
    }, { passive: false });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu(e, 'escape key');
      }
    });

    function toggleMenu(e, type) {
      const now = Date.now();
      if (now - lastTap < 500) return;
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

    // Event Listeners for Music Player
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
        if (now - lastTap < 500) return;
        lastTap = now;
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
      }, { passive: false });
    }

    playPauseBtn.addEventListener('click', () => {
      console.log('Play/pause clicked');
      try {
        if (isPlaying) pauseTrack();
        else playTrack();
      } catch (err) {
        console.error('Play/pause error:', err);
      }
    });
    playPauseBtn.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTap < 500) return;
      lastTap = now;
      e.preventDefault();
      console.log('Play/pause touched');
      try {
        if (isPlaying) pauseTrack();
        else playTrack();
      } catch (err) {
        console.error('Play/pause touch error:', err);
      }
    }, { passive: false });

    prevBtn.addEventListener('click', () => {
      console.log('Previous clicked');
      playPrevTrack();
    });
    prevBtn.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTap < 500) return;
      lastTap = now;
      e.preventDefault();
      console.log('Previous touched');
      playPrevTrack();
    }, { passive: false });

    nextBtn.addEventListener('click', () => {
      console.log('Next clicked');
      playNextTrack();
    });
    nextBtn.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTap < 500) return;
      lastTap = now;
      e.preventDefault();
      console.log('Next touched');
      playNextTrack();
    }, { passive: false });

    shuffleBtn.addEventListener('click', () => {
      console.log('Shuffle clicked');
      try {
        isShuffling = !isShuffling;
        shuffleBtn.classList.toggle('active', isShuffling);
        shuffleBtn.setAttribute('aria-pressed', isShuffling);
      } catch (err) {
        console.error('Shuffle error:', err);
      }
    });
    shuffleBtn.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTap < 500) return;
      lastTap = now;
      e.preventDefault();
      console.log('Shuffle touched');
      try {
        isShuffling = !isShuffling;
        shuffleBtn.classList.toggle('active', isShuffling);
        shuffleBtn.setAttribute('aria-pressed', isShuffling);
      } catch (err) {
        console.error('Shuffle touch error:', err);
      }
    }, { passive: false });

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
    loopBtn.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTap < 500) return;
      lastTap = now;
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
    }, { passive: false });

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
    volumeBtn.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTap < 500) return;
      lastTap = now;
      e.preventDefault();
      console.log('Volume mute/unmute touched');
      try {
        audioPlayer.muted = !audioPlayer.muted;
        volumeBtn.textContent = audioPlayer.muted ? '🔇' : '🔊';
        volumeBtn.setAttribute('aria-label', audioPlayer.muted ? 'Ativar som' : 'Desativar som');
      } catch (err) {
        console.error('Volume touch error:', err);
      }
    }, { passive: false });

    volumeBar.addEventListener('input', () => {
      try {
        audioPlayer.volume = volumeBar.value / 100;
        volumeBtn.textContent = audioPlayer.volume === 0 ? '🔇' : '🔊';
      } catch (err) {
        console.error('Volume bar error:', err);
      }
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
      item.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTap < 500) return;
        lastTap = now;
        e.preventDefault();
        console.log('Playlist item touched:', tracks[index]);
        try {
          currentTrackIndex = index;
          loadTrack(currentTrackIndex);
          playTrack();
        } catch (err) {
          console.error('Playlist item touch error:', err);
        }
      }, { passive: false });
    });

    // Keyboard accessibility
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
        requestAnimationFrame(animateConfetti)