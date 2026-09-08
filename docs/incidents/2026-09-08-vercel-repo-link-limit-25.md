# Incident: Vercel repo link cap (25) blocked `vibes-keel-hex`

**Date**: 2026-09-08  
**Severity**: Medium (blocks new git-linked projects, not runtime)  
**Status**: At Hobby cap — local-only for new experiments until Johnny frees a slot or upgrades to Pro

---

## Summary

Hobby team `johnnyhuy-dev` hit Vercel `repo_links_exceeded_limit` when I tried to create `vibes-keel-hex`. A GitHub repository cannot link to more than **25** Vercel projects on Hobby ([limits](https://vercel.com/docs/limits); [error](https://vercel.com/docs/errors/error-list#repository-connection-limitation)). The create failed. **No `vibes-keel-hex` project exists.**

This is a different limit from the 100 deploys/day Hobby quota. Waiting for `api-deployments-free-per-day` to reset does **not** free a repo-link slot.

## What failed

- **Error**: `repo_links_exceeded_limit` (API / dashboard)
- **Meaning**: this repo already has **25** git-linked projects — the Hobby cap
- **Attempt**: `create_git_project` for `vibes-keel-hex` (Root would have been `experiments/keel-hex`)
- **Result**: create rejected. No project id. No Root Directory. No production

Pro raises the per-repo link cap to **150**. I am not upgrading from the agent.

## Effect

| App | State |
| --- | --- |
| **Keel Hex** (`experiments/keel-hex`) | On `main` (`cd32acd`). **No** `vibes-keel-hex`. Local-only. Future name stays `vibes-keel-hex`. |
| **Fairday Walk** | Separate PR in flight. Do not create `vibes-fairday-walk` (or any new link) from this repo until a slot exists. |
| **Ochre Gallop** (`experiments/ochre-gallop`) | Same rule. **No** `vibes-ochre-gallop`. Local-only. Future name stays `vibes-ochre-gallop`. |
| **Later experiments** | Same rule. New Vite apps stay local. `vercel.json` can still live in-repo; it cannot invent a project. |

Existing linked apps (explode, steam-atlas, glass, tower, the link-only kiln / cinder / alba / brine / breakwater set, and the rest already on the repo) are **unchanged**. This incident does not unlink them.

## Policy

1. **Do not call `create_git_project`** (or dashboard / CLI git-connect) against `johnnyhuy/vibes` until Johnny says a slot is free or the team is on Pro.
2. **New experiments stay local-only.** README Deploy sections must say the project does **not** exist when the create was blocked — do not write a fake `prj_…` or “link-only” lie.
3. **Do not casually unlink** an existing project to make room. Disconnect is Settings → Git (or `vercel git disconnect`). That is Johnny’s call. Agents must not delete, unlink, or pause projects to dodge the cap.
4. When a slot *is* freed (or Pro): future Keel Hex name is still **`vibes-keel-hex`**, dashboard Root Directory **`experiments/keel-hex`**. `create_git_project` still does not write Root Directory.

## What I did

- Documented the error and the 25-cap
- Rewrote Keel Hex Deploy so it names the missing project and the cap, not only the daily quota
- Left every Vercel project alone — no create, no delete, no unlink, no deploy

## Related

- [Vercel limits — projects connected per Git repository](https://vercel.com/docs/limits)
- [Repository connection limitation](https://vercel.com/docs/errors/error-list#repository-connection-limitation)
- [Quota incident](./2026-09-07-vercel-deploy-quota.md) — daily deploy burn; not this cap
- [README ↔ Vercel link-only drift](./2026-09-08-readme-vercel-link-only-drift.md)
- [Root Directory hints](../deployment/vercel-root-directories.md)
- [Keel Hex](../../experiments/keel-hex/)

---

**Incident owner**: Johnny Huynh  
**Resolution**: Wait for Johnny to unlink a project or upgrade to Pro. Then create `vibes-keel-hex` with Root `experiments/keel-hex` — not before.
