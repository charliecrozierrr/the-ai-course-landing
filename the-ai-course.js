/* =====================================================
   THE AI COURSE — sales page interactions
   Vanilla JS, no deps. Respects prefers-reduced-motion.
   ===================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // smooth anchor scroll with fixed-nav offset
  document.documentElement.style.scrollBehavior = 'smooth';
  document.documentElement.style.scrollPaddingTop = 'calc(var(--annbar-h, 38px) + 64px)';

  document.addEventListener('DOMContentLoaded', function () {

    /* ---------- problem "sound familiar?" carousel (slide in, hold 5s, slide out) ---------- */
    (function () {
      var ul = document.querySelector('.tac-problem__quotes');
      if (!ul) return;
      var cards = ul.querySelectorAll('li');
      if (cards.length < 2) return;
      var i = 0;
      cards[0].classList.add('is-active');
      function advance() {
        var cur = cards[i];
        cur.classList.remove('is-active');
        cur.classList.add('is-leaving');
        setTimeout(function () { cur.classList.remove('is-leaving'); }, 520);
        i = (i + 1) % cards.length;
        var nxt = cards[i];
        nxt.classList.remove('is-leaving');
        void nxt.offsetWidth;
        nxt.classList.add('is-active');
      }
      setInterval(advance, 4500);
    })();

    /* ---------- what's included: arrow erase (letters vanish as the arrow passes, row by row) ---------- */
    (function () {
      var ul = document.querySelector('.tac-incl__list');
      if (!ul || reduceMotion) return;
      var items = ul.querySelectorAll('li');
      if (!items.length) return;
      function cl(v,a,b){ return v<a?a:(v>b?b:v); }
      function ease(t){ return t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2; }
      function split(root,out){
        Array.prototype.slice.call(root.childNodes).forEach(function(node){
          if (node.nodeType===3){
            var frag=document.createDocumentFragment();
            (node.nodeValue.match(/\S+|\s+/g)||[]).forEach(function(tok){
              if (/^\s+$/.test(tok)){ for(var s=0;s<tok.length;s++){var sp=document.createElement('span');sp.className='tac-incl__ch';sp.textContent=tok[s];frag.appendChild(sp);out.push(sp);} }
              else { var w=document.createElement('span');w.className='tac-incl__word'; for(var c=0;c<tok.length;c++){var ch=document.createElement('span');ch.className='tac-incl__ch';ch.textContent=tok[c];w.appendChild(ch);out.push(ch);} frag.appendChild(w); }
            });
            root.replaceChild(frag,node);
          } else if (node.nodeType===1){ split(node,out); }
        });
      }
      items.forEach(function(li,idx){
        var txt=li.querySelector('.tac-incl__txt'); var chars=[];
        if (txt) split(txt,chars);
        li._chars=chars; li._arrow=li.querySelector('.tac-incl__arrow'); li._row=Math.floor(idx/2);
      });
      var numRows=Math.floor((items.length-1)/2)+1;
      function measure(){
        items.forEach(function(li){
          var a=li._arrow; if(a) li._ab={x:a.offsetLeft+a.offsetWidth/2,y:a.offsetTop+a.offsetHeight/2};
          li._chars.forEach(function(ch){ ch._cx=ch.offsetLeft+ch.offsetWidth/2; ch._cy=ch.offsetTop+ch.offsetHeight/2; });
        });
      }
      var track=document.getElementById('inclTrack');
      var stage=document.querySelector('.tac-incl__stage');
      function onScroll(){
        if(!track) return;
        var total=track.offsetHeight-window.innerHeight;
        if(total<=0) return;
        var p=cl(-track.getBoundingClientRect().top/total,0,1);
        if(stage){ if(p>=0.76) stage.classList.add('is-done'); else stage.classList.remove('is-done'); }
        var HOLD=0.3, ENDP=0.74;
        var P=cl((p-HOLD)/(ENDP-HOLD),0,1)*numRows;
        items.forEach(function(li){
          var e=ease(cl(P-li._row,0,1));
          var chars=li._chars, n=chars.length, fi=Math.floor(e*(n+1));
          for(var k=0;k<n;k++) chars[k].style.visibility=(k<fi)?'hidden':'visible';
          var a=li._arrow;
          if(a && li._ab){
            if(fi<=0){ a.style.transform='translate(0px,0px)'; a.style.opacity='1'; }
            else if(fi>=n){ a.style.opacity='0'; }
            else { var t=chars[fi]; a.style.transform='translate('+(t._cx-li._ab.x)+'px,'+(t._cy-li._ab.y)+'px)'; a.style.opacity='1'; }
          }
        });
      }
      measure();
      window.addEventListener('scroll', onScroll, {passive:true});
      window.addEventListener('resize', function(){ measure(); onScroll(); });
      onScroll();
    })();

    /* ---------- ROI pixel calculator (four-function) ---------- */
    (function () {
      var root = document.getElementById('tacCalc');
      if (!root) return;
      var screenEl = root.querySelector('.tac-calc__val');
      var keysEl = root.querySelector('.tac-calc__keys');
      var scrEl = root.querySelector('.tac-calc__screen');
      var labelEl = root.querySelector('.tac-calc__label');
      function setLabel(t){ if (labelEl) labelEl.textContent = t || ''; }
      var cur = '0', acc = null, op = null, fresh = true, justEq = false;

      function fmt(s) {
        if (s === 'ERR') return 'ERR';
        var neg = s.charAt(0) === '-'; if (neg) s = s.slice(1);
        var parts = s.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return (neg ? '-' : '') + parts.join('.');
      }
      function render() { screenEl.textContent = fmt(cur); }
      function val() { return parseFloat(cur) || 0; }
      function nice(x) { return Math.round(x * 1e6) / 1e6; }
      function compute(a, b, o) {
        if (o === '+') return a + b;
        if (o === '-') return a - b;
        if (o === '*') return a * b;
        if (o === '/') return b === 0 ? null : a / b;
        return b;
      }
      function digit(d) {
        if (fresh || justEq) { cur = d; fresh = false; justEq = false; }
        else if (cur === '0') { cur = d; }
        else if (cur.replace('-', '').replace('.', '').length < 12) { cur += d; }
        render();
      }
      function dot() {
        if (fresh || justEq) { cur = '0.'; fresh = false; justEq = false; }
        else if (cur.indexOf('.') === -1) { cur += '.'; }
        render();
      }
      function setOp(o) {
        if (cur === 'ERR') return;
        if (op !== null && !fresh) {
          var r = compute(acc, val(), op);
          if (r === null) { cur = 'ERR'; acc = null; op = null; fresh = true; render(); return; }
          acc = nice(r); cur = String(acc); render();
        } else { acc = val(); }
        op = o; fresh = true; justEq = false;
      }
      function equals() {
        if (op === null || cur === 'ERR') { justEq = true; return; }
        var r = compute(acc, val(), op);
        if (r === null) { cur = 'ERR'; acc = null; op = null; fresh = true; render(); return; }
        acc = nice(r); cur = String(acc); op = null; fresh = true; justEq = true; render();
      }
      function clearAll() { cur = '0'; acc = null; op = null; fresh = true; justEq = false; setLabel(''); render(); }
      function back() {
        if (fresh || justEq || cur === 'ERR') return;
        cur = cur.length > 1 ? cur.slice(0, -1) : '0';
        if (cur === '-' || cur === '') cur = '0';
        render();
      }

      keysEl.addEventListener('click', function (e) {
        var b = e.target.closest('.tac-calc__key'); if (!b) return;
        setLabel('');
        if (b.hasAttribute('data-num')) digit(b.getAttribute('data-num'));
        else if (b.hasAttribute('data-dot')) dot();
        else if (b.hasAttribute('data-eq')) equals();
        else if (b.hasAttribute('data-op')) setOp(b.getAttribute('data-op'));
      });
      scrEl.addEventListener('click', clearAll);
      /* quick-estimate presets: rate -> rate x 20 x 52, stepped, then flash */
      var seqTimers = [];
      function clearSeq(){ for (var i = 0; i < seqTimers.length; i++) clearTimeout(seqTimers[i]); seqTimers = []; }
      function flash(){ scrEl.classList.remove('is-flash'); void scrEl.offsetWidth; scrEl.classList.add('is-flash'); }
      function preset(rate){
        clearSeq();
        acc = null; op = null; fresh = true; justEq = true;
        cur = String(rate); setLabel('saved per hour'); render(); flash();
        seqTimers.push(setTimeout(function(){ cur = String(rate * 20); setLabel('saved per week'); render(); flash(); }, 600));
        seqTimers.push(setTimeout(function(){ cur = String(rate * 20 * 52); setLabel('saved per year'); render(); flash(); }, 1200));
      }
      var presetBtns = document.querySelectorAll('.tac-calc__preset');
      for (var pq = 0; pq < presetBtns.length; pq++) {
        (function(btn){ btn.addEventListener('click', function(){ preset(parseFloat(btn.getAttribute('data-rate'))); }); })(presetBtns[pq]);
      }
      var clearBtn = root.querySelector('.tac-calc__clear');
      if (clearBtn) clearBtn.addEventListener('click', clearAll);
      root.addEventListener('keydown', function (e) {
        var k = e.key;
        setLabel('');
        if (k >= '0' && k <= '9') { digit(k); e.preventDefault(); }
        else if (k === '.') { dot(); e.preventDefault(); }
        else if (k === '+' || k === '-' || k === '*' || k === '/') { setOp(k); e.preventDefault(); }
        else if (k === 'Enter' || k === '=') { equals(); e.preventDefault(); }
        else if (k === 'Backspace') { back(); e.preventDefault(); }
        else if (k === 'Escape') { clearAll(); e.preventDefault(); }
      });
      render();
    })();

    /* ---------- course scroll: two-rod unroll that scrolls WITH the page (bottom rod drops down until it reaches the bottom, reversible) ---------- */
    (function () {
      var track = document.querySelector('.tac-scrolltrack');
      var scroll = track && track.querySelector('.tac-scroll');
      if (!scroll) return;
      var topRod = scroll.querySelector('.tac-scroll__top');
      var content = scroll.querySelector('.tac-scroll__content');
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var L = {};
      function layout() {
        if (reduce) { scroll.style.height = ''; content.style.transform = 'none'; track.style.height = ''; return; }
        var vh = window.innerHeight || document.documentElement.clientHeight;
        var rodH = topRod.getBoundingClientRect().height || 90;
        var contentH = content.scrollHeight;
        var openH = 2 * rodH + contentH;
        var closedH = 2 * rodH;
        track.style.height = openH + 'px';                         // reserve full height (no layout shift)
        var startY = Math.round(vh * 0.42);                        // closed & centred when the track top reaches here
        var revealDist = Math.max(260, Math.round(contentH * 0.82)); // a touch < contentH so the bottom rod drifts down with the page to the bottom
        L = { startY: startY, revealDist: revealDist, openH: openH, closedH: closedH };
        update();
      }
      function update() {
        if (reduce || !L.revealDist) return;
        var scrolled = L.startY - track.getBoundingClientRect().top;
        var p = scrolled <= 0 ? 0 : Math.min(1, scrolled / L.revealDist);
        scroll.style.height = (L.closedH + p * (L.openH - L.closedH)).toFixed(1) + 'px';
      }
      var ticking = false;
      function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; update(); }); } }
      layout();
      window.addEventListener('load', layout);
      setTimeout(layout, 450);
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', layout);
    })();

    /* ---------- live seats taken from Circle (/api/seats); silently keeps the static numbers on any failure ---------- */
    (function () {
      if (!window.fetch) return;
      fetch('/api/seats', { headers: { Accept: 'application/json' } })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          if (!d || !d.ok) return;
          if (typeof d.course === 'number') {
            Array.prototype.forEach.call(document.querySelectorAll('[data-course-taken]'), function (el) { el.textContent = d.course; });
            var bar = document.querySelector('[data-seats-taken]');
            if (bar) {
              bar.setAttribute('data-seats-taken', d.course);
              var as = document.querySelector('[data-ann-seats]');
              if (as) as.textContent = d.course + ' of ' + (d.courseTotal || 60) + ' seats taken';
            }
          }
          if (typeof d.vip === 'number') {
            Array.prototype.forEach.call(document.querySelectorAll('[data-vip-taken]'), function (el) { el.textContent = d.vip; });
          }
        })
        .catch(function () {});
    })();

    /* ---------- seat allocation load-bar: fills to the taken count when scrolled into view ---------- */
    (function () {
      var bars = document.querySelectorAll('.tac-seatbar');
      if (!bars.length) return;
      Array.prototype.forEach.call(bars, function (bar) {
        var total = parseInt(bar.getAttribute('data-total'), 10) || 60;
        var taken = Math.max(0, Math.min(total, parseInt(bar.getAttribute('data-taken'), 10) || 0));
        var row = bar.querySelector('.tac-seatbar__row');
        if (!row) return;
        var seats = [];
        for (var i = 0; i < total; i++) { var s = document.createElement('span'); s.className = 'tac-seatbar__seat'; row.appendChild(s); seats.push(s); }
        function fillAll() { for (var k = 0; k < taken; k++) seats[k].classList.add('is-on'); }
        if (reduceMotion || !('IntersectionObserver' in window)) { fillAll(); return; }
        var done = false;
        var io = new IntersectionObserver(function (entries) {
          for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting && !done) {
              done = true;
              for (var k = 0; k < taken; k++) { (function (idx) { setTimeout(function () { seats[idx].classList.add('is-on'); }, idx * 28); })(k); }
              io.disconnect();
              break;
            }
          }
        }, { threshold: 0.4 });
        io.observe(bar);
      });
    })();

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

    /* ---------- countdowns: every .tac-count[data-deadline] ---------- */
    (function () {
      var els = document.querySelectorAll('.tac-count[data-deadline]');
      if (!els.length) return;
      function pad(n) { return (n < 10 ? '0' : '') + n; }
      Array.prototype.forEach.call(els, function (el) {
        var deadline = new Date(el.getAttribute('data-deadline')).getTime();
        var dEl = el.querySelector('[data-d]'), hEl = el.querySelector('[data-h]'),
            mEl = el.querySelector('[data-m]'), sEl = el.querySelector('[data-s]');
        if (!dEl || !hEl || !mEl || !sEl) return;
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
      });
    })();

    /* ---------- announcement bar: countdown + phase swap + seats ---------- */
    (function () {
      var bar = document.getElementById('tacAnn');
      if (!bar) return;
      var msgEl = bar.querySelector('[data-ann-msg]');
      var countEl = bar.querySelector('[data-ann-count]');
      var seatsEl = bar.querySelector('[data-ann-seats]');
      var ebEnd = new Date(bar.getAttribute('data-eb-deadline')).getTime();
      var doorsEnd = new Date(bar.getAttribute('data-doors-deadline')).getTime();
      var total = parseInt(bar.getAttribute('data-seats-total'), 10) || 60;
      var taken = Math.max(8, parseInt(bar.getAttribute('data-seats-taken'), 10) || 8);

      var EB_FULL = 'Early-bird ends Friday July 3. Lock in $1,497 (it goes to $1,997 after).';
      var EB_SHORT = 'Early-bird ends Jul 3 - lock in $1,497';
      var DOORS_FULL = 'Doors close Saturday July 11. Last chance to join the July cohort.';
      var DOORS_SHORT = 'Doors close Jul 11 - last chance';
      var CLOSED = 'The July cohort is closed - join the waitlist for the next one.';

      function pad(n) { return (n < 10 ? '0' : '') + n; }
      function fmt(ms) {
        if (ms <= 0) return '';
        var s = Math.floor(ms / 1000);
        var d = Math.floor(s / 86400);
        var h = Math.floor((s % 86400) / 3600);
        var m = Math.floor((s % 3600) / 60);
        return d + 'd ' + pad(h) + 'h ' + pad(m) + 'm ' + pad(s % 60) + 's';
      }
      function syncHeight() {
        document.documentElement.style.setProperty('--annbar-h', bar.offsetHeight + 'px');
      }
      function render() {
        var now = Date.now();
        var small = window.innerWidth <= 600;
        var target = 0, msg;
        if (isNaN(ebEnd) || now < ebEnd) { msg = small ? EB_SHORT : EB_FULL; target = ebEnd; }
        else if (now < doorsEnd) { msg = small ? DOORS_SHORT : DOORS_FULL; target = doorsEnd; }
        else { msg = CLOSED; target = 0; }
        if (msgEl) msgEl.textContent = msg;
        if (countEl) countEl.textContent = target ? fmt(target - now) : '';
        if (seatsEl) seatsEl.textContent = taken + ' of ' + total + ' seats taken';
        syncHeight();
      }
      render();
      setInterval(render, 1000);
      window.addEventListener('resize', render);
      window.addEventListener('load', syncHeight);
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

      function paintNav() {
        if (!nav) return;
        var nb = nav.getBoundingClientRect().bottom;
        var el = document.elementFromPoint(Math.round(window.innerWidth / 2), nb + 4);
        var node = el, bg = null;
        while (node && node !== document.documentElement) {
          var c = getComputedStyle(node).backgroundColor;
          if (c && c !== 'transparent') {
            var pm = c.match(/[\d.]+/g);
            var a = (pm && pm.length >= 4) ? parseFloat(pm[3]) : 1;
            if (a >= 0.85) { bg = c; break; }
          }
          node = node.parentElement;
        }
        if (!bg) bg = 'rgb(255, 255, 255)';
        nav.style.backgroundColor = bg;
        var m = bg.match(/[\d.]+/g);
        if (m && m.length >= 3) {
          var lum = 0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2];
          nav.classList.toggle('tac-nav--dark', lum < 140);
        }
      }
      function onScroll() {
        var y = window.pageYOffset;
        if (nav) nav.classList.toggle('tac-nav--scrolled', y > 20);
        paintNav();
        if (bar) {
          var pastHero = y > heroH * 0.7;
          // hide the bar before the footer scrolls up under it, so it never
          // covers the footer mural (account for the bar's own height + the slide)
          var nearFooter = footer
            ? footer.getBoundingClientRect().top <= (window.innerHeight + 60)
            : false;
          bar.classList.toggle('is-show', pastHero && !nearFooter);
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', function () {
        heroH = hero ? hero.offsetHeight : 600;
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
      function initRipple(section) {
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
      }
      document.querySelectorAll('.tac-ripple').forEach(function (c) {
        var s = c.closest('section'); if (s) initRipple(s);
      });
    })();

    /* ---------- the shift: pinned scroll swap (before slides out right, after slides in from left) ---------- */
    (function () {
      function initShift(track) {
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
      }
      document.querySelectorAll('.tac-shift__track').forEach(initShift);
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
      // split each line into per-character spans (words kept intact so they never break mid-word)
      function split(root, out) {
        Array.prototype.slice.call(root.childNodes).forEach(function (node) {
          if (node.nodeType === 3) {
            var frag = document.createDocumentFragment();
            (node.nodeValue.match(/\S+|\s+/g) || []).forEach(function (tok) {
              if (/^\s+$/.test(tok)) {
                for (var s = 0; s < tok.length; s++) { var sp = document.createElement('span'); sp.className = 'tac-out__ch'; sp.textContent = tok[s]; frag.appendChild(sp); out.push(sp); }
              } else {
                var w = document.createElement('span'); w.className = 'tac-out__word';
                for (var c = 0; c < tok.length; c++) { var ch = document.createElement('span'); ch.className = 'tac-out__ch'; ch.textContent = tok[c]; w.appendChild(ch); out.push(ch); }
                frag.appendChild(w);
              }
            });
            root.replaceChild(frag, node);
          } else if (node.nodeType === 1) { split(node, out); }
        });
      }
      items.forEach(function (li) {
        var txt = li.querySelector('.tac-out__txt'); var chars = [];
        if (txt) split(txt, chars);
        li._chars = chars; li._arrow = li.querySelector('.tac-out__arrow');
      });
      function measure() {
        items.forEach(function (li) {
          var a = li._arrow; if (a) li._ab = { x: a.offsetLeft + a.offsetWidth / 2, y: a.offsetTop + a.offsetHeight / 2 };
          li._chars.forEach(function (ch) { ch._cx = ch.offsetLeft + ch.offsetWidth / 2; ch._cy = ch.offsetTop + ch.offsetHeight / 2; });
        });
      }
      function onScroll() {
        var total = track.offsetHeight - window.innerHeight;
        if (total <= 0) return;
        var p = cl(-track.getBoundingClientRect().top / total, 0, 1);
        var P = p * N;
        items.forEach(function (li, i) {
          var e = ease(cl(P - i, 0, 1));
          var chars = li._chars, n = chars.length;
          var fi = Math.floor(e * (n + 1));               // frontier: chars before this are erased
          for (var k = 0; k < n; k++) chars[k].style.visibility = (k < fi) ? 'hidden' : 'visible';
          var a = li._arrow;
          if (a && li._ab) {
            if (fi <= 0) { a.style.transform = 'translate(0px,0px)'; a.style.opacity = '1'; }
            else if (fi >= n) { a.style.opacity = '0'; }
            else { var t = chars[fi]; a.style.transform = 'translate(' + (t._cx - li._ab.x) + 'px,' + (t._cy - li._ab.y) + 'px)'; a.style.opacity = '1'; }
          }
        });
        if (tail) tail.style.opacity = String(cl((p - 0.9) / 0.1, 0, 1));
      }
      measure();
      if (tail) tail.style.opacity = '0';
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', function () { measure(); onScroll(); });
      onScroll();
    })();

    /* ---------- remy signature: handwrite reveal when scrolled into view ---------- */
    (function () {
      var img = document.querySelector('.tac-sign-img');
      if (!img) return;
      if (reduceMotion) { img.classList.add('is-written'); return; }
      function check() {
        var r = img.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.85 && r.bottom > 0) {
          img.classList.add('is-written');
          window.removeEventListener('scroll', check);
          return true;
        }
        return false;
      }
      if (!check()) window.addEventListener('scroll', check, { passive: true });
    })();

  });
})();

/* defer heavy cascade GIFs until after first paint (perf) */
window.addEventListener("load", function () { setTimeout(function () { document.body.classList.add("is-loaded"); }, 150); });
