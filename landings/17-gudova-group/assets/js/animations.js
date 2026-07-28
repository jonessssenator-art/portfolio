/**
 * GUDOVA GROUP — scroll motion via GSAP + ScrollTrigger (CDN).
 * Progressive enhancement only: every element is fully visible by
 * default in main.css. This file *adds* a reveal on top once GSAP is
 * confirmed loaded — if the CDN fails or the user prefers reduced
 * motion, the page still reads correctly with zero animation.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;
  if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;

  var gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);

  function revealHeads() {
    var heads = document.querySelectorAll('.section-head, .founder-role, .founder-name, .founder-manifesto, .founder-quote');
    heads.forEach(function (el) {
      gsap.from(el, {
        y: 24,
        opacity: 0,
        duration: .7,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });
  }

  function revealPanels(selector, stagger) {
    document.querySelectorAll(selector).forEach(function (group) {
      var items = group.children.length ? Array.prototype.slice.call(group.children) : [group];
      gsap.from(items, {
        y: 20,
        opacity: 0,
        duration: .6,
        ease: 'power2.out',
        stagger: stagger || .08,
        scrollTrigger: { trigger: group, start: 'top 88%' }
      });
    });
  }

  function drawTimeline() {
    var timeline = document.querySelector('.timeline');
    if (!timeline) return;
    var line = document.createElement('div');
    line.className = 'tl-progress';
    line.style.cssText = 'position:absolute;left:-1px;top:0;width:2px;height:0;background:var(--copper);';
    timeline.style.position = 'relative';
    timeline.appendChild(line);
    gsap.to(line, {
      height: '100%',
      ease: 'none',
      scrollTrigger: { trigger: timeline, start: 'top 70%', end: 'bottom 80%', scrub: .6 }
    });
  }

  function heroEntrance() {
    var tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    tl.from('.hero-copy .eyebrow', { y: 14, opacity: 0, duration: .5 })
      .from('.hero-copy h1', { y: 20, opacity: 0, duration: .7 }, '-=.3')
      .from('.hero-copy .lede', { y: 14, opacity: 0, duration: .6 }, '-=.4')
      .from('.hero-copy .audience', { y: 10, opacity: 0, duration: .5 }, '-=.4')
      .from('.hero-ctas .btn', { y: 10, opacity: 0, duration: .5, stagger: .08 }, '-=.3')
      .from('.hero-stage', { opacity: 0, duration: .8 }, '-=.6');
  }

  document.addEventListener('DOMContentLoaded', function () {
    heroEntrance();
    revealHeads();
    // .svc-list is deliberately NOT reveal-animated here: its items'
    // opacity is driven live by initServicesSync() in app.js (dims
    // inactive services, highlights the current one as you scroll).
    // GSAP's tween leaves an inline opacity style behind that beats
    // the .is-active CSS rule on specificity, permanently freezing
    // whichever service happened to be active when the reveal fired
    // (confirmed live: list and stage panel stayed out of sync).
    revealPanels('.proj-panel .pp-body > *', .06);
    revealPanels('.testi-grid', .08);
    revealPanels('.price-cards', .06);
    drawTimeline();
  });
})();
