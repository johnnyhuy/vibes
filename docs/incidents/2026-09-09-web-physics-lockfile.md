# Incident: web-physics had no lockfile, so npm audit was blind

**Date**: 2026-09-09  
**Severity**: Low (hygiene — no advisory on the resolved graph)  
**Status**: Lockfile added. Graph is auditable. No deploys.

---

## Summary

`experiments/web-physics` shipped a `package.json` (`three@^0.170.0`, `cannon-es@^0.20.0`, `vite@^6.0.1`) and no `package-lock.json`. The 2026-09-09 security hill-climb ([PR #54](https://github.com/johnnyhuy/vibes/pull/54)) audited every experiment that already had a lockfile and had to skip this one. I am not inventing a new demo. I only closed that parked follow-up.

I did **not** create Vercel projects, touch `vercel.json`, or redeploy. Hobby is still at the 25-link cap, and deploy quota is rate-limited until ~2026-09-10 01:22 UTC.

## What I did

- `npm install` in `experiments/web-physics` from the existing ranges. `package.json` is unchanged.
- Locked: `vite@6.4.3` (same `6.4.x` security backport as the other Vite 6 apps), `three@0.170.0`, `cannon-es@0.20.0`, `postcss@8.5.28`.
- `npm audit` — exit 0, **0 vulnerabilities**. No patch bump required.
- `npm run build` — Vite 6.4.3 production build succeeded (chunk-size warning only; Three is fat, that is not new).

## Audit

| Check | Result |
| --- | --- |
| `npm audit` | exit 0, 0 info/low/moderate/high/critical |
| Safe patch on current majors | None needed — lock already matches the Vite 6 estate (`6.4.3`) |
| Majors | Not taken. `three@0.170.0` still has no GHSA; `0.186.0` is a long minor |

## Related

- [PR #54](https://github.com/johnnyhuy/vibes/pull/54) — parked this lockfile on purpose (audit note is on that branch)
- [web-physics](../../experiments/web-physics/)

---

**Incident owner**: Johnny Huynh  
**Resolution**: `package-lock.json` is in-tree. Next audit pass can see this graph. Do not redeploy.
