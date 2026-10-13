(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const lang = () => document.documentElement.lang || 'it';

  /* ---------- Opening curtain: lifts once the page has loaded, and never later than 2.6 s in ---------- */
  const intro = $('#intro');
  if (intro) {
    const t0 = performance.now();
    const lift = () => setTimeout(() => intro.classList.add('is-done'), Math.max(0, 1900 - (performance.now() - t0)));
    if (document.readyState === 'complete') lift(); else addEventListener('load', lift, { once: true });
    setTimeout(() => intro.classList.add('is-done'), 2600);
  }

  /* ---------- Scroll progress line ---------- */
  const bar = $('#progress');
  if (bar) {
    let queued = false;
    const draw = () => { queued = false; bar.style.transform = `scaleX(${Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)).toFixed(4)})`; };
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(draw); } }, { passive: true });
  }

  /* ---------- Spaces: the panel under the pointer opens ---------- */
  const spaces = $$('.space');
  const open = (s) => spaces.forEach((x) => x.classList.toggle('is-on', x === s));
  for (const s of spaces) { s.addEventListener('mouseenter', () => open(s)); s.addEventListener('focus', () => open(s)); s.addEventListener('click', () => open(s)); }

  /* ---------- Press strip: duplicated once so it loops without a seam ---------- */
  for (const track of $$('.press__track')) {
    for (const node of [...track.children]) { const c = node.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c); }
  }

  /* ---------- YouTube: one loader shared by the hero film and the cinema ---------- */
  // A video file hosted with the site (HERO_VIDEO) always wins over the YouTube film: it starts faster and shows no player.
  const film = window.HERO_VIDEO ? null : $('#film'), cinema = $('#cinema');
  if (!film && !cinema) return;
  let api;
  const youtube = () => api || (api = new Promise((res) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { if (prev) prev(); res(window.YT); };
    const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; s.async = true; document.head.appendChild(s);
  }));
  const quiet = { controls: 0, rel: 0, playsinline: 1, modestbranding: 1, disablekb: 1, fs: 0, iv_load_policy: 3, mute: 1, autoplay: 1 };
  const watch = (el, ratio, cb) => new IntersectionObserver((es) => cb(es[0].intersectionRatio >= ratio), { threshold: [0, ratio, 1] }).observe(el);

  /* ---------- Hero film: muted, looping, shown only once it is really playing ---------- */
  if (film) {
    const hero = $('.hero'), id = film.dataset.yt, start = +film.dataset.start || 0, end = +film.dataset.end || 0;
    let player, visible = true, ready = false;
    // The film waits for the curtain, so its first frames are not wasted behind it.
    setTimeout(() => youtube().then((YT) => {
      player = new YT.Player('filmFrame', {
        host: 'https://www.youtube-nocookie.com', videoId: id, playerVars: { ...quiet, start },
        events: {
          onReady: (e) => { ready = true; e.target.mute(); if (visible) e.target.playVideo(); },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) setTimeout(() => { film.classList.add('is-on'); hero.classList.add('has-film'); }, 1800);   // past YouTube's own title flash; the photos show until then
            if (e.data === YT.PlayerState.ENDED) { e.target.seekTo(start, true); e.target.playVideo(); }
          },
        },
      });
      // Jump back just before the end, so the loop never shows YouTube's end screen.
      setInterval(() => {
        if (!ready || !visible || document.hidden || !player.getDuration) return;
        // A film that was held back (slow network, a tab opened in the background) is started again.
        const st = player.getPlayerState();
        if (st === -1 || st === 2 || st === 5) player.playVideo();
        const stop = end || player.getDuration() - .45;
        if (stop > 0 && player.getCurrentTime() >= stop) player.seekTo(start, true);
      }, 250);
    }), intro ? 1500 : 200);
    watch(hero, .12, (on) => { visible = on; if (ready) on ? player.playVideo() : player.pauseVideo(); });
    document.addEventListener('visibilitychange', () => { if (ready && visible) document.hidden ? player.pauseVideo() : player.playVideo(); });
  }

  /* ---------- Cinema: plays by itself when it scrolls into view, then moves on to the next film ---------- */
  if (cinema) {
    const items = $$('.cinema__item', cinema), sound = $('#cinemaSound'), fill = $('#cinemaFill'), nowT = $('#cinemaNow b'), nowS = $('#cinemaNow small');
    let player, ready = false, inView = false, paused = false, cur = 0, muted = true, made = false;
    const label = () => {
      const b = items[cur];
      nowT.textContent = (lang() === 'en' && b.dataset.titleEn) || b.dataset.titleIt; nowS.textContent = b.dataset.src;
      sound.textContent = muted ? (lang() === 'it' ? 'Attiva l’audio' : 'Turn sound on') : (lang() === 'it' ? 'Togli l’audio' : 'Mute');
      sound.classList.toggle('is-on', !muted);
    };
    const show = (i, play) => {
      cur = (i + items.length) % items.length; paused = false;
      items.forEach((b, k) => b.classList.toggle('is-on', k === cur));
      label(); fill.style.transform = 'scaleX(0)';
      if (ready) { const o = { videoId: items[cur].dataset.yt, startSeconds: +items[cur].dataset.start || 0 }; play ? player.loadVideoById(o) : player.cueVideoById(o); if (play) { if (muted) player.mute(); player.playVideo(); } }
    };
    const make = () => {
      if (made) return; made = true;
      youtube().then((YT) => {
        player = new YT.Player('cinemaFrame', {
          host: 'https://www.youtube-nocookie.com', videoId: items[cur].dataset.yt, playerVars: { ...quiet, start: +items[cur].dataset.start || 0 },
          events: {
            onReady: (e) => { ready = true; e.target.mute(); inView ? e.target.playVideo() : e.target.pauseVideo(); },
            onStateChange: (e) => {
              if (e.data === YT.PlayerState.ENDED) show(cur + 1, true);
              // Some browsers leave a freshly loaded film waiting: start it, as long as it is on screen and nobody paused it.
              if ((e.data === YT.PlayerState.UNSTARTED || e.data === YT.PlayerState.CUED) && inView && !paused) setTimeout(() => { if (inView && !paused) player.playVideo(); }, 350);
            },
          },
        });
        setInterval(() => {
          if (!ready || !inView || document.hidden || !player.getDuration) return;
          const st = player.getPlayerState();
          if (!paused && (st === -1 || st === 5)) player.playVideo();
          const d = player.getDuration();
          if (d > 0) fill.style.transform = `scaleX(${Math.min(1, player.getCurrentTime() / d).toFixed(4)})`;
        }, 300);
      });
    };
    new IntersectionObserver((es) => { if (es[0].isIntersecting) make(); }, { rootMargin: '600px' }).observe(cinema);   // the player is built just before it is needed
    watch($('.cinema__screen', cinema), .4, (on) => { inView = on; if (ready) (on && !paused) ? player.playVideo() : player.pauseVideo(); });
    items.forEach((b, i) => b.addEventListener('click', () => show(i, true)));
    $('#cinemaHit').addEventListener('click', () => { if (!ready) return; paused = !paused; paused ? player.pauseVideo() : player.playVideo(); });
    sound.addEventListener('click', () => { if (!ready) return; muted = !muted; muted ? player.mute() : (player.unMute(), player.setVolume(80)); label(); });
    document.addEventListener('langchange', label);
    document.addEventListener('visibilitychange', () => { if (ready && document.hidden) player.pauseVideo(); else if (ready && inView && !paused) player.playVideo(); });
    show(0, false);
  }
})();
