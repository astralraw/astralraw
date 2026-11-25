document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('welcome-overlay');
  const bgLayer = document.querySelector('.layer-bg');

  function moveLayers(deltaX, deltaY) {
    if (bgLayer) {
      const depth = parseFloat(bgLayer.getAttribute('data-depth')) || 0.04;
      // Multiplicador manual ajustable para el fondo
      const translateX = -deltaX * (depth * 300);
      const translateY = -deltaY * (depth * 300);
      bgLayer.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    }
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

  // 3. Ocultar la pantalla de bienvenida y habilitar giroscopio en móvil
  if (overlay) {
    overlay.addEventListener('click', () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then((response) => {
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

  // 5. Menú desplegable móvil
  const menuToggle = document.getElementById('menu-toggle');
  const navLinksContainer = document.getElementById('nav-links');

  if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('active');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navLinksContainer.contains(e.target)) {
        navLinksContainer.classList.remove('active');
      }
    });
  }

  // 6. Lightbox dinámico para el portafolio
  const modal = document.createElement('div');
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
    const fullSrc = imageSrc.replace('-min', '');
    modalImg.src = fullSrc;
    modal.classList.add('active');
  }

  const portfolioImages = document.querySelectorAll('.portfolio-image-container img');
  portfolioImages.forEach((img) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(img.getAttribute('src'));
    });
  });

  const portfolioLinks = document.querySelectorAll('.portfolio-link');
  portfolioLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSrc = link.getAttribute('href');
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

  // 7. Pestañas de servicios (Fotografía Exterior, Fotografía Estudio, Reels)
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.service-tab-pane');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      tabPanes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // 8. Filtros del portafolio (All Work / Cosplay / Estudio / Otros)
  const filterBtns = document.querySelectorAll('.portfolio-filters li');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  function applyFilter(selector) {
    portfolioItems.forEach((item) => {
      const show = selector === '*' || item.matches(selector);
      item.hidden = !show;
    });
  }

  filterBtns.forEach((btn) => {
    btn.setAttribute('role', 'button');
    btn.setAttribute('tabindex', '0');

    const activate = () => {
      filterBtns.forEach((b) => b.classList.remove('filter-active'));
      btn.classList.add('filter-active');
      applyFilter(btn.getAttribute('data-filter') || '*');
    };

    btn.addEventListener('click', activate);
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  });
});