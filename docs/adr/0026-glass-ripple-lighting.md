# ADR-0026: Glass Ripple Stage Tints on the Capability Map

**Date**: 2026-09-10  
**Status**: Accepted  
**Context**: [vibes](../../) monorepo  
**Related**: [ADR-0006](./0006-glass-capability-map.md), [glass-capability-brain.md](../reverse-engineering/glass-capability-brain.md), [glass-capability-brain](../../experiments/glass-capability-brain/)

## Context

[@SammmAing](https://x.com/SammmAing/status/2097762558887293019) posted a public pitch: tap Dawn / Dusk / Moonlight, watch a ripple travel through glass while the scene takes on that colour, sound on for the full experience. I already have a frosted capability map. The lesson is to **absorb that lighting/ripple pattern into the existing app**, not stand up a new experiment or a new Vercel project.

Hobby is at the **25 Git repo-link cap**. `vibes-glass-capability-brain` already exists. A new project would fail the same way Keel Hex did.

## Decision

### 1. Hill-climb the existing map

**Chosen**: Add three invented tints + a time-limited ring on the existing `MeshPhysicalMaterial` sphere. Keep Remember / Reason / Code / See / Drive / Puzzle, the See pixel QA, the HTML dock, and the HUD.

**Rejected**:
- A new folder under `experiments/`
- A new Vercel project
- Gutting the capability map into a lighting-only demo
- Fetching or decompiling their video / Astra bundle

**Why**: The kitchen-sink lesson is “retint + readable glass ripple.” The map already has the glass. Cloning their chrome would miss the point.

### 2. Invented nouns, inspired-by lighting feel

**Chosen**: **Pale Lift** (the original clinical stage), **Ember Slide**, **Lumen Watch**. Lights, lightformers, glass attenuation, neural-graph colours, and the HTML wash lerp toward each preset.

**Rejected**: Their Dawn / Dusk / Moonlight labels as product chrome. Their layout, lockup, or audio.

**Why**: Clean-room. The public pitch is the *idea*. The names have to be ones I can stand behind.

### 3. Shader ring, not a second material language

**Chosen**: `onBeforeCompile` uniforms `uRipple` / `uRippleOrigin` on the existing transmission material. Vertex ring + a small fragment normal kick. `prefers-reduced-motion` holds `uRipple` at 0 and snaps the tint.

**Rejected**: `MeshDistortMaterial` (too noisy). A second custom shader that throws away MeshPhysical transmission. A particle splash.

**Why**: Hypothesis from the hill-climb: transmission + a time-limited ripple uniform + three Environment/light presets is enough.

### 4. Mute-default ping, no new deploy

**Chosen**: Optional oscillator ping, **Muted** on load. `vercel.json` untouched (no `"//"` key). Root Directory stays `experiments/glass-capability-brain`. No `create_git_project`. No forced production redeploy.

**Rejected**: Autoplay. Shipping a WAV. Touching scroll / grass / audio `vercel.json` (PR #53 owns that).

**Why**: Autoplay policies. Hobby cap. Sibling incident history.

## Consequences

### Positive

1. The map still teaches capability moons + pixel QA
2. The new lesson is readable in one file each (`lighting.ts`, `glassRipple.ts`)
3. No extra Vercel link

### Negative

1. A geodesic ring is not a filmed fluid sim
2. Oscillators are not their sound design
3. Production stays on the previous LIVE deploy until Johnny chooses to promote

## Alternatives considered

- **New experiment** — rejected; the brief is absorb-into-existing
- **drei `MeshDistortMaterial`** — continuous wobble, not a one-shot travel
- **CSS-only wash** — would miss the glass

## Validation

```bash
cd experiments/glass-capability-brain
npm install && npm run build
```

Do **not** merge from the agent. Do **not** create a Vercel project. Do **not** force production.

## References

- [SammmAing](https://x.com/SammmAing/status/2097762558887293019) — public pitch only
- [viewsfrom02108](https://x.com/viewsfrom02108/status/2094853472864682360) — original capability-map thumb
- [Hobby 25-link cap](../incidents/2026-09-08-vercel-repo-link-limit-25.md)

---

**Decision made by**: Johnny Huynh  
**Review status**: Self-approved (solo learning project)
