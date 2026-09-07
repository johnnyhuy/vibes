# Ridge Pagoda — japanese tower

I built this after reading [@bharatmodi2014's Japanese tower post](https://x.com/bharatmodi2014/status/2096974996455444494). The public clip is a Three.js keep whose seasons, day / night, weather, and atmosphere retint the valley — and the video thumb is a **calm glass overlay over a keep being raised**. I studied that pattern. I did **not** copy their geometry, chrome, or branding. This is my educational demo — **vibes · japanese tower**.

## What I built

- **Procedural keep** — stone podium, timber yard, scaffold, five plaster storeys, hip roofs, bronze finial. All primitives. No .glb.
- **Lift axis** — you scrub 0–100% (Podium → Frame → Storeys → Tiles → Crown). *Raise again* dumps it back to dirt. Scaffold comes down at the end.
- **Atmosphere state** — season, day/night, weather, and haze still resolve into one `ResolvedLook`. See [ADR-0007](../../docs/adr/0007-scene-atmosphere-state.md).
- **Pale glass chrome** — frosted white cards, my own layout. Header chips are season / weather / time / haze — not their toggle row. Left editorial uses **尾根** (ridge), a word I chose. I did not use their product name or their Japanese poster lines.

You start at a mid-lift summer noon so the scaffold reads. Drag to orbit. Then finish the keep, or change the air.

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

No Vercel project yet. Hobby quota on `johnnyhuy-dev` is still exhausted until **~2026-09-08 12:55 UTC**. Do not create a project or force a deploy on this PR.

If I add one later: dashboard **Root Directory** must be `experiments/japanese-tower`. `vercel.json` only carries `ignoreCommand` — it cannot set Root Directory.

`vibes-glass-capability-brain` (`prj_yJbQTsiB138V5jh92cwSWd8rZmij`) already exists with Root `experiments/glass-capability-brain` and was created `deploy: false`. It still has **0 production**. That does not change this folder.

## Related

- [docs/reverse-engineering/japanese-tower-threejs.md](../../docs/reverse-engineering/japanese-tower-threejs.md)
- [docs/adr/0007-scene-atmosphere-state.md](../../docs/adr/0007-scene-atmosphere-state.md)
- Next candidate (not built; thumb treated cautiously): [audio gadget product spin](../../docs/reverse-engineering/audio-gadget-product-spin.md)

---

**Status**: Local build is the QA until a project exists  
**Last updated**: 2026-09-08  
**Built by**: Johnny Huynh
