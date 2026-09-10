# ADR-0006: Glass Capability Map — Light Clinical Stage + Pixel QA

**Date**: 2026-09-08  
**Status**: Accepted — amended 2026-09-10 by [ADR-0026](./0026-glass-ripple-lighting.md) (stage tints + glass ripple; no new Vercel project)  
**Context**: [vibes](../../) monorepo  
**Related**: [glass-capability-brain.md](../reverse-engineering/glass-capability-brain.md), [glass-capability-brain](../../experiments/glass-capability-brain/)

## Context

I wanted a third glass experiment that is **not** another dark product hero. Aether already spends that budget. The public Fable “capabilities map” thumb is the opposite stage: light clinical blue-grey, a frosted sphere as the self, coloured moons as skills, a translucent dock.

The interesting technical bit for this repo is the closed loop: a scene that **reads its own canvas**.

## Decision

### 1. Light clinical stage, not a dark studio

**Chosen**: `#e6edf5` backdrop, hemisphere + soft key, faint contact shadows, HTML chrome in translucent white.

**Rejected**: Reusing Aether’s black / chartreuse product language.

**Why**: Matching the thumb’s *read* is the point of this experiment. Dark glass already exists next door.

### 2. HTML dock over the R3F canvas

**Chosen**: Ordinary React overlay (header, dock, controls, HUD). Canvas stays full-viewport WebGL.

**Rejected**: drei `Html` for the dock, or a second WebGL HUD.

**Why**: Copy, a close button, and a screenshot thumb are document UI. drei `Html` is enough for the floating node pills. Hypothesis: overlay + canvas is enough; I am verifying that locally rather than inventing a portal layer.

### 3. One live node — pixel QA — and honest stubs

**Chosen**: **See** calls `readPixels` + `canvas.toDataURL` on the WebGL canvas (`preserveDrawingBuffer: true`) and grades the frame with a luma / emptiness heuristic.

**Rejected**:
- Eval of arbitrary user JS (“writes and runs code”)
- A real wolf/goat/cabbage search just to mimic their Reason dock
- A medical brain mesh

**Why**: Kitchen-sink scope. I already care about visual QA; reading my own pixels is the next step up from staring at a preview. Eval is a security hole I will not open in a public demo.

### 4. Invented names for nodes 3–6

Remember + Reason stay as in the thumb. I named the rest **Code, See, Drive, Puzzle** so the map still has six keys. Those names are mine, documented here and in the reverse-eng note.

## Consequences

### Positive

1. Visually distinct from Aether
2. A reusable pixel-QA helper I can point other experiments at later
3. Keyboard + idle tour without a new framework

### Negative

1. Transmission + `preserveDrawingBuffer` costs a bit of GPU memory
2. The HUD triangle count is “honest-ish” — R3F resets `info` per frame, so I sample after render
3. No Vercel project yet; quota is still 0

### Neutral

Stubs in the dock are labelled as stubs. I would rather an honest placeholder than a fake live solver.

## Alternatives considered

- **Vanilla Three.js** — rejected; siblings that need React overlays already use R3F.
- **Stats.js** — rejected; the thumb is a one-line `fps · tris · draws · three r…` string.
- **Reference-image compare** — rejected for v1; brightness heuristic is enough to fail a blank canvas.

## Validation

```bash
cd experiments/glass-capability-brain
npm install && npm run build
```

Do **not** deploy until quota resets (~2026-09-08 12:55 UTC) and a project exists with Root Directory `experiments/glass-capability-brain`.

## References

- [viewsfrom02108](https://x.com/viewsfrom02108/status/2094853472864682360)
- Thumb: `hill-climb/refs/glass-brain-thumb.jpg`

---

**Decision made by**: Johnny Huynh  
**Review status**: Self-approved (solo learning project)
