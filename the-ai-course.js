/* =====================================================
   THE AI COURSE — sales page interactions
   Vanilla JS, no deps. Respects prefers-reduced-motion.
   ===================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // smooth anchor scroll with fixed-nav offset
  document.documentElement.style.scrollBehavior = 'smooth';
  document.documentElement.style.scrollPaddingTop = '88px';

  document.addEventListener('DOMContentLoaded', function () {

    /* ---------- checkout links: carry UTM / source through ---------- */
    (function () {
      var qs = window.location.search;
      if (!qs || qs.length < 2) return;
      var keep = [];
      new URLSearchParams(qs).forEach(function (v, k) {
        if (/^utm_|^ref$|^source$|^fbclid$|^gclid$/i.test(k)) keep.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
      });
      if (!keep.length) return;
      document.querySelectorAll('[data-checkout]').forEach(function (a) {
        var href = a.getAttribute('href');
        a.setAttribute('href', href + (href.indexOf('?') > -1 ? '&' : '?') + keep.join('&'));
      });
    })();

    /* ---------- reveal on scroll ---------- */
    var reveals = document.querySelectorAll('.tac-reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var revObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-in'); revObs.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach(function (el) { revObs.observe(el); });
    }

    /* ---------- dials light up ---------- */
    var dials = document.querySelectorAll('.tac-dial');
    if ('IntersectionObserver' in window) {
      var dialObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-on'); dialObs.unobserve(e.target); }
        });
      }, { threshold: 0.4 });
      dials.forEach(function (d) { dialObs.observe(d); });
    } else {
      dials.forEach(function (d) { d.classList.add('is-on'); });
    }

    /* ---------- the loop: observe -> think -> act ---------- */
    (function () {
      var loop = document.getElementById('tacLoop');
      if (!loop) return;
      var nodes = loop.querySelectorAll('.tac-loop__node');
      if (!nodes.length) return;
      if (reduceMotion) { nodes.forEach(function (n) { n.classList.add('is-active'); }); return; }
      var i = 0, timer = null;
      function tick() {
        nodes.forEach(function (n, idx) { n.classList.toggle('is-active', idx === i); });
        i = (i + 1) % nodes.length;
      }
      function start() { if (timer) return; tick(); timer = setInterval(tick, 900); }
      function stop() { clearInterval(timer); timer = null; }
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { e.isIntersecting ? start() : stop(); });
        }, { threshold: 0.3 }).observe(loop);
      } else { start(); }
    })();

    /* ---------- curriculum session accordions (multi-open) ---------- */
    document.querySelectorAll('.tac-ses__head').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.tac-ses');
        var open = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        var plus = btn.querySelector('.tac-ses__plus');
        if (plus) plus.textContent = open ? '[-]' : '[+]';
      });
    });

    /* ---------- generic accordions (objections + faq, single-open) ---------- */
    document.querySelectorAll('[data-acc]').forEach(function (group) {
      group.querySelectorAll('.tac-acc__head').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var item = btn.closest('.tac-acc__item');
          var isOpen = item.classList.contains('is-open');
          group.querySelectorAll('.tac-acc__item').forEach(function (it) {
            it.classList.remove('is-open');
            var h = it.querySelector('.tac-acc__head');
            h.setAttribute('aria-expanded', 'false');
            var ic = h.querySelector('.ic'); if (ic) ic.textContent = '[+]';
          });
          if (!isOpen) {
            item.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
            var ic2 = btn.querySelector('.ic'); if (ic2) ic2.textContent = '[-]';
          }
        });
      });
    });

    /* ---------- countdown ---------- */
    (function () {
      var el = document.getElementById('tacCountdown');
      if (!el) return;
      var deadline = new Date(el.getAttribute('data-deadline')).getTime();
      var dEl = el.querySelector('[data-d]'), hEl = el.querySelector('[data-h]'),
          mEl = el.querySelector('[data-m]'), sEl = el.querySelector('[data-s]');
      function pad(n) { return (n < 10 ? '0' : '') + n; }
      function render() {
        var diff = deadline - Date.now();
        if (isNaN(diff)) return;
        if (diff < 0) diff = 0;
        var s = Math.floor(diff / 1000);
        dEl.textContent = pad(Math.floor(s / 86400));
        hEl.textContent = pad(Math.floor((s % 86400) / 3600));
        mEl.textContent = pad(Math.floor((s % 3600) / 60));
        sEl.textContent = pad(s % 60);
      }
      render();
      setInterval(render, 1000);
    })();

    /* ---------- seats fill ---------- */
    (function () {
      var el = document.getElementById('tacSeats');
      if (!el) return;
      var total = parseInt(el.getAttribute('data-total'), 10) || 30;
      var left = parseInt(el.getAttribute('data-left'), 10);
      if (isNaN(left)) left = 0;
      var taken = Math.max(0, total - left);
      var pct = Math.round((taken / total) * 100);
      var fill = el.querySelector('.tac-seats__fill');
      function go() { if (fill) fill.style.width = pct + '%'; }
      if (reduceMotion || !('IntersectionObserver' in window)) { go(); }
      else {
        new IntersectionObserver(function (entries, obs) {
          entries.forEach(function (e) { if (e.isIntersecting) { go(); obs.disconnect(); } });
        }, { threshold: 0.4 }).observe(el);
      }
    })();

    /* ---------- nav scrolled state + sticky buy bar ---------- */
    (function () {
      var nav = document.getElementById('tacNav');
      var bar = document.getElementById('tacBuybar');
      var hero = document.getElementById('top');
      var footer = document.querySelector('.tac-foot');
      var heroH = hero ? hero.offsetHeight : 600;
      var footerTop = footer ? footer.offsetTop : 999999;

      function onScroll() {
        var y = window.pageYOffset;
        if (nav) nav.classList.toggle('tac-nav--scrolled', y > 20);
        if (bar) {
          var pastHero = y > heroH * 0.7;
          var nearFooter = (y + window.innerHeight) > (footerTop + 80);
          bar.classList.toggle('is-show', pastHero && !nearFooter);
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', function () {
        heroH = hero ? hero.offsetHeight : 600;
        footerTop = footer ? footer.offsetTop : 999999;
        onScroll();
      });
      onScroll();
    })();

    /* ---------- wall of love: video testimonials ----------
       loop muted by default; unmute + play audio on hover.
       Works for placeholders too once a <source> is added. */
    (function () {
      var cards = document.querySelectorAll('.tac-wol-card--video');
      if (!cards.length) return;

      function hasMedia(v) { return v && (v.currentSrc || v.querySelector('source[src]') || v.getAttribute('src')); }

      cards.forEach(function (card) {
        var v = card.querySelector('video');
        if (!v) return;
        v.muted = true; v.loop = true; v.playsInline = true;

        // mark "playing" (hides the placeholder) only once real frames exist
        v.addEventListener('loadeddata', function () { card.classList.add('is-playing'); });
        if (!reduceMotion && hasMedia(v)) { v.play().catch(function () {}); }

        card.addEventListener('mouseenter', function () {
          card.classList.add('is-unmuted');
          if (hasMedia(v)) { v.muted = false; v.volume = 1; v.play().catch(function () {}); }
        });
        card.addEventListener('mouseleave', function () {
          card.classList.remove('is-unmuted');
          v.muted = true;
        });
      });

      // only autoplay videos while they're on screen (perf)
      if ('IntersectionObserver' in window) {
        var vObs = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            var v = e.target.querySelector('video');
            if (!v || !hasMedia(v) || reduceMotion) return;
            if (e.isIntersecting) { v.play().catch(function () {}); }
            else { v.pause(); }
          });
        }, { threshold: 0.2 });
        cards.forEach(function (c) { vObs.observe(c); });
      }
    })();

  });
})();
