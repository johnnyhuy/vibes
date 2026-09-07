# ADR-0009: Procedural Courtyard Without a Blender Pipeline

**Date**: 2026-09-08  
**Status**: Accepted  
**Context**: [vibes](../../) monorepo  
**Related**: [chinese-courtyard-threejs.md](../reverse-engineering/chinese-courtyard-threejs.md), [chinese-courtyard](../../experiments/chinese-courtyard/), [ADR-0003](./0003-blender-mcp-lane.md), [ADR-0004](./0004-procedural-geometry-over-assets.md), [ADR-0007](./0007-scene-atmosphere-state.md)

## Context

The MrLarus courtyard post is a keep whose **public method** is Blender scripts → GLB → Three.js. I already documented that pipeline for laptops (ADR-0003). I wanted a **spatial / interior** study — enclosure, a moon gate, a pond — without shipping someone else’s mesh and without standing up Blender on this pass.

Hobby Vercel quota is still 0 until ~2026-09-08 12:55 UTC. The experiment must stay local.

## Decision

### 1. Procedural halls, not a courtyard GLB

**Chosen**: Vite + React + R3F + drei. Walls, hip roofs, paving, moon-gate extrusion, plants, and a pond plane are TypeScript primitives.

**Rejected**:
- Downloading or reconstructing their GLB
- Cloning a third-party repo into the tree
- Running Blender MCP to export *their* court

**Why**: Clean-room. The lesson I still owe is “state → look” (ADR-0007), not another asset pipeline. ADR-0004 already argues primitives for educational demos.

### 2. Four-sided siheyuan, not their L-plan

**Chosen**: north hall + east/west wings + a south wall with a circular hole.

**Rejected**: Matching the thumb’s L-shaped pavilion and free-standing moon-gate wall.

**Why**: Inspiration is composition (plinth, tiles, sage air). Copying the footprint would be a clone. A closed court is the type I wanted to teach.

### 3. Reuse atmosphere as a resolver

**Chosen**:

```ts
type AtmosphereState = {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  dayNight: number;
};

resolveLook(state) → ResolvedLook
```

React owns the state. R3F reads the look. Season chips and a sun slider retint lights, fog, plaster, tile, water, and lantern emissive.

**Rejected**: A second weather particle system (already taught on the pagoda). Per-button `useEffect`s that paint materials one at a time.

**Why**: Same function shape as ADR-0007. Fewer axes. The court still *reads* as day/night and season.

### 4. No Vercel project this pass

**Chosen**: `vercel.json` with `framework: vite`, `outputDirectory: dist`, `ignoreCommand`. No `create_git_project`.

**Rejected**: `vibes-chinese-courtyard` or `vibes-ballance-roll` while quota is 0.

**Why**: The last merge already burned a steam-atlas production slot when the Root was touched. I will not add two more hobbies tonight.

## Consequences

### Positive

1. You can read how a moon gate is a `Shape` with a hole
2. Season × sun is unit-readable in `atmosphere.ts`
3. Bundle stays code-only

### Negative

1. Roofs are cones, not laid tiles
2. No interior rooms you can walk
3. Local QA only until a project exists

## Alternatives considered

- **Blender MCP export of my own court** — honest, but a second toolchain this pass. Future if I want a GLB lane that I own.
- **Drei `Sky`** — rejected; a two-colour dome + `FogExp2` matches the pagoda lesson.
- **CSG boolean for the moon gate** — extra dependency. `ExtrudeGeometry` holes are enough.

## Validation

```bash
cd experiments/chinese-courtyard
npm install && npm run build
```

Do **not** create a Vercel project or deploy until quota resets (~2026-09-08 12:55 UTC). If I add one later: Root Directory = `experiments/chinese-courtyard`.

## References

- [MrLarus](https://x.com/MrLarus/status/2096971051334857181)
- [ADR-0007](./0007-scene-atmosphere-state.md)

---

**Decision made by**: Johnny Huynh  
**Review status**: Self-approved (solo learning project)
