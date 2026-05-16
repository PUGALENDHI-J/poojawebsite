/* ============================================================
   SPARKLE SHINE — animations.js
   Premium animation effects
   ============================================================ */

'use strict';

/* ============================================================
   TEXT REVEAL ANIMATION
   Split text into words and animate each
   ============================================================ */
(function initTextReveal() {
  const targets = document.querySelectorAll('[data-text-reveal]');
  targets.forEach(el => {
    const words = el.textContent.split(' ');
    el.textContent = '';
    el.style.overflow = 'hidden';

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          words.forEach((word, i) => {
            const span = document.createElement('span');
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(24px)';
            span.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`;
            span.textContent = word + '\u00A0';
            el.appendChild(span);
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
              });
            });
          });
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(el);
  });
})();

/* ============================================================
   COUNTER ANIMATION
   Animates numeric values when in view
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      let start = null;

      function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

      function update(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.round(easeOutQuart(progress) * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ============================================================
   PARALLAX HERO
   Subtle parallax on hero section
   ============================================================ */
(function initParallax() {
  const hero = document.querySelector('.hero-bg-img');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      hero.style.transform = `translateY(${scrollY * 0.25}px)`;
    }
  }, { passive: true });
})();

/* ============================================================
   PRODUCT CARD TILT
   Subtle 3D tilt effect on product cards
   ============================================================ */
(function initCardTilt() {
  const cards = document.querySelectorAll('.product-card');
  const maxTilt = 6; // degrees

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;
      const cx    = rect.width / 2;
      const cy    = rect.height / 2;
      const rotX  = ((y - cy) / cy) * -maxTilt;
      const rotY  = ((x - cx) / cx) *  maxTilt;

      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'box-shadow 0.3s ease';
    });
  });
})();

/* ============================================================
   FLOATING LEAF PARTICLES
   Decorative floating elements in hero
   ============================================================ */
(function initFloatingParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const symbols = ['✦', '◆', '·', '✧', '⋆'];
  const count   = 12;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    particle.classList.add('hero-particle');
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    const size  = Math.random() * 10 + 6;
    const left  = Math.random() * 100;
    const delay = Math.random() * 8;
    const dur   = Math.random() * 6 + 8;
    const opacity = Math.random() * 0.25 + 0.05;

    Object.assign(particle.style, {
      position:   'absolute',
      left:       left + '%',
      top:        (Math.random() * 80 + 10) + '%',
      fontSize:   size + 'px',
      color:      'rgba(201,168,76,' + opacity + ')',
      zIndex:     '2',
      pointerEvents: 'none',
      animation:  `floatParticle ${dur}s ${delay}s ease-in-out infinite`,
    });

    hero.appendChild(particle);
  }

  // Inject keyframe if not already injected
  if (!document.querySelector('#particle-style')) {
    const style = document.createElement('style');
    style.id = 'particle-style';
    style.textContent = `
      @keyframes floatParticle {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
        33%  { transform: translateY(-20px) rotate(10deg); opacity: 1; }
        66%  { transform: translateY(10px) rotate(-8deg); opacity: 0.6; }
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ============================================================
   NAVBAR LOGO HOVER EFFECT
   ============================================================ */
(function initLogoEffect() {
  const logo = document.querySelector('.nav-logo');
  if (!logo) return;
  logo.addEventListener('mouseenter', () => {
    logo.style.transform = 'scale(1.04)';
    logo.style.transition = 'transform 0.3s ease';
  });
  logo.addEventListener('mouseleave', () => {
    logo.style.transform = 'scale(1)';
  });
})();

/* ============================================================
   IMAGE REVEAL ON SCROLL
   ============================================================ */
(function initImageReveal() {
  const images = document.querySelectorAll('[data-reveal]');
  if (!images.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  // Inject reveal styles
  if (!document.querySelector('#reveal-style')) {
    const style = document.createElement('style');
    style.id = 'reveal-style';
    style.textContent = `
      [data-reveal] {
        clip-path: inset(0 100% 0 0);
        transition: clip-path 1s cubic-bezier(0.77,0,0.18,1);
      }
      [data-reveal].revealed {
        clip-path: inset(0 0% 0 0);
      }
    `;
    document.head.appendChild(style);
  }

  images.forEach(img => observer.observe(img));
})();

/* ============================================================
   GOLD SHIMMER on section labels
   ============================================================ */
(function initGoldShimmer() {
  if (!document.querySelector('#shimmer-style')) {
    const style = document.createElement('style');
    style.id = 'shimmer-style';
    style.textContent = `
      .section-label {
        background: linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 45%, var(--gold) 100%);
        background-size: 200%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: goldShimmer 3s linear infinite;
      }
      .section-label::before {
        background: var(--gold);
        -webkit-text-fill-color: initial;
        background-clip: initial;
      }
      @keyframes goldShimmer {
        0%   { background-position: 200% center; }
        100% { background-position: -200% center; }
      }
    `;
    document.head.appendChild(style);
  }
})();
