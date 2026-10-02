(() => {
  document.documentElement.classList.add('js');

  const data = window.portfolioData || {};
  const EMAIL = (data.contact && data.contact.email) || 'abir.hossain.14558@gmail.com';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };

  const isPlaceholder = (value) => typeof value === 'string' && /^\[.*\]/.test(value.trim());

  const externalLink = (href, label, className) => {
    const a = el('a', className);
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.append(document.createTextNode(label));
    const arrow = el('span', 'arrow', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    const sr = el('span', 'sr-only', ' (opens in a new tab)');
    a.append(arrow, sr);
    return a;
  };

  // === Selected work ===
  const renderCaseStudies = () => {
    const list = document.querySelector('[data-case-studies]');
    const items = Array.isArray(data.caseStudies) ? data.caseStudies : [];
    if (!list) return;
    list.textContent = '';

    items.forEach((item, index) => {
      const article = el('article', 'work-row');
      const titleId = `work-${item.id || index}`;
      article.setAttribute('aria-labelledby', titleId);

      const media = el('div', 'work-media');
      const img = el('img');
      img.src = item.image || '';
      img.alt = item.imageAlt || '';
      img.width = 571;
      img.height = 552;
      img.decoding = 'async';
      img.loading = 'eager';
      if (index === 0) img.fetchPriority = 'high';
      media.append(el('span', 'work-index', String(index + 1).padStart(2, '0')), img);

      const body = el('div', 'work-body');

      const meta = el('p', 'work-meta');
      [item.name, item.category].filter(Boolean).forEach((part, i) => {
        if (i > 0) meta.append(el('span', 'dot-sep', '·'));
        meta.append(el('span', i === 0 ? 'work-name' : '', part));
      });

      const heading = el('h3', 'work-title');
      heading.id = titleId;
      const href = typeof item.href === 'string' ? item.href.trim() : '';
      if (href) {
        // The whole row is clickable through this link's stretched hit area.
        const link = el('a', 'work-link-cover', item.title || '');
        link.href = href;
        link.target = '_blank';
        link.rel = 'noopener';
        heading.append(link);
      } else {
        heading.textContent = item.title || '';
      }

      body.append(meta, heading);
      if (item.description) body.append(el('p', 'work-desc', item.description));

      const details = el('dl', 'work-details');
      [['Scope', item.scope], ['Platform', item.platform]].forEach(([label, value]) => {
        if (!value) return;
        const row = el('div');
        row.append(el('dt', '', label), el('dd', '', value));
        details.append(row);
      });
      if (details.childElementCount) body.append(details);

      if (href) {
        const cue = el('span', 'work-cue');
        cue.setAttribute('aria-hidden', 'true');
        cue.append(el('span', '', item.linkText || 'View project'));
        cue.insertAdjacentHTML('beforeend', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>');
        body.append(cue);
      }

      article.append(media, body);
      list.append(article);
    });
  };

  // === Experience ===
  const renderExperience = () => {
    const list = document.querySelector('[data-experience]');
    const items = Array.isArray(data.experience) ? data.experience : [];
    if (!list) return;
    list.textContent = '';

    items.forEach((job) => {
      const li = el('li', 'job');
      if (job.current) li.classList.add('is-current');

      const when = el('p', 'job-dates', job.dates || '');
      if (isPlaceholder(job.dates)) when.classList.add('is-placeholder');

      const main = el('div', 'job-main');
      const title = el('h3', 'job-company');
      if (job.href) {
        title.append(externalLink(job.href, job.company, 'text-link'));
      } else {
        title.textContent = job.company || '';
        if (isPlaceholder(job.company)) title.classList.add('is-placeholder');
      }
      main.append(title);
      const roles = Array.isArray(job.roles) && job.roles.length
        ? job.roles
        : [{ title: job.role, dates: '', current: job.current }];
      const roleList = el('ol', 'job-roles');
      roles.forEach((r) => {
        const item = el('li', 'job-role');
        if (r.current) item.classList.add('is-current');
        const name = el('span', 'job-role-title', r.title || '');
        if (r.current) name.append(el('span', 'job-now', 'Current'));
        item.append(name);
        if (r.dates) item.append(el('span', 'job-role-dates', r.dates));
        roleList.append(item);
      });
      if (roles.length > 1) roleList.classList.add('is-progression');
      main.append(roleList);

      const desc = el('p', 'job-desc', job.description || '');
      if (isPlaceholder(job.description)) desc.classList.add('is-placeholder');

      li.append(when, main, desc);
      list.append(li);
    });
  };

  // === Capabilities ===
  const renderCapabilities = () => {
    const wrap = document.querySelector('[data-capabilities]');
    const groups = Array.isArray(data.capabilities) ? data.capabilities : [];
    if (!wrap) return;
    wrap.textContent = '';

    groups.forEach((group) => {
      const section = el('div', 'cap-group');
      section.append(el('h3', 'cap-title', group.group));
      const ul = el('ul', 'cap-list');
      (group.items || []).forEach((name) => ul.append(el('li', 'cap-item', name)));
      section.append(ul);
      wrap.append(section);
    });
  };

  // === Currently exploring ===
  const renderExploring = () => {
    const list = document.querySelector('[data-exploring]');
    const items = Array.isArray(data.exploring) ? data.exploring : [];
    if (!list) return;
    list.textContent = '';
    items.forEach((name) => list.append(el('li', '', name)));
  };

  // === Copy email ===
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

  // === Active nav state ===
  const initNavState = () => {
    const links = Array.from(document.querySelectorAll('.nav-link[data-nav]'));
    const sections = links.map((l) => document.getElementById(l.dataset.nav)).filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const visible = new Map();
    const update = () => {
      let current = null;
      let best = 0;
      visible.forEach((ratio, id) => {
        if (ratio > best) { best = ratio; current = id; }
      });
      links.forEach((l) => {
        const active = l.dataset.nav === current;
        l.classList.toggle('is-active', active);
        if (active) l.setAttribute('aria-current', 'true');
        else l.removeAttribute('aria-current');
      });
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

  // === Anchor scrolling (respects reduced motion, moves focus for keyboard users) ===
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
        if (id !== '#top') {
          history.replaceState(null, '', id);
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      });
    });
  };

  // === Local time in footer ===
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
  renderExperience();
  renderCapabilities();
  renderExploring();
  initNavState();
  initAnchors();
  initClock();
})();
