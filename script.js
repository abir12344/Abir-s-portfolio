// === HERO SECTION (cursor animation removed) ===

// === TITLE DYNAMIC ===
const titleDynamic = document.querySelector('.title-dynamic');
if (titleDynamic && !titleDynamic.dataset.typewriterInit) {
  titleDynamic.dataset.typewriterInit = 'true';
  const sourceNodes = Array.from(titleDynamic.querySelectorAll('.dynamic-word'));
  const words = sourceNodes.map((node) => node.textContent.trim()).filter(Boolean);
  if (words.length === 0) words.push('HEALTHCARE');
  sourceNodes.forEach((node) => node.remove());

  let dynamicText = titleDynamic.querySelector('.dynamic-text');
  if (!dynamicText) {
    dynamicText = document.createElement('span');
    dynamicText.className = 'dynamic-text';
    dynamicText.setAttribute('aria-live', 'polite');
    titleDynamic.appendChild(dynamicText);
  }

  const existingCursor = titleDynamic.querySelector('.dynamic-cursor');
  if (existingCursor) existingCursor.remove();

  const measureNode = dynamicText.cloneNode(false);
  measureNode.style.position = 'absolute';
  measureNode.style.visibility = 'hidden';
  measureNode.style.pointerEvents = 'none';
  measureNode.style.animation = 'none';
  measureNode.style.transform = 'none';
  measureNode.style.opacity = '1';
  measureNode.style.whiteSpace = 'nowrap';
  titleDynamic.appendChild(measureNode);

  let maxWidth = 0;
  words.forEach((word) => {
    measureNode.textContent = word;
    maxWidth = Math.max(maxWidth, measureNode.offsetWidth);
  });
  measureNode.remove();
  if (maxWidth > 0) {
    titleDynamic.style.minWidth = `${Math.ceil(maxWidth)}px`;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let wordIndex = 0;
  const HOLD_DURATION = 1800;
  const INITIAL_DELAY = 450;

  dynamicText.textContent = words[wordIndex];
  dynamicText.classList.remove('is-visible');

  const showWord = () => {
    const currentWord = words[wordIndex];
    dynamicText.classList.remove('is-visible');
    dynamicText.style.animation = 'none';
    dynamicText.style.transform = '';
    dynamicText.style.opacity = '';
    dynamicText.textContent = currentWord;

    if (prefersReducedMotion) {
      dynamicText.style.transform = 'translateY(0)';
      dynamicText.style.opacity = '1';
      return;
    }

    // Force reflow so animation restarts consistently
    void dynamicText.offsetWidth;
    dynamicText.style.animation = '';
    dynamicText.classList.add('is-visible');
  };

  const scheduleNext = () => {
    if (words.length <= 1) return;
    setTimeout(() => {
      wordIndex = (wordIndex + 1) % words.length;
      showWord();
      scheduleNext();
    }, HOLD_DURATION);
  };

  if (prefersReducedMotion) {
    dynamicText.style.animation = 'none';
    dynamicText.style.transform = 'translateY(0)';
    dynamicText.style.opacity = '1';
    scheduleNext();
  } else {
    setTimeout(() => {
      showWord();
      scheduleNext();
    }, INITIAL_DELAY);
  }
}

// === CASE STUDIES ===
const portfolioData = window.portfolioData || {};
const FAQ_CHEVRON_PATH = 'M15.9922 17.5618L21.7161 11.8379L23.6018 13.7235L15.9922 21.333L8.38281 13.7235L10.2684 11.8379L15.9922 17.5618Z';

const createSvg = ({ width, height, viewBox, pathD, fill = '#331F33' }) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('viewBox', viewBox);
  svg.innerHTML = `<path d="${pathD}" fill="${fill}"/>`;
  return svg;
};

const renderCaseStudies = () => {
  const container = document.querySelector('[data-case-studies]');
  const items = Array.isArray(portfolioData.caseStudies) ? portfolioData.caseStudies : [];
  if (!container) return;
  container.innerHTML = '';

  items.forEach((item, index) => {
    const outerCard = document.createElement('div');
    outerCard.className = 'outer-card';
    const innerCard = document.createElement('div');
    innerCard.className = 'inner-card';
    if (item.theme && item.theme !== 'default') innerCard.classList.add(`inner-card--${item.theme}`);

    const textContainer = document.createElement('div');
    textContainer.className = 'text-container';
    const label = document.createElement('div');
    label.className = 'label';
    const labelNum = document.createElement('span');
    labelNum.className = 'label-num';
    labelNum.textContent = item.number || String(index + 1).padStart(2, '0');
    const labelText = document.createElement('span');
    labelText.className = 'label-text';
    labelText.textContent = item.label || 'Case Study';
    label.append(labelNum, labelText);

    const textMain = document.createElement('div');
    textMain.className = 'text-main';
    const title = document.createElement('h3');
    title.className = 'case-title';
    title.textContent = item.title || '';
    const supporting = document.createElement('p');
    supporting.className = 'supporting-text-case';
    if (item.description) supporting.innerHTML = item.description;
    textMain.append(title, supporting);

    const rawHref = typeof item.buttonHref === 'string' ? item.buttonHref.trim() : '';
    const buttonLink = rawHref && rawHref !== '#' ? rawHref : '';
    const button = buttonLink ? document.createElement('a') : document.createElement('span');
    button.className = 'btn-box-casetudy';

    if (buttonLink) {
      button.href = buttonLink;
      const target = (item.buttonTarget || '_blank').trim();
      if (target) {
        button.setAttribute('target', target);
        if (target === '_blank') {
          button.setAttribute('rel', 'noopener');
        }
      }
    } else {
      button.setAttribute('aria-disabled', 'true');
      button.classList.add('is-disabled');
      button.dataset.disabled = 'true';
    }
    const buttonText = document.createElement('span');
    buttonText.className = 'btn-text-small';
    buttonText.textContent = item.buttonText || 'VIEW CASE STUDY';
    button.append(buttonText);

    textContainer.append(label, textMain, button);
    const imagePart = document.createElement('div');
    imagePart.className = 'image-part';
    const image = document.createElement('img');
    image.src = item.image || '';
    image.alt = item.imageAlt || item.title || 'Case study preview';
    imagePart.appendChild(image);

    innerCard.append(textContainer, imagePart);
    outerCard.appendChild(innerCard);
    container.appendChild(outerCard);
  });
};

// === TESTIMONIALS (Smooth Infinite Scroll) ===
let testimonialsScrollState = null;
let testimonialsResizeHandler = null;

const renderTestimonials = () => {
  const container = document.querySelector('[data-testimonials]');
  const items = Array.isArray(portfolioData.testimonials) ? portfolioData.testimonials : [];

  if (!container) return;

  if (testimonialsResizeHandler) {
    window.removeEventListener('resize', testimonialsResizeHandler);
    testimonialsResizeHandler = null;
  }

  if (testimonialsScrollState?.rafId) {
    cancelAnimationFrame(testimonialsScrollState.rafId);
  }
  if (typeof testimonialsScrollState?.cleanup === 'function') {
    testimonialsScrollState.cleanup();
  }
  testimonialsScrollState = null;

  container.innerHTML = '';

  if (!items.length) {
    return;
  }

  const track = document.createElement('div');
  track.className = 'review-track';
  container.appendChild(track);

  const cards = [];

  items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'review-card';
    if (item.theme) {
      card.classList.add(`review-card--${item.theme}`);
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'review-card-content';

    const logoInner = document.createElement('div');
    logoInner.className = 'review-logo-inner';
    const fallbackLetter = (item.logoText || item.headline || item.author || '?').trim().charAt(0).toUpperCase();
    if (item.logo) {
      const logoImg = document.createElement('img');
      logoImg.src = item.logo;
      logoImg.alt = item.logoAlt || `${fallbackLetter} logo`;
      logoImg.width = 35;
      logoImg.height = 35;
      logoImg.loading = 'lazy';
      logoImg.decoding = 'async';
      logoInner.appendChild(logoImg);
    } else {
      logoInner.textContent = fallbackLetter;
    }

    const mainColumn = document.createElement('div');
    mainColumn.className = 'review-main';

    const mainText = document.createElement('div');
    mainText.className = 'main-text-review';

    const headline = document.createElement('p');
    headline.className = 'text-bold';
    headline.textContent = item.headline || '';

    const body = document.createElement('p');
    body.className = 'main-text-body';
    body.textContent = item.body || '';

    mainText.append(headline, body);

    const title = document.createElement('p');
    title.className = 'review-title';
    title.textContent = item.role || '';

    mainColumn.append(mainText, title);

    wrapper.append(logoInner, mainColumn);
    card.appendChild(wrapper);
    track.appendChild(card);
    cards.push(card);
  });

  if (!cards.length) {
    return;
  }

  const originalWidth = track.scrollWidth;
  const isMobileLayout = window.matchMedia('(max-width: 600px)').matches;

  if (isMobileLayout) {
    testimonialsResizeHandler = () => renderTestimonials();
    window.addEventListener('resize', testimonialsResizeHandler, { passive: true });
    return;
  }

  if (cards.length > 1 && originalWidth > 0) {
    const fragment = document.createDocumentFragment();
    cards.forEach((card) => {
      const clone = card.cloneNode(true);
      fragment.appendChild(clone);
    });
    track.appendChild(fragment);
  }

  const state = {
    track,
    baseWidth: originalWidth,
    position: 0,
    rafId: null,
    lastTime: null,
    speed: 140,
    animating: false,
    cardCount: cards.length,
  };

  testimonialsScrollState = state;

  const step = (timestamp) => {
    if (!state.animating) return;
    if (state.lastTime === null) {
      state.lastTime = timestamp;
    }
    const deltaSeconds = (timestamp - state.lastTime) / 1000;
    state.lastTime = timestamp;
    state.position += state.speed * deltaSeconds;
    if (state.baseWidth > 0) {
      state.position %= state.baseWidth;
    } else {
      state.position = 0;
    }
    state.track.style.transform = `translateX(-${state.position}px)`;
    state.rafId = requestAnimationFrame(step);
  };

  const startScroll = () => {
    if (state.animating) return;
    if (state.cardCount <= 1 || state.baseWidth <= 0) return;
    state.animating = true;
    state.lastTime = null;
    state.rafId = requestAnimationFrame(step);
  };

  const stopScroll = () => {
    if (!state.animating) return;
    state.animating = false;
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
    state.lastTime = null;
  };

  const handlePointerOver = () => {
    stopScroll();
  };

  const handlePointerOut = (event) => {
    const nextTarget = event.relatedTarget;
    if (!nextTarget || !container.contains(nextTarget)) {
      startScroll();
    }
  };

  const handleFocusIn = () => {
    stopScroll();
  };

  const handleFocusOut = (event) => {
    const nextTarget = event.relatedTarget;
    if (!nextTarget || !container.contains(nextTarget)) {
      startScroll();
    }
  };

  container.addEventListener('pointerover', handlePointerOver);
  container.addEventListener('pointerout', handlePointerOut);
  container.addEventListener('focusin', handleFocusIn);
  container.addEventListener('focusout', handleFocusOut);

  testimonialsResizeHandler = () => {
    stopScroll();
    renderTestimonials();
  };

  window.addEventListener('resize', testimonialsResizeHandler, { passive: true });

  state.cleanup = () => {
    container.removeEventListener('pointerover', handlePointerOver);
    container.removeEventListener('pointerout', handlePointerOut);
    container.removeEventListener('focusin', handleFocusIn);
    container.removeEventListener('focusout', handleFocusOut);
  };

  requestAnimationFrame(() => {
    state.track.style.transform = 'translateX(0)';
    startScroll();
  });
};

// === FAQ ===
const createChevronIcon = () =>
  createSvg({
    width: 32,
    height: 32,
    viewBox: '0 0 32 32',
    pathD: FAQ_CHEVRON_PATH,
    fill: '#331F33',
  });

const renderFaqs = () => {
  const container = document.querySelector('[data-faqs]');
  const items = Array.isArray(portfolioData.faqs) ? portfolioData.faqs : [];
  if (!container) return;
  container.innerHTML = '';

  items.forEach((item) => {
    const details = document.createElement('details');
    details.className = 'faq-item';

    const summary = document.createElement('summary');
    const question = document.createElement('span');
    question.textContent = item.question || '';
    summary.append(question, createChevronIcon());

    const answer = document.createElement('p');
    answer.textContent = item.answer || '';
    details.append(summary, answer);
    container.appendChild(details);
  });
};

const hydrateCtaButton = () => {
  const ctaButton = document.querySelector('[data-cta-button]');
  if (!ctaButton) return;

  const buttonData = portfolioData.cta || {};
  const { buttonText, buttonHref } = buttonData;

  if (typeof buttonHref === 'string' && buttonHref.trim()) {
    ctaButton.setAttribute('href', buttonHref.trim());
    ctaButton.setAttribute('target', '_blank');
    ctaButton.setAttribute('rel', 'noopener');
  }

  if (typeof buttonText === 'string' && buttonText.trim()) {
    const textNode = ctaButton.querySelector('[data-cta-button-text]');
    if (textNode) {
      textNode.textContent = buttonText.trim();
    } else {
      ctaButton.textContent = buttonText.trim();
    }
  }
};

// === INIT ===
renderCaseStudies();
renderTestimonials();
renderFaqs();
hydrateCtaButton();

// === INITIAL LOAD REVEALS ===
(() => {
  const nodes = Array.from(document.querySelectorAll('[data-reveal-on-load]'));
  if (!nodes.length) return;

  const buttonSelectors = '.btn-box, .btn-chat, .btn-box-casetudy, .btn-box-frq, .btn-box-faq, .btn-box-cta, .book-btn';
  nodes.forEach((node) => {
    if (node.matches(buttonSelectors)) {
      node.classList.add('motion-button');
    }
  });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    nodes.forEach((node) => node.classList.add('reveal-active'));
    return;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      nodes.forEach((node, index) => {
        const existingDelay = node.style.getPropertyValue('--motion-delay');
        if (!existingDelay) {
          const delayValue = node.dataset.revealDelay || `${index * 120}ms`;
          node.style.setProperty('--motion-delay', delayValue);
        }
        node.classList.add('reveal-active');
      });
    });
  });
})();

// === MOBILE NAV ===
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('site-menu');
  if (!toggle || !menu) return;

  const links = Array.from(menu.querySelectorAll('a'));
  const body = document.body;

  const setState = (open) => {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    body.classList.toggle('menu-open', open);
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    setState(!isOpen);
  });

  links.forEach((link) => {
    link.addEventListener('click', () => setState(false));
  });

  document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && event.target !== toggle && !toggle.contains(event.target)) {
      setState(false);
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setState(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 500) {
      setState(false);
    }
  });
})();

// === NAVIGATION SMOOTH SCROLL ===
(() => {
  const header = document.querySelector('.navbar');

  const getOffset = () => {
    if (!header) return 0;
    const styles = window.getComputedStyle(header);
    const marginBottom = parseFloat(styles.marginBottom) || 0;
    return header.getBoundingClientRect().height + marginBottom;
  };

  const handleNavClick = (event) => {
    const targetId = event.currentTarget.getAttribute('href');
    if (!targetId || !targetId.startsWith('#')) return;

    const section = document.querySelector(targetId);
    if (!section) return;

    event.preventDefault();

    const offset = getOffset();
    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
    const destination = Math.max(Math.round(sectionTop - offset), 0);

    window.scrollTo({
      top: destination,
      behavior: 'smooth',
    });
  };

  const links = Array.from(document.querySelectorAll('a[href^="#"]'))
    .filter((link) => link.getAttribute('href') !== '#');

  links.forEach((link) => {
    link.addEventListener('click', handleNavClick);
  });
})();

// === ON-SCROLL SPLIT REVEAL (skip CTAs) ===
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const isCta = (el) => {
    return el.closest('.btn-box, .btn-chat, .btn-box-frq, .btn-box-faq, .btn-box-cta');
  };

  const isInsideReviewCard = (el) => el.closest('.review-card');
  const shouldSkipSplit = (el) => el.matches('.btn-box-casetudy, .label-num');

  const splitElement = (el) => {
    if (el.dataset.splitInit) return;
    el.dataset.splitInit = 'true';

    const hasContent = el.textContent.trim().length > 0;
    if (!hasContent) return;

    const originalNodes = Array.from(el.childNodes);
    el.textContent = '';

    const lineContainer = document.createElement('span');
    lineContainer.className = 'split-line';

    const textWrapper = document.createElement('span');
    textWrapper.className = 'split-text';

    originalNodes.forEach((node) => {
      textWrapper.appendChild(node);
    });

    lineContainer.appendChild(textWrapper);
    el.appendChild(lineContainer);
  };

  const targets = Array.from(document.querySelectorAll('[data-split], h1, h2, h3, h4, p, .case-title, .supporting-text-case, .faq-title, .supporting-text-faq, .grid-title, .grid-content span, .label-text, .label-num, .case-section-title, .btn-box-casetudy, [data-on-scroll]'))
    .filter((el) => !isCta(el) && !isInsideReviewCard(el));

  // Avoid re-splitting items already using manual split markup in hero heading
  targets.forEach((el) => {
    if (shouldSkipSplit(el)) return;
    if (el.querySelector('.split-line, .split-text')) return;
    splitElement(el);
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('reveal-active');
        io.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  targets.forEach((el) => io.observe(el));
})();

// === SECTION THEME BACKGROUNDS ===
(() => {
  const body = document.body;
  const cta = document.querySelector('.cta');
  const footer = document.querySelector('.footer');
  if (!body || (!cta && !footer)) return;

  const MANAGED_CLASSES = ['theme-cta', 'theme-footer'];
  const CTA_THRESHOLD = 0.35;
  const FOOTER_THRESHOLD = 0.35;

  const visibleRatio = (element) => {
    if (!element) return 0;
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
    if (visibleHeight <= 0) return 0;
    const divisor = Math.min(rect.height || viewportHeight, viewportHeight);
    return divisor > 0 ? visibleHeight / divisor : 0;
  };

  const applyTheme = () => {
    body.classList.remove(...MANAGED_CLASSES);

    const footerRatio = visibleRatio(footer);
    const ctaRatio = visibleRatio(cta);

    if (footerRatio > FOOTER_THRESHOLD) {
      body.classList.add('theme-footer');
      return;
    }

    if (ctaRatio > CTA_THRESHOLD) {
      body.classList.add('theme-cta');
    }
  };

  let rafId = null;
  const scheduleUpdate = () => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      applyTheme();
    });
  };

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate, { passive: true });
  window.addEventListener('orientationchange', scheduleUpdate);
  scheduleUpdate();
})();

// === NAV LETTER HOVER ===
(() => {
  const wrappers = document.querySelectorAll('.menu-link-text');
  wrappers.forEach((wrapper) => {
    const layers = Array.from(wrapper.querySelectorAll('.menu-link-layer'));
    layers.forEach((layer) => {
      if (layer.dataset.lettersInit) return;
      const text = layer.textContent;
      layer.textContent = '';
      Array.from(text).forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'menu-link-char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.setProperty('--char-delay', `${index * 45}ms`);
        layer.appendChild(span);
      });
      layer.dataset.lettersInit = 'true';
    });
  });
})();
