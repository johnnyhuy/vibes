# North Court — chinese courtyard

I built this after reading [@MrLarus](https://x.com/MrLarus/status/2096971051334857181). The public clip is an interactive 3D Chinese courtyard whose workflow is GPT-6 Astra → Blender Python → GLB → Three.js. I studied that *pattern*. I did **not** copy their mesh, chrome, or branding. This is my educational demo — **vibes · siheyuan**.

## What I built

- **Four-sided siheyuan** — north hall, east and west wings, a south wall with a circular moon gate. All primitives. No .glb.
- **Courtyard garden** — stone paving, a recessed pond, three simple koi, cone pines, bamboo clumps. Not their L-plan, not their cloud-pruned trees, not their UI.
- **Atmosphere state** — season and day/night resolve into one `ResolvedLook`. Lights, fog, plaster, tile, water, and lanterns retint together. Same lesson as [ADR-0007](../../docs/adr/0007-scene-atmosphere-state.md). See [ADR-0009](../../docs/adr/0009-procedural-courtyard-without-blender.md) for why I skipped their Blender pipeline this pass.
- **Pale glass chrome** — frosted white header. Branding is mine (`vibes · siheyuan` / 北庭). I did not use their Scene Study panel.

You start at a summer morning. Drag to orbit. Change the season. Walk the sun until the lanterns take over.

## Stack

Vite + React 19 + R3F + drei + three `~0.170`.

## Run

```bash
npm install
npm run dev
```

[http://localhost:5173](http://localhost:5173)

```bash
npm run build
```

## Deploy

Linked Vercel project `vibes-chinese-courtyard` / `prj_6eH8pYXjJzcXT5lIGfaxejO6qXAO`. Dashboard **Root Directory** is `experiments/chinese-courtyard`. `vercel.json` carries the usual Vite fields plus `ignoreCommand`. It cannot set Root Directory. No new projects (Hobby 25-link cap).

## Related

- [docs/reverse-engineering/chinese-courtyard-threejs.md](../../docs/reverse-engineering/chinese-courtyard-threejs.md)
- [docs/adr/0009-procedural-courtyard-without-blender.md](../../docs/adr/0009-procedural-courtyard-without-blender.md)
- Atmosphere sibling: [japanese-tower](../japanese-tower/)
- Built next: [Lumen Cuff](../audio-gadget-spin/)

---

**Status**: Production had never left a READY build for this Root; Vite ^6.4.3 + this Root-touch force `ignoreCommand` to rebuild `vibes-chinese-courtyard`  
**Last updated**: 2026-09-18 ~6:26pm AEST (chinese-courtyard-only Vite security bump)  
**Deploy**: Linked `vibes-chinese-courtyard` / `prj_6eH8pYXjJzcXT5lIGfaxejO6qXAO`. Root Directory `experiments/chinese-courtyard`. No new projects (Hobby 25-link cap).  
Built by Johnny Huynh • This is my kitchen sink • Research and education only, not production code
