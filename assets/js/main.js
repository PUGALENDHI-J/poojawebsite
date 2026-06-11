/* ============================================================
   OHC SERVICES — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ── DOM Ready ── */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNav();
    initScrollAnimations();
    initCounters();
    initFAQ();
    initMobileNav();
    setActiveNav();
    initSmoothScroll();
  }

  /* ── Navigation ── */
  function initNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const isHeroPage = document.querySelector('.hero');

    function updateNav() {
      const scrolled = window.scrollY > 60;
      if (isHeroPage) {
        nav.classList.toggle('scrolled', scrolled);
        nav.classList.toggle('transparent', !scrolled);
      } else {
        nav.classList.add('scrolled');
        nav.classList.remove('transparent');
      }
    }

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  function setActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ── Mobile Nav ── */
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const isOpen = mobileNav.classList.contains('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    mobileNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }

  /* ── Scroll Animations ── */
  function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
  }

  /* ── Animated Counters ── */
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-counter'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = prefix + (Number.isInteger(target) ? Math.round(value) : value.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ── FAQ Accordion ── */
  function initFAQ() {
    document.querySelectorAll('.faq-item').forEach(item => {
      const q = item.querySelector('.faq-q');
      if (!q) return;
      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ── Smooth Scroll ── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

})();
