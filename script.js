const hero = document.querySelector('.hero');
const gallery = hero ? hero.querySelector('.hero-images') : null;
const images = gallery ? Array.from(gallery.querySelectorAll('.hero-image')) : [];

if (hero && gallery && images.length) {
  let bounds = hero.getBoundingClientRect();

  const layers = images.map((image, index) => {
    const {
      depth,
      scale,
      rotate,
      opacity,
      offsetX,
      offsetY,
      ease,
    } = image.dataset;

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

  const mouse = {
    x: bounds.width / 2,
    y: bounds.height / 2,
    active: false,
  };

  const updateMouse = (event) => {
    mouse.x = event.clientX - bounds.left;
    mouse.y = event.clientY - bounds.top;
    mouse.active = true;
  };

  const resetMouse = () => {
    mouse.active = false;
  };

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

const titleDynamic = document.querySelector('.title-dynamic');

if (titleDynamic && !titleDynamic.dataset.typewriterInit) {
  titleDynamic.dataset.typewriterInit = 'true';

  const sourceNodes = Array.from(titleDynamic.querySelectorAll('.dynamic-word'));
  const words = sourceNodes.map((node) => node.textContent.trim()).filter(Boolean);

  if (words.length === 0) {
    words.push('HEALTHCARE');
  }

  sourceNodes.forEach((node) => node.remove());

  let dynamicText = titleDynamic.querySelector('.dynamic-text');
  if (!dynamicText) {
    dynamicText = document.createElement('span');
    dynamicText.className = 'dynamic-text';
    dynamicText.setAttribute('aria-live', 'polite');
    titleDynamic.appendChild(dynamicText);
  }

  if (!titleDynamic.querySelector('.dynamic-cursor')) {
    const cursor = document.createElement('span');
    cursor.className = 'dynamic-cursor';
    cursor.textContent = '|';
    titleDynamic.appendChild(cursor);
  }

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const TYPE_DELAY = 90;
  const DELETE_DELAY = 45;
  const WORD_COMPLETE_HOLD = 1100;
  const WORD_SWITCH_DELAY = 300;

  const typeLoop = () => {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
      if (charIndex < currentWord.length) {
        charIndex += 1;
        dynamicText.textContent = currentWord.slice(0, charIndex);
        setTimeout(typeLoop, TYPE_DELAY);
      } else {
        setTimeout(() => {
          isDeleting = true;
          setTimeout(typeLoop, DELETE_DELAY);
        }, WORD_COMPLETE_HOLD);
      }
    } else {
      if (charIndex > 0) {
        charIndex -= 1;
        dynamicText.textContent = currentWord.slice(0, charIndex);
        setTimeout(typeLoop, DELETE_DELAY);
      } else {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeLoop, WORD_SWITCH_DELAY);
      }
    }
  };

  setTimeout(typeLoop, 400);
}

const portfolioData = window.portfolioData || {};

const STAR_PATH = 'M11.8356 0L12.9787 7.62872H21L13.6852 12.3435L14.8284 19.9722L9.1644 15.2574L1.84965 19.9722L5.66394 12.3435L0 7.62872H8.0213L11.8356 0Z';
const FAQ_CHEVRON_PATH = 'M15.9922 17.5618L21.7161 11.8379L23.6018 13.7235L15.9922 21.333L8.38281 13.7235L10.2684 11.8379L15.9922 17.5618Z';

const createSvg = ({ width, height, viewBox, pathD, fill = '#331F33', stroke, strokeWidth }) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('fill', 'none');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathD);
  path.setAttribute('fill', fill);

  if (stroke) {
    path.setAttribute('stroke', stroke);
  }

  if (strokeWidth) {
    path.setAttribute('stroke-width', strokeWidth);
  }

  svg.appendChild(path);
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

    if (item.theme && item.theme !== 'default') {
      innerCard.classList.add(`inner-card--${item.theme}`);
    }

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
    if (item.description) {
      supporting.innerHTML = item.description;
    }

    textMain.append(title, supporting);

    const button = document.createElement(item.buttonHref ? 'a' : 'div');
    button.className = 'btn-box-casetudy';
    if (item.buttonHref) {
      button.href = item.buttonHref;
    }

    const buttonText = document.createElement('span');
    buttonText.className = item.buttonTextClass || 'btn-text-small';
    buttonText.textContent = item.buttonText || 'VIEW CASE STUDY';
    buttonText.dataset.text = buttonText.textContent;

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

const createStar = (filled) =>
  createSvg({
    width: 21,
    height: 20,
    viewBox: '0 0 21 20',
    pathD: STAR_PATH,
    fill: filled ? '#F29161' : '#E1D9D2',
  });

const renderTestimonials = () => {
  const container = document.querySelector('[data-testimonials]');
  const items = Array.isArray(portfolioData.testimonials) ? portfolioData.testimonials : [];

  if (!container) return;

  container.innerHTML = '';

  items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'review-card';

    const starsText = document.createElement('div');
    starsText.className = 'stars-text';

    const starsRow = document.createElement('div');
    starsRow.className = 'stars';

    const rating = typeof item.rating === 'number' ? Math.max(0, Math.min(5, Math.round(item.rating))) : 0;
    for (let i = 0; i < 5; i += 1) {
      starsRow.appendChild(createStar(i < rating));
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
    container.appendChild(card);
  });
};

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

  let hasOpened = false;

  items.forEach((item) => {
    const details = document.createElement('details');
    details.className = 'faq-item';
    if (item.open && !hasOpened) {
      details.setAttribute('open', '');
      hasOpened = true;
    }

    const summary = document.createElement('summary');

    const question = document.createElement('span');
    question.textContent = item.question || '';

    summary.append(question, createChevronIcon());

    const answer = document.createElement('p');
    answer.textContent = item.answer || '';

    details.addEventListener('toggle', () => {
      if (!details.open) return;

      container.querySelectorAll('.faq-item').forEach((other) => {
        if (other !== details && other.open) {
          other.removeAttribute('open');
        }
      });
    });

    details.append(summary, answer);
    container.appendChild(details);
  });

  if (!hasOpened) {
    const firstItem = container.querySelector('.faq-item');
    if (firstItem) {
      firstItem.setAttribute('open', '');
    }
  }
};

renderCaseStudies();
renderTestimonials();
renderFaqs();
