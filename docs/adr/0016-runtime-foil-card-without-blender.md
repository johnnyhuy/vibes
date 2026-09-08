# ADR-0016: Runtime Foil Card Without a Blender Pipeline

**Date**: 2026-09-08  
**Status**: Accepted  
**Context**: [vibes](../../) monorepo  
**Related**: [foil-tilt-card.md](../reverse-engineering/foil-tilt-card.md), [foil-tilt-card](../../experiments/foil-tilt-card/), [ADR-0004](./0004-procedural-geometry-over-assets.md), [ADR-0013](./0013-nacre-loom-lobed-glass.md)

## Context

@everettfish0408 posted an open-source Codex skill for 3D laser / holo cards: generate four art layers, build a Blender parallax + laser material, export a Three.js tilt / flip page. The public README is a product pitch (skill pack, portable Blender, `card.blend`, config JSON). I wanted the *lesson* — layered print + view-dependent foil + drag-to-tilt — without forking their source, tutorial text, or demo subjects.

A cloned `web-template` or a pasted laser node tree would look borrowed. Hobby Vercel quota is still 0 until ~2026-09-08 20:39 UTC, so the experiment stays local. **No Vercel project.** Moon Dumpling Relay already took ADR-0015 on `main`.

## Decision

### 1. Four runtime canvases, not their PNG / Blender pipeline

**Chosen**: Vite + React + R3F + drei + three `~0.170`, same stack as Nacre Loom / Heartwood Warden / Moon Dumpling Relay. `layers.ts` paints subject, night field, filigree, and type at runtime. Planes share a rounded-rect UV. Soft Z offsets plus a little XY slip do the parallax.

**Rejected**:
- Cloning `EverettFish/holo-card-studio`
- Shipping `card.blend` or their web-template
- Scraping their generated PNGs
- A single flat photograph with a CSS `rotate`

**Why**: ADR-0004 already prefers primitives when the code *is* the lesson. Four canvases you can read teach the stack without tracing their skill.

### 2. An invented moon-fox, not their subjects

**Chosen**: Lumen Fox · No.042 / 流光狐. Geometric head, crescent chest, three light plumes. Grade I named **Nightbound**. Reverse is a hex seal + deco lattice + *light that remembers*.

**Rejected**: Their demo characters, Pokémon / other IP, the GitHub OG silhouette, their Chinese tutorial samples.

**Why**: Clean-room. The pattern is “a card of someone.” The someone has to be mine.

### 3. A foil shader I wrote, not their laser nodes

**Chosen**: Custom GLSL. Fresnel term + view-vector phase → rainbow. A hash sparkle. Print mode tints the night field; additive mode sits on top as a glaze. HUD uniforms: foil, tilt feel, spread. Defaults I picked (0.68 / 0.92 / 0.30).

**Rejected**: Their packed Blender laser group, their factory depths (1.25 / 0.4 / −0.25), MeshPhysical iridescence alone (too subtle for the lesson).

**Why**: Nacre Loom already proved an invented film. This is the card-shaped version: the rainbow has to move when you drag.

### 4. Frosted HUD, local-only, no audio

**Chosen**: Same 2026-09-08 glass topbar / desk. Brand `vibes · foil tilt card`. Recto / verso, not their face labels. No Web Audio (nothing to mute).

**Rejected**: Their control-bar copy, auto-play noun, screenshot chrome.

**Why**: The kitchen-sink already has a HUD language.

### 5. No Vercel project this pass

**Chosen**: `vercel.json` with `framework: vite`, `outputDirectory: dist`, `ignoreCommand`. No `create_git_project`. README and this ADR say **local-only**.

**Rejected**: `vibes-foil-tilt-card` while quota is 0. Also still no new project for ballance-roll, courtyard, amber-longeron, nacre-loom, heartwood-warden, or moon-dumpling-relay.

**Why**: Pending Roots already have an order. A new Hobby project would only add ignore-step noise.

## Consequences

### Positive

1. You can read why the fox sits forward and why the rainbow walks
2. Bundle stays code-only — no PNG pack, no Blender
3. Branding cannot be mistaken for Holo Card Studio

### Negative

1. Canvas paint is not a commissioned illustration
2. Additive foil + bloom can still dip on a weak GPU
3. Local QA only until a project exists

## Alternatives considered

- **MeshPhysicalMaterial iridescence only** — fewer lines, weaker “snack-card flash.”
- **One baked card texture** — hides the four-layer lesson.
- **Shipping their skill / Blender portable** — out of scope, and it would *read* as a fork.

## Validation

```bash
cd experiments/foil-tilt-card
npm install && npm run build
```

Do **not** create a Vercel project or deploy until quota resets (~2026-09-08 20:39 UTC). If I add one later: Root Directory = `experiments/foil-tilt-card`.

## References

- [EverettFish](https://x.com/everettfish0408/status/2096765359282061544)
- [holo-card-studio README](https://github.com/EverettFish/holo-card-studio) — claims only; I did not copy source

---

**Decision made by**: Johnny Huynh  
**Review status**: Self-approved (solo learning project)
