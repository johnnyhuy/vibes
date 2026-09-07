# Reverse Engineering: Glass Capability Brain

**References**:
- [viewsfrom02108](https://x.com/viewsfrom02108/status/2094853472864682360) — “make a Three.js demo of your capabilities” (verified 2026-09-08 via X API)
- Visual: `hill-climb/refs/glass-brain-thumb.jpg` (agent-thread thumb, 2026-09-08)

**Study date**: 2026-09-08  
**Purpose**: Clean-room notes. Built as `experiments/glass-capability-brain/`.

**Disclaimer**: I studied the public post and the attached thumb. No code, no assets copied. This demo is first-person Johnny Huynh / vibes — it is **not** Claude Fable.

---

## What The Post Is

@viewsfrom02108 asked Claude Fable 5.1 to *“make a Three.js demo of your capabilities.”*

It answered with an **interactive map**: a large glass sphere (neural structure inside) and **orbiting capability nodes**. Each node is a live micro-demo, not a slide.

The post lists examples: writes and runs code, solves a puzzle, reads its own pixels, replays driving a Mac — then screenshot-tested itself at 60 fps.

## What The Thumb Actually Shows

I had this wrong in the first draft. It is **not** a dark studio brain.

From `glass-brain-thumb.jpg`:

- **Light clinical stage** — blue-grey / off-white, soft global illumination, no harsh shadows
- **Left: large glass sphere** — frosted transmission, faint blue neural lines and dots inside. An orange-yellow blob sits in the right of the sphere, tagged **Remember**
- **Centre: “Reason” node** — smaller opaque purple sphere, soft purple halo / pulse
- **Orbital paths** — thin glowing curves (purple, pink, blue, orange), not a simple XY ring
- **Right: translucent white dock** — heading `MULTI-STEP THINKING`, title `Reason`, wolf/goat/cabbage puzzle, “10 reachable states”
- **Header** — `Claude Fable 5.1` / “An interactive map of what I can do. Every node is a live micro-demo, not a slide. Hover to inspect, click to open.”
- **Controls** — Drag to orbit · `1–6` jump to a node · Esc back · idle 8s starts the tour
- **HUD** — `60 fps · 59,188 tris · 25 draws · three r180`

So: a **portfolio scene**, light UI, glass *sphere* as the self, coloured moons as skills, a dock that plays the demo.

## Why This Pattern Exists

Most “AI capability” pages are a grid of cards. This version:

- Puts the model in the middle as a refractive object
- Puts each skill on a moon
- Makes each moon *do the skill*
- Closes the loop with self-screenshot QA + a live fps/tri counter

That last bit is the interesting one for this repo. I already care about visual QA. A scene that **reads its own canvas** is the next step up from me staring at a preview.

## Pattern Breakdown

### 1. Centrepiece: Glass volume (sphere, not a medical brain)

The thumb is a **sphere with a neural field inside**, not cortical folds.

Likely:

- Outer: `MeshPhysicalMaterial` transmission, slight roughness (frost), IOR ~1.45
- Inner: line/point cloud or a low-poly graph (the 59k tris budget is the whole scene)
- Soft GI, **light** backdrop — opposite of Aether’s black product hero

I would **not** import a scanned brain.

### 2. Six nodes + drawn orbits

Not just `cos/sin` points. The thumb shows **rendered path curves**. Each node has a colour, a label, and a halo when selected.

```
1–6  → camera dollies to that node, dock swaps content
Esc  → back to idle
idle 8s → tour
```

### 3. Nodes are live demos

The dock for **Reason** is a real search through the wolf/goat/cabbage state graph. “Writes and runs code” is a tiny sandbox. “Reads its own pixels” is `readPixels` / `toDataURL`. “Replays driving a Mac” is a recorded input stream.

For a kitchen-sink experiment I stubbed most of them and **actually implemented pixel-read QA**.

### 4. Self screenshot QA at 60 fps

The HUD already prints `60 fps`. Inferred loop: downscaled readback every N frames, heuristic or reference compare, badge. Honour `prefers-reduced-motion`.

## What landed

`experiments/glass-capability-brain/` — Vite + React 19 + R3F + drei + three `~0.170`.

| Piece | Landed | Notes |
| --- | --- | --- |
| Self | Yes | Glass sphere, IOR 1.45, frost/transmission. Procedural inner points + lines. No medical dataset. |
| Stage | Yes | Light clinical `#e6edf5`. Not Aether’s dark hero. |
| Orbit | Yes | Six coloured `TubeGeometry` paths. `1`–`6` / `Esc` / idle 8s tour. `prefers-reduced-motion` parks travel + tour. |
| Live demo | Yes | **See** — `readPixels` + `toDataURL`, luma/empty heuristic, pass/fail + thumb. No user JS eval. |
| UI | Yes | HTML overlay: header, frosted dock, controls, HUD (`fps · tris · draws · three r…`). |
| Branding | Yes | “Capability Map” / `vibes · glass brain`. First-person me. Not Claude Fable. |
| `vercel.json` | Yes | In the experiment folder only (`framework: vite`, `outputDirectory: dist`, `ignoreCommand`). No monorepo-root file. |
| Vercel project | No | Not created. Quota still 0 until ~2026-09-08 12:55 UTC. Do not deploy. |

### Node names I invented

The thumb only labels **Remember** and **Reason**. My other four, so the map still has six keys:

| Key | Name | Kind |
| --- | --- | --- |
| 1 | Remember | Stub — orange inner blob |
| 2 | Reason | Stub — I am not shipping their river-crossing solver |
| 3 | Code | Stub — write the experiment; no in-page eval |
| 4 | See | **Live** pixel QA |
| 5 | Drive | Stub — the camera tour is the whole joke |
| 6 | Puzzle | Stub — graph-search placeholder |

Documented again in [ADR-0006](../adr/0006-glass-capability-map.md).

## Checklist

- [x] Light clinical backdrop
- [x] Frosted glass sphere + procedural neural graph
- [x] Six moons, drawn orbits, Remember + Reason labels
- [x] Keyboard 1–6 / Esc / idle tour / reduced motion
- [x] Frosted HTML dock with first-person copy
- [x] One real live demo (See / pixel QA)
- [x] Bottom-left controls + bottom-right honest-ish HUD
- [x] Experiment `vercel.json`
- [x] ADR-0006
- [ ] Vercel project + production URL — **after quota reset**, and only if I decide this demo needs a public URL
- [ ] Visual QA against the thumb on a real GPU (local + preview)

## Later candidate (not this experiment)

[bharatmodi2014](https://x.com/bharatmodi2014/status/2096974996455444494) — interactive Japanese pagoda / tower in Three.js. Fresh public ref. **Future kitchen-sink candidate only.** I am not building the tower in this PR.

## Open questions (still)

1. Is their inner graph instanced lines or a texture? I used a seeded point/line graph.
2. Does their 60 fps QA compare images or just print the rAF counter? I grade luma.
3. How do they sandbox “writes and runs code”? I will not eval user JS.

## Related

- [webgl-scroll-product.md](./webgl-scroll-product.md) — transmission notes (dark product hero, different stage)
- `experiments/scroll-product-showcase/` — Aether bottle
- `experiments/glass-capability-brain/` — this map
- [ADR-0006](../adr/0006-glass-capability-map.md)

---

**Last updated**: 2026-09-08  
**Status**: Built. Local `npm run build` is the gate. Not deployed.  
**Author**: Johnny Huynh
