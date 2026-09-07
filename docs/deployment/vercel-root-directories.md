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
| `vibes-blender-semicircle` | `prj_PLhnoCVRKmpHc8SxyLRmcp3MFZMC` | `experiments/blender-semicircle-viewer` |
| `vibes-steam-atlas` | `prj_7D08PT8sdUjhigCEuz83oltZrDMv` | **MUST set `experiments/procedural-steam-atlas` in the dashboard before any post-quota deploy.** Reuse/MCP did not persist it. 0 production READY |
| `vibes-scroll-product` | `prj_XLBiIlbjweejp9himT53bolPEMUW` | **`experiments/scroll-product-showcase`** (set; 0 deployments) |

In-repo `vercel.json` lives *inside* those folders (`framework: vite`, `outputDirectory: dist`, `ignoreCommand` where I have added it).

`ignoreCommand: git diff --quiet HEAD^ HEAD ./` skips the Vite build when that folder did not change. It may still count as a hobby deployment. It will not save you if Root Directory is blank — that `vercel.json` is never read.

## Post-quota redeploy order

One deploy per project. Stop.

1. `vibes-explode` — production is stale grey studio; need `main` for #12 black studio + ordered gallery
2. `vibes-blender-semicircle` — production is pre-`5941e259` / pre-`03bbe0c` FOV+bbox framing
3. `vibes-steam-atlas` — **first production** from `main` only after the dashboard Root is `experiments/procedural-steam-atlas`
4. `vibes-scroll-product` — **first production** from `main` (Root already `experiments/scroll-product-showcase`)

Do not create extra Vercel projects. Do not force production redeploys while the quota is 0.

---

**Author**: Johnny Huynh  
**Last updated**: 2026-09-08
