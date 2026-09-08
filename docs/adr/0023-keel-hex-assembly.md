# ADR-0023: A Step-Sequenced Hex Trainer Assembly, Invented Chassis

**Date**: 2026-09-08  
**Status**: Accepted  
**Context**: [vibes](../../) monorepo  
**Related**: [keel-hex.md](../reverse-engineering/keel-hex.md), [keel-hex](../../experiments/keel-hex/), [ADR-0004](./0004-procedural-geometry-over-assets.md), [ADR-0002](./0002-explode-r3f-and-real-glb.md), [ADR-0019](./0019-kiln-studs-procedural-brick-studio.md), [ADR-0022](./0022-breakwater-harbour-orbit.md)

## Context

@Peter05704721 posted a GPT-6 Astra + Three.js product: an assembly view for a drone / flight-controller build, with a step scrubber, parts coming together, explore the completed aircraft, and Replay. I wanted the *lesson* — authored marks + a white studio + a scrubber — without scraping the live Pages site, cloning an OEM part catalog, or shipping another product explode.

Explode-assembly (ADR-0002) already maps a Tesla Model 3 into isolate / explode. Kiln Studs (ADR-0019) already steps a brick set. Japanese-tower already lifts a pagoda. The missing kitchen-sink lesson is **step-sequenced aircraft assembly storytelling**. Hobby Vercel quota is still 0 until ~2026-09-08 20:39 UTC, so the experiment stays local. **No Vercel project.** Breakwater already took ADR-0022 on `main`.

## Decision

### 1. Procedural hex trainer, not their quad catalog

**Chosen**: Vite + React + R3F + drei + three `~0.170`. A hex deck I named **KH-55 / Spool Plate**. Lathed rotor cups, extruded hex plate, copper two-blade petals, celadon Nest Board. MeshPhysical + a vendored Poly Haven Studio Small 03 1k HDRI (CC0) behind a nested `Suspense`, so a slow env fetch cannot blank the canvas.

**Rejected**:
- Scraping s3-px4-assembly.pages.dev or their bundle
- A Kenney / marketplace drone kit
- Flat unchamfered boxes
- Reusing explode-assembly’s Model 3 GLB as a “drone”

**Why**: ADR-0004 already prefers primitives when the code *is* the lesson. Johnny asked for denser meshes + PBR/HDRI over Kenney toys. A hex silhouette cannot be mistaken for their quad.

### 2. An invented bench, not their copy

**Chosen**: Keel Hex · 龙骨盘. Brand `vibes · keel hex`. Marks I wrote (Spool Plate … Bench complete). Place: Spool Bay / 卷湾.

**Rejected**: PX4, S3, OEM flight-controller nouns, their “from board to aircraft” line, their 12/12 chrome as a spec.

**Why**: Clean-room. The pattern is “walk a trainer together.” The chassis has to be one I can stand behind.

### 3. Assembled / Inside / Exploded, not a Tesla gallery

**Chosen**: Three numbered modes. **Play assembly** still walks the twelve invented marks (the old scrubber, now a CTA). Exploded is a 0–100% distance slider with authored offsets — not explode-assembly’s 2D pack. Inside lifts the Spool Cell and hides the spine so the Nest Board stays readable. Toggles: labels, auto rotate, petals, loom, tide vane, sight bead.

**Rejected**: Their S3 / PX4 chrome, language chip, and OEM part strings. Extending explode-assembly with a drone GLB. A 200-piece CAD dump.

**Why**: A later feel-only still of the live site preferred modes + explode + labels over a pure 12-step dock. The walk stays; it is no longer the only control.

### 4. White studio, not another dusk demo

**Chosen**: Off-white paper floor, soft contact shadow, studio key. Light frosted HUD (Alba Forum family, forest-teal accent). Floating Html labels with leaders.

**Rejected**: Cinder Mere / Breakwater dusk. A black car studio.

**Why**: The public thumb is a clean-room bench. The kitchen sink already has enough ember haze.

### 5. No Vercel project this pass

**Chosen**: `vercel.json` with `framework: vite`, `outputDirectory: dist`, `ignoreCommand`. No `create_git_project`. README and this ADR say **local-only**. Post-quota name, if I add one: `vibes-keel-hex`.

**Rejected**: Creating a project while quota is 0. Also still no new project for breakwater or the older local-only stack.

**Why**: Pending Roots already have an order. A new Hobby project would only add ignore-step noise.

## Consequences

### Positive

1. You can read the twelve marks and the arrive offsets in one folder
2. Bundle stays code-only plus one CC0 HDRI
3. Branding cannot be mistaken for PX4 / S3 or explode-assembly

### Negative

1. A procedural trainer is not a photogrammetry airframe
2. Twelve marks are not a 200-piece CAD kit
3. Local QA only until a project exists

## Alternatives considered

- **CC-BY drone GLB** — allowed if licensed. I wanted the marks to stay inspectable in code, and a downloaded quad would *read* as their demo.
- **Four rotors** — closer to the thumb; easier to accuse of a clone. Six spars is the clean-room silhouette.
- **Web Audio bench clicks** — mute-default if I add any. Silence is enough for this pass.

## Validation

```bash
cd experiments/keel-hex
npm install && npm run build
```

Do **not** create a Vercel project or deploy until quota resets (~2026-09-08 20:39 UTC). If I add one later: Root Directory = `experiments/keel-hex`.

## References

- [Peter05704721](https://x.com/Peter05704721/status/2097144569989300371)
- [Public live](https://s3-px4-assembly.pages.dev) — pitch / feel only; I did not copy source
- [Poly Haven — Studio Small 03](https://polyhaven.com/a/studio_small_03)

---

**Decision made by**: Johnny Huynh  
**Review status**: Self-approved (solo learning project)
