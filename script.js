document.addEventListener('DOMContentLoaded', () => {
  // Confetti Animation
  const confettiCanvas = document.getElementById('confetti-canvas');
  const confettiInstance = confetti.create(confettiCanvas, { resize: true });
  const triggerConfetti = () => {
    confettiInstance({
      particleCount: 100,
      spread: 70,
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

  // Parque de Diversões Animations
  const toggleButton = document.querySelector('.toggle-animations');
  const wheel = document.querySelector('.wheel');
  const cart = document.querySelector('.cart');

  toggleButton.addEventListener('click', () => {
    const isPlaying = toggleButton.getAttribute('data-state') === 'playing';
    if (isPlaying) {
      wheel.classList.add('paused');
      cart.classList.add('paused');
      toggleButton.textContent = 'Iniciar Animações';
      toggleButton.setAttribute('aria-label', 'Iniciar animações');
      toggleButton.setAttribute('data-state', 'paused');
    } else {
      wheel.classList.remove('paused');
      cart.classList.remove('paused');
      toggleButton.textContent = 'Pausar Animações';
      toggleButton.setAttribute('aria-label', 'Pausar animações');
      toggleButton.setAttribute('data-state', 'playing');
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
    if (window.scrollY > 300) {
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