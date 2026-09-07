# ADR-0007: Season / Weather as First-Class Scene State

**Date**: 2026-09-08  
**Status**: Accepted  
**Context**: [vibes](../../) monorepo  
**Related**: [japanese-tower-threejs.md](../reverse-engineering/japanese-tower-threejs.md), [japanese-tower](../../experiments/japanese-tower/)

## Context

The Japanese-tower X post is a keep whose **whole world** retints when you touch season, day/night, weather, and atmosphere. earth-timeline already does “one slider → many uniforms” for geology. I needed the same idea for outdoor air, without four disconnected `useEffect`s painting lights, fog, and meshes.

## Decision

### 1. One state object, one resolver

**Chosen**:

```ts
type AtmosphereState = {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  dayNight: number; // 0 midnight → 0.5 noon → 1 midnight
  weather: 'clear' | 'rain' | 'snow' | 'mist';
  haze: number;     // 0–1 extra FogExp2
};

resolveLook(state) → ResolvedLook
```

React owns `AtmosphereState`. R3F only reads `ResolvedLook`.

**Rejected**: Per-control side effects (`onRain` mutates fog here, `onWinter` mutates ground there).

**Why**: You can unit-read the resolver. Combinations stay legal. The UI cannot forget to update the sky.

### 2. Day/night is continuous, not four themes

**Chosen**: a 0–1 solar parameter. Elevation = `sin((t - 0.25) · 2π)`. Twilight tints the horizon. Night raises lantern emissive and stars.

**Rejected**: Dawn / Day / Dusk / Night enum-only.

**Why**: A slider is the demo. Presets can sit on top later.

### 3. Weather mutates the same look, not a second scene

**Chosen**: weather adds fog, greys the hemisphere, and selects a particle kind. The pagoda stays the same graph.

**Rejected**: Swapping GLBs or cloning four complete scenes.

**Why**: Kitchen-sink scope. Particles + `FogExp2` + material colours are enough to *read* as weather.

### 4. R3F overlay, vanilla geometry

**Chosen**: Vite + React + R3F for the control dock (same as earth-timeline / glass). Procedural meshes, no assets (same as steam-atlas).

**Rejected**: Vanilla Three.js with `getElementById` sliders (steam-atlas), or a GLB temple.

**Why**: The lesson is state → uniforms. React is the cheaper dock. Primitives keep the experiment clean-room.

## Consequences

### Positive

1. Season × weather × time is one function you can read in `atmosphere.ts`
2. Dark cinematic UI can change without touching lights
3. Easy to add a fifth weather later

### Negative

1. Re-resolving on every slider tick rebuilds a look object (cheap) and re-renders materials (fine at this scale)
2. Shader sky uniforms need an explicit sync (`useLayoutEffect`) or they freeze on the first colour
3. No Vercel project — local only until quota resets

### Neutral

I default the page to **autumn dusk** so the first frame matches the visual quality bar without a click.

## Alternatives considered

- **Drei `Sky` + `Cloud`** — rejected for v1; a two-colour dome + `FogExp2` is the documented lesson
- **Global Zustand store** — rejected; one `App` is enough
- **Postprocessing volume fog** — rejected; extra dependency for a kitchen sink

## Validation

```bash
cd experiments/japanese-tower
npm install && npm run build
```

Do **not** create a Vercel project or deploy until quota resets (~2026-09-08 12:55 UTC). If I add one later: Root Directory = `experiments/japanese-tower`.

## References

- [bharatmodi2014](https://x.com/bharatmodi2014/status/2096974996455444494)
- earth-timeline era slider (same “state → look” shape)

---

**Decision made by**: Johnny Huynh  
**Review status**: Self-approved (solo learning project)
