/* ============================================================
   STUDIO 361° ARCHITECTS — Main JavaScript
   ============================================================ */

'use strict';

/* ── Hero Slideshow ── */
(function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;

  let current = 0;
  const total  = slides.length;
  const DELAY  = 5000; // ms between slides

  function goTo(index) {
    const prev = current;
    current = (index + total) % total;

    slides[prev].classList.remove('active');
    slides[prev].classList.add('leaving');
    slides[current].classList.add('active');

    // Clean up "leaving" class after transition ends
    setTimeout(() => {
      slides[prev].classList.remove('leaving');
    }, 1800);
  }

  // Auto-advance
  let timer = setInterval(() => goTo(current + 1), DELAY);

  // Pause on hover (optional premium touch)
  const slideshow = document.getElementById('heroSlideshow');
  if (slideshow) {
    slideshow.addEventListener('mouseenter', () => clearInterval(timer));
    slideshow.addEventListener('mouseleave', () => {
      timer = setInterval(() => goTo(current + 1), DELAY);
    });
  }
})();


/* ── Scroll Progress Bar ── */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / total * 100) + '%';
  }, { passive: true });
})();

/* ── Navbar ── */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const isLight = nav.dataset.navLight === 'true';

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add(isLight ? 'scrolled-light' : 'scrolled');
    } else {
      nav.classList.remove('scrolled', 'scrolled-light');
    }
  }, { passive: true });

  /* Active nav link */
  const links = nav.querySelectorAll('.nav-link');
  links.forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });
})();

/* ── Hamburger / Mobile Nav ── */
(function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const overlay   = document.getElementById('mobile-overlay');
  if (!hamburger || !mobileNav) return;

  function open() {
    hamburger.classList.add('open');
    mobileNav.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? close() : open();
  });
  if (overlay) overlay.addEventListener('click', close);
  mobileNav.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', close));
})();

/* ── Project Card Zoom on Click ── */
(function initProjectZoom() {
  const cards = document.querySelectorAll('.project-card, .masonry-item');
  
  cards.forEach(card => {
    card.addEventListener('click', function(e) {
      // If clicking a link inside, let it happen
      if (e.target.tagName === 'A' || e.target.closest('a')) return;
      
      const isZoomed = this.classList.contains('is-zoomed');
      
      // Close others
      cards.forEach(c => c.classList.remove('is-zoomed'));
      
      if (!isZoomed) {
        this.classList.add('is-zoomed');
      }
    });
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.project-card') && !e.target.closest('.masonry-item')) {
      cards.forEach(c => c.classList.remove('is-zoomed'));
    }
  });
})();

/* ── Hero Background Ken-Burns ── */
(function initHeroBg() {
  const bg = document.querySelector('.hero-bg, .page-hero-bg');
  if (!bg) return;
  requestAnimationFrame(() => bg.classList.add('loaded'));
})();

/* ── Scroll Reveal ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  els.forEach(el => io.observe(el));
})();

/* ── Animated Counters ── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
})();

/* ── Testimonials Slider ── */
(function initSlider() {
  const track = document.querySelector('.testimonials-track');
  if (!track) return;

  const slides = track.querySelectorAll('.testimonial-slide');
  const dots   = document.querySelectorAll('.slider-dot');
  const prev   = document.getElementById('slider-prev');
  const next   = document.getElementById('slider-next');
  let current  = 0;
  let timer;

  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetTimer(); }));
  if (prev) prev.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
  if (next) next.addEventListener('click', () => { goTo(current + 1); resetTimer(); });

  function resetTimer() { clearInterval(timer); timer = setInterval(() => goTo(current + 1), 5000); }
  goTo(0);
  resetTimer();
})();

/* ── Portfolio Filter ── */
(function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.masonry-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;

      items.forEach(item => {
        const match = cat === 'all' || item.dataset.category === cat;
        item.style.opacity = '0';
        item.style.transform = 'scale(0.92)';
        setTimeout(() => {
          item.style.display = match ? 'block' : 'none';
          if (match) {
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          }
        }, 200);
        item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      });
    });
  });
})();

/* ── Lightbox ── */
(function initLightbox() {
  const lightbox  = document.getElementById('lightbox');
  if (!lightbox) return;

  const lbImg     = lightbox.querySelector('.lightbox-img');
  const lbTag     = lightbox.querySelector('.lb-tag');
  const lbTitle   = lightbox.querySelector('.lb-title');
  const closeBtn  = lightbox.querySelector('.lightbox-close');
  const prevBtn   = lightbox.querySelector('#lb-prev');
  const nextBtn   = lightbox.querySelector('#lb-next');

  let items = [];
  let idx   = 0;

  function open(i) {
    idx = i;
    const item = items[idx];
    lbImg.src = item.img;
    if (lbTag)   lbTag.textContent   = item.tag   || '';
    if (lbTitle) lbTitle.textContent = item.title || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 400);
  }

  function navigate(dir) {
    idx = (idx + dir + items.length) % items.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      open(idx);
      lbImg.style.opacity = '1';
    }, 200);
    lbImg.style.transition = 'opacity 0.2s';
  }

  document.querySelectorAll('.masonry-item[data-img]').forEach((el, i) => {
    items.push({ img: el.dataset.img, tag: el.dataset.tag, title: el.dataset.title });
    // el.addEventListener('click', () => open(i)); // Removed lightbox trigger
  });

  if (closeBtn)  closeBtn.addEventListener('click', close);
  if (prevBtn)   prevBtn.addEventListener('click', () => navigate(-1));
  if (nextBtn)   nextBtn.addEventListener('click', () => navigate(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   navigate(-1);
    if (e.key === 'ArrowRight')  navigate(1);
  });
})();

/* ── Contact Form ── */
(function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Message Sent ✓';
      btn.style.background = '#2a6e2a';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    }, 1400);
  });
})();

/* ── Lazy Load Images ── */
(function initLazyLoad() {
  const imgs = document.querySelectorAll('img[data-src]');
  if (!imgs.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const img = e.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        io.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  imgs.forEach(img => io.observe(img));
})();

/* ── Smooth page-load fade ── */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});
