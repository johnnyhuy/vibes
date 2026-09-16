# v8-cutaway

Technical V8 engine cutaway with a licensed multi-mesh GLB, live gauges, and a studio HDRI.

I built this to learn how to visualise mechanical systems with synchronised motion and technical overlays. Inspired by [@DilumSanjaya's interactive V8](https://x.com/DilumSanjaya/status/2096280244663775423) with animated pistons, a rotatable view, and live gauges. The hero is no longer procedural boxes — that lane lost the [high-fidelity mesh pipeline](../../docs/reverse-engineering/high-fidelity-mesh-pipeline.md) quality bar next to explode-assembly's Model 3.

## What I Built

- **Licensed V8 mesh** — meeww's Animated Engine V8 (CC-BY-4.0), 94 separate meshes, PBR maps, 171-channel clip. See [ATTRIBUTION.md](./ATTRIBUTION.md).
- **useGLTF + baked motion** — drei loads the GLB; `engineSpeed` scales the clip. Pause freezes it.
- **Live gauges** — RPM, stroke cycle (intake / compression / power / exhaust), chamber pressure, firing-order 1-8-4-3-6-5-7-2.
- **Studio lighting** — Poly Haven Studio Small 09 HDRI via `<Environment>`, contact shadows, ring platform.
- **Orbit controls** — Rotate and zoom. UI chrome (glass dock, cycle chips) is unchanged.

Kenney was not used as the hero. No Meshy / Tripo / Rodin key was present, so this is the Sketchfab CC-BY lane (vendored from Objaverse, licence still CC-BY).

## Running It

```bash
npm install
npm run dev
```

Open http://localhost:5173 → orbit the camera, adjust speed, watch the licensed mesh run.

Regenerate the vendored GLB / HDRI:

```bash
node scripts/fetch-v8-engine.mjs
```

Headed local loop: `docs/previews/v8-cutaway.gif`. I recaptured it at 8× with a slow orbit so the pistons and firing-order chips actually move in the README table.

## Deploy

Project `vibes-v8`, Root `experiments/v8-cutaway`. Production: [https://vibes-v8.vercel.app](https://vibes-v8.vercel.app). Dashboard **Root Directory** must stay `experiments/v8-cutaway`. Hobby is at the 25 Git repo-link cap — I am **not** calling `create_git_project`. `vercel.json` cannot set Root Directory. Vite is already `^6.4.3` via #69; lockfile already resolves `vite@6.4.3`. The licensed multi-mesh V8 from #51 stays the hero.

### Deploy status (2026-09-16 ~1:50am AEST)

Production alias [https://vibes-v8.vercel.app](https://vibes-v8.vercel.app) is **still** on the #68 sibling rebuild (`5d9fc768` / `dpl_GBfMhi1usotSFK3yuiR53JpZNnwb`, asset `index-DdJNq_D5.js`) even after #69. That PR produced a READY *preview* on `cursor/vite-v8-cutaway-a5e7` (`dpl_CVCwrxNqMbsMT6WXrNXA7w1Rewaj` / sha `34bc6f34`) but Vercel never produced a production deploy for main tip `5869b589` — same miss pattern as grass #66→#67. japanese-tower already recovered via #68 (`dpl_FYkek5AyqWBF9HY7AvhU112f1nAL` / sha `5d9fc768` / `index-cPM9rtHx.js` left PR #20). This v8-only README Root-touch is the minimal force so `vibes-v8` can leave the #68 sibling. One-Root-per-pass to limit Hobby fan-out.

## Why I Made This

I wanted a technical visualisation that still reads as an engineering diagram — and I wanted the *mesh* to survive a close-up. Procedural cylinders were the right first lesson (kinematics, phase offsets). They are the wrong hero next to a real multi-mesh product shot.

## The Mechanics

**Clip**: `Object_0`, 10 s, 171 channels. Time scale is `engineSpeed * 0.85`. Pause sets scale to 0.

**Gauges** (same mapping as the procedural pass, so the HUD still teaches four-stroke timing):

- RPM = `engineSpeed * 200 + 300` (0 when paused)
- Stroke cycle from accumulated crank turns `/ (2π) mod 4`
- Firing index from `/ (π/4) mod 8`
- Pressure from a sine on those turns

## Simplifications

- **Baked constraints** — meeww used Blender object constraints, not a live crank–rod solver
- **No combustion particles**
- **No cutaway clip plane** — internals show because the source mesh is an educational assembly, not because we boolean the block
- **Decimate skipped** — 157k triangles is already web-sized; gltf-transform Draco only

## Stack

- **React** — UI state
- **@react-three/fiber** — declarative Three.js
- **@react-three/drei** — `useGLTF`, `useAnimations`, `Environment`, `OrbitControls`
- **Three.js** — renderer
- **Vite** — dev server + build

Same stack as `explode-assembly`.

## What's Next

If I return to this: clip-plane cutaway, isolate-by-system like explode-assembly, and a lighter decimate of Tomaso's 2.2M-triangle disassembled block as an explode mode.

---

Built by Johnny Huynh • This is my kitchen sink • Research and education only — not production code

**Status**: Production alias [vibes-v8.vercel.app](https://vibes-v8.vercel.app) — still on #68 sibling (`5d9fc768` / `dpl_GBfMhi1usotSFK3yuiR53JpZNnwb` / `index-DdJNq_D5.js`) after #69 missed a READY production build (preview-only `dpl_CVCwrxNqMbsMT6WXrNXA7w1Rewaj`); this Root-touch forces `ignoreCommand` to rebuild
**Last updated**: 2026-09-16 ~1:50am AEST (v8-only Root-touch — #69 skipped a READY production deploy; force leave #68 sibling)
