/* Runs after shared components are injected into the page */
function initSite() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Animated hero stats counters (start when scrolled into view)
  const counters = [
    { id: 'counter1', end: 150 },
    { id: 'counter2', end: 10 },
    { id: 'counter3', end: 100 },
  ];
  const runCounter = (id, end) => {
    const el = document.getElementById(id);
    if (!el) return;
    let start = 0;
    const step = Math.max(1, Math.round(end / 60));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { start = end; clearInterval(timer); }
      el.textContent = start + '+';
    }, 22);
  };
  const statsBlock = document.querySelector('.stats');
  if (statsBlock) {
    let started = false;
    const start = () => { if (started) return; started = true; counters.forEach(c => runCounter(c.id, c.end)); };
    const inView = () => {
      const r = statsBlock.getBoundingClientRect();
      return r.top < (window.innerHeight || document.documentElement.clientHeight) && r.bottom > 0;
    };
    if (inView()) {
      start();
    } else if ('IntersectionObserver' in window) {
      const so = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { start(); so.disconnect(); } });
      }, { threshold: 0.2 });
      so.observe(statsBlock);
    } else {
      start();
    }
  }

  // Mobile nav toggle
  const header = document.getElementById('siteHeader');
  const hamburger = document.getElementById('hamburger');
  if (hamburger && header) {
    hamburger.addEventListener('click', () => header.classList.toggle('nav-open'));
  }
  document.querySelectorAll('.main-nav a').forEach(a => {
    a.addEventListener('click', () => header && header.classList.remove('nav-open'));
  });
  document.querySelectorAll('.has-dropdown > a').forEach(link => {
    link.addEventListener('click', e => {
      if (window.innerWidth <= 860) {
        e.preventDefault();
        link.parentElement.classList.toggle('open');
      }
    });
  });

  // Sticky header shadow + back-to-top visibility
  const backTop = document.getElementById('backToTop');
  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
    if (backTop) backTop.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Gallery carousel lightbox (multiple photos per category)
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (lightbox && lightboxImg) {
    const lbTitle = document.getElementById('lbTitle');
    const lbCounter = document.getElementById('lbCounter');
    let imgs = [], idx = 0, title = '';
    const render = () => {
      lightboxImg.src = imgs[idx];
      lightboxImg.alt = title + ' ' + (idx + 1);
      if (lbTitle) lbTitle.textContent = title;
      if (lbCounter) lbCounter.textContent = ` ${idx + 1} / ${imgs.length}`;
    };
    const open = (list, t, start) => {
      imgs = list; title = t; idx = start || 0;
      // preload neighbours
      imgs.forEach(s => { const im = new Image(); im.src = s; });
      render();
      lightbox.classList.add('show');
    };
    const step = (d) => { if (!imgs.length) return; idx = (idx + d + imgs.length) % imgs.length; render(); };
    const close = () => { lightbox.classList.remove('show'); lightboxImg.src = ''; imgs = []; };

    // Cloudinary: pull client-uploaded photos per category (graceful if not configured)
    const CLOUD = window.SSG_CLOUDINARY || {};
    const cloudMap = {}; // cat -> { full:[], thumb:[] }
    const cloudList = (cat) => {
      if (!CLOUD.ready) return Promise.resolve({ full: [], thumb: [] });
      const tag = (CLOUD.tagPrefix || 'ssg_') + cat;
      return fetch(`https://res.cloudinary.com/${CLOUD.cloudName}/image/list/${tag}.json`)
        .then(r => (r.ok ? r.json() : { resources: [] }))
        .then(d => {
          const res = (d.resources || []).sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
          const url = (x, t) => `https://res.cloudinary.com/${CLOUD.cloudName}/image/upload/${t}/${x.public_id}.${x.format}`;
          return {
            full: res.map(x => url(x, 'w_1400,q_auto,f_auto')),
            thumb: res.map(x => url(x, 'w_400,h_300,c_fill,q_auto,f_auto')),
          };
        })
        .catch(() => ({ full: [], thumb: [] }));
    };
    const localFull = (cat, count, base) =>
      Array.from({ length: count }, (_, i) => `${base || `assets/img/gallery/${cat}/`}${i + 1}.jpg`);

    const wireGallery = () => {
      // Category tiles (home / city pages)
      document.querySelectorAll('.gallery-item').forEach(btn => {
        btn.addEventListener('click', () => {
          let list;
          if (btn.dataset.cat && btn.dataset.count) {
            list = localFull(btn.dataset.cat, +btn.dataset.count, btn.dataset.base)
              .concat((cloudMap[btn.dataset.cat] || {}).full || []);
          } else {
            list = (btn.dataset.images || btn.dataset.full || '').split(',').map(s => s.trim()).filter(Boolean);
          }
          open(list, btn.dataset.title || '', 0);
        });
      });
      // Service-page work strips
      document.querySelectorAll('.gallery-strip').forEach(strip => {
        const cat = strip.dataset.cat, count = +strip.dataset.count, title = strip.dataset.title || '';
        if (!cat || !count) return;
        const cloud = cloudMap[cat] || { full: [], thumb: [] };
        const full = localFull(cat, count, strip.dataset.base).concat(cloud.full);
        const thumbs = localFull(cat, count, strip.dataset.base).concat(cloud.thumb);
        strip.innerHTML = '';
        thumbs.forEach((src, i) => {
          const b = document.createElement('button');
          b.className = 'strip-thumb';
          b.setAttribute('aria-label', `${title} photo ${i + 1}`);
          const im = document.createElement('img');
          im.src = src; im.loading = 'lazy'; im.alt = `${title} project ${i + 1}`;
          b.appendChild(im);
          b.addEventListener('click', () => open(full, title, i));
          strip.appendChild(b);
        });
      });
    };

    const cats = new Set();
    document.querySelectorAll('.gallery-item[data-cat], .gallery-strip[data-cat]').forEach(el => cats.add(el.dataset.cat));
    Promise.all([...cats].map(c => cloudList(c).then(v => { cloudMap[c] = v; }))).then(wireGallery);

    const prevBtn = document.getElementById('lbPrev');
    const nextBtn = document.getElementById('lbNext');
    if (prevBtn) prevBtn.addEventListener('click', e => { e.stopPropagation(); step(-1); });
    if (nextBtn) nextBtn.addEventListener('click', e => { e.stopPropagation(); step(1); });
    const closeBtn = document.getElementById('lightboxClose');
    if (closeBtn) closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', e => { if (e.target === lightbox || e.target.classList.contains('lb-figure')) close(); });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('show')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    });
    // basic swipe on touch
    let sx = 0;
    lightbox.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  // Contact form, Web3Forms.
  // To activate: create a free access key at https://web3forms.com and paste it
  // into the hidden "access_key" input in the form (js/components.js).
  // Until a real key is set, it falls back to opening the user's email app.
  const form = document.getElementById('estimateForm');
  const success = document.getElementById('formSuccess');
  const setMsg = (text, isError) => {
    if (!success) return;
    success.textContent = text;
    success.classList.toggle('error', !!isError);
    success.classList.add('show');
  };
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const submitBtn = form.querySelector('button[type=submit]');
      const keyEl = form.querySelector('input[name="access_key"]');
      const key = keyEl ? keyEl.value.trim() : '';
      const hasRealKey = key && !key.includes('YOUR_');

      // Make sure the "Reply" button in the inbox goes straight to the customer
      const emailEl = form.querySelector('input[name="email"]');
      const replytoEl = form.querySelector('input[name="replyto"]');
      if (emailEl && replytoEl) replytoEl.value = emailEl.value;

      // Fallback: no Web3Forms key yet → open email client with the details
      if (!hasRealKey) {
        const data = new FormData(form);
        const lines = [];
        for (const [k, v] of data.entries()) {
          if (k === 'photos' || k === 'access_key' || k === 'subject' || k === 'from_name' || k === 'replyto' || !v) continue;
          lines.push(`${k}: ${v}`);
        }
        const body = encodeURIComponent(lines.join('\n'));
        setMsg("Thanks! Your request is ready, confirm sending in your email app. We'll reply within 24 hours.");
        submitBtn.disabled = true;
        window.location.href = `mailto:info@ssrenovationsgroup.com?subject=${encodeURIComponent('Free Estimate Request')}&body=${body}`;
        return;
      }

      // Real submission via Web3Forms
      submitBtn.disabled = true;
      const original = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: new FormData(form),
        });
        const out = await res.json();
        if (out.success) {
          setMsg("Thanks! Your request has been sent. We'll get back to you within 24 hours.");
          form.reset();
        } else {
          setMsg('Something went wrong. Please call us at (978) 201-4112.', true);
          submitBtn.disabled = false;
        }
      } catch (err) {
        setMsg('Network error. Please call us at (978) 201-4112.', true);
        submitBtn.disabled = false;
      } finally {
        submitBtn.textContent = original;
      }
    });
  }

  // Scroll reveal (with graceful fallback)
  const revealTargets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(el => io.observe(el));
    // Safety net: reveal anything still hidden after 3s (e.g. observer never fired)
    setTimeout(() => revealTargets.forEach(el => el.classList.add('in')), 3000);
  } else {
    revealTargets.forEach(el => el.classList.add('in'));
  }
}

if (window.__componentsReady) {
  initSite();
} else {
  document.addEventListener('components:ready', initSite);
}
