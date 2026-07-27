/*
 * Abstract "brand form" — a faceted icosahedron (solid + oversized red
 * wireframe shell) standing in for a literal logo. Slow constant spin,
 * a damped tilt toward the cursor, and a recede-into-depth transform as
 * the user scrolls from Hero into Philosophy.
 *
 * Fully optional, like lens-blur.js on the main site: any failure (no
 * WebGL, CDN unreachable) just leaves an empty container — the hero
 * headline and CTA don't depend on this rendering.
 */
(async () => {
  "use strict";

  try {
    const container = document.getElementById("heroObject");
    if (!container || !window.WebGLRenderingContext) return;

    const THREE = await import("https://unpkg.com/three@0.164.1/build/three.module.js");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const solid = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.5, 1),
      new THREE.MeshStandardMaterial({ color: 0x121212, metalness: 0.75, roughness: 0.28 })
    );
    group.add(solid);

    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.75, 1),
      new THREE.MeshBasicMaterial({ color: 0xe21b1b, wireframe: true, transparent: true, opacity: 0.6 })
    );
    group.add(wire);

    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(4, 5, 6);
    scene.add(key);

    const rim = new THREE.PointLight(0xe21b1b, 4, 20);
    rim.position.set(-4, -2, 3);
    scene.add(rim);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    function resize() {
      const rect = container.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(rect.width, rect.height);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    let mouseX = 0, mouseY = 0;
    window.addEventListener("pointermove", (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    const heroEl = document.getElementById("hero");
    let scrollProgress = 0;
    function updateScroll() {
      if (!heroEl) return;
      const rect = heroEl.getBoundingClientRect();
      scrollProgress = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
    }
    window.addEventListener("scroll", updateScroll, { passive: true });

    const rotSpeed = reducedMotion ? 0.015 : 0.14;
    let baseRotX = 0, baseRotY = 0.3;
    let tiltX = 0, tiltY = 0;
    let last = performance.now();

    function animate(now) {
      requestAnimationFrame(animate);
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      baseRotY += dt * rotSpeed;
      baseRotX += dt * rotSpeed * 0.35;

      const targetTiltX = mouseY * 0.28;
      const targetTiltY = mouseX * 0.4;
      const damp = Math.min(dt * 4, 1);
      tiltX += (targetTiltX - tiltX) * damp;
      tiltY += (targetTiltY - tiltY) * damp;

      group.rotation.x = baseRotX + tiltX;
      group.rotation.y = baseRotY + tiltY;

      const scale = 1 - scrollProgress * 0.3;
      group.scale.setScalar(scale);
      group.position.z = -scrollProgress * 1.6;
      renderer.domElement.style.opacity = String(1 - scrollProgress * 0.95);

      renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);
  } catch (err) {
    // WebGL/network failure: hero still reads fine as pure typography
  }
})();
