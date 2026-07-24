/* ============================================================
   Shared site components (header, contact, footer, lightbox)
   Injected on every page so there is ONE source of truth.
   ============================================================ */
(function () {
  const page = document.body.dataset.page || 'home';
  const prefix = document.body.dataset.prefix || ''; // '' for root, '../' for subpages

  const PHONE = '(978) 201-4112';
  const PHONE_HREF = 'tel:+19782014112';
  const EMAIL = 'info@ssrenovationsgroup.com';

  const services = [
    { key: 'flooring',  label: 'Flooring',  file: 'flooring.html' },
    { key: 'siding',    label: 'Siding',    file: 'siding.html' },
    { key: 'painting',  label: 'Painting',  file: 'painting.html' },
    { key: 'framing',   label: 'Framing',   file: 'framing.html' },
    { key: 'roofing',   label: 'Roofing',   file: 'roofing.html' },
    { key: 'carpentry', label: 'Carpentry', file: 'carpentry.html' },
  ];

  const home = prefix + 'index.html';
  const isActive = (p) => (page === p ? ' class="active"' : '');

  /* ---------- HEADER ---------- */
  const headerHTML = `
  <div class="topbar">
    <div class="container topbar-inner">
      <a href="${PHONE_HREF}" class="topbar-phone">
        <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.4 21 3 13.6 3 4.9c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1l-2.3 2.4z"/></svg>
        ${PHONE}
      </a>
      <span class="topbar-tag">Owner-Supervised Projects &nbsp;•&nbsp; 24-Hour Response Time</span>
      <a href="${home}#contact" class="btn btn-mini">GET FREE ESTIMATE</a>
    </div>
  </div>

  <header class="site-header" id="siteHeader">
    <div class="container header-inner">
      <a href="${home}" class="logo">
        <img src="${prefix}assets/img/logo/logo-header.png" alt="SS Renovations Group">
      </a>

      <nav class="main-nav" id="mainNav">
        <ul>
          <li><a href="${home}"${isActive('home')}>HOME</a></li>
          <li class="has-dropdown">
            <a href="${home}#services">SERVICES</a>
            <ul class="dropdown">
              ${services.map(s => `<li><a href="${prefix}${s.file}"${page === s.key ? ' class="active"' : ''}>${s.label}</a></li>`).join('')}
            </ul>
          </li>
          <li><a href="${home}#gallery">GALLERY</a></li>
          <li><a href="${home}#reviews">REVIEWS</a></li>
          <li><a href="${home}#contact">CONTACT</a></li>
        </ul>
      </nav>

      <div class="header-right">
        <div class="licensed-badge">
          <strong>Licensed &amp; Insured</strong>
          <span>CSL #120109 &nbsp;|&nbsp; HIC #201338</span>
        </div>
        <a href="${home}#contact" class="btn btn-primary">GET FREE ESTIMATE</a>
      </div>

      <button class="hamburger" id="hamburger" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>`;

  /* ---------- CONTACT ---------- */
  const contactHTML = `
  <section class="section contact" id="contact">
    <div class="container contact-grid">
      <div class="contact-info reveal">
        <p class="kicker">- GET IN TOUCH -</p>
        <h2 class="section-title">Tell us about your project and we'll get back to you within 24 hours.</h2>

        <ul class="info-list">
          <li><span class="info-label">Call Us</span><a href="${PHONE_HREF}">${PHONE}</a></li>
          <li><span class="info-label">Email</span><a href="mailto:${EMAIL}">${EMAIL}</a></li>
          <li><span class="info-label">Hours</span><span>Mon – Sat | 7AM – 6PM</span></li>
          <li><span class="info-label">Licensed &amp; Insured</span><span>CSL #120109 &nbsp;|&nbsp; HIC #201338</span></li>
        </ul>

        <div class="social-bar">
          <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 2.2.27 2.9.55.8.3 1.4.7 2 1.3.6.6 1 1.2 1.3 2 .3.7.5 1.7.5 2.9.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.06 1.2-.27 2.2-.55 2.9-.3.8-.7 1.4-1.3 2-.6.6-1.2 1-2 1.3-.7.3-1.7.5-2.9.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.06-2.2-.27-2.9-.55-.8-.3-1.4-.7-2-1.3-.6-.6-1-1.2-1.3-2-.3-.7-.5-1.7-.5-2.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.06-1.2.27-2.2.55-2.9.3-.8.7-1.4 1.3-2 .6-.6 1.2-1 2-1.3.7-.3 1.7-.5 2.9-.55C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.07-1 .05-1.6.22-1.9.36-.5.2-.8.4-1.2.8-.4.4-.6.7-.8 1.2-.14.4-.3 1-.36 1.9C3 9.5 3 9.9 3 13s0 3.5.07 4.7c.05 1 .22 1.6.36 1.9.2.5.4.8.8 1.2.4.4.7.6 1.2.8.4.14 1 .3 1.9.36 1.2.07 1.6.07 4.7.07s3.5 0 4.7-.07c1-.05 1.6-.22 1.9-.36.5-.2.8-.4 1.2-.8.4-.4.6-.7.8-1.2.14-.4.3-1 .36-1.9.07-1.2.07-1.6.07-4.7s0-3.5-.07-4.7c-.05-1-.22-1.6-.36-1.9-.2-.5-.4-.8-.8-1.2-.4-.4-.7-.6-1.2-.8-.4-.14-1-.3-1.9-.36-1.2-.07-1.6-.07-4.7-.07zm0 4.3a4.7 4.7 0 110 9.4 4.7 4.7 0 010-9.4zm0 1.8a2.9 2.9 0 100 5.8 2.9 2.9 0 000-5.8zm5.9-2a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z"/></svg></a>
          <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M13.5 21.9v-8.2h2.75l.41-3.2h-3.16V8.4c0-.93.26-1.56 1.6-1.56h1.7V3.98A22.6 22.6 0 0014.4 3.8c-2.3 0-3.9 1.4-3.9 4v2.7H7.75v3.2h2.75v8.2h3z"/></svg></a>
        </div>

        <img src="${prefix}assets/img/logo/logo-header.png" alt="SS Renovations Group" class="contact-logo">
      </div>

      <form class="contact-form reveal" id="estimateForm" novalidate>
        <!-- Web3Forms: paste your free access key from https://web3forms.com below -->
        <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY">
        <input type="hidden" name="subject" value="New Free Estimate Request — SS Renovations">
        <input type="hidden" name="from_name" value="SS Renovations Website">
        <input type="checkbox" name="botcheck" style="display:none" tabindex="-1" autocomplete="off">
        <div class="form-row">
          <div class="form-field"><label for="firstName">First name*</label><input type="text" id="firstName" name="First name" required></div>
          <div class="form-field"><label for="lastName">Last name</label><input type="text" id="lastName" name="Last name"></div>
        </div>
        <div class="form-row">
          <div class="form-field"><label for="email">Email*</label><input type="email" id="email" name="Email" required></div>
          <div class="form-field"><label for="phone">Phone*</label><input type="tel" id="phone" name="Phone" required></div>
        </div>
        <div class="form-field"><label for="city">City/Town*</label><input type="text" id="city" name="City/Town" required></div>

        <div class="form-field">
          <span class="group-label">Preferred Contact Method</span>
          <div class="checkbox-row">
            <label><input type="checkbox" name="Contact Method" value="Call"> Call</label>
            <label><input type="checkbox" name="Contact Method" value="Text"> Text</label>
            <label><input type="checkbox" name="Contact Method" value="Email"> Email</label>
          </div>
        </div>

        <div class="form-field">
          <label for="projectType">Project Type:*</label>
          <select id="projectType" name="Project Type" required>
            <option value="" disabled selected>Select Project Type</option>
            <option>Kitchen Renovation</option>
            <option>Bathroom Renovation</option>
            <option>Basement Finishing</option>
            <option>New Construction / Addition</option>
            <option>Flooring</option><option>Siding</option><option>Painting</option>
            <option>Framing</option><option>Roofing</option><option>Carpentry</option>
            <option>Other</option>
          </select>
        </div>

        <div class="form-field">
          <span class="group-label">Project Timeline*</span>
          <div class="radio-row">
            <label><input type="radio" name="Timeline" value="ASAP" required> ASAP</label>
            <label><input type="radio" name="Timeline" value="Within 1 Month"> Within 1 Month</label>
            <label><input type="radio" name="Timeline" value="1–3 Months"> 1–3 Months</label>
            <label><input type="radio" name="Timeline" value="3+ Months"> 3+ Months</label>
            <label><input type="radio" name="Timeline" value="Just Planning"> Just Planning</label>
          </div>
        </div>

        <div class="form-field">
          <span class="group-label">Estimated Budget</span>
          <div class="radio-row">
            <label><input type="radio" name="Budget" value="Under $10k"> Under $10k</label>
            <label><input type="radio" name="Budget" value="$10k–$25k"> $10k–$25k</label>
            <label><input type="radio" name="Budget" value="$25k–$50k"> $25k–$50k</label>
            <label><input type="radio" name="Budget" value="$50k+"> $50k+</label>
            <label><input type="radio" name="Budget" value="Not Sure Yet"> Not Sure Yet</label>
          </div>
        </div>

        <div class="form-field"><label for="details">Project Details</label><textarea id="details" name="Project Details" rows="4"></textarea></div>
        <div class="form-field"><label for="photos">Upload Photos of Your Space</label><input type="file" id="photos" name="photos" accept="image/*" multiple></div>

        <button type="submit" class="btn btn-primary btn-lg btn-block">GET FREE ESTIMATE</button>
        <p class="form-success" id="formSuccess">Thanks! Your request has been prepared — confirm sending in your email app. We'll get back to you within 24 hours.</p>
      </form>
    </div>
  </section>`;

  /* ---------- FOOTER ---------- */
  const footerHTML = `
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-col footer-brand">
        <img src="${prefix}assets/img/logo/logo-header.png" alt="SS Renovations Group" class="footer-logo">
        <p>Premium home renovations built around quality — bathrooms, kitchens, basements, additions and more across Central Massachusetts.</p>
      </div>
      <div class="footer-col">
        <h4>Services</h4>
        <ul>${services.map(s => `<li><a href="${prefix}${s.file}">${s.label}</a></li>`).join('')}</ul>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="${home}">Home</a></li>
          <li><a href="${home}#gallery">Gallery</a></li>
          <li><a href="${home}#reviews">Reviews</a></li>
          <li><a href="${home}#contact">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <ul>
          <li><a href="${PHONE_HREF}">${PHONE}</a></li>
          <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
          <li>Mon – Sat | 7AM – 6PM</li>
          <li>CSL #120109 · HIC #201338</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">© <span id="year"></span> SS Renovations Group. All rights reserved.</div>
    </div>
  </footer>

  <div class="lightbox" id="lightbox">
    <button class="lightbox-close" id="lightboxClose" aria-label="Close">&times;</button>
    <img src="" alt="" id="lightboxImg">
  </div>`;

  const put = (id, html) => { const el = document.getElementById(id); if (el) el.outerHTML = html; };
  put('site-header', headerHTML);
  put('site-contact', contactHTML);
  put('site-footer', footerHTML);

  window.__componentsReady = true;
  document.dispatchEvent(new Event('components:ready'));
})();
