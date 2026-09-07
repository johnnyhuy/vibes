# vibes

These are my kitchen-sink experiments exploring AI-assisted development. Research and education only — not production code.

I'm Johnny Huynh, and this monorepo is where I learn by building. Each experiment is self-contained, documented, and runnable.

## Experiments

### Interactive 3D Demos

#### [explode-assembly](./experiments/explode-assembly/)
Interactive car exploded view demo — ashemag-style with real GLB support. Inspired by [this X post](https://x.com/ashebytes/status/1831768826242351397).

**What it is**: React + R3F + Three.js exploded assembly viewer. Multi-mesh GLB loader with explosion layout algorithm (2D grid packing like ashemag's). Includes procedural fallback when no GLB present. Load your own CC-BY car at `/models/car.glb`.

**Run it**:
```bash
cd experiments/explode-assembly
npm install && npm run dev
```

**How to get a multi-part car**: Download CC-BY models from WolfGames36 on Sketchfab or BlendKit Royalty Free. See README for instructions.

---

#### [earth-timeline](./experiments/earth-timeline/)
Interactive Earth history spanning 4.5 billion years.

**Run it**:
```bash
cd experiments/earth-timeline
npm install && npm run dev
```

---

#### [v8-cutaway](./experiments/v8-cutaway/)
Technical engine visualisation with live gauges.

**Run it**:
```bash
cd experiments/v8-cutaway
npm install && npm run dev
```

---

#### [web-physics](./experiments/web-physics/)
Browser-based rigid body physics playground (Three.js + cannon-es).

**Run it**:
```bash
cd experiments/web-physics
npm install && npm run dev
```

---

### AI 3D Workflows

#### [ai-3d-lanes](./experiments/ai-3d-lanes/)
Four parallel approaches: **web-3d**, **blender** (MCP vs computer-use), **cad** (CadQuery), **mesh-gen** (docs + stubs).

---

### Image, texture & CAD

- [image-to-3d](./experiments/image-to-3d/) — image→mesh stubs
- [ai-image-texture](./experiments/ai-image-texture/) — image gen providers
- [llm-openscad](./experiments/llm-openscad/) — text→OpenSCAD

## Deployment (Vercel)

Each browser demo has its own Vercel project on this repo (Root Directory set in the dashboard). PR previews show up as Vercel bot comments on the PR.

| App | Vercel project | Root Directory |
| --- | --- | --- |
| web-3d | `vibes` | `experiments/ai-3d-lanes/web-3d` |
| explode-assembly | `vibes-explode` | `experiments/explode-assembly` |
| earth-timeline | `vibes-earth` | `experiments/earth-timeline` |
| v8-cutaway | `vibes-v8` | `experiments/v8-cutaway` |
| web-physics | `vibes-physics` | `experiments/web-physics` |

Stable branch preview host pattern:
`https://<project>-git-cursor-ai-3d-lanes-monorepo-90aa-johnnyhuy-dev.vercel.app`

Production URLs go live after this PR merges to `main`.

## Disclaimer

**Research and education only.** Rough, incomplete, or whimsical. Not production. I'm learning in public.

## Licence

MIT — see [LICENSE](./LICENSE)
