(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Language ---------- */
  let lang = 'it';
  try { lang = localStorage.getItem('lang') || lang; } catch {}
  const t = (o) => (o && (o[lang] ?? o.it)) || '';

  function setLang(next) {
    lang = next;
    try { localStorage.setItem('lang', lang); } catch {}
    document.documentElement.lang = lang;
    for (const el of $$('[data-it]')) el.innerHTML = el.dataset[lang] ?? el.dataset.it;
    for (const b of $$('.lang button')) b.classList.toggle('is-on', b.dataset.lang === lang);
    renderTabs(); renderMenu(); renderFixed(); renderOpen();
    document.dispatchEvent(new Event('langchange'));
  }
  for (const b of $$('.lang button')) b.addEventListener('click', () => setLang(b.dataset.lang));

  /* ---------- Menu ---------- */
  let active = window.MENU[0].id;
  const price = (p) => {
    if (p == null) return '—';
    if (typeof p === 'string') return p;
    return '€ ' + (Number.isInteger(p) ? p : p.toFixed(2).replace('.', lang === 'it' ? ',' : '.'));
  };

  function renderTabs() {
    $('#tabs').innerHTML = window.MENU.map((c) =>
      `<button class="tab${c.id === active ? ' is-on' : ''}" role="tab" aria-selected="${c.id === active}" data-id="${c.id}">${t(c)}</button>`).join('');
  }
  function pick(id) {
    if (!id || id === active) return;
    active = id;
    renderTabs(); renderMenu();
    // On phones the tabs are a sticky sideways strip: keep the chosen one in view and return to the top of the list.
    const on = $('#tabs .tab.is-on');
    $('#tabs').scrollTo({ left: on.offsetLeft - 20, behavior: 'smooth' });
    const top = $('#menuList').getBoundingClientRect().top, bar = $('#nav').offsetHeight + $('#tabs').offsetHeight + 14;
    if (top < bar) scrollBy({ top: top - bar, behavior: 'smooth' });
  }
  $('#tabs').addEventListener('click', (e) => pick(e.target.closest('.tab')?.dataset.id));
  // Swipe left / right across the dishes to move to the next or previous category.
  let mx = 0, my = 0;
  $('#menuList').addEventListener('touchstart', (e) => { mx = e.touches[0].clientX; my = e.touches[0].clientY; }, { passive: true });
  $('#menuList').addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - mx, dy = e.changedTouches[0].clientY - my;
    if (Math.abs(dx) < 64 || Math.abs(dx) < Math.abs(dy) * 1.8) return;
    const i = window.MENU.findIndex((c) => c.id === active) + (dx < 0 ? 1 : -1);
    if (window.MENU[i]) pick(window.MENU[i].id);
  }, { passive: true });

  function renderMenu() {
    const cat = window.MENU.find((c) => c.id === active);
    const note = cat.note ? `<p class="menu__note">${t(cat.note)}</p>` : '';
    $('#menuList').innerHTML = note + cat.items.map((d, i) => {
      const name = lang === 'en' && d.en ? d.en : d.it;
      const desc = lang === 'en' ? (d.dEn || '') : (d.dIt || '');
      return `<article class="dish" style="--i:${i}">
        ${d.tag ? `<span class="dish__tag">${t(d.tag)}</span>` : ''}
        <div class="dish__row"><span class="dish__name">${name}</span>${d.price === '' ? '' : `<span class="dish__dots"></span><span class="dish__price">${price(d.price)}</span>`}</div>
        ${desc ? `<p class="dish__desc">${desc}</p>` : ''}
      </article>`;
    }).join('');
  }

  function renderFixed() {
    const f = window.FIXED_MENU;
    if (!f) return;
    $('#fixedMenu').innerHTML = `
      <div class="fixed__kicker">${t(f.sub)}</div>
      <h3 class="fixed__title">${t(f.title)}</h3>
      <div class="fixed__price"><small>€</small>${f.price}</div>
      <dl>${f.courses.map((c) => `<dt>${t(c.k)}</dt><dd>${t(c.v)}</dd>`).join('')}</dl>
      <p class="fixed__foot">${t(f.foot)}</p>`;
  }

  /* ---------- Open now (restaurant's own time zone; hours come from site.json via site-data.js) ---------- */
  function renderOpen() {
    const el = $('#openNow');
    try {
      const S = window.SITE;
      const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: S.tz, weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
        .formatToParts(new Date()).map((x) => [x.type, x.value]));
      const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
      const mins = (+p.hour % 24) * 60 + +p.minute;
      const m = (t) => { const [h, mm] = t.split(':').map(Number); return h * 60 + mm; };
      // A range that closes at or before it opens runs past midnight, so yesterday's late ranges count too.
      const today = S.hours[day].some(([o, c]) => (m(c) > m(o) ? mins >= m(o) && mins < m(c) : mins >= m(o)));
      const late = S.hours[(day + 6) % 7].some(([o, c]) => m(c) <= m(o) && mins < m(c));
      const open = today || late;
      el.textContent = open ? (lang === 'it' ? 'Aperto ora' : 'Open now') : (lang === 'it' ? 'Chiuso ora' : 'Closed now');
      el.classList.toggle('is-closed', !open);
    } catch { el.textContent = ''; }
  }

  /* ---------- Sliding background ---------- */
  const slides = $$('.bg__slide');
  const dots = $('#bgDots');
  const HOLD = 6500;
  let cur = -1, timer;
  dots.innerHTML = slides.map((_, i) => `<button aria-label="Foto ${i + 1}" data-i="${i}"></button>`).join('');
  dots.style.setProperty('--dur', HOLD + 'ms');

  // Phones get smaller, portrait-cropped files; each photo is fetched just before it is needed.
  const mq = matchMedia('(max-width: 640px)');
  let phone = mq.matches;
  const src = (s) => `assets/img/bg-${s.dataset.img}${phone ? '-m' : ''}.webp`;
  const load = (s) => { if (!s.style.getPropertyValue('--img')) s.style.setProperty('--img', `url('${src(s)}')`); };
  // Rotating a tablet or resizing the window swaps the already-loaded photos to the right size.
  mq.addEventListener('change', (e) => {
    phone = e.matches;
    for (const s of slides) if (s.style.getPropertyValue('--img')) s.style.setProperty('--img', `url('${src(s)}')`);
  });

  function show(i) {
    const prev = slides[cur];
    const next = slides[i];
    if (prev === next) return;
    load(next);
    const after = slides[(i + 1) % slides.length];
    setTimeout(() => { new Image().src = src(after); load(after); }, 1800);
    // Park every idle slide off to the right, without animating it across the screen.
    for (const s of slides) {
      if (s === prev || s === next) continue;
      s.classList.add('no-anim'); s.classList.remove('is-active', 'is-leaving');
    }
    next.classList.add('no-anim'); next.classList.remove('is-leaving');
    void next.offsetWidth;
    for (const s of slides) s.classList.remove('no-anim');
    if (prev) { prev.classList.remove('is-active'); prev.classList.add('is-leaving'); }
    next.classList.add('is-active');
    cur = i;
    $$('button', dots).forEach((b, k) => b.classList.toggle('is-on', k === i));
    $('#bgCount').textContent = `${String(i + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  }
  function play() {
    clearInterval(timer);
    // The gallery stage hides the background completely, so the photos wait while it is on screen.
    timer = setInterval(() => { if (!document.body.classList.contains('is-gallery')) show((cur + 1) % slides.length); }, HOLD);
  }
  dots.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { show(+b.dataset.i); play(); } });
  document.addEventListener('visibilitychange', () => (document.hidden ? clearInterval(timer) : play()));

  // Swipe left / right on the hero to change photo.
  const hero = $('.hero');
  let sx = 0, sy = 0;
  hero.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  hero.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    show((cur + (dx < 0 ? 1 : slides.length - 1)) % slides.length); play();
  }, { passive: true });

  // Portrait screens open on the photo chosen for them in site.json (slides -> phoneFirst); wide screens on the first.
  show(phone && matchMedia('(orientation: portrait)').matches ? (window.SITE.phoneFirst || 0) : 0); play();

  /* ---------- Hero film: a video file of your own, set as HERO_VIDEO in menu-data.js. It plays muted and looping. ---------- */
  if (window.HERO_VIDEO) {
    const video = $('#heroVideo');
    // Phones get the lighter file when there is one.
    const file = (phone && window.HERO_VIDEO_PHONE) || window.HERO_VIDEO;
    video.addEventListener('canplay', () => { $('.hero').classList.add('has-video'); video.play().catch(() => {}); }, { once: true });
    video.src = file; video.load();
    // It only runs while the hero is on screen.
    if ('IntersectionObserver' in window) new IntersectionObserver((es) => { es[0].isIntersecting ? video.play().catch(() => {}) : video.pause(); }, { threshold: .1 }).observe($('.hero'));
  }

  /* ---------- Nav ---------- */
  const nav = $('#nav'), burger = $('#burger'), links = $('#navLinks');
  const tint = $('meta[name="theme-color"]'), tintTop = tint.content;
  const onScroll = () => {
    const stuck = scrollY > 40;
    if (stuck === nav.classList.contains('is-stuck')) return;
    nav.classList.toggle('is-stuck', stuck);
    tint.content = stuck ? (window.SITE.barColor || tintTop) : tintTop;   // the phone's browser bar follows the page's own bar
    setTimeout(navH, 560);   // the bar shrinks over half a second when it sticks
  };
  // The sticky menu tabs sit exactly under the bar, whatever its height.
  const navH = () => document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
  addEventListener('scroll', onScroll, { passive: true }); onScroll(); navH();
  addEventListener('resize', navH);
  if ('ResizeObserver' in window) new ResizeObserver(navH).observe(nav);
  const closeNav = () => { links.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); };
  const closeNavFull = () => { closeNav(); document.body.classList.remove('is-locked'); };
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-locked', open);
  });
  addEventListener('keydown', (e) => e.key === 'Escape' && closeNavFull());
  links.addEventListener('click', (e) => e.target.closest('a') && closeNavFull());

  /* ---------- Review strip: duplicate the track once so the loop is seamless ---------- */
  for (const track of $$('.quotes__track')) {
    for (const node of [...track.children]) { const c = node.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c); }
  }

  /* ---------- Gallery cover flow: glides to the next photo on its own; drag, swipe, tap a photo or use the arrows ---------- */
  const ring = $('#ring');
  if (ring) {
    const cards = $$('.ring__card', ring), n = cards.length;
    const cap = $('#ringCap'), count = $('#ringCount');
    const REST = 2600;                    // how long a photo stays in the middle before the next one glides in
    let pos = 0, vel = 0, target = null, drag = null, next = performance.now() + REST, onScreen = false, last = performance.now(), shown = -1;
    const wrap = (p) => { p = ((p % n) + n) % n; return p > n / 2 ? p - n : p; };   // shortest way round, in photos
    const goTo = (i) => { target = pos + wrap(i - pos); };
    const nudge = (dir) => { target = Math.round(target ?? pos) + dir; };
    $('#ringPrev').addEventListener('click', () => nudge(-1));
    $('#ringNext').addEventListener('click', () => nudge(1));

    ring.addEventListener('pointerdown', (e) => {
      drag = { x: e.clientX, pos, lastX: e.clientX, lastT: performance.now(), v: 0, moved: 0 };
      target = null; ring.setPointerCapture(e.pointerId); ring.classList.add('is-dragging');
    });
    ring.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const perPx = 1 / (w * .66);   // dragging by the gap between two photos moves on by one
      const now = performance.now();
      pos = drag.pos - (e.clientX - drag.x) * perPx;
      drag.v = (-(e.clientX - drag.lastX) * perPx) / Math.max(1, now - drag.lastT) * 1000;
      drag.moved = Math.max(drag.moved, Math.abs(e.clientX - drag.x));
      drag.lastX = e.clientX; drag.lastT = now;
    });
    const release = (e) => {
      if (!drag) return;
      ring.classList.remove('is-dragging');
      const tapped = drag.moved < 6 && e.type === 'pointerup' && document.elementFromPoint(e.clientX, e.clientY)?.closest('.ring__card');
      if (tapped) goTo(cards.indexOf(tapped));          // a tap brings that photo to the middle
      else vel = Math.max(-9, Math.min(9, drag.v));     // a flick keeps going, then settles on a photo
      drag = null;
    };
    ring.addEventListener('pointerup', release);
    ring.addEventListener('pointercancel', release);
    // Each photo carries a still, flipped copy of itself as its reflection.
    for (const c of cards) {
      const m = $('img', c).cloneNode(); m.className = 'ring__mirror'; m.alt = ''; m.setAttribute('aria-hidden', 'true'); m.removeAttribute('style');
      c.appendChild(m);
    }
    let w = cards[0].offsetWidth, drawn = NaN, drawnW = 0;
    addEventListener('resize', () => { w = cards[0].offsetWidth; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => { onScreen = es[0].isIntersecting; }, { rootMargin: '200px' }).observe(ring);
      // While the stage fills the screen the page background is out of sight, so it stops moving.
      new IntersectionObserver((es) => document.body.classList.toggle('is-gallery', es[0].intersectionRatio > .55), { threshold: [0, .55, 1] }).observe($('#galleria'));
    } else onScreen = true;

    const frame = (now) => {
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      if (onScreen && !document.hidden) {
        if (drag) next = now + REST * 1.6;
        else if (target !== null) {
          const d = target - pos; pos += d * Math.min(1, dt * 4.2);
          if (Math.abs(d) < .002) { pos = target; target = null; vel = 0; next = now + REST; }
        } else if (Math.abs(vel) > .12) { pos += vel * dt; vel *= Math.exp(-3.2 * dt); }
        else if (pos !== Math.round(pos)) target = Math.round(pos);
        else if (now > next) target = pos + 1;

        // Only transform and opacity change, and only while something moves: both are handled by the graphics chip.
        if (pos !== drawn || w !== drawnW) {
          drawn = pos; drawnW = w;
          cards.forEach((c, i) => {
            const p = wrap(i - pos), ap = Math.abs(p), s = Math.sign(p), t = Math.min(ap, 1), far = Math.max(0, ap - 1);
            const x = s * (t * .66 + far * .37) * w, z = -(t * 190 + far * 80), ry = -s * t * 56, k = 1 - t * .1;
            c.style.transform = `translate3d(${x.toFixed(1)}px,0,${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) scale(${k.toFixed(3)})`;
            c.style.opacity = Math.max(0, Math.min(1, 3.7 - ap)).toFixed(2);
          });
          const f = ((Math.round(pos) % n) + n) % n;
          if (f !== shown) { shown = f; label(); }
        }
      }
      requestAnimationFrame(frame);
    };
    const label = () => {
      if (shown < 0) return;
      cap.innerHTML = $('figcaption', cards[shown]).innerHTML;
      count.textContent = `${String(shown + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
    };
    document.addEventListener('langchange', label);
    requestAnimationFrame(frame);
  }

  /* ---------- Scroll reveals ---------- */
  const targets = $$('.head, .story__text > *, .story__art, .tabs, .menu, .menu__notes, .scores, .quotes, .ring, .ring__ui, .visit__info > *, .visit__map, .laurels li, .chef__photo, .chef__text > *, .spaces .head, .cinema__screen, .cinema__list, .press');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .04 }); // low, so sections much taller than a phone screen still reveal
    targets.forEach((el) => { el.classList.add('io'); io.observe(el); });
  }

  $('#year').textContent = new Date().getFullYear();
  setLang(lang);
})();
