(function () {
  'use strict';

  const TYPES = {
    primary:  { label: 'Primary Bathroom',        desc: 'Your main suite bath, usually the biggest', base: 16500 },
    standard: { label: 'Standard Full Bathroom',  desc: 'Hall or family bath with tub/shower',       base: 12500 },
    guest:    { label: 'Guest Bathroom',          desc: 'Full bath used by guests or kids',          base: 11500 },
    half:     { label: 'Half Bath / Powder Room', desc: 'Toilet and sink only, no tub or shower',    base: 6500 },
  };
  const SHOWERS = {
    walkin: { label: 'Walk-In Tile Shower',      desc: 'Custom tile shower, built and waterproofed' },
    combo:  { label: 'Tile Shower Over Tub',     desc: 'New tub with tiled shower walls' },
    unit:   { label: 'New Tub/Shower Unit',      desc: 'Fiberglass or acrylic unit, tile floor' },
    keep:   { label: 'Keep Existing Tub/Shower', desc: 'New tile floor, tub and shower stay' },
  };
  function tilePrice(type, shower) {
    if (type === 'half') return 2857;
    if (shower === 'walkin') return type === 'primary' ? 12857 : 4286;
    if (shower === 'combo') return type === 'primary' ? 7857 : 4286;
    return 2857;
  }
  function bathTileLines(sel, key) {
    const lines = [{ label: 'Tile Work', sub: SHOWERS[key].label, amount: tilePrice(sel[1], key) }];
    if (key === 'unit') lines.push({ label: 'Tub/Shower Unit', sub: 'Fiberglass or acrylic, installed', amount: 1800 });
    return lines;
  }
  const dictOptions = (dict) => Object.keys(dict).map(k => ({ key: k, ...dict[k] }));

  const scopeStep = () => ({
    name: 'Size of the job', title: 'How big is the job?', sub: 'This is the single biggest driver of the price.',
    options: [
      { key: 'full',     label: 'Full Remodel',     desc: 'Gut it and rebuild, new everything',          mult: 1.0 },
      { key: 'partial',  label: 'Partial Remodel',  desc: 'Keep the layout, replace the worn-out parts', mult: 0.72 },
      { key: 'cosmetic', label: 'Cosmetic Refresh', desc: 'Surfaces, fixtures and paint, no demolition', mult: 0.45 },
    ],
  });
  const finishStep = (good, better, best) => ({
    name: 'Finish level', title: 'Pick your finish level', sub: 'Materials and fixtures. You can mix levels later with our help.',
    options: [
      { key: 'good',   label: 'Good',   desc: good,   mult: 1.0 },
      { key: 'better', label: 'Better', desc: better, mult: 1.15 },
      { key: 'best',   label: 'Best',   desc: best,   mult: 1.32 },
    ],
  });
  const upgradesStep = () => ({ name: 'Upgrades', title: 'Any upgrades?', sub: "Tap everything you'd like included, or none. Then see your estimate.", multi: true });

  const PROJECTS = {
    bathroom: {
      title: 'Bathroom Remodel',
      steps: [
        { name: 'Bathroom type', title: 'Which bathroom are we remodeling?', sub: 'Pick the closest match. The exact size gets measured on the free visit.', options: dictOptions(TYPES) },
        scopeStep(),
        {
          name: 'Shower & tub',
          title: sel => (sel[1] === 'half' ? 'Shower & tub' : 'What happens with the shower and tub?'),
          sub: sel => (sel[1] === 'half'
            ? 'A powder room has no tub or shower, so this step is simple: new tile floor, toilet and vanity are covered by your other answers.'
            : 'Tile work is priced from our real tile crew rates, no padded allowances.'),
          configSkip: sel => sel[1] === 'half',
          options: sel => {
            if (sel[1] === 'half') return [{ key: 'keep', label: 'Floor Tile Only', desc: 'The right scope for a half bath', lineItems: s => bathTileLines(s, 'keep') }];
            return Object.keys(SHOWERS).map(k => ({ key: k, label: SHOWERS[k].label, desc: SHOWERS[k].desc, lineItems: s => bathTileLines(s, k) }));
          },
        },
        finishStep('Stock vanity, LVP or ceramic tile, chrome fixtures', 'Semi-custom vanity, porcelain tile, upgraded fixtures', 'Custom vanity, stone-look large-format tile, designer fixtures'),
        upgradesStep(),
      ],
      extras: [
        { id: 'heat',   label: 'Heated Floors',             desc: 'Electric radiant heat under the tile', price: 2400 },
        { id: 'glass',  label: 'Frameless Glass Door',      desc: 'Heavy glass shower enclosure', price: 1950 },
        { id: 'double', label: 'Double Vanity',             desc: 'Two sinks, extra storage', price: 2600 },
        { id: 'soak',   label: 'Freestanding Soaking Tub',  desc: 'Deep soaking tub with floor filler', price: 2800 },
        { id: 'accent', label: 'Tile Accent Wall',          desc: 'Feature wall in shower or behind vanity', price: 1500 },
        { id: 'grab',   label: 'Grab Bars & Accessibility', desc: 'Safety bars, handheld shower, comfort-height toilet', price: 650 },
        { id: 'light',  label: 'Lighting & Quiet Fan',      desc: 'Recessed lighting, sconces, humidity-sensing fan', price: 1100 },
      ],
    },

    kitchen: {
      title: 'Kitchen Remodel',
      steps: [
        { name: 'Kitchen size', title: 'How big is your kitchen?', sub: 'Pick the closest match. Exact measurements happen on the free visit.', options: [
          { key: 'small',  label: 'Small Kitchen',             desc: 'Galley or under ~100 sq ft', base: 19000 },
          { key: 'medium', label: 'Medium Kitchen',            desc: 'The typical family kitchen, ~100–200 sq ft', base: 29000 },
          { key: 'large',  label: 'Large / Open-Plan Kitchen', desc: 'Over ~200 sq ft, island layouts, open concept', base: 44000 },
        ] },
        scopeStep(),
        { name: 'Cabinets', title: 'What about the cabinets?', sub: 'Cabinets are the biggest single line in most kitchens. Pick your route.', options: [
          { key: 'reface', label: 'Keep & Reface Existing', desc: 'New doors, drawer fronts and hardware on your current boxes', add: 5200, lineLabel: 'Cabinets', showPrice: true },
          { key: 'stock',  label: 'Stock Cabinets',         desc: 'Ready-made cabinets in popular finishes', add: 8900, lineLabel: 'Cabinets', showPrice: true },
          { key: 'semi',   label: 'Semi-Custom Cabinets',   desc: 'More sizes, finishes and storage options', add: 14900, lineLabel: 'Cabinets', showPrice: true },
          { key: 'custom', label: 'Custom Cabinets',        desc: 'Built to fit your kitchen exactly', add: 23900, lineLabel: 'Cabinets', showPrice: true },
        ] },
        finishStep('Durable stock materials and standard fixtures', 'Upgraded materials and fixtures throughout', 'Premium materials, designer fixtures and hardware'),
        upgradesStep(),
      ],
      extras: [
        { id: 'backsplash', label: 'Tile Backsplash',              desc: 'Full-height tile behind counters and range', price: 2600 },
        { id: 'island',     label: 'Kitchen Island',               desc: 'New island with seating and storage', price: 7800 },
        { id: 'appliances', label: 'Appliance Package',            desc: 'Range, hood, dishwasher and refrigerator allowance', price: 9400 },
        { id: 'flooring',   label: 'New Flooring',                 desc: 'Hardwood or luxury vinyl plank through the kitchen', price: 5600 },
        { id: 'layout',     label: 'Layout Change',                desc: 'Move a wall, sink or range, new plumbing and electrical runs', price: 7200 },
        { id: 'pantry',     label: 'Walk-In Pantry',               desc: 'Framed pantry with shelving and lighting', price: 4800 },
        { id: 'lighting',   label: 'Lighting & Electrical Refresh', desc: 'Recessed lights, pendants, under-cabinet lighting', price: 2900 },
      ],
    },

    basement: {
      title: 'Basement Finishing',
      steps: [
        { name: 'Basement size', title: 'How big is the basement?', sub: 'Pick the closest match. We measure exactly on the free visit.', options: [
          { key: 'small',  label: 'Under 600 Sq Ft',  desc: 'Partial basement or a smaller footprint', base: 24000 },
          { key: 'medium', label: '600–1,000 Sq Ft',  desc: 'The typical full basement', base: 38000 },
          { key: 'large',  label: 'Over 1,000 Sq Ft', desc: 'Large footprint, room for multiple spaces', base: 54000 },
        ] },
        { name: 'Starting point', title: 'What are we starting from?', sub: "Finishing raw space costs more than refreshing a basement that's already finished.", options: [
          { key: 'unfinished', label: 'Finish From Unfinished',      desc: 'Framing, insulation, electrical, drywall: the full build', mult: 1.0 },
          { key: 'partial',    label: 'Partially Started',           desc: 'Some framing, insulation or rough-in already in place', mult: 0.82 },
          { key: 'refresh',    label: 'Refresh a Finished Basement', desc: 'New floors, paint, lighting and updates to an existing finish', mult: 0.5 },
        ] },
        { name: 'Rooms & bath', title: 'What goes down there?', sub: 'Bedrooms need egress and bathrooms need plumbing. Both move the price.', options: [
          { key: 'open',    label: 'Open Living Space',  desc: 'Family room / rec room, no new bedroom or bath', add: 0, lineLabel: 'Layout' },
          { key: 'bedroom', label: 'Add a Bedroom',      desc: 'Framed bedroom with egress window and closet', add: 7400, lineLabel: 'Layout', showPrice: true },
          { key: 'bath',    label: 'Add a Full Bathroom', desc: 'Bathroom with shower, roughed in and finished', add: 13900, lineLabel: 'Layout', showPrice: true },
          { key: 'suite',   label: 'Bedroom + Bathroom', desc: 'A full guest or in-law suite downstairs', add: 19900, lineLabel: 'Layout', showPrice: true },
        ] },
        finishStep('Durable LVP or carpet, standard lighting and fixtures', 'Upgraded flooring, recessed lighting and better fixtures', 'Premium finishes, custom built-ins and designer lighting'),
        upgradesStep(),
      ],
      extras: [
        { id: 'wetbar',     label: 'Wet Bar / Kitchenette',              desc: 'Cabinets, sink and mini-fridge rough-in', price: 9200 },
        { id: 'waterproof', label: 'Waterproofing & Sump Pump',          desc: 'Interior drainage and sump, done before finishing', price: 3900 },
        { id: 'theater',    label: 'Home Theater Setup',                 desc: 'Wiring, sound treatment and screen wall', price: 4200 },
        { id: 'flooringup', label: 'Upgraded Flooring',                  desc: 'Premium LVP or carpet with upgraded pad', price: 4800 },
        { id: 'sound',      label: 'Soundproofing & Insulation Upgrade', desc: 'Ceiling and wall sound control between floors', price: 3100 },
        { id: 'bulkhead',   label: 'Bulkhead / Walk-Out Entry Work',     desc: 'Repair or rebuild the exterior basement entry', price: 5400 },
        { id: 'fireplace',  label: 'Gas Fireplace Insert',               desc: 'Vented gas insert with surround', price: 5800 },
      ],
    },

    addition: {
      title: 'Home Addition',
      steps: [
        { name: 'Addition size', title: 'How big is the addition?', sub: 'Ballpark footprints. Exact size and structure are confirmed after the visit.', options: [
          { key: 'bumpout', label: 'Bump-Out',                   desc: 'Under ~200 sq ft, extend a kitchen, bath or bedroom', base: 58000 },
          { key: 'room',    label: 'Room Addition',              desc: '~200–400 sq ft, a new room off the back or side', base: 108000 },
          { key: 'large',   label: 'Large / Two-Story Addition', desc: '400+ sq ft, or a two-story build', base: 196000 },
        ] },
        { name: "What it's for", title: 'What will the new space be?', sub: 'A bathroom or kitchen inside the addition adds plumbing and finish work.', options: [
          { key: 'living',   label: 'Family Room / Living Space', desc: 'Open living space, no new plumbing', add: 0, lineLabel: 'Planned Use' },
          { key: 'suite',    label: 'Primary Suite',              desc: 'Bedroom plus a full bathroom inside the addition', add: 21400, lineLabel: 'Planned Use', showPrice: true },
          { key: 'kitchenx', label: 'Kitchen Extension',          desc: 'New space built out for a full kitchen', add: 24800, lineLabel: 'Planned Use', showPrice: true },
          { key: 'inlaw',    label: 'In-Law / Guest Suite',       desc: 'Bedroom, bathroom and kitchenette rough-ins', add: 26900, lineLabel: 'Planned Use', showPrice: true },
        ] },
        { name: 'Foundation', title: 'What does it sit on?', sub: 'Soil, frost line and whether you want space below decide this. We confirm on the visit.', options: [
          { key: 'slab',     label: 'Slab or Crawl Space',      desc: 'The standard foundation, included in the base price', add: 0, lineLabel: 'Foundation' },
          { key: 'crawl',    label: 'Conditioned Crawl Space',  desc: 'Sealed, insulated crawl space with storage access', add: 6900, lineLabel: 'Foundation', showPrice: true },
          { key: 'fullbase', label: 'Full Basement Foundation', desc: 'A whole new basement level under the addition', add: 29800, lineLabel: 'Foundation', showPrice: true },
        ] },
        finishStep('Materials matched to your home, standard fixtures', 'Upgraded materials and fixtures throughout', 'Premium materials and architectural details'),
        upgradesStep(),
      ],
      extras: [
        { id: 'hvac',      label: 'HVAC Extension / Mini-Split',  desc: 'Heating and cooling for the new space', price: 8400 },
        { id: 'vaulted',   label: 'Vaulted Ceiling',              desc: 'Raised, vaulted ceiling with beams', price: 9800 },
        { id: 'fireplace', label: 'Fireplace',                    desc: 'Gas fireplace with surround and mantel', price: 6200 },
        { id: 'windows',   label: 'Oversized Windows & Sliders',  desc: 'Extra glass and a slider to the yard', price: 5600 },
        { id: 'deck',      label: 'Deck or Patio',                desc: 'New deck or patio off the addition', price: 8900 },
        { id: 'heatfloor', label: 'Heated Floors',                desc: "Radiant heat in the addition's floors", price: 5400 },
        { id: 'stone',     label: 'Exterior Stone Accents',       desc: 'Stone veneer accents to blend with your home', price: 7600 },
      ],
    },
  };

  const $ = (id) => document.getElementById(id);
  const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const round100 = (n) => Math.round(n / 100) * 100;
  const optsOf = (step) => (typeof step.options === 'function' ? step.options(state.sel) : step.options);

  const params = new URLSearchParams(location.search);
  const initial = PROJECTS[params.get('project')] ? params.get('project') : 'bathroom';
  let state = { project: initial, step: 1, sel: {}, extras: {} };

  function getOpt(n) {
    const step = PROJECTS[state.project].steps[n - 1], key = state.sel[n];
    if (!key) return null;
    return optsOf(step).find(o => o.key === key) || null;
  }

  function compute() {
    const P = PROJECTS[state.project];
    if (!state.sel[1] || !state.sel[2]) return null;
    const o1 = getOpt(1), o2 = getOpt(2);
    const basePart = (o1.base || 0) * ((o2 && o2.mult) || 1);
    const lines = [{ label: o1.label, sub: o2 && o2.mult ? o2.label : '', amount: basePart }];
    let subtotal = basePart;
    [2, 3].forEach(sn => {
      const o = getOpt(sn);
      if (!o) return;
      if (o.lineItems) {
        o.lineItems(state.sel).forEach(li => { lines.push(li); subtotal += li.amount; });
      } else if (o.add) {
        lines.push({ label: o.lineLabel || P.steps[sn - 1].name, sub: o.label, amount: o.add, prefix: '+' });
        subtotal += o.add;
      }
    });
    let total = subtotal;
    const fo = getOpt(4);
    if (fo && fo.mult && fo.mult !== 1) {
      total = subtotal * fo.mult;
      lines.push({ label: 'Finish Level', sub: fo.label + ' materials & fixtures', amount: total - subtotal, prefix: '+' });
    }
    const extrasList = P.extras.filter(x => state.extras[x.id]);
    extrasList.forEach(x => { lines.push({ label: x.label, amount: x.price, prefix: '+' }); total += x.price; });
    return { lines, total, low: round100(total * 0.93), high: round100(total * 1.07), extrasList };
  }

  function renderSummary() {
    const body = $('estSummaryBody');
    const live = compute();
    $('estLive').innerHTML = live ? 'Estimated range <b>' + money(live.low) + ' – ' + money(live.high) + '</b>' : '';
    if (!state.sel[1]) {
      body.innerHTML = '<p class="est-empty">Your ballpark range builds here as you answer, every part itemized, nothing hidden.</p>';
      return;
    }
    const c = compute();
    if (!c) {
      body.innerHTML = '<p class="est-empty"><b>' + getOpt(1).label + '</b> selected. Answer the next question and your itemized range appears here.</p>';
      return;
    }
    const rows = c.lines.map(li =>
      '<div class="est-row"><span class="k">' + li.label + (li.sub ? '<small>' + li.sub + '</small>' : '') +
      '</span><span class="v">' + (li.prefix || '') + money(li.amount) + '</span></div>').join('');
    body.innerHTML =
      '<p class="est-range"><small>Estimated Range</small>' + money(c.low) + ' – ' + money(c.high) + '</p>' +
      '<div class="est-lines">' + rows +
      '<div class="est-row total"><span class="k">Ballpark Total</span><span class="v">' + money(c.total) + '</span></div></div>';
  }

  function optButton(key, label, desc, price, multi) {
    const on = multi ? !!state.extras[key] : state.sel[state.step] === key;
    return '<button type="button" class="est-opt" role="' + (multi ? 'checkbox' : 'radio') + '" aria-checked="' + on + '" data-key="' + key + '">' +
      '<span class="' + (multi ? 'box' : 'dot') + '" aria-hidden="true"></span>' +
      '<span><span class="ot">' + label + '</span><span class="od">' + desc + '</span></span>' +
      (price ? '<span class="op">+' + money(price) + '</span>' : '') + '</button>';
  }

  function renderStep() {
    const P = PROJECTS[state.project], s = state.step, step = P.steps[s - 1];
    $('estStepLabel').textContent = 'Step ' + s + ' of 5';
    $('estStepName').textContent = step.name;
    $('estProgress').style.width = (s * 20) + '%';
    $('estBack').disabled = s === 1;
    $('estNext').hidden = s !== 5;
    const title = typeof step.title === 'function' ? step.title(state.sel) : step.title;
    const sub = typeof step.sub === 'function' ? step.sub(state.sel) : step.sub;
    let html = '<h3 class="est-q">' + title + '</h3><p class="est-qsub">' + sub + '</p>';
    if (step.multi) {
      html += '<div class="est-opts" role="group" aria-label="' + step.name + '">' +
        P.extras.map(x => optButton(x.id, x.label, x.desc, x.price, true)).join('') + '</div>';
    } else {
      html += '<div class="est-opts" role="radiogroup" aria-label="' + step.name + '">' +
        optsOf(step).map(o => optButton(o.key, o.label, o.desc, o.showPrice && o.add ? o.add : null, false)).join('') + '</div>';
    }
    $('estStepBody').innerHTML = html;

    $('estStepBody').querySelectorAll('.est-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        if (step.multi) {
          state.extras[key] = !state.extras[key];
          btn.setAttribute('aria-checked', state.extras[key] ? 'true' : 'false');
          renderSummary();
          return;
        }
        state.sel[s] = key;
        if (state.project === 'bathroom' && s === 1 && key === 'half') state.sel[3] = 'keep';
        if (state.step < 5) state.step++;
        renderStep();
      });
    });
    renderSummary();
  }

  function configParts() {
    const P = PROJECTS[state.project], parts = [];
    for (let sn = 1; sn <= 4; sn++) {
      const st = P.steps[sn - 1];
      if (st.configSkip && st.configSkip(state.sel)) continue;
      const o = getOpt(sn);
      if (o) parts.push({ name: st.name, label: o.label });
    }
    return parts;
  }

  const scrollToCalc = () => document.querySelector('.est-tabs').scrollIntoView({ behavior: 'smooth', block: 'start' });

  function showResult() {
    if (!state.sel[4]) state.sel[4] = optsOf(PROJECTS[state.project].steps[3])[0].key;
    const c = compute();
    $('estFlow').hidden = true;
    $('estResult').hidden = false;
    $('estResultRange').textContent = money(c.low) + ' – ' + money(c.high);
    const parts = configParts().map((p, i) => (i === 3 ? p.label + ' finishes' : p.label));
    if (c.extrasList.length) parts.push(c.extrasList.length + ' upgrade' + (c.extrasList.length > 1 ? 's' : ''));
    $('estResultConfig').textContent = parts.join(' · ');
    renderSummary();
    scrollToCalc();
  }

  function resetResult() {
    $('estResult').hidden = true;
    $('estFlow').hidden = false;
    $('estLeadForm').hidden = false;
    $('estSuccess').hidden = true;
    $('estMsg').classList.remove('show', 'error');
  }

  function setProject(p) {
    state = { project: p, step: 1, sel: {}, extras: {} };
    document.querySelectorAll('.est-tab').forEach(t => t.setAttribute('aria-pressed', t.dataset.project === p ? 'true' : 'false'));
    resetResult();
    renderStep();
  }

  $('estBack').addEventListener('click', () => { if (state.step > 1) { state.step--; renderStep(); } });
  $('estNext').addEventListener('click', showResult);
  $('estRestart').addEventListener('click', () => { setProject(state.project); scrollToCalc(); });
  document.querySelectorAll('.est-tab').forEach(t => t.addEventListener('click', () => {
    if (t.dataset.project !== state.project) { setProject(t.dataset.project); scrollToCalc(); }
  }));

  const form = $('estLeadForm');
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const name = $('estName').value.trim();
    const phone = $('estPhone').value.replace(/\D/g, '');
    const town = $('estTown').value.trim();
    let ok = true;
    const mark = (id, valid) => { $(id).classList.toggle('invalid', !valid); if (!valid) ok = false; };
    mark('estFName', name.length >= 2);
    mark('estFPhone', phone.length >= 10);
    mark('estFTown', town.length >= 2);
    if (!ok) return;

    const P = PROJECTS[state.project];
    const c = compute();
    const data = new FormData(form);
    data.set('subject', 'Instant Estimate Request, ' + P.title + ' (' + town + ')');
    data.set('replyto', $('estEmail').value.trim());
    data.set('Project', P.title);
    configParts().forEach(p => data.set(p.name, p.label));
    data.set('Upgrades', c.extrasList.length ? c.extrasList.map(x => x.label).join(', ') : 'none');
    data.set('Ballpark shown to customer', money(c.low) + ' – ' + money(c.high));

    const btn = form.querySelector('button[type=submit]');
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';
    const msg = $('estMsg');
    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
      const out = await res.json();
      if (!out.success) throw new Error(out.message || 'failed');
      $('estSuccessTitle').textContent = 'Thank you, ' + name.split(' ')[0] + '!';
      form.hidden = true;
      $('estSuccess').hidden = false;
      form.reset();
    } catch (err) {
      msg.textContent = 'Something went wrong. Please call us at (978) 201-4112 and mention your ballpark range.';
      msg.classList.add('show', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  });
  ['estName', 'estPhone', 'estTown'].forEach(id =>
    $(id).addEventListener('input', function () { this.closest('.form-field').classList.remove('invalid'); }));

  setProject(initial);
})();
