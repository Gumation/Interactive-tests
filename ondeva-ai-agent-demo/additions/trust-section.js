
/* ============================================================
   SECTION 03 — ANIMAÇÃO AO ENTRAR NA TELA
   Entrada única. Preserva as interações das outras sections.
   ============================================================ */
(() => {
  'use strict';
  function initTrustSections() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    document.querySelectorAll('[data-trust-section]').forEach((section) => {
      if (section.dataset.trustInitialized === 'true') return;
      section.dataset.trustInitialized = 'true';
      const items = section.querySelectorAll('[data-trust-reveal]');
      const counter = section.querySelector('[data-trust-count]');
      let observer = null;
      let started = false;
      let counterTimer = null;
      let frame = null;

      items.forEach((item, index) => {
        item.style.setProperty('--trust-delay', `${index * 130}ms`);
      });

      function finishImmediately() {
        started = true;
        if (observer) observer.disconnect();
        clearTimeout(counterTimer);
        if (frame !== null) cancelAnimationFrame(frame);
        section.classList.add('trust-started');
        if (counter) counter.textContent = '5';
      }

      function animateCounter() {
        if (!counter || reducedMotion.matches) return;
        const startTime = performance.now();
        function tick(now) {
          const progress = Math.min(1, (now - startTime) / 1000);
          const value = 5 * (1 - Math.pow(1 - progress, 3));
          counter.textContent = progress === 1 ? '5' : value.toFixed(1);
          if (progress < 1) frame = requestAnimationFrame(tick);
        }
        frame = requestAnimationFrame(tick);
      }

      function start() {
        if (started) return;
        started = true;
        if (observer) observer.disconnect();
        section.classList.add('trust-started');
        if (counter && !reducedMotion.matches) {
          counter.textContent = '0.0';
          const metric = counter.closest('[data-trust-reveal]');
          const delay = metric ? Number.parseFloat(metric.style.getPropertyValue('--trust-delay')) || 0 : 0;
          counterTimer = setTimeout(animateCounter, delay);
        }
      }

      if (reducedMotion.matches) {
        finishImmediately();
      } else {
        section.classList.add('trust-ready');
        if ('IntersectionObserver' in window) {
          observer = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) start();
          }, { rootMargin: '0px 0px -64px 0px', threshold: 0 });
          observer.observe(section);
        } else {
          start();
        }
      }
      reducedMotion.addEventListener('change', (event) => {
        if (event.matches) finishImmediately();
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTrustSections, { once: true });
  } else {
    initTrustSections();
  }
})();
