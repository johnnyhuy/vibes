# vibes

Kitchen sink monorepo for Johnny Huynh's AI-tool learning experiments.

**⚠️ Disclaimer:** Research & education only. Not production code. Experiments may be rough, incomplete, or whimsical.

## What's Inside

This is a loosely organised collection of small experiments exploring AI-assisted development tools, workflows, and capabilities.

### Structure

```
vibes/
├── experiments/           # Individual experiment packs
│   └── ai-3d-lanes/      # AI-assisted 3D workflows (first experiment)
└── ...                    # More experiments to come
```

## Current Experiments

### [AI 3D Lanes](./experiments/ai-3d-lanes/)

Four parallel lanes exploring AI-assisted 3D content creation:

1. **web-3d** — Interactive Three.js exploded assembly viewer
2. **blender** — Blender MCP scripting & automation
3. **cad** — Parametric CAD with CadQuery
4. **mesh-gen** — Generative 3D mesh services (docs & stubs)

See the [experiment README](./experiments/ai-3d-lanes/README.md) for details.

---

### [Web Physics](./experiments/web-physics/)

Interactive browser-based physics simulation using Three.js and cannon-es.

**What**: Real-time rigid body dynamics playground — click to spawn boxes, press Space for spheres, watch gravity and collisions in action.

**Why**: Demonstrates code-first approach to physics simulations that AI agents can generate programmatically. Ideal for training data generation, interactive prototyping, and sim-to-real transfer.

```bash
cd experiments/web-physics
npm install && npm run dev
```

---

### [AI Image & Texture](./experiments/ai-image-texture/)

Comprehensive documentation and workflow stubs for AI image generation services.

**What**: Provider comparison (Flux, DALL·E, Midjourney, Stable Diffusion, Ideogram, Meshy Texture, Polycam, Firefly) with dry-run client demonstrating API patterns.

**Why**: Shows how image/texture generation feeds 3D pipelines — generate concept art, create PBR textures, integrate with Blender and web-3d workflows.

```bash
cd experiments/ai-image-texture
python image_client.py  # Dry-run mode, no API key needed
open viewer.html        # View procedural texture placeholder
```

---

### [LLM + OpenSCAD](./experiments/llm-openscad/)

Text-to-CAD using LLMs to generate parametric OpenSCAD code.

**What**: Example .scad files (bracket, enclosure, gear) plus prompt templates for effective LLM CAD generation.

**Why**: Code-first CAD that's LLM-friendly, versionable, and parametric. Perfect for functional parts where mesh generation fails (exact dimensions, tolerances, manufacturing constraints).

```bash
cd experiments/llm-openscad
python generate_part.py                        # Run examples
openscad -o out.stl examples/bracket.scad      # Export STL (if OpenSCAD installed)
```

## Adding New Experiments

1. Create `experiments/<experiment-name>/`
2. Add a clear README explaining what it does
3. Include setup/run instructions
4. Update this root README with a brief description

Keep it simple. Document what you learned. Ship working code over perfect code.

## Deployment

### web-3d Preview Deploys

The `web-3d` lane is configured for automatic Vercel preview deployments on every PR.

**Setup**:
1. Import `johnnyhuy/vibes` in Vercel
2. In Project Settings → Root Directory, set to `experiments/ai-3d-lanes/web-3d` (dashboard only; not in vercel.json)
3. Framework settings auto-detected from `experiments/ai-3d-lanes/web-3d/vercel.json`

See [web-3d/README.md](./experiments/ai-3d-lanes/web-3d/README.md#deploy-to-vercel) for detailed instructions.

## Licence

MIT — see [LICENSE](./LICENSE)
