# Incident: 2026-09-09 security hill-climb — no safe patch bumps

**Date**: 2026-09-09  
**Severity**: Low (dev-server advisories on one Vite 5 app; production static builds unchanged)  
**Status**: Documented — no lockfile / `package.json` edits. Majors parked on purpose.

---

## Summary

I ran `npm audit --json` against every experiment that already has a `package-lock.json` (27 graphs). I did **not** create Vercel projects, touch `vercel.json`, or redeploy.

**26 Vite 6 apps are clean.** Locks already pin `vite@6.4.3` (latest `6.4.x`; current security backport line), `postcss@8.5.28`, `react@19.2.8` / `react-dom@19.2.8` (latest `19.2.x`), `@vitejs/plugin-react@4.7.0` (latest `4.x`), `@react-three/drei@10.7.8`, `@react-three/fiber@9.7.0`. No patch-level bump exists for those directs.

The older-Vite / three / React hypothesis only holds for **blender-semicircle-viewer**. Everyone else is already on the patched Vite 6 line. `three@0.170.0` has no `0.170.x` patch and no GHSA on that release; jumping to `0.186.0` is a long minor, not a security patch.

## Audit

| Set | Result |
| --- | --- |
| 26 Vite `^6.0.1` apps (R3F set + steam-atlas + `ai-3d-lanes/web-3d`) | `npm audit` exit 0, 0 vulns |
| `experiments/explode-assembly` (`gltf-pipeline@4.3.1`, gltf-transform `^4.5.0`) | clean; those packages are already latest on their majors |
| `experiments/blender-semicircle-viewer` (`vite@5.4.21`, `three@0.160.1`) | 1 high + 1 moderate; **fix is a Vite major** |
| `experiments/web-physics` | `package.json` only — **no lockfile**, so no `npm audit` |
| `ai-image-texture`, `image-to-3d`, `llm-openscad` | Python / static HTML — no npm graph |

No experiment sets `server.host` / `--host`. The Vite findings below are still real on a LAN-exposed `npm run dev`, but they are not production-CDN issues.

## Blocker: blender-semicircle-viewer (Vite 5)

Locked `vite@5.4.21` is the last `5.4.x`. npm reports:

| Advisory | Severity | Notes |
| --- | --- | --- |
| [GHSA-4w7w-66w2-5vf9](https://github.com/advisories/GHSA-4w7w-66w2-5vf9) — `.map` path traversal | moderate | Range includes Vite `<=6.4.1`. Patched on `6.4.2+`. |
| [GHSA-v6wh-96g9-6wx3](https://github.com/advisories/GHSA-v6wh-96g9-6wx3) — `launch-editor` NTLMv2 on Windows | moderate | Range `<=6.4.2`. Patched on `6.4.3`. |
| [GHSA-fx2h-pf6j-xcff](https://github.com/advisories/GHSA-fx2h-pf6j-xcff) / CVE-2026-53571 — `server.fs.deny` Windows ADS / 8.3 | high | Range `<=6.4.2`. Patched on `6.4.3`. |
| [GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99) — esbuild `<=0.24.2` CORS | moderate | Transitive via Vite 5 (`esbuild@0.21.5`). |

`npm audit fix` wants **`vite@8.2.2`** (`isSemVerMajor: true`). The smallest major that actually receives these 2026 backports is **Vite 6.4.3**. Vite 5 is off the security-backport list.

I did **not** take that bump. This pass is patch-only. Semicircle is also a visual / framing app; I am not mixing a Vite 5→6 (or 5→8) migrate into a hill-climb that asked me to skip visual work.

`three@^0.160.0` (locked `0.160.1`) likewise has no `0.160.x` patch. `0.170.0` / `0.186.0` are later minors, not a security advisory fix.

## Skipped on purpose

| Change | Why skipped |
| --- | --- |
| Vite 6 → 7 / 8 on the clean apps | Major. `6.4` still gets security backports. Locks already on `6.4.3`. |
| Vite 5 → 6 or 8 on semicircle | Major + visual-app risk. Documented above. |
| `three` `0.170.0` → `0.186.0` (or semicircle `0.160` → `0.170`) | No GHSA; long minor. Peer risk with R3F / drei. |
| `@vitejs/plugin-react` `4.7.0` → `6.x` | Major. Latest `4.x` already locked. |
| Adding `package-lock.json` to web-physics | Hygiene, not a vuln fix. Next audit pass should generate one if I want this graph covered. |
| `vercel.json` / new Vercel projects | Not required. Hobby 25-link cap still applies. |

## What I would do next (not this PR)

1. Dedicated Vite 5→6 PR for semicircle only: `vite@^6.4.3`, keep `three@^0.160.0` unless the build forces a peer bump, then `npm run build` + the existing `node --test framing.test.js`.
2. Optional: `npm install --package-lock-only` in `experiments/web-physics` so the next audit can see that graph.

---

**Incident owner**: Johnny Huynh  
**Resolution**: No dependency files changed. This note is the record of a clean Vite 6 estate and one parked Vite 5 major.
