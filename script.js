// === HERO SECTION ===
const hero = document.querySelector('.hero');
const gallery = hero ? hero.querySelector('.hero-images') : null;
const images = gallery ? Array.from(gallery.querySelectorAll('.hero-image')) : [];

if (hero && gallery && images.length) {
  let bounds = hero.getBoundingClientRect();

  const layers = images.map((image, index) => {
    const { depth, scale, rotate, opacity, offsetX, offsetY, ease } = image.dataset;
    const parse = (value, fallback) =>
      value !== undefined ? parseFloat(value) : fallback;

    return {
      depth: parse(depth, -280 - index * 140),
      scale: parse(scale, 1 - index * 0.08),
      rotateRange: parse(rotate, 16 - index * 2.5),
      opacity: parse(opacity, Math.max(0, 1 - index * 0.18)),
      offsetX: parse(offsetX, 0),
      offsetY: parse(offsetY, 0),
      ease: parse(ease, 0.14 + index * 0.05),
    };
  });

  const state = layers.map((layer) => ({
    x: bounds.width / 2 + layer.offsetX,
    y: bounds.height / 2 + layer.offsetY,
  }));

  const sizes = images.map((image) => ({
    width: image.offsetWidth || 200,
    height: image.offsetHeight || 200,
  }));

  const mouse = { x: bounds.width / 2, y: bounds.height / 2, active: false };

  const updateMouse = (event) => {
    mouse.x = event.clientX - bounds.left;
    mouse.y = event.clientY - bounds.top;
    mouse.active = true;
  };
  const resetMouse = () => (mouse.active = false);

  hero.addEventListener('pointermove', updateMouse);
  hero.addEventListener('pointerenter', updateMouse);
  hero.addEventListener('pointerleave', resetMouse);

  window.addEventListener('resize', () => {
    bounds = hero.getBoundingClientRect();
  });

  const animate = () => {
    const targetX = mouse.active ? mouse.x : bounds.width / 2;
    const targetY = mouse.active ? mouse.y : bounds.height / 2;

    images.forEach((image, index) => {
      const layer = layers[index];
      const current = state[index];

      const desiredX = targetX + layer.offsetX;
      const desiredY = targetY + layer.offsetY;

      current.x += (desiredX - current.x) * layer.ease;
      current.y += (desiredY - current.y) * layer.ease;

      const relativeX = bounds.width ? (current.x - bounds.width / 2) / bounds.width : 0;
      const relativeY = bounds.height ? (current.y - bounds.height / 2) / bounds.height : 0;

      const rotateX = relativeY * layer.rotateRange;
      const rotateY = -relativeX * layer.rotateRange;
      const { width, height } = sizes[index];
      const translateX = current.x - width / 2;
      const translateY = current.y - height / 2;
      const opacity = mouse.active ? layer.opacity : 0;

      image.style.transform = `translate3d(${translateX}px, ${translateY}px, ${layer.depth}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${layer.scale})`;
      image.style.opacity = opacity;
      image.style.zIndex = String(500 - index);
    });

    requestAnimationFrame(animate);
  };
  animate();
}

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
const STAR_PATH = 'M11.8356 0L12.9787 7.62872H21L13.6852 12.3435L14.8284 19.9722L9.1644 15.2574L1.84965 19.9722L5.66394 12.3435L0 7.62872H8.0213L11.8356 0Z';
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

    const button = document.createElement('a');
    button.className = 'btn-box-casetudy';
    button.href = item.buttonHref || '#';
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

const formatReviewMeta = (review) => {
  const author = review.author || 'Anonymous';
  const role = review.role ? ` — ${review.role}` : '';

  if (!review.date) {
    return `${author}${role}`;
  }

  const parsed = new Date(review.date);
  if (Number.isNaN(parsed.getTime())) {
    return `${author}${role} • ${review.date}`;
  }

  const datePart = parsed.toLocaleDateString('en-CA');
  const timePart = parsed.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return `${author}${role} • ${datePart} ${timePart}`;
};

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

    const starsText = document.createElement('div');
    starsText.className = 'stars-text';

    const starsRow = document.createElement('div');
    starsRow.className = 'starts';

    const rating = typeof item.rating === 'number' ? Math.max(0, Math.min(5, Math.round(item.rating))) : 0;
    for (let i = 0; i < 5; i += 1) {
      const star = createSvg({
        width: 21,
        height: 20,
        viewBox: '0 0 21 20',
        pathD: STAR_PATH,
        fill: i < rating ? '#F29161' : '#E1D9D2',
      });
      starsRow.appendChild(star);
    }

    const meta = document.createElement('p');
    meta.className = 'testimonial-supporting-text';
    meta.textContent = formatReviewMeta(item);

    starsText.append(starsRow, meta);

    const mainText = document.createElement('div');
    mainText.className = 'main-text-review';

    const headline = document.createElement('p');
    headline.className = 'text-bold';
    headline.textContent = item.headline || '';

    const body = document.createElement('p');
    body.className = 'main-text-body';
    body.textContent = item.body || '';

    mainText.append(headline, body);
    card.append(starsText, mainText);
    track.appendChild(card);
    cards.push(card);
  });

  if (!cards.length) {
    return;
  }

  const originalWidth = track.scrollWidth;

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

  container.addEventListener('pointerenter', stopScroll);
  container.addEventListener('pointerleave', startScroll);

  testimonialsResizeHandler = () => {
    stopScroll();
    renderTestimonials();
  };

  window.addEventListener('resize', testimonialsResizeHandler, { passive: true });

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

// === INIT ===
renderCaseStudies();
renderTestimonials();
renderFaqs();

// === ON-SCROLL SPLIT REVEAL (skip CTAs) ===
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const isCta = (el) => {
    return el.closest('.btn-box, .btn-chat, .btn-box-casetudy, .btn-box-frq, .btn-box-faq, .btn-box-cta');
  };

  const isInsideReviewCard = (el) => el.closest('.review-card');

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

  const targets = Array.from(document.querySelectorAll('[data-split], h1, h2, h3, h4, p, .case-title, .supporting-text-case, .faq-title, .supporting-text-faq, .grid-title, .grid-content span, .label-text, .case-section-title'))
    .filter((el) => !isCta(el) && !isInsideReviewCard(el));

  // Avoid re-splitting items already using manual split markup in hero heading
  targets.forEach((el) => {
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
