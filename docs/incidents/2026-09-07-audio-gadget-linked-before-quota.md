# Incident: Audio-gadget project linked before quota reset

**Date**: 2026-09-07  
**Time**: project created this hour; hobby quota still **0 remaining** until ~2026-09-08 12:55 UTC  
**Severity**: Low (docs / ops, not runtime)  
**Status**: Linked, no production — do not redeploy until after quota

---

## Summary

`vibes-audio-gadget-spin` (`prj_N57mvThg4UcU9XxLK3F5wAICz9PA`) was created with `deploy: false` while `johnnyhuy-dev` still has **0** `api-deployments-free-per-day`. That is the right kind of create — it does **not** burn a production slot — but it also does **not** ship Lumen Cuff.

Root Directory is still **dashboard-owned**. `create_git_project` does not write it. `vercel.json` inside `experiments/audio-gadget-spin/` cannot write it either. If Root is blank, the first real deploy builds the repo root and fails.

## What I did

- Recorded the project id and the intended Root: `experiments/audio-gadget-spin`
- Left production alone. No dashboard Redeploy. No CLI `--prod`
- Did **not** create projects for `procedural-grass-field`, `ballance-roll`, or `chinese-courtyard`

## What I will do after ~2026-09-08 12:55 UTC

1. Confirm dashboard Root Directory is `experiments/audio-gadget-spin`
2. Then, and only then, consider a first production — **after** the ordered jobs: `vibes-blender-semicircle` (still `25587f54`) then `vibes-scroll-product` first READY
3. Skip explode / steam / japanese-tower / glass unless a later visual QA says they broke

Until that confirm, treat audio-gadget as **linked, not live**.

## Related

- [Vercel Root Directory hints](../deployment/vercel-root-directories.md)
- [Quota incident](./2026-09-07-vercel-deploy-quota.md)
- [steam-atlas wrong Root](./2026-09-08-steam-atlas-wrong-root.md) — same “create ≠ Root” lesson
- [audio-gadget experiment](../../experiments/audio-gadget-spin/)

---

**Incident owner**: Johnny Huynh  
**Resolution**: Wait for quota + confirm Root + one deploy, in order
