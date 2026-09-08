# ADR-0022: A Harbour Walker Orbit, Invented Chassis

**Date**: 2026-09-08  
**Status**: Accepted  
**Context**: [vibes](../../) monorepo  
**Related**: [breakwater.md](../reverse-engineering/breakwater.md), [breakwater](../../experiments/breakwater/), [ADR-0004](./0004-procedural-geometry-over-assets.md), [ADR-0010](./0010-procedural-audio-spin-mute-default.md), [ADR-0018](./0018-cinder-mere-drive-slice.md), [ADR-0021](./0021-brine-causeway-coast-drive.md)

## Context

A public Crayon Arcade pitch showed a mecha / flooded-harbour WebGL demo: dusk HUD, chassis picker, a coastal breakwater. I wanted the *read* — a heavy walker on a dusk pier, stylized water, orbit — without cloning their forge, chassis nouns, or play bundle.

Brine Causeway (ADR-0021) already covers a **coast highway + coupe**. Cinder Mere is a dusk basin drive. Heartwood Warden is a woodland walker. A fighter-sim clone would miss the kitchen-sink lesson. Hobby Vercel quota is still 0 until ~2026-09-08 20:39 UTC, so the experiment stays local. **No Vercel project.**

## Decision

### 1. Orbit a pier, do not drive another coast

**Chosen**: Vite + React + R3F + drei + three `~0.170`. One authored pier, tetrapod groyne, tide gate. OrbitControls + three invented marks. Always-on explore.

**Rejected**:
- Scraping the play bundle or chassis picker
- Extending Brine Causeway with a walker
- A combat loop, combo list, or deploy CTA
- Kenney toy robots as the hero

**Why**: The public hook is “a heavy machine on a flooded harbour.” The lesson is framing + a readable walker, not another arcade drive.

### 2. An invented walker, not their chassis list

**Chosen**: Spile Frame / 桩架, SF-04 HARBOUR. Procedural pile-shoes, ballast torso, hook boom, pile-ram. Poly Haven had no dense harbour-walker GLB at study time.

**Rejected**: Their machine nouns (and any OEM mecha names). A Kenney robot. Extending Heartwood Warden’s woodland gait.

**Why**: ADR-0004 — the code *is* the lesson. Boxes with physical materials stay inspectable and legally mine.

### 3. Invented names and chrome

**Chosen**: Breakwater / 防波. Brand `vibes · breakwater`. Marks: Spile Frame, Groyne Head, Tide Gate. Thin frosted dusk HUD (Cinder Mere / kiln tokens). No machine grid.

**Rejected**: Their forge title, chassis list, war-zone chips, or deploy copy as a spec.

**Why**: Clean-room. The pattern is “orbit a harbour walker.” The place has to be one I can stand behind.

### 4. Stylized water + local harbour HDRI

**Chosen**: Sine-displaced water plane. Small Harbour Sunset 1k HDRI vendored locally (CC0). Dusk tide / afterglow / fog bank. Mute-default surf (ADR-0010).

**Rejected**: Their water shader. A hot HDRI CDN. Venice Sunset / The Sky Is On Fire reuse.

**Why**: A still ocean reads as a floor. A dusk harbour needs motion and a local env or the canvas blanks on a blocked CDN.

### 5. No Vercel project this pass

**Chosen**: `vercel.json` with `framework: vite`, `outputDirectory: dist`, `ignoreCommand`. No `create_git_project`. Post-quota name, if I add one: `vibes-breakwater`. Root Directory = `experiments/breakwater`.

**Rejected**: Creating a project while quota is 0.

**Why**: Pending Roots already have an order. A new Hobby project would only add ignore-step noise.

## Consequences

### Positive

1. Distinct from Brine Causeway: pier + walker, not highway + coupe
2. Walker geometry stays inspectable in one file
3. HDRI is local; the canvas does not blank on a blocked CDN

### Negative

1. A box walker is not a photographed mech
2. Sine water is not a spectrum ocean
3. Local QA only until a project exists

## Alternatives considered

- **Kenney / itch CC0 robot** — licence is fine; the silhouette is a toy, not a harbour-walker read.
- **Poly Haven industrial kitbash as the hero** — no dense walker at study time; HDRI is enough lighting density.
- **Always-off orbit until Explore** — Alba Forum needs that because scroll owns the wheel. This canvas *is* the explore.

## Validation

```bash
cd experiments/breakwater
npm install && npm run build
```

Do **not** create a Vercel project or deploy until quota resets (~2026-09-08 20:39 UTC). If I add one later: Root Directory = `experiments/breakwater`.

## References

- Public Crayon Arcade mecha / breakwater pitch — feel only
- [Poly Haven — Small Harbour Sunset](https://polyhaven.com/a/small_harbour_sunset)

---

**Decision made by**: Johnny Huynh  
**Review status**: Self-approved (solo learning project)
