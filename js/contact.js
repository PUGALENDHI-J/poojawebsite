/* ============================================================
   ZENORA RETREAT — CONTACT.JS
   Form handling, validation, WhatsApp, Map
   ============================================================ */

'use strict';

const WHATSAPP_NUMBER = '919994048360';
const CONTACT_EMAIL = 'pod-staysretreat@gmail.com';

const initContactForm = () => {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();
    const type = form.querySelector('[name="type"]')?.value || 'general';

    let errors = [];
    if (!name) errors.push('name');
    if (!phone && !email) errors.push('phone');
    if (!message) errors.push('message');

    if (errors.length) {
      errors.forEach(field => {
        const input = form.querySelector(`[name="${field}"]`);
        if (input) {
          input.style.borderBottomColor = '#c0392b';
          input.addEventListener('focus', () => input.style.borderBottomColor = '', { once: true });
        }
      });
      return;
    }

    // WhatsApp route
    const waMessage = encodeURIComponent(
      `Hello POD STAYS!\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nType: ${type}\n\nMessage: ${message}`
    );
    const waBtn = form.querySelector('.form-wa-submit');
    if (waBtn) {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`, '_blank');
    }

    // Show success
    const success = document.querySelector('.form-success');
    if (success) {
      form.style.opacity = '0';
      form.style.pointerEvents = 'none';
      setTimeout(() => { form.style.display = 'none'; success.style.display = 'flex'; }, 400);
    }
  });
};

const initWhatsAppButtons = () => {
  document.querySelectorAll('[data-whatsapp]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const msg = btn.dataset.whatsapp || 'Hello POD STAYS!';
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    });
  });
};

const initEmailButtons = () => {
  document.querySelectorAll('[data-email]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const subject = btn.dataset.subject || 'Enquiry - POD STAYS';
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initWhatsAppButtons();
  initEmailButtons();
});
