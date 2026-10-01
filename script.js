(() => {
  document.documentElement.classList.add('js');

  const data = window.portfolioData || {};
  const contact = data.contact || {};
  const EMAIL = contact.email || 'abir.hossain.14558@gmail.com';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };

  const ARROW_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const PLUS_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';

  // === CASE STUDIES ===
  const renderCaseStudies = () => {
    const container = document.querySelector('[data-case-studies]');
    const items = Array.isArray(data.caseStudies) ? data.caseStudies : [];
    if (!container) return;
    container.innerHTML = '';

    items.forEach((item, index) => {
      const href = typeof item.buttonHref === 'string' ? item.buttonHref.trim() : '';
      const hasLink = href && href !== '#';
      const row = el(hasLink ? 'a' : 'div', 'work-row');
      if (hasLink) {
        row.href = href;
        row.target = item.buttonTarget || '_blank';
        if (row.target === '_blank') row.rel = 'noopener';
      }

      const media = el('div', 'work-media');
      const img = el('img');
      img.src = item.image || '';
      img.alt = item.imageAlt || item.title || 'Case study preview';
      img.loading = 'eager';
      if (index === 0) img.fetchPriority = 'high';
      img.decoding = 'async';
      img.width = 571;
      img.height = 552;
      media.append(el('span', 'work-index', item.number || String(index + 1).padStart(2, '0')), img);

      const body = el('div', 'work-body');
      const meta = el('p', 'work-meta');
      [item.company, item.category, item.context].filter(Boolean).forEach((part, i) => {
        if (i > 0) meta.append(el('span', 'dot-sep', '·'));
        meta.append(el('span', i === 0 ? 'company' : '', part));
      });

      const title = el('h3', 'work-title', item.title || '');
      body.append(meta, title);
      if (item.highlight) body.append(el('p', 'work-highlight', item.highlight));
      if (item.description) body.append(el('p', 'work-desc', item.description));

      if (Array.isArray(item.tags) && item.tags.length) {
        const tags = el('div', 'work-tags');
        item.tags.forEach((t) => tags.append(el('span', 'tag', t)));
        body.append(tags);
      }

      if (hasLink) {
        const link = el('span', 'work-link');
        link.append(el('span', '', item.buttonText || 'Read case study'));
        link.insertAdjacentHTML('beforeend', ARROW_SVG);
        body.append(link);
      }

      row.append(media, body);
      container.append(row);
    });
  };

  // === CAPABILITIES ===
  const renderCapabilities = () => {
    const container = document.querySelector('[data-capabilities]');
    const items = Array.isArray(data.capabilities) ? data.capabilities : [];
    if (!container) return;
    container.innerHTML = '';
    items.forEach((name, i) => {
      const li = el('li', 'cap-item');
      li.append(el('span', 'cap-num', String(i + 1).padStart(2, '0')), el('span', '', name));
      container.append(li);
    });
  };

  // === TESTIMONIALS ===
  const renderTestimonials = () => {
    const container = document.querySelector('[data-testimonials]');
    const items = Array.isArray(data.testimonials) ? data.testimonials : [];
    if (!container) return;
    container.innerHTML = '';
    if (!items.length) { container.remove(); return; }

    items.forEach((item) => {
      const fig = el('figure', 'quote');
      fig.setAttribute('data-reveal', '');
      const logo = el('div', 'quote-logo');
      if (item.logo) {
        const img = el('img');
        img.src = item.logo;
        img.alt = item.logoAlt || '';
        img.loading = 'lazy';
        logo.append(img);
      }
      const content = el('div');
      const text = el('blockquote', 'quote-text', item.body || '');
      text.style.margin = '0';
      const by = el('figcaption', 'quote-by');
      const name = el('strong', '', item.author || '');
      by.append(name, document.createTextNode(item.role ? ` · ${item.role.replace(/^[-–\s]+/, '')}` : ''));
      content.append(text, by);
      fig.append(logo, content);
      container.append(fig);
    });
  };

  // === FAQ ===
  const renderFaqs = () => {
    const container = document.querySelector('[data-faqs]');
    const items = Array.isArray(data.faqs) ? data.faqs : [];
    if (!container) return;
    container.innerHTML = '';
    const seen = new Set();

    items.forEach((item) => {
      if (!item.question || seen.has(item.question)) return;
      seen.add(item.question);
      const details = el('details', 'faq-item');
      if (item.open) details.open = true;
      const summary = el('summary');
      summary.append(el('span', '', item.question));
      const icon = el('span', 'faq-icon');
      icon.innerHTML = PLUS_SVG;
      summary.append(icon);
      details.append(summary, el('p', 'faq-answer', item.answer || ''));
      container.append(details);
    });
  };

  // === COPY EMAIL ===
  const toast = document.querySelector('[data-toast]');
  let toastTimer = null;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
  };

  const copyEmail = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(EMAIL);
      } else {
        const ta = el('textarea');
        ta.value = EMAIL;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.append(ta);
        ta.select();
        const ok = document.execCommand('copy');
        ta.remove();
        if (!ok) throw new Error('copy failed');
      }
      showToast('Email copied');
    } catch (err) {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  document.querySelectorAll('[data-copy-email]').forEach((btn) => btn.addEventListener('click', copyEmail));

  // === ACTIVE NAV STATE ===
  const initNavState = () => {
    const links = Array.from(document.querySelectorAll('.nav-link[data-nav]'));
    const sections = links.map((l) => document.getElementById(l.dataset.nav)).filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const visible = new Map();
    const update = () => {
      let current = null;
      let best = 0;
      visible.forEach((ratio, id) => { if (ratio > best) { best = ratio; current = id; } });
      links.forEach((l) => l.classList.toggle('is-active', l.dataset.nav === current));
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
        else visible.delete(entry.target.id);
      });
      update();
    }, { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.01, 0.25, 0.5, 1] });

    sections.forEach((s) => io.observe(s));
  };

  // === SMOOTH ANCHOR SCROLL (respects reduced motion) ===
  const initAnchors = () => {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const id = link.getAttribute('href');
        if (!id || id === '#') return;
        const target = id === '#top' ? document.body : document.querySelector(id);
        if (!target) return;
        event.preventDefault();
        const top = id === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top: Math.max(top, 0), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        if (id !== '#top') history.replaceState(null, '', id);
      });
    });
  };

  // === SUBTLE REVEAL ===
  const initReveal = () => {
    const nodes = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!nodes.length) return;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    nodes.forEach((n) => io.observe(n));
  };

  // === LOCAL TIME ===
  const initClock = () => {
    const node = document.querySelector('[data-local-time]');
    const year = document.querySelector('[data-year]');
    if (year) year.textContent = String(new Date().getFullYear());
    if (!node) return;
    const fmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Dhaka' });
    const tick = () => { node.textContent = fmt.format(new Date()).toLowerCase(); };
    tick();
    setInterval(tick, 30000);
  };

  renderCaseStudies();
  renderCapabilities();
  renderTestimonials();
  renderFaqs();
  initNavState();
  initAnchors();
  initReveal();
  initClock();
})();
