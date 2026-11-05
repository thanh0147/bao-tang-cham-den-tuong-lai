/* Bảo tàng Chạm Đến Tương Lai — hiệu ứng chuyển động (GSAP 3) */
(function () {
  'use strict';
  var root = document.documentElement;
  function done() { root.classList.remove('pt-in', 'intro'); }
  if (!window.gsap) { done(); return; }
  var g = window.gsap, ST = window.ScrollTrigger;
  if (ST) g.registerPlugin(ST);
  var reduce = root.classList.contains('calm');
  var COLORS = ['#5fd38d', '#f5b642', '#ff6fa3', '#5cb3ff', '#f2c46d'];
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ---------- pháo giấy ---------- */
  function confetti(x, y, n, spread) {
    if (reduce) return;
    n = n || 18; spread = spread || 160;
    for (var i = 0; i < n; i++) {
      var p = document.createElement('i'); p.className = 'cf';
      p.style.background = COLORS[i % COLORS.length];
      if (i % 3 === 0) p.style.borderRadius = '50%';
      document.body.appendChild(p);
      var dx = (Math.random() - .5) * spread * 2, up = 60 + Math.random() * 140;
      g.set(p, { x: x, y: y, rotation: Math.random() * 360 });
      g.timeline({ onComplete: p.remove.bind(p) })
        .to(p, { x: x + dx * .6, y: y - up, rotation: '+=' + (Math.random() * 360), duration: .45, ease: 'power2.out' })
        .to(p, { x: x + dx, y: y - up + 260 + Math.random() * 200, rotation: '+=' + (Math.random() * 540), opacity: 0, duration: 1.1, ease: 'power1.in' });
    }
  }
  function burstFrom(el, n, spread) { var r = el.getBoundingClientRect(); confetti(r.left + r.width / 2, r.top + r.height / 2, n, spread); }
  window.museumConfetti = burstFrom;

  /* ---------- chuyển trang ---------- */
  var pt = document.createElement('div'); pt.className = 'pt'; pt.setAttribute('aria-hidden', 'true');
  COLORS.forEach(function (c) { var s = document.createElement('i'); s.style.background = c; pt.appendChild(s); });
  document.body.appendChild(pt);
  var bars = $$('i', pt);
  if (root.classList.contains('pt-in') && !reduce) {
    g.set(bars, { scaleY: 1, transformOrigin: '50% 0%' });
    root.classList.remove('pt-in');
    g.to(bars, { scaleY: 0, duration: .55, ease: 'power3.inOut', stagger: .06, delay: .05 });
  } else { g.set(bars, { scaleY: 0 }); root.classList.remove('pt-in'); }
  function leave(href) {
    if (reduce) { location.href = href; return; }
    ss('btctl-pt', '1');
    g.set(bars, { transformOrigin: '50% 100%' });
    g.to(bars, { scaleY: 1, duration: .42, ease: 'power3.in', stagger: .05, onComplete: function () { location.href = href; } });
  }
  window.museumGo = leave;
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    var href = a.getAttribute('href');
    if (!/^[\w-]+\.html(#.*)?$/.test(href)) return;
    e.preventDefault(); leave(href);
  });
  window.addEventListener('pageshow', function (e) { if (e.persisted) g.set(bars, { scaleY: 0 }); });

  /* ---------- cửa bảo tàng (trang tổng, lần đầu mỗi phiên) ---------- */
  var doors = $('.doors');
  if (doors && root.classList.contains('intro')) {
    ss('btctl-intro', '1');
    var tl = g.timeline({ onComplete: function () { root.classList.remove('intro'); } });
    tl.from('.doors .em > *', { y: 24, opacity: 0, stagger: .12, duration: .5, ease: 'back.out(2)' })
      .to('.doors .em', { opacity: 0, scale: .9, duration: .35, delay: .55 })
      .to('.doors .dl', { xPercent: -100, duration: 1, ease: 'power3.inOut' }, '<')
      .to('.doors .dr', { xPercent: 100, duration: 1, ease: 'power3.inOut' }, '<');
    doors.addEventListener('click', function () { tl.progress(1); });
  } else root.classList.remove('intro');

  if (reduce) return;

  /* ---------- tiêu đề sân khấu ---------- */
  g.from('.st-title > *', { y: 26, opacity: 0, duration: .7, stagger: .12, ease: 'power3.out', delay: root.classList.contains('intro') ? 1.6 : .2, clearProps: 'opacity,transform' });
  g.from('.st-ctrl > *', { y: 30, opacity: 0, duration: .5, stagger: .07, ease: 'back.out(2)', delay: .5, clearProps: 'opacity,transform' });

  /* ---------- nút Khám phá nhấp nháy mời bấm ---------- */
  var tour = $('#tour');
  if (tour) {
    var pulse = g.to(tour, { scale: 1.07, duration: .7, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2 });
    var stopPulse = function () { pulse.kill(); g.to(tour, { scale: 1, duration: .2 }); };
    tour.addEventListener('click', stopPulse, { once: true });
    tour.addEventListener('pointerenter', stopPulse, { once: true });
    $$('.pin').forEach(function (p) { p.addEventListener('click', stopPulse, { once: true }); });
  }

  /* ---------- điểm sáng hiện dần khi mô hình sẵn sàng ---------- */
  var stage = $('#stage');
  if (stage) {
    var popPins = function () { g.fromTo('.pin', { opacity: 0 }, { opacity: 1, duration: .5, stagger: .15, delay: .3, clearProps: 'opacity' }); };
    if (stage.classList.contains('ready')) popPins();
    else new MutationObserver(function (m, o) { if (stage.classList.contains('ready')) { o.disconnect(); popPins(); } }).observe(stage, { attributes: true, attributeFilter: ['class'] });
    var card = $('#spotcard');
    if (card) new MutationObserver(function () {
      if (card.hidden) return;
      g.fromTo(card, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .4, ease: 'power3.out', overwrite: true });
      g.from(card.querySelectorAll('.ic, small, b, p, a'), { y: 10, opacity: 0, duration: .35, stagger: .06, delay: .1, clearProps: 'opacity,transform' });
    }).observe(card, { childList: true });
  }

  /* ---------- hiện dần khi cuộn ---------- */
  if (ST) {
    var groups = [['.about .txt > *', 0], ['.photos .polaroid', 1], ['.facts .fact', 0], ['.cta', 0], ['.ch-grid .ch', 0], ['.next', 0], ['.zones .zcard', 0], ['.passport', 0], ['.flow li', 0], ['.tech > div', 0], ['section > h2', 0]];
    groups.forEach(function (gr) {
      var els = $$(gr[0]); if (!els.length) return;
      if (gr[1]) {
        els.forEach(function (el, i) { g.from(el, { y: 60, rotation: i ? 14 : -14, opacity: 0, duration: .9, ease: 'back.out(1.4)', delay: i * .12, scrollTrigger: { trigger: el, start: 'top 92%', once: true }, clearProps: 'all' }); });
        return;
      }
      g.set(els, { y: 36, opacity: 0 });
      ST.batch(els, { start: 'top 92%', once: true, onEnter: function (b) { g.to(b, { y: 0, opacity: 1, duration: .7, stagger: .09, ease: 'power3.out', clearProps: 'transform,opacity' }); } });
    });
  }

  /* ---------- con số tự đếm ---------- */
  $$('.fact b').forEach(function (b) {
    var txt = b.textContent.trim(), m = txt.match(/^(~?)(\d+)(?:,(\d+))?(\D*)$/);
    if (!m || txt.indexOf('/') >= 0) return;
    var pre = m[1], dec = m[3] ? m[3].length : 0, target = parseFloat(m[2] + (m[3] ? '.' + m[3] : '')), suf = m[4];
    var big = target >= 1000 && !dec, obj = { v: big ? Math.round(target * .7) : 0 };
    var paint = function () { b.textContent = pre + (dec ? obj.v.toFixed(dec).replace('.', ',') : Math.round(obj.v)) + suf; };
    paint();
    var run = function () { g.to(obj, { v: target, duration: 1.6, ease: 'power2.out', onUpdate: paint }); };
    if (ST) ST.create({ trigger: b, start: 'top 90%', once: true, onEnter: run }); else run();
  });

  /* ---------- thẻ nghiêng theo chuột ---------- */
  if (window.matchMedia('(hover: hover)').matches) {
    $$('.fact, .zcard, .tech > div').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        g.to(el, { rotationY: px * 12, rotationX: -py * 12, transformPerspective: 700, duration: .4, ease: 'power2.out' });
      });
      el.addEventListener('pointerleave', function () { g.to(el, { rotationY: 0, rotationX: 0, duration: .6, ease: 'elastic.out(1,.5)' }); });
    });
  }

  /* ---------- đố vui ---------- */
  var qb = $('#qbody');
  if (qb) {
    qb.addEventListener('click', function (e) {
      var b = e.target.closest('.opt'); if (!b) return;
      setTimeout(function () {
        if (b.classList.contains('right')) { burstFrom(b, 26, 180); g.fromTo(b, { scale: .96 }, { scale: 1, duration: .5, ease: 'back.out(4)' }); }
        else if (b.classList.contains('wrong')) g.fromTo(b, { x: -10 }, { x: 0, duration: .5, ease: 'elastic.out(1.2,.3)' });
        var ex = qb.querySelector('.explain'); if (ex) g.from(ex, { y: 12, opacity: 0, duration: .35, clearProps: 'all' });
      }, 0);
    });
    new MutationObserver(function () {
      var res = qb.querySelector('.result');
      if (res && !res.dataset.anim) {
        res.dataset.anim = 1;
        g.from(res.querySelector('.tr'), { scale: 0, rotation: -40, duration: .7, ease: 'back.out(2.5)' });
        g.from(res.querySelectorAll('.stars > span'), { scale: 0, opacity: 0, duration: .45, stagger: .18, delay: .3, ease: 'back.out(3)' });
        if (res.querySelectorAll('.stars .on').length === 3) setTimeout(function () { burstFrom(res, 50, 260); }, 700);
      } else if (!res) {
        g.from(qb.querySelectorAll('.qtext, .opt'), { x: 30, opacity: 0, duration: .4, stagger: .06, ease: 'power2.out', clearProps: 'all' });
      }
    }).observe(qb, { childList: true });
  }

  /* ---------- thử thách ---------- */
  var chs = $('#challenge');
  if (chs) chs.addEventListener('change', function (e) {
    var lab = e.target.closest('.ch'); if (!lab) return;
    if (e.target.checked) {
      g.fromTo(lab, { scale: .9 }, { scale: 1, duration: .6, ease: 'back.out(4)', clearProps: 'transform' });
      g.fromTo(lab.querySelector('.tick'), { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: .5, ease: 'back.out(3)', clearProps: 'transform' });
      burstFrom(lab, 12, 90);
      if (chs.querySelectorAll('input:checked').length === chs.querySelectorAll('input').length) setTimeout(function () { burstFrom(chs, 60, 320); }, 250);
    }
  });

  /* ---------- tem hành trình ---------- */
  var stamps = $$('.passport .t.on, .zcard .stamp.on');
  if (stamps.length) {
    var stampIn = function () { g.from(stamps, { scale: 2.4, rotation: -35, opacity: 0, duration: .55, stagger: .15, ease: 'back.out(1.8)', clearProps: 'transform,opacity' }); };
    if (ST) ST.create({ trigger: stamps[0], start: 'top 90%', once: true, onEnter: stampIn }); else stampIn();
  }
})();
