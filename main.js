/* ============================================================
   GLS Kitchen & Bakery — Main JavaScript
   ============================================================ */

// ── NAVBAR SCROLL EFFECT ──────────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      // Only remove 'scrolled' on home page (hero page)
      if (!navbar.classList.contains('scrolled') || document.querySelector('.hero')) {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
      }
    }
  };

  // Inner pages: always keep scrolled
  if (!document.querySelector('.hero')) {
    navbar.classList.add('scrolled');
  } else {
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
}

// ── HAMBURGER MENU ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

// Inject backdrop element
const backdrop = document.createElement('div');
backdrop.className = 'nav-backdrop';
document.body.appendChild(backdrop);

function openMenu() {
  hamburger.classList.add('open');
  navLinks.classList.add('open');
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  hamburger.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
  hamburger.setAttribute('aria-expanded', 'false');
}

if (hamburger && navLinks) {
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-controls', 'navLinks');

  // Toggle on hamburger click
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on backdrop click
  backdrop.addEventListener('click', closeMenu);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu();
  });

  // Swipe left to close (touch devices)
  let touchStartX = 0;
  navLinks.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  navLinks.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx > 60) closeMenu(); // swipe right to close
  }, { passive: true });
}

// ── AOS (ANIMATE ON SCROLL) ────────────────────────────────────
const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children inside grids
      const delay = entry.target.closest('.dishes-grid, .menu-grid, .values-grid')
        ? [...entry.target.parentElement.children].indexOf(entry.target) * 80
        : 0;
      setTimeout(() => {
        entry.target.classList.add('aos-in');
      }, delay);
      aosObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

// ── MENU TABS ──────────────────────────────────────────────────
const tabBtns      = document.querySelectorAll('.tab-btn');
const menuCategories = document.querySelectorAll('.menu-category');

if (tabBtns.length) {
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      menuCategories.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetEl = document.getElementById(target);
      if (targetEl) {
        targetEl.classList.add('active');
        // Re-trigger AOS for newly visible cards
        targetEl.querySelectorAll('[data-aos]').forEach(el => {
          el.classList.remove('aos-in');
          setTimeout(() => aosObserver.observe(el), 10);
        });
      }
    });
  });
}

// ── SMOOTH HERO PARALLAX ───────────────────────────────────────
const heroImg = document.querySelector('.hero-img');
if (heroImg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    heroImg.style.transform = `scale(1.05) translateY(${scrolled * 0.25}px)`;
  }, { passive: true });
}

// ── WHATSAPP FLOAT TOOLTIP ────────────────────────────────────
const waFloat = document.querySelector('.wa-float');
if (waFloat) {
  // Add tooltip on hover
  waFloat.setAttribute('title', 'Order on WhatsApp');
}

// ── ACTIVE NAV LINK ────────────────────────────────────────────
// Already set via class in HTML, but ensure via URL path match
(function() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();
