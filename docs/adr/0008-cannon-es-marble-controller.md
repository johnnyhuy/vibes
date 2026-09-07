# ADR-0008: cannon-es Marble Controller (No Wrapper)

**Date**: 2026-09-08  
**Status**: Accepted  
**Context**: [vibes](../../) monorepo  
**Related**: [ballance-roll-threejs.md](../reverse-engineering/ballance-roll-threejs.md), [ballance-roll](../../experiments/ballance-roll/)

## Context

I wanted a playable rolling-marble course in R3F. `web-physics` already teaches cannon-es in vanilla Three. The new lesson is: *same engine, React frame loop, contact materials you can feel*.

The public X demo is “three materials, three courses.” I only needed **three materials on one course** to teach the contact table.

## Decision

### 1. cannon-es, used directly

**Chosen**: `cannon-es@0.20` owned by a thin `PhysicsWorld` context. `world.step(1/60, dt, 4)` on R3F `useFrame` priority `-1`. Boxes for the path, a sphere for the marble. Contact materials per feel.

**Rejected**:
- `@react-three/cannon` — extra wrapper that has lagged React 19 / R3F 9 in the past; hides the step I want to read
- `@react-three/rapier` — excellent engine, WASM, a second physics vocabulary in a repo that already documents cannon-es
- Homemade Euler integrator — fine for a single sphere on AABB pads; useless the moment I want a ramp quaternion or a second body

**Why**: One engine in the kitchen sink. The controller is a force, not a teleported velocity, so friction and mass actually matter.

### 2. Force steering, camera-relative

**Chosen**: WASD / arrows (and a small HTML pad) apply a horizontal force in the camera’s ground plane. Camera lerps behind the marble.

**Rejected**: Setting `velocity` directly each frame (arcade, no slide). OrbitControls as the driver (fights the marble).

**Why**: Metal should run away from you. Wood should bite. That only reads if momentum survives the input.

### 3. Feels are contact materials, not skins

**Chosen**:

| Feel | Mass | Friction | Restitution | Drive |
| --- | --- | --- | --- | --- |
| Wood | 1.15 | 0.82 | 0.16 | 56 |
| Stone | 2.7 | 0.58 | 0.06 | 78 |
| Metal | 4.1 | 0.16 | 0.11 | 92 |

Swapping mid-run keeps the body and updates mass / material / damping. Reset is a new body at the start stone.

**Rejected**: Paper (that is the original *Ballance* third). Three separate baked courses.

**Why**: Clean-room. The lesson is the table, not their level art.

### 4. Static boxes, not a trimesh

**Chosen**: Each pad / run / beam / ramp is one `CANNON.Box` with a YXZ quaternion.

**Rejected**: A single triangle mesh of the visual path.

**Why**: Sphere-vs-box is the stable pair. A homemade ramp still needs a rotated box, which I already have.

## Consequences

### Positive

1. `web-physics` readers can open this file and recognise the world
2. Material chips are an honest physics demo, not a tint
3. No WASM, no extra React physics package

### Negative

1. I have to remember `useFrame` priority so the mesh copies the body *after* the step
2. React 19 Strict Mode will mount / unmount the world once in dev — cleanup must remove bodies
3. Box ramps are not as pretty as a chamfered mesh; I dressed the visuals separately

### Neutral

Gravity is `-22`, not `-9.82`. Marble games lie about g so the ball settles. Documented here so I do not “fix” it later.

## Alternatives considered

- **drei `KeyboardControls`** — rejected; a `Set` plus a 32ms poll is enough
- **Fixed 3rd-person boom parented to the ball** — rejected; a lerp on the camera reads softer over the clouds
- **Collectible-gated finish** — rejected; motes are optional. The hoop is the end.

## Validation

```bash
cd experiments/ballance-roll
npm install && npm run build
```

Do **not** create a Vercel project or deploy until quota is healthy. If I add one later: Root Directory = `experiments/ballance-roll`.

## References

- [fayazara](https://x.com/fayazara/status/2096997505397584041)
- [cannon-es](https://pmndrs.github.io/cannon-es/)
- `experiments/web-physics`

---

**Decision made by**: Johnny Huynh  
**Review status**: Self-approved (solo learning project)
