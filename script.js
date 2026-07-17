/* ──────────────────────────────────────
   CMS: load content from Supabase
────────────────────────────────────── */
(async function loadSiteContent() {
  const SUPABASE_URL = 'https://ivrrohxxbxhlhxohpwsu.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_CHNjIGQrfC_RxOnT_t9J7Q_XrGa4lzN';

  if (typeof supabase === 'undefined') return;
  const { createClient } = supabase;
  const db = createClient(SUPABASE_URL, SUPABASE_KEY);

  /* ── site_content key-value ── */
  const { data: contentRows } = await db.from('site_content').select('*');
  if (contentRows && contentRows.length) {
    const c = {};
    contentRows.forEach(r => { c[r.key] = r.value; });

    /* Hero */
    if (c.hero_line1) {
      const el = document.getElementById('hero-line1');
      if (el) {
        const italic = c.hero_italic ? `<em id="hero-italic">${c.hero_italic}</em>` : '';
        el.innerHTML = `${c.hero_line1}<br class="br-mobile"> ${italic}`;
      }
    }
    if (c.hero_line2) {
      const el = document.getElementById('hero-line2');
      if (el) el.textContent = c.hero_line2;
    }
    if (c.hero_subtitle) {
      const el = document.getElementById('hero-subtitle');
      if (el) {
        el.innerHTML = c.hero_subtitle
          .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
          .replace(/~~(.+?)~~/g, '<span class="strike">$1</span>')
          .replace(/\n/g, '<br>');
      }
    }
    if (c.hero_bg_image) {
      const el = document.querySelector('.hero-bg');
      if (el) el.style.backgroundImage = `url('${c.hero_bg_image}')`;
    }

    /* About teaser */
    if (c.about_teaser_pill) {
      const el = document.getElementById('about-teaser-pill');
      if (el) el.textContent = c.about_teaser_pill;
    }
    if (c.about_teaser) {
      const el = document.getElementById('about-teaser');
      if (el) {
        const html = c.about_teaser.replace(/\[\[(.+?)\]\]/g, '<span class="highlight">$1</span>');
        el.innerHTML = html;
        initWordReveal();
      }
    }

    /* About profile image */
    if (c.about_profile_image) {
      const ph = document.getElementById('about-profile-img');
      if (ph) {
        ph.style.backgroundImage = `url('${c.about_profile_image}')`;
        ph.style.backgroundSize = 'cover';
        ph.style.backgroundPosition = 'center';
      }
    }

    /* Who I Am card */
    if (c.about_who_title) {
      const el = document.getElementById('about-who-title');
      if (el) el.innerHTML = c.about_who_title.replace(/\n/g, '<br>');
    }
    if (c.about_who_desc) {
      const el = document.getElementById('about-who-desc');
      if (el) el.textContent = c.about_who_desc;
    }
    if (c.about_facts) {
      const el = document.getElementById('about-facts');
      if (el) {
        el.innerHTML = c.about_facts.split('\n')
          .filter(l => l.trim())
          .map(l => `<li>${l.trim()}</li>`)
          .join('');
      }
    }

    /* Experience timeline */
    if (c.about_experience) {
      try {
        const exp = JSON.parse(c.about_experience);
        const el = document.getElementById('about-timeline');
        if (el && exp.length) {
          el.innerHTML = exp.map(e => `
            <div class="timeline-item">
              <strong>${e.company}</strong>
              <span>${e.location}</span>
            </div>
          `).join('');
        }
      } catch {}
    }

    /* CV link */
    if (c.contact_cv) {
      const el = document.getElementById('cv-link');
      if (el) el.href = c.contact_cv;
      const btn = document.getElementById('contact-cv-btn');
      if (btn) { btn.href = c.contact_cv; btn.setAttribute('download', ''); }
    }

    /* Fun facts */
    if (c.about_funfacts) {
      const el = document.getElementById('about-funfacts');
      if (el) {
        const lines = c.about_funfacts.split('\n').filter(l => l.trim());
        let items = [];
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.includes('|')) {
            const [a, b] = line.split('|').map(s => s.trim());
            items.push(`<div class="funfact-item"><p>${a}</p><p>${b}</p></div>`);
          } else {
            items.push(`<div class="funfact-item"><p>${line}</p></div>`);
          }
        }
        el.innerHTML = items.join('');
      }
    }

    /* Projects section headings */
    if (c.projects_pill) {
      const el = document.getElementById('projects-pill');
      if (el) el.textContent = c.projects_pill;
    }
    if (c.projects_title) {
      const el = document.getElementById('projects-title');
      if (el) el.textContent = c.projects_title;
    }
    if (c.projects_sub) {
      const el = document.getElementById('projects-sub');
      if (el) el.textContent = c.projects_sub;
    }

    /* About Full section headings */
    if (c.about_full_pill) {
      const el = document.getElementById('about-full-pill');
      if (el) el.textContent = c.about_full_pill;
    }
    if (c.about_full_title) {
      const el = document.getElementById('about-full-title');
      if (el) el.textContent = c.about_full_title;
    }
    if (c.about_full_sub) {
      const el = document.getElementById('about-full-sub');
      if (el) el.textContent = c.about_full_sub;
    }

    /* Contact pill */
    if (c.contact_pill) {
      const el = document.getElementById('contact-pill');
      if (el) el.textContent = c.contact_pill;
    }

    /* Section anchors */
    const anchorMap = {
      anchor_about:       'section.about',
      anchor_projects:    'section.projects',
      anchor_about_full:  'section.about-full',
      anchor_contact:     'section.contact',
    };
    Object.entries(anchorMap).forEach(([key, selector]) => {
      if (c[key]) {
        const el = document.querySelector(selector);
        if (el) el.id = c[key];
      }
    });

    /* Nav links */
    if (c.nav_links) {
      try {
        const links = JSON.parse(c.nav_links);
        const navEl = document.getElementById('nav-links');
        const mobileMenu = document.getElementById('mobile-menu')?.querySelector('ul');
        if (navEl && links.length) {
          navEl.innerHTML = links.map(l => `<li><a href="${l.url}">${l.label}</a></li>`).join('');
        }
        if (mobileMenu && links.length) {
          mobileMenu.innerHTML = links.map(l =>
            `<li><a href="${l.url}" onclick="closeMobileMenu()">${l.label}</a></li>`
          ).join('') + `<li><a href="${c.nav_cta_url||'#contact'}" onclick="closeMobileMenu()">${c.nav_cta_label||'Contact'}</a></li>`;
        }
      } catch {}
    }
    if (c.nav_cta_label || c.nav_cta_url) {
      const el = document.getElementById('nav-cta');
      if (el) {
        if (c.nav_cta_label) el.textContent = c.nav_cta_label;
        if (c.nav_cta_url)   el.href = c.nav_cta_url;
      }
    }

    /* Contact */
    if (c.contact_title) {
      const el = document.getElementById('contact-title');
      if (el) el.innerHTML = c.contact_title.replace(/\n/g, '<br>');
    }
    if (c.contact_email) {
      const el = document.getElementById('contact-email');
      if (el) { el.textContent = c.contact_email; el.href = `mailto:${c.contact_email}`; }
    }
    if (c.contact_tel) {
      const el = document.getElementById('contact-tel');
      if (el) { el.textContent = c.contact_tel; el.href = `tel:${c.contact_tel.replace(/[^+\d]/g, '')}`; }
    }
    if (c.contact_linkedin) {
      const el = document.getElementById('contact-linkedin-btn');
      if (el) el.href = c.contact_linkedin;
    }
  }

  /* ── projects ── */
  const { data: projects } = await db.from('projects').select('*').order('display_order');
  if (projects && projects.length) {
    const grid = document.querySelector('.projects-grid');
    if (grid) {
      grid.innerHTML = projects.map((p, i) => {
        const delay = i % 2 === 1 ? ' reveal-delay-1' : '';
        const img = p.image_url
          ? `<img src="${p.image_url}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;display:block;" />`
          : `<div class="card-ph" style="color:#fff;">
               <svg width="52" height="52" viewBox="0 0 52 52" fill="none"><rect x="8" y="11" width="36" height="30" rx="4" stroke="currentColor" stroke-width="1.5"/><circle cx="19" cy="23" r="4" fill="currentColor"/><path d="M8 37 L20 25 L29 33 L37 23 L44 37" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
             </div>`;
        const tags = (p.tags || []).map(t => `<li>${t}</li>`).join('');
        return `
          <article class="project-card reveal${delay}">
            <a href="${p.link || '#'}" class="card-img" style="background:${p.bg_color || '#EEEEEE'};">
              ${img}
            </a>
            <div class="card-meta">
              <span class="card-name">${p.name}</span>
              <ul class="card-tags">${tags}</ul>
            </div>
          </article>`;
      }).join('');

      /* re-observe new cards for reveal animation */
      grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    }
  }
})();

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
let _wordRevealCleanup = null;

function initWordReveal() {
  if (_wordRevealCleanup) { _wordRevealCleanup(); _wordRevealCleanup = null; }

  const el = document.querySelector('.about-text');
  if (!el) return;

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
    const progress = (vh - rect.top) / (vh * 0.75);
    words.forEach((word, i) => {
      const wp = Math.max(0, Math.min(1, (progress * total - i * 0.7) / 2));
      word.style.opacity = 0.15 + wp * 0.85;
      word.style.filter  = `blur(${(1 - wp) * 7}px)`;
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  _wordRevealCleanup = () => window.removeEventListener('scroll', update);
  update();
}

initWordReveal();

/* ──────────────────────────────────────
   HERO bg subtle parallax on scroll
────────────────────────────────────── */
const heroBg = document.querySelector('.hero-bg');

window.addEventListener('scroll', () => {
  if (!heroBg) return;
  heroBg.style.backgroundPosition = `center calc(30% + ${window.scrollY * 0.5}px)`;
}, { passive: true });

