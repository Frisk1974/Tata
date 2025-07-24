document.addEventListener('DOMContentLoaded', () => {
  // Gerenciar reprodução de áudio
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

  // Botão "Tocar Todas"
  playAllButton.addEventListener('click', () => {
    audios.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
      musicaContainers.forEach(container => container.classList.remove('playing'));
    });
    audios[0].play();
  });

  // Mostrar/esconder botão "Voltar ao topo"
  const backToTopButton = document.querySelector('.back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });

  // Animação de entrada para seções
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = '0.2s';
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => observer.observe(section));
});