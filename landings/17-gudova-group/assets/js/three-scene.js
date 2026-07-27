/**
 * GUDOVA GROUP — procedural "digital twin" scene (ES module).
 * No external 3D models: a low-poly wireframe structure (foundation,
 * columns, beams, floor slabs) built from Three.js primitives, so
 * there is nothing to fake — every shape is generated in code.
 *
 * Loaded via a gated dynamic import from index.html so it never blocks
 * first paint. Skipped entirely on narrow viewports / reduced-motion /
 * missing WebGL — the static SVG poster stays visible in all of those
 * cases, per the brief's own fallback instructions.
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const COPPER = 0xc9773d;
const STEEL = 0x5d6267;
const CONCRETE = 0x1a1d20;

export function initHeroScene(container) {
  if (!container) return null;
  const canvas = container.querySelector('canvas');
  if (!canvas) return null;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) {
    return null; // no WebGL — poster stays visible
  }

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCompact = window.innerWidth < 1080;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(6.2, 4.4, 7.2);
  camera.lookAt(0, 1.6, 0);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(COPPER, 0.6);
  key.position.set(5, 8, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(STEEL, 0.35);
  fill.position.set(-5, 3, -4);
  scene.add(fill);

  const rig = new THREE.Group();
  scene.add(rig);

  /* coordinate grid */
  const grid = new THREE.GridHelper(12, isCompact ? 12 : 24, COPPER, 0x2a2d30);
  grid.material.transparent = true;
  grid.material.opacity = 0.35;
  rig.add(grid);

  /* foundation slab */
  const slabMat = new THREE.MeshStandardMaterial({ color: CONCRETE, roughness: 0.9, metalness: 0.05 });
  const edgeMat = new THREE.LineBasicMaterial({ color: COPPER, transparent: true, opacity: 0.55 });

  function addBox(w, h, d, x, y, z) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, slabMat);
    mesh.position.set(x, y, z);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat);
    edges.position.copy(mesh.position);
    rig.add(mesh, edges);
    return mesh;
  }

  const foundation = addBox(5, 0.3, 5, 0, 0.15, 0);

  const grid2D = isCompact ? 2 : 3;
  const span = 3.4;
  const floors = 3;
  const floorHeight = 1.2;
  const columns = [];

  for (let ix = 0; ix < grid2D; ix++) {
    for (let iz = 0; iz < grid2D; iz++) {
      const x = -span / 2 + (span / (grid2D - 1)) * ix;
      const z = -span / 2 + (span / (grid2D - 1)) * iz;
      const col = addBox(0.14, floors * floorHeight, 0.14, x, (floors * floorHeight) / 2 + 0.3, z);
      col.userData.baseHeight = floors * floorHeight;
      col.scale.y = 0.001;
      columns.push(col);
    }
  }

  const slabs = [];
  for (let f = 1; f <= floors; f++) {
    const y = 0.3 + f * floorHeight;
    const slabGeo = new THREE.BoxGeometry(span + 0.6, 0.08, span + 0.6);
    const mat = new THREE.MeshStandardMaterial({
      color: CONCRETE, roughness: 0.85, metalness: 0.1, transparent: true, opacity: 0
    });
    const slab = new THREE.Mesh(slabGeo, mat);
    slab.position.set(0, y, 0);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(slabGeo), edgeMat);
    edges.position.copy(slab.position);
    edges.material = edges.material.clone();
    edges.material.opacity = 0;
    rig.add(slab, edges);
    slabs.push({ mesh: slab, edges });
  }

  rig.rotation.y = -0.4;

  /* entrance assembly (progressive enhancement — no external tween lib required) */
  let start = null;
  const ASSEMBLE_MS = reduceMotion ? 1 : 2200;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateAssembly(ts) {
    if (start === null) start = ts;
    const t = Math.min((ts - start) / ASSEMBLE_MS, 1);
    const e = easeOutCubic(t);
    columns.forEach(function (col, i) {
      const colDelay = i * 0.06;
      const colT = Math.max(0, Math.min((t - colDelay) / (1 - colDelay || 1), 1));
      col.scale.y = 0.001 + easeOutCubic(colT) * 0.999;
    });
    slabs.forEach(function (s, i) {
      const slabDelay = 0.35 + i * 0.15;
      const slabT = Math.max(0, Math.min((t - slabDelay) / (1 - slabDelay), 1));
      const op = easeOutCubic(slabT) * 0.85;
      s.mesh.material.opacity = op;
      s.edges.material.opacity = op * 0.6;
    });
    if (t < 1) requestAnimationFrame(animateAssembly);
  }

  /* render loop, paused via IntersectionObserver */
  let rafId = null;
  let visible = false;

  function resize() {
    const rect = container.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }

  function tick() {
    if (!visible) return;
    if (!reduceMotion) rig.rotation.y += 0.0015;
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  }

  function start_() {
    if (rafId) return;
    visible = true;
    resize();
    renderer.render(scene, camera);
    container.classList.add('is-live');
    requestAnimationFrame(animateAssembly);
    tick();
  }

  function stop_() {
    visible = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  if ('ResizeObserver' in window) {
    new ResizeObserver(resize).observe(container);
  } else {
    window.addEventListener('resize', resize);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.isIntersecting ? start_() : stop_();
      });
    }, { threshold: 0.15 }).observe(container);
  } else {
    start_();
  }

  return { stop: stop_ };
}
