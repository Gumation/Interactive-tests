/* ============================================================
   SECTION 03 — ENTRADA DOS DESTAQUES E ROTAÇÃO DOS CLIENTES
   Destaques: +0,5s. Cliente: 3s visível + 600ms de transição.
   ============================================================ */
(() => {
  'use strict';
  function initTrustSections() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    document.querySelectorAll('[data-trust-section]').forEach((section) => {
      if (section.dataset.trustInitialized === 'true') return;
      section.dataset.trustInitialized = 'true';
      const items = [...section.querySelectorAll('[data-trust-reveal]')];
      const counter = section.querySelector('[data-trust-count]');
      const carousel = section.querySelector('[data-trust-carousel]');
      const cards = carousel ? [...carousel.querySelectorAll('[data-trust-client]')] : [];
      const CLIENT_HOLD_MS = 3000;
      const CLIENT_FADE_MS = 600;
      let started = false;
      let visible = false;
      let counterTimer = null;
      let frame = null;
      let clientIndex = 0;
      let clientTimer = null;
      let clientDeadline = 0;
      let clientRemaining = CLIENT_HOLD_MS + (carousel ? items.indexOf(carousel) * 130 : 0) + 560;

      items.forEach((item, index) => {
        const extra = Number(item.dataset.trustWait) || 0;
        item.style.setProperty('--trust-delay', `${extra + index * 130}ms`);
      });

      function setActiveClient(index) {
        clientIndex = index;
        cards.forEach((card, cardIndex) => {
          const active = cardIndex === index;
          card.classList.toggle('is-active', active);
          card.setAttribute('aria-hidden', String(!active));
          card.inert = !active;
        });
      }

      function pauseClients() {
        if (clientTimer !== null) {
          clientRemaining = Math.max(0, clientDeadline - performance.now());
          clearTimeout(clientTimer);
          clientTimer = null;
        }
      }

      function resumeClients() {
        if (!started || !visible || document.hidden || reducedMotion.matches || cards.length < 2 || clientTimer !== null) return;
        clientDeadline = performance.now() + clientRemaining;
        clientTimer = setTimeout(() => {
          clientTimer = null;
          setActiveClient((clientIndex + 1) % cards.length);
          // O próximo card fica 3s totalmente visível após o fade de 600ms.
          clientRemaining = CLIENT_HOLD_MS + CLIENT_FADE_MS;
          resumeClients();
        }, clientRemaining);
      }

      function finishImmediately() {
        started = true;
        clearTimeout(counterTimer);
        if (frame !== null) cancelAnimationFrame(frame);
        pauseClients();
        section.classList.add('trust-started');
        if (counter) counter.textContent = '5';
        cards.forEach((card) => {
          card.removeAttribute('aria-hidden');
          card.inert = false;
        });
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
        section.classList.add('trust-started');
        if (counter) {
          counter.textContent = '0.0';
          const metric = counter.closest('[data-trust-reveal]');
          const delay = metric ? Number.parseFloat(metric.style.getPropertyValue('--trust-delay')) || 0 : 0;
          counterTimer = setTimeout(animateCounter, delay);
        }
      }

      if (reducedMotion.matches) finishImmediately();
      else section.classList.add('trust-ready');
      if (carousel) carousel.classList.add('is-carousel-ready');
      if (!reducedMotion.matches) setActiveClient(0);

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          visible = entries.some((entry) => entry.isIntersecting);
          if (visible) {
            if (!reducedMotion.matches) start();
            resumeClients();
          } else pauseClients();
        }, { rootMargin: '0px 0px -64px 0px', threshold: 0 });
        observer.observe(section);
      } else {
        visible = true;
        if (!reducedMotion.matches) start();
        resumeClients();
      }
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) pauseClients();
        else resumeClients();
      });
      reducedMotion.addEventListener('change', (event) => {
        if (event.matches) finishImmediately();
        else {
          setActiveClient(clientIndex);
          clientRemaining = CLIENT_HOLD_MS;
          resumeClients();
        }
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTrustSections, { once: true });
  } else initTrustSections();
})();
