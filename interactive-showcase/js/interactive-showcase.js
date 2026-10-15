/* ============================================================
   NEW SECTION — INTERACTIVE SCREEN SHOWCASE
   Hover, keyboard focus, or tap starts an illustrative preview.
   No API calls, external libraries, or shared SVG definitions.
   ============================================================ */
(() => {
  'use strict';

  const initialized = new WeakSet();
  const timing = { hoverIntent: 120, typeCharacter: 23, processing: 500, values: 900 };

  function initShowcase(root) {
    if (initialized.has(root)) return;
    initialized.add(root);
    const screens = [...root.querySelectorAll('[data-odx-demo]')];
    const status = root.querySelector('[data-odx-status]');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let active = null;
    let generation = 0;
    let frame = null;
    const timers = new Set();

    const info = new Map(screens.map(screen => [screen, {
      prompt: screen.querySelector('[data-odx-prompt]'),
      promptText: screen.querySelector('[data-odx-prompt]').textContent,
      result: screen.querySelector('.odx-magic-done').textContent,
      label: screen.getAttribute('aria-label'),
      counters: [...screen.querySelectorAll('[data-odx-number]')],
      text: [...screen.querySelectorAll('[data-odx-before][data-odx-after]')],
    }]));

    // Generation tokens prevent late callbacks from updating another screen.
    function later(callback, delay, token = generation) {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        if (token === generation) callback();
      }, delay);
      timers.add(timer);
    }

    function cancelWork() {
      generation += 1;
      timers.forEach(timer => window.clearTimeout(timer));
      timers.clear();
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
    }

    function formatNumber(element, value) {
      const digits = Number(element.dataset.digits || 0);
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }).format(value) + (element.dataset.suffix || '');
    }

    function restore(screen) {
      const data = info.get(screen);
      screen.classList.remove('is-active', 'is-drafting', 'is-processing', 'is-improving', 'is-complete');
      screen.setAttribute('aria-pressed', 'false');
      screen.removeAttribute('aria-busy');
      data.prompt.textContent = data.promptText;
      data.counters.forEach(element => { element.textContent = formatNumber(element, Number(element.dataset.from)); });
      data.text.forEach(element => { element.textContent = element.dataset.odxBefore; });
    }

    function reset() {
      cancelWork();
      if (active) restore(active);
      active = null;
      if (status) status.textContent = '';
    }

    function complete(screen) {
      if (screen !== active) return;
      const data = info.get(screen);
      screen.classList.remove('is-drafting', 'is-processing', 'is-improving');
      screen.classList.add('is-complete');
      screen.removeAttribute('aria-busy');
      data.prompt.textContent = data.promptText;
      data.counters.forEach(element => { element.textContent = formatNumber(element, Number(element.dataset.to)); });
      data.text.forEach(element => { element.textContent = element.dataset.odxAfter; });
      if (status) status.textContent = data.result + '. Illustrative preview complete.';
    }

    function improve(screen, token) {
      if (token !== generation || screen !== active) return;
      screen.classList.add('is-improving');
      const data = info.get(screen);
      data.text.forEach(element => { element.textContent = element.dataset.odxAfter; });
      const startedAt = performance.now();
      function update(now) {
        if (token !== generation || screen !== active) return;
        const progress = Math.min(1, (now - startedAt) / timing.values);
        const eased = 1 - (1 - progress) ** 3;
        data.counters.forEach(element => {
          const from = Number(element.dataset.from);
          const to = Number(element.dataset.to);
          element.textContent = formatNumber(element, from + (to - from) * eased);
        });
        if (progress < 1) frame = requestAnimationFrame(update);
        else { frame = null; complete(screen); }
      }
      frame = requestAnimationFrame(update);
    }

    function begin(screen, token) {
      if (token !== generation || screen !== active) return;
      const data = info.get(screen);
      screen.classList.add('is-active');
      screen.setAttribute('aria-pressed', 'true');
      if (motion.matches) { complete(screen); return; }
      screen.setAttribute('aria-busy', 'true');
      screen.classList.add('is-drafting');
      let character = 0;
      data.prompt.textContent = '';
      function type() {
        data.prompt.textContent = data.promptText.slice(0, ++character);
        if (character < data.promptText.length) later(type, timing.typeCharacter, token);
        else {
          screen.classList.remove('is-drafting');
          screen.classList.add('is-processing');
          later(() => improve(screen, token), timing.processing, token);
        }
      }
      type();
    }

    function activate(screen, intentDelay = 0, replay = false) {
      if (active === screen && !replay) return;
      reset();
      active = screen;
      const token = generation;
      if (intentDelay) later(() => begin(screen, token), intentDelay, token);
      else begin(screen, token);
    }

    screens.forEach(screen => {
      // Pointer previews reset on leave; moving between screens cancels old work.
      screen.addEventListener('pointerenter', event => {
        if (event.pointerType === 'mouse' || event.pointerType === 'pen') activate(screen, timing.hoverIntent);
      });
      screen.addEventListener('pointerleave', event => {
        if (event.pointerType !== 'touch' && active === screen && !screen.matches(':focus-visible')) reset();
      });
      // Focus starts keyboard previews. Enter or Space replays the current one.
      screen.addEventListener('focus', () => {
        if (screen.matches(':focus-visible')) activate(screen);
      });
      screen.addEventListener('blur', () => {
        if (active === screen && !screen.matches(':hover')) reset();
      });
      screen.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activate(screen, 0, true);
        }
        if (event.key === 'Escape') { event.preventDefault(); reset(); }
      });
      // Tap keeps the result visible until another screen or outside area is tapped.
      screen.addEventListener('click', () => activate(screen, 0, true));
    });

    document.addEventListener('pointerdown', event => {
      if (active && !active.contains(event.target)) reset();
    }, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) reset();
    });
    motion.addEventListener('change', () => {
      if (motion.matches && active) {
        cancelWork();
        active.classList.add('is-active');
        active.setAttribute('aria-pressed', 'true');
        complete(active);
      }
    });
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting && entry.target === active) reset();
        });
      });
      screens.forEach(screen => observer.observe(screen));
    }
  }

  function init() { document.querySelectorAll('[data-odx-showcase]').forEach(initShowcase); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
