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

No Vercel project. Hobby quota on `johnnyhuy-dev` is still exhausted until **~2026-09-08 12:55 UTC**. Do not create a project or force a deploy on this PR.

If I add one later: dashboard **Root Directory** must be `experiments/chinese-courtyard`. `vercel.json` only carries the usual Vite fields plus `ignoreCommand` — it cannot set Root Directory.

Do not create `vibes-ballance-roll` either. That marble demo stays local.

## Related

- [docs/reverse-engineering/chinese-courtyard-threejs.md](../../docs/reverse-engineering/chinese-courtyard-threejs.md)
- [docs/adr/0009-procedural-courtyard-without-blender.md](../../docs/adr/0009-procedural-courtyard-without-blender.md)
- Atmosphere sibling: [japanese-tower](../japanese-tower/)
- Still parked: [audio gadget product spin](../../docs/reverse-engineering/audio-gadget-product-spin.md)

---

**Status**: Local build is the QA until a project exists  
**Last updated**: 2026-09-08  
**Built by**: Johnny Huynh
