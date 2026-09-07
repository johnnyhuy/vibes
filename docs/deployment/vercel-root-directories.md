# Vercel Root Directory Hints

I'm writing this down because Root Directory lives in the **Vercel dashboard**, not in git. `vercel.json` inside an experiment can set framework / build / `ignoreCommand`. It cannot set Root Directory. A monorepo-root `vercel.json` would fight every other project. I am not adding one.

Team: `johnnyhuy-dev` (`team_qBCPdqU9J1cQDL4rkrFsjNoa`)  
Hobby quota: 100 deploys/day. Reset after the 2026-09-07 burn: **~2026-09-08 12:55 UTC**. Do not retry-spam.

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
| `vibes-blender-semicircle` | `prj_PLhnoCVRKmpHc8SxyLRmcp3MFZMC` | `experiments/blender-semicircle-viewer` — production alias still on `25587f54` |
| `vibes-steam-atlas` | `prj_7D08PT8sdUjhigCEuz83oltZrDMv` | `experiments/procedural-steam-atlas` — **LIVE PASS** [vibes-steam-atlas.vercel.app](https://vibes-steam-atlas.vercel.app) (`dpl_98Yz1BpRLivVxs63SuV4UFb7Z9WS` on `a94b16e`). Assembled locomotive. Skip after quota. |
| `vibes-scroll-product` | `prj_XLBiIlbjweejp9himT53bolPEMUW` | **`experiments/scroll-product-showcase`** (set; no READY production — one CANCELED) |
| `vibes-glass-capability-brain` | `prj_yJbQTsiB138V5jh92cwSWd8rZmij` | `experiments/glass-capability-brain` — production READY [vibes-glass-capability-brain.vercel.app](https://vibes-glass-capability-brain.vercel.app/) (`dpl_3CE9Dd7X7og5MuSLpcGgyxboacgz` on `9328191`). SSO off. |
| `vibes-japanese-tower` | `prj_T1KL4cJSMuY0Z6oKGnNtv8zVP0Js` | `experiments/japanese-tower` — production READY from courtyard PR: `dpl_Gap9BAXosU4jMEsQsR8c2nKyEPjg` on `7d1be7c` ([vibes-japanese-tower.vercel.app](https://vibes-japanese-tower.vercel.app)). Later `main` refresh only if the keep drifts. |
| — | — | `experiments/ballance-roll` — **no project**. Do not create one on this PR. |
| — | — | `experiments/chinese-courtyard` — **no project**. Do not create one on this PR. |
| — | — | `experiments/audio-gadget-spin` — **no project**. Do not create one on this PR. |

In-repo `vercel.json` lives *inside* those folders (`framework: vite`, `outputDirectory: dist`, `ignoreCommand` where I have added it).

`ignoreCommand: git diff --quiet HEAD^ HEAD ./` skips the Vite build when that folder did not change. Vercel records that skip as **CANCELED** with `errorLink` **`ignored-build-step`**. It may still count as a hobby deployment. It does **not** write or refresh a production alias — that is why steam-atlas stayed `DEPLOYMENT_NOT_FOUND` after a `create_git_project` redeploy of `main` (the tip only touched `japanese-tower`).

Pending apps (scroll-product, semicircle) need a commit that **touches their Root Directory** or a **dashboard Redeploy** that bypasses ignore, after quota ~2026-09-08 12:55 UTC. steam-atlas already has LIVE production from the ballance Root touch. japanese-tower already has READY production from the courtyard PR branch. A sibling-folder merge will skip the pending ones again.

It will not save you if Root Directory is blank — that `vercel.json` is never read.

## Post-quota redeploy order

One deploy per project. Stop. Updated 2026-09-08 (audio-gadget hill-climb).

1. **Skip** `vibes-explode` — PASS at 2:22am and again ~4:37am. Redeploy only if a later check goes stale.
2. **Skip** `vibes-steam-atlas` — LIVE PASS ~4:37am on `a94b16e` / `dpl_98Yz1BpRLivVxs63SuV4UFb7Z9WS` (assembled locomotive). Redeploy only if a later visual QA fails.
3. `vibes-blender-semicircle` — production still `25587f54` (cropped mega-arc / thin vertical ring). One `main` redeploy for bbox framing.
4. `vibes-scroll-product` — first READY production from `main` (Root already `experiments/scroll-product-showcase`).
5. `vibes-japanese-tower` — READY production already exists from courtyard PR branch `dpl_Gap9BAXosU4jMEsQsR8c2nKyEPjg` on `7d1be7c`. Verify; a later `main` refresh only if content drifts. Glass is already live — do not spend a slot on it.
6. Do **not** create `vibes-ballance-roll`, a courtyard project, or `vibes-audio-gadget-spin` until quota is healthy.

`experiments/glass-capability-brain/` has `vercel.json`. Project `vibes-glass-capability-brain` (`prj_yJbQTsiB138V5jh92cwSWd8rZmij`) has production READY at [vibes-glass-capability-brain.vercel.app](https://vibes-glass-capability-brain.vercel.app/) (SSO off). It shipped for free on the japanese-tower `main` merge (`9328191` / `dpl_3CE9Dd7X7og5MuSLpcGgyxboacgz`). See [the incident](../incidents/2026-09-08-glass-auto-deploy-on-tower-merge.md).

`experiments/japanese-tower/` has `vercel.json` (`ignoreCommand`). Project `vibes-japanese-tower` (`prj_T1KL4cJSMuY0Z6oKGnNtv8zVP0Js`) exists with Root `experiments/japanese-tower`. Production READY from courtyard PR: `dpl_Gap9BAXosU4jMEsQsR8c2nKyEPjg` on `7d1be7c`.

`experiments/ballance-roll/` has `vercel.json` (`ignoreCommand`). **No Vercel project.** Do not create one on this PR. When I do: dashboard Root Directory = `experiments/ballance-roll`.

`experiments/chinese-courtyard/` has `vercel.json` (`ignoreCommand`). **No Vercel project.** Do not create one on this PR. When I do: dashboard Root Directory = `experiments/chinese-courtyard`.

`experiments/audio-gadget-spin/` is a new Vite app with its own `vercel.json` (`ignoreCommand`). **No Vercel project.** Do not create one on this PR. When I do: dashboard Root Directory = `experiments/audio-gadget-spin`.

steam-atlas Root must stay `experiments/procedural-steam-atlas`. It already has LIVE production. Do not spend a post-quota slot on it unless a later visual QA fails.

Do not create extra Vercel projects. Do not force production redeploys while the quota is 0.

## README showcase previews

The root README is a visual showcase (GIFs, not an ops table). Refresh `docs/previews/<app>.gif` when an app ships or the motion clip goes stale. Stills are a fallback only. Ops status lives in [deployment notes](./). See [docs/visual-qa/README.md](../visual-qa/README.md).

### Hill-climb — 2026-09-08 (ballance-roll)

Explode production still **PASS** on `de25d60`. Semicircle still FAIL on `25587f54`. steam-atlas + scroll-product still `DEPLOYMENT_NOT_FOUND` at that hour — steam-atlas `main` redeploy **CANCELED** `ignored-build-step` (tip only touched japanese-tower). Glass production LIVE on the tower merge (`9328191` / `dpl_3CE9Dd7X7og5MuSLpcGgyxboacgz`). Tower project exists, 0 production. That pass was the marble experiment plus README touches.

### Hill-climb — 2026-09-08 (chinese-courtyard)

steam-atlas production **LIVE PASS** ~4:37am AEST: assembled locomotive on `dpl_98Yz1BpRLivVxs63SuV4UFb7Z9WS` / `main` `a94b16e`. Semicircle still FAIL on `25587f54`. scroll-product still 404. explode and glass PASS. That pass was the courtyard experiment plus README touches.

### Hill-climb — 2026-09-08 (audio-gadget-spin)

This pass adds Lumen Cuff locally. **No redeploy.** japanese-tower production is already READY from the courtyard PR (`dpl_Gap9BAXosU4jMEsQsR8c2nKyEPjg` / `7d1be7c`). Do not create audio-gadget / ballance-roll / courtyard projects. Skip explode and steam after quota.

---

**Author**: Johnny Huynh  
**Last updated**: 2026-09-08
