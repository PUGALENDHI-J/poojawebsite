/* ============================================================
   ZENORA RETREAT — MAIN.JS
   Core initialization, utilities, preloader, cursor
   ============================================================ */

'use strict';

// ── Custom Cursor ──
const initCursor = () => {
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  const animateFollower = () => {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  };
  animateFollower();

  // Hover enlargement
  const hoverTargets = document.querySelectorAll('a, button, .btn, .card-pod, .gallery-item, .feature-card');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('hovered'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hovered'));
  });
};

// ── Reveal on Scroll ──
const initReveal = () => {
  const elements = document.querySelectorAll('[data-reveal], [data-stagger]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));

  // Image reveals
  const imgReveal = document.querySelectorAll('.img-reveal-wrap');
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        imgObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  imgReveal.forEach(el => imgObserver.observe(el));
};

// ── Parallax ──
const initParallax = () => {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (parallaxElements.length === 0) return;

  const handleParallax = () => {
    parallaxElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      const yPos = -(rect.top * speed);
      el.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
  };

  window.addEventListener('scroll', handleParallax, { passive: true });
};

// ── Counter Animation ──
const initCounters = () => {
  const counters = document.querySelectorAll('[data-counter]');

  const animateCounter = (el, target, prefix, suffix) => {
    const duration = 1800;
    const start = performance.now();
    const isDecimal = String(target).includes('.');
    const decimals = isDecimal ? String(target).split('.')[1].length : 0;

    const update = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = prefix + current.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.counter);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, prefix, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
};

// ── Horizontal Drag Scroll ──
const initHorizontalScroll = () => {
  const containers = document.querySelectorAll('.h-scroll-container');
  containers.forEach(container => {
    let isDown = false, startX, scrollLeft;

    container.addEventListener('mousedown', e => {
      isDown = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });
    container.addEventListener('mouseleave', () => isDown = false);
    container.addEventListener('mouseup', () => isDown = false);
    container.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    });
  });
};

// ── Ripple Effect ──
const initRipple = () => {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('click', e => {
      const ripple = document.createElement('span');
      ripple.classList.add('magnetic-ripple');
      const size = Math.max(btn.offsetWidth, btn.offsetHeight);
      const rect = btn.getBoundingClientRect();
      ripple.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${e.clientX - rect.left - size/2}px;
        top:  ${e.clientY - rect.top  - size/2}px;
      `;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
};

// ── Page Transition ──
const initPageTransition = () => {
  const overlay = document.querySelector('.page-transition');
  if (!overlay) return;

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('https://wa.me') || href.startsWith('http')) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.add('entering');
      setTimeout(() => {
        window.location.href = href;
      }, 650);
    });
  });

  // On load, play exit
  window.addEventListener('pageshow', () => {
    overlay.classList.remove('entering');
    overlay.classList.add('leaving');
    setTimeout(() => overlay.classList.remove('leaving'), 800);
  });
};

// ── Hero animations trigger ──
const initHeroAnimations = () => {
  const hero = document.querySelector('.hero-animate');
  if (!hero) return;
  setTimeout(() => hero.style.opacity = '1', 100);
};

// ── Init All ──
window.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initReveal();
  initParallax();
  initCounters();
  initHorizontalScroll();
  initRipple();
  initPageTransition();
  initHeroAnimations();
});
