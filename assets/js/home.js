(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header
  const header = document.getElementById('siteHeader');
  const progress = document.querySelector('.scroll-progress');
  const updateScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('is-scrolled', y > 18);
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
  };
  addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  // Mobile nav
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeNav = () => {
    nav?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  };
  toggle?.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

  // Reveal
  const reveals = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -35px' });
    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min((i % 5) * 55, 220)}ms`;
      io.observe(el);
    });
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // Jitter video slots: 1-second files are placeholders.
  document.querySelectorAll('.js-jitter-video').forEach(video => {
    const slot = video.dataset.slot;
    const markReady = () => {
      const isReal = Number.isFinite(video.duration) && video.duration > 1.5;
      if (slot === 'background') {
        document.body.classList.toggle('video-background-ready', isReal);
      }
      if (slot === 'hero') {
        document.querySelector('.hero')?.classList.toggle('video-ready', isReal);
      }
      if (slot === 'services') {
        document.querySelector('.services-stage')?.classList.toggle('video-ready', isReal);
      }
    };
    video.addEventListener('loadedmetadata', markReady);
    video.addEventListener('durationchange', markReady);
    video.addEventListener('error', markReady);
    if (video.readyState >= 1) markReady();
  });

  // Respect visibility to reduce background work.
  document.addEventListener('visibilitychange', () => {
    document.querySelectorAll('video').forEach(video => {
      if (document.hidden) video.pause();
      else if (!reduceMotion && video.autoplay) video.play().catch(() => {});
    });
  });
})();
