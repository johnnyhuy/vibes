# Capability Map — glass brain

A clean-room interactive map of the skills I practise in this kitchen sink: a frosted glass sphere, six orbiting nodes, one live canvas screenshot QA, and three invented stage tints that send a short ripple through the glass.

I studied [@viewsfrom02108](https://x.com/viewsfrom02108/status/2094853472864682360) (Claude Fable asked to “make a Three.js demo of your capabilities”) and the local thumb `hill-climb/refs/glass-brain-thumb.jpg`. Later I absorbed the *feel* of [@SammmAing](https://x.com/SammmAing/status/2097762558887293019) — tap a lighting mode, watch a ripple travel through glass while the scene retints. I did **not** copy their code, assets, chrome, product name, or sound. This is my educational demo — **vibes · glass brain**, not Claude Fable and not their pitch.

## What I built

- **Light clinical stage** — `#e6edf5`, soft GI, no dark product-hero chrome (that is Aether).
- **Glass self** — `MeshPhysicalMaterial` transmission, frost, IOR 1.45. Procedural neural points/lines inside. No medical scan.
- **Stage tints** — **Pale Lift**, **Ember Slide**, **Lumen Watch** (my names). Inspired by the public Dawn / Dusk / Moonlight *idea*, not a clone. Switching plays a time-limited normal/uv ring through the sphere while lights, env, glass attenuation, and the HTML wash lerp. `L` cycles. `prefers-reduced-motion` skips the ripple and snaps the tint.
- **Mute-default ping** — optional invented oscillator tick. Starts **Muted**. No sample file.
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

Production is **LIVE** at [https://vibes-glass-capability-brain.vercel.app/](https://vibes-glass-capability-brain.vercel.app/) (`dpl_3CE9Dd7X7og5MuSLpcGgyxboacgz` on `9328191`). SSO off. Project `vibes-glass-capability-brain` (`prj_yJbQTsiB138V5jh92cwSWd8rZmij`), Root `experiments/glass-capability-brain`.

It shipped on the japanese-tower `main` merge — do not assume steam / scroll / semicircle / tower moved with it. Their later `main` hooks CANCELED with `ignored-build-step` because those Roots did not change. See [the incident](../../docs/incidents/2026-09-08-glass-auto-deploy-on-tower-merge.md).

Dashboard **Root Directory** must stay `experiments/glass-capability-brain`. `vercel.json` cannot set that field. Do not force another production deploy on a hill-climb PR. This folder does not need a post-quota slot. Hobby is at the **25 Git repo-link cap** — do **not** create a new Vercel project for this tint pass.

## Related

- [docs/reverse-engineering/glass-capability-brain.md](../../docs/reverse-engineering/glass-capability-brain.md)
- [docs/adr/0006-glass-capability-map.md](../../docs/adr/0006-glass-capability-map.md)
- [docs/adr/0026-glass-ripple-lighting.md](../../docs/adr/0026-glass-ripple-lighting.md)

---

**Status**: Production LIVE at https://vibes-glass-capability-brain.vercel.app/ (SSO off); hill-climb PR only — no new project, no forced production redeploy  
**Last updated**: 2026-09-10  
**Built by**: Johnny Huynh
