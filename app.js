/* ============================================================
   Wells Europe 2026 — app.js
   Bruce & Trudy Wells · 10 August – 22 September 2026
   ============================================================ */

'use strict';

// ── Departure date ────────────────────────────────────────────
const DEPARTURE = new Date('2026-08-10T09:45:00+09:30');
const RETURN    = new Date('2026-09-22T22:35:00+09:30');

// ── Countdown timer ───────────────────────────────────────────
function updateCountdown() {
  const now  = new Date();
  const diff = DEPARTURE - now;

  if (diff <= 0) {
    const el = document.getElementById('countdown');
    if (el) el.innerHTML = '<span class="cd-live">✈️ Trip is underway!</span>';
    return;
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val).padStart(2, '0');
  };
  set('cd-days',    days);
  set('cd-hours',   hours);
  set('cd-minutes', minutes);
  set('cd-seconds', seconds);
}

// ── Travel status banner ──────────────────────────────────────
function updateStatus() {
  const now = new Date();

  const todayEl    = document.getElementById('status-today');
  const tomorrowEl = document.getElementById('status-tomorrow');
  const statusEl   = document.getElementById('status-state');

  if (!todayEl) return;

  if (now < DEPARTURE) {
    const daysTo = Math.ceil((DEPARTURE - now) / (1000 * 60 * 60 * 24));
    todayEl.textContent    = 'At home — preparing for departure';
    tomorrowEl.textContent = daysTo === 1 ? '✈️ Departure day tomorrow!' : `${daysTo} days to departure`;
    statusEl.textContent   = '🗓 Pre-departure';
    statusEl.className     = 'status-badge status-pre';
  } else if (now <= RETURN) {
    todayEl.textContent    = '✈️ Currently travelling Europe!';
    tomorrowEl.textContent = 'Check the itinerary for today\'s details';
    statusEl.textContent   = '🌍 In transit';
    statusEl.className     = 'status-badge status-active';
  } else {
    todayEl.textContent    = 'Back home in Adelaide 🏠';
    tomorrowEl.textContent = 'What a trip!';
    statusEl.textContent   = '✅ Trip complete';
    statusEl.className     = 'status-badge status-done';
  }
}

// ── Smooth scroll for nav links ───────────────────────────────
function initNav() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile nav if open
      const nav = document.getElementById('mobile-nav');
      if (nav) nav.classList.remove('open');
    });
  });
}

// ── Mobile nav toggle ─────────────────────────────────────────
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav    = document.getElementById('mobile-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('open');
    }
  });
}

// ── Collapsible sections ──────────────────────────────────────
function initCollapsibles() {
  document.querySelectorAll('.collapsible-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const target  = document.getElementById(btn.getAttribute('data-target'));
      const isOpen  = target && !target.classList.contains('collapsed');
      if (!target) return;
      target.classList.toggle('collapsed');
      btn.setAttribute('aria-expanded', String(!isOpen));
      btn.querySelector('.chevron')?.classList.toggle('rotated');
    });
  });
}

// ── Back-to-top button ────────────────────────────────────────
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Sticky header shrink on scroll ───────────────────────────
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('shrunk', window.scrollY > 60);
  }, { passive: true });
}

// ── Copy-to-clipboard for booking refs ───────────────────────
function initCopyButtons() {
  document.querySelectorAll('.copy-ref').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-ref');
      navigator.clipboard?.writeText(text).then(() => {
        btn.textContent = '✓ Copied';
        setTimeout(() => (btn.textContent = '📋'), 1800);
      });
    });
  });
}

// ── Active nav highlight on scroll ───────────────────────────
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

// ── Print handler ─────────────────────────────────────────────
function initPrint() {
  const btn = document.getElementById('print-btn');
  if (btn) btn.addEventListener('click', () => window.print());
}

// ── Service Worker registration ───────────────────────────────
function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.warn('SW registration failed:', err));
  }
}

// ── Init all ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateCountdown();
  updateStatus();
  setInterval(updateCountdown, 1000);

  initNav();
  initMobileNav();
  initCollapsibles();
  initBackToTop();
  initStickyHeader();
  initCopyButtons();
  initScrollSpy();
  initPrint();
  registerSW();

  console.log('✈️ Wells Europe 2026 — ready');
});
