# Higgsfield prompts — GUDOVA GROUP hero visuals

Not generated yet. The live hero currently uses a coded Three.js scene
(`assets/js/three-scene.js`) plus a static SVG poster
(`assets/images/hero-poster.svg`) as the fallback — no video generation
cost was spent without an explicit go-ahead, since Higgsfield generation
draws on paid credits.

To upgrade to the cinematic version: run these prompts through Higgsfield,
export the results to the paths listed at the bottom, and the `<video>`
markup can replace the current `<canvas>`/poster pair in `index.html`
(`.hero-stage`). Ask for this explicitly when ready to spend the credits.

## Prompt 1 — Hero frame (image)

Premium cinematic architectural digital twin of a large institutional building under construction, emerging from precise technical blueprint lines and a dark coordinate grid, exposed concrete slabs, structural steel columns and beams, translucent engineering layers, subtle warm copper accent lighting, deep graphite studio environment, sophisticated construction consulting aesthetic, realistic materials, controlled volumetric atmosphere, elegant editorial composition, large clean negative space on the left for website typography, subject positioned on the right, no people, no workers, no vehicles, no text, no letters, no logos, no company names, no safety helmets, no stock-photo look, no futuristic sci-fi city, photorealistic architectural CGI, high geometric consistency, 16:9.

## Prompt 2 — Desktop hero animation (image-to-video)

Animate the supplied architectural digital twin reference image. Begin with faint blueprint grid lines, then let structural columns, beams and floor slabs assemble gradually and precisely into a coherent building framework. Use a very slow cinematic dolly-in combined with a subtle arc-left camera move. Keep the geometry stable and physically consistent. Copper engineering markers illuminate one after another. Add only minimal atmospheric dust and controlled volumetric light. The movement must feel premium, precise and architectural, not dramatic or chaotic. Preserve large negative space on the left for HTML text. No people, no text, no logos, no morphing, no melting geometry, no sudden camera motion. Create a calm seamless loop, approximately 8 seconds, 16:9.

## Prompt 3 — Mobile hero animation (image-to-video)

Vertical cinematic architectural digital twin, exposed concrete and steel construction emerging from blueprint lines, building framework centered slightly below the middle of the frame, clean dark negative space in the upper part for website typography, graphite and warm copper color palette, slow controlled dolly-in, very subtle vertical crane movement, stable geometry, premium engineering consulting mood, no people, no text, no logos, no vehicles, no rapid motion, no distorted architecture, seamless calm loop, 9:16.

## Prompt 4 — Final CTA visual (image-to-video)

Macro cinematic view of an architectural blueprint transforming into a precise three-dimensional structural model, technical lines, dimensions and construction layers aligning perfectly, dark graphite background, warm copper highlights, controlled studio lighting, premium engineering consultancy aesthetic, slow focus shift and subtle dolly movement, no text, no logos, no people, no chaotic particles, no distorted geometry, 16:9.

## Generation notes

- Prefer image-to-video over pure text-to-video: generate prompt 1 as a still first, then animate it with prompts 2–4 as motion instructions on that still.
- Use slow, controlled camera moves (dolly-in, arc-left, hero-cam) — no game-style or handheld motion.
- Do not generate on-screen text, logos, or the founder's face in any clip.
- Keep color/material treatment consistent across all four outputs (dark graphite + copper, matte concrete/steel, no plastic CGI sheen).

## Expected output paths (once generated)

```
assets/video/gudova-hero-desktop.webm
assets/video/gudova-hero-desktop.mp4
assets/video/gudova-hero-mobile.webm
assets/video/gudova-hero-mobile.mp4
assets/images/gudova-hero-poster.avif
assets/images/gudova-hero-poster.webp
```

Video requirements when wired in: `muted`, `autoplay`, `loop`, `playsinline`, a `poster` attribute, playback paused via `IntersectionObserver` when off-screen (same pattern already used for the Three.js scene), and the existing SVG poster kept as the `prefers-reduced-motion` / no-JS fallback.
