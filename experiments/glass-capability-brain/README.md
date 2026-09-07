# Capability Map — glass brain

A clean-room interactive map of the skills I practise in this kitchen sink: a frosted glass sphere, six orbiting nodes, and one live canvas screenshot QA.

I studied [@viewsfrom02108](https://x.com/viewsfrom02108/status/2094853472864682360) (Claude Fable asked to “make a Three.js demo of your capabilities”) and the local thumb `hill-climb/refs/glass-brain-thumb.jpg`. I did **not** copy their code, assets, or branding. This is my educational demo — **vibes · glass brain**, not Claude Fable.

## What I built

- **Light clinical stage** — `#e6edf5`, soft GI, no dark product-hero chrome (that is Aether).
- **Glass self** — `MeshPhysicalMaterial` transmission, frost, IOR 1.45. Procedural neural points/lines inside. No medical scan.
- **Six moons** — Remember, Reason (labels from the thumb) plus **Code, See, Drive, Puzzle** (my names). Coloured orbit curves. Keys `1`–`6` dolly the camera; `Esc` returns; ~8s idle starts a tour. `prefers-reduced-motion` parks motion.
- **One live demo** — **See** reads the WebGL canvas (`readPixels` + `toDataURL`) and grades it with a brightness / emptiness heuristic. No user JS eval.
- **HTML dock** — frosted white overlay, first-person copy.
- **HUD** — live `fps · tris · draws · three r…` from the renderer.

## Nodes

| Key | Name | Kind |
| --- | --- | --- |
| 1 | Remember | Stub (orange inner blob) |
| 2 | Reason | Stub (purple moon) |
| 3 | Code | Stub |
| 4 | See | **Live pixel QA** |
| 5 | Drive | Stub |
| 6 | Puzzle | Stub |

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

Project `vibes-glass-capability-brain` (`prj_yJbQTsiB138V5jh92cwSWd8rZmij`) has production READY at [vibes-glass-capability-brain.vercel.app](https://vibes-glass-capability-brain.vercel.app/). SSO off. It shipped on the japanese-tower `main` merge (`9328191` / `dpl_3CE9Dd7X7og5MuSLpcGgyxboacgz`) — do not assume steam / scroll / semicircle moved with it. See [the incident](../../docs/incidents/2026-09-08-glass-auto-deploy-on-tower-merge.md).

Dashboard **Root Directory** must stay `experiments/glass-capability-brain`. `vercel.json` cannot set that field. Do not force another production deploy on a hill-climb PR.

## Related

- [docs/reverse-engineering/glass-capability-brain.md](../../docs/reverse-engineering/glass-capability-brain.md)
- [docs/adr/0006-glass-capability-map.md](../../docs/adr/0006-glass-capability-map.md)

---

**Status**: Production READY; skip post-quota  
**Last updated**: 2026-09-08  
**Built by**: Johnny Huynh
