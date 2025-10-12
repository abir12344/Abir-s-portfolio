const hero = document.querySelector('.hero');
const gallery = document.querySelector('.cursor-gallery');
const images = gallery ? Array.from(gallery.querySelectorAll('.cursor-image')) : [];

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

    const fallback = (value, defaultValue) =>
      value !== undefined ? parseFloat(value) : defaultValue;

    return {
      depth: fallback(depth, -300 - index * 140),
      scale: fallback(scale, 1 - index * 0.08),
      rotateRange: fallback(rotate, 16 - index * 2.5),
      opacity: fallback(opacity, Math.max(0, 1 - index * 0.18)),
      offsetX: fallback(offsetX, 0),
      offsetY: fallback(offsetY, 0),
      ease: fallback(ease, 0.12 + index * 0.06),
    };
  });

  const state = layers.map((layer) => ({
    x: bounds.width / 2 + layer.offsetX,
    y: bounds.height / 2 + layer.offsetY,
  }));

  const sizes = images.map((image) => ({
    width: image.offsetWidth || 208,
    height: image.offsetHeight || 208,
  }));

  const mouse = {
    x: bounds.width / 2,
    y: bounds.height / 2,
    active: false,
  };

  const handlePointerMove = (event) => {
    mouse.x = event.clientX - bounds.left;
    mouse.y = event.clientY - bounds.top;
    mouse.active = true;
  };

  const handlePointerLeave = () => {
    mouse.active = false;
  };

  hero.addEventListener('pointermove', handlePointerMove);
  hero.addEventListener('pointerenter', handlePointerMove);
  hero.addEventListener('pointerleave', handlePointerLeave);

  window.addEventListener('resize', () => {
    bounds = hero.getBoundingClientRect();
  });

  const animate = () => {
    const targetCenterX = mouse.active ? mouse.x : bounds.width / 2;
    const targetCenterY = mouse.active ? mouse.y : bounds.height / 2;

    images.forEach((image, index) => {
      const layer = layers[index];
      const current = state[index];

      const targetX = targetCenterX + layer.offsetX;
      const targetY = targetCenterY + layer.offsetY;

      current.x += (targetX - current.x) * layer.ease;
      current.y += (targetY - current.y) * layer.ease;

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

if (titleDynamic) {
  const dynamicWords = Array.from(titleDynamic.querySelectorAll('.dynamic-word'));

  if (dynamicWords.length > 1) {
    let activeIndex = dynamicWords.findIndex((word) => word.classList.contains('is-active'));
    if (activeIndex < 0) {
      activeIndex = 0;
      dynamicWords[0].classList.add('is-active');
    }

    const transitionDuration = 300;
    const idleDelay = 2200;

    const queueNextWord = () => {
      setTimeout(() => {
        const currentWord = dynamicWords[activeIndex];
        const nextIndex = (activeIndex + 1) % dynamicWords.length;
        const nextWord = dynamicWords[nextIndex];

        currentWord.classList.remove('is-active');

        setTimeout(() => {
          nextWord.classList.add('is-active');
          activeIndex = nextIndex;
          queueNextWord();
        }, transitionDuration);
      }, idleDelay);
    };

    queueNextWord();
  }
}
