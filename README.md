# vibes

These are my kitchen-sink experiments exploring AI-assisted development. Research and education only — not production code.

I'm Johnny Huynh, and this monorepo is where I learn by building. Each experiment is self-contained, documented, and runnable.

## Experiments

### Interactive 3D Demos

#### [procedural-steam-atlas](./experiments/procedural-steam-atlas/)
Stylized locomotive built entirely from runtime TypeScript geometry functions — no .glb, .obj, or image assets required.

**What it is**: Vanilla Three.js + procedural geometry. Mechanical assembly (wheels, boiler, chassis, rivets) generated from primitives (cylinders, spheres, boxes) at runtime. Exploded view, part isolation, dark cinematic studio lighting. Inspired by [@Karthikvarmamkv's Steam Atlas](https://x.com/Karthikvarmamkv/status/2096904712511488420) and [@Craft3dApp](https://x.com/Craft3dApp/status/2096892270851346904).

**Run it**:
```bash
cd experiments/procedural-steam-atlas
npm install && npm run dev
```

**Live**: TBD — `vibes-steam-atlas` (`prj_7D08PT8sdUjhigCEuz83oltZrDMv`) is linked. Root **must** stay `experiments/procedural-steam-atlas`. No successful **production** deploy yet (one ERROR on a PR branch that lacked the folder; later previews built the right app; a `main` redeploy **CANCELED** `ignored-build-step` because that tip only touched japanese-tower). See [incident](./docs/incidents/2026-09-08-steam-atlas-wrong-root.md).

---

#### [explode-assembly](./experiments/explode-assembly/)
Interactive Tesla Model 3 exploded view demo — inspired by [@ashebytes' viral Model X explode](https://x.com/ashebytes/status/2096009146248122416) (334 pieces via GPT-6 Astra).

**What it is**: React + R3F + Three.js exploded assembly viewer. Multi-mesh GLB loader with explosion layout algorithm (2D grid packing). Uses David_Holiday's CC-BY-4.0 Tesla Model 3 from Sketchfab. See [ashemag/model-x-studio](https://github.com/ashemag/model-x-studio) for the pattern.

**Run it**:
```bash
cd experiments/explode-assembly
npm install && npm run dev
```

**Live**: [vibes-explode.vercel.app](https://vibes-explode.vercel.app) — PASS 2026-09-08 ~2:22am AEST (`dpl_ELE1f1XhqGQ7hciZSjkPVLMPmUh8` on `de25d60`). Skip the post-quota explode redeploy unless this goes stale again.

---

#### [earth-timeline](./experiments/earth-timeline/)
Interactive Earth history visualisation spanning 4.5 billion years. Drag the timeline from planetary formation to present day, watch the planet evolve from molten rock to vibrant blue-green.

**Stack**: React + R3F + drei. Procedural textures, orbital camera, cinematic dark UI.

**Run it**:
```bash
cd experiments/earth-timeline
npm install && npm run dev
```

**Live**: [vibes-earth.vercel.app](https://vibes-earth.vercel.app)

---

#### [v8-cutaway](./experiments/v8-cutaway/)
Technical V8 engine cutaway with proper 90° V-configuration, animated pistons, live gauges (RPM, stroke cycle, pressure), and speed control. Orbit to inspect, adjust speed slider to rev.

**Stack**: React + R3F + drei. Parametric geometry, kinematic animation, technical aesthetic.

**Run it**:
```bash
cd experiments/v8-cutaway
npm install && npm run dev
```

**Live**: [vibes-v8.vercel.app](https://vibes-v8.vercel.app)

---

#### [web-physics](./experiments/web-physics/)
Browser-based rigid body physics playground (Three.js + cannon-es). Drop cubes, spheres, and compound shapes into a physics-simulated world.

**Run it**:
```bash
cd experiments/web-physics
npm install && npm run dev
```

**Live**: [vibes-physics.vercel.app](https://vibes-physics.vercel.app)

---

### AI 3D Workflows

#### [ai-3d-lanes](./experiments/ai-3d-lanes/)
Four parallel approaches: **web-3d**, **blender** (MCP vs computer-use), **cad** (CadQuery), **mesh-gen** (docs + stubs).

#### [blender-semicircle-viewer](./experiments/blender-semicircle-viewer/)
Semicircular array of 51 laptop-like objects — demonstrates Blender MCP → Three.js workflow. Inspired by [Legendaryy's Blender MCP demo](https://x.com/Legendaryy/status/2096510965789422001). Camera is framed to the arc bounds so the full 180° reads as a visible semicircle (not a cropped mega-arc).

**Run it**:
```bash
cd experiments/blender-semicircle-viewer
npm install && npm run dev
```

**Live**: [vibes-blender-semicircle.vercel.app](https://vibes-blender-semicircle.vercel.app)

---

#### [scroll-product-showcase](./experiments/scroll-product-showcase/)
Scroll-driven glass bottle hero. Clean-room take on the pattern in [himanshubuildss' carafe](https://x.com/himanshubuildss/status/2096243989439713677) — refractive liquid, scroll rotation, interlocking copy. My mesh is a lathe I drew, not theirs.

**What it is**: React + R3F + drei. Horizontal dark-green lathe bottle, liquid volume, lime 3D type *behind* the glass, strip Lightformers. Native window scroll rolls the long axis. Chartreuse interlocking cards.

**Run it**:
```bash
cd experiments/scroll-product-showcase
npm install && npm run dev
```

**Live**: TBD — `vibes-scroll-product` (`prj_XLBiIlbjweejp9himT53bolPEMUW`) is linked with Root `experiments/scroll-product-showcase`. **Zero deployments** as of 2026-09-08. Sibling-folder commits skip this Root (`ignored-build-step`). First production after quota needs a commit that touches this folder.

---

#### [glass-capability-brain](./experiments/glass-capability-brain/)
Interactive capability map: frosted glass sphere, six orbiting nodes, HTML dock, live canvas pixel QA. Clean-room take on [@viewsfrom02108](https://x.com/viewsfrom02108/status/2094853472864682360). Light clinical stage — not Aether’s dark hero. Branding is mine (`Capability Map` / vibes); I am not Claude Fable.

**Stack**: React + R3F + drei. `MeshPhysicalMaterial` transmission. Keyboard `1`–`6` / Esc / idle tour.

**Run it**:
```bash
cd experiments/glass-capability-brain
npm install && npm run dev
```

**Live**: [vibes-glass-capability-brain.vercel.app](https://vibes-glass-capability-brain.vercel.app/) — **LIVE** `dpl_3CE9Dd7X7og5MuSLpcGgyxboacgz` on `9328191`. SSO off. Shipped on the japanese-tower merge; steam / scroll / semicircle did **not** move with it (`ignored-build-step`).

---

#### [japanese-tower](./experiments/japanese-tower/)
Procedural Ridge Pagoda with a **lift** (podium → scaffold → storeys → tiles → crown) plus season / day-night / weather / haze. Clean-room take on [@bharatmodi2014](https://x.com/bharatmodi2014/status/2096974996455444494). Branding is mine (`vibes · japanese tower` / 尾根); I did not copy their mesh, product name, or chrome.

**Stack**: React + R3F + drei. No .glb.

**Run it**:
```bash
cd experiments/japanese-tower
npm install && npm run dev
```

**Live**: TBD — project `vibes-japanese-tower` (`prj_T1KL4cJSMuY0Z6oKGnNtv8zVP0Js`) exists with Root `experiments/japanese-tower`, created `deploy: false`. **0 production** until after quota (~**2026-09-08 12:55 UTC**). Do not force a deploy on this PR.

---

#### [ballance-roll](./experiments/ballance-roll/)
Procedural rolling-marble course above an ocean of clouds. Clean-room take on [@fayazara](https://x.com/fayazara/status/2096997505397584041). Branding is mine (`Nimbus Path` / 霞); I did not copy their courses, HUD, or the *Ballance* wordmark.

**Stack**: React + R3F + drei + cannon-es. Wood / stone / metal contact feels. No .glb.

**Run it**:
```bash
cd experiments/ballance-roll
npm install && npm run dev
```

**Live**: TBD — **no Vercel project**. Do not create one on this PR.

---

### Image, texture & CAD

- [image-to-3d](./experiments/image-to-3d/) — image→mesh stubs
- [ai-image-texture](./experiments/ai-image-texture/) — image gen providers
- [llm-openscad](./experiments/llm-openscad/) — text→OpenSCAD

## Deployment (Vercel)

Each browser demo has its own Vercel project on this repo (Root Directory set in the dashboard). All demos are live on `main`.

> ⚠️ **Hobby quota exhausted** (`api-deployments-free-per-day` = **0 remaining**). Reset **~2026-09-08 12:55 UTC** (~10:55pm AEST). **Do not retry-spam deploys.** See [quota incident](./docs/incidents/2026-09-07-vercel-deploy-quota.md) and [Root Directory checklist](./docs/deployment/vercel-root-directories.md).
>
> **Redeploy order after reset** (one each): **skip explode** (fresh on `de25d60` / `dpl_ELE1f1XhqGQ7hciZSjkPVLMPmUh8`) → semicircle → steam-atlas (**confirm** Root Directory = `experiments/procedural-steam-atlas`) → scroll-product → japanese-tower. **Glass is already live** — skip it. Do not create `vibes-ballance-roll`.
>
> Production visual QA 2026-09-08 ~2:22–2:33am AEST: explode **PASS** @0% and @~76%; semicircle still FAIL on commit `25587f54`; steam-atlas + scroll-product `404 DEPLOYMENT_NOT_FOUND`. A later steam-atlas `main` redeploy **CANCELED** (`ignored-build-step`) — sibling-folder commits do not refresh production aliases. Glass is LIVE at [vibes-glass-capability-brain.vercel.app](https://vibes-glass-capability-brain.vercel.app/) (`9328191` / `dpl_3CE9Dd7X7og5MuSLpcGgyxboacgz`, SSO off). Evidence in [docs/visual-qa-2026-09-08-prod.md](./docs/visual-qa-2026-09-08-prod.md), [glass incident](./docs/incidents/2026-09-08-glass-auto-deploy-on-tower-merge.md), [steam-atlas incident](./docs/incidents/2026-09-08-steam-atlas-wrong-root.md). **Do not redeploy on this PR. Do not create a ballance-roll Vercel project.**

| App | Vercel project | Root Directory | Production URL | Status |
| --- | --- | --- | --- | --- |
| web-3d | `vibes` | `experiments/ai-3d-lanes/web-3d` | TBD | - |
| explode-assembly | `vibes-explode` (`prj_bkyEqYqsAhAk0ZrVnhXi9Him98Fb`) | `experiments/explode-assembly` | [vibes-explode.vercel.app](https://vibes-explode.vercel.app) | ✅ PASS 2026-09-08 ~2:22am AEST (`dpl_ELE1f1XhqGQ7hciZSjkPVLMPmUh8` on `de25d60`). Skip after quota unless stale again. |
| earth-timeline | `vibes-earth` | `experiments/earth-timeline` | [vibes-earth.vercel.app](https://vibes-earth.vercel.app) | ✅ |
| v8-cutaway | `vibes-v8` | `experiments/v8-cutaway` | [vibes-v8.vercel.app](https://vibes-v8.vercel.app) | ✅ |
| web-physics | `vibes-physics` | `experiments/web-physics` | [vibes-physics.vercel.app](https://vibes-physics.vercel.app) | ✅ |
| blender-semicircle-viewer | `vibes-blender-semicircle` (`prj_PLhnoCVRKmpHc8SxyLRmcp3MFZMC`) | `experiments/blender-semicircle-viewer` | [vibes-blender-semicircle.vercel.app](https://vibes-blender-semicircle.vercel.app) | ⚠️ FAIL 2:33am: cropped mega-arc. Production still `25587f54`. **#1** after quota: one `main` redeploy |
| procedural-steam-atlas | `vibes-steam-atlas` (`prj_7D08PT8sdUjhigCEuz83oltZrDMv`) | **`experiments/procedural-steam-atlas` (confirm in the dashboard before any deploy)** | `404 DEPLOYMENT_NOT_FOUND` | ⚠️ Last `main` redeploy **CANCELED** `ignored-build-step`. **#2** after quota: confirm Root, then one `main` deploy from a commit that touches this folder |
| scroll-product-showcase | `vibes-scroll-product` (`prj_XLBiIlbjweejp9himT53bolPEMUW`) | `experiments/scroll-product-showcase` | none | Linked, **0 deployments**. Sibling commits skip (`ignored-build-step`). **#3** first production after a Root-touching merge |
| glass-capability-brain | `vibes-glass-capability-brain` (`prj_yJbQTsiB138V5jh92cwSWd8rZmij`) | `experiments/glass-capability-brain` | [vibes-glass-capability-brain.vercel.app](https://vibes-glass-capability-brain.vercel.app/) | ✅ **LIVE** `dpl_3CE9Dd7X7og5MuSLpcGgyxboacgz` on `9328191`. SSO off. Skip after quota. |
| japanese-tower | `vibes-japanese-tower` (`prj_T1KL4cJSMuY0Z6oKGnNtv8zVP0Js`) | `experiments/japanese-tower` | none | Created `deploy: false`. **0 production**. **#4** after quota (glass already live). |
| ballance-roll | — | `experiments/ballance-roll` (when a project exists) | none | **No Vercel project.** Local build only. Do not create one on this PR. |

PR previews show up as Vercel bot comments on each pull request (when quota available).

## Documentation

See [./docs](./docs/) for:
- **Architecture Decision Records (ADRs)** — Why the monorepo is structured this way
- **Reverse Engineering Notes** — Clean-room analysis of public patterns (e.g., ashemag's Model X explode)
- **Incidents & Lessons** — Things that went sideways and what I learnt

## Disclaimer

**Research and education only.** Rough, incomplete, or whimsical. Not production. I'm learning in public.

## Licence

MIT — see [LICENSE](./LICENSE)
