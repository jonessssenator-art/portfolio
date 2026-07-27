# GUDOVA GROUP — redesign notes

Full rebuild of the pitch-demo landing under the "СЛОИ КОНТРОЛЯ / CONTROL LAYERS" concept. This file documents structure, how to run it, current limitations, and how to plug in real Higgsfield video later.

## Structure

```
landings/17-gudova-group/
├── index.html                 semantic markup, all 12 sections, static content (no client-side templating)
├── разбор-и-питч.md           pitch breakdown (from the previous iteration, still relevant)
├── assets/
│   ├── css/main.css           full design system: tokens, layout, components, responsive rules
│   ├── js/
│   │   ├── content.js         shared reference data (contacts, services, projects) — used by form.js's
│   │   │                      WhatsApp message builder and analytics payloads, not for DOM rendering
│   │   ├── app.js             header scroll state, mobile menu, active-nav tracking, certificate
│   │   │                      lightbox, risk-scanner accordion, services sticky-scroll sync, analytics hooks
│   │   ├── animations.js      GSAP + ScrollTrigger reveals — progressive enhancement only (see below)
│   │   ├── three-scene.js     ES module, procedural Three.js "digital twin" wireframe scene
│   │   └── form.js            4-step contact form, client-side validation, WhatsApp fallback submit
│   ├── images/                founder photo + 3 real certificate scans + hero-poster.svg
│   └── video/                 empty — reserved for Higgsfield output, see creative/higgsfield-prompts.md
└── creative/
    └── higgsfield-prompts.md  4 ready-to-run prompts + expected output paths
```

## Why content is static HTML, not JS-rendered

The brief asked for centralized content data. `content.js` holds the facts (contacts, services, projects) as a shared source for the two places that genuinely need them in JS — the WhatsApp message builder and the analytics event payloads — but the *visible* sections (services, projects, prices, testimonials) are authored directly as HTML rather than templated client-side. Reasoning: this is a static GitHub Pages site with no build step and no way to unit-test the templating JS before shipping; if a template loop has a bug, the section renders blank with no fallback. Static HTML degrades safely (readable even if every script fails to load), is crawlable, and avoids layout shift from client-side rendering. To edit copy/prices/projects, edit `index.html` directly — the structure is repetitive and easy to pattern-match.

## Running locally

No build step. Either:
- `open index.html` (relative asset paths work from `file://`), or
- `python3 -m http.server` from this folder and open `localhost:8000` (recommended — the Three.js module script and some fetches behave more consistently over `http://` than `file://` in most browsers).

## What's real and working vs. what needs a live check

Built and verified via static rendering (layout, copy, responsive breakpoints down to 360px):
- All 12 sections, correct content, fixed the 6-objects/3.86bn contradiction, fixed process step order, de-duplicated the price list into headline cards + full breakdown.
- Mobile-specific handling: sticky call/WhatsApp bar, accordion-style `<details>` everywhere, single-column stacking, no horizontal overflow at any tested width (360–1920px via iframe probes).

Written correctly and syntax-checked (`node --check` on every file) but **not executable in this environment** — there's no headless browser here, only a static WebKit thumbnail renderer that doesn't run JavaScript or WebGL. These need a real-browser check before calling this fully done:
- Mobile menu open/close, focus trap, Escape handling.
- Certificate lightbox (open/close/arrow-key nav/focus trap).
- Risk-scanner and services sticky-scroll layer sync.
- The Three.js hero scene (procedural columns/beams/slabs, entrance assembly, idle rotation, pause-when-offscreen). Falls back to the static `hero-poster.svg` if WebGL is unavailable, on narrow viewports (≤760px), or if `prefers-reduced-motion` is set.
- The 4-step form: validation, step navigation, and the WhatsApp-prefill submit (`wa.me` link with the assembled message — there is no backend, so this is the actual submission mechanism, not a placeholder).
- GSAP scroll reveals (`animations.js`) — pure progressive enhancement: every element is fully visible by default in the CSS; this script only adds motion on top if GSAP loads successfully.

**Please open the live page in an actual browser and click through the header menu, risk scanner, services list, a project's "Подробнее", the certificate lightbox, and the contact form before treating this as final** — that's the one verification step this environment structurally cannot do itself.

## Known CSS-authoring note

Two grid layouts (`.founder-layout`, `.cta-layout`) were originally built with skewed ratios (`2fr 3fr`) and, only in this machine's QuickLook-based static renderer, appeared to overflow. Extensive isolated testing (see session log) traced this to the renderer's own viewport/scaling behavior, not the CSS — every `1fr 1fr` grid in this file rendered correctly, and swapping the two skewed ones to `1fr 1fr` produced identical results to the "broken" ones, which shouldn't happen if it were a real CSS bug. They were simplified to `1fr 1fr` anyway as the lower-risk choice. `min-width:0` was also added to every grid-item column as a general defensive fix (grid/flex items default to `min-width:auto`, which can force a column wider than its `fr` share when content is long — a real, separate bug that WAS confirmed and fixed in `.proj-panel`).

## Higgsfield video (not generated)

`creative/higgsfield-prompts.md` has the 4 prompts from the brief, ready to run. Video generation costs Higgsfield credits, so it wasn't run without an explicit go-ahead — the hero currently uses the coded Three.js scene + `hero-poster.svg` as instructed by the brief's own fallback path ("если доступа к Higgsfield нет — не останавливай разработку, создай файл с промтами, используй Three.js-сцену и постер"). Ask for the video pass explicitly when ready.

## Changed/added files (this redesign)

- Rewrote `index.html` from scratch (previous single-file version is in git history)
- New: `assets/css/main.css`, `assets/js/{content,app,animations,three-scene,form}.js`
- New: `assets/images/hero-poster.svg`
- Moved: `images/*` → `assets/images/*`
- New: `creative/higgsfield-prompts.md`, this file
