/* =========================================================================
   ГрузПоРоссии — интерактив лендинга
   ========================================================================= */
(function () {
  'use strict';
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Шапка: «прилипание» при скролле ---------- */
  var header = $('#header');
  var toTop  = $('#toTop');
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    if (header) header.classList.toggle('is-stuck', y > 24);
    if (toTop)  toTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Мобильное меню ---------- */
  var burger  = $('#burger');
  var mobile  = $('#mobileNav');
  var scrim   = $('#scrim');
  var mClose  = $('#mClose');
  function setInert(on) { if (!mobile) return; if (on) mobile.setAttribute('inert', ''); else mobile.removeAttribute('inert'); }
  function openMenu()  {
    if (!mobile || !scrim) return;
    mobile.classList.add('open'); scrim.classList.add('open'); setInert(false);
    if (burger) { burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', 'Закрыть меню'); }
    document.body.style.overflow = 'hidden';
    if (mClose) mClose.focus();
  }
  function closeMenu() {
    if (!mobile || !scrim) return;
    if (burger && mobile.contains(document.activeElement)) burger.focus();
    mobile.classList.remove('open'); scrim.classList.remove('open'); setInert(true);
    if (burger) { burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Открыть меню'); }
    document.body.style.overflow = '';
  }
  setInert(true); // закрыто по умолчанию — не в порядке табуляции
  if (burger) burger.addEventListener('click', openMenu);
  if (mClose) mClose.addEventListener('click', closeMenu);
  if (scrim)  scrim.addEventListener('click', closeMenu);
  $$('.mobile-nav a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeMenu(); return; }
    if (e.key === 'Tab' && mobile && mobile.classList.contains('open')) {
      var f = $$('a[href], button', mobile).filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Калькулятор стоимости ---------- */
  var RATE = 7; // ₽ за км
  var kmInput = $('#kmInput');
  var kmRange = $('#kmRange');
  var calcOut = $('#calcOut');
  var quickBtns = $$('.calc__quick button');

  function fmt(n) {
    // разбивка на разряды неразрывным пробелом
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  var animId = null;
  function setResult(value) {
    if (!calcOut) return;
    if (reduceMotion) { calcOut.textContent = fmt(value); return; }
    var start = parseInt((calcOut.textContent || '0').replace(/\D/g, ''), 10) || 0;
    var t0 = null, dur = 420;
    if (animId) cancelAnimationFrame(animId);
    function tick(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      calcOut.textContent = fmt(start + (value - start) * eased);
      if (p < 1) animId = requestAnimationFrame(tick);
    }
    animId = requestAnimationFrame(tick);
  }
  function recalc(km) {
    var v = Math.max(0, Math.min(20000, isNaN(km) ? 0 : km));
    setResult(v * RATE);
    quickBtns.forEach(function (b) { b.classList.toggle('is-active', parseInt(b.getAttribute('data-km'), 10) === Math.round(v)); });
  }
  if (kmInput) {
    kmInput.addEventListener('input', function () {
      var v = parseInt(kmInput.value, 10);
      if (kmRange && !isNaN(v)) kmRange.value = Math.min(v, parseInt(kmRange.max, 10));
      recalc(v);
    });
  }
  if (kmRange) {
    kmRange.addEventListener('input', function () {
      var v = parseInt(kmRange.value, 10);
      if (kmInput) kmInput.value = v;
      recalc(v);
    });
  }
  quickBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var km = parseInt(b.getAttribute('data-km'), 10);
      if (kmInput) kmInput.value = km;
      if (kmRange) kmRange.value = Math.min(km, parseInt(kmRange.max, 10));
      recalc(km);
    });
  });
  // первичный расчёт
  if (kmInput) recalc(parseInt(kmInput.value, 10));

  /* ---------- Маска телефона ---------- */
  var phone = $('#fPhone');
  function maskPhone(raw) {
    var d = raw.replace(/\D/g, '');
    if (!d) return '';
    // убираем код страны (одну ведущую 7 или 8) — остаётся 10-значный номер
    if (d[0] === '7' || d[0] === '8') d = d.slice(1);
    d = d.slice(0, 10);
    if (!d.length) return '';
    var out = '+7';
    out += ' (' + d.slice(0, 3);
    if (d.length >= 3) out += ') ' + d.slice(3, 6);
    if (d.length > 6)  out += '-' + d.slice(6, 8);
    if (d.length > 8)  out += '-' + d.slice(8, 10);
    return out;
  }
  if (phone) {
    phone.addEventListener('input', function () {
      phone.value = maskPhone(phone.value);
    });
  }

  /* ---------- Валидация и отправка формы ---------- */
  var form = $('#leadForm');
  var success = $('#formSuccess');
  function markInvalid(field, bad) {
    var wrap = field.closest('.field');
    if (wrap) wrap.classList.toggle('invalid', bad);
  }
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name  = $('#fName');
      var ph    = $('#fPhone');
      var ok = true;
      if (!name.value.trim())            { markInvalid(name, true); ok = false; } else markInvalid(name, false);
      var digits = ph.value.replace(/\D/g, '');
      if (digits.length < 11)            { markInvalid(ph, true);   ok = false; } else markInvalid(ph, false);
      if (!ok) {
        var firstBad = $('.field.invalid input');
        if (firstBad) firstBad.focus();
        return;
      }
      // демо-отправка: показываем успех (реальная интеграция подключается на стороне клиента)
      form.style.display = 'none';
      if (success) {
        success.classList.add('show');
        success.setAttribute('tabindex', '-1');
        success.focus();
      }
    });
    // снимаем ошибку при вводе
    $$('#leadForm input, #leadForm textarea').forEach(function (el) {
      el.addEventListener('input', function () { markInvalid(el, false); });
    });
  }

  /* ---------- Скролл-спай для навигации ---------- */
  var navLinks = $$('.nav a');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    navLinks.forEach(function (a) {
      var id = a.getAttribute('href');
      if (id && id.charAt(0) === '#') map[id.slice(1)] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          navLinks.forEach(function (a) { a.classList.remove('is-active'); });
          map[en.target.id].classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- Появление блоков (с самовосстановлением) ---------- */
  function revealAll() { $$('.reveal').forEach(function (el) { el.classList.add('in'); }); }

  if (reduceMotion) {
    revealAll();
  } else if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });

    var observe = function (el) { io.observe(el); };
    $$('.reveal').forEach(observe);

    // ловим блоки, добавленные позже
    if ('MutationObserver' in window) {
      new MutationObserver(function (muts) {
        muts.forEach(function (m) {
          Array.prototype.forEach.call(m.addedNodes, function (node) {
            if (node.nodeType !== 1) return;
            if (node.classList && node.classList.contains('reveal')) observe(node);
            if (node.querySelectorAll) $$('.reveal', node).forEach(observe);
          });
        });
      }).observe(document.body, { childList: true, subtree: true });
    }

    // подстраховка: если что-то близко к экрану/внизу — показать
    var sweep = function () {
      var vh = window.innerHeight;
      $$('.reveal:not(.in)').forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh + 300) el.classList.add('in');
      });
      if (window.innerHeight + window.pageYOffset >= document.body.scrollHeight - 4) revealAll();
    };
    window.addEventListener('scroll', sweep, { passive: true });
    window.addEventListener('resize', sweep, { passive: true });
    sweep();
    // финальная гарантия: ничего не остаётся невидимым
    window.addEventListener('load', function () { setTimeout(sweep, 200); });
    setTimeout(revealAll, 4000);
  } else {
    revealAll();
  }

  /* ---------- Год в подвале (если потребуется) ---------- */
  // (статический 2026 уже в разметке)
})();
