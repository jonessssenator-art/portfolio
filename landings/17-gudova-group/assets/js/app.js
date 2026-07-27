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

    function focusablesIn(container) {
      return Array.prototype.slice.call(
        container.querySelectorAll('a[href], button:not([disabled])')
      );
    }

    function open() {
      lastFocused = document.activeElement;
      menu.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var focusables = focusablesIn(menu);
      if (focusables[0]) focusables[0].focus();
      document.addEventListener('keydown', onKeydown);
    }

    function close() {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeydown);
      if (lastFocused) lastFocused.focus();
    }

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

  /* ---------- certificate lightbox ---------- */
  function initLightbox() {
    var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
    var lightbox = document.querySelector('.lightbox');
    if (!triggers.length || !lightbox) return;

    var img = lightbox.querySelector('img');
    var caption = lightbox.querySelector('.lb-caption');
    var closeBtn = lightbox.querySelector('.lb-close');
    var prevBtn = lightbox.querySelector('.lb-prev');
    var nextBtn = lightbox.querySelector('.lb-next');
    var index = 0;
    var lastFocused = null;

    function show(i) {
      index = (i + triggers.length) % triggers.length;
      var trigger = triggers[index];
      img.src = trigger.getAttribute('data-lightbox');
      img.alt = trigger.querySelector('img') ? trigger.querySelector('img').alt : '';
      caption.textContent = trigger.getAttribute('data-caption') || '';
    }

    function open(i) {
      lastFocused = document.activeElement;
      show(i);
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
      document.addEventListener('keydown', onKeydown);
      track('certificate_open', { index: i });
    }

    function close() {
      lightbox.classList.remove('is-open');
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

    triggers.forEach(function (trigger, i) {
      trigger.addEventListener('click', function () { open(i); });
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
        if (visualCaption && !isOpen) {
          visualCaption.textContent = item.getAttribute('data-caption') || '';
        }
      });
    });
  }

  /* ---------- services sticky-scroll sync ---------- */
  function initServicesSync() {
    var entries = document.querySelectorAll('.svc-entry');
    var stageLayers = document.querySelectorAll('.svc-stage .stg-layer');
    var stageCaption = document.querySelector('.svc-stage .stg-caption');
    if (!entries.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (obsEntries) {
      obsEntries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute('data-service');
        entries.forEach(function (el) { el.classList.remove('is-active'); });
        entry.target.classList.add('is-active');
        stageLayers.forEach(function (l) {
          l.classList.toggle('is-active', l.getAttribute('data-layer') === id);
        });
        if (stageCaption) stageCaption.textContent = entry.target.getAttribute('data-caption') || '';
      });
    }, { rootMargin: '-40% 0px -40% 0px' });
    entries.forEach(function (el) { io.observe(el); });
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
