/* =========================================================
   KuKirin G2 — page behaviour
   - scroll progress bar
   - reveal-on-scroll (images lead, text follows, in order)
   - count-up numbers
   ========================================================= */
(function () {
  'use strict';

  /* ---- scroll progress bar ---- */
  var bar = document.querySelector('.progress span');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop / max) : 0;
    if (bar) bar.style.width = (p * 100) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- count-up ---- */
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var dur = 1300;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / dur);
      el.textContent = Math.round(easeOutCubic(t) * target);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  var countEls = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.hasAttribute('data-reveal')) el.classList.add('is-visible');
        if (el.hasAttribute('data-count')) countUp(el);
        io.unobserve(el);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
    countEls.forEach(function (el) { io.observe(el); });
  } else {
    /* No IntersectionObserver: show everything, set final numbers. */
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    countEls.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }
})();

/* ---- cover photo gallery: rotate the 6 G2 shots ---- */
(function () {
  'use strict';
  var gallery = document.getElementById('gallery');
  if (!gallery) return;
  var imgs = Array.prototype.slice.call(gallery.querySelectorAll('.gallery-img'));
  if (!imgs.length) return;
  var dotsWrap = gallery.querySelector('.gallery-dots');
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var INTERVAL = 3200;

  var loaded = [];
  var pending = imgs.length;
  function settled(img) {
    if (img.complete && img.naturalWidth > 0) loaded.push(img);
    pending--;
    if (pending === 0) init();
  }
  imgs.forEach(function (img) {
    if (img.complete) settled(img);
    else {
      img.addEventListener('load', function () { settled(img); });
      img.addEventListener('error', function () { img.style.display = 'none'; settled(img); });
    }
  });

  var current = 0;
  var timer = null;
  var inView = true;
  var hovering = false;

  function setIndex(i) {
    current = (i + loaded.length) % loaded.length;
    loaded.forEach(function (im, idx) { im.classList.toggle('is-active', idx === current); });
    if (dotsWrap) {
      Array.prototype.forEach.call(dotsWrap.children, function (d, idx) {
        d.classList.toggle('is-active', idx === current);
        d.setAttribute('aria-selected', idx === current ? 'true' : 'false');
      });
    }
  }
  function start() {
    stop();
    if (reduce || loaded.length < 2) return;
    timer = setInterval(function () { if (inView && !hovering) setIndex(current + 1); }, INTERVAL);
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  function init() {
    if (!loaded.length) { gallery.style.display = 'none'; return; } /* fallback shows */
    if (loaded.length === 1) {
      loaded[0].classList.add('is-active');
      if (dotsWrap) dotsWrap.style.display = 'none';
      return;
    }
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      loaded.forEach(function (im, idx) {
        var b = document.createElement('button');
        b.className = 'gallery-dot' + (idx === 0 ? ' is-active' : '');
        b.type = 'button';
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-label', 'Show photo ' + (idx + 1) + ' of ' + loaded.length);
        b.addEventListener('click', function () { setIndex(idx); start(); });
        dotsWrap.appendChild(b);
      });
    }
    setIndex(0);
    start();
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { inView = e.isIntersecting; });
      }, { threshold: 0.15 });
      io.observe(gallery);
    }
    gallery.addEventListener('mouseenter', function () { hovering = true; });
    gallery.addEventListener('mouseleave', function () { hovering = false; });
  }
})();