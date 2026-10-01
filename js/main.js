(() => {
  const root = document.documentElement;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} },
  };
  const darkQuery = matchMedia('(prefers-color-scheme: dark)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  // ---------- Intro: typed headline, bookkeeping workflow, difference counting down to 0.00 ----------
  (() => {
    const intro = document.getElementById('intro');
    if (!intro || !root.classList.contains('has-intro')) { if (intro) intro.remove(); return; }
    try { sessionStorage.setItem('introSeen', '1'); } catch (e) {}

    const title = intro.querySelector('.intro-title');
    const typed = intro.querySelector('.intro-typed');
    const fill = intro.querySelector('.flow-fill');
    const steps = [...intro.querySelectorAll('.flow-step')];
    const diff = intro.querySelector('.intro-diff b');
    const status = intro.querySelector('.intro-status-text');
    const TEXT = 'Clean books, on-time VAT, numbers you can trust.';
    const START_DIFF = 2415.75;
    const money = n => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    let raf = 0, finished = false;

    function end(skip) {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout); cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey, true);
      const cleanup = () => { intro.remove(); root.classList.remove('has-intro'); };
      if (skip) { cleanup(); return; }
      // glide the typed headline onto the real hero headline, then fade the overlay away
      const h1 = document.getElementById('hero-title');
      if (h1 && window.scrollY < 40) {
        const a = title.getBoundingClientRect(), b = h1.getBoundingClientRect();
        const scale = parseFloat(getComputedStyle(h1).fontSize) / parseFloat(getComputedStyle(title).fontSize);
        title.style.transition = 'transform .8s cubic-bezier(.6,0,.2,1)';
        title.style.transform = `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(${scale})`;
      }
      intro.classList.add('leaving');
      setTimeout(cleanup, 950);
    }
    const onKey = e => { if (e.key !== 'Tab') end(true); };
    intro.addEventListener('click', () => end(true));
    document.addEventListener('keydown', onKey, true);

    // 1) type the headline
    [...TEXT].forEach((_, i) => at(250 + i * 28, () => { typed.textContent = TEXT.slice(0, i + 1); }));

    // 2) run the workflow: each step ticks as the line reaches it
    const T0 = 1150, STEP = 600;
    at(T0, () => steps[0].classList.add('done'));
    for (let k = 1; k < steps.length; k++) {
      at(T0 + k * STEP - 500, () => { fill.style.setProperty('--fill', (k / (steps.length - 1) * 100) + '%'); });
      at(T0 + k * STEP, () => steps[k].classList.add('done'));
    }

    // 3) unreconciled difference counts down to 0.00 alongside the workflow
    const C0 = T0, C1 = T0 + (steps.length - 1) * STEP;
    at(C0, () => {
      const t0 = performance.now();
      const tick = now => {
        const p = Math.min(1, (now - t0) / (C1 - C0));
        diff.textContent = money(START_DIFF * Math.pow(1 - p, 2));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });

    // 4) balanced, then hand over to the site
    at(C1 + 150, () => { diff.textContent = '0.00'; status.textContent = '✓ Books balanced'; intro.classList.add('balanced'); });
    at(C1 + 950, () => end(false));
  })();

  // Footer years
  const year = new Date().getFullYear();
  document.querySelectorAll('#year, .year').forEach(el => { el.textContent = year; });

  // ---------- Theme: light / dark / system ----------
  const themeBtn = document.getElementById('themeBtn');
  const themeBtns = document.querySelectorAll('[data-theme-set]');
  const metaThemes = document.querySelectorAll('meta[name="theme-color"]');

  const effectiveTheme = () => root.dataset.theme || (darkQuery.matches ? 'dark' : 'light');

  function applyTheme(choice) {
    if (choice === 'system') { delete root.dataset.theme; store.del('theme'); }
    else { root.dataset.theme = choice; store.set('theme', choice); }
    syncThemeUI();
  }
  function syncThemeUI() {
    const current = effectiveTheme();
    const choice = root.dataset.theme || 'system';
    themeBtn.setAttribute('aria-label', current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    themeBtns.forEach(b => b.setAttribute('aria-pressed', b.dataset.themeSet === choice));
    // Keep the mobile browser bar in sync with the chosen theme
    metaThemes.forEach(m => {
      if (root.dataset.theme) m.setAttribute('content', current === 'dark' ? '#050505' : '#F4F6FB');
      else m.setAttribute('content', m.media.includes('dark') ? '#050505' : '#F4F6FB');
    });
  }
  themeBtn.addEventListener('click', () => applyTheme(effectiveTheme() === 'dark' ? 'light' : 'dark'));
  themeBtns.forEach(b => b.addEventListener('click', () => applyTheme(b.dataset.themeSet)));
  darkQuery.addEventListener('change', syncThemeUI);
  syncThemeUI();

  // ---------- Mobile drawer ----------
  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.getElementById('menuBtn');
  const closeBtn = document.getElementById('closeBtn');
  const backdrop = document.getElementById('backdrop');
  const mobileQuery = matchMedia('(max-width: 900px)');

  function setDrawer(open, returnFocus = true) {
    sidebar.classList.toggle('open', open);
    backdrop.hidden = !open;
    document.body.classList.toggle('no-scroll', open);
    menuBtn.setAttribute('aria-expanded', open);
    if (open) setTimeout(() => closeBtn.focus(), 60);
    else if (returnFocus && mobileQuery.matches) menuBtn.focus();
  }
  menuBtn.addEventListener('click', () => setDrawer(true));
  closeBtn.addEventListener('click', () => setDrawer(false));
  backdrop.addEventListener('click', () => setDrawer(false));
  sidebar.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
    if (mobileQuery.matches) setDrawer(false, false);
  }));
  mobileQuery.addEventListener('change', () => setDrawer(false, false));

  // ---------- Views: sidebar links show one section at a time ----------
  // The <head> script sets html[data-view] from the URL hash; this adds scroll, focus, title and nav state.
  const links = [...document.querySelectorAll('.nav-link')];
  const BASE_TITLE = document.title;
  const VIEW_TITLES = { projects: 'Projects', services: 'Services', about: 'About', contact: 'Contact' };
  const goTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  function syncView(moveFocus) {
    const view = root.dataset.view || 'home';
    links.forEach(l => {
      if (l.getAttribute('href') === '#' + view) l.setAttribute('aria-current', 'page');
      else l.removeAttribute('aria-current');
    });
    document.title = VIEW_TITLES[view] ? `${VIEW_TITLES[view]} | Kelvin Dienzo` : BASE_TITLE;

    // Top of the view, or the sub-section the link points at (e.g. #credentials inside About)
    const id = location.hash.slice(1);
    const target = id && id !== view ? document.getElementById(id) : null;
    if (target && target.closest('.view')) target.scrollIntoView({ behavior: 'instant', block: 'start' });
    else goTop();

    if (moveFocus) {
      const box = document.querySelector(`.view[data-view="${view}"]`);
      const heading = box && box.querySelector('h1, h2');
      if (heading) { heading.classList.add('view-title'); heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
    }
  }
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    const el = id && document.getElementById(id);
    if (!id || (el && el.closest('.view'))) syncView(true);   // ignore #main and other non-view anchors
  });
  // Handle in-page links ourselves so the browser's own (smooth) jump doesn't fight the view switch
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const id = a.getAttribute('href').slice(1);
    const el = id && document.getElementById(id);
    const box = el && el.closest('.view');
    if (!box) return;                                   // e.g. the skip link: leave it to the browser
    e.preventDefault();
    if (location.hash !== '#' + id) history.pushState(null, '', '#' + id);
    root.dataset.view = box.dataset.view;
    syncView(true);
  });
  syncView(false);

  // ---------- Tools strip: rotating sets with a staggered fade-up ----------
  // Shows N tools at a time (N fits the strip: 6, 4, 3 or 2), swaps sets every 4s.
  // All 12 stay in the list for screen readers; "Reduce motion" shows them all, still.
  (() => {
    const track = document.querySelector('.tools-track');
    const list = track.querySelector('.tools-list');
    const tools = [...list.children];
    const FLIP = list.dataset.effect === 'flip';  // flip tiles need room for their own padding
    const MIN_CELL = FLIP ? 300 : 215;            // px a tool needs to read comfortably
    let size = 6, setIdx = 0, timer = null, hovering = false;

    const motionOff = () => root.dataset.motion === 'off' || reducedMotion.matches;
    const sets = () => Math.ceil(tools.length / size);
    const inSet = (t, s) => Math.floor(tools.indexOf(t) / size) === s;

    function layout() {
      if (motionOff()) { list.classList.remove('is-rotating', 'is-compact'); tools.forEach(t => t.classList.remove('is-in', 'is-out')); return; }
      const scale = parseFloat(getComputedStyle(root).fontSize) / 18;   // bigger text needs wider cells
      const fit = Math.floor(track.clientWidth / (MIN_CELL * scale));
      size = [6, 4, 3, 2].find(n => n <= fit) || 2;
      list.style.setProperty('--cols', size);
      list.classList.add('is-rotating');
      list.classList.toggle('is-compact', size <= 2);
      tools.forEach((t, k) => {
        const i = k % size;
        t.style.setProperty('--col', i + 1);
        t.style.setProperty('--i', i);
        t.classList.toggle('is-last', i === size - 1);
      });
      setIdx = setIdx % sets();
      tools.forEach(t => { t.classList.add('no-anim'); t.classList.toggle('is-in', inSet(t, setIdx)); t.classList.remove('is-out'); });
      void list.offsetWidth;                     // apply instantly, then re-enable transitions
      tools.forEach(t => t.classList.remove('no-anim'));
    }

    function next() {
      if (motionOff() || hovering || document.hidden) return;
      const nextIdx = (setIdx + 1) % sets();
      tools.forEach(t => {
        if (inSet(t, setIdx)) { t.classList.remove('is-in'); t.classList.add('is-out'); }
        else if (inSet(t, nextIdx)) { t.classList.add('no-anim'); t.classList.remove('is-out'); }
      });
      void list.offsetWidth;                     // incoming set starts below, then rises in
      tools.forEach(t => { if (inSet(t, nextIdx)) { t.classList.remove('no-anim'); t.classList.add('is-in'); } });
      setIdx = nextIdx;
    }

    track.addEventListener('mouseenter', () => { hovering = true; });
    track.addEventListener('mouseleave', () => { hovering = false; });
    track.addEventListener('focusin', () => { hovering = true; });
    track.addEventListener('focusout', () => { hovering = false; });
    new ResizeObserver(layout).observe(track);
    new MutationObserver(layout).observe(root, { attributes: true, attributeFilter: ['data-motion', 'data-text'] });
    reducedMotion.addEventListener('change', layout);
    layout();
    timer = setInterval(next, FLIP ? 3800 : 4000);
  })();

  // ---------- Projects card: vertical scroll of project screens (duplicate for a seamless loop) ----------
  const vstack = document.querySelector('.vstack');
  if (vstack) vstack.appendChild(vstack.querySelector('.vtrack').cloneNode(true));

  // ---------- Accessibility options ----------
  const a11yBtn = document.getElementById('a11yBtn');
  const a11yPanel = document.getElementById('a11yPanel');
  const sizeBtns = a11yPanel.querySelectorAll('[data-size]');
  const toggles = a11yPanel.querySelectorAll('.toggle[data-pref]');

  function setPanel(open) {
    a11yPanel.hidden = !open;
    a11yBtn.setAttribute('aria-expanded', open);
  }
  a11yBtn.addEventListener('click', () => setPanel(a11yPanel.hidden));
  document.getElementById('a11yClose').addEventListener('click', () => { setPanel(false); a11yBtn.focus(); });
  document.addEventListener('click', e => { if (!e.target.closest('.a11y')) setPanel(false); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!a11yPanel.hidden) { setPanel(false); a11yBtn.focus(); }
    if (sidebar.classList.contains('open')) setDrawer(false);
  });

  function applySize(size) {
    if (size === 'normal') delete root.dataset.text; else root.dataset.text = size;
    sizeBtns.forEach(b => b.setAttribute('aria-pressed', b.dataset.size === size));
    store.set('textSize', size);
  }
  sizeBtns.forEach(b => b.addEventListener('click', () => applySize(b.dataset.size)));
  sizeBtns.forEach(b => b.setAttribute('aria-pressed', b.dataset.size === (root.dataset.text || 'normal')));

  // On/off switches: each maps to a data attribute on <html> and a saved preference
  const PREFS = {
    contrast:  { attr: 'contrast',  on: 'high', off: 'normal' },
    motion:    { attr: 'motion',    on: 'off',  off: 'on' },
    underline: { attr: 'underline', on: 'on',   off: 'off' },
  };
  function setPref(name, enabled) {
    const p = PREFS[name];
    if (enabled) root.dataset[p.attr] = p.on; else delete root.dataset[p.attr];
    store.set(name, enabled ? p.on : p.off);
    toggles.forEach(t => { if (t.dataset.pref === name) t.setAttribute('aria-checked', enabled); });
  }
  toggles.forEach(t => {
    const p = PREFS[t.dataset.pref];
    t.setAttribute('aria-checked', root.dataset[p.attr] === p.on);
    t.addEventListener('click', () => setPref(t.dataset.pref, t.getAttribute('aria-checked') !== 'true'));
  });

  document.getElementById('a11yReset').addEventListener('click', () => {
    applySize('normal');
    applyTheme('system');
    Object.keys(PREFS).forEach(name => { setPref(name, false); store.del(name); });
    store.del('textSize');
  });

  // ---------- Project case studies in pop-up dialogs ----------
  let lastOpener = null;
  document.querySelectorAll('[data-open]').forEach(btn => btn.addEventListener('click', () => {
    const dlg = document.getElementById(btn.dataset.open);
    if (!dlg) return;
    lastOpener = btn;
    dlg.showModal();
    document.documentElement.classList.add('dialog-open');
    dlg.querySelector('.dialog-close').focus();
  }));
  document.querySelectorAll('.project-dialog').forEach(dlg => {
    dlg.querySelector('[data-close]').addEventListener('click', () => dlg.close());
    // click on the dimmed backdrop (outside the panel) closes it
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', () => {
      document.documentElement.classList.remove('dialog-open');
      if (lastOpener) lastOpener.focus();
    });
  });

  // ---------- Contact form: validate, then open the visitor's email app ----------
  const CONTACT_EMAIL = 'kelvsbookkeeping@gmail.com';
  const form = document.getElementById('contactForm');
  const formError = document.getElementById('formError');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let firstBad = null;
    form.querySelectorAll('input, textarea').forEach(f => {
      const ok = f.checkValidity() && f.value.trim() !== '';
      f.setAttribute('aria-invalid', !ok);
      if (!ok && !firstBad) firstBad = f;
    });
    formError.hidden = !firstBad;
    if (firstBad) { firstBad.focus(); return; }
    const data = new FormData(form);
    const subject = encodeURIComponent(`Bookkeeping inquiry from ${data.get('name')}`);
    const body = encodeURIComponent(`${data.get('message')}\n\n${data.get('name')}\n${data.get('email')}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  });
})();
