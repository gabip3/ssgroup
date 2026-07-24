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

  // Sticky header shadow
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll);
  onScroll();

  // Gallery lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (lightbox && lightboxImg) {
    document.querySelectorAll('.gallery-item').forEach(btn => {
      btn.addEventListener('click', () => {
        lightboxImg.src = btn.dataset.full;
        lightboxImg.alt = btn.querySelector('img') ? btn.querySelector('img').alt : '';
        lightbox.classList.add('show');
      });
    });
    const close = () => { lightbox.classList.remove('show'); lightboxImg.src = ''; };
    const closeBtn = document.getElementById('lightboxClose');
    if (closeBtn) closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  // Contact form — Web3Forms.
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

      // Fallback: no Web3Forms key yet → open email client with the details
      if (!hasRealKey) {
        const data = new FormData(form);
        const lines = [];
        for (const [k, v] of data.entries()) {
          if (k === 'photos' || k === 'access_key' || k === 'subject' || k === 'from_name' || !v) continue;
          lines.push(`${k}: ${v}`);
        }
        const body = encodeURIComponent(lines.join('\n'));
        setMsg("Thanks! Your request is ready — confirm sending in your email app. We'll reply within 24 hours.");
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
