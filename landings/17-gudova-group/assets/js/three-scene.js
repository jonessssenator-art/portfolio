/**
 * GUDOVA GROUP — procedural "digital twin" scene (ES module).
 * No external 3D models: a wireframe structure (foundation, columns,
 * ring beams, diagonal bracing, glass floor slabs, roof parapet)
 * built entirely from Three.js primitives — nothing to fake, every
 * shape is generated in code.
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
const GLASS = 0x3a4048;

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
  camera.position.set(6.8, 4.8, 7.8);
  camera.lookAt(0, 1.9, 0);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const key = new THREE.DirectionalLight(COPPER, 0.65);
  key.position.set(5, 8, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(STEEL, 0.3);
  fill.position.set(-5, 3, -4);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0x8fa3b0, 0.35);
  rim.position.set(-3, 5, -6);
  scene.add(rim);

  const rig = new THREE.Group();
  scene.add(rig);

  /* coordinate grid */
  const gridHelper = new THREE.GridHelper(12, isCompact ? 12 : 24, COPPER, 0x2a2d30);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.32;
  rig.add(gridHelper);

  const slabMat = new THREE.MeshStandardMaterial({ color: CONCRETE, roughness: 0.9, metalness: 0.05 });
  const strutMat = new THREE.MeshStandardMaterial({ color: COPPER, roughness: 0.4, metalness: 0.6 });
  const edgeMat = new THREE.LineBasicMaterial({ color: COPPER, transparent: true, opacity: 0.55 });

  function addBox(w, h, d, x, y, z, mat) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, mat || slabMat);
    mesh.position.set(x, y, z);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat);
    edges.position.copy(mesh.position);
    rig.add(mesh, edges);
    return mesh;
  }

  /* strut between two points — used for ring beams and diagonal bracing */
  function addStrut(ax, ay, az, bx, by, bz, thickness) {
    const a = new THREE.Vector3(ax, ay, az);
    const b = new THREE.Vector3(bx, by, bz);
    const dir = new THREE.Vector3().subVectors(b, a);
    const length = dir.length();
    if (length < 0.001) return null;
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    const geo = new THREE.BoxGeometry(thickness, length, thickness);
    const mesh = new THREE.Mesh(geo, strutMat);
    mesh.position.copy(mid);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    mesh.scale.y = 0.001;
    rig.add(mesh);
    return mesh;
  }

  addBox(5, 0.3, 5, 0, 0.15, 0);

  const grid2D = isCompact ? 2 : 3;
  const span = 3.4;
  const floors = isCompact ? 3 : 4;
  const floorHeight = 1.1;
  const baseY = 0.3;
  const columns = [];
  const colPositions = [];

  for (let ix = 0; ix < grid2D; ix++) {
    for (let iz = 0; iz < grid2D; iz++) {
      const x = -span / 2 + (span / (grid2D - 1)) * ix;
      const z = -span / 2 + (span / (grid2D - 1)) * iz;
      const col = addBox(0.12, floors * floorHeight, 0.12, x, (floors * floorHeight) / 2 + baseY, z);
      col.scale.y = 0.001;
      columns.push(col);
      colPositions.push({ x, z, ix, iz });
    }
  }

  /* ring beams: connect adjacent perimeter columns at every floor level */
  const beams = [];
  for (let f = 1; f <= floors; f++) {
    const y = baseY + f * floorHeight;
    const levelBeams = [];
    for (let ix = 0; ix < grid2D; ix++) {
      for (let iz = 0; iz < grid2D; iz++) {
        if (ix < grid2D - 1) {
          const a = colPositions[ix * grid2D + iz];
          const b = colPositions[(ix + 1) * grid2D + iz];
          levelBeams.push(addStrut(a.x, y, a.z, b.x, y, b.z, 0.06));
        }
        if (iz < grid2D - 1) {
          const a = colPositions[ix * grid2D + iz];
          const b = colPositions[ix * grid2D + iz + 1];
          levelBeams.push(addStrut(a.x, y, a.z, b.x, y, b.z, 0.06));
        }
      }
    }
    beams.push(levelBeams.filter(Boolean));
  }

  /* diagonal cross-bracing on the front-left bay, every floor */
  const braces = [];
  const step = span / (grid2D - 1);
  const bx0 = -span / 2, bx1 = -span / 2 + step, bz = -span / 2;
  for (let f = 0; f < floors; f++) {
    const y0 = baseY + f * floorHeight;
    const y1 = baseY + (f + 1) * floorHeight;
    braces.push(addStrut(bx0, y0, bz, bx1, y1, bz, 0.045));
    braces.push(addStrut(bx0, y1, bz, bx1, y0, bz, 0.045));
  }

  /* translucent glass floor slabs */
  const slabs = [];
  for (let f = 1; f <= floors; f++) {
    const y = baseY + f * floorHeight;
    const slabGeo = new THREE.BoxGeometry(span + 0.6, 0.06, span + 0.6);
    const mat = new THREE.MeshStandardMaterial({
      color: GLASS, roughness: 0.15, metalness: 0.3, transparent: true, opacity: 0
    });
    const slab = new THREE.Mesh(slabGeo, mat);
    slab.position.set(0, y, 0);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(slabGeo), edgeMat.clone());
    edges.position.copy(slab.position);
    edges.material.opacity = 0;
    rig.add(slab, edges);
    slabs.push({ mesh: slab, edges });
  }

  /* roof parapet — a raised frame on the top slab so the mass reads as finished, not cut off */
  const parapetY = baseY + floors * floorHeight + 0.14;
  const parapetMat = new THREE.MeshStandardMaterial({ color: CONCRETE, roughness: 0.85, metalness: 0.1, transparent: true, opacity: 0 });
  const half = span / 2 + 0.3;
  const parapetParts = [
    addBox(span + 0.6, 0.22, 0.08, 0, parapetY, -half, parapetMat),
    addBox(span + 0.6, 0.22, 0.08, 0, parapetY, half, parapetMat),
    addBox(0.08, 0.22, span + 0.6, -half, parapetY, 0, parapetMat),
    addBox(0.08, 0.22, span + 0.6, half, parapetY, 0, parapetMat)
  ];

  /* glowing corner nodes — appear last, as a "finishing" detail */
  const nodeMat = new THREE.MeshBasicMaterial({ color: COPPER, transparent: true, opacity: 0 });
  const nodes = [
    [-half, parapetY, -half], [half, parapetY, -half],
    [-half, parapetY, half], [half, parapetY, half]
  ].map(function (p) {
    const geo = new THREE.SphereGeometry(0.055, 12, 12);
    const mesh = new THREE.Mesh(geo, nodeMat.clone());
    mesh.position.set(p[0], p[1], p[2]);
    rig.add(mesh);
    return mesh;
  });

  rig.rotation.y = -0.4;

  /* entrance assembly (progressive enhancement — no external tween lib required) */
  let start = null;
  const ASSEMBLE_MS = reduceMotion ? 1 : 2800;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function segT(t, delay, span_) { return Math.max(0, Math.min((t - delay) / span_, 1)); }

  function animateAssembly(ts) {
    if (start === null) start = ts;
    const t = Math.min((ts - start) / ASSEMBLE_MS, 1);

    columns.forEach(function (col, i) {
      const e = easeOutCubic(segT(t, i * 0.05, 0.35));
      col.scale.y = 0.001 + e * 0.999;
    });

    beams.forEach(function (levelBeams, f) {
      const e = easeOutCubic(segT(t, 0.3 + f * 0.08, 0.3));
      levelBeams.forEach(function (beam) { beam.scale.y = 0.001 + e * 0.999; });
    });

    braces.forEach(function (brace, i) {
      if (!brace) return;
      const e = easeOutCubic(segT(t, 0.55 + i * 0.03, 0.25));
      brace.scale.y = 0.001 + e * 0.999;
    });

    slabs.forEach(function (s, i) {
      const e = easeOutCubic(segT(t, 0.4 + i * 0.1, 0.35));
      const op = e * 0.32;
      s.mesh.material.opacity = op;
      s.edges.material.opacity = e * 0.5;
    });

    const parapetE = easeOutCubic(segT(t, 0.8, 0.15));
    parapetParts.forEach(function (part) { part.material.opacity = parapetE * 0.9; });

    const nodeE = easeOutCubic(segT(t, 0.92, 0.08));
    nodes.forEach(function (n) { n.material.opacity = nodeE; });

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
