# Incident: blender-semicircle-viewer left Vite 5

**Date**: 2026-09-09  
**Severity**: Low (dev-server advisories; production static build unchanged)  
**Status**: Fixed in this PR — Vite 5 → 6.4.x on the only dirty npm graph

---

## Summary

The [2026-09-09 estate audit](https://github.com/johnnyhuy/vibes/pull/54) (`docs/incidents/2026-09-09-security-dep-audit.md` on that PR; not on `main` yet) left **blender-semicircle-viewer** on `vite@5.4.21` on purpose. That graph was the only dirty lockfile: 1 high + 1 moderate. `npm audit fix` wanted **Vite 8.2.2**. Vite 5 is off the 2026 backport list. The smallest real fix is **Vite 6.4.3**, which is already what the other 26 Vite apps lock.

I took that bump here. Nothing else in the estate moved. I did **not** create Vercel projects, touch `vercel.json`, or redeploy (Hobby 25-link cap; daily quota until ~2026-09-09 23:35 UTC).

## What I changed

| File | Change |
| --- | --- |
| `experiments/blender-semicircle-viewer/package.json` | `vite` `^5.0.0` → `^6.4.3` |
| `experiments/blender-semicircle-viewer/package-lock.json` | `npm install` in that folder only |
| `three` | Still `^0.160.0` (locked `0.160.1`). Vite 6 has no three peer. I did not bump it. |

No `vite.config.js`. No `@vitejs/plugin-react`. This app is vanilla Three.js, so the Vite 5→6 migrate did not need a plugin or config rewrite.

## Advisories this closes

Same set as the audit note. Patched on `6.4.3`:

| Advisory | Severity |
| --- | --- |
| [GHSA-4w7w-66w2-5vf9](https://github.com/advisories/GHSA-4w7w-66w2-5vf9) — `.map` path traversal | moderate (`<=6.4.1`) |
| [GHSA-v6wh-96g9-6wx3](https://github.com/advisories/GHSA-v6wh-96g9-6wx3) — `launch-editor` NTLMv2 on Windows | moderate (`<=6.4.2`) |
| [GHSA-fx2h-pf6j-xcff](https://github.com/advisories/GHSA-fx2h-pf6j-xcff) / CVE-2026-53571 — `server.fs.deny` Windows ADS / 8.3 | high (`<=6.4.2`) |
| [GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99) — esbuild `<=0.24.2` CORS | moderate (Vite 5 pulled `esbuild@0.21.5`) |

I did **not** jump to Vite 7 or 8. `6.4` still gets the security backports.

## What I left alone

- Framing / `framing.js` / visual pose — not this PR
- Other experiments
- Root `vercel.json` and this app’s `vercel.json`
- Production / preview deploys
- `three` minor (`0.160` → `0.170` / `0.186`) — no GHSA; not required for Vite 6

## Verify

Ran in `experiments/blender-semicircle-viewer` after the lockfile refresh:

| Check | Result |
| --- | --- |
| `npm run build` | `vite v6.4.3` — 7 modules, `dist/` written |
| `node --test framing.test.js` | 5/5 pass (load, bowl seat, portrait, orbit, empty points) |
| `npm audit` | 0 vulnerabilities |

No Vite 6 config breakage. Framing math is unchanged.

---

**Incident owner**: Johnny Huynh  
**Resolution**: Semicircle is on the same Vite 6.4.x backport line as the rest of the estate. The audit PR (#54) stays docs-only; this PR is the parked major.
