(() => {
  "use strict";

  /* ---------- Ripple / water-splash on hero photo click ---------- */

  const heroImage = document.getElementById("heroImage");
  const canvas = document.getElementById("rippleCanvas");
  const ctx = canvas.getContext("2d");
  let ripples = [];
  let rafId = null;

  function resizeCanvas() {
    const rect = heroImage.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function spawnRipple(x, y, ambient) {
    // ambient (auto-played) ripples are softer than a real click, so the
    // loop reads as a gentle living-water effect rather than noisy spam
    ripples.push({
      x, y, radius: 0,
      alpha: ambient ? 0.5 : 0.95,
      flash: ambient ? 0.35 : 1,
    });
    if (!rafId) rafId = requestAnimationFrame(tick);

    if (!ambient) {
      heroImage.classList.remove("is-hit");
      void heroImage.offsetWidth; // restart animation on repeated clicks
      heroImage.classList.add("is-hit");
    }
  }

  function tick() {
    const rect = heroImage.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    ripples.forEach((r) => {
      r.radius += 9.5;
      r.alpha *= 0.975;
      r.flash *= 0.8;

      if (r.flash > 0.015) {
        const burst = 90;
        const grad = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, burst);
        grad.addColorStop(0, `rgba(255, 255, 255, ${r.flash * 0.9})`);
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.beginPath();
        ctx.arc(r.x, r.y, burst, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      for (let i = 0; i < 5; i++) {
        const ringRadius = r.radius - i * 34;
        if (ringRadius <= 0) continue;
        ctx.beginPath();
        ctx.arc(r.x, r.y, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(r.alpha - i * 0.14, 0)})`;
        ctx.lineWidth = Math.max(5 - i * 0.7, 1.5);
        ctx.stroke();
      }
    });

    ripples = ripples.filter((r) => r.alpha > 0.02 && r.radius < Math.max(rect.width, rect.height) * 1.3);

    if (ripples.length > 0) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  }

  heroImage.addEventListener("click", (e) => {
    const rect = heroImage.getBoundingClientRect();
    spawnRipple(e.clientX - rect.left, e.clientY - rect.top);
  });

  /* ---------- Ambient auto-ripples — plays on its own, click adds a bigger splash on top ---------- */

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let ambientTimer = null;

  function spawnAmbientRipple() {
    const rect = heroImage.getBoundingClientRect();
    const margin = 0.18; // keep clear of the very edges
    const x = rect.width * (margin + Math.random() * (1 - margin * 2));
    const y = rect.height * (margin + Math.random() * (1 - margin * 2));
    spawnRipple(x, y, true);
  }

  function scheduleAmbientRipple() {
    const delay = 2800 + Math.random() * 2400;
    ambientTimer = setTimeout(() => {
      spawnAmbientRipple();
      scheduleAmbientRipple();
    }, delay);
  }

  if (!prefersReducedMotion) {
    // only runs while the photo is actually on screen — no point animating
    // (or spending battery on) something the visitor can't see
    const rippleVisibility = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !ambientTimer) {
          scheduleAmbientRipple();
        } else if (!entry.isIntersecting && ambientTimer) {
          clearTimeout(ambientTimer);
          ambientTimer = null;
        }
      });
    }, { threshold: 0.2 });
    rippleVisibility.observe(heroImage);
  }

  /* ---------- Rotating logo badge as you scroll ---------- */

  const spinLogo = document.getElementById("spinLogo");

  function updateSpin() {
    const rotation = window.scrollY * 0.18;
    spinLogo.style.transform = `rotate(${rotation}deg)`;
  }

  /* ---------- Hero badge icons drift/parallax while scrolling block 1 ---------- */

  const heroSection = document.getElementById("hero");
  const parallaxMark = document.getElementById("parallaxMark");
  const parallaxCircle = document.getElementById("parallaxCircle");

  function updateHeroParallax() {
    const rect = heroSection.getBoundingClientRect();
    // 0 while the hero top is at/below the viewport top, 1 once it has fully scrolled past
    let progress = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
    // dead zone: ignore trackpad rubber-band/bounce jitter right at the top
    // of the page so the row sits dead still until you actually scroll
    if (progress < 0.02) progress = 0;

    // icon + caption move together as one unit (see .hero__badge-parallax) —
    // the CSS transition on that class smooths each step into a "float"
    if (parallaxMark) {
      parallaxMark.style.transform = `translateY(${progress * -42}px)`;
    }
    if (parallaxCircle) {
      parallaxCircle.style.transform = `translateY(${progress * -58}px)`;
    }
  }

  let ticking = false;
  function onScroll() {
    updateSpin();
    updateHeroParallax();
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  onScroll();

  /* ---------- Case modal (Behance-style project view) ---------- */

  const modal = document.getElementById("caseModal");
  const modalTitle = document.getElementById("caseModalTitle");
  const modalSub = document.getElementById("caseModalSub");
  const modalClose = document.getElementById("caseModalClose");
  let lastFocused = null;

  function openModal(title, sub) {
    modalTitle.textContent = title;
    modalSub.textContent = sub;
    modal.classList.add("is-open");
    lastFocused = document.activeElement;
    modalClose.focus();
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll(".js-open-case").forEach((card) => {
    card.addEventListener("click", () => {
      openModal(card.dataset.title || "", card.dataset.sub || "");
    });
  });

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });
})();
