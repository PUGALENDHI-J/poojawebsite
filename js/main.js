/* ============================================================
   SPARKLE SHINE — main.js
   Core interactions and UI behaviours
   ============================================================ */

'use strict';

/* ============================================================
   LOADER
   ============================================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 2000);
});

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Scale on interactive elements
  const interactives = document.querySelectorAll('a, button, .product-card, .cat-card, .filter-tab, .faq-item');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => { ring.style.width = '56px'; ring.style.height = '56px'; ring.style.borderColor = 'var(--gold)'; });
    el.addEventListener('mouseleave', () => { ring.style.width = '36px'; ring.style.height = '36px'; ring.style.borderColor = 'var(--green-mid)'; });
  });
})();

/* ============================================================
   SCROLL PROGRESS
   ============================================================ */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = (window.scrollY / total) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ============================================================
   NAVBAR SCROLL BEHAVIOUR
   ============================================================ */
(function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ============================================================
   HAMBURGER MENU
   ============================================================ */
(function initHamburger() {
  const btn    = document.querySelector('.nav-hamburger');
  const mobile = document.querySelector('.nav-mobile');
  if (!btn || !mobile) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    mobile.classList.toggle('open');
    document.body.style.overflow = mobile.classList.contains('open') ? 'hidden' : '';
  });
  mobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('active');
      mobile.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ============================================================
   BACK TO TOP
   ============================================================ */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ============================================================
   SCROLL ANIMATIONS (IntersectionObserver)
   ============================================================ */
(function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-up, .fade-in');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on siblings
        const siblings = entry.target.parentElement.querySelectorAll('.fade-up, .fade-in');
        let idx = 0;
        siblings.forEach((sib, j) => { if (sib === entry.target) idx = j; });
        entry.target.style.transitionDelay = (idx * 0.1) + 's';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => observer.observe(el));
})();

/* ============================================================
   PRODUCT FILTER (Products Page)
   ============================================================ */
(function initProductFilter() {
  const tabs  = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.product-card[data-cat]');
  const countEl = document.querySelector('.products-count');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;

      let visible = 0;
      cards.forEach(card => {
        const match = cat === 'all' || card.dataset.cat === cat;
        card.style.display = match ? 'block' : 'none';
        if (match) visible++;
      });

      if (countEl) countEl.textContent = `Showing ${visible} products`;
    });
  });
})();

/* ============================================================
   TESTIMONIALS SLIDER
   ============================================================ */
(function initTestimonialsSlider() {
  const track = document.querySelector('.testimonials-track');
  const prevBtn = document.querySelector('.testi-btn.prev');
  const nextBtn = document.querySelector('.testi-btn.next');
  if (!track) return;

  let currentIndex = 0;
  const getCardWidth = () => track.querySelector('.testimonial-card')
    ? track.querySelector('.testimonial-card').offsetWidth + 32 : 432;

  function slide(dir) {
    const cards = track.querySelectorAll('.testimonial-card');
    const maxIndex = cards.length - getVisibleCount();
    currentIndex = Math.max(0, Math.min(currentIndex + dir, maxIndex));
    track.style.transform = `translateX(-${currentIndex * getCardWidth()}px)`;
  }

  function getVisibleCount() {
    const w = window.innerWidth;
    if (w < 768) return 1;
    if (w < 1100) return 2;
    return 3;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => slide(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => slide(1));

  // Auto-slide
  let autoSlide = setInterval(() => slide(1), 4500);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.parentElement.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => slide(1), 4500);
  });
})();

/* ============================================================
   PRODUCT GALLERY (Detail Page)
   ============================================================ */
(function initProductGallery() {
  const thumbs   = document.querySelectorAll('.product-thumb');
  const mainImg  = document.querySelector('.product-main-img img');
  if (!thumbs.length || !mainImg) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const src = thumb.querySelector('img')?.src;
      if (src) {
        mainImg.style.opacity = '0';
        setTimeout(() => {
          mainImg.src = src;
          mainImg.style.opacity = '1';
        }, 200);
        mainImg.style.transition = 'opacity 0.3s ease';
      }
    });
  });
})();

/* ============================================================
   SIZE SELECTOR (Detail Page)
   ============================================================ */
(function initSizeSelector() {
  const sizeBtns = document.querySelectorAll('.size-btn');
  const priceEl  = document.querySelector('.product-detail-price');
  if (!sizeBtns.length) return;

  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (priceEl && btn.dataset.price) {
        priceEl.textContent = '₹' + btn.dataset.price;
      }
    });
  });
})();

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
(function initFaq() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ============================================================
   CONTACT FORM
   ============================================================ */
(function initContactForm() {
  const form    = document.querySelector('.contact-form');
  const success = document.querySelector('.form-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Simulate submission
    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }

    setTimeout(() => {
      form.style.display = 'none';
      if (success) success.style.display = 'block';
    }, 1200);
  });
})();

/* ============================================================
   MARQUEE DUPLICATE (for seamless loop)
   ============================================================ */
(function initMarquee() {
  const inner = document.querySelector('.marquee-inner');
  if (!inner) return;
  // Clone items for seamless scroll
  inner.innerHTML += inner.innerHTML;
})();

/* ============================================================
   SMOOTH ANCHOR SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============================================================
   ACTIVE NAV LINK
   ============================================================ */
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();
