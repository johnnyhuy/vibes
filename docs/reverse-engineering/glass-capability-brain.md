# Reverse Engineering: Glass Capability Brain

**References**:
- [viewsfrom02108](https://x.com/viewsfrom02108/status/2094853472864682360) — “make a Three.js demo of your capabilities” (verified 2026-09-08 via X API)

**Study date**: 2026-09-08  
**Purpose**: Clean-room notes for a **future** experiment. I am not building the brain app in this PR.

**Disclaimer**: I studied the public post and the pattern it describes. No code, no assets, no screenshot dump from the demo.

---

## What The Post Is

@viewsfrom02108 asked Claude Fable 5.1 to *“make a Three.js demo of your capabilities.”*

It answered with a **glass brain** and **six orbiting capability nodes**. Each node is not a label — it is a live mini-demo:

1. Writes and runs code
2. Solves a puzzle
3. Reads its own pixels
4. Replays driving a Mac
5. (Two more nodes — the post cuts off; treat as unknown until I watch the video properly)
6. …

Then the agent **screenshot-tested itself at 60 fps** and (the sentence is truncated on X) presumably compared those frames to a target.

Video thumb in the post: landscape 1902×914, dark studio, glassy mass in the centre, small satellites on an orbit.

## Why This Pattern Exists

This is not a product hero. It is a **capability portfolio as a scene**.

Most “AI capability” pages are a grid of cards. This version:

- Puts the model (the brain) in the middle as a refractive object
- Puts each skill on a moon
- Makes each moon *do the skill* instead of describing it
- Closes the loop with self-screenshot QA — the demo asserts it is working

That last bit is the interesting one for this repo. I already care about visual QA (`docs/visual-qa-2026-09-07.md`). A scene that **reads its own canvas** and flags a miss is the next step up from me staring at a preview.

## Pattern Breakdown (Inferred)

### 1. Centrepiece: Glass Brain

Likely:

- Organic / voxel / marching-style mesh, or a displaced icosphere — not a medical scan
- `MeshPhysicalMaterial` transmission, high IOR, short attenuation (same glass lesson as Aether)
- Dark studio + HDRI so the folds read as glass, not grey plastic
- Slow idle rotation; orbit controls for inspect

I would **not** import a scanned brain. Same rule as steam-atlas and the bottle: procedural or a CC0 mesh I attribute.

### 2. Six Orbiting Nodes

Classic three-body layout:

```
for i in 0..5:
  angle = t * speed + i * TAU/6
  node.position = (cos(angle)*R, sin(i)*bob, sin(angle)*R)
```

Each node is a pick target. Click / hover → isolate that capability, dim the others, dock a panel.

The orbit is the table of contents. The brain is the brand.

### 3. Nodes Are Live Demos

This is the expensive part. A node that “writes and runs code” is a tiny editor + eval sandbox. A node that “reads its own pixels” is `gl.readPixels` or `canvas.toDataURL` on the WebGL canvas. A node that “replays driving a Mac” is a recorded input stream, not a live VNC.

For a kitchen-sink experiment I would fake the outer four with honest stubs and **actually implement pixel-read QA** — that one teaches something I will reuse.

### 4. Self Screenshot QA at 60 fps

Inferred loop:

1. Render a frame
2. Grab a downscaled readback (not full 4K — that will melt the bus)
3. Compare against a stored reference *or* a cheap heuristic (brain still centred, six nodes still visible, no NaN camera)
4. Flash a badge: `QA 60fps · pass`

This is the same family as my explode QA scripts, moved into the runtime.

I would cap readback to every N frames and honour `prefers-reduced-motion`.

## What I Would Build (Later)

A new experiment, something like `experiments/glass-capability-brain/`:

| Piece | Do | Don't |
| --- | --- | --- |
| Brain | Procedural glass volume (lathe / icosphere displace) | Medical dataset, copied demo mesh |
| Orbit | Six nodes, pick to isolate | Twelve skills, a whole OS |
| Live demo | One real pixel-read QA node | Eval user JS in the page |
| UI | Dark cinematic, frosted dock | Dashboard chrome |
| Stack | Vite + React + R3F + drei | New framework |

Success: I can orbit a glass brain, click a node, and see a live “I read my own pixels” pass/fail. Everything else is flavour.

## What I'm Not Doing In This PR

- No `experiments/glass-capability-brain/`
- No screenshot grab of the source video
- No attempt to reconstruct their node list from a blurry thumb

The Aether bottle already spends the glass-material budget for this hill-climb. The brain is the next *scene*, not a second product hero.

## Open Questions

1. What are nodes 5 and 6? Watch the video when I'm not on a quota freeze.
2. Is the brain one mesh or a particle/voxel field?
3. Does the 60 fps QA compare images or just assert “I can readback”?
4. How do they sandbox “writes and runs code” without turning the demo into a gadget?

## Related

- [webgl-scroll-product.md](./webgl-scroll-product.md) — glass / transmission notes I can reuse
- [visual-quality-bar.md](../visual-quality-bar.md) — dark studio bar
- `experiments/scroll-product-showcase/` — current glass work (bottle, not brain)

---

**Last updated**: 2026-09-08  
**Status**: Notes only. Future experiment.  
**Author**: Johnny Huynh
