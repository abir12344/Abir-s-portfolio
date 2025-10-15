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

const CASE_BUTTON_PATH =
  'M2.62775 0.360426C3.11275 0.363426 3.68975 0.474426 4.35075 0.602426L4.40275 0.612426C6.05575 0.931426 7.35275 1.45543 8.28675 1.98943C8.47175 2.09543 8.56375 2.14843 8.61975 2.24543C8.67675 2.34243 8.67675 2.45543 8.67675 2.68243V16.5094C8.67662 16.5262 8.67231 16.5426 8.66419 16.5572C8.65607 16.5718 8.64441 16.5842 8.63029 16.5931C8.61616 16.6021 8.60001 16.6074 8.58332 16.6085C8.56663 16.6096 8.54993 16.6065 8.53475 16.5994C8.28575 16.4794 7.95975 16.3004 7.55275 16.0774L7.53675 16.0684C6.74075 15.6334 5.62075 15.1884 4.16875 14.9084L4.13375 14.9014C3.31375 14.7434 2.65275 14.6164 2.14975 14.4644C1.64375 14.3114 1.18275 14.1044 0.86775 13.7084C0.56575 13.3284 0.44875 12.8724 0.39575 12.3754C0.34375 11.8934 0.34375 11.2834 0.34375 10.5394V4.36143C0.34375 3.55743 0.34375 2.88043 0.42575 2.34143C0.51475 1.76443 0.70975 1.25943 1.16175 0.866426C1.60175 0.484426 2.08675 0.357426 2.62775 0.360426ZM15.9757 0.360426C16.5167 0.356426 17.0017 0.484426 17.4417 0.866426C17.8937 1.25943 18.0887 1.76443 18.1777 2.34243C18.2607 2.88043 18.2598 3.55743 18.2598 4.36243V10.5394C18.2598 11.2834 18.2598 11.8934 18.2078 12.3754C18.1548 12.8724 18.0378 13.3294 17.7358 13.7084C17.4208 14.1034 16.9598 14.3114 16.4538 14.4644C15.9508 14.6164 15.2888 14.7444 14.4698 14.9014L14.4348 14.9084C12.9828 15.1884 11.8628 15.6334 11.0668 16.0684L11.0507 16.0784C10.6437 16.3004 10.3178 16.4784 10.0688 16.6004C10.0535 16.6075 10.0367 16.6106 10.0199 16.6094C10.0032 16.6083 9.98695 16.6029 9.97279 16.5939C9.95864 16.5848 9.947 16.5723 9.93895 16.5575C9.93091 16.5428 9.92671 16.5262 9.92675 16.5094V2.68243C9.92675 2.45643 9.92675 2.34243 9.98375 2.24543C10.0398 2.14843 10.1318 2.09543 10.3168 1.98943C11.2508 1.45543 12.5478 0.931426 14.2008 0.611426L14.2528 0.601426C14.9128 0.474426 15.4907 0.364426 15.9757 0.360426Z';
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

    const buttonIcon = createSvg({
      width: 19,
      height: 17,
      viewBox: '0 0 19 17',
      pathD: CASE_BUTTON_PATH,
      fill: '#331F33',
    });

    const buttonText = document.createElement('span');
    buttonText.className = item.buttonTextClass || 'btn-text-small';
    buttonText.textContent = item.buttonText || 'VIEW CASE STUDY';

    button.append(buttonIcon, buttonText);

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

  items.forEach((item) => {
    const details = document.createElement('details');
    details.className = 'faq-item';
    if (item.open) {
      details.setAttribute('open', '');
    }

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

renderCaseStudies();
renderTestimonials();
renderFaqs();
