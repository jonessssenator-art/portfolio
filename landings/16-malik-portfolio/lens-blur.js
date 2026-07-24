/*
 * Optional enhancement: a real GPU depth-of-field blur over the hero
 * portrait — sharp near the cursor, soft toward the edges, easing back to
 * a gentle default focus when the pointer leaves. Inspired by Codrops'
 * "SDF Lens Blur" (tympanus.net/Tutorials/SDFLensBlur) — that demo draws
 * an abstract SDF shape and doesn't actually blur an image, so this is a
 * from-scratch shader built for that purpose, reusing its damped-cursor
 * approach.
 *
 * Fully optional: wrapped end-to-end so any failure (no WebGL, no network
 * for the Three.js CDN import, a tainted canvas under file://) just leaves
 * the plain <img class="hero__portrait"> visible — nothing else on the
 * page depends on this module.
 */
(async () => {
  "use strict";

  try {
    if (!window.WebGLRenderingContext) return;
    if (window.matchMedia("(hover: none)").matches) return; // no persistent cursor on touch

    const heroImage = document.getElementById("heroImage");
    const portraitImg = document.querySelector(".hero__portrait");
    if (!heroImage || !portraitImg) return;

    if (!portraitImg.complete) {
      await new Promise((resolve) => portraitImg.addEventListener("load", resolve, { once: true }));
    }

    const THREE = await import("https://unpkg.com/three@0.164.1/build/three.module.js");

    // Bake the red backdrop + grey-dot portrait into one canvas — the WebGL
    // texture source. Needs its own backdrop fill because the SVG itself
    // only draws the dots on a transparent background (see style.css,
    // .hero__image supplies the red behind the plain <img>).
    const bakeSize = 1400;
    const aspect = (portraitImg.naturalHeight || 1927.71) / (portraitImg.naturalWidth || 1150.6);
    const bake = document.createElement("canvas");
    bake.width = bakeSize;
    bake.height = Math.round(bakeSize * aspect);
    const bakeCtx = bake.getContext("2d");
    bakeCtx.fillStyle = "#ee1919";
    bakeCtx.fillRect(0, 0, bake.width, bake.height);
    bakeCtx.drawImage(portraitImg, 0, 0, bake.width, bake.height);
    bake.toDataURL(); // throws if the canvas got tainted (e.g. some file:// setups) — caught below

    const texture = new THREE.CanvasTexture(bake);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    const canvas = document.createElement("canvas");
    canvas.className = "hero__webgl";
    heroImage.insertBefore(canvas, portraitImg.nextSibling);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
    camera.position.z = 1;

    const vMouse = new THREE.Vector2(0.5, 0.42); // default focus point — matches object-position: center 15%
    const vMouseDamp = vMouse.clone();
    const vResolution = new THREE.Vector2();

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        u_tex: { value: texture },
        u_mouse: { value: vMouseDamp },
        u_resolution: { value: vResolution },
        u_texAspect: { value: bake.width / bake.height },
        u_focusRadius: { value: 0.22 },
        u_maxBlur: { value: 14.0 },
        u_active: { value: 0.55 }, // gentle default depth-of-field even before any hover
      },
      vertexShader: /* glsl */ `
        varying vec2 v_uv;
        void main() {
          v_uv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec2 v_uv;
        uniform sampler2D u_tex;
        uniform vec2 u_mouse;
        uniform vec2 u_resolution;
        uniform float u_texAspect;
        uniform float u_focusRadius;
        uniform float u_maxBlur;
        uniform float u_active;

        vec4 sampleBlur(vec2 uv, vec2 texel, float radius) {
          vec4 sum = texture2D(u_tex, uv) * 3.0;
          float total = 3.0;
          const int TAPS = 10;
          for (int i = 0; i < TAPS; i++) {
            float angle = (float(i) / float(TAPS)) * 6.28318530718;
            vec2 dir = vec2(cos(angle), sin(angle));
            sum += texture2D(u_tex, uv + dir * texel * radius) * 1.0;
            sum += texture2D(u_tex, uv + dir * texel * radius * 0.55) * 1.5;
            total += 2.5;
          }
          return sum / total;
        }

        void main() {
          vec2 uv = v_uv;
          float containerAspect = u_resolution.x / u_resolution.y;

          // replicate object-fit: cover so the baked texture (a different
          // aspect ratio than the container) crops instead of stretching
          vec2 ratio = vec2(
            min(containerAspect / u_texAspect, 1.0),
            min(u_texAspect / containerAspect, 1.0)
          );
          vec2 coverUv = (uv - 0.5) * ratio + 0.5;

          vec2 diff = uv - u_mouse;
          diff.x *= containerAspect;
          float dist = length(diff);

          float t = smoothstep(u_focusRadius, u_focusRadius + 0.4, dist);
          float blurPx = t * u_maxBlur * u_active;

          vec2 texel = ratio / u_resolution;
          vec4 color = blurPx > 0.4 ? sampleBlur(coverUv, texel, blurPx) : texture2D(u_tex, coverUv);

          gl_FragColor = color;
        }
      `,
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    scene.add(quad);

    function resize() {
      const rect = heroImage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(rect.width, rect.height, true);
      vResolution.set(rect.width, rect.height).multiplyScalar(dpr);
    }
    resize();
    window.addEventListener("resize", resize);

    let targetActive = 0.55;
    heroImage.addEventListener("pointermove", (e) => {
      const rect = heroImage.getBoundingClientRect();
      vMouse.set((e.clientX - rect.left) / rect.width, 1 - (e.clientY - rect.top) / rect.height);
      targetActive = 1;
    });
    heroImage.addEventListener("pointerleave", () => {
      vMouse.set(0.5, 0.42);
      targetActive = 0.55;
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lastTime = performance.now();

    function animate() {
      requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const damp = reducedMotion ? 1 : 1 - Math.exp(-8 * dt);
      vMouseDamp.lerp(vMouse, damp);
      mat.uniforms.u_active.value += (targetActive - mat.uniforms.u_active.value) * damp;

      renderer.render(scene, camera);
    }
    animate();

    // only reveal the canvas (and hide the plain <img>) once the first
    // frame has actually rendered — never leaves a blank gap on failure
    requestAnimationFrame(() => {
      canvas.classList.add("is-ready");
      heroImage.classList.add("has-webgl-portrait");
    });
  } catch (err) {
    // WebGL/texture/network failure: the plain <img class="hero__portrait">
    // is already visible underneath, so there's nothing to clean up
  }
})();
