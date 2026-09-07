# vibes — Learning Notes

This directory documents my journey building the vibes experiments. I'm capturing architectural decisions, reverse-engineering notes, and lessons learnt so future-me (and anyone exploring this repo) can understand why things are the way they are.

## Contents

### Architecture Decision Records (ADRs)

Structured decisions about the monorepo's technical architecture:

- [ADR-0001: Monorepo Structure and Vercel Per-App Deployment](./adr/0001-monorepo-and-vercel-per-app.md)
- [ADR-0002: React + R3F with Real GLB over Procedural Geometry](./adr/0002-explode-r3f-and-real-glb.md)

### Reverse Engineering

Clean-room notes from studying public projects:

- [ashemag's Model X Explode Pattern](./reverse-engineering/ashe-model-x-explode.md) — Multi-mesh GLB, 2D packing, lerp slider, product UI
- [Visual Quality Bar](./visual-quality-bar.md) — Cinematic product demo aesthetic (dark UI, frosted glass, studio lighting)

### Incidents & Lessons

Things that went sideways and what I learnt:

- [2026-09-07: Kenney to Model 3 and Missing GLB](./incidents/2026-09-07-kenney-to-model3-and-missing-glb.md)
- [2026-09-07: Stale X Post References](./incidents/2026-09-07-stale-x-post-ids.md)

## Writing Style

These notes are first-person, written as I build. They're research logs, not polished documentation — rough edges intentional.

## Principles

1. **Document decisions, not just code** — The why matters more than the what
2. **Clean-room reverse engineering** — Learn from public patterns, never copy proprietary code or assets
3. **Attribution always** — Credit inspirations, link sources, respect licenses
4. **Research and education only** — This is my kitchen sink, not production code

---

Built by Johnny Huynh • MIT License • [github.com/johnnyhuy/vibes](https://github.com/johnnyhuy/vibes)
