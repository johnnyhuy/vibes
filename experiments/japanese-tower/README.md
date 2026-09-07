# Ridge Pagoda — japanese tower

I built this after reading [@bharatmodi2014's Japanese tower post](https://x.com/bharatmodi2014/status/2096974996455444494). The public clip is a Three.js keep whose seasons, day / night, weather, and atmosphere retint the valley — and the video thumb is a **calm glass overlay over a keep being raised**. I studied that pattern. I did **not** copy their geometry, chrome, or branding. This is my educational demo — **vibes · japanese tower**.

## What I built

- **Procedural keep** — battered stone terraces, loose heaps on the court, timber yard, scaffold, five plaster storeys, hip roofs, bronze finial. All primitives. No .glb.
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

Project `vibes-japanese-tower` (`prj_T1KL4cJSMuY0Z6oKGnNtv8zVP0Js`) exists with Root Directory `experiments/japanese-tower`. Created `deploy: false`. **Still 0 deployments** — a project row is not an alias. `ignoreCommand` will skip sibling-folder commits (`ignored-build-step`); this courtyard-pass README touch is so the next post-quota `main` merge actually builds this Root. Wait until ~**2026-09-08 12:55 UTC**. Do not force a deploy on a hill-climb PR.

Dashboard **Root Directory** must stay `experiments/japanese-tower`. `vercel.json` only carries the usual Vite fields plus `ignoreCommand` — it cannot set Root Directory.

Glass is already LIVE at [vibes-glass-capability-brain.vercel.app](https://vibes-glass-capability-brain.vercel.app/) (SSO off). It shipped on the Ridge Pagoda `main` merge; this folder did not.

## Related

- [docs/reverse-engineering/japanese-tower-threejs.md](../../docs/reverse-engineering/japanese-tower-threejs.md)
- [docs/adr/0007-scene-atmosphere-state.md](../../docs/adr/0007-scene-atmosphere-state.md)
- Built next: [Nimbus Path](../ballance-roll/), [North Court](../chinese-courtyard/)
- Still parked: [audio gadget product spin](../../docs/reverse-engineering/audio-gadget-product-spin.md)

---

**Status**: Project exists (`prj_T1KL4cJSMuY0Z6oKGnNtv8zVP0Js`); **0 production** until a Root-touching merge after quota  
**Last updated**: 2026-09-08  
**Built by**: Johnny Huynh
