# Foil Tilt Card — Lumen Fox

I built this after reading [@everettfish0408](https://x.com/everettfish0408/status/2096765359282061544). The post is an open-source Codex skill for 3D laser / holo cards: a photo or illustration becomes a card that tilts, flips, and throws holographic light. The public GitHub README claims a four-layer stack (subject / background / lineart / text), a Blender parallax + laser material, and a Three.js tilt / flip page. I studied the **post text**, the **README claims**, and the **public GitHub OG still** only. I did **not** clone the repo, copy `SKILL.md`, Blender scripts, the web-template, or reuse their demo subjects. This is my educational demo — **vibes · foil tilt card**. The card is invented: **Lumen Fox · No.042 / 流光狐**.

## What I built

- **A moon-fox print** — four runtime canvases: night field, geometric fox, silver filigree, type. No scraped art, no Pokémon, no their subjects.
- **View-tied foil** — a fresnel rainbow I wrote in GLSL. It slides when you drag. Not their packed laser node tree.
- **Soft parallax** — subject sits forward, night field sits back. A **spread** slider is mine.
- **Recto / verso** — flip to an invented reverse: hex seal, deco lattice, motto *light that remembers*.
- **Frosted 2026-09-08 HUD** — brand lockup, Inter, glass desk. Foil / tilt feel / spread. No audio.

Drag to tilt. Wheel zooms. `F` flips. `R` resets the pose.

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

**No Vercel project.** Do not create one on this PR. Hobby quota on `johnnyhuy-dev` stays exhausted until **~2026-09-08 20:39 UTC**. I am not burning a slot on a new app. This experiment is **local-only**.

`vercel.json` only carries the usual Vite fields plus `ignoreCommand`. It cannot set Root Directory. If I add a project later: dashboard **Root Directory** must be `experiments/foil-tilt-card`.

Post-quota order stays: (1) promote `vibes-blender-semicircle` production from the framing-fix git-main preview (2) `vibes-scroll-product` first READY (3) `vibes-audio-gadget-spin` first production (4) `vibes-procedural-grass-field` (5) only then ballance / courtyard / amber-longeron / nacre-loom / heartwood-warden / moon-dumpling-relay / this card. Do not create those pending projects here.

## Local playtest (2026-09-08)

Headed preview on `127.0.0.1:4173` after `npm run build`:

- Dark studio, frosted HUD, brand `vibes · foil tilt card`. Not their chrome.
- Lumen Fox reads as a geometric moon-fox (head, ears, crescent, three plumes). Night field + filigree + type sit on separate planes.
- Drag tilts; foil rainbow walks with the view. Wheel zooms.
- Flip shows verso (hex seal, deco lattice, motto). Topbar switches recto / verso.
- Foil / tilt feel / spread sliders change the print. Reset pose and sway work. `F` / `R` bound.
- Narrow viewport docks the desk; card still readable.
- Console: no fatal errors after the inline favicon. Build green.

No Vercel project. No production URL.

## Related

- [docs/reverse-engineering/foil-tilt-card.md](../../docs/reverse-engineering/foil-tilt-card.md)
- [docs/adr/0016-runtime-foil-card-without-blender.md](../../docs/adr/0016-runtime-foil-card-without-blender.md)

---

**Status**: Local build is the QA until a project exists  
**Last updated**: 2026-09-08  
**Built by**: Johnny Huynh
