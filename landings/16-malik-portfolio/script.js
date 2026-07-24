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

  function spawnRipple(x, y) {
    ripples.push({ x, y, radius: 0, alpha: 0.55, ring: 0 });
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function tick() {
    const rect = heroImage.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    ripples.forEach((r) => {
      r.radius += 6.5;
      r.alpha *= 0.965;

      for (let i = 0; i < 3; i++) {
        const ringRadius = r.radius - i * 26;
        if (ringRadius <= 0) continue;
        ctx.beginPath();
        ctx.arc(r.x, r.y, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(217, 217, 217, ${Math.max(r.alpha - i * 0.15, 0)})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
    });

    ripples = ripples.filter((r) => r.alpha > 0.02 && r.radius < Math.max(rect.width, rect.height) * 1.2);

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

  /* ---------- Rotating logo badge as you scroll ---------- */

  const spinLogo = document.getElementById("spinLogo");
  let lastRotation = 0;
  let ticking = false;

  function updateSpin() {
    lastRotation = window.scrollY * 0.18;
    spinLogo.style.transform = `rotate(${lastRotation}deg)`;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateSpin);
      ticking = true;
    }
  }, { passive: true });

  updateSpin();

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
