# Production Visual QA — 2026-09-08 ~12:07–12:29 AEST

I captured four production URLs. **All four FAIL.** This is not a code bug on `main` (`03bbe0c`). It is stale / missing production deploys behind the hobby quota. I am **not** redeploying. Quota resets ~**2026-09-08 12:55 UTC**.

Stills (agent thread; names below):

| File | URL | Verdict |
| --- | --- | --- |
| `hill-climb/prod-explode-0-20260908-0007.png` | [vibes-explode.vercel.app](https://vibes-explode.vercel.app) @ 0% | FAIL |
| `hill-climb/prod-explode-80-20260908-0007.png` | same @ ~81% | FAIL |
| `hill-climb/prod-semicircle-20260908-0007.png` | [vibes-blender-semicircle.vercel.app](https://vibes-blender-semicircle.vercel.app) | FAIL |
| `hill-climb/prod-steam-atlas-20260908-0007.png` | steam-atlas production alias | FAIL — `404 DEPLOYMENT_NOT_FOUND` |

---

## 1. explode @ 0% — grey room, not assembled

**Expected on `main` (#12)**: black studio, frosted UI, Model 3 **assembled** at 0%, ordered gallery when exploded.

**What I saw**:

- Bright **grey** room, black floor grid, white vertical slabs (old tesla-3d-showcase set)
- Sidebar + explode pill are **opaque** dark panels, not frosted glass
- Slider at **0% / Assembled**
- Body is **fragmented white shells** floating apart; tyres off the chassis

That is the pre-#12 (and pre-mesh-filter) world. One `main` redeploy of `vibes-explode` is **#1** after quota reset.

## 2. explode @ ~81% — clipped / unreadable

**Expected**: ordered gallery — parts packed in a readable grid by system.

**What I saw**:

- Same grey void
- Slider **81%**
- **No readable car / no ordered gallery** — viewport is empty or clipped
- Same opaque old pill

Confirms production is not running the ordered-gallery layout from #12. Same one redeploy as above. Do not burn a second explode deploy.

## 3. semicircle — cropped mega-arc, nearly black

**Expected on `main` (`5941e259` / `03bbe0c`)**: 51 laptops readable as a 180° semicircle, bbox-framed, lit.

**What I saw**:

- Pitch black stage
- A **faint vertical curve** (one sliver of a huge cropped arc)
- Individual laptops unreadable
- UI chrome is the current titles/buttons — the **camera/lighting on prod is the old hardcoded seat**

Code fix is already on `main`. Production is not. One `main` redeploy of `vibes-blender-semicircle` is **#2**.

## 4. steam-atlas — 404 DEPLOYMENT_NOT_FOUND

**What I saw** (Vercel error page):

```
404: NOT_FOUND
Code: 'DEPLOYMENT_NOT_FOUND'
ID: 'cle1::9v97r-1788791283597-26c58b48753f'
```

No locomotive. No production HTML. Matches `live: false` on `prj_7D08PT8sdUjhigCEuz83oltZrDMv`.

**Before** the first deploy: dashboard Root Directory = **`experiments/procedural-steam-atlas`**. `create_git_project` reuse did not write this. Then one `main` production deploy. That is **#3**.

---

## What I am not doing

- No Vercel redeploy, no `vercel --prod`, no extra projects
- No pause (400 on hobby)
- No code change to explode/semicircle in this PR — `main` already has the fixes

## Redeploy order (after ~2026-09-08 12:55 UTC)

One each. Stop.

1. `vibes-explode` — `main` (#12 black studio + ordered gallery). Pass when 0% is a whole car on black, 80% is a readable ordered grid.
2. `vibes-blender-semicircle` — production alias still serves old commit `25587f54`. One `main` redeploy for bbox framing. Pass when all 51 laptops read as a 180° arc.
3. `vibes-steam-atlas` — **set Root first**, then `main`. Pass when the locomotive page loads (not `DEPLOYMENT_NOT_FOUND`).
4. `vibes-scroll-product` — first production after #16 merges. Pass when Aether is the horizontal dark-green bottle, not a torus knot.

## Related

- [quota incident](./incidents/2026-09-07-vercel-deploy-quota.md)
- [steam-atlas root / fan-out](./incidents/2026-09-08-steam-atlas-wrong-root.md)
- [semicircle cropped mega-arc](./incidents/2026-09-07-semicircle-cropped-mega-arc.md) — fixed in git; prod still FAIL
- [Root Directory checklist](./deployment/vercel-root-directories.md)

---

## Hill-climb note — 2026-09-08 ~2:22am AEST

I am not redeploying. Quota is still 0 until ~**2026-09-08 12:55 UTC**.

Verified just now (read-only Vercel + git):

- `main` is `de25d60` — **glass-capability-brain (#17) is merged**
- No open PRs
- `vibes-explode` latest production deploy is READY — may finally be on current `main`; still needs a human framing pass after quota if the 12:07 AEST stills were stale
- `vibes-blender-semicircle` production alias still on old commit **`25587f54`** until a post-quota `main` redeploy
- `vibes-steam-atlas` `live: false`, last deploy CANCELED, production alias still no good HTML (`DEPLOYMENT_NOT_FOUND` class)
- `vibes-scroll-product` `live: false`, last production-targeted deploy CANCELED — still no good production
- `vibes-glass-capability-brain` (`prj_yJbQTsiB138V5jh92cwSWd8rZmij`) created with Root `experiments/glass-capability-brain` and `deploy: false` — **0 production**. Optional #5 after the four above
- **japanese-tower** is local-only on this hill-climb. I am **not** creating a Vercel project

Redeploy order after reset is unchanged: explode → semicircle → steam-atlas (Root **must** be `experiments/procedural-steam-atlas`) → scroll-product → optionally glass.

### Later the same night

I added a lift axis (scaffold / storeys / roofs) so the tower matches the thumb’s growth *read*. Still no deploys.

---

**Captured**: 2026-09-08 ~12:07–12:29 AEST  
**Hill-climb addendum**: 2026-09-08 ~2:22am AEST  
**Author**: Johnny Huynh  
**Action**: Wait for quota. Then the four deploys above. No more.
