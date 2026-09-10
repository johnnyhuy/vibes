# Vercel Root Directory Hints

I'm writing this down because Root Directory lives in the **Vercel dashboard**, not in git. `vercel.json` inside an experiment can set framework / build / `ignoreCommand`. It cannot set Root Directory. A monorepo-root `vercel.json` would fight every other project. I am not adding one.

Team: `johnnyhuy-dev` (`team_qBCPdqU9J1cQDL4rkrFsjNoa`)  
Hobby quota: 100 deploys/day. Reset after the 2026-09-07 burn: **~2026-09-08 20:39 UTC** (API; earlier notes said 12:55 UTC). **Post-quota redeploy wave 2026-09-09:** Root-touch commits for scroll / audio / grass so `ignoreCommand` does not CANCELED-skip them again. Semicircle framing is already on `main` at [vibes-blender-semicircle.vercel.app](https://vibes-blender-semicircle.vercel.app). Do not retry-spam. **Repo-link cap: 25 projects per Git repo on Hobby** — `create_git_project` for `vibes-keel-hex` already failed (`repo_links_exceeded_limit`); Fairday Walk and **Ochre Gallop are blocked by the same cap** — do not create `vibes-fairday-walk` or `vibes-ochre-gallop`. No new links until Johnny frees a slot or upgrades to Pro. See [the incident](../incidents/2026-09-08-vercel-repo-link-limit-25.md).

## Dashboard field (required)

Project Settings → General → **Root Directory** → the experiment folder. Save.

If this is empty, Vercel builds the repo root. There is no root `package.json`. You get ERROR or a 404.

**`create_git_project` reuse (`deploy: false`) does not write this field.** I reused `vibes-steam-atlas` and Root stayed whatever the dashboard already had — still no production. Set it by hand.

**Pause API = 400 on hobby** for that project. I cannot pause it to stop fan-out.

See [the incident](../incidents/2026-09-08-steam-atlas-wrong-root.md).

## Per-app (verified 2026-09-08)

| Project | Id | Root Directory |
| --- | --- | --- |
| `vibes` | `prj_4b6cXKJVxCYNTn6WuofofmkBZPX6` | `experiments/ai-3d-lanes/web-3d` |
| `vibes-explode` | `prj_bkyEqYqsAhAk0ZrVnhXi9Him98Fb` | `experiments/explode-assembly` |
| `vibes-earth` | `prj_SiIJCJMag4TvYUYp8qjzuZ5EIRLe` | `experiments/earth-timeline` |
| `vibes-v8` | `prj_7Em98GNdH9nceT1LonpntoCgNgRY` | `experiments/v8-cutaway` |
| `vibes-physics` | `prj_Ilh5mBV0g7m7btvnxnhZuFY5ZjiH` | `experiments/web-physics` |
| `vibes-blender-semicircle` | `prj_PLhnoCVRKmpHc8SxyLRmcp3MFZMC` | `experiments/blender-semicircle-viewer` — framing fix on `main`; [vibes-blender-semicircle.vercel.app](https://vibes-blender-semicircle.vercel.app). Skip this wave. |
| `vibes-steam-atlas` | `prj_7D08PT8sdUjhigCEuz83oltZrDMv` | `experiments/procedural-steam-atlas` — **LIVE PASS** [vibes-steam-atlas.vercel.app](https://vibes-steam-atlas.vercel.app) (`dpl_98Yz1BpRLivVxs63SuV4UFb7Z9WS` on `a94b16e`). Assembled locomotive. Skip after quota. |
| `vibes-scroll-product` | `prj_XLBiIlbjweejp9himT53bolPEMUW` | **`experiments/scroll-product-showcase`** — 2026-09-09 Root touch so ignoreCommand builds [vibes-scroll-product.vercel.app](https://vibes-scroll-product.vercel.app) |
| `vibes-glass-capability-brain` | `prj_yJbQTsiB138V5jh92cwSWd8rZmij` | `experiments/glass-capability-brain` — production READY [vibes-glass-capability-brain.vercel.app](https://vibes-glass-capability-brain.vercel.app/) (`dpl_3CE9Dd7X7og5MuSLpcGgyxboacgz` on `9328191`). SSO off. |
| `vibes-japanese-tower` | `prj_T1KL4cJSMuY0Z6oKGnNtv8zVP0Js` | `experiments/japanese-tower` — **LIVE** Ridge Pagoda at [vibes-japanese-tower.vercel.app](https://vibes-japanese-tower.vercel.app) (`dpl_Gap9BAXosU4jMEsQsR8c2nKyEPjg` from courtyard PR). Skip after quota unless visual QA fails. |
| — | — | `experiments/ballance-roll` — **no project**. Do not create one on this PR. |
| — | — | `experiments/chinese-courtyard` — **no project**. Do not create one on this PR. |
| `vibes-audio-gadget-spin` | `prj_N57mvThg4UcU9XxLK3F5wAICz9PA` | **`experiments/audio-gadget-spin`** — SSO off. 2026-09-09 Root touch so ignoreCommand builds [vibes-audio-gadget-spin.vercel.app](https://vibes-audio-gadget-spin.vercel.app). Do not create a new project. |
| `vibes-procedural-grass-field` | — | **`experiments/procedural-grass-field`** — 2026-09-09 Root touch so ignoreCommand builds [vibes-procedural-grass-field.vercel.app](https://vibes-procedural-grass-field.vercel.app). **Do not** `create_git_project` (25-link cap). |
| — | — | `experiments/amber-longeron` — **no project**. Do not create one on this PR. |
| — | — | `experiments/nacre-loom` — **no project**. Do not create one on this PR. |
| — | — | `experiments/heartwood-warden` — **no project**. Do not create one on this PR. |
| — | — | `experiments/moon-dumpling-relay` — **no project**. Do not create one on this PR. |
| — | — | `experiments/foil-tilt-card` — **no project**. Do not create one on this PR. |
| — | — | `experiments/zephyr-vale` — **no project**. Do not create one on this PR. Post-quota name pattern: `vibes-<experiment>` → `vibes-zephyr-vale`. |
| `vibes-cinder-mere` | `prj_pXdvd08peYAlt8s9QrW3yRB6nNvv` | **`experiments/cinder-mere`** — linked `deploy: false`. SSO off. **0 production**. Do not promote until quota ~2026-09-08 20:39 UTC. |
| `vibes-kiln-studs` | `prj_qI0BHjZbM8vNYHuhPtpmN91ZOLT8` | **`experiments/kiln-studs`** — linked `deploy: false`. SSO off. **0 production**. Do not promote until quota ~2026-09-08 20:39 UTC. |
| `vibes-alba-forum` | `prj_q9pJAos2JhRzr1M3uBAalAnAST17` | **`experiments/alba-forum`** — linked `deploy: false`. SSO off. **0 production**. Do not promote until quota ~2026-09-08 20:39 UTC. |
| `vibes-brine-causeway` | `prj_UmVE510DKswQAtJf6NVYzOzQvqQf` | **`experiments/brine-causeway`** — linked `deploy: false`. SSO off. **0 production**. Do not promote until quota ~2026-09-08 20:39 UTC. |
| `vibes-breakwater` | `prj_ZR9kwHuMM2cBrQPvtuoXkdwunyho` | **`experiments/breakwater`** — linked `deploy: false`. SSO off. **0 production**. Do not promote until quota ~2026-09-08 20:39 UTC. |
| — | — | `experiments/keel-hex` — **no project**. Do not create one on this PR. Post-quota name pattern: `vibes-<experiment>` → `vibes-keel-hex`. |
| — | — | `experiments/fairday-walk` — **no project**. Do not create one on this PR. Post-quota name pattern: `vibes-<experiment>` → `vibes-fairday-walk`. |
| — | — | `experiments/ochre-gallop` — **no project**. **Blocked by Hobby 25-link cap** (`repo_links_exceeded_limit`). Do not create `vibes-ochre-gallop`. Future name only. |

In-repo `vercel.json` lives *inside* those folders (`framework: vite`, `outputDirectory: dist`, `ignoreCommand` where I have added it). Do **not** add a `"//"` comment key — Vercel schema-rejects `additional property //` and the deploy ERRORs before install. See [the incident](../incidents/2026-09-09-vercel-json-comment-key.md).

`ignoreCommand: git diff --quiet HEAD^ HEAD ./` skips the Vite build when that folder did not change. Vercel records that skip as **CANCELED** with `errorLink` **`ignored-build-step`**. It may still count as a hobby deployment. It does **not** write or refresh a production alias — that is why steam-atlas stayed `DEPLOYMENT_NOT_FOUND` after a `create_git_project` redeploy of `main` (the tip only touched `japanese-tower`).

**2026-09-09 wave:** scroll / audio / grass get a commit that **touches their Root Directory** so `ignoreCommand` passes. Semicircle framing is already on `main`. steam-atlas, explode, earth, v8, physics, glass, japanese-tower, and web-3d/`vibes` already have LIVE production. A sibling-folder merge will skip anyone we do not touch.

It will not save you if Root Directory is blank — that `vercel.json` is never read.

## Post-quota redeploy order

One deploy per project. Stop. **Wave 2026-09-09** — quota reset ~2026-09-08 20:39 UTC. Semicircle framing is on `main`. This wave only Root-touches scroll / audio / grass.

1. `vibes-blender-semicircle` — **done on `main`**. Framing fix at [vibes-blender-semicircle.vercel.app](https://vibes-blender-semicircle.vercel.app). Skip this wave.
2. `vibes-scroll-product` — Root-touch this wave so `ignoreCommand` builds [vibes-scroll-product.vercel.app](https://vibes-scroll-product.vercel.app).
3. `vibes-audio-gadget-spin` (`prj_N57mvThg4UcU9XxLK3F5wAICz9PA`) — Root-touch this wave so `ignoreCommand` builds [vibes-audio-gadget-spin.vercel.app](https://vibes-audio-gadget-spin.vercel.app). Do not create a new project.
4. `vibes-procedural-grass-field` — Root-touch this wave so `ignoreCommand` builds [vibes-procedural-grass-field.vercel.app](https://vibes-procedural-grass-field.vercel.app). **Do not** `create_git_project` (25-link cap).
5. Only then ballance / courtyard / amber-longeron / nacre-loom / heartwood-warden / moon-dumpling-relay / foil-tilt-card / zephyr-vale / cinder-mere / kiln-studs / alba-forum / brine-causeway / breakwater / keel-hex / fairday-walk / ochre-gallop. Do **not** create `vibes-ballance-roll`, a courtyard project, `vibes-amber-longeron`, `vibes-nacre-loom`, `vibes-heartwood-warden`, `vibes-moon-dumpling-relay`, `vibes-foil-tilt-card`, `vibes-zephyr-vale`, `vibes-keel-hex`, `vibes-fairday-walk`, or `vibes-ochre-gallop` until a repo-link slot exists. `vibes-cinder-mere`, `vibes-kiln-studs`, `vibes-alba-forum`, `vibes-brine-causeway`, and `vibes-breakwater` already exist as link-only — do not promote them on this wave. New projects follow `vibes-<experiment>`.
6. **Skip** explode / steam-atlas / japanese-tower / glass / earth / v8 / physics / web-3d unless a later visual QA says they broke.

`experiments/glass-capability-brain/` has `vercel.json`. Project `vibes-glass-capability-brain` (`prj_yJbQTsiB138V5jh92cwSWd8rZmij`) has production READY at [vibes-glass-capability-brain.vercel.app](https://vibes-glass-capability-brain.vercel.app/) (SSO off). It shipped for free on the japanese-tower `main` merge (`9328191` / `dpl_3CE9Dd7X7og5MuSLpcGgyxboacgz`). See [the incident](../incidents/2026-09-08-glass-auto-deploy-on-tower-merge.md).

`experiments/japanese-tower/` has `vercel.json` (`ignoreCommand`). Project `vibes-japanese-tower` (`prj_T1KL4cJSMuY0Z6oKGnNtv8zVP0Js`) is **LIVE** at [vibes-japanese-tower.vercel.app](https://vibes-japanese-tower.vercel.app) (Ridge Pagoda, `dpl_Gap9BAXosU4jMEsQsR8c2nKyEPjg`). Skip after quota unless visual QA fails.

`experiments/ballance-roll/` has `vercel.json` (`ignoreCommand`). **No Vercel project.** Do not create one on this PR. When I do: dashboard Root Directory = `experiments/ballance-roll`.

`experiments/chinese-courtyard/` has `vercel.json` (`ignoreCommand`). **No Vercel project.** Do not create one on this PR. When I do: dashboard Root Directory = `experiments/chinese-courtyard`.

`experiments/audio-gadget-spin/` has `vercel.json` (`ignoreCommand`). Project `vibes-audio-gadget-spin` (`prj_N57mvThg4UcU9XxLK3F5wAICz9PA`) exists. SSO off. Root: `experiments/audio-gadget-spin`. **2026-09-09 Root touch** so ignoreCommand builds [vibes-audio-gadget-spin.vercel.app](https://vibes-audio-gadget-spin.vercel.app). See [the incident](../incidents/2026-09-07-audio-gadget-linked-before-quota.md).

`experiments/procedural-grass-field/` has `vercel.json` (`ignoreCommand`). **2026-09-09 Root touch** so ignoreCommand builds [vibes-procedural-grass-field.vercel.app](https://vibes-procedural-grass-field.vercel.app). **No new project** — 25-link cap. Dashboard Root Directory = `experiments/procedural-grass-field`.

`experiments/amber-longeron/` is a new Vite app with its own `vercel.json` (`ignoreCommand`). **No Vercel project.** Do not create one on this PR. When I do: dashboard Root Directory = `experiments/amber-longeron`.

`experiments/nacre-loom/` is a new Vite app with its own `vercel.json` (`ignoreCommand`). **No Vercel project.** Do not create one on this PR. When I do: dashboard Root Directory = `experiments/nacre-loom`.

`experiments/heartwood-warden/` is a new Vite app with its own `vercel.json` (`ignoreCommand`). **No Vercel project.** Do not create one on this PR. When I do: dashboard Root Directory = `experiments/heartwood-warden`.

`experiments/moon-dumpling-relay/` is a new Vite app with its own `vercel.json` (`ignoreCommand`). **No Vercel project.** Do not create one on this PR. When I do: dashboard Root Directory = `experiments/moon-dumpling-relay`. Local-only until quota is healthy.

`experiments/foil-tilt-card/` is a new Vite app with its own `vercel.json` (`ignoreCommand`). **No Vercel project.** Do not create one on this PR. When I do: dashboard Root Directory = `experiments/foil-tilt-card`. Local-only until quota is healthy.

`experiments/zephyr-vale/` is a new Vite app with its own `vercel.json` (`ignoreCommand`). **No Vercel project.** Do not create one on this PR. When I do: project name `vibes-zephyr-vale` (`vibes-<experiment>`), dashboard Root Directory = `experiments/zephyr-vale`. Local-only until quota is healthy.

`experiments/cinder-mere/` has `vercel.json` (`ignoreCommand`). Project `vibes-cinder-mere` (`prj_pXdvd08peYAlt8s9QrW3yRB6nNvv`) exists, created `deploy: false`. SSO off. Intended Root: `experiments/cinder-mere`. **0 production** — do not promote until after quota. See [the drift note](../incidents/2026-09-08-readme-vercel-link-only-drift.md).

`experiments/kiln-studs/` has `vercel.json` (`ignoreCommand`). Project `vibes-kiln-studs` (`prj_qI0BHjZbM8vNYHuhPtpmN91ZOLT8`) exists, created `deploy: false`. SSO off. Intended Root: `experiments/kiln-studs`. **0 production** — do not promote until after quota. See [the drift note](../incidents/2026-09-08-readme-vercel-link-only-drift.md).

`experiments/alba-forum/` has `vercel.json` (`ignoreCommand`). Project `vibes-alba-forum` (`prj_q9pJAos2JhRzr1M3uBAalAnAST17`) exists, created `deploy: false`. SSO off. Intended Root: `experiments/alba-forum`. **0 production** — do not promote until after quota. See [the drift note](../incidents/2026-09-08-readme-vercel-link-only-drift.md).

`experiments/brine-causeway/` has `vercel.json` (`ignoreCommand`). Project `vibes-brine-causeway` (`prj_UmVE510DKswQAtJf6NVYzOzQvqQf`) exists, created `deploy: false`. SSO off. Intended Root: `experiments/brine-causeway`. **0 production** — do not promote until after quota. See [the drift note](../incidents/2026-09-08-readme-vercel-link-only-drift.md).

`experiments/breakwater/` has `vercel.json` (`ignoreCommand`). Project `vibes-breakwater` (`prj_ZR9kwHuMM2cBrQPvtuoXkdwunyho`) exists, created `deploy: false`. SSO off. Intended Root: `experiments/breakwater`. **0 production** — do not promote until after quota. See [the drift note](../incidents/2026-09-08-readme-vercel-link-only-drift.md).

`experiments/keel-hex/` is a new Vite app with its own `vercel.json` (`ignoreCommand`). **No Vercel project.** Do not create one on this PR. When I do: project name `vibes-keel-hex` (`vibes-<experiment>`), dashboard Root Directory = `experiments/keel-hex`. Local-only until quota is healthy.

`experiments/fairday-walk/` is a new Vite app with its own `vercel.json` (`ignoreCommand`). **No Vercel project.** Do not create one on this PR. When I do: project name `vibes-fairday-walk` (`vibes-<experiment>`), dashboard Root Directory = `experiments/fairday-walk`. Local-only until quota is healthy.

`experiments/ochre-gallop/` is a new Vite app with its own `vercel.json` (`ignoreCommand`). **No Vercel project.** **Blocked by the Hobby 25-link cap** — same `repo_links_exceeded_limit` that rejected `vibes-keel-hex`. Do not call `create_git_project`. Future name only: `vibes-ochre-gallop`. Dashboard Root Directory would be `experiments/ochre-gallop`. See [the incident](../incidents/2026-09-08-vercel-repo-link-limit-25.md).

steam-atlas Root must stay `experiments/procedural-steam-atlas`. It already has LIVE production. Do not spend a post-quota slot on it unless a later visual QA fails.

Do not create extra Vercel projects. Do not call `create_git_project`. The 2026-09-09 wave only Root-touches scroll / audio / grass.

## README showcase previews

The root README is a visual showcase (GIFs, not an ops table). Refresh `docs/previews/<app>.gif` when an app ships or the motion clip goes stale. Stills are a fallback only. Ops status lives in [deployment notes](./). See [docs/visual-qa/README.md](../visual-qa/README.md).

### Hill-climb — 2026-09-08 (ballance-roll)

Explode production still **PASS** on `de25d60`. Semicircle still FAIL on `25587f54`. steam-atlas + scroll-product still `DEPLOYMENT_NOT_FOUND` at that hour — steam-atlas `main` redeploy **CANCELED** `ignored-build-step` (tip only touched japanese-tower). Glass production LIVE on the tower merge (`9328191` / `dpl_3CE9Dd7X7og5MuSLpcGgyxboacgz`). Tower project exists, 0 production. That pass was the marble experiment plus README touches.

### Hill-climb — 2026-09-08 (chinese-courtyard)

steam-atlas production **LIVE PASS** ~4:37am AEST: assembled locomotive on `dpl_98Yz1BpRLivVxs63SuV4UFb7Z9WS` / `main` `a94b16e`. Semicircle still FAIL on `25587f54`. scroll-product still 404. explode and glass PASS. That pass was the courtyard experiment plus README touches.

### Hill-climb — 2026-09-08 (audio-gadget-spin)

That pass added Lumen Cuff locally. The project was created later the same day: `vibes-audio-gadget-spin` / `prj_N57mvThg4UcU9XxLK3F5wAICz9PA`, `deploy: false`. Still no production.

### Hill-climb — 2026-09-07 (procedural-grass-field)

This pass adds Wind Lea locally. **No new Vercel project. No redeploy.** Quota still 0 until ~2026-09-08 20:39 UTC. Post-quota jobs remain semicircle then scroll. Audio-gadget stays linked-not-live (SSO off). Skip explode, steam, tower, glass unless they break. Still no ballance-roll or courtyard project.

### Hill-climb — 2026-09-07 (amber-longeron)

This pass adds Amber Longeron locally. **No new Vercel project. No redeploy.** Quota still 0 until ~2026-09-08 20:39 UTC. Post-quota order: semicircle framing → scroll-product READY → audio-gadget first production → then grass / ballance / courtyard. If `vibes-procedural-grass-field` already exists `deploy: false`, leave it. Do not create `vibes-amber-longeron`.

Git-main semicircle *preview* PASS; production still FAIL on stale `25587f54`. `vibes-scroll-product` still 404. Unchanged backlog.

### Hill-climb — 2026-09-07 (nacre-loom)

This pass adds Nacre Loom locally. **No new Vercel project. No redeploy.** Quota still 0 until ~2026-09-08 20:39 UTC. Post-quota order: (1) semicircle production from the framing-fix git-main preview (2) scroll-product first READY (3) audio-gadget first production (4) grass (5) only then ballance / courtyard / amber-longeron / this orb. Do not create `vibes-nacre-loom`.

Git-main semicircle *preview* PASS; production still FAIL on stale `25587f54`. `vibes-scroll-product` still 404. Unchanged backlog.

### Hill-climb — 2026-09-07 (heartwood-warden)

This pass adds Heartwood Warden locally. **No new Vercel project. No redeploy.** Quota still 0 until ~2026-09-08 20:39 UTC. Post-quota order: (1) semicircle production from the framing-fix git-main preview (2) scroll-product first READY (3) audio-gadget first production (4) grass (5) only then ballance / courtyard / amber-longeron / nacre-loom / this glade. Do not create `vibes-heartwood-warden`.

Git-main semicircle *preview* PASS; production still FAIL on stale `25587f54`. `vibes-scroll-product` still 404. Unchanged backlog.

---

### Hill-climb — 2026-09-08 (moon-dumpling-relay)

This pass adds Moon Dumpling Relay locally. **No new Vercel project. No redeploy.** Quota still 0 until ~2026-09-08 20:39 UTC. Post-quota order unchanged. Do not create `vibes-moon-dumpling-relay`.

### Hill-climb — 2026-09-08 (foil-tilt-card)

This pass adds Foil Tilt Card locally. **No new Vercel project. No redeploy.** Quota still 0 until ~2026-09-08 20:39 UTC. Post-quota order unchanged. Do not create `vibes-foil-tilt-card`.

### Hill-climb — 2026-09-08 (zephyr-vale)

This pass adds Zephyr Vale locally. **No new Vercel project. No redeploy.** Quota still 0 until ~2026-09-08 20:39 UTC. Post-quota name pattern is `vibes-<experiment>` — this one would be `vibes-zephyr-vale`. Do not create it here.

### Hill-climb — 2026-09-08 (cinder-mere)

This pass adds Cinder Mere locally. **No new Vercel project. No redeploy.** Quota still 0 until ~2026-09-08 20:39 UTC. Post-quota name pattern is `vibes-<experiment>` — this one would be `vibes-cinder-mere`. Do not create it here.

### Hill-climb — 2026-09-08 (kiln-studs)

This pass adds Kiln Studs locally. **No new Vercel project. No redeploy.** Quota still 0 until ~2026-09-08 20:39 UTC. Post-quota name pattern is `vibes-<experiment>` — this one would be `vibes-kiln-studs`. Do not create it here.

### Hill-climb — 2026-09-08 (alba-forum)

This pass adds Alba Forum locally. **No new Vercel project. No redeploy.** Quota still 0 until ~2026-09-08 20:39 UTC. Post-quota name pattern is `vibes-<experiment>` — this one would be `vibes-alba-forum`. Do not create it here.

### Hill-climb — 2026-09-08 (brine-causeway)

This pass adds Brine Causeway locally. **No new Vercel project. No redeploy.** Quota still 0 until ~2026-09-08 20:39 UTC. Post-quota name pattern is `vibes-<experiment>` — this one would be `vibes-brine-causeway`. Do not create it here.

### Hill-climb — 2026-09-08 (breakwater)

This pass adds Breakwater locally. **No new Vercel project. No redeploy.** Quota still 0 until ~2026-09-08 20:39 UTC. Post-quota name pattern is `vibes-<experiment>` — this one would be `vibes-breakwater`. Do not create it here.

### Hill-climb — 2026-09-08 (keel-hex)

This pass adds Keel Hex locally. **No new Vercel project. No redeploy.** Quota still 0 until ~2026-09-08 20:39 UTC. Post-quota name pattern is `vibes-<experiment>` — this one would be `vibes-keel-hex`. Do not create it here.

### Hill-climb — 2026-09-08 (fairday-walk)

This pass adds Fairday Walk locally. **No new Vercel project. No redeploy.** Quota still 0 until ~2026-09-08 20:39 UTC. Post-quota name pattern is `vibes-<experiment>` — this one would be `vibes-fairday-walk`. Do not create it here.

### Hill-climb — 2026-09-08 (ochre-gallop)

This pass adds Ochre Gallop locally. **No new Vercel project. No redeploy.** Hobby is at the **25 Git repo-link cap** (`repo_links_exceeded_limit` on keel-hex). Future name would be `vibes-ochre-gallop`. Do not create it here.

### Hill-climb — 2026-09-09 (post-quota Root-touch wave)

Quota reset ~2026-09-08 20:39 UTC. This pass **does not create projects**. I touch `experiments/scroll-product-showcase/`, `experiments/audio-gadget-spin/`, and `experiments/procedural-grass-field/` so `ignoreCommand` cannot CANCELED-skip them (`ignored-build-step`). Showcase Live links: [scroll](https://vibes-scroll-product.vercel.app), [audio](https://vibes-audio-gadget-spin.vercel.app), [grass](https://vibes-procedural-grass-field.vercel.app). Semicircle framing is already on `main` at [vibes-blender-semicircle.vercel.app](https://vibes-blender-semicircle.vercel.app). Skip explode / earth / v8 / physics / steam / glass / tower / web-3d.

**Author**: Johnny Huynh  
**Last updated**: 2026-09-09 (post-quota Root-touch wave)
