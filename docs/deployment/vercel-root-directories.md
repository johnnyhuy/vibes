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
| `vibes-steam-atlas` | `prj_7D08PT8sdUjhigCEuz83oltZrDMv` | **MUST set `experiments/procedural-steam-atlas` in the dashboard before any post-quota deploy.** Reuse/MCP did not persist it. 0 production READY |
| `vibes-scroll-product` | `prj_XLBiIlbjweejp9himT53bolPEMUW` | **`experiments/scroll-product-showcase`** (set; 0 deployments) |
| `vibes-glass-capability-brain` | `prj_yJbQTsiB138V5jh92cwSWd8rZmij` | `experiments/glass-capability-brain` — production READY [vibes-glass-capability-brain.vercel.app](https://vibes-glass-capability-brain.vercel.app/) (`dpl_3CE9Dd7X7og5MuSLpcGgyxboacgz` on `9328191`). SSO off. |
| `vibes-japanese-tower` | `prj_T1KL4cJSMuY0Z6oKGnNtv8zVP0Js` | `experiments/japanese-tower` — created `deploy: false`; **0 production** until post-quota |
| — | — | `experiments/ballance-roll` — **no project**. Do not create one on this PR. |

In-repo `vercel.json` lives *inside* those folders (`framework: vite`, `outputDirectory: dist`, `ignoreCommand` where I have added it).

`ignoreCommand: git diff --quiet HEAD^ HEAD ./` skips the Vite build when that folder did not change. Vercel records that skip as **CANCELED** with `errorLink` **`ignored-build-step`**. It may still count as a hobby deployment. It does **not** write or refresh a production alias — that is why steam-atlas stayed `DEPLOYMENT_NOT_FOUND` after a `create_git_project` redeploy of `main` (the tip only touched `japanese-tower`).

Pending apps (steam-atlas, scroll-product, semicircle, japanese-tower) need a commit that **touches their Root Directory** or a **dashboard Redeploy** that bypasses ignore, after quota ~2026-09-08 12:55 UTC. A sibling-folder merge will skip them again.

It will not save you if Root Directory is blank — that `vercel.json` is never read.

## Post-quota redeploy order

One deploy per project. Stop. Updated 2026-09-08 (ballance-roll hill-climb).

1. **Skip** `vibes-explode` — PASS at 2:22am on `dpl_ELE1f1XhqGQ7hciZSjkPVLMPmUh8` / `main` `de25d60`. Redeploy only if a later check goes stale.
2. `vibes-blender-semicircle` — production still `25587f54` (cropped mega-arc / thin blue curve). One `main` redeploy for bbox framing.
3. `vibes-steam-atlas` — `404 DEPLOYMENT_NOT_FOUND`. Last `main` redeploy **CANCELED** `ignored-build-step`. **Confirm** dashboard Root = `experiments/procedural-steam-atlas`, then one `main` production deploy from a commit that touches this folder (or dashboard Redeploy).
4. `vibes-scroll-product` — first production from `main` (Root already `experiments/scroll-product-showcase`).
5. `vibes-japanese-tower` — created `deploy: false`, Root `experiments/japanese-tower`, **0 production**. First production after quota. Glass is already live — do not spend a slot on it.
6. Do **not** create `vibes-ballance-roll` until quota is healthy.

`experiments/glass-capability-brain/` has `vercel.json`. Project `vibes-glass-capability-brain` (`prj_yJbQTsiB138V5jh92cwSWd8rZmij`) has production READY at [vibes-glass-capability-brain.vercel.app](https://vibes-glass-capability-brain.vercel.app/) (SSO off). It shipped for free on the japanese-tower `main` merge (`9328191` / `dpl_3CE9Dd7X7og5MuSLpcGgyxboacgz`). See [the incident](../incidents/2026-09-08-glass-auto-deploy-on-tower-merge.md).

`experiments/japanese-tower/` has `vercel.json` (`ignoreCommand`). Project `vibes-japanese-tower` (`prj_T1KL4cJSMuY0Z6oKGnNtv8zVP0Js`) exists with Root `experiments/japanese-tower`, created `deploy: false`. **0 production** until ~2026-09-08 12:55 UTC.

`experiments/ballance-roll/` is a new Vite app with its own `vercel.json` (`ignoreCommand`). **No Vercel project.** Do not create one on this PR. When I do: dashboard Root Directory = `experiments/ballance-roll`.

This does not change the steam-atlas rule — that project still needs Root = `experiments/procedural-steam-atlas` before any post-quota deploy.

Do not create extra Vercel projects. Do not force production redeploys while the quota is 0.

### Hill-climb — 2026-09-08 (ballance-roll)

Explode production still **PASS** on `de25d60`. Semicircle still FAIL on `25587f54`. steam-atlas + scroll-product still `DEPLOYMENT_NOT_FOUND` — steam-atlas `main` redeploy **CANCELED** `ignored-build-step` (tip only touched japanese-tower). Glass production LIVE on the tower merge (`9328191` / `dpl_3CE9Dd7X7og5MuSLpcGgyxboacgz`). Tower project exists, 0 production. This pass is the marble experiment plus README touches so those Roots are in the merge diff. No deploys from the agent. Do not assume every project auto-redeployed — [glass incident](../incidents/2026-09-08-glass-auto-deploy-on-tower-merge.md), [steam-atlas incident](../incidents/2026-09-08-steam-atlas-wrong-root.md).

---

**Author**: Johnny Huynh  
**Last updated**: 2026-09-08
