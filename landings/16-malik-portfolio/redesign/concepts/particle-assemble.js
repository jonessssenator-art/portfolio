/*
 * On load, samples the already-visible portrait image into a grid of
 * particles, scatters each one off-screen on one of the four sides, then
 * animates them flying in to assemble the face. Once done, the canvas
 * fades out and the real crisp <img> (still underneath, untouched) fades
 * back in — so the final resting state is pixel-perfect either way.
 *
 * Fully defensive: if canvas pixel readback fails (rare file:// SVG
 * tainting edge case) this just bails and the static portrait — already
 * in the DOM — stays visible exactly as before. Nothing else depends on it.
 */
(() => {
  "use strict";

  // TEMPORARY diagnostic badge — shows exactly what happened, so a
  // screenshot tells us the real cause instead of guessing. Remove once
  // the effect is confirmed working.
  const debugBadge = document.createElement("div");
  debugBadge.style.cssText = "position:fixed;bottom:16px;right:16px;z-index:999;background:#111;color:#0f0;font:12px monospace;padding:8px 12px;border-radius:6px;max-width:70vw;white-space:pre-wrap;";
  debugBadge.textContent = "particles: script started";
  document.addEventListener("DOMContentLoaded", () => document.body.appendChild(debugBadge));
  if (document.body) document.body.appendChild(debugBadge);

  try {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) { debugBadge.textContent = "particles: SKIPPED (reduced motion is on)"; return; }

    const container = document.querySelector(".portrait");
    const img = container && container.querySelector("img");
    if (!container || !img) { debugBadge.textContent = "particles: FAILED (container/img not found)"; return; }

    function init() {
      const rect = container.getBoundingClientRect();
      const W = Math.max(Math.round(rect.width), 1);
      const H = Math.max(Math.round(rect.height), 1);
      if (W < 10 || H < 10) return;

      const naturalW = img.naturalWidth || 1150.6;
      const naturalH = img.naturalHeight || 1927.71;
      const scale = Math.max(W / naturalW, H / naturalH);
      const drawW = naturalW * scale;
      const drawH = naturalH * scale;
      const dx = (W - drawW) * 0.5;   // object-position: center (horizontal)
      const dy = (H - drawH) * 0.15;  // object-position: 15% (vertical)

      const sampleCanvas = document.createElement("canvas");
      sampleCanvas.width = W;
      sampleCanvas.height = H;
      const sctx = sampleCanvas.getContext("2d");
      sctx.drawImage(img, dx, dy, drawW, drawH);

      let data;
      try {
        data = sctx.getImageData(0, 0, W, H).data;
      } catch (err) {
        debugBadge.textContent = "particles: BLOCKED — canvas tainted\n" + err.message;
        return; // canvas got tainted — static <img> underneath is unaffected
      }

      const STEP = 6;
      const OFFSCREEN = 80;
      const particles = [];
      for (let y = 0; y < H; y += STEP) {
        for (let x = 0; x < W; x += STEP) {
          const i = (y * W + x) * 4;
          const alpha = data[i + 3];
          if (alpha < 40) continue;

          const side = Math.floor(Math.random() * 4);
          let sx, sy;
          if (side === 0) { sx = Math.random() * W; sy = -OFFSCREEN - Math.random() * (H * 0.6); }
          else if (side === 1) { sx = W + OFFSCREEN + Math.random() * (W * 0.6); sy = Math.random() * H; }
          else if (side === 2) { sx = Math.random() * W; sy = H + OFFSCREEN + Math.random() * (H * 0.6); }
          else { sx = -OFFSCREEN - Math.random() * (W * 0.6); sy = Math.random() * H; }

          // wave delay: outer/right edge resolves first, sweeping inward
          // toward the masked left edge — reads as directed motion, not noise
          const wave = (W - x) / W;
          particles.push({
            startX: sx, startY: sy, tx: x, ty: y,
            delay: wave * 0.55 + Math.random() * 0.18,
            dur: 0.75 + Math.random() * 0.35,
            r: data[i], g: data[i + 1], b: data[i + 2], a: alpha / 255,
          });
        }
      }
      if (!particles.length) { debugBadge.textContent = "particles: FAILED (0 particles sampled — image may be blank)"; return; }
      debugBadge.textContent = `particles: OK — ${particles.length} particles, animating…`;

      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;z-index:1;";
      container.appendChild(canvas);
      const ctx = canvas.getContext("2d");

      img.style.opacity = "0";

      let start = null;
      function frame(now) {
        if (!start) start = now;
        const t = (now - start) / 1000;
        ctx.clearRect(0, 0, W, H);

        let allDone = true;
        for (const p of particles) {
          let pt = (t - p.delay) / p.dur;
          if (pt < 1) allDone = false;
          pt = Math.min(Math.max(pt, 0), 1);
          const ease = 1 - Math.pow(1 - pt, 3);
          const cx = p.startX + (p.tx - p.startX) * ease;
          const cy = p.startY + (p.ty - p.startY) * ease;
          ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.a})`;
          ctx.fillRect(cx, cy, STEP, STEP);
        }

        if (!allDone) {
          requestAnimationFrame(frame);
        } else {
          canvas.style.transition = "opacity 0.5s ease";
          img.style.transition = "opacity 0.5s ease";
          requestAnimationFrame(() => {
            canvas.style.opacity = "0";
            img.style.removeProperty("opacity"); // hand back to the CSS-defined 0.55
          });
          setTimeout(() => canvas.remove(), 600);
          debugBadge.textContent = `particles: DONE — ${particles.length} particles assembled`;
        }
      }
      requestAnimationFrame(frame);
    }

    if (img.complete && img.naturalWidth) init();
    else img.addEventListener("load", init, { once: true });
  } catch (err) {
    debugBadge.textContent = "particles: CRASHED\n" + (err && err.message ? err.message : err);
  }
})();
