(() => {
  const body = document.body;
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');

  const setMenu = (open) => {
    if (!toggle || !menu) return;
    body.classList.toggle('menu-open', open);
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  };

  toggle?.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  menu?.addEventListener('click', (event) => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });

  document.querySelectorAll('[data-scroll-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.scrollTarget);
      if (!target) return;
      setMenu(false);
      const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      target.scrollIntoView({ behavior });
    });
  });

  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  document.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      document.querySelectorAll('[data-category]').forEach((item) => {
        item.hidden = filter !== 'all' && item.dataset.category !== filter;
      });
      document.querySelectorAll('.gallery-grid').forEach((grid) => grid.classList.toggle('is-filtered', filter !== 'all'));
    });
  });

  const hero = document.querySelector('.page-home .hero');
  const heroImage = hero?.querySelector('.hero__image');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const desktopMotion = matchMedia('(min-width: 64rem)');

  if (hero && heroImage) {
    let framePending = false;

    const updateHeroParallax = () => {
      framePending = false;
      if (reducedMotion.matches || !desktopMotion.matches) {
        hero.style.removeProperty('--hero-parallax');
        return;
      }

      const offset = Math.min(Math.max(window.scrollY, 0), hero.offsetHeight);
      hero.style.setProperty('--hero-parallax', `${(offset * 0.16).toFixed(1)}px`);
    };

    const requestHeroParallax = () => {
      if (framePending) return;
      framePending = true;
      requestAnimationFrame(updateHeroParallax);
    };

    updateHeroParallax();
    addEventListener('scroll', requestHeroParallax, { passive: true });
    addEventListener('resize', requestHeroParallax, { passive: true });
    reducedMotion.addEventListener?.('change', requestHeroParallax);
    desktopMotion.addEventListener?.('change', requestHeroParallax);
  }

})();
