# Ochre Gallop — multi-environment chase

I built this after reading [@BrenBuilds](https://x.com/BrenBuilds/status/2097221820743139824). The public pitch: a chase game that used to be flat, now three environments, Astra + Three.js + Blender. Their advertised live is a Yellowstone chase with three park-named places and three run modes. I wanted the *read* — three selectable highlands, one short chase loop each — without cloning their world, runner, HUD, or bundle.

I studied the **post text**, the **public card title / description**, and a feel-only **menu** still (`hill-climb/refs/bison-breakaway-20260908-1824.png` when present). I did **not** scrape, fork, or copy that live site’s source, models, Yellowstone / NPS branding, mode names, poster art, or UI chrome. This is my educational demo — **vibes · ochre gallop**. The place is invented: **Ochre Gallop / 赭奔**.

## What I built

- **An invented lobby** — two columns: geometric poster + highland tabs + rust **Open** CTA. Select, then stride. Not their yellow Play card or silk-screen toss.
- **Three invented highlands** — Sulfur Terrace / 硫阶, Spout Basin / 喷盆, Rim Overlook / 檐望. Concentric mineral lips, a sinter bowl, a canyon shelf. Not park itineraries.
- **Ashmane / 灰鬃** — a procedural stylized ungulate. Umber hide, ash mane, gallop gait. Not a photo-real bison brand.
- **One loop per highland** — Ribbon Cut (weave the terrace gates), Plume Break (outrun a steam front), Shelf Drift (endless overlook). Gauntlet / escape / endless *feel* only; the nouns are mine.
- **Chase cam + kinematic stride** — WASD run, space burst, 1 / 2 / 3 switch biomes, R banks. Mute-default sinter bed (ADR-0010).
- **Frosted 2026-09-08 HUD** — Inter, ochre accent, glass chips. Brand `vibes · ochre gallop`.
- **Mid-hi procedural PBR** — vertex-colour terrain, physical materials, vendored Poly Haven dusk HDRI (CC0). No ripped GLB.

## Stack

Vite + React 19 + TypeScript + R3F + drei + three `~0.170`. Kinematic runner — no cannon-es.

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

**No `vibes-ochre-gallop` project exists.** Hobby team `johnnyhuy-dev` is already at the **25 Git repo-link cap** (`repo_links_exceeded_limit`). Creating a new git-linked project will fail the same way Keel Hex did. This is not a daily-quota reset.

Do **not** call `create_git_project` or retry a create. Local-only until Johnny unlinks a project or upgrades to Pro. See [the incident](../../docs/incidents/2026-09-08-vercel-repo-link-limit-25.md).

Future name remains **`vibes-ochre-gallop`**. Dashboard **Root Directory** would be `experiments/ochre-gallop`. `vercel.json` only carries the usual Vite fields plus `ignoreCommand`; it cannot set Root Directory.

## Local playtest (2026-09-08)

Headed preview on `127.0.0.1:4173` after `npm run build`:

- Lobby first: charcoal, invented poster, Sulfur Terrace tab, rust **Open Sulfur Terrace**. Tabs rewrite the poster and CTA.
- Enter / Open drops into the chase. Esc / Highlands returns.
- In-level: ochre terrace, teal pool, Ashmane. Chips still switch Spout Basin and Rim Overlook.
- Thin HUD. No park lockup, no yellow Play, no third-party mode names.
- Mute stays default. No console fatals; only benign WebGL `ReadPixels` notes.
- Still: `docs/previews/ochre-gallop.png` (lobby).

No Vercel project. No production URL.

## Distinct from siblings

Brine Causeway is a **coast highway + coupe**. Cinder Mere is a **dusk basin + kiln cart**. Fairday Walk (parallel) is a **memory stroll**. Breakwater is a **harbour orbit**. Amber Longeron is a **biplane dodge**. This pass is a **three-highland ungulate chase**.

## Related

- [docs/reverse-engineering/ochre-gallop.md](../../docs/reverse-engineering/ochre-gallop.md)
- [docs/adr/0025-ochre-gallop-multi-env-chase.md](../../docs/adr/0025-ochre-gallop-multi-env-chase.md)
- [ATTRIBUTION.md](./ATTRIBUTION.md)

---

**Status**: Local-only — Hobby 25-link cap; no project  
**Last updated**: 2026-09-08  
**Built by**: Johnny Huynh
