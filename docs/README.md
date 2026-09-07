# vibes — Learning Notes

This directory documents my journey building the vibes experiments. I'm capturing architectural decisions, reverse-engineering notes, and lessons learnt so future-me (and anyone exploring this repo) can understand why things are the way they are.

## Contents

### Architecture Decision Records (ADRs)

Structured decisions about the monorepo's technical architecture:

- [ADR-0001: Monorepo Structure and Vercel Per-App Deployment](./adr/0001-monorepo-and-vercel-per-app.md)
- [ADR-0002: React + R3F with Real GLB over Procedural Geometry](./adr/0002-explode-r3f-and-real-glb.md)
- [ADR-0003: Blender MCP Lane (Scripts-First, MCP-Ready)](./adr/0003-blender-mcp-lane.md)
- [ADR-0004: Procedural Geometry Over Asset Loading for Mechanical Demos](./adr/0004-procedural-geometry-over-assets.md)
- [ADR-0005: Scroll-Driven Product Hero Pattern](./adr/0005-scroll-driven-product-hero.md) — Amended 2026-09-08: lathe bottle + native window scroll
- [ADR-0006: Glass Capability Map](./adr/0006-glass-capability-map.md) — Light clinical stage + live pixel-QA node
- [ADR-0007: Season / Weather as First-Class Scene State](./adr/0007-scene-atmosphere-state.md) — Ridge Pagoda atmosphere uniforms
- [ADR-0008: cannon-es Marble Controller](./adr/0008-cannon-es-marble-controller.md) — Nimbus Path contact feels, no physics wrapper
- [ADR-0009: Procedural Courtyard Without a Blender Pipeline](./adr/0009-procedural-courtyard-without-blender.md) — North Court primitives instead of their GLB
- [ADR-0010: Procedural Headphone Spin, Mute-Default Web Audio](./adr/0010-procedural-audio-spin-mute-default.md) — Lumen Cuff turntable; mute on by default
- [ADR-0011: Procedural Grass via Instancing and Shaders](./adr/0011-procedural-grass-instancing.md) — Wind Lea; crossed blades, not a turf GLB
- [ADR-0012: Procedural Wood Biplane Over a Reference GLB](./adr/0012-procedural-wood-biplane.md) — Amber Longeron; canvas grain, no Jenny GLB

### Reverse Engineering

Clean-room notes from studying public projects:

- [ashemag's Model X Explode Pattern](./reverse-engineering/ashe-model-x-explode.md) — Multi-mesh GLB, 2D packing, lerp slider, product UI
- [ashemag's Anatomy Explode](./reverse-engineering/ashe-anatomy-explode.md) — 2,234-piece human anatomy, same architecture, potential next experiment
- [Blender MCP → MacBook Semicircle → Web](./reverse-engineering/blender-mcp-macbook-semicircle.md) — Agent-driven workflow (GPT Astra + Blender MCP), semicircle array math, clean-room with procedural geometry
- [Blender MCP → Product Keyboard Workflow](./reverse-engineering/blender-mcp-product-keyboard.md) — Offline rendering pipeline (scripts → render → web), product photography techniques
- [WebGL Scroll Product Visualisation](./reverse-engineering/webgl-scroll-product.md) — Scroll-driven 3D (glass bottle refraction, photoreal materials, R3F patterns)
- [Glass Capability Brain](./reverse-engineering/glass-capability-brain.md) — Built: orbiting capability nodes + live canvas pixel QA (`experiments/glass-capability-brain/`)
- [Japanese Tower / Seasonal Atmosphere](./reverse-engineering/japanese-tower-threejs.md) — Built: procedural pagoda + season / day / weather / haze (`experiments/japanese-tower/`)
- [Rolling Marble / Ocean of Clouds](./reverse-engineering/ballance-roll-threejs.md) — Built: Haze Walk + wood/stone/metal (`experiments/ballance-roll/`). Ocean/dolphin still parked.
- [Chinese Courtyard](./reverse-engineering/chinese-courtyard-threejs.md) — Built: four-sided North Court (`experiments/chinese-courtyard/`). Studied Blender→GLB→Three; shipped primitives.
- [Audio Gadget Product Spin](./reverse-engineering/audio-gadget-product-spin.md) — Built: Lumen Cuff turntable (`experiments/audio-gadget-spin/`)
- [Procedural Grass Field](./reverse-engineering/procedural-grass-field.md) — Built: Wind Lea meadow (`experiments/procedural-grass-field/`)
- [Vintage Wooden Biplane Lane-Dodge](./reverse-engineering/amber-longeron.md) — Built: Amber Longeron / Kiln Run (`experiments/amber-longeron/`)
- [NeuralKinetics Video-Shader Hero Pattern](./reverse-engineering/neuralkinetics-video-shader-hero.md) — Poster-first video/shader pipeline, organic motion, reduced-motion handling
- [Procedural Runtime Geometry Pattern](./reverse-engineering/procedural-runtime-geometry.md) — Steam Atlas mechanical assembly, runtime CSG, parametric parts
- [Visual Quality Bar](./visual-quality-bar.md) — Cinematic product demo aesthetic (dark UI, frosted glass, studio lighting)
- [2026-09-08 design sweep](./design-sweep-2026-09-08.md) — Frosted HUD / black studio pass vs the X refs (local QA only)

### Incidents & Lessons

Things that went sideways and what I learnt:

- [2026-09-07: Kenney to Model 3 and Missing GLB](./incidents/2026-09-07-kenney-to-model3-and-missing-glb.md)
- [2026-09-07: Stale X Post References](./incidents/2026-09-07-stale-x-post-ids.md)
- [2026-09-07: Vercel SSO Blocks Preview QA](./incidents/vercel-sso-blocks-preview-qa.md)
- [2026-09-07: Vercel Deployment Quota Exhausted](./incidents/2026-09-07-vercel-deploy-quota.md) — Free tier 100/day limit hit, production URLs serve stale commits
- [2026-09-07: Attach Preview Name-Crash](./incidents/2026-09-07-attach-preview-name-crash.md) — Material `??` defaults + unsafe `node.name` log; code landed via #12
- [2026-09-07: Semicircle Viewer Cropped Mega-Arc](./incidents/2026-09-07-semicircle-cropped-mega-arc.md) — Hardcoded camera clipped the 51-laptop 180° array; now bbox-framed
- [2026-09-08: steam-atlas Production Never Landed](./incidents/2026-09-08-steam-atlas-wrong-root.md) — first production LIVE PASS on `a94b16e` / `dpl_98Yz1BpRLivVxs63SuV4UFb7Z9WS` (assembled locomotive ~4:37am AEST); earlier 404 / `ignored-build-step`
- [2026-09-08: Glass Auto-Deployed on the Tower Merge](./incidents/2026-09-08-glass-auto-deploy-on-tower-merge.md) — glass production LIVE on `9328191`; steam / scroll / semicircle / tower did not follow (`ignored-build-step`)
- [2026-09-07: Audio-gadget linked before quota](./incidents/2026-09-07-audio-gadget-linked-before-quota.md) — `prj_N57mvThg4UcU9XxLK3F5wAICz9PA` created `deploy: false`, SSO off; Root still dashboard-owned; no production until ~2026-09-08 20:39 UTC

### Deployment

- [Deployment notes](./deployment/) — Production aliases, quota, redeploy order
- [Vercel Root Directory hints](./deployment/vercel-root-directories.md) — Dashboard field per app; `vercel.json` cannot pin Root Directory; `ignored-build-step` skips sibling-folder commits

### Visual QA

- [Preview stills](./visual-qa/README.md) — refresh `docs/previews/<app>.png` on ship / redeploy
- [2026-09-07: Hill-Climb Visual QA Loop](./visual-qa-2026-09-07.md) — Explode mesh filter hardening, earth/v8 confirmation
- [2026-09-08: Production visual QA](./visual-qa-2026-09-08-prod.md) — explode / steam / glass / tower LIVE; semicircle still `25587f54`; scroll 404. Audio-gadget linked, not live. Wind Lea + Amber Longeron local; no new project.

## Writing Style

These notes are first-person, written as I build. They're research logs, not polished documentation — rough edges intentional.

## Principles

1. **Document decisions, not just code** — The why matters more than the what
2. **Clean-room reverse engineering** — Learn from public patterns, never copy proprietary code or assets
3. **Attribution always** — Credit inspirations, link sources, respect licenses
4. **Research and education only** — This is my kitchen sink, not production code

---

Built by Johnny Huynh • MIT License • [github.com/johnnyhuy/vibes](https://github.com/johnnyhuy/vibes)
