document.addEventListener('DOMContentLoaded', () => {
  const layers = document.querySelectorAll('.layer');
  const overlay = document.getElementById('welcome-overlay');

  function moveLayers(deltaX, deltaY) {
    layers.forEach((layer) => {
      const depth = parseFloat(layer.getAttribute('data-depth')) || 0.1;
      const translateX = -deltaX * (depth * 450);
      const translateY = -deltaY * (depth * 450);
      layer.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    });
  }

  // 1. Movimiento con mouse (PC)
  document.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const deltaX = (e.clientX - centerX) / centerX;
    const deltaY = (e.clientY - centerY) / centerY;
    moveLayers(deltaX, deltaY);
  });

  // 2. Movimiento con giroscopio (Móvil)
  function handleOrientation(e) {
    if (e.gamma === null || e.beta === null) return;
    const deltaX = Math.max(-1.5, Math.min(1.5, e.gamma / 12));
    const deltaY = Math.max(-1.5, Math.min(1.5, (e.beta - 45) / 15));
    moveLayers(deltaX, deltaY);
  }

  // 3. Ocultar la pantalla de bienvenida y habilitar clics
  if (overlay) {
    overlay.addEventListener('click', () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then(response => {
            if (response === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation, true);
            }
          })
          .catch(console.error);
      } else if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
      overlay.classList.add('hidden');
    });
  }

  // 4. Activación dinámica del menú al hacer scroll (Scrollspy)
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section, .parallax-container');

  function activeMenuOnScroll() {
    let currentSection = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', activeMenuOnScroll);
});

// --- LIGHTBOX DINÁMICO PARA EL PORTAFOLIO ---
document.addEventListener('DOMContentLoaded', () => {
  let modal = document.createElement('div');
  modal.className = 'lightbox-modal';
  modal.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close">&times;</button>
      <img src="" alt="Imagen ampliada">
    </div>
  `;
  document.body.appendChild(modal);

  const modalImg = modal.querySelector('img');
  const closeBtn = modal.querySelector('.lightbox-close');

  function openLightbox(imageSrc) {
    // Cambiar la ruta de miniatura a la imagen original si es necesario
    let fullSrc = imageSrc.replace('-min', '');
    modalImg.src = fullSrc;
    modal.classList.add('active');
  }

  // 1. Escuchar clics en las imágenes del portafolio
  const portfolioImages = document.querySelectorAll('.portfolio-image-container img');
  portfolioImages.forEach((img) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(img.getAttribute('src'));
    });
  });

  // 2. Escuchar clics en los botones de zoom (+) de las tarjetas
  const portfolioLinks = document.querySelectorAll('.portfolio-link');
  portfolioLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      let targetSrc = link.getAttribute('href');
      openLightbox(targetSrc);
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    modalImg.src = '';
  }

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
});