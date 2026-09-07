# Production Visual QA — 2026-09-08

Quota still resets ~**2026-09-08 12:55 UTC**. I am **not** redeploying on this hill-climb.

## Latest — courtyard hill-climb (API + HTML fetch)

I checked Vercel on 2026-09-08 after `main` `a94b16e`. I did **not** open a headed browser on the production canvases.

| Surface | Verdict | Notes |
| --- | --- | --- |
| [vibes-explode.vercel.app](https://vibes-explode.vercel.app) | **PASS** (earlier stills) | `dpl_ELE1f1XhqGQ7hciZSjkPVLMPmUh8` on `de25d60`. Skip. |
| [vibes-blender-semicircle.vercel.app](https://vibes-blender-semicircle.vercel.app) | **FAIL** (stills) / HTML current | Production alias still commit `25587f54`. HTML title is the semicircle app. I cannot visually confirm framing this pass. |
| [vibes-steam-atlas.vercel.app](https://vibes-steam-atlas.vercel.app) | **HTML READY** | `dpl_98Yz1BpRLivVxs63SuV4UFb7Z9WS` on `a94b16e`. Status 200. Title **Procedural Steam Atlas**. I did **not** confirm the locomotive canvas. |
| scroll-product production alias | **FAIL** | No READY production. One CANCELED hook only. |
| [vibes-glass-capability-brain.vercel.app](https://vibes-glass-capability-brain.vercel.app/) | **LIVE** | `dpl_3CE9Dd7X7og5MuSLpcGgyxboacgz` on `9328191`. SSO off. Skip. |
| japanese-tower | **none** | Project `prj_T1KL4cJSMuY0Z6oKGnNtv8zVP0Js` exists. **0 deployments**. |
| ballance-roll / chinese-courtyard | **none** | No Vercel projects. Local only. |

### Redeploy order after ~12:55 UTC

One each. Stop.

1. **Skip** `vibes-explode`
2. `vibes-blender-semicircle` — one `main` redeploy (replace `25587f54`)
3. `vibes-steam-atlas` — confirm Root and the locomotive alias; skip if `dpl_98Yz1BpRLivVxs63SuV4UFb7Z9WS` still reads right
4. `vibes-scroll-product` — first READY production
5. `vibes-japanese-tower` — first production
6. Glass — **already live**. Do not create `vibes-ballance-roll` or a courtyard project.

## Earlier — ~2:22–2:33am AEST (supersedes the morning explode FAIL)

Stills: `prod-explode-0-20260908-0222.png`, `prod-explode-80-20260908-0222.png`.

| Surface | Verdict | Notes |
| --- | --- | --- |
| [vibes-explode.vercel.app](https://vibes-explode.vercel.app) @ 0% | **PASS** | Black studio, assembled Model 3, frosted **MODEL 3** UI |
| same @ ~76% | **PASS** | Ordered gallery |
| [vibes-blender-semicircle.vercel.app](https://vibes-blender-semicircle.vercel.app) | **FAIL** | Cropped mega-arc — thin blue curve on black. Production still commit `25587f54` |
| steam-atlas production alias | **FAIL at 2:33am** | Then `404 DEPLOYMENT_NOT_FOUND`. Later `main` redeploy **CANCELED** `ignored-build-step`. **Superseded:** READY on `a94b16e` / `dpl_98Yz1BpRLivVxs63SuV4UFb7Z9WS` (see Latest). |
| scroll-product production alias | **FAIL** | `404 DEPLOYMENT_NOT_FOUND` |

**explode production** is `dpl_ELE1f1XhqGQ7hciZSjkPVLMPmUh8` on `main` `de25d60`. Skip explode after quota unless it goes stale again.

**glass**: [vibes-glass-capability-brain.vercel.app](https://vibes-glass-capability-brain.vercel.app/) production READY `dpl_3CE9Dd7X7og5MuSLpcGgyxboacgz` on `9328191`. SSO off. Shipped on the tower merge — [incident](./incidents/2026-09-08-glass-auto-deploy-on-tower-merge.md).

**japanese-tower**: project `vibes-japanese-tower` (`prj_T1KL4cJSMuY0Z6oKGnNtv8zVP0Js`) exists, Root set, **0 production**.

### Redeploy order after ~12:55 UTC

One each. Stop.

1. **Skip** `vibes-explode` — already fresh on `de25d60` unless a later check goes stale
2. `vibes-blender-semicircle` — one `main` redeploy (replace `25587f54`)
3. `vibes-steam-atlas` — READY on `a94b16e` / `dpl_98Yz1BpRLivVxs63SuV4UFb7Z9WS`. Confirm Root and the locomotive alias. Skip if it still reads right.
4. `vibes-scroll-product` — first READY production
5. `vibes-japanese-tower` — first production (project exists; `deploy: false`; 0 deployments)
6. Glass — **already live**. Do not spend a slot. Do not create `vibes-ballance-roll` or a courtyard project.

Do not spam deploys.

---

## Morning — ~12:07–12:29 AEST (historical)

I captured four production URLs. **All four FAIL at that hour.** That was stale / missing production, not a code bug on then-`main` (`03bbe0c`). The ~2:22am pass above updates explode only.

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

That was the pre-#12 world at noon. **Superseded at ~2:22am AEST** — explode production is now PASS on `dpl_ELE1f1XhqGQ7hciZSjkPVLMPmUh8`.

## 2. explode @ ~81% — clipped / unreadable

**Expected**: ordered gallery — parts packed in a readable grid by system.

**What I saw**:

- Same grey void
- Slider **81%**
- **No readable car / no ordered gallery** — viewport is empty or clipped
- Same opaque old pill

That noon still was empty. **Superseded at ~2:22am** — ~76% is an ordered gallery. Do not burn another explode deploy.

## 3. semicircle — cropped mega-arc, nearly black

**Expected on `main` (`5941e259` / `03bbe0c`)**: 51 laptops readable as a 180° semicircle, bbox-framed, lit.

**What I saw**:

- Pitch black stage
- A **faint vertical curve** (one sliver of a huge cropped arc)
- Individual laptops unreadable
- UI chrome is the current titles/buttons — the **camera/lighting on prod is the old hardcoded seat**

Code fix is already on `main`. Production is still `25587f54` at 2:33am (thin blue curve on black). First real post-quota job.

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
- No `vibes-ballance-roll` or courtyard Vercel project
- No code change to explode/semicircle — explode prod is already `de25d60`; semicircle fix is on `main` and waiting

## Redeploy order (after ~2026-09-08 12:55 UTC)

See the **Latest** table at the top. Explode is skipped. Semicircle is first.

## Related

- [quota incident](./incidents/2026-09-07-vercel-deploy-quota.md)
- [steam-atlas root / fan-out](./incidents/2026-09-08-steam-atlas-wrong-root.md)
- [semicircle cropped mega-arc](./incidents/2026-09-07-semicircle-cropped-mega-arc.md) — fixed in git; prod still FAIL
- [Root Directory checklist](./deployment/vercel-root-directories.md)

---

---

**Morning capture**: 2026-09-08 ~12:07–12:29 AEST  
**2:22am QA**: explode PASS; semicircle FAIL `25587f54`  
**Courtyard-pass QA**: steam HTML READY `a94b16e` / `dpl_98Yz1BpRLivVxs63SuV4UFb7Z9WS`; canvas not screenshot  
**Author**: Johnny Huynh  
**Action**: Wait for quota. Skip explode. Semicircle first. Confirm steam. Then scroll → tower. No ballance or courtyard project.
