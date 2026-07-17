/* ──────────────────────────────────────
   NAV: transparent → floating pill on scroll
────────────────────────────────────── */
const nav = document.getElementById('main-nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

/* ──────────────────────────────────────
   MOBILE MENU: hamburger toggle
────────────────────────────────────── */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');

function openMobileMenu() {
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  if (mobileMenu.classList.contains('open')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileMenu();
});

/* ──────────────────────────────────────
   SCROLL REVEAL — Intersection Observer
────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // fire once
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});

/* ──────────────────────────────────────
   ABOUT TEXT — word-by-word unblur on scroll
────────────────────────────────────── */
(function initWordReveal() {
  const el = document.querySelector('.about-text');
  if (!el) return;

  // Wrap every word in a span, preserving child elements (e.g. .highlight)
  function wrapWords(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const parts = node.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      parts.forEach(part => {
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else if (part) {
          const span = document.createElement('span');
          span.className = 'word-reveal';
          span.textContent = part;
          frag.appendChild(span);
        }
      });
      node.parentNode.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(wrapWords);
    }
  }

  wrapWords(el);

  const words = Array.from(el.querySelectorAll('.word-reveal'));
  const total = words.length;

  function update() {
    const rect = el.getBoundingClientRect();
    const vh   = window.innerHeight;
    // progress 0 = element at bottom of screen, 1 = element top at 25% from top
    const progress = (vh - rect.top) / (vh * 0.75);

    words.forEach((word, i) => {
      const wp = Math.max(0, Math.min(1, (progress * total - i * 0.7) / 2));
      word.style.opacity = 0.15 + wp * 0.85;
      word.style.filter  = `blur(${(1 - wp) * 7}px)`;
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ──────────────────────────────────────
   HERO bg subtle parallax on scroll
────────────────────────────────────── */
const heroBg = document.querySelector('.hero-bg');

window.addEventListener('scroll', () => {
  if (!heroBg) return;
  heroBg.style.backgroundPosition = `center calc(30% + ${window.scrollY * 0.5}px)`;
}, { passive: true });

