/* =========================================================================
   CONCEPT DETAILING — интерактив лендинга
   ========================================================================= */
(function () {
  'use strict';
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Шапка: «прилипание» + кнопка наверх ---------- */
  var header = $('#header');
  var toTop  = $('#toTop');
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    if (header) header.classList.toggle('is-stuck', y > 24);
    if (toTop)  toTop.classList.toggle('show', y > 620);
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
  setInert(true);
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

  /* ---------- Табы каталога услуг (ARIA tab pattern) ---------- */
  var tabs = $$('.svc-tab');
  // связываем табы с панелями для скринридеров + роуминг-фокус
  tabs.forEach(function (tab) {
    var key = tab.getAttribute('data-tab');
    var panel = document.getElementById('panel-' + key);
    if (!tab.id) tab.id = 'tab-' + key;
    tab.setAttribute('aria-controls', 'panel-' + key);
    tab.setAttribute('tabindex', tab.classList.contains('is-active') ? '0' : '-1');
    if (panel) { panel.setAttribute('aria-labelledby', tab.id); panel.setAttribute('tabindex', '0'); }
  });
  function activateTab(tab, focus) {
    var key = tab.getAttribute('data-tab');
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.setAttribute('tabindex', on ? '0' : '-1');
    });
    $$('.svc-panel').forEach(function (p) {
      p.classList.toggle('is-active', p.id === 'panel-' + key);
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { activateTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var d = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1
            : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1
            : e.key === 'Home' ? -i : e.key === 'End' ? tabs.length - 1 - i : null;
      if (d === null) return;
      e.preventDefault();
      activateTab(tabs[(i + d + tabs.length) % tabs.length], true);
    });
  });

  /* ---------- Калькулятор стоимости ---------- */
  var calcService = $('#calcService');
  var calcClass   = $('#calcClass');
  var calcOut     = $('#calcOut');

  function fmt(n) {
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  var animId = null;
  function setResult(value) {
    if (!calcOut) return;
    if (reduceMotion) { calcOut.textContent = fmt(value); return; }
    var start = parseInt((calcOut.textContent || '0').replace(/\D/g, ''), 10) || 0;
    var t0 = null, dur = 450;
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
  function recalc() {
    if (!calcService || !calcClass) return;
    var base = parseFloat(calcService.value) || 0;
    var mult = parseFloat(calcClass.value) || 1;
    var total = Math.round(base * mult / 100) * 100; // округление до 100 ₽
    setResult(total);
  }
  if (calcService) calcService.addEventListener('change', recalc);
  if (calcClass)   calcClass.addEventListener('change', recalc);
  recalc();

  /* ---------- Слайдеры «До / После» ---------- */
  $$('[data-ba]').forEach(function (ba) {
    var range = $('.ba__range', ba);
    if (!range) return;
    function apply() {
      ba.style.setProperty('--p', range.value + '%');
      range.setAttribute('aria-valuetext', range.value + '% — «После»');
    }
    range.addEventListener('input', apply);
    apply();
  });

  /* ---------- FAQ-аккордеон ---------- */
  var faqItems = $$('.faq__item');
  faqItems.forEach(function (item, i) {
    var q = $('.faq__q', item);
    var a = $('.faq__a', item);
    if (!q || !a) return;
    if (!a.id) a.id = 'faq-a-' + i;
    q.setAttribute('aria-controls', a.id);
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      // закрыть остальные (аккордеон)
      faqItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove('open');
          var oq = $('.faq__q', other), oa = $('.faq__a', other);
          if (oq) oq.setAttribute('aria-expanded', 'false');
          if (oa) oa.style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        q.setAttribute('aria-expanded', 'false');
        a.style.maxHeight = null;
      } else {
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });
  // пересчёт высоты открытого ответа при ресайзе
  window.addEventListener('resize', function () {
    faqItems.forEach(function (item) {
      if (item.classList.contains('open')) {
        var a = $('.faq__a', item);
        if (a) a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  }, { passive: true });

  /* ---------- Маска телефона ---------- */
  var phone = $('#fPhone');
  function maskPhone(raw) {
    var d = raw.replace(/\D/g, '');
    if (!d) return '';
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
  if (phone) phone.addEventListener('input', function () { phone.value = maskPhone(phone.value); });

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
      var name = $('#fName'), ph = $('#fPhone'), ok = true;
      if (!name.value.trim()) { markInvalid(name, true); ok = false; } else markInvalid(name, false);
      var digits = ph.value.replace(/\D/g, '');
      if (digits.length < 11) { markInvalid(ph, true); ok = false; } else markInvalid(ph, false);
      if (!ok) {
        var firstBad = $('.field.invalid input');
        if (firstBad) firstBad.focus();
        return;
      }
      // отправка заявки в WhatsApp менеджеру (Мухтар) — статичный сайт, без сервера
      var WA_NUMBER = '79996466779';
      var svcEl = $('#fService'), comEl = $('#fComment');
      var parts = ['Здравствуйте! Заявка с сайта Concept Detailing:'];
      parts.push('Имя: ' + name.value.trim());
      parts.push('Телефон: ' + ph.value.trim());
      if (svcEl && svcEl.value) parts.push('Услуга: ' + svcEl.value);
      if (comEl && comEl.value.trim()) parts.push('Комментарий: ' + comEl.value.trim());
      var waUrl = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(parts.join('\n'));
      window.open(waUrl, '_blank', 'noopener');
      // показываем подтверждение
      form.style.display = 'none';
      if (success) { success.classList.add('show'); success.focus(); }
    });
    $$('#leadForm input, #leadForm textarea, #leadForm select').forEach(function (el) {
      el.addEventListener('input', function () { markInvalid(el, false); });
    });
  }

  /* ---------- Скролл-спай навигации ---------- */
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
    window.addEventListener('load', function () { setTimeout(sweep, 200); });
    setTimeout(revealAll, 4000);
  } else {
    revealAll();
  }
})();
