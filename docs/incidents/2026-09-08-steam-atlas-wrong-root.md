# Incident: steam-atlas Production Never Landed (Root-On-Branch + Monorepo Fan-Out)

**Date**: 2026-09-07 → 2026-09-08  
**Component**: Vercel project `vibes-steam-atlas` (`prj_7D08PT8sdUjhigCEuz83oltZrDMv`)  
**Severity**: Medium (no production URL; previews exist; quota burned)  
**Status**: Waiting for hobby quota reset (~2026-09-08 12:55 UTC). Do not retry-spam.

I verified this against the Vercel API on 2026-09-08 (~14:10 UTC). I did **not** create or redeploy anything.

---

## What I Thought At First

Dashboard noise looks like “Root Directory is missing, so every monorepo PR built the wrong experiment.” Commit messages on steam-atlas deployments are scroll-product, explode, semicircle. One production ERROR, later READY previews, `live: false`.

That hunch is **half right**. The project *does* eat every monorepo PR. A later `create_git_project` **reuse** of `vibes-steam-atlas` with `deploy: false` did **not** write or fix Root Directory. There is still **no live production**. Treat Root as **misconfigured until I set it in the dashboard** — do not trust MCP create/reuse to persist it.

---

## What The API Actually Says

### Project

- Name: `vibes-steam-atlas`
- Id: `prj_7D08PT8sdUjhigCEuz83oltZrDMv`
- `framework`: null
- `live`: **false**
- Production domain: none that I can treat as a successful ship
- `get_project` does **not** return the Root Directory field — so the dashboard can look empty even when a root is set

### Production (the only `target: "production"` row)

- Deployment `dpl_8aug69952Cii9bHQwz54nHwZgq2K`
- Branch: `cursor/scroll-product-hero-94f9` (PR #10, commit `bb53fdc`)
- State: **ERROR**
- Code: `NOW_SANDBOX_WORKER_ROOTDIR_NOT_EXIST`
- Message: `The specified Root Directory "experiments/procedural-steam-atlas" does not exist. Please update your Project Settings.`

So Root Directory **was already** `experiments/procedural-steam-atlas`. The *branch* did not contain that folder (PR #10 was cut before steam-atlas landed on that line of history). Vercel cloned the PR branch, looked for the configured root, and died in `build-container-init`.

### Later previews (look “wrong”, built the right app)

| Deploy | Trigger commit | Built |
| --- | --- | --- |
| `dpl_75YKdK6USAzrh2n8dTjJJY1ftp2h` READY | explode ordered-gallery PR #12 | `procedural-steam-atlas@1.0.0` / `vite build` |
| `dpl_8GgW9zQZRVKBbv6asW1RtJtU1j56` READY | semicircle framing PR #15 | `procedural-steam-atlas@1.0.0` / `vite build` |

Commit messages in the Vercel list are the **git hook**, not the app. Once the folder exists on the branch, this project builds steam-atlas correctly.

---

## Why This Matters

1. **A project with a Root Directory still deploys on every push** to the linked repo. Eight hobbies × each Cloud Agent commit is how we hit 100/day.
2. **A Root Directory that is unset** (or pointed at `.`) will try to build the monorepo root. There is no root `package.json`. That is a 404/ERROR factory. Confirm the dashboard field after quota reset — do not clear it.
3. **A Root Directory that is set, on a branch that lacks the folder**, is the ERROR we already have. Production from an old PR branch will never go READY.
4. **`vercel.json` cannot pin Root Directory.** I can only document it and set `ignoreCommand` so *this folder* no-ops when it did not change. Skipped builds may still count toward the hobby deployment cap.
5. **`create_git_project` reuse + `deploy: false` does not change Root Directory.** I tried to reuse `vibes-steam-atlas` without burning a deploy. The project id stayed `prj_7D08PT8sdUjhigCEuz83oltZrDMv`. Root did not move. `live` stayed `false`. Do not treat reuse as a settings write.
6. **Pause is not available on hobby.** The Pause API returned **400** for this project. I cannot pause steam-atlas to stop monorepo fan-out. The only brakes are: correct Root in the dashboard, `ignoreCommand` in this folder, and not pushing.

---

## What I Changed In-Repo

- `experiments/procedural-steam-atlas/vercel.json` — Vite hints + `ignoreCommand: git diff --quiet HEAD^ HEAD ./`
- `docs/deployment/vercel-root-directories.md` — dashboard checklist for every app
- Root README table — steam-atlas: linked, **0 production READY**, Root must stay `experiments/procedural-steam-atlas`

I did not add a monorepo-root `vercel.json`. That would fight the other seven projects.

---

## After Quota Resets (~2026-09-08 12:55 UTC)

One production deploy from **`main`** (the folder exists there — `03bbe0c` and later).

**Before any deploy**, dashboard → `vibes-steam-atlas` → Settings → Root Directory = **`experiments/procedural-steam-atlas`**. MCP reuse did not do this. Then:

1. Deploy `main` **once**
2. Stop. Do not retry on preview aliases. Do not call pause (400 on hobby).

**Visual QA 2026-09-08 ~12:29 AEST** (`hill-climb/prod-steam-atlas-20260908-0007.png`): production alias is a Vercel error page —

```
404: NOT_FOUND
Code: 'DEPLOYMENT_NOT_FOUND'
ID: 'cle1::9v97r-1788791283597-26c58b48753f'
```

That is the user-facing version of `live: false`. Do not retry now. After quota reset: **set dashboard Root = `experiments/procedural-steam-atlas`**, then one `main` deploy. If it 404s again, Root is still wrong — set it and allow **one** retry.

---

## Related

- [2026-09-07 Vercel deploy quota](./2026-09-07-vercel-deploy-quota.md)
- [ADR-0001](../adr/0001-monorepo-and-vercel-per-app.md)
- [docs/deployment/vercel-root-directories.md](../deployment/vercel-root-directories.md)

---

**Incident owner**: Johnny Huynh  
**Resolution**: Confirm Root + one `main` production deploy after reset
