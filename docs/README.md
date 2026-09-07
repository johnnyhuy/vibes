# vibes — Learning Notes

This directory documents my journey building the vibes experiments. I'm capturing architectural decisions, reverse-engineering notes, and lessons learnt so future-me (and anyone exploring this repo) can understand why things are the way they are.

## Contents

### Architecture Decision Records (ADRs)

Structured decisions about the monorepo's technical architecture:

- [ADR-0001: Monorepo Structure and Vercel Per-App Deployment](./adr/0001-monorepo-and-vercel-per-app.md)
- [ADR-0002: React + R3F with Real GLB over Procedural Geometry](./adr/0002-explode-r3f-and-real-glb.md)
- [ADR-0003: Blender MCP Lane (Scripts-First, MCP-Ready)](./adr/0003-blender-mcp-lane.md)
- [ADR-0004: Procedural Geometry Over Asset Loading for Mechanical Demos](./adr/0004-procedural-geometry-over-assets.md)

### Reverse Engineering

Clean-room notes from studying public projects:

- [ashemag's Model X Explode Pattern](./reverse-engineering/ashe-model-x-explode.md) — Multi-mesh GLB, 2D packing, lerp slider, product UI
- [ashemag's Anatomy Explode](./reverse-engineering/ashe-anatomy-explode.md) — 2,234-piece human anatomy, same architecture, potential next experiment
- [Blender MCP → MacBook Semicircle → Web](./reverse-engineering/blender-mcp-macbook-semicircle.md) — Agent-driven workflow (GPT Astra + Blender MCP), semicircle array math, clean-room with procedural geometry
- [WebGL Scroll Product Visualisation](./reverse-engineering/webgl-scroll-product.md) — Scroll-driven 3D (glass bottle refraction, photoreal materials, R3F patterns)
- [NeuralKinetics Video-Shader Hero Pattern](./reverse-engineering/neuralkinetics-video-shader-hero.md) — Poster-first video/shader pipeline, organic motion, reduced-motion handling
- [Procedural Runtime Geometry Pattern](./reverse-engineering/procedural-runtime-geometry.md) — Steam Atlas mechanical assembly, runtime CSG, parametric parts
- [Visual Quality Bar](./visual-quality-bar.md) — Cinematic product demo aesthetic (dark UI, frosted glass, studio lighting)

### Incidents & Lessons

Things that went sideways and what I learnt:

- [2026-09-07: Kenney to Model 3 and Missing GLB](./incidents/2026-09-07-kenney-to-model3-and-missing-glb.md)
- [2026-09-07: Stale X Post References](./incidents/2026-09-07-stale-x-post-ids.md)
- [2026-09-07: Vercel SSO Blocks Preview QA](./incidents/vercel-sso-blocks-preview-qa.md)

### Visual QA

- [2026-09-07: Hill-Climb Visual QA Loop](./visual-qa-2026-09-07.md) — Explode mesh filter hardening, earth/v8 confirmation

## Writing Style

These notes are first-person, written as I build. They're research logs, not polished documentation — rough edges intentional.

## Principles

1. **Document decisions, not just code** — The why matters more than the what
2. **Clean-room reverse engineering** — Learn from public patterns, never copy proprietary code or assets
3. **Attribution always** — Credit inspirations, link sources, respect licenses
4. **Research and education only** — This is my kitchen sink, not production code

---

Built by Johnny Huynh • MIT License • [github.com/johnnyhuy/vibes](https://github.com/johnnyhuy/vibes)
