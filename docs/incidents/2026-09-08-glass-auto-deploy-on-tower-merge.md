# Incident: Glass Got a Free Production Deploy on the Tower Merge

**Date**: 2026-09-08  
**Component**: Vercel projects on `johnnyhuy-dev` (`team_qBCPdqU9J1cQDL4rkrFsjNoa`)  
**Severity**: Low (docs / process — do not assume every project auto-redeployed)  
**Status**: Documented. Do not retry-spam deploys.

I verified this read-only against the Vercel API on 2026-09-08. I did **not** create a project or force a redeploy.

---

## What Happened

`main` landed `9328191` (`feat: Ridge Pagoda japanese-tower experiment`). That push was enough for **one** already-linked Vite app to cut a production deploy:

| Project | Id | What the merge did |
| --- | --- | --- |
| `vibes-glass-capability-brain` | `prj_yJbQTsiB138V5jh92cwSWd8rZmij` | Production **READY** `dpl_3CE9Dd7X7og5MuSLpcGgyxboacgz` on commit `9328191`. Alias [vibes-glass-capability-brain.vercel.app](https://vibes-glass-capability-brain.vercel.app/). SSO off. Git meta is the **tower** commit message — the hook, not the app. |
| `vibes-japanese-tower` | `prj_T1KL4cJSMuY0Z6oKGnNtv8zVP0Js` | Project exists. Root `experiments/japanese-tower`. Created `deploy: false`. **0 deployments.** `live: false`. |
| `vibes-steam-atlas` | `prj_7D08PT8sdUjhigCEuz83oltZrDMv` | Production alias still `404 DEPLOYMENT_NOT_FOUND` |
| `vibes-scroll-product` | `prj_XLBiIlbjweejp9himT53bolPEMUW` | Production alias still `404 DEPLOYMENT_NOT_FOUND` |
| `vibes-blender-semicircle` | `prj_PLhnoCVRKmpHc8SxyLRmcp3MFZMC` | Production still stale on `25587f54` (pre bbox framing) |

So: **a main merge is not a fleet redeploy.** Glass had a project that was willing to build production. Tower’s project was created with `deploy: false` and stayed empty. Steam and scroll still have no successful production. Semicircle did not move off the bad commit.

## Why This Matters For The Next Hill-Climb

Do not write “everything on main is live now” after one merge. Check each alias.

Post-quota order is still **one deploy each**, and glass is **already live** — skip it:

1. Skip explode (fresh on `de25d60` unless stale)
2. `vibes-blender-semicircle` — replace `25587f54`
3. `vibes-steam-atlas` — confirm Root = `experiments/procedural-steam-atlas`, then first production
4. `vibes-scroll-product` — first production
5. `vibes-japanese-tower` — first production (project exists, 0 deploys)
6. Glass — **done**. Do not spend a quota slot “just in case”

Do not create `vibes-ballance-roll` (or any new project) while the hobby day is still tight.

## What I Learnt

1. `create_git_project(..., deploy: false)` can leave a project with **zero** rows even after `main` moves
2. A sibling project with Root already set **will** eat the next `main` push — that is how glass shipped on a tower commit
3. Vercel commit messages in the dashboard are the git hook. Glass built `experiments/glass-capability-brain` while the message said Ridge Pagoda
4. `live: false` on `get_project` is not the same as “no production URL.” Glass has a READY production deploy and a `.vercel.app` alias while `live` is still false

## Related

- [Vercel Root Directory hints](../deployment/vercel-root-directories.md)
- [steam-atlas never landed](./2026-09-08-steam-atlas-wrong-root.md)
- [quota burn](./2026-09-07-vercel-deploy-quota.md)

---

**Author**: Johnny Huynh  
**Last updated**: 2026-09-08
