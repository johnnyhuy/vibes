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
- [ADR-0013: Lobed Glass Vessel and an Invented Nacre Film](./adr/0013-nacre-loom-lobed-glass.md) — Nacre Loom; transmission shell + weaves, no generator clone
- [ADR-0014: Playable Procedural Showcase over a Mesh-Provider Client](./adr/0014-heartwood-warden-procedural-showcase.md) — Heartwood Warden; walkable glade, not another image-to-3d client
- [ADR-0015: A Procedural Party-Game Slice, Invented Theme](./adr/0015-procedural-party-game-slice.md) — Moon Dumpling Relay; moon-gate table, no sushi-paws fork
- [ADR-0016: Runtime Foil Card Without a Blender Pipeline](./adr/0016-runtime-foil-card-without-blender.md) — Foil Tilt Card; Lumen Fox layers + foil shader, no skill fork
- [ADR-0017: A Procedural Peaceful Wander Slice](./adr/0017-zephyr-vale-procedural-wander.md) — Zephyr Vale; daylight wind letters, no Crayon clone
- [ADR-0018: A Compact Heightmap Drive Slice](./adr/0018-cinder-mere-drive-slice.md) — Cinder Mere; dusk basin drive, no Aura Valley clone
- [ADR-0019: A Procedural Stud-Brick Studio, Invented Set](./adr/0019-kiln-studs-procedural-brick-studio.md) — Kiln Studs; Ember Hare stepper, no SetCreator clone
- [ADR-0020: An Educational Landmark Scroll, Invented Chalk City](./adr/0020-alba-forum-educational-landmark-scroll.md) — Alba Forum; chalk avenue + Explore, no Rome tour clone
- [ADR-0021: A Compact Coast-Highway Drive Slice](./adr/0021-brine-causeway-coast-drive.md) — Brine Causeway; coast + coupe + span, no APEX clone
- [ADR-0022: A Harbour Walker Orbit, Invented Chassis](./adr/0022-breakwater-harbour-orbit.md) — Breakwater; dusk pier + Spile Frame, no forge clone

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
- [Interactive WebGL Orb Generator](./reverse-engineering/nacre-loom.md) — Built: Nacre Loom / 珠络 (`experiments/nacre-loom/`). Site was 404; still + copy only.
- [img2threejs monster-tree showcase](./reverse-engineering/heartwood-warden.md) — Built: Heartwood Warden / 心木守 (`experiments/heartwood-warden/`). Clean-room; no Groot / no factory paste.
- [Procedural Conveyor Party Game](./reverse-engineering/moon-dumpling-relay.md) — Built: Moon Dumpling Relay / 月饺接力 (`experiments/moon-dumpling-relay/`). README claims only; no source clone.
- [Layered Holo Tilt Card](./reverse-engineering/foil-tilt-card.md) — Built: Foil Tilt Card / Lumen Fox (`experiments/foil-tilt-card/`). README claims only; no skill / Blender / web-template copy.
- [TusharXo / Crayon wind wander](./reverse-engineering/zephyr-vale.md) — Built: Zephyr Vale / 风笺谷 (`experiments/zephyr-vale/`). Feel only; no play-bundle scrape.
- [ShifroAnimation / Aura Valley drive](./reverse-engineering/cinder-mere.md) — Built: Cinder Mere / 烬泽 (`experiments/cinder-mere/`). Feel only; no Vercel-bundle scrape.
- [Anton Klingspor / idea → brick set](./reverse-engineering/kiln-studs.md) — Built: Kiln Studs / 窑钉, Ember Hare (`experiments/kiln-studs/`). Feel only; no SetCreator scrape.
- [Levin Stanley / educational landmark scroll](./reverse-engineering/alba-forum.md) — Built: Alba Forum / 白坛 (`experiments/alba-forum/`). Feel only; no Rome-in-white scrape.
- [Arian / APEX Coast Run](./reverse-engineering/brine-causeway.md) — Built: Brine Causeway / 盐桥 (`experiments/brine-causeway/`). Feel only; no Mindblown scrape.
- [Crayon Arcade mecha / breakwater pitch](./reverse-engineering/breakwater.md) — Built: Breakwater / 防波 (`experiments/breakwater/`). Feel only; no play-bundle scrape.
- [NeuralKinetics Video-Shader Hero Pattern](./reverse-engineering/neuralkinetics-video-shader-hero.md) — Poster-first video/shader pipeline, organic motion, reduced-motion handling
- [Procedural Runtime Geometry Pattern](./reverse-engineering/procedural-runtime-geometry.md) — Steam Atlas mechanical assembly, runtime CSG, parametric parts
- [High-Fidelity Mesh Pipeline](./reverse-engineering/high-fidelity-mesh-pipeline.md) — Why Blender MCP stays blocky; Sketchfab / Poly Haven / image→3D → GLB → R3F
- [Visual Quality Bar](./visual-quality-bar.md) — Cinematic product demo aesthetic (dark UI, frosted glass, studio lighting)
- [2026-09-08 design sweep](./design-sweep-2026-09-08.md) — Frosted HUD / black studio pass vs the X refs (local QA only)

### Incidents & Lessons

Things that went sideways and what I learnt:

- [2026-09-07: Kenney to Model 3 and Missing GLB](./incidents/2026-09-07-kenney-to-model3-and-missing-glb.md)
- [2026-09-07: Stale X Post References](./incidents/2026-09-07-stale-x-post-ids.md)
- [2026-09-07: Vercel SSO Blocks Preview QA](./incidents/vercel-sso-blocks-preview-qa.md)
- [2026-09-07: Vercel Deployment Quota Exhausted](./incidents/2026-09-07-vercel-deploy-quota.md) — Free tier 100/day limit hit, production URLs serve stale commits
- [2026-09-07: Attach Preview Name-Crash](./incidents/2026-09-07-attach-preview-name-crash.md) — Material `??` defaults + unsafe `node.name` log; code landed via #12
- [2026-09-07: Semicircle Viewer Cropped Mega-Arc](./incidents/2026-09-07-semicircle-cropped-mega-arc.md) — Hardcoded / AABB-only seats cropped the 51-laptop horseshoe; now orbit-safe look-target fit
- [2026-09-08: steam-atlas Production Never Landed](./incidents/2026-09-08-steam-atlas-wrong-root.md) — first production LIVE PASS on `a94b16e` / `dpl_98Yz1BpRLivVxs63SuV4UFb7Z9WS` (assembled locomotive ~4:37am AEST); earlier 404 / `ignored-build-step`
- [2026-09-08: Glass Auto-Deployed on the Tower Merge](./incidents/2026-09-08-glass-auto-deploy-on-tower-merge.md) — glass production LIVE on `9328191`; steam / scroll / semicircle / tower did not follow (`ignored-build-step`)
- [2026-09-07: Audio-gadget linked before quota](./incidents/2026-09-07-audio-gadget-linked-before-quota.md) — `prj_N57mvThg4UcU9XxLK3F5wAICz9PA` created `deploy: false`, SSO off; Root still dashboard-owned; no production until ~2026-09-08 20:39 UTC
- [2026-09-08: README said no Vercel project after link-only creates](./incidents/2026-09-08-readme-vercel-link-only-drift.md) — kiln-studs / cinder-mere / alba-forum already exist `deploy: false`; do not promote until ~2026-09-08 20:39 UTC

### Deployment

- [Deployment notes](./deployment/) — Production aliases, quota, redeploy order
- [Vercel Root Directory hints](./deployment/vercel-root-directories.md) — Dashboard field per app; `vercel.json` cannot pin Root Directory; `ignored-build-step` skips sibling-folder commits

### Visual QA

- [Preview stills](./visual-qa/README.md) — refresh `docs/previews/<app>.png` on ship / redeploy
- [2026-09-07: Hill-Climb Visual QA Loop](./visual-qa-2026-09-07.md) — Explode mesh filter hardening, earth/v8 confirmation
- [2026-09-08: Production visual QA](./visual-qa-2026-09-08-prod.md) — explode / steam / glass / tower LIVE; semicircle still `25587f54`; scroll 404. Audio-gadget linked, not live. Wind Lea + Amber Longeron + Nacre Loom + Heartwood Warden + Moon Dumpling Relay + Foil Tilt Card + Zephyr Vale + Cinder Mere + Kiln Studs local; no new project.
- [2026-09-08: Hi-fi hero meshes](./visual-qa-2026-09-08-hifi-heroes.md) — Poly Haven forest + kiln cart + studio/sunset/night HDRIs; local only; no new project.

## Writing Style

These notes are first-person, written as I build. They're research logs, not polished documentation — rough edges intentional.

## Principles

1. **Document decisions, not just code** — The why matters more than the what
2. **Clean-room reverse engineering** — Learn from public patterns, never copy proprietary code or assets
3. **Attribution always** — Credit inspirations, link sources, respect licenses
4. **Research and education only** — This is my kitchen sink, not production code

---

Built by Johnny Huynh • MIT License • [github.com/johnnyhuy/vibes](https://github.com/johnnyhuy/vibes)
