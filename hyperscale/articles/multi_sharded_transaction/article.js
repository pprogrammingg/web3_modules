/**
 * Sticky TOC: highlight active section; mobile open/close.
 */
(function () {
  'use strict';

  const toc = document.getElementById('mst-toc');
  const toggle = document.getElementById('mst-toc-toggle');
  if (!toc) return;

  const links = Array.from(toc.querySelectorAll('a[href^="#"]'));
  const sections = links
    .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);

  function setActive(id) {
    links.forEach((a) => {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    const visible = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        });
        let best = null;
        let bestR = 0;
        visible.forEach((r, id) => {
          if (r > bestR) {
            bestR = r;
            best = id;
          }
        });
        if (best) setActive(best);
      },
      { rootMargin: '-12% 0px -55% 0px', threshold: [0, 0.15, 0.4, 0.7, 1] }
    );
    sections.forEach((s) => io.observe(s));
  }

  links.forEach((a) => {
    a.addEventListener('click', () => {
      toc.classList.remove('is-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  });

  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = toc.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
})();
