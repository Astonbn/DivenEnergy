// ============================================================
// SolarNova — main.js (v3 - fixed image tiling in lightbox)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── NAVBAR SCROLL EFFECT ──────────────────────────────────
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
      backToTop.classList.add('visible');
    } else {
      navbar.classList.remove('scrolled');
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── HAMBURGER MENU ────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // ── SMOOTH SCROLL ─────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── SCROLL REVEAL ─────────────────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // ── ANIMATED COUNTERS ─────────────────────────────────────
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.count').forEach(counter => {
    counterObserver.observe(counter);
  });

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const step     = 16;
    const increment = target / (duration / step);
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current).toLocaleString();
    }, step);
  }

  // ── PRODUCT FILTER ────────────────────────────────────────
  const filterBtns   = document.querySelectorAll('.pf-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      productCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ── CAROUSEL ──────────────────────────────────────────────
  const carousel      = document.getElementById('carousel');
  const prevBtn       = document.getElementById('prevBtn');
  const nextBtn       = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('carouselDots');
  const cards         = document.querySelectorAll('.testimonial-card');

  let currentSlide = 0;
  let slidesPerView = getSlidesPerView();
  let totalSlides   = Math.ceil(cards.length / slidesPerView);

  function buildDots() {
    dotsContainer.innerHTML = '';
    totalSlides = Math.ceil(cards.length / slidesPerView);
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function getSlidesPerView() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 992) return 2;
    return 3;
  }

  function goToSlide(index) {
    slidesPerView = getSlidesPerView();
    totalSlides   = Math.ceil(cards.length / slidesPerView);
    currentSlide  = Math.max(0, Math.min(index, totalSlides - 1));
    const cardWidth = cards[0].offsetWidth + 24;
    carousel.style.transform  = `translateX(-${currentSlide * cardWidth * slidesPerView}px)`;
    carousel.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
    document.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentSlide);
    });
  }

  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  let autoPlay = setInterval(() => goToSlide((currentSlide + 1) % totalSlides), 4500);
  carousel.addEventListener('mouseenter', () => clearInterval(autoPlay));
  carousel.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => goToSlide((currentSlide + 1) % totalSlides), 4500);
  });

  let touchStartX = 0;
  carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
  });

  window.addEventListener('resize', () => {
    slidesPerView = getSlidesPerView();
    buildDots();
    goToSlide(0);
  });

  buildDots();

  // ── CONTACT FORM ──────────────────────────────────────────
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.submit-btn span');
    btn.textContent = 'Sending…';
    setTimeout(() => {
      btn.textContent = 'Send Message';
      success.style.display = 'block';
      form.reset();
      setTimeout(() => success.style.display = 'none', 5000);
    }, 1500);
  });

  // ── ACTIVE NAV LINK ON SCROLL ─────────────────────────────
  const sections     = document.querySelectorAll('section[id]');
  const navLinkItems = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkItems.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--yellow)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => sectionObserver.observe(section));

  // ── PARALLAX HERO ─────────────────────────────────────────
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    });
  }

  // ── PRODUCT LIGHTBOX CLICK ────────────────────────────────
  document.querySelectorAll('.product-card').forEach(card => {
    const img  = card.querySelector('.pc-img');
    const name = card.querySelector('h3')?.textContent;
    const desc = card.querySelector('p')?.textContent;
    if (img && name) {
      img.removeEventListener('click', img._lightboxListener);
      const listener = () => openLightbox(name, desc);
      img.addEventListener('click', listener);
      img._lightboxListener = listener;
    }
  });

  // ── PROJECT GALLERY CLICK ─────────────────────────────────
  document.querySelectorAll('.proj-img[data-images]').forEach(el => {
    el.addEventListener('click', () => {
      try {
        const imgs = JSON.parse(el.getAttribute('data-images'));
        if (typeof window.openProjLightbox === 'function') {
          window.openProjLightbox(imgs, 0);
        }
      } catch(e) { console.warn(e); }
    });
  });

});

// ── CSS fadeIn keyframe ───────────────────────────────────
const _style = document.createElement('style');
_style.textContent = `@keyframes fadeIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`;
document.head.appendChild(_style);

// ── THEME TOGGLE ──────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  if (localStorage.getItem('solarnovaTheme') === 'light') {
    document.body.classList.add('light-mode');
  }
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('solarnovaTheme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
  });
}

// ── PRODUCT LIGHTBOX DATA ─────────────────────────────────
const productData = {
  'Mono PERC 550W Panel': {
    images: [
      { bg: "url('images/Panel.webp')",      caption: 'Mono PERC 550W — Rooftop installation, Lusaka' },
      { bg: "url('images/installatoin3.jpg')", caption: 'Close-up of panel cell structure and wiring' },
      { bg:  "url('images/installation.jpg')", icon: '🏠', caption: 'Residential array — 20 panels, 11kW system' },
     
    ]
  },
  'Bifacial 600W Panel': {
    images: [
      { bg: "url('images/Bifacial.jpg')",    caption: 'Bifacial 600W — Both front and rear power generation' },
      { bg: "url('images/panel1.jpg')",  caption: 'Light reflection boost on bifacial rear surface' },
      { bg: "url('images/panel2.jpg')", caption: 'Ground mount installation at Ndola farm' },
    ]
  },
  'Hybrid Inverter 5kW': {
    images: [
      { bg: "url('images/inveter.jpg')",     caption: 'Hybrid 5kW Inverter — Wall-mounted installation' },
      { bg: "url('images/inveter2.jpg')",  caption: 'WiFi monitoring via mobile app dashboard' },
      { bg: "url('images/inveter3.jpg')",  caption: 'Wiring diagram and connection ports' },
    ]
  },
  'LiFePO4 200Ah Battery': {
    images: [
      { bg: "url('images/battery3.jpg')",    caption: 'LiFePO4 200Ah — 6000+ charge cycle battery bank' },
      { bg: "url('images/battery4.webp')", caption: 'BMS (Battery Management System) connection' },
      { bg: "url('images/Battery5.webp')", caption: 'Battery bank capacity monitoring display' },
    ]
  },
  'MPPT Controller 60A': {
    images: [
      { bg: "url('images/MPPT2.webp')", caption: 'MPPT 60A Controller with LCD display' },
      { bg: "url('images/ba.jpg')", caption: 'Real-time voltage and current readout' },
      { bg: "url('images/Battery.jpg')", caption: 'Installation in off-grid control cabinet' },
    ]
  },
  'All-in-One 100W Street Light': {
    images: [
      { bg: "url('images/lights.webp')", caption: '100W All-in-One Solar Street Light — Night view' },
      { bg: "url('images/lights.jpg')", caption: 'Motion sensor activation in compound, Matero' },
      { bg: "url('images/lights3.jpg')", caption: 'Bulk installation along government road, Chipata' },
    ]
  },
  'Solar Water Heater 200L': {
    images: [
      { bg: "url('images/heater.jpg')",   caption: '200L Evacuated Tube Solar Water Heater' },
      { bg:  "url('images/heater2.jpg')",  caption: 'Temperature sensor and pressure relief valve' },
      { bg: "url('images/heater3.jpg')",   caption: 'Rooftop installation with anti-freeze kit, Ndola' },
    ]
  },
  'AGM Deep Cycle 150Ah': {
    images: [
      { bg: "url('images/ba.jpg')",  caption: 'AGM 150Ah Deep Cycle — Sealed maintenance-free' },
      { bg: "url('images/battery4.webp')", caption: 'Off-grid battery bank — 4-unit array setup' },
      { bg: "url('images/battery5.webp')", caption: 'Shipping-ready packaging and terminal covers' },
    ]
  },
};

// ── LIGHTBOX HTML ─────────────────────────────────────────
if (!document.getElementById('lightboxOverlay')) {
  document.body.insertAdjacentHTML('beforeend', `
  <div class="lightbox-overlay" id="lightboxOverlay">
    <div class="lightbox-inner">
      <button class="lightbox-close" id="lightboxClose">✕</button>
      <div class="lightbox-main-img" id="lightboxMain">
        <div class="lb-caption" id="lbCaption"></div>
      </div>
      <button class="lightbox-nav lightbox-prev" id="lbPrev">‹</button>
      <button class="lightbox-nav lightbox-next" id="lbNext">›</button>
      <div class="lightbox-info">
        <h3 id="lbTitle"></h3>
        <p id="lbDesc"></p>
      </div>
      <div class="lightbox-thumbs" id="lightboxThumbs"></div>
    </div>
  </div>`);
}

const overlay   = document.getElementById('lightboxOverlay');
const lbClose   = document.getElementById('lightboxClose');
const lbMain    = document.getElementById('lightboxMain');
const lbCaption = document.getElementById('lbCaption');
const lbTitle   = document.getElementById('lbTitle');
const lbDesc    = document.getElementById('lbDesc');
const lbThumbs  = document.getElementById('lightboxThumbs');
const lbPrev    = document.getElementById('lbPrev');
const lbNext    = document.getElementById('lbNext');

let currentImages   = [];
let currentImgIndex = 0;

function openLightbox(productName, productDesc, imgIndex = 0) {
  const data = productData[productName];
  if (!data) { console.warn(`No product data for: ${productName}`); return; }
  currentImages   = data.images;
  currentImgIndex = imgIndex;
  lbTitle.textContent = productName;
  lbDesc.textContent  = productDesc;
  renderLightboxSlide();
  buildThumbs();
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// ── KEY FIX: proper background handling to prevent image tiling ──
function renderLightboxSlide() {
  const img = currentImages[currentImgIndex];
  if (!img) return;

  // Remove any leftover icon
  const existingIcon = lbMain.querySelector('.lb-icon');
  if (existingIcon) existingIcon.remove();

  const isImageUrl = img.bg && img.bg.trim().startsWith('url(');

  if (isImageUrl) {
    // Real photo — display as a single cover image, never tiled
    lbMain.style.backgroundImage    = img.bg;
    lbMain.style.backgroundSize     = 'contain';
    lbMain.style.backgroundPosition = 'center';
    lbMain.style.backgroundRepeat   = 'no-repeat';
    lbMain.style.backgroundColor    = '#000';
  } else {
    // Gradient slide — reset image props, apply gradient
    lbMain.style.backgroundImage    = 'none';
    lbMain.style.backgroundSize     = '';
    lbMain.style.backgroundPosition = '';
    lbMain.style.backgroundRepeat   = '';
    lbMain.style.background         = img.bg;

    // Show emoji icon on gradient slides only
    if (img.icon) {
      const iconEl = document.createElement('div');
      iconEl.className = 'lb-icon';
      iconEl.style.cssText = 'font-size:6rem; position:relative; z-index:2;';
      iconEl.textContent = img.icon;
      lbMain.insertBefore(iconEl, lbCaption);
    }
  }

  lbCaption.textContent = img.caption || '';

  // Sync thumb highlight
  document.querySelectorAll('.lightbox-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === currentImgIndex);
  });
}

function buildThumbs() {
  if (!lbThumbs) return;
  lbThumbs.innerHTML = '';
  currentImages.forEach((img, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'lightbox-thumb' + (i === 0 ? ' active' : '');
    const isImageUrl = img.bg && img.bg.trim().startsWith('url(');
    if (isImageUrl) {
      // Show actual image in thumbnail
      thumb.style.backgroundImage    = img.bg;
      thumb.style.backgroundSize     = 'cover';
      thumb.style.backgroundPosition = 'center';
      thumb.style.backgroundRepeat   = 'no-repeat';
    } else {
      thumb.style.background = img.bg;
      thumb.textContent = img.icon || '📷';
    }
    thumb.addEventListener('click', () => {
      currentImgIndex = i;
      renderLightboxSlide();
    });
    lbThumbs.appendChild(thumb);
  });
}

if (lbClose)  lbClose.addEventListener('click', closeLightbox);
if (overlay)  overlay.addEventListener('click', e => { if (e.target === overlay) closeLightbox(); });
if (lbPrev)   lbPrev.addEventListener('click', () => { if (currentImages.length) { currentImgIndex = (currentImgIndex - 1 + currentImages.length) % currentImages.length; renderLightboxSlide(); }});
if (lbNext)   lbNext.addEventListener('click', () => { if (currentImages.length) { currentImgIndex = (currentImgIndex + 1) % currentImages.length; renderLightboxSlide(); }});
document.addEventListener('keydown', e => {
  if (!overlay || !overlay.classList.contains('active')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')  { currentImgIndex = (currentImgIndex - 1 + currentImages.length) % currentImages.length; renderLightboxSlide(); }
  if (e.key === 'ArrowRight') { currentImgIndex = (currentImgIndex + 1) % currentImages.length; renderLightboxSlide(); }
});

// ── HERO BACKGROUND SLIDER ────────────────────────────────
(function() {
  const heroImages = [
    "url('images/installation.jpg')",
    "url('images/background1.jpg')",
    "url('images/background2.jpg')"
  ];
  const slider = document.getElementById('heroSlider');
  if (!slider) return;
  heroImages.forEach((imgUrl, idx) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    if (idx === 0) slide.classList.add('active');
    slide.style.backgroundImage    = imgUrl;
    slide.style.backgroundSize     = 'cover';
    slide.style.backgroundPosition = 'center';
    slide.style.backgroundRepeat   = 'no-repeat';
    slider.appendChild(slide);
  });
  let currentIndex = 0;
  const slides = document.querySelectorAll('#heroSlider .slide');
  setInterval(() => {
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add('active');
  }, 3000);
})();

// ── SERVICE DETAIL HERO SLIDESHOW ─────────────────────────
(function() {
  const slides = document.querySelectorAll('.sdh-slide');
  const dots   = document.querySelectorAll('.sdh-slide-dot');
  if (!slides.length) return;
  let current = 0;
  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }
  let timer = setInterval(() => goTo(current + 1), 3000);
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      goTo(i);
      timer = setInterval(() => goTo(current + 1), 3000);
    });
  });
})();

// ── PROJECT GALLERY LIGHTBOX ──────────────────────────────
(function() {
  if (document.getElementById('projLbOverlay')) return;
  document.body.insertAdjacentHTML('beforeend', `
  <div class="proj-lightbox-overlay" id="projLbOverlay">
    <div class="proj-lightbox-inner">
      <span class="proj-lb-counter" id="projLbCounter">1 / 3</span>
      <button class="proj-lb-close" id="projLbClose">✕</button>
      <div class="proj-lb-main" id="projLbMain">
        <img id="projLbImg" src="" alt="" style="transition:opacity 0.3s ease;">
        <div class="proj-lb-caption" id="projLbCaption"></div>
      </div>
      <button class="proj-lb-nav proj-lb-prev" id="projLbPrev">‹</button>
      <button class="proj-lb-nav proj-lb-next" id="projLbNext">›</button>
      <div class="proj-lb-thumbs" id="projLbThumbs"></div>
    </div>
  </div>`);

  const ov       = document.getElementById('projLbOverlay');
  const lbImg    = document.getElementById('projLbImg');
  const lbCap    = document.getElementById('projLbCaption');
  const lbThumbs = document.getElementById('projLbThumbs');
  const lbClose  = document.getElementById('projLbClose');
  const lbPrev   = document.getElementById('projLbPrev');
  const lbNext   = document.getElementById('projLbNext');
  const lbCtr    = document.getElementById('projLbCounter');
  let images = [], idx = 0;

  function openProjLightbox(imgs, startIdx) {
    images = imgs; idx = startIdx || 0;
    buildProjThumbs(); showProjSlide(idx);
    ov.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeProjLightbox() {
    ov.classList.remove('active');
    document.body.style.overflow = '';
  }
  function showProjSlide(i) {
    idx = (i + images.length) % images.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.src = images[idx].src;
      lbImg.alt = images[idx].caption;
      lbCap.textContent = images[idx].caption;
      lbCtr.textContent = (idx + 1) + ' / ' + images.length;
      lbImg.style.opacity = '1';
    }, 200);
    document.querySelectorAll('.proj-lb-thumb').forEach((t, j) => t.classList.toggle('active', j === idx));
  }
  function buildProjThumbs() {
    lbThumbs.innerHTML = '';
    images.forEach((img, i) => {
      const el = document.createElement('div');
      el.className = 'proj-lb-thumb' + (i === 0 ? ' active' : '');
      el.innerHTML = `<img src="${img.src}" alt="${img.caption}">`;
      el.addEventListener('click', () => showProjSlide(i));
      lbThumbs.appendChild(el);
    });
  }

  lbClose.addEventListener('click', closeProjLightbox);
  ov.addEventListener('click', e => { if (e.target === ov) closeProjLightbox(); });
  lbPrev.addEventListener('click', () => showProjSlide(idx - 1));
  lbNext.addEventListener('click', () => showProjSlide(idx + 1));
  document.addEventListener('keydown', e => {
    if (!ov.classList.contains('active')) return;
    if (e.key === 'Escape')      closeProjLightbox();
    if (e.key === 'ArrowLeft')  showProjSlide(idx - 1);
    if (e.key === 'ArrowRight') showProjSlide(idx + 1);
  });

  window.openProjLightbox = openProjLightbox;
})();
