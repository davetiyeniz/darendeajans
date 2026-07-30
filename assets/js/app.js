(() => {
  'use strict';
  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const hover = matchMedia('(hover: hover)').matches;
  const $ = (s, c=doc) => c.querySelector(s);
  const $$ = (s, c=doc) => [...c.querySelectorAll(s)];
  const rafThrottle = fn => { let ticking=false; return (...args)=>{ if(ticking)return; ticking=true; requestAnimationFrame(()=>{fn(...args);ticking=false;}); }; };

  // Intro: short on first page only, never blocks repeat navigation.
  const intro = $('.intro-screen');
  if (intro) {
    let seen = false;
    try { seen = sessionStorage.getItem('darende-intro') === '1'; sessionStorage.setItem('darende-intro','1'); } catch (_) {}
    setTimeout(() => intro.classList.add('hide'), reduced ? 0 : (seen ? 60 : 420));
  }

  // Header, scroll progress, active table of contents and light parallax.
  const header = $('.site-header');
  const progress = $('.scroll-progress');
  const tocLinks = $$('.toc a[href^="#"]');
  const parallaxEls = $$('[data-parallax]');
  const onScroll = rafThrottle(() => {
    const y = scrollY;
    header?.classList.toggle('scrolled', y > 16);
    if (progress) {
      const max = root.scrollHeight - innerHeight;
      progress.style.width = `${max > 0 ? Math.min(100,(y/max)*100) : 0}%`;
    }
    if (!reduced && innerWidth > 760) {
      parallaxEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > innerHeight + 100) return;
        const depth = Number(el.dataset.parallax || 0.05);
        const offset = (rect.top + rect.height/2 - innerHeight/2) * depth;
        el.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`);
      });
    }
    if (tocLinks.length) {
      let current = '';
      tocLinks.forEach(a => {
        const section = $(a.getAttribute('href'));
        if (section && section.getBoundingClientRect().top <= 180) current = a.getAttribute('href');
      });
      tocLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === current));
    }
  });
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // Mobile navigation and submenu.
  const menuBtn = $('.menu-toggle');
  const nav = $('.nav');
  const submenuBtn = $('.submenu-toggle');
  const navGroup = $('.nav-group');
  const closeMenu = () => {
    nav?.classList.remove('open'); body.classList.remove('menu-open');
    menuBtn?.setAttribute('aria-expanded','false'); menuBtn?.setAttribute('aria-label','Menüyü aç');
  };
  menuBtn?.addEventListener('click', () => {
    const open = !nav?.classList.contains('open');
    nav?.classList.toggle('open', open); body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  });
  submenuBtn?.addEventListener('click', e => {
    e.preventDefault();
    const open = !navGroup?.classList.contains('open');
    navGroup?.classList.toggle('open', open); submenuBtn.setAttribute('aria-expanded', String(open));
  });
  doc.addEventListener('pointerdown', e => {
    if (navGroup && !navGroup.contains(e.target)) { navGroup.classList.remove('open'); submenuBtn?.setAttribute('aria-expanded','false'); }
  });
  $$('.nav a').forEach(a => a.addEventListener('click', closeMenu));
  addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });
  addEventListener('resize', rafThrottle(() => { if(innerWidth > 1050) closeMenu(); }), {passive:true});

  // Active navigation based on current route.
  const currentPath = location.pathname.replace(/index\.html$/,'').replace(/\/+$/,'/') || '/';
  $$('[data-nav-link]').forEach(a => {
    try {
      const p = new URL(a.href, location.href).pathname.replace(/\/+$/,'/') || '/';
      const active = p === '/' ? currentPath === '/' : currentPath.startsWith(p);
      a.classList.toggle('active', active);
      if(active) a.setAttribute('aria-current','page');
    } catch (_) {}
  });

  // Reveal choreography with automatic stagger.
  const revealEls = $$('.reveal,.reveal-left');
  revealEls.forEach((el,i) => el.style.setProperty('--reveal-delay', `${Math.min((i%5)*55,220)}ms`));
  if (reduced || !('IntersectionObserver' in window)) revealEls.forEach(el => el.classList.add('in'));
  else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in'); observer.unobserve(entry.target);
      });
    }, {threshold:.1, rootMargin:'0px 0px -5%'});
    revealEls.forEach(el => observer.observe(el));
  }

  // Pointer effects: RAF-driven, desktop only.
  if (!reduced && hover && !coarse) {
    const glow = $('.cursor-glow');
    let px=innerWidth/2, py=innerHeight/2, gx=px, gy=py;
    addEventListener('pointermove', e => { px=e.clientX; py=e.clientY; }, {passive:true});
    const animateGlow = () => {
      gx += (px-gx)*.13; gy += (py-gy)*.13;
      if(glow) glow.style.transform=`translate3d(${gx-210}px,${gy-210}px,0)`;
      requestAnimationFrame(animateGlow);
    }; animateGlow();

    $$('.tilt').forEach(card => {
      let frame=0;
      card.addEventListener('pointermove', e => {
        cancelAnimationFrame(frame); frame=requestAnimationFrame(()=>{
          const r=card.getBoundingClientRect();
          const rx=((e.clientY-r.top)/r.height-.5)*-5.5;
          const ry=((e.clientX-r.left)/r.width-.5)*6.5;
          card.style.transform=`perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
        });
      });
      card.addEventListener('pointerleave',()=>{card.style.transform='';});
    });
    $$('.magnetic').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r=btn.getBoundingClientRect();
        btn.style.transform=`translate3d(${(e.clientX-r.left-r.width/2)*.11}px,${(e.clientY-r.top-r.height/2)*.11}px,0)`;
      });
      btn.addEventListener('pointerleave',()=>btn.style.transform='');
    });
    $$('[data-spotlight]').forEach(card => card.addEventListener('pointermove', e => {
      const r=card.getBoundingClientRect();
      card.style.setProperty('--mx',`${e.clientX-r.left}px`); card.style.setProperty('--my',`${e.clientY-r.top}px`);
    }));
  }

  // Lightweight ambient canvas — pauses offscreen and on reduced motion.
  const canvas = $('#ambient-canvas');
  if (canvas && !reduced && innerWidth > 760) {
    const ctx=canvas.getContext('2d',{alpha:true});
    let w=0,h=0,dpr=Math.min(devicePixelRatio||1,1.5),running=true,particles=[];
    const resize=()=>{
      w=innerWidth;h=innerHeight;canvas.width=Math.floor(w*dpr);canvas.height=Math.floor(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
      const count=Math.min(42,Math.max(20,Math.floor(w/40)));
      particles=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.6+.35,vx:(Math.random()-.5)*.08,vy:(Math.random()-.5)*.08,a:Math.random()*.38+.08}));
    };
    const draw=()=>{
      if(!running)return;ctx.clearRect(0,0,w,h);
      for(const p of particles){p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(217,164,65,${p.a})`;ctx.fill();}
      requestAnimationFrame(draw);
    };
    resize();draw();addEventListener('resize',rafThrottle(resize),{passive:true});
    doc.addEventListener('visibilitychange',()=>{running=!doc.hidden;if(running)draw();});
  }

  // Counters.
  $$('[data-count]').forEach(el => {
    const target=Number(el.getAttribute('data-count'))||0;
    if(reduced){el.textContent=target+'+';return;}
    const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const start=performance.now(),dur=1150;
      const tick=t=>{const p=Math.min(1,(t-start)/dur);el.textContent=Math.round(target*(1-Math.pow(1-p,3)))+'+';if(p<1)requestAnimationFrame(tick)};
      requestAnimationFrame(tick);obs.disconnect();
    }),{threshold:.55});obs.observe(el);
  });

  // Smooth anchors and page-aware scrolling.
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
    const id=a.getAttribute('href'); if(!id || id==='#')return;
    const target=$(id); if(target){e.preventDefault();target.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});history.replaceState(null,'',id);}
  }));

  // Form, analytics and success feedback.
  const toast=$('#site-toast');
  const showToast=(message,type='success')=>{if(!toast)return;toast.textContent=message;toast.className=`site-toast ${type} show`;setTimeout(()=>toast.classList.remove('show'),5200);};
  const params=new URLSearchParams(location.search);
  if(params.get('gonderildi')==='1')showToast('Talebiniz ulaştı. En kısa sürede sizinle iletişime geçeceğiz.');
  const form=$('.contact-form');
  form?.addEventListener('submit',()=>{
    const btn=$('button[type="submit"]',form); if(btn){btn.disabled=true;btn.setAttribute('aria-busy','true');btn.textContent='Güvenli şekilde gönderiliyor…';}
    window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'quote_form_submit'});
  });
  $$('[data-event]').forEach(el=>el.addEventListener('click',()=>{window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:el.dataset.event});}));

  // Keep touch interactions stable after bfcache navigation.
  addEventListener('pageshow',()=>{const btn=$('.contact-form button[type="submit"]');if(btn){btn.disabled=false;btn.removeAttribute('aria-busy');btn.textContent='Teklif Talebini Gönder ↗';}});
})();
