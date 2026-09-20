# Nimbus Path — ballance-roll

I built this after reading [@fayazara](https://x.com/fayazara/status/2096997505397584041). Astra had rebuilt a childhood Atari *Ballance*-like marble for the web — three materials, three courses, an ocean of clouds. I studied the public post, the video thumb, and the live-demo *read*. I did **not** copy their course meshes, chrome, assets, or branding. This is my educational demo — **vibes · nimbus path**.

## What I built

- **Haze Walk, still the same layout** — start court, left elbow, plaza, narrow beam, descending ramp, bronze hoop. I did not invent a new course.
- **A hi-fi visual pass on that path** — Poly Haven CC0 PBR. Wooden lanterns (wood + glass) at the courts, brass diya lanterns at the hoop, marble busts on the plaza corners, monastery stone maps on the slabs. No Kenney hero. No grey Lego boxes.
- **Dual-mesh physics** — the pretty GLB / tiled stone is *visual only*. cannon-es still sees the original boxes and cylinders. WASD, `R` reset, and materials `1` / `2` / `3` are unchanged. See [ADR-0008](../../docs/adr/0008-cannon-es-marble-controller.md).
- **Pink Sunrise HDRI** — a local drei `<Environment background>` so the sky actually reads as Greg Zaal’s sunrise. I dropped `FogExp2` (it tints `scene.background` to a flat mauve) and the toy cloud-puff spheres. Cloud sea under the path keeps the haze.
- **JPEG/PNG lanterns, not WebP** — I re-packed the Poly Haven GLBs without `EXT_texture_webp` and vendored a local Draco decoder at `public/draco/` so drei/`useGLTF` does not depend on gstatic. Wood grain, brass, and marble should decode on the same path as explode-assembly.
- **Three haze motes** — optional pickups so the run has a count that is mine, not their `0/3` chip.

You start on the first pad looking down the path. Stay on the stone. Fall into the haze and reset.

## Stack

Vite + React 19 + R3F + drei + three `~0.170` + cannon-es `0.20`.

## Run

```bash
npm install
npm run dev
```

[http://localhost:5173](http://localhost:5173)

```bash
npm run build
```

To re-vendor the Poly Haven files (Draco + original JPEG/PNG, no WebP):

```bash
node scripts/fetch-nimbus-assets.mjs
```

To re-pack the already-vendored GLBs off WebP:

```bash
node scripts/repack-haze-textures.mjs
```

## Deploy

Linked Vercel project `vibes-ballance-roll` / `prj_BSAzHRX6jgMZOx10fPYUUXXrKrmt`. Dashboard **Root Directory** is `experiments/ballance-roll`. `vercel.json` carries the usual Vite fields plus `ignoreCommand`. It cannot set Root Directory. No new projects (Hobby 25-link cap). Hobby deploy quota is holding production promote as of 2026-09-20.

## Related

- [ATTRIBUTION.md](./ATTRIBUTION.md) — mesh source, licence, dual-mesh note
- [docs/reverse-engineering/ballance-roll-threejs.md](../../docs/reverse-engineering/ballance-roll-threejs.md)
- [docs/reverse-engineering/high-fidelity-mesh-pipeline.md](../../docs/reverse-engineering/high-fidelity-mesh-pipeline.md)
- [docs/adr/0008-cannon-es-marble-controller.md](../../docs/adr/0008-cannon-es-marble-controller.md)
- Sibling physics playground: [web-physics](../web-physics/) (vanilla Three + cannon-es)

---

**Status**: Live Root already exists; this pass is a decode / sky / stone read fix, not a new experiment  
**Last updated**: 2026-09-20 (JPEG/PNG props + local Draco + Pink Sunrise background)  
**Deploy**: Linked `vibes-ballance-roll` / `prj_BSAzHRX6jgMZOx10fPYUUXXrKrmt`. Root Directory `experiments/ballance-roll`. No new projects. Quota hold on promote.  
Built by Johnny Huynh • This is my kitchen sink • Research and education only, not production code
