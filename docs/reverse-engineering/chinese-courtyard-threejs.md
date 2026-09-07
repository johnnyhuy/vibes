# Reverse Engineering: Chinese Courtyard (Blender → GLB → Three.js)

**References**:
- [MrLarus](https://x.com/MrLarus/status/2096971051334857181) — “A few chats with GPT-6 Astra turned into an interactive 3D Chinese courtyard” (verified 2026-09-08 via X API, post id `2096971051334857181`)
- Quoted parent: [LufzzLiz](https://x.com/LufzzLiz/status/2096033610369483104) — Blender modelling + Three.js + “your idea”
- Video thumb (vibe / composition only): `hill-climb/refs/chinese-courtyard-thumb.jpg`

**Study date**: 2026-09-08  
**Purpose**: Clean-room notes. Built as `experiments/chinese-courtyard/`.

**Disclaimer**: I studied the public post and the attached video thumb. No code, no assets, no branding copied. This demo is first-person Johnny Huynh / vibes — it is **not** their site.

---

## What The Post Is

@MrLarus posted an interactive 3D Chinese courtyard and named the public workflow:

1. GPT-6 Astra writes Python and builds the scene in Blender
2. Export to GLB
3. Three.js on the web

Copy: *“A surprisingly lively demo for interior and spatial design!”*

The t.co in the post expands to the **video attachment**, not a live product URL I opened. I treated the post text + thumb as the spec and invented the rest.

## What The Thumb Actually Shows

A high-angle isometric still. Observed *read* (pattern only — I am not restating their wordmark or poster lines):

- An **L-shaped** pavilion on a raised tiled plinth
- Curved dark-tile roofs, white plaster, a free-standing **moon gate**
- A recessed pond with lily pads, cloud-pruned pines, bamboo
- Soft sage haze, cube lanterns, a small cat on the deck
- Dark “Scene Study” chrome, colour swatches, Chinese toggles

That is a **diorama study**, not a product turntable. I used it for atmosphere (calm, pale, tiled) and **not** as a mesh spec.

## The public pattern I studied

```
LLM writes Blender Python  →  artist scene in .blend  →  export GLB  →  Three.js viewer
```

That is the same family as [ADR-0003](../adr/0003-blender-mcp-lane.md) / `blender-semicircle-viewer`. The lesson is the **pipeline**, not their courtyard mesh.

I did **not** run their scripts. I did **not** ship a downloaded GLB.

## What I built instead

Procedural primitives in Vite + React + R3F. See [ADR-0009](../adr/0009-procedural-courtyard-without-blender.md).

My court (original plan):

- A **four-sided** siheyuan — north hall, east and west wings, south wall
- A circular moon gate **cut** with `ExtrudeGeometry` + a hole (not a boolean of their wall)
- Hip roofs from four-sided cones + eave plates
- A grid of paving tiles, a rectangular pond, three orange koi that orbit
- Cone pines and bamboo stalks — not cloud-pruned sphere clusters
- Season × day/night → one `ResolvedLook` (ADR-0007)

Branding is mine: `vibes · siheyuan` / **北庭** / North Court.

## What I did not copy

| Their public *read* | Mine |
| --- | --- |
| L-shaped pavilion | Closed four-sided court |
| Cloud-pruned pines | Cone stacks + bamboo cylinders |
| Dark Scene Study panel, gold/white/blue swatches | Pale glass header, season chips, sun slider |
| Chinese product toggles / orange action | `vibes · siheyuan` |
| Blender → GLB | Runtime primitives |
| Cat on the deck | No cat |
| Their product name | 北庭 / North Court |

## Why this pattern exists

A courtyard is a **spatial** demo. Interior and landscape AI-3D wants:

- Enclosure you can orbit
- A gate you can see through
- Air that changes (season / sun)

Their pipeline is honest for artist detail. Mine is honest for a kitchen-sink that must stay clean-room and tiny.

## Related

- Built: `experiments/chinese-courtyard/`
- Atmosphere sibling: `experiments/japanese-tower/` + [ADR-0007](../adr/0007-scene-atmosphere-state.md)
- Blender pipeline sibling: [ADR-0003](../adr/0003-blender-mcp-lane.md)
- Earlier park note: [ballance-roll-threejs.md](./ballance-roll-threejs.md) (now built, not parked)

## Attribution & Ethics

- @MrLarus inspired this study
- I am **not** redistributing their video, GLB, or UI
- Geometry and chrome are original
- Research and education only

---

**Author**: Johnny Huynh  
**Purpose**: Learning and education — documenting a public pattern  
**Last updated**: 2026-09-08
