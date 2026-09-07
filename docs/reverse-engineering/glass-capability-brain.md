# Reverse Engineering: Glass Capability Brain

**References**:
- [viewsfrom02108](https://x.com/viewsfrom02108/status/2094853472864682360) — “make a Three.js demo of your capabilities” (verified 2026-09-08 via X API)
- Visual: `hill-climb/refs/glass-brain-thumb.jpg` (agent-thread thumb, 2026-09-08)

**Study date**: 2026-09-08  
**Purpose**: Clean-room notes for a **future** experiment. I am not building the brain app in this PR.

**Disclaimer**: I studied the public post and the attached thumb. No code, no assets copied.

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

For a kitchen-sink experiment I would stub most of them and **actually implement pixel-read QA**.

### 4. Self screenshot QA at 60 fps

The HUD already prints `60 fps`. Inferred loop: downscaled readback every N frames, heuristic or reference compare, badge. Honour `prefers-reduced-motion`.

## What I Would Build (Later)

`experiments/glass-capability-brain/` — **not this PR**.

| Piece | Do | Don't |
| --- | --- | --- |
| Self | Glass sphere + inner graph | Medical dataset, copied demo |
| Orbit | Six nodes, drawn paths, 1–6 / Esc / idle tour | A whole OS |
| Live demo | One real pixel-read QA node | Eval user JS in the page |
| UI | Light clinical + translucent dock | Dark product-hero chrome (that's Aether) |
| Stack | Vite + React + R3F + drei | New framework |

Success: orbit a glass sphere, click a node, see a live “I read my own pixels” pass/fail.

## What I'm Not Doing In This PR

- No `experiments/glass-capability-brain/`
- No reconstruction of their node list beyond what the thumb labels (Remember, Reason)
- Aether already spends the glass-material budget

## Open Questions

1. Labels of nodes 3–6?
2. Is the inner graph instanced lines or a texture?
3. Does the 60 fps QA compare images or just print the rAF counter?
4. How do they sandbox “writes and runs code”?

## Related

- [webgl-scroll-product.md](./webgl-scroll-product.md) — transmission notes (dark product hero, different stage)
- `experiments/scroll-product-showcase/` — current glass work (bottle, not brain)

---

**Last updated**: 2026-09-08  
**Status**: Notes only. Future experiment.  
**Author**: Johnny Huynh
