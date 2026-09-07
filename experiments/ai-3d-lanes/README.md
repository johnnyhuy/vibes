# AI 3D Lanes

Four parallel explorations of AI-assisted 3D content creation workflows.

## Overview

This experiment pack demonstrates different approaches to programmatic and AI-assisted 3D modelling, from interactive web visualisation to parametric CAD to generative mesh services.

Each lane is **self-contained** with its own README, dependencies, and runnable examples.

## The Four Lanes

### 1. [web-3d](./web-3d/) — Interactive Three.js Assembly Viewer

**What**: Browser-based exploded view visualisation with real-time interaction.

**Tech**: Three.js, Vite, vanilla JavaScript

**Runs**: Locally in browser, no external services

```bash
cd web-3d
npm install && npm run dev
```

**Features**:
- 12-part motor assembly with explode slider
- Mechanical cutaway scene with rotating internals
- Click parts for info, hover for highlight
- Professional dark UI

**Use case**: Product visualisation, assembly instructions, interactive documentation

---

### 2. [blender](./blender/) — Blender Scripting & MCP

**What**: Programmatic scene creation with Blender Python API (bpy).

**Tech**: Python, Blender, bpy API

**Runs**: Headless or with Blender GUI

```bash
blender --background --python explode_assembly.py
```

**Features**:
- Self-contained bpy script creates exploded assembly
- Exports to GLB for web/game engines
- MCP tool wrappers for agent integration
- Comparison of Computer Use vs Blender MCP approaches

**Use case**: Automated rendering, batch scene generation, agent-driven 3D workflows

---

### 3. [cad](./cad/) — Parametric CAD with CadQuery

**What**: Code-first solid modelling for engineering and manufacturing.

**Tech**: Python, CadQuery, OpenCASCADE (B-Rep kernel)

**Runs**: Python script, outputs STL/STEP

```bash
cd cad
pip install -r requirements.txt
python mounting_bracket.py
```

**Features**:
- Parametric L-bracket and motor flange designs
- Exports to STL (3D printing) and STEP (CAD interchange)
- Fully editable via code, version-control friendly
- B-Rep vs mesh explainer

**Use case**: Mechanical parts, enclosures, custom brackets, 3D printing prep

---

### 4. [mesh-gen](./mesh-gen/) — Generative Mesh Services

**What**: Documentation and stubs for AI text/image-to-3D services.

**Tech**: Python stub client, HTML viewer, provider comparison

**Runs**: Dry-run mode (no API key required)

```bash
cd mesh-gen
python meshy_client.py  # Dry-run demonstration
```

**Features**:
- Comprehensive comparison of Meshy, Tripo, Rodin, Luma, Spline AI
- Stub client showing async generation workflow
- Cost/quality/speed trade-off analysis
- Sample viewer placeholder

**Use case**: Understanding AI mesh generation landscape, evaluating providers, prototyping workflows

**Note**: Real generation requires API keys and credits (see `providers.md`).

---

## Quick Start

### Web Visualisation (Immediate)
```bash
cd web-3d && npm install && npm run dev
```
Open browser → interactive 3D viewer running locally.

### Parametric CAD (Requires Python)
```bash
cd cad && pip install -r requirements.txt && python mounting_bracket.py
```
Generates `mounting_bracket.stl` and `motor_flange.step`.

### Generative Mesh (Documentation)
```bash
cd mesh-gen && python meshy_client.py
```
Dry-run demonstration. See `providers.md` for real provider comparison.

### Blender Scripting (Requires Blender)
```bash
cd blender && blender --background --python explode_assembly.py
```
Exports `assembly_exploded.glb`.

---

## Philosophy: Four Approaches, Four Trade-offs

| Lane | Speed | Interactivity | Precision | AI Native | Production Ready |
|------|-------|---------------|-----------|-----------|------------------|
| **web-3d** | Fast | High | Medium | No | Yes |
| **blender** | Medium | Medium | High | Partial (MCP) | Yes |
| **cad** | Fast | Low | Very High | No | Yes (engineering) |
| **mesh-gen** | Slow | Low | Medium | Yes | Partial (new) |

### When to Use What

- **Real-time interaction** → web-3d
- **Cinematic rendering** → blender
- **Engineering/manufacturing** → cad
- **Rapid concept generation** → mesh-gen

All four can **complement each other**:
1. Generate base mesh with `mesh-gen`
2. Refine in `blender`
3. Export to `web-3d` for client demo
4. Model mounting hardware in `cad`

---

## Inspiration

These lanes were inspired by recent AI 3D work:
- Tesla Model X exploded assembly websites
- GROK BOT hardware device (one image → full 3D)
- Interactive Earth history timeline
- V8 engine interactive visualisation

See `/workspace/ai3d-refs/` for reference screenshots.

---

## Extending the Experiment

Ideas for future lanes:
- **USD lane**: Universal Scene Description for Pixar workflows
- **game-engine lane**: Unity/Godot procedural generation
- **physics lane**: Bullet/PhysX simulation
- **render lane**: Cycles/Arnold photorealistic rendering
- **texture lane**: Substance/AI texture generation

---

## Resources

### Web 3D
- [Three.js docs](https://threejs.org/docs/)
- [WebGL fundamentals](https://webglfundamentals.org/)

### Blender
- [Blender Python API](https://docs.blender.org/api/current/)
- [ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp)

### CAD
- [CadQuery docs](https://cadquery.readthedocs.io/)
- [OpenCASCADE](https://dev.opencascade.org/)

### Mesh Gen
- See [mesh-gen/providers.md](./mesh-gen/providers.md) for full provider list

---

## Contributing

This is a learning-focused experiment pack. Feel free to:
- Add new lanes
- Improve existing implementations
- Share learnings in lane READMEs
- Submit PRs with new 3D workflows

Keep the kitchen-sink spirit: working code > perfect code.
