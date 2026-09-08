# Keel Hex — KH-55 trainer bench

I built this after reading [@Peter05704721](https://x.com/Peter05704721/status/2097144569989300371). The public pitch: GPT-6 Astra knocked out a Three.js assembly view for a drone / flight-controller build. They point at [s3-px4-assembly.pages.dev](https://s3-px4-assembly.pages.dev). I studied the **post text**, the **X video thumb**, and a later **feel-only live still** (`hill-climb/refs/px4-assembly-live-20260908-1515.png` when present). I did **not** scrape, fork, or copy that live site’s source, assets, branding, part catalog, or UI chrome. This is my educational demo — **vibes · keel hex**. The chassis is invented: **KH-55 / Spool Plate / 卷盘板**.

## What I built

- **A hex trainer on a white bench** — soft studio, contact shadow, a paper floor. Not another dusk harbour or kiln desk.
- **KH-55 / Spool Plate** — twelve marks I named. Nest Board, Spool Cell, rotor cups, petal rotors. Not their quad, not an OEM flight-controller list.
- **Assembled / Inside / Exploded** — numbered tabs. Explode distance 0–100%. Play assembly still walks the twelve marks. Toggles: labels, auto rotate, petals, loom, tide vane, sight bead.
- **Floating labels** — invented nouns with thin leaders. No PX4 / S3 strings.
- **Frosted 2026-09-08 HUD** — light glass, Inter, forest-teal accent. Brand `vibes · keel hex`. Left hero + Play CTA; right bench panel on a wide frame.
- **Readable PBR mid-fi** — lathed cups, extruded hex deck, copper petals, celadon nest. Vendored Poly Haven studio HDRI (CC0). No Kenney toy pack.

Drag to orbit. Wheel zooms. `1` `2` `3` switch modes. Space plays the walk.

## Stack

Vite + React 19 + R3F + drei + three `~0.170`.

## Run

```bash
npm install
npm run dev
```

[http://localhost:5173](http://localhost:5173)

```bash
npm install && npm run build
```

## Deploy

**No `vibes-keel-hex` project exists.** Creating it failed with Vercel `repo_links_exceeded_limit`: Hobby team `johnnyhuy-dev` already has **25** projects linked to this GitHub repo (the cap). This is not a daily-quota reset. A new git link will keep failing until Johnny unlinks a project or upgrades to Pro.

Do **not** call `create_git_project` or retry the create. Local-only until a slot is freed. See [the incident](../../docs/incidents/2026-09-08-vercel-repo-link-limit-25.md).

Future name remains **`vibes-keel-hex`**. Dashboard **Root Directory** would be `experiments/keel-hex`. `vercel.json` only carries the usual Vite fields plus `ignoreCommand`; it cannot set Root Directory.

## Local playtest (2026-09-08)

Headed preview on `127.0.0.1:4173` after `npm run build`:

- White studio: paper floor, soft contact shadow, KH-55 hex trainer framed. Brand `vibes · keel hex`.
- Left hero: invented title + Play assembly. Right panel: 01 Assembled / 02 Inside / 03 Exploded. No PX4 / S3 chrome.
- Explode slider, labels with leaders, petal / loom / optional-module toggles.
- Completed craft reads as a hex (six spars, six copper petals, celadon nest, teal cinches). Not a quad clone.
- Console: no fatals. Benign WebGL `ReadPixels` / software-GL notes only. Build green.
- Still: `docs/previews/keel-hex.png`.

No Vercel project. No production URL.

## Distinct from siblings

Explode-assembly is a **Tesla Model 3 product explode**. Kiln Studs is a **brick-set studio**. Japanese-tower is a **pagoda lift**. Breakwater is a **harbour walker**. This pass is a **trainer bench with assemble / inside / explode** — not a Tesla isolate.

## Related

- [docs/reverse-engineering/keel-hex.md](../../docs/reverse-engineering/keel-hex.md)
- [docs/adr/0023-keel-hex-assembly.md](../../docs/adr/0023-keel-hex-assembly.md)
- [ATTRIBUTION.md](./ATTRIBUTION.md)

---

**Status**: Local build is the QA until a project exists  
**Last updated**: 2026-09-08  
**Built by**: Johnny Huynh
