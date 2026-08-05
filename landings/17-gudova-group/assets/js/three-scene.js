/**
 * GUDOVA GROUP — procedural "digital twin" scene (ES module).
 * No external 3D models: several wireframe structures (foundation,
 * columns, ring beams, diagonal bracing, glass floor slabs) built
 * entirely from Three.js primitives — nothing to fake, every shape is
 * generated in code. The scene cycles through a handful of building
 * forms every 15s, replaying the same "assembly" entrance each time.
 *
 * Loaded via a gated dynamic import from index.html so it never blocks
 * first paint. Skipped entirely on narrow viewports / reduced-motion /
 * missing WebGL — the static SVG poster stays visible in all of those
 * cases, per the brief's own fallback instructions.
 */
import * as THREE from './vendor/three.module.js';

const COPPER = 0xc9773d;
const STEEL = 0x5d6267;
const CONCRETE = 0x1a1d20;
const GLASS = 0x3a4048;
const CYCLE_MS = 15000;

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
  const CAM_START = new THREE.Vector3(10.6, 8.6, 11.8);
  const CAM_END = new THREE.Vector3(6.8, 4.8, 7.8);
  camera.position.copy(CAM_START);
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
  rig.rotation.y = -0.4;

  /* coordinate grid — persists across shape changes */
  const gridHelper = new THREE.GridHelper(12, isCompact ? 12 : 24, COPPER, 0x2a2d30);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.32;
  rig.add(gridHelper);

  /* everything shape-specific lives here so it can be cleared and
     rebuilt when the scene cycles to the next building */
  const buildingGroup = new THREE.Group();
  rig.add(buildingGroup);

  const slabMat = new THREE.MeshStandardMaterial({ color: CONCRETE, roughness: 0.9, metalness: 0.05 });
  const strutMat = new THREE.MeshStandardMaterial({ color: COPPER, roughness: 0.4, metalness: 0.6 });
  const edgeMat = new THREE.LineBasicMaterial({ color: COPPER, transparent: true, opacity: 0.55 });

  /* every part that should animate in gets pushed here as
     { mesh, kind: 'grow'|'fade'|'pop', delay, dur, targetOpacity? } —
     a single generic loop in animateAssembly drives all of them,
     regardless of which building shape they belong to */
  let animParts = [];
  let start = null;
  let shapeIdx = 0;

  function addStaticBox(w, h, d, x, y, z, mat) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, mat || slabMat);
    mesh.position.set(x, y, z);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat);
    edges.position.copy(mesh.position);
    buildingGroup.add(mesh, edges);
    return mesh;
  }

  function addBox(w, h, d, x, y, z, mat, delay, dur) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, mat || slabMat);
    mesh.position.set(x, y, z);
    mesh.scale.y = 0.001;
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat);
    edges.position.copy(mesh.position);
    edges.scale.y = 0.001;
    buildingGroup.add(mesh, edges);
    animParts.push({ mesh: mesh, kind: 'grow', delay: delay, dur: dur });
    animParts.push({ mesh: edges, kind: 'grow', delay: delay, dur: dur });
    return mesh;
  }

  /* strut between two points — used for ring beams, diagonal bracing,
     transfer beams */
  function addStrut(ax, ay, az, bx, by, bz, thickness, delay, dur) {
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
    buildingGroup.add(mesh);
    animParts.push({ mesh: mesh, kind: 'grow', delay: delay, dur: dur });
    return mesh;
  }

  /* translucent glass floor slab — mesh and its edge outline fade to
     different target opacities, so both get their own animParts entry */
  function addGlassSlab(w, d, x, y, z, delay, dur, targetOpacity) {
    const geo = new THREE.BoxGeometry(w, 0.06, d);
    const mat = new THREE.MeshStandardMaterial({ color: GLASS, roughness: 0.15, metalness: 0.3, transparent: true, opacity: 0 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat.clone());
    edges.position.copy(mesh.position);
    edges.material.opacity = 0;
    buildingGroup.add(mesh, edges);
    animParts.push({ mesh: mesh, kind: 'fade', delay: delay, dur: dur, targetOpacity: targetOpacity });
    animParts.push({ mesh: edges, kind: 'fade', delay: delay, dur: dur, targetOpacity: 0.5 });
    return mesh;
  }

  /* a single flat fading panel — parapet strips, roof caps */
  function addFadePanel(w, h, d, x, y, z, delay, dur, targetOpacity) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshStandardMaterial({ color: CONCRETE, roughness: 0.85, metalness: 0.1, transparent: true, opacity: 0 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    buildingGroup.add(mesh);
    animParts.push({ mesh: mesh, kind: 'fade', delay: delay, dur: dur, targetOpacity: targetOpacity });
    return mesh;
  }

  /* glowing accent node — appears last, with a scale "pop" on top of the fade */
  function addNode(x, y, z, delay, dur, r) {
    const geo = new THREE.SphereGeometry(r || 0.055, 12, 12);
    const mat = new THREE.MeshBasicMaterial({ color: COPPER, transparent: true, opacity: 0 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.scale.setScalar(0.001);
    buildingGroup.add(mesh);
    animParts.push({ mesh: mesh, kind: 'pop', delay: delay, dur: dur });
    return mesh;
  }

  function disposeBuildingGroup() {
    while (buildingGroup.children.length) {
      const obj = buildingGroup.children.pop();
      if (obj.geometry) obj.geometry.dispose();
      // materials are cheap and small in number per cycle — left undisposed
      // intentionally to avoid touching the shared slab/strut/edge materials
    }
  }

  /* ---------------- shape 1: colonnade (the original hero building) ---------------- */
  function buildColonnade() {
    addStaticBox(5, 0.3, 5, 0, 0.15, 0, slabMat);

    const grid2D = isCompact ? 2 : 3;
    const span = 3.4;
    const floors = isCompact ? 3 : 4;
    const floorHeight = 1.1;
    const baseY = 0.3;
    const colPositions = [];

    for (let ix = 0; ix < grid2D; ix++) {
      for (let iz = 0; iz < grid2D; iz++) {
        const x = -span / 2 + (span / (grid2D - 1)) * ix;
        const z = -span / 2 + (span / (grid2D - 1)) * iz;
        addBox(0.12, floors * floorHeight, 0.12, x, (floors * floorHeight) / 2 + baseY, z, strutMat, (ix * grid2D + iz) * 0.05, 0.35);
        colPositions.push({ x: x, z: z });
      }
    }

    for (let f = 1; f <= floors; f++) {
      const y = baseY + f * floorHeight;
      for (let ix = 0; ix < grid2D; ix++) {
        for (let iz = 0; iz < grid2D; iz++) {
          if (ix < grid2D - 1) {
            const a = colPositions[ix * grid2D + iz], b = colPositions[(ix + 1) * grid2D + iz];
            addStrut(a.x, y, a.z, b.x, y, b.z, 0.06, 0.3 + (f - 1) * 0.08, 0.3);
          }
          if (iz < grid2D - 1) {
            const a = colPositions[ix * grid2D + iz], b = colPositions[ix * grid2D + iz + 1];
            addStrut(a.x, y, a.z, b.x, y, b.z, 0.06, 0.3 + (f - 1) * 0.08, 0.3);
          }
        }
      }
    }

    const step = span / (grid2D - 1);
    const bx0 = -span / 2, bx1 = -span / 2 + step, bz = -span / 2;
    let braceI = 0;
    for (let f = 0; f < floors; f++) {
      const y0 = baseY + f * floorHeight, y1 = baseY + (f + 1) * floorHeight;
      addStrut(bx0, y0, bz, bx1, y1, bz, 0.045, 0.55 + braceI * 0.03, 0.25); braceI++;
      addStrut(bx0, y1, bz, bx1, y0, bz, 0.045, 0.55 + braceI * 0.03, 0.25); braceI++;
    }

    for (let f = 1; f <= floors; f++) {
      const y = baseY + f * floorHeight;
      addGlassSlab(span + 0.6, span + 0.6, 0, y, 0, 0.4 + (f - 1) * 0.1, 0.35, 0.32);
    }

    const parapetY = baseY + floors * floorHeight + 0.14;
    const half = span / 2 + 0.3;
    addFadePanel(span + 0.6, 0.22, 0.08, 0, parapetY, -half, 0.8, 0.15, 0.9);
    addFadePanel(span + 0.6, 0.22, 0.08, 0, parapetY, half, 0.8, 0.15, 0.9);
    addFadePanel(0.08, 0.22, span + 0.6, -half, parapetY, 0, 0.8, 0.15, 0.9);
    addFadePanel(0.08, 0.22, span + 0.6, half, parapetY, 0, 0.8, 0.15, 0.9);

    [[-half, -half], [half, -half], [-half, half], [half, half]].forEach(function (p) {
      addNode(p[0], parapetY, p[1], 0.92, 0.1);
    });
  }

  /* ---------------- shape 2: tower — slimmer, taller, more floors ---------------- */
  function buildTower() {
    addStaticBox(3.2, 0.3, 3.2, 0, 0.15, 0, slabMat);

    const grid2D = 2;
    const span = 1.7;
    const floors = isCompact ? 6 : 8;
    const floorHeight = 0.55;
    const baseY = 0.3;
    const colPositions = [];

    for (let ix = 0; ix < grid2D; ix++) {
      for (let iz = 0; iz < grid2D; iz++) {
        const x = -span / 2 + span * ix;
        const z = -span / 2 + span * iz;
        addBox(0.12, floors * floorHeight, 0.12, x, (floors * floorHeight) / 2 + baseY, z, strutMat, (ix * grid2D + iz) * 0.05, 0.35);
        colPositions.push({ x: x, z: z });
      }
    }

    for (let f = 1; f <= floors; f++) {
      const y = baseY + f * floorHeight;
      for (let ix = 0; ix < grid2D; ix++) {
        for (let iz = 0; iz < grid2D; iz++) {
          if (ix < grid2D - 1) {
            const a = colPositions[ix * grid2D + iz], b = colPositions[(ix + 1) * grid2D + iz];
            addStrut(a.x, y, a.z, b.x, y, b.z, 0.05, 0.25 + (f - 1) * 0.06, 0.25);
          }
          if (iz < grid2D - 1) {
            const a = colPositions[ix * grid2D + iz], b = colPositions[ix * grid2D + iz + 1];
            addStrut(a.x, y, a.z, b.x, y, b.z, 0.05, 0.25 + (f - 1) * 0.06, 0.25);
          }
        }
      }
    }

    for (let f = 1; f <= floors; f++) {
      const y = baseY + f * floorHeight;
      addGlassSlab(span + 0.35, span + 0.35, 0, y, 0, 0.3 + (f - 1) * 0.06, 0.25, 0.28);
    }

    const parapetY = baseY + floors * floorHeight + 0.1;
    const half = span / 2 + 0.18;
    addFadePanel(span + 0.35, 0.06, 0.06, 0, parapetY, -half, 0.85, 0.15, 0.9);
    addFadePanel(span + 0.35, 0.06, 0.06, 0, parapetY, half, 0.85, 0.15, 0.9);
    addFadePanel(0.06, 0.06, span + 0.35, -half, parapetY, 0, 0.85, 0.15, 0.9);
    addFadePanel(0.06, 0.06, span + 0.35, half, parapetY, 0, 0.85, 0.15, 0.9);

    [[-half, -half], [half, -half], [-half, half], [half, half]].forEach(function (p) {
      addNode(p[0], parapetY, p[1], 0.88, 0.1);
    });
    addNode(0, parapetY + 0.28, 0, 0.94, 0.06, 0.045);
  }

  /* ---------------- shape 3: ziggurat — stacked, narrowing tiers ---------------- */
  function buildZiggurat() {
    addStaticBox(4.2, 0.3, 4.2, 0, 0.15, 0, slabMat);

    const baseY = 0.3;
    const tiers = [
      { w: 3.6, h: 0.55 },
      { w: 2.8, h: 0.55 },
      { w: 2.0, h: 0.5 },
      { w: 1.3, h: 0.5 },
      { w: 0.7, h: 0.4 }
    ];
    let y = baseY;
    tiers.forEach(function (tier, i) {
      const cy = y + tier.h / 2;
      addBox(tier.w, tier.h, tier.w, 0, cy, 0, i === tiers.length - 1 ? slabMat : strutMat, i * 0.15, 0.35);
      y += tier.h;
    });

    const half = tiers[tiers.length - 1].w / 2;
    [[-half, -half], [half, -half], [-half, half], [half, half]].forEach(function (p) {
      addNode(p[0], y, p[1], 0.85, 0.1);
    });
    addNode(0, y + 0.16, 0, 0.9, 0.1, 0.05);
  }

  /* ---------------- shape 4: cantilever — offset upper block on a transfer beam ---------------- */
  function buildCantilever() {
    addStaticBox(3.6, 0.3, 2.4, 0.5, 0.15, 0, slabMat);

    const grid2D = 2, coreSpan = 1.3, coreFloors = 3, floorHeight = 0.6, baseY = 0.3;
    const coreX = -0.5;
    const colPositions = [];
    for (let ix = 0; ix < grid2D; ix++) {
      for (let iz = 0; iz < grid2D; iz++) {
        const x = coreX + (-coreSpan / 2 + coreSpan * ix);
        const z = -coreSpan / 2 + coreSpan * iz;
        addBox(0.12, coreFloors * floorHeight, 0.12, x, (coreFloors * floorHeight) / 2 + baseY, z, strutMat, (ix * grid2D + iz) * 0.05, 0.3);
        colPositions.push({ x: x, z: z });
      }
    }
    for (let f = 1; f <= coreFloors; f++) {
      const y = baseY + f * floorHeight;
      for (let ix = 0; ix < grid2D; ix++) {
        for (let iz = 0; iz < grid2D; iz++) {
          if (ix < grid2D - 1) {
            const a = colPositions[ix * grid2D + iz], b = colPositions[(ix + 1) * grid2D + iz];
            addStrut(a.x, y, a.z, b.x, y, b.z, 0.05, 0.25 + (f - 1) * 0.07, 0.25);
          }
          if (iz < grid2D - 1) {
            const a = colPositions[ix * grid2D + iz], b = colPositions[ix * grid2D + iz + 1];
            addStrut(a.x, y, a.z, b.x, y, b.z, 0.05, 0.25 + (f - 1) * 0.07, 0.25);
          }
        }
      }
    }

    const beamY = baseY + coreFloors * floorHeight + 0.03;
    const beamLen = 2.6;
    const beamX = coreX + beamLen / 2 - coreSpan / 2;
    addBox(beamLen, 0.1, coreSpan + 0.15, beamX, beamY, 0, strutMat, 0.55, 0.3);

    const upperFloors = 2, upperSpan = 1.3;
    const upperX = coreX + beamLen - coreSpan;
    const upperColPositions = [];
    for (let ix = 0; ix < grid2D; ix++) {
      for (let iz = 0; iz < grid2D; iz++) {
        const x = upperX + (-upperSpan / 2 + upperSpan * ix);
        const z = -upperSpan / 2 + upperSpan * iz;
        addBox(0.12, upperFloors * floorHeight, 0.12, x, beamY + (upperFloors * floorHeight) / 2, z, strutMat, 0.68 + (ix * grid2D + iz) * 0.04, 0.3);
        upperColPositions.push({ x: x, z: z });
      }
    }
    for (let f = 1; f <= upperFloors; f++) {
      const y = beamY + f * floorHeight;
      for (let ix = 0; ix < grid2D; ix++) {
        for (let iz = 0; iz < grid2D; iz++) {
          if (ix < grid2D - 1) {
            const a = upperColPositions[ix * grid2D + iz], b = upperColPositions[(ix + 1) * grid2D + iz];
            addStrut(a.x, y, a.z, b.x, y, b.z, 0.05, 0.85 + (f - 1) * 0.05, 0.2);
          }
          if (iz < grid2D - 1) {
            const a = upperColPositions[ix * grid2D + iz], b = upperColPositions[ix * grid2D + iz + 1];
            addStrut(a.x, y, a.z, b.x, y, b.z, 0.05, 0.85 + (f - 1) * 0.05, 0.2);
          }
        }
      }
    }

    const roofY = beamY + upperFloors * floorHeight + 0.06;
    addFadePanel(upperSpan + 0.2, 0.06, upperSpan + 0.2, upperX, roofY, 0, 0.9, 0.08, 0.9);
    addNode(upperX + upperSpan / 2 + 0.12, roofY, 0, 0.95, 0.05, 0.05);
  }

  const SHAPES = [buildColonnade, buildTower, buildZiggurat, buildCantilever];

  function loadShape(idx) {
    disposeBuildingGroup();
    animParts = [];
    start = null;
    camera.position.copy(CAM_START);
    SHAPES[idx]();
  }

  loadShape(shapeIdx);

  /* entrance assembly (progressive enhancement — no external tween lib required) */
  const ASSEMBLE_MS = reduceMotion ? 1 : 2800;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  /* overshoots past 1 then settles back — reads as a springy "snap into
     place" instead of a flat glide, without needing an external tween lib */
  function easeOutBack(t) {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }
  function segT(t, delay, span_) { return Math.max(0, Math.min((t - delay) / span_, 1)); }

  let assembleRaf = null;

  function animateAssembly(ts) {
    if (start === null) start = ts;
    const t = Math.min((ts - start) / ASSEMBLE_MS, 1);

    const camE = easeOutCubic(segT(t, 0, 0.7));
    camera.position.lerpVectors(CAM_START, CAM_END, camE);
    camera.lookAt(0, 1.9, 0);

    animParts.forEach(function (p) {
      const raw = segT(t, p.delay, p.dur);
      if (p.kind === 'grow') {
        const e = easeOutBack(raw);
        p.mesh.scale.y = 0.001 + e * 0.999;
      } else if (p.kind === 'fade') {
        p.mesh.material.opacity = easeOutCubic(raw) * p.targetOpacity;
      } else if (p.kind === 'pop') {
        p.mesh.material.opacity = easeOutCubic(raw);
        p.mesh.scale.setScalar(Math.max(0.001, easeOutBack(raw)));
      }
    });

    assembleRaf = t < 1 ? requestAnimationFrame(animateAssembly) : null;
  }

  /* render loop, paused via IntersectionObserver */
  let rafId = null;
  let visible = false;
  let cycleTimer = null;

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

  function nextShape() {
    shapeIdx = (shapeIdx + 1) % SHAPES.length;
    loadShape(shapeIdx);
    if (assembleRaf) cancelAnimationFrame(assembleRaf);
    assembleRaf = requestAnimationFrame(animateAssembly);
  }

  function start_() {
    if (rafId) return;
    visible = true;
    resize();
    renderer.render(scene, camera);
    container.classList.add('is-live');
    assembleRaf = requestAnimationFrame(animateAssembly);
    tick();
    if (!reduceMotion && !cycleTimer && SHAPES.length > 1) {
      cycleTimer = setInterval(nextShape, CYCLE_MS);
    }
  }

  function stop_() {
    visible = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    if (cycleTimer) { clearInterval(cycleTimer); cycleTimer = null; }
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
