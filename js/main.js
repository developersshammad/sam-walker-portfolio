/* Sam Walker — interactions: preloader, thread canvas, Lenis, GSAP/ScrollTrigger scenes */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const root = document.documentElement;
  const SITE = window.SITE, PROJECTS = window.PROJECTS, SKILLS = window.SKILLS;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = typeof window.gsap !== 'undefined';
  const hasST = hasGsap && typeof window.ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);
  const animate = hasGsap && !reduced;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad2 = (n) => String(n).padStart(2, '0');
  const CAT = { frontend: 'Frontend', php: 'PHP + MySQL', dotnet: 'C# / .NET' };

  /* =========================================================
     Content rendering
     ========================================================= */

  /** Generated cover art: brand colours, flowing "thread" lines, a mini window. */
  function cover(p, withTitle = true) {
    let seed = 0; for (const ch of p.id) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    let paths = '';
    for (let i = 0; i < 9; i++) {
      const y = 20 + i * 18 + rnd() * 10;
      paths += `<path d="M-10 ${y.toFixed(1)} C 80 ${(y - 60 + rnd() * 120).toFixed(1)}, 200 ${(y - 60 + rnd() * 120).toFixed(1)}, 330 ${(y - 30 + rnd() * 60).toFixed(1)}" opacity="${(0.25 + rnd() * 0.6).toFixed(2)}"/>`;
    }
    return `<div class="cover" style="--c1:${p.colors[0]};--c2:${p.colors[1]}">
      <div class="cover__glow"></div>
      <svg class="cover__lines" viewBox="0 0 320 200" preserveAspectRatio="none" aria-hidden="true">${paths}</svg>
      <div class="cover__win" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      ${withTitle ? `<div class="cover__title">${esc(p.title)}</div>` : ''}
    </div>`;
  }

  const FEATURED = ['abyss', 'solenne', 'fanhub', 'beatgrid', 'flowfield', 'pccentre', 'furshield'].map((id) => PROJECTS.find((p) => p.id === id)).filter(Boolean);
  $('#featTrack').innerHTML = FEATURED.map((p) => `
    <button type="button" class="fcard" data-open="${p.id}" data-cursor="View">
      <div class="fcard__cover">${cover(p)}</div>
      <div class="fcard__meta">
        <div><h3 class="vh">${esc(p.title)}</h3><p>${esc(p.summary)}</p></div>
        <span class="fcard__tag">${esc(p.label)}</span>
      </div>
    </button>`).join('');
  $('#featTotal').textContent = pad2(FEATURED.length);

  $('#indexList').innerHTML = PROJECTS.map((p, i) => `
    <li class="irow" data-cat="${p.cat}">
      <button type="button" data-open="${p.id}" data-preview="${p.id}">
        <span class="irow__n">${pad2(i + 1)}</span>
        <span class="irow__t">${esc(p.title)}</span>
        <span class="irow__c">${esc(p.label)} · ${esc(CAT[p.cat])}</span>
        <span class="irow__arrow" aria-hidden="true">→</span>
      </button>
    </li>`).join('');
  $('#indexCount').textContent = PROJECTS.length;

  $('#skillStack').innerHTML = SKILLS.map((s, i) => `
    <article class="scard" style="--i:${i}">
      <div>
        <span class="scard__n">0${i + 1}</span>
        <h3>${esc(s.group)}</h3>
        <p class="scard__text">${esc(s.text)}</p>
      </div>
      <div class="chips">${s.items.map((t) => `<span class="chip">${esc(t)}</span>`).join('')}</div>
    </article>`).join('');

  $('#year').textContent = new Date().getFullYear();
  $('#socials').innerHTML = [['GitHub', SITE.github], ['LinkedIn', SITE.linkedin]]
    .filter(([, u]) => u).map(([l, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener" data-hover>${l}</a>`).join('');

  /* =========================================================
     Smooth scroll
     ========================================================= */
  let lenis = null;
  if (animate && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    if (hasST) lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  const scrollTo = (target) => {
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.6 });
    else (typeof target === 'number' ? window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' }) : target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }));
  };

  /* =========================================================
     Hero thread canvas — strings you can pluck with the cursor
     ========================================================= */
  const threads = (() => {
    const cv = $('#threads');
    const ctx = cv.getContext('2d');
    const small = innerWidth < 760;
    const dpr = Math.min(devicePixelRatio || 1, small ? 1.5 : 2);
    let W = 0, H = 0, lines = [], running = false, raf = 0, t = 0;
    const mouse = { x: -9999, y: -9999, vx: 0, vy: 0, px: -9999, py: -9999 };

    function build() {
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = small ? 26 : 22;
      const count = Math.ceil(W / gap) + 1;
      const segs = small ? 18 : 32;
      const accent = Math.round(count * 0.62);
      lines = Array.from({ length: count }, (_, i) => ({
        x0: i * gap + (W - (count - 1) * gap) / 2,
        accent: i === accent,
        pts: Array.from({ length: segs + 1 }, (_, j) => ({ y: (j / segs) * H, dx: 0, vx: 0 })),
      }));
    }

    function step() {
      t += 0.012;
      mouse.vx *= 0.85; mouse.vy *= 0.85;
      const R = small ? 90 : 140;
      for (const l of lines) {
        for (let j = 1; j < l.pts.length - 1; j++) {
          const p = l.pts[j];
          const x = l.x0 + p.dx;
          const ddx = x - mouse.x, ddy = p.y - mouse.y;
          const d2 = ddx * ddx + ddy * ddy;
          if (d2 < R * R) {
            const f = 1 - Math.sqrt(d2) / R;
            p.vx += mouse.vx * f * 0.09 + (ddx >= 0 ? 1 : -1) * f * 0.6;
          }
          const sway = reduced ? 0 : Math.sin(t + l.x0 * 0.01 + j * 0.25) * 0.04;
          p.vx += -p.dx * 0.035 + sway;                       // spring home
          p.vx += ((l.pts[j - 1].dx + l.pts[j + 1].dx) / 2 - p.dx) * 0.12; // tension with neighbours
          p.vx *= 0.9;
        }
        for (const p of l.pts) p.dx += p.vx;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (const l of lines) {
        ctx.beginPath();
        const pts = l.pts;
        ctx.moveTo(l.x0 + pts[0].dx, pts[0].y);
        for (let j = 1; j < pts.length - 1; j++) {
          const xc = l.x0 + (pts[j].dx + pts[j + 1].dx) / 2, yc = (pts[j].y + pts[j + 1].y) / 2;
          ctx.quadraticCurveTo(l.x0 + pts[j].dx, pts[j].y, xc, yc);
        }
        ctx.lineTo(l.x0 + pts[pts.length - 1].dx, pts[pts.length - 1].y);
        ctx.strokeStyle = l.accent ? 'rgba(255,77,31,.9)' : 'rgba(236,230,218,.13)';
        ctx.lineWidth = l.accent ? 1.6 : 1;
        ctx.stroke();
      }
    }

    function loop() { step(); draw(); raf = requestAnimationFrame(loop); }
    const start = () => { if (!running) { running = true; loop(); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    const hero = $('.hero');
    hero.addEventListener('pointermove', (e) => {
      const r = cv.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (mouse.px > -9000) { mouse.vx = x - mouse.px; mouse.vy = y - mouse.py; }
      mouse.x = mouse.px = x; mouse.y = mouse.py = y;
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = mouse.px = mouse.py = -9999; });

    build();
    if (reduced) { draw(); } else {
      new IntersectionObserver(([en]) => (en.isIntersecting ? start() : stop())).observe(cv);
      document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    }
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { build(); if (!running) draw(); }, 150); });

    /** A big "pluck" across all threads for the intro. */
    return {
      pluck() {
        if (reduced) return;
        lines.forEach((l, i) => l.pts.forEach((p, j) => { p.vx += Math.sin(j / l.pts.length * Math.PI) * (14 + (i % 5) * 3) * (i % 2 ? 1 : -1); }));
      },
    };
  })();

  /* =========================================================
     Text helpers
     ========================================================= */
  function splitChars(el) {
    const text = el.textContent;
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = [...text].map((c) => (c === ' ' ? ' ' : `<span class="char">${esc(c)}</span>`)).join('');
    return $$('.char', el);
  }
  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim().replace(/\s+/g, ' '));
    el.innerHTML = words.map((w) => `<span class="w" aria-hidden="true">${esc(w)}</span>`).join(' ');
    return $$('.w', el);
  }
  function scramble(el, duration = 1.2) {
    const final = el.textContent, glyphs = '!<>-_\\/[]{}—=+*^?#$%&01';
    if (reduced) return;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / (duration * 1000));
      const reveal = Math.floor(p * final.length);
      el.textContent = final.split('').map((c, i) => (i < reveal || c === ' ' ? c : glyphs[Math.floor(Math.random() * glyphs.length)])).join('');
      if (p < 1) requestAnimationFrame(tick); else el.textContent = final;
    };
    requestAnimationFrame(tick);
  }

  const heroChars = $$('[data-split]', $('.hero')).map(splitChars);
  const contactChars = $$('[data-split]', $('.contact')).map(splitChars).flat();

  /* =========================================================
     Preloader → hero intro
     ========================================================= */
  function heroIntro() {
    root.classList.add('ready');
    lenis?.start();
    if (!animate) return;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from(heroChars.flat(), { yPercent: 115, rotate: 8, duration: 1.6, stagger: { each: 0.045, from: 'start' } }, 0)
      .add(() => { threads.pluck(); scramble($('[data-scramble]')); }, 0.1)
      .from('.hero__kicker, .hero__lede, .hero__ctas > *, .hero__scroll', { y: 30, opacity: 0, duration: 1.2, stagger: 0.08 }, 0.5)
      .from('.nav', { opacity: 0, duration: 1.2 }, 0.6);
  }

  (function preloader() {
    const loader = $('.loader');
    if (!animate) { loader.remove(); heroIntro(); return; }
    const num = $('#loadNum'), bar = $('#loadBar');
    const counter = { v: 0 };
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    const minTime = new Promise((r) => setTimeout(r, 1400));
    gsap.to(counter, {
      v: 86, duration: 1.4, ease: 'power2.out',
      onUpdate: () => { num.textContent = Math.round(counter.v); bar.style.width = counter.v + '%'; },
    });
    const failsafe = new Promise((r) => setTimeout(r, 3500));
    Promise.race([Promise.all([fontsReady, minTime]), failsafe]).then(() => {
      gsap.timeline()
        .to(counter, { v: 100, duration: 0.4, ease: 'power1.in', onUpdate: () => { num.textContent = Math.round(counter.v); bar.style.width = counter.v + '%'; } })
        .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, '+=0.1')
        .add(heroIntro, '-=0.55')
        .add(() => { loader.remove(); if (hasST) ScrollTrigger.refresh(); });
    });
  })();

  /* =========================================================
     Cursor + magnetic
     ========================================================= */
  if (fine && animate) {
    const cur = $('.cursor'), label = $('.cursor__label');
    root.classList.add('has-cursor');
    gsap.set(cur, { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    const qx = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' });
    const qy = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' });
    addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') { qx(e.clientX); qy(e.clientY); cur.classList.remove('is-hidden'); } }, { passive: true });
    document.addEventListener('mouseleave', () => cur.classList.add('is-hidden'));
    document.addEventListener('pointerover', (e) => {
      const lab = e.target.closest('[data-cursor]');
      const hov = e.target.closest('a, button, [data-hover], .chip');
      cur.classList.toggle('is-label', !!lab);
      cur.classList.toggle('is-hover', !lab && !!hov);
      if (lab) label.textContent = lab.dataset.cursor;
    });

    $$('[data-magnetic]').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, .4)' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, .4)' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.35); yTo((e.clientY - r.top - r.height / 2) * 0.45);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  /* =========================================================
     Navigation + mobile menu + anchors
     ========================================================= */
  const nav = $('#nav'), menu = $('#menu'), burger = $('#burger');
  let menuOpen = false, lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    if (!menuOpen) nav.classList.toggle('is-hidden', y > lastY + 2 && y > 300);
    if (y < lastY - 2) nav.classList.remove('is-hidden');
    lastY = y;
  }, { passive: true });

  const navLinks = $$('.nav__links a');
  const navIO = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['about', 'work', 'skills', 'process', 'contact'].forEach((id) => navIO.observe(document.getElementById(id)));

  function setMenu(open) {
    menuOpen = open;
    root.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) {
      menu.hidden = false; lenis?.stop();
      if (animate) {
        gsap.fromTo(menu, { clipPath: 'circle(0% at 100% 0%)' }, { clipPath: 'circle(150% at 100% 0%)', duration: 0.9, ease: 'expo.inOut' });
        gsap.fromTo($$('nav span', menu), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.06, ease: 'expo.out', delay: 0.3 });
      }
      $('nav a', menu).focus({ preventScroll: true });
    } else {
      lenis?.start();
      const done = () => { menu.hidden = true; };
      animate ? gsap.to(menu, { clipPath: 'circle(0% at 100% 0%)', duration: 0.6, ease: 'expo.in', onComplete: done }) : done();
    }
  }
  burger.addEventListener('click', () => setMenu(!menuOpen));

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    const wasOpen = menuOpen;
    if (wasOpen) { menuOpen = false; root.classList.remove('menu-open'); menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); lenis?.start(); }
    if (sheetOpen) closeSheet();
    // Pinned sections change layout height, so ask ScrollTrigger where the section really starts
    setTimeout(() => scrollTo(id === 'top' ? 0 : target), wasOpen ? 30 : 0);
  });

  /* =========================================================
     Scroll scenes
     ========================================================= */
  if (hasST && animate) {
    // Hero exit: name drifts apart, threads fade
    gsap.to('.hero__name .line:first-child', { xPercent: -14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__name .line--right', { xPercent: 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__threads', { opacity: 0.15, yPercent: 20, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // Page-wide trace thread
    const tp = $('#tracePath'), tLen = tp.getTotalLength();
    gsap.set(tp, { strokeDasharray: tLen, strokeDashoffset: tLen });
    gsap.to(tp, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.6 } });

    // Marquee: endless loop, speed + skew follow scroll velocity, direction follows scroll direction
    const mq = $('#marquee');
    const loop = gsap.to(mq, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
    const skewTo = gsap.quickTo(mq, 'skewX', { duration: 0.4, ease: 'power3' });
    ScrollTrigger.create({
      trigger: '.marquee', start: 'top bottom', end: 'bottom top',
      onUpdate(self) {
        const v = self.getVelocity();
        gsap.to(loop, { timeScale: (self.direction === 1 ? 1 : -1) * (1 + Math.min(Math.abs(v) / 300, 6)), duration: 0.2, overwrite: true });
        gsap.to(loop, { timeScale: self.direction === 1 ? 1 : -1, duration: 1.2, delay: 0.25, overwrite: false });
        skewTo(Math.max(-12, Math.min(12, v / -250)));
      },
    });

    // Section eyebrows + headings
    $$('.eyebrow, .h2, .featured__title').forEach((el) => gsap.from(el, { y: 60, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));

    // About: words light up as you read
    const words = splitWords($('[data-reveal-words]'));
    gsap.fromTo(words, { opacity: 0.12, y: 12 }, { opacity: 1, y: 0, stagger: 0.04, ease: 'none', scrollTrigger: { trigger: '.about__big', start: 'top 80%', end: 'bottom 45%', scrub: true } });
    $$('[data-count]').forEach((el) => {
      const o = { v: 0 };
      gsap.to(o, { v: +el.dataset.count, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: () => { el.textContent = Math.round(o.v); } });
    });

    // Featured: vertical scroll drives a horizontal track (desktop)
    const mm = gsap.matchMedia();
    mm.add('(min-width: 861px)', () => {
      const track = $('#featTrack');
      const dist = () => track.scrollWidth - innerWidth;
      const horiz = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: '.featured', start: 'top top', end: () => '+=' + dist(), pin: '.featured__pin', scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: (self) => { $('#featNum').textContent = pad2(Math.min(FEATURED.length, 1 + Math.floor(self.progress * FEATURED.length * 0.999))); },
        },
      });
      $$('.fcard').forEach((card) => {
        gsap.fromTo($('.cover', card), { xPercent: -5 }, { xPercent: 5, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: horiz, start: 'left right', end: 'right left', scrub: true } });
        gsap.from($('.cover__title', card), { yPercent: 60, opacity: 0, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: horiz, start: 'left 95%', end: 'left 45%', scrub: true } });
        gsap.fromTo(card, { rotate: 2.5, scale: 0.92 }, { rotate: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: horiz, start: 'left right', end: 'left 40%', scrub: true } });
      });
    });

    // Index rows slide in
    gsap.from('.irow', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: '.index__list', start: 'top 85%', once: true } });

    // Skills: each card shrinks and dims as the next one stacks on top
    mm.add('(min-width: 861px)', () => {
      const cards = $$('.scard');
      cards.forEach((c, i) => {
        if (i === cards.length - 1) return;
        gsap.to(c, { scale: 0.92 - (cards.length - 2 - i) * 0.02, filter: 'brightness(.55)', ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top ' + (96 + (i + 1) * 26) + 'px', scrub: true } });
      });
    });
    $$('.scard').forEach((c) => gsap.from($$('.chip', c), { y: 30, opacity: 0, scale: 0.8, stagger: 0.04, duration: 0.8, ease: 'back.out(2)', scrollTrigger: { trigger: c, start: 'top 75%', once: true } }));

    // Process: the thread draws itself between the steps
    const pp = $('#processPath'), pLen = pp.getTotalLength();
    gsap.set(pp, { strokeDasharray: pLen, strokeDashoffset: pLen });
    gsap.to(pp, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.process__wrap', start: 'top 70%', end: 'bottom 60%', scrub: 0.8 } });
    $$('.process__steps li').forEach((li, i) => gsap.from(li, { x: i % 2 ? 80 : -80, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: li, start: 'top 80%', once: true } }));

    // Contact: red panel rises, headline letters drop in
    gsap.from('.contact', { clipPath: 'inset(12% 6% 0% 6% round 40px)', ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'top 25%', scrub: true } });
    gsap.from(contactChars, { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.03, scrollTrigger: { trigger: '.contact__title', start: 'top 80%', once: true } });
    gsap.from('.contact__title .serif', { yPercent: 110, duration: 1.4, ease: 'expo.out', delay: 0.2, scrollTrigger: { trigger: '.contact__title', start: 'top 80%', once: true } });

    // Footer wordmark slides in
    gsap.from('.footer__mark', { xPercent: 30, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });

    addEventListener('load', () => ScrollTrigger.refresh());
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  } else {
    splitWords($('[data-reveal-words]'));
    $$('[data-count]').forEach((el) => { el.textContent = el.dataset.count; });
  }

  /* =========================================================
     Project index: filters + floating preview that follows the cursor
     ========================================================= */
  $$('.filter').forEach((b) => b.addEventListener('click', () => {
    const f = b.dataset.filter;
    $$('.filter').forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    const rows = $$('.irow');
    rows.forEach((r) => { r.hidden = f !== 'all' && r.dataset.cat !== f; });
    $('#indexCount').textContent = rows.filter((r) => !r.hidden).length;
    if (animate) gsap.fromTo(rows.filter((r) => !r.hidden), { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, stagger: 0.04, ease: 'expo.out' });
    if (hasST) ScrollTrigger.refresh();
  }));

  if (fine && animate) {
    const float = $('#indexFloat'), inner = $('#indexFloatInner');
    const fx = gsap.quickTo(float, 'x', { duration: 0.6, ease: 'power3' });
    const fy = gsap.quickTo(float, 'y', { duration: 0.6, ease: 'power3' });
    const fr = gsap.quickTo(float, 'rotate', { duration: 0.8, ease: 'power3' });
    let lastX = 0, current = '';
    $('#indexList').addEventListener('pointermove', (e) => {
      fx(e.clientX + 30); fy(e.clientY - 110);
      fr(Math.max(-12, Math.min(12, (e.clientX - lastX) * 0.6))); lastX = e.clientX;
      const b = e.target.closest('[data-preview]');
      if (b && b.dataset.preview !== current) {
        current = b.dataset.preview;
        inner.innerHTML = cover(PROJECTS.find((p) => p.id === current));
        gsap.fromTo(inner, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.5, ease: 'expo.out' });
      }
    });
    $('#indexList').addEventListener('pointerenter', () => gsap.to(float, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' }));
    $('#indexList').addEventListener('pointerleave', () => { current = ''; gsap.to(float, { opacity: 0, scale: 0.6, duration: 0.4, ease: 'power3.in' }); });
  }

  /* =========================================================
     Project sheet
     ========================================================= */
  const sheet = $('#sheet'), panel = $('.sheet__panel'), body = $('#sheetBody');
  let sheetOpen = false, lastFocus = null;

  function sheetHtml(p) {
    const i = PROJECTS.indexOf(p), next = PROJECTS[(i + 1) % PROJECTS.length];
    const live = p.live
      ? `<a class="btn btn--fill" href="${esc(p.live)}" target="_blank" rel="noopener" data-hover>Open live project ↗</a>`
      : '';
    const src = p.source ? `<a class="btn btn--line" href="${esc(p.source)}" target="_blank" rel="noopener" data-hover>View source ↗</a>` : '';
    const note = !p.live && !p.source ? `<p class="sheet__note">${p.cat === 'dotnet' ? 'Runs locally in Visual Studio.' : 'Runs on PHP + MySQL hosting.'} Code and a demo walkthrough are available on request: <a href="mailto:${esc(SITE.email)}?subject=${encodeURIComponent(p.title)}">${esc(SITE.email)}</a></p>` : '';
    return `
      <div class="sheet__cover">${cover(p)}</div>
      <p class="sheet__label">${esc(p.label)} — ${esc(CAT[p.cat])}</p>
      <h2 id="sheetTitle">${esc(p.title)}</h2>
      <p class="sheet__summary">${esc(p.summary)}</p>
      <div class="sheet__grid">
        <div><h3>Key features</h3><ul class="sheet__features">${p.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul></div>
        <div><h3>Built with</h3><div class="sheet__stack">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div></div>
      </div>
      <div class="sheet__actions">${live}${src}${note}</div>
      <button type="button" class="sheet__next" data-open="${next.id}"><span>Next project</span><b>${esc(next.title)} →</b></button>`;
  }

  function openSheet(id) {
    const p = PROJECTS.find((x) => x.id === id);
    if (!p) return;
    const fill = () => { body.innerHTML = sheetHtml(p); panel.scrollTop = 0; };
    if (sheetOpen) {
      if (!animate) return fill();
      gsap.to(body, { opacity: 0, x: -40, duration: 0.25, onComplete: () => { fill(); gsap.fromTo(body, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.6, ease: 'expo.out' }); } });
      return;
    }
    sheetOpen = true; lastFocus = document.activeElement;
    fill(); sheet.hidden = false; root.classList.add('sheet-open'); lenis?.stop();
    if (animate) {
      gsap.fromTo('.sheet__backdrop', { opacity: 0 }, { opacity: 1, duration: 0.5 });
      gsap.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.9, ease: 'expo.out' });
      gsap.fromTo($('.sheet__cover', body), { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'expo.out', delay: 0.2 });
      gsap.from($$('.sheet__label, h2, .sheet__summary, .sheet__grid, .sheet__actions', body), { y: 40, opacity: 0, stagger: 0.06, duration: 1, ease: 'expo.out', delay: 0.3 });
    }
    panel.focus({ preventScroll: true });
  }
  function closeSheet() {
    if (!sheetOpen) return;
    sheetOpen = false;
    const done = () => { sheet.hidden = true; root.classList.remove('sheet-open'); lenis?.start(); lastFocus?.focus?.({ preventScroll: true }); };
    if (!animate) return done();
    gsap.to('.sheet__backdrop', { opacity: 0, duration: 0.4 });
    gsap.to(panel, { xPercent: 100, duration: 0.6, ease: 'expo.in', onComplete: done });
  }

  document.addEventListener('click', (e) => {
    const o = e.target.closest('[data-open]'); if (o) { openSheet(o.dataset.open); return; }
    if (e.target.closest('[data-close]')) closeSheet();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { if (sheetOpen) closeSheet(); else if (menuOpen) setMenu(false); }
    if (e.key !== 'Tab' || (!sheetOpen && !menuOpen)) return;
    const scope = sheetOpen ? panel : menu;
    const f = $$('a[href], button:not([disabled])', scope).concat(menuOpen ? [burger] : []).filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });

  /* =========================================================
     Contact: letter wave + copy email
     ========================================================= */
  const mailText = $('[data-wave]');
  const mailChars = splitChars(mailText);
  mailText.removeAttribute('aria-hidden');
  if (animate) {
    $('#copyMail').addEventListener('pointerenter', () => gsap.fromTo(mailChars, { y: 0 }, { y: -18, duration: 0.25, ease: 'power2.out', stagger: { each: 0.025, yoyo: true, repeat: 1 } }));
  }
  $('#copyMail').addEventListener('click', async () => {
    const hint = $('#copyHint');
    try { await navigator.clipboard.writeText(SITE.email); hint.textContent = 'Copied. Talk soon.'; }
    catch (err) { location.href = 'mailto:' + SITE.email; return; }
    if (animate) gsap.fromTo('#copyMail', { scale: 0.96 }, { scale: 1, duration: 0.8, ease: 'elastic.out(1, .4)' });
    setTimeout(() => { hint.innerHTML = `Click to copy, or <a href="mailto:${esc(SITE.email)}" data-hover>open your mail app</a>.`; }, 3000);
  });
})();
