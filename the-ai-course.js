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

      // the carousel duplicates each card for a seamless loop; sync sources by
      // data-slot so a <source>/src only needs adding ONCE per slot.
      (function () {
        var bySlot = {};
        cards.forEach(function (c) {
          var s = c.getAttribute('data-slot'); if (!s) return;
          (bySlot[s] = bySlot[s] || []).push(c);
        });
        Object.keys(bySlot).forEach(function (s) {
          var group = bySlot[s];
          var donor = group.filter(function (c) {
            var v = c.querySelector('video');
            return v && (v.getAttribute('src') || v.querySelector('source[src]'));
          })[0];
          if (!donor) return;
          var dv = donor.querySelector('video');
          group.forEach(function (c) {
            if (c === donor) return;
            var v = c.querySelector('video'); if (!v) return;
            if (dv.getAttribute('src')) v.setAttribute('src', dv.getAttribute('src'));
            var src = dv.querySelector('source');
            if (src && !v.querySelector('source')) v.appendChild(src.cloneNode(true));
            var poster = dv.getAttribute('poster'); if (poster) v.setAttribute('poster', poster);
            v.load();
          });
        });
      })();

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

    /* ---------- "what it is" — interactive pixel water-ripple background ----------
       Draws the brand halftone dot-grid on a canvas and runs a classic two-buffer
       water-wave sim. Pointer movement injects ripples that radiate and decay, so
       the dots warp like water under the cursor. Source still: the base reference
       at assets/images/what-dots-ripple-base.png. Sleeps when calm / off-screen,
       and stays static under prefers-reduced-motion. */
    (function () {
      var section = document.getElementById('what');
      if (!section) return;
      var canvas = section.querySelector('.tac-ripple');
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
      if (!ctx) return;

      var SPACING = 26;        // dot grid spacing (css px) — matches the base reference
      var R_MIN   = 0.6;       // smallest dot radius (smaller dots)
      var DISP    = 3;         // how far a dot slides under a wave (subtle motion)
      var DAMP    = 0.92;      // wave decay (closer to 1 = longer-lived ripples)
      var BASE_A  = 0.14;      // resting dot opacity (faint, fills the whole section)
      var DPR     = Math.min(window.devicePixelRatio || 1, 2);

      var W = 0, H = 0, cols = 0, rows = 0, rMax = 12;
      var base = null, bufA = null, bufB = null;     // base radii + two wave buffers
      var visible = false, running = false, calm = 0;

      // deterministic value-noise -> organic dot clusters (same look as the PNG)
      function hash(x, y) { var n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); }
      function sm(t) { return t * t * (3 - 2 * t); }
      function noise(x, y, scale) {
        var px = x / scale, py = y / scale, x0 = Math.floor(px), y0 = Math.floor(py);
        var fx = sm(px - x0), fy = sm(py - y0);
        var a = hash(x0, y0), b = hash(x0 + 1, y0), c = hash(x0, y0 + 1), d = hash(x0 + 1, y0 + 1);
        return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy;
      }

      function build() {
        var rect = canvas.getBoundingClientRect();
        W = Math.max(1, Math.round(rect.width));
        H = Math.max(1, Math.round(rect.height));
        canvas.width = Math.round(W * DPR);
        canvas.height = Math.round(H * DPR);
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        cols = Math.ceil(W / SPACING) + 2;
        rows = Math.ceil(H / SPACING) + 2;
        rMax = SPACING * 0.14;
        var n = cols * rows;
        base = new Float32Array(n); bufA = new Float32Array(n); bufB = new Float32Array(n);
        for (var gy = 0; gy < rows; gy++) for (var gx = 0; gx < cols; gx++) {
          var v = 0.60 * noise(gx, gy, 9) + 0.30 * noise(gx, gy, 4) + 0.10 * noise(gx, gy, 2);
          base[gy * cols + gx] = Math.pow(v < 0 ? 0 : v > 1 ? 1 : v, 1.6);
        }
      }

      function step() {
        for (var gy = 1; gy < rows - 1; gy++) {
          var row = gy * cols;
          for (var gx = 1; gx < cols - 1; gx++) {
            var i = row + gx;
            bufB[i] = ((bufA[i - 1] + bufA[i + 1] + bufA[i - cols] + bufA[i + cols]) * 0.5 - bufB[i]) * DAMP;
          }
        }
        var t = bufA; bufA = bufB; bufB = t;          // bufA = current heights
      }

      function render() {
        ctx.clearRect(0, 0, W, H);
        var energy = 0;
        for (var gy = 1; gy < rows - 1; gy++) for (var gx = 1; gx < cols - 1; gx++) {
          var i = gy * cols + gx, h = bufA[i];
          energy += h < 0 ? -h : h;
          var x = (gx - 1) * SPACING + (bufA[i + 1] - bufA[i - 1]) * DISP;
          var y = (gy - 1) * SPACING + (bufA[i + cols] - bufA[i - cols]) * DISP;
          var r = (R_MIN + base[i] * (rMax - R_MIN)) * (1 + h * 0.10);
          if (r < 0.35) continue;
          var a = BASE_A + (h < 0 ? -h : h) * 0.05;
          if (a > 0.7) a = 0.7;
          ctx.fillStyle = 'rgba(64,64,255,' + a + ')';
          ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283185); ctx.fill();
        }
        return energy;
      }

      function inject(cx, cy, force) {
        if (!bufA) return;
        var gx = Math.round(cx / SPACING) + 1, gy = Math.round(cy / SPACING) + 1;
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
          var x = gx + dx, y = gy + dy;
          if (x > 0 && x < cols - 1 && y > 0 && y < rows - 1) {
            bufA[y * cols + x] += force * (dx === 0 && dy === 0 ? 1 : 0.45);
          }
        }
        wake();
      }

      function frame() {
        step();
        var e = render();
        calm = e < 0.4 ? calm + 1 : 0;
        if (visible && calm < 60) requestAnimationFrame(frame);
        else running = false;
      }
      function wake() {
        if (!running && visible && !reduceMotion) { running = true; calm = 0; requestAnimationFrame(frame); }
      }

      var lastX = -999, lastY = -999;
      function onMove(clientX, clientY) {
        if (reduceMotion) return;
        var rect = canvas.getBoundingClientRect();
        var x = clientX - rect.left, y = clientY - rect.top;
        if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
        var dx = x - lastX, dy = y - lastY, speed = Math.sqrt(dx * dx + dy * dy);
        lastX = x; lastY = y;
        inject(x, y, speed > 200 ? 0.5 : Math.min(1.3, 0.3 + speed * 0.025));
      }
      section.addEventListener('pointermove', function (e) { onMove(e.clientX, e.clientY); }, { passive: true });
      section.addEventListener('pointerdown', function (e) {
        var rect = canvas.getBoundingClientRect();
        inject(e.clientX - rect.left, e.clientY - rect.top, 1.8);
      }, { passive: true });

      build();
      render();                                       // static first paint

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { visible = e.isIntersecting; if (visible) wake(); });
        }, { threshold: 0.02 }).observe(section);
      } else { visible = true; }

      var rt = null;
      window.addEventListener('resize', function () {
        clearTimeout(rt);
        rt = setTimeout(function () { build(); render(); wake(); }, 150);
      });
    })();

    /* ---------- the shift: pinned scroll swap (before slides out right, after slides in from left) ---------- */
    (function () {
      var track = document.getElementById('shiftTrack');
      if (!track) return;
      var before = track.querySelector('[data-shift="before"]');
      var after  = track.querySelector('[data-shift="after"]');
      var hint   = track.querySelector('.tac-shift__hint');
      if (!before || !after) return;
      if (reduceMotion) return;   // CSS shows the two cards stacked + static

      var OFF = 108;  // vw to push a card fully off-screen
      function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
      function cl(v, a, b) { return v < a ? a : (v > b ? b : v); }

      function onScroll() {
        var total = track.offsetHeight - window.innerHeight;
        if (total <= 0) return;
        var p = cl(-track.getBoundingClientRect().top / total, 0, 1);
        var q = cl((p - 0.12) / 0.74, 0, 1);   // brief hold at start + end
        var e = ease(q);
        before.style.setProperty('--shift-x', (e * OFF) + 'vw');
        after.style.setProperty('--shift-x', ((e - 1) * OFF) + 'vw');
        before.style.opacity = String(1 - cl((e - 0.72) / 0.28, 0, 1));
        after.style.opacity  = String(cl((e - 0.04) / 0.30, 0, 1));
        if (hint) hint.style.opacity = String(1 - cl(e * 1.6, 0, 1));
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      onScroll();
    })();

    /* ---------- what you walk out with: pinned arrow-shoot (each arrow fires through its line, the line disappears) ---------- */
    (function () {
      var track = document.getElementById('outTrack');
      if (!track) return;
      var items = track.querySelectorAll('.tac-out__item');
      var tail = track.querySelector('.tac-out__tail');
      if (!items.length || reduceMotion) return;
      var N = items.length;
      function cl(v, a, b) { return v < a ? a : (v > b ? b : v); }
      function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
      function onScroll() {
        var total = track.offsetHeight - window.innerHeight;
        if (total <= 0) return;
        var p = cl(-track.getBoundingClientRect().top / total, 0, 1);
        var P = p * N;
        items.forEach(function (li, i) {
          var q = cl(P - i, 0, 1);
          var arrow = li.querySelector('.tac-out__arrow');
          if (arrow) arrow.style.transform = 'translateX(' + (ease(q) * (li.clientWidth + 12)) + 'px)';
          li.style.opacity = String(1 - cl((q - 0.62) / 0.38, 0, 1));
        });
        if (tail) tail.style.opacity = String(cl((p - 0.9) / 0.1, 0, 1));
      }
      if (tail) tail.style.opacity = '0';
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      onScroll();
    })();

    /* ---------- remy signature: handwrite reveal on scroll into view ---------- */
    (function () {
      var img = document.querySelector('.tac-sign-img');
      if (!img) return;
      if (reduceMotion) { img.classList.add('is-written'); return; }
      if ('IntersectionObserver' in window) {
        var o = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { img.classList.add('is-written'); o.unobserve(img); } });
        }, { threshold: 0.45 });
        o.observe(img);
      } else { img.classList.add('is-written'); }
    })();

  });
})();
