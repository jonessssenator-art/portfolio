/**
 * GUDOVA GROUP — core interactions: header state, mobile menu,
 * active-nav tracking, certificate lightbox, analytics hooks.
 * No framework, no build step — plain DOM APIs only.
 */
(function () {
  'use strict';

  /* ---------- analytics ---------- */
  function track(name, data) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name }, data || {}));
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.debug('[analytics]', name, data || {});
    }
  }
  window.gudovaTrack = track;

  function wireAnalyticsHooks() {
    document.querySelectorAll('[data-analytics]').forEach(function (el) {
      el.addEventListener('click', function () {
        track(el.getAttribute('data-analytics'), { href: el.getAttribute('href') || null });
      });
    });
  }

  /* ---------- header scroll state ---------- */
  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var toggle = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
  }

  /* ---------- active nav link on scroll ---------- */
  function initActiveNav() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (section) map[id] = a;
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(function (a) { a.classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
  }

  /* ---------- mobile menu ---------- */
  function initMobileMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var menu = document.querySelector('.mobile-menu');
    if (!toggle || !menu) return;
    var lastFocused = null;
    menu.inert = true;

    function focusablesIn(container) {
      return Array.prototype.slice.call(
        container.querySelectorAll('a[href], button:not([disabled])')
      );
    }

    function open() {
      lastFocused = document.activeElement;
      menu.classList.add('is-open');
      menu.inert = false;
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Закрыть меню');
      document.body.style.overflow = 'hidden';
      var focusables = focusablesIn(menu);
      if (focusables[0]) focusables[0].focus();
      document.addEventListener('keydown', onKeydown);
    }

    function close() {
      menu.classList.remove('is-open');
      menu.inert = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Открыть меню');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeydown);
      if (lastFocused) lastFocused.focus();
    }

    // menu-toggle is hidden above 920px (full nav shows instead) — if the
    // viewport crosses that while the menu is open (rotate, resize a split
    // window), the close button disappears with the menu still covering
    // the screen and no way out except Escape
    var desktopQuery = window.matchMedia('(min-width:921px)');
    var onBreakpointChange = function (e) {
      if (e.matches && menu.classList.contains('is-open')) close();
    };
    if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', onBreakpointChange);
    else if (desktopQuery.addListener) desktopQuery.addListener(onBreakpointChange);

    function onKeydown(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {
        var focusables = focusablesIn(menu);
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    }

    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.contains('is-open');
      isOpen ? close() : open();
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });
  }

  /* ---------- lightbox (certificates + per-project photo galleries) ----------
     triggers are grouped by data-lightbox-group (default group for anything
     without one, which keeps the 3 certificate triggers behaving as before);
     prev/next only cycles within the clicked trigger's own group */
  function initLightbox() {
    var allTriggers = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
    var lightbox = document.querySelector('.lightbox');
    if (!allTriggers.length || !lightbox) return;

    var img = lightbox.querySelector('img');
    var caption = lightbox.querySelector('.lb-caption');
    var counter = lightbox.querySelector('.lb-counter');
    var closeBtn = lightbox.querySelector('.lb-close');
    var prevBtn = lightbox.querySelector('.lb-prev');
    var nextBtn = lightbox.querySelector('.lb-next');
    var groupTriggers = [];
    var index = 0;
    var lastFocused = null;
    lightbox.inert = true;

    function show(i) {
      index = (i + groupTriggers.length) % groupTriggers.length;
      var trigger = groupTriggers[index];
      img.src = trigger.getAttribute('data-lightbox');
      img.alt = trigger.getAttribute('data-caption') || (trigger.querySelector('img') ? trigger.querySelector('img').alt : '');
      caption.textContent = trigger.getAttribute('data-caption') || '';
      if (counter) counter.textContent = groupTriggers.length > 1 ? (index + 1) + ' / ' + groupTriggers.length : '';
      var multi = groupTriggers.length > 1;
      if (prevBtn) prevBtn.hidden = !multi;
      if (nextBtn) nextBtn.hidden = !multi;
    }

    function open(trigger) {
      var group = trigger.getAttribute('data-lightbox-group') || 'default';
      groupTriggers = allTriggers.filter(function (t) {
        return (t.getAttribute('data-lightbox-group') || 'default') === group;
      });
      var startIndex = groupTriggers.indexOf(trigger);
      lastFocused = document.activeElement;
      show(startIndex < 0 ? 0 : startIndex);
      lightbox.classList.add('is-open');
      lightbox.inert = false;
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
      document.addEventListener('keydown', onKeydown);
      track('lightbox_open', { group: group });
    }

    function close() {
      lightbox.classList.remove('is-open');
      lightbox.inert = true;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeydown);
      if (lastFocused) lastFocused.focus();
    }

    function onKeydown(e) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(index + 1);
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'Tab') {
        var focusables = [closeBtn, prevBtn, nextBtn].filter(Boolean);
        var first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }

    allTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () { open(trigger); });
    });
    closeBtn.addEventListener('click', close);
    if (prevBtn) prevBtn.addEventListener('click', function () { show(index - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(index + 1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) close();
    });
  }

  /* ---------- risk scanner accordion (mobile + desktop) ---------- */
  function initScanner() {
    var items = document.querySelectorAll('.scanner-item');
    var visualLayers = document.querySelectorAll('.scanner-visual .sv-layer');
    var visualNums = document.querySelectorAll('.scanner-visual .sv-num');
    var visualCaption = document.querySelector('.scanner-visual .sv-caption');
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        var isOpen = item.getAttribute('aria-expanded') === 'true';
        items.forEach(function (other) { other.setAttribute('aria-expanded', 'false'); });
        item.setAttribute('aria-expanded', String(!isOpen));
        var layerId = item.getAttribute('data-layer');
        visualLayers.forEach(function (l) {
          l.classList.toggle('is-active', l.getAttribute('data-layer') === layerId);
        });
        visualNums.forEach(function (n) {
          n.classList.toggle('is-active', n.getAttribute('data-num') === layerId);
        });
        if (visualCaption && !isOpen) {
          visualCaption.textContent = item.getAttribute('data-caption') || '';
        }
      });
    });
  }

  /* ---------- services sticky-scroll sync ---------- */
  function initServicesSync() {
    var entries = Array.prototype.slice.call(document.querySelectorAll('.svc-entry'));
    var stageLayers = document.querySelectorAll('.svc-stage .stg-layer');
    var stageCaption = document.querySelector('.svc-stage .stg-caption');
    if (!entries.length) return;

    function setActive(target) {
      var id = target.getAttribute('data-service');
      entries.forEach(function (el) { el.classList.toggle('is-active', el === target); });
      stageLayers.forEach(function (l) {
        l.classList.toggle('is-active', l.getAttribute('data-layer') === id);
      });
      if (stageCaption) stageCaption.textContent = target.getAttribute('data-caption') || '';
    }

    // Pick whichever entry's own center is closest to the viewport's
    // vertical center — deterministic, unlike a narrow rootMargin band
    // where two tall entries can both "intersect" at once and whichever
    // is later in DOM order silently wins, desyncing list vs stage.
    var ticking = false;
    function pickClosest() {
      ticking = false;
      var viewportCenter = window.innerHeight / 2;
      var closest = null;
      var closestDist = Infinity;
      entries.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var elCenter = rect.top + rect.height / 2;
        var dist = Math.abs(elCenter - viewportCenter);
        if (dist < closestDist) { closestDist = dist; closest = el; }
      });
      if (closest) setActive(closest);
    }
    function requestPick() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(pickClosest);
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(requestPick, { threshold: [0, 0.25, 0.5, 0.75, 1] });
      entries.forEach(function (el) { io.observe(el); });
    } else {
      window.addEventListener('scroll', requestPick, { passive: true });
    }
    pickClosest();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHeaderScroll();
    initActiveNav();
    initMobileMenu();
    initLightbox();
    initScanner();
    initServicesSync();
    wireAnalyticsHooks();
  });
})();
