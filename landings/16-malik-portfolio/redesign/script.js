(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- hard safety net: content must never stay hidden ----------
   * Every "reveal" element starts hidden in CSS and is only ever shown by
   * JS. If any external script (GSAP/Lenis/ScrollTrigger CDN) fails to
   * load or throws, that JS never runs — so without this, the whole page
   * would look blank. This runs on a plain timeout with no library
   * dependency and force-shows everything if nothing else already has. */
  const FORCE_REVEAL_MS = 1800;
  let revealed = false;
  // No early-return guard here on purpose: this sweep must stay safe to call
  // more than once (e.g. after revealHero() already ran) or below-the-fold
  // ScrollTrigger reveals that fire later get permanently orphaned once the
  // hero's own reveal has already flipped `revealed` to true. Every action
  // below is idempotent — re-applying a final state to an already-visible
  // element is a harmless no-op.
  function forceRevealAll() {
    document.body.classList.remove("is-loading");
    document.querySelectorAll(".reveal-line > span").forEach((el) => {
      el.style.transform = "translateY(0%)";
    });
    document.querySelectorAll(".reveal-up, .reveal-word").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
    document.querySelectorAll(".magnetic-btn").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "translate(0, 0)";
    });
  }
  setTimeout(forceRevealAll, FORCE_REVEAL_MS);
  window.addEventListener("load", () => setTimeout(forceRevealAll, 400));

  /* ---------- hero portrait: brief empty beat, then fade in with the headline ---------- */
  try {
    let portraitRevealed = false;
    function revealPortrait() {
      if (portraitRevealed) return;
      portraitRevealed = true;
      document.body.classList.add("is-revealed");
    }
    setTimeout(revealPortrait, 250);   // the deliberate "empty screen" beat
    setTimeout(revealPortrait, 2000);  // hard fallback
  } catch (err) {
    document.body.classList.add("is-revealed");
  }

  const hasGsap = typeof window.gsap !== "undefined";
  const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";
  const hasLenis = typeof window.Lenis !== "undefined";

  /* ---------- Lenis smooth scroll + GSAP/ScrollTrigger sync ---------- */

  if (hasGsap && hasScrollTrigger) {
    try {
      gsap.registerPlugin(ScrollTrigger);
      if (!reducedMotion && hasLenis) {
        const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      }
    } catch (err) {
      // fall through — sections still render via forceRevealAll
    }
  }

  /* ---------- scroll progress rail + section index (no library needed) ---------- */

  try {
    const progressFill = document.getElementById("progressFill");
    const sectionIndexEl = document.getElementById("sectionIndex");
    const sectionTotalEl = document.getElementById("sectionTotal");
    const sections = Array.from(document.querySelectorAll("main > section[data-section-label]"));
    if (sectionTotalEl) sectionTotalEl.textContent = String(sections.length).padStart(2, "0");

    function updateProgress() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      if (progressFill) progressFill.style.width = `${pct * 100}%`;
    }
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    if (hasGsap && hasScrollTrigger) {
      sections.forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: () => sectionIndexEl && (sectionIndexEl.textContent = String(i + 1).padStart(2, "0")),
          onEnterBack: () => sectionIndexEl && (sectionIndexEl.textContent = String(i + 1).padStart(2, "0")),
        });
      });
    } else {
      // plain-scroll fallback so the index still updates without GSAP
      window.addEventListener("scroll", () => {
        let current = 1;
        sections.forEach((section, i) => {
          if (section.getBoundingClientRect().top < window.innerHeight * 0.55) current = i + 1;
        });
        if (sectionIndexEl) sectionIndexEl.textContent = String(current).padStart(2, "0");
      }, { passive: true });
    }
  } catch (err) { /* progress rail is cosmetic — safe to skip on failure */ }

  /* ---------- custom cursor ---------- */

  try {
    const cursor = document.getElementById("cursor");
    if (hasFinePointer && cursor && hasGsap) {
      const dot = cursor.querySelector(".cursor__dot");
      const ring = cursor.querySelector(".cursor__ring");
      const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3" });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3" });
      const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });

      window.addEventListener("mousemove", (e) => {
        dotX(e.clientX); dotY(e.clientY);
        ringX(e.clientX); ringY(e.clientY);
        cursor.classList.remove("is-hidden");
      });
      document.addEventListener("mouseleave", () => cursor.classList.add("is-hidden"));

      document.querySelectorAll("a, button, .js-magnetic").forEach((el) => {
        el.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
        el.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
      });
    } else if (cursor) {
      cursor.remove();
    }
  } catch (err) {
    const cursor = document.getElementById("cursor");
    if (cursor) cursor.remove();
  }

  /* ---------- magnetic buttons ---------- */

  if (hasFinePointer && hasGsap) {
    try {
      document.querySelectorAll(".js-magnetic").forEach((el) => {
        const strength = parseFloat(el.dataset.magneticStrength || "0.4");
        const moveX = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
        const moveY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });

        el.addEventListener("mousemove", (e) => {
          const rect = el.getBoundingClientRect();
          moveX((e.clientX - (rect.left + rect.width / 2)) * strength);
          moveY((e.clientY - (rect.top + rect.height / 2)) * strength);
        });
        el.addEventListener("mouseleave", () => { moveX(0); moveY(0); });
      });
    } catch (err) { /* magnetic pull is a bonus interaction — safe to skip */ }
  }

  /* ---------- hero + finale: entrance / scroll reveal ---------- */

  if (hasGsap) {
    try {
      if (reducedMotion) {
        gsap.set(".hero__headline .reveal-line > span, .hero__eyebrow > span, .finale__headline .reveal-line > span", { y: "0%" });
        gsap.set(".hero__note, .hero__foot .magnetic-btn, .reveal-up, .reveal-word", { opacity: 1, y: 0 });
        forceRevealAll();
      } else {
        gsap.set(".hero__foot .magnetic-btn", { opacity: 0, y: 20 });

        function revealHero() {
          if (revealed) return; // forceRevealAll already ran — don't fight it with stale tweens
          const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
          tl.to(".hero__eyebrow > span", { y: "0%", duration: 0.9 }, 0.1)
            .to(".hero__headline .reveal-line > span", { y: "0%", duration: 1.1, stagger: 0.08 }, 0.25)
            .to(".hero__note", { opacity: 1, y: 0, duration: 0.8 }, 0.9)
            .to(".hero__foot .magnetic-btn", { opacity: 1, y: 0, duration: 0.8 }, 1.0);
          revealed = true;
          document.body.classList.remove("is-loading");
        }
        // same 250ms beat as revealPortrait() above — headline and the
        // particle portrait must appear together, not whenever every last
        // page resource (fonts, CDN scripts, all 8 sections' images) has
        // finished loading, which "load" could delay by seconds
        setTimeout(revealHero, 250);
        // belt and suspenders: if this never fires for some reason, the
        // top-level forceRevealAll() timeout still guarantees visibility

        if (hasScrollTrigger) {
          gsap.utils.toArray(".reveal-up").forEach((el) => {
            gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
          });
          gsap.to(".philosophy__quote .reveal-word", {
            opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.035,
            scrollTrigger: { trigger: ".philosophy__quote", start: "top 80%" },
          });
          gsap.to(".finale__headline .reveal-line > span", {
            y: "0%", duration: 1, ease: "power4.out", stagger: 0.1,
            scrollTrigger: { trigger: ".finale", start: "top 70%" },
          });
        }
      }
    } catch (err) {
      forceRevealAll();
    }
  } else {
    // GSAP itself never loaded — skip straight to plain visibility
    forceRevealAll();
  }

  /* ---------- accordions: Selected Works case detail, Branding Process steps ---------- */

  function initAccordion(rowSelector, headSelector, panelSelector) {
    const rows = Array.from(document.querySelectorAll(rowSelector));

    function close(row) {
      const panel = row.querySelector(panelSelector);
      panel.style.height = panel.scrollHeight + "px";
      requestAnimationFrame(() => { panel.style.height = "0px"; });
      row.dataset.open = "false";
    }

    function open(row) {
      const panel = row.querySelector(panelSelector);
      panel.style.height = "0px";
      const target = panel.scrollHeight;
      requestAnimationFrame(() => { panel.style.height = target + "px"; });
      row.dataset.open = "true";
      panel.addEventListener("transitionend", function onEnd() {
        panel.style.height = "auto";
        panel.removeEventListener("transitionend", onEnd);
      }, { once: true });
    }

    rows.forEach((row) => {
      const panel = row.querySelector(panelSelector);
      panel.style.overflow = "hidden";
      panel.style.height = row.dataset.open === "true" ? "auto" : "0px";
      if (!reducedMotion) panel.style.transition = "height 0.45s ease";

      const head = row.querySelector(headSelector);
      head.addEventListener("click", () => {
        const isOpen = row.dataset.open === "true";
        rows.forEach((r) => { if (r !== row && r.dataset.open === "true") close(r); });
        isOpen ? close(row) : open(row);
      });
    });
  }

  try {
    initAccordion(".work-row", ".js-work-toggle", ".work-row__panel");
    initAccordion(".process-row", ".js-process-toggle", ".process-row__body");
    initAccordion(".faq-row", ".js-faq-toggle", ".faq-row__panel");
  } catch (err) { /* accordions are progressive enhancement over static content */ }
})();
