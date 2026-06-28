/* ============================================================
   ZENORA RETREAT — ANIMATION.JS
   Section-specific animations: hero, gallery, testimonials
   ============================================================ */

'use strict';

// ── Hero Parallax ──
const initHeroParallax = () => {
  const hero = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero-bg');
  if (!hero || !heroBg) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    heroBg.style.transform = `translate3d(0, ${scrolled * 0.4}px, 0)`;
    hero.style.opacity = 1 - (scrolled / (hero.offsetHeight * 0.8));
  }, { passive: true });
};

// ── Testimonials Slider ──
const initTestimonials = () => {
  const track = document.querySelector('.testimonials-track');
  const prev = document.querySelector('.testimonials-prev');
  const next = document.querySelector('.testimonials-next');
  const dots = document.querySelectorAll('.testimonials-dot');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let isAnimating = false;

  const goTo = (idx) => {
    if (isAnimating) return;
    isAnimating = true;
    current = (idx + cards.length) % cards.length;

    cards.forEach((c, i) => {
      c.style.opacity = i === current ? '1' : '0';
      c.style.transform = i === current ? 'translateX(0) scale(1)' : 'translateX(30px) scale(0.97)';
      c.style.pointerEvents = i === current ? '' : 'none';
      c.style.position = i === current ? 'relative' : 'absolute';
    });

    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    setTimeout(() => isAnimating = false, 500);
  };

  if (prev) prev.addEventListener('click', () => goTo(current - 1));
  if (next) next.addEventListener('click', () => goTo(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

  // Auto-play
  let autoPlay = setInterval(() => goTo(current + 1), 5000);
  track.addEventListener('mouseenter', () => clearInterval(autoPlay));
  track.addEventListener('mouseleave', () => autoPlay = setInterval(() => goTo(current + 1), 5000));

  // Initialize
  goTo(0);
};

// ── Horizontal scroll gallery ──
const initScrollGallery = () => {
  const gallery = document.querySelector('.h-scroll-container');
  if (!gallery) return;

  // Touch support
  let touchStartX = 0;
  gallery.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX, { passive: true });
  gallery.addEventListener('touchmove', e => {
    const diff = touchStartX - e.touches[0].clientX;
    gallery.scrollLeft += diff * 0.8;
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
};

// ── Number tickers on visible ──
const initStatsTicker = () => {
  document.querySelectorAll('[data-ticker]').forEach(el => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('tick');
        obs.unobserve(el);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
  });
};

// ── Image lazy load with fade ──
const initLazyImages = () => {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.style.opacity = '0';
        img.addEventListener('load', () => {
          img.style.transition = 'opacity 0.6s ease';
          img.style.opacity = '1';
        });
        imageObserver.unobserve(img);
      }
    });
  }, { rootMargin: '100px' });

  images.forEach(img => imageObserver.observe(img));
};

document.addEventListener('DOMContentLoaded', () => {
  initHeroParallax();
  initTestimonials();
  initScrollGallery();
  initStatsTicker();
  initLazyImages();
});
