# ADR-0018: A Compact Heightmap Drive Slice

**Date**: 2026-09-08  
**Status**: Accepted  
**Context**: [vibes](../../) monorepo  
**Related**: [cinder-mere.md](../reverse-engineering/cinder-mere.md), [cinder-mere](../../experiments/cinder-mere/), [ADR-0004](./0004-procedural-geometry-over-assets.md), [ADR-0010](./0010-procedural-audio-spin-mute-default.md), [ADR-0012](./0012-procedural-wood-biplane.md), [ADR-0017](./0017-zephyr-vale-procedural-wander.md)

## Context

@ShifroAnimation posted a Muse Spark-assisted Three.js driving demo. The live they linked markets an ultra-realistic open-world sunset valley at open-world scale. I wanted the *read* — a dusk basin you can drive, with a cart that leans on the ground and a sky that can change — without cloning their world, vehicle, HUD, or bundle.

Zephyr Vale (ADR-0017) already covers a **sunlit walker**. Heartwood Warden is a moonlit walk. Amber Longeron is a lane-dodge biplane. Ballance-roll already took cannon-es for a marble. A 16 km² clone would miss the kitchen-sink lesson and blow the budget. Hobby Vercel quota is still 0 until ~2026-09-08 20:39 UTC, so the experiment stays local. **No Vercel project.**

## Decision

### 1. A compact basin, not an open-world clone

**Chosen**: Vite + React + R3F + drei + three `~0.170`. One `heightAt(x, z)` bowl ~128 units across. Water in the middle. Dusk haze. Soft follow cam.

**Rejected**:
- Scraping the Aura Valley / gg-shifro bundle
- A 16 km² heightmap or streamed tiles
- Extending Zephyr Vale with a car
- cannon-es four-wheel suspension

**Why**: The hypothesis is that a readable bowl + arcade cart + fog is enough to teach the *drive-in-a-valley* pattern. Scale is a production problem, not the lesson.

### 2. An invented cart, not their GT

**Chosen**: Soot Runner / 炱奔. Box chassis, drum wheels, roll hoop, soot canvas, lanterns. Height samples + slope pitch/roll.

**Rejected**: Their vehicle name / silhouette. A marketplace sports-car GLB. A Kenney racer.

**Why**: ADR-0004 prefers primitives when the code is the lesson. A utility kiln cart is a different read from a pearl clear-coat GT.

### 3. Invented marks and chrome

**Chosen**: Cinder Mere / 烬泽. Wick Spire, Pewter Jetty, Low Kiln, Flint Ford. Thin frosted 2026-09-08 HUD (brand, editorial, one pace chip). Brand `vibes · cinder mere`. A 2026-09-08 live still showed hood-cam meadow + dense vehicle chrome; I kept dusk follow-cam and did not add tabs, swatches, a loop map, or a giant speedo.

**Rejected**: Their valley title, loop names, time-chip labels as a spec, hidden-cursor look chrome, autosteer.

**Why**: Clean-room. The pattern is “drive a dusk basin.” The place has to be one I can stand behind.

### 4. Two looks, mute-default reed bed

**Chosen**: Dusk (default), day, and a slow cycle. Filtered noise + two sines, mute on first load (ADR-0010).

**Rejected**: Their five-stop day clock as a clone. Autoplaying music.

**Why**: Daytimes are the public pitch. Two authored looks teach the same idea. Audio stays opt-in.

### 5. No Vercel project this pass

**Chosen**: `vercel.json` with `framework: vite`, `outputDirectory: dist`, `ignoreCommand`. No `create_git_project`. Post-quota name, if I add one: `vibes-cinder-mere`.

**Rejected**: Creating a project while quota is 0. Also still no new project for zephyr-vale or the older local-only stack.

**Why**: Pending Roots already have an order: semicircle, scroll-product, audio-gadget, grass, then the local-only stack.

## Consequences

### Positive

1. You can read why the mere is low and the rim is high
2. Vehicle feel lives in one function
3. Distinct from Zephyr Vale, Heartwood Warden, Amber Longeron, and Ballance-roll
4. Bundle stays code-only

### Negative

1. Boxes are not a photographed car
2. Arcade height samples are not tyre contact
3. Local QA only until a project exists

## Alternatives considered

- **CC-BY buggy GLB** — fine if the licence is clear; I still wanted the cart to be inspectable in one file.
- **cannon-es raycast vehicle** — right for a later physics lesson; overkill next to ADR-0008’s marble.
- **Pointer-lock free look** — their live *read* has it. I kept a soft follow so the first frame is the cart and the basin.

## Validation

```bash
cd experiments/cinder-mere
npm install && npm run build
```

Do **not** create a Vercel project or deploy until quota resets (~2026-09-08 20:39 UTC). If I add one later: Root Directory = `experiments/cinder-mere`.

## References

- [ShifroAnimation](https://x.com/ShifroAnimation/status/2097116905068966284)
- [Public live](https://gg-shifro.vercel.app/)
- [Three.js PlaneGeometry](https://threejs.org/docs/#api/en/geometries/PlaneGeometry)

---

**Decision made by**: Johnny Huynh  
**Review status**: Self-approved (solo learning project)
