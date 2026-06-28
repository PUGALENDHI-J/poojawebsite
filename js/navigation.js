/* ============================================================
   POD STAYS — NAVIGATION.JS
   Sticky nav, desktop hover dropdowns, mobile accordion menu
   ============================================================ */
'use strict';

const initNavigation = () => {
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('#hamburger, .nav-hamburger');
  const mobileMenu = document.querySelector('#mobileMenu, .nav-mobile');
  const mobileClose = document.querySelector('#mobileClose, .nav-mobile-close');

  if (!nav) return;

  // Scroll shrink
  const handleScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    if (mobileClose) {
      mobileClose.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    // Close on direct link click (not toggle)
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Desktop dropdowns — hover on nav-item
  document.querySelectorAll('.nav-item').forEach(item => {
    let closeTimer;
    item.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
      item.classList.add('open');
    });
    item.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => item.classList.remove('open'), 150);
    });
  });

  // Mobile accordion — COLLAPSED by default, expand on click
  document.querySelectorAll('.nav-mobile-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = toggle.closest('.nav-mobile-item');
      if (!parent) return;
      const isOpen = parent.classList.contains('open');
      // Close all
      document.querySelectorAll('.nav-mobile-item').forEach(i => i.classList.remove('open'));
      // Open clicked if it was closed
      if (!isOpen) parent.classList.add('open');
    });
  });

  // Active link highlighting
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .nav-mobile-link, .nav-dropdown-item').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === page || (page === '' && href === 'index.html') || href.endsWith('/' + page))) {
      link.classList.add('active');
    }
  });
};

document.addEventListener('DOMContentLoaded', initNavigation);
