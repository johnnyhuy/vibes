# Blender MCP → MacBook Semicircle → Web

**Reference**: [Legendaryy's X post](https://x.com/Legendaryy/status/2096510965789422001) — GPT Astra installed Blender MCP, rendered 51 MacBook Airs in a semicircle, then built an interactive 3D website (verified 2026-09-07).

This is my clean-room reverse-engineering of that workflow. No proprietary Apple assets or MCP server implementation details copied — just studying the publicly visible pattern.

## What I Observed

### The Pipeline (5 stages)

```
User Request 
  ↓
1. Blender MCP Installation (Agent-driven)
  ↓
2. Scene Construction (51 laptops, semicircle layout)
  ↓
3. Rendering (Cycles/Eevee)
  ↓
4. GLB Export
  ↓
5. Web Viewer Generation (Three.js/R3F)
```

### Stage 1: Blender MCP Installation

**What happened**: GPT Astra autonomously installed the Blender MCP server during the conversation.

**How** (inferred):
- User likely had Blender installed but not the MCP server
- Agent identified the need for `ahujasid/blender-mcp` (or similar)
- Agent ran installation commands via shell/computer-use
- Agent configured MCP server connection

**Key insight**: The agent didn't just *use* Blender — it *set up* the tooling first. This is the Computer Use + MCP hybrid workflow I want to replicate in my experiments.

**What I'd rebuild**:
- Document Blender MCP setup steps in `experiments/ai-3d-lanes/blender/SETUP.md`
- Provide MCP server installation script (not a manual UI walkthrough)
- Test with free/CC0 laptop-like geometry (not Apple CAD)

---

### Stage 2: Scene Construction (51 Laptops in Semicircle)

**What was created**: 51 MacBook Air models arranged in a semicircular arc.

**Blender operations** (inferred from bpy API knowledge):

```python
import bpy
import math

# Pseudocode (not actual Legendaryy code)

def create_semicircle_array(base_object, count=51, radius=10.0, arc_angle=180.0):
    """
    Arrange N instances of base_object in a semicircular arc.
    """
    angle_step = math.radians(arc_angle) / (count - 1)
    start_angle = math.radians(-arc_angle / 2)
    
    for i in range(count):
        angle = start_angle + (i * angle_step)
        x = radius * math.cos(angle)
        y = radius * math.sin(angle)
        
        # Duplicate object or use geometry nodes
        dup = base_object.copy()
        dup.data = base_object.data.copy()
        dup.location = (x, y, 0)
        dup.rotation_euler.z = angle + math.radians(90)  # Face outward
        
        bpy.context.collection.objects.link(dup)
```

**Key decisions**:
- **51 instances** — Odd number creates centered symmetry (laptop #26 at apex)
- **Semicircle** — 180° arc (not full circle) for hero camera angle
- **Radius** — Tight enough to see all laptops, loose enough to avoid overlap
- **Rotation** — Each laptop faces radially outward (or inward toward center)

**Alternative techniques**:
1. **Array Modifier** — Traditional Blender approach (less flexible)
2. **Geometry Nodes** — Modern procedural workflow (more powerful)
3. **Python script** — What MCP probably used (most agent-friendly)

**What I'd rebuild**:
- **Procedural geometry** — Simple laptop-like shape (rounded rect + screen hinge)
- **NOT Apple assets** — Use primitive cubes, beveled edges, generic "laptop" form
- **CC0 if using models** — Sketchfab Creative Commons or BlenderKit Free

---

### Stage 3: Rendering

**Inferred setup**:
- **Engine**: Probably Cycles (photoreal) or Eevee (fast)
- **Camera**: Positioned to frame the full semicircle (wide angle)
- **Lighting**: Studio HDRI or three-point lighting
- **Materials**: Aluminum/metal shader for laptop bodies, emissive screens

**Render settings** (typical for this style):
- Resolution: 1920×1080 or 2560×1440
- Samples: 256+ (Cycles) or Eevee defaults
- Transparent background or dark gradient

**Not critical for my rebuild** — I'm focusing on the *workflow*, not pixel-perfect rendering. A quick Eevee render is fine for proof-of-concept.

---

### Stage 4: GLB Export

**What got exported**: A `.glb` file containing the full scene (51 laptops + camera + lights).

**Blender Python command**:
```python
bpy.ops.export_scene.gltf(
    filepath="/path/to/semicircle.glb",
    export_format='GLB',
    export_cameras=True,
    export_lights=True
)
```

**File size considerations**:
- 51 instances of same laptop — GLB can use instancing to reduce size
- Or 51 separate meshes — simpler but larger file
- Legendaryy's version likely optimized for web (sub-10MB)

**What I'd export**:
- Single `.glb` with all laptop instances
- Or separate `laptop_single.glb` + procedural duplication in Three.js (lighter)

---

### Stage 5: Web Viewer Generation

**What was built**: An interactive 3D website (Three.js/R3F) to display the GLB.

**Tech stack** (inferred):
- **Three.js** or **React Three Fiber**
- **OrbitControls** — User camera rotation
- **GLTFLoader** — Load the exported scene
- **Vite** or **Next.js** — Build system
- **Vercel** — Deployment (typical for viral demos)

**Minimal viewer code** (pseudocode):

```javascript
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();
loader.load('/semicircle.glb', (gltf) => {
  scene.add(gltf.scene);
});

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 5, 15);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
```

**What I'd build**:
- Dark cinematic UI (matching my `vibes` quality bar)
- Optional: Animation loop (slow rotation or camera fly-through)
- Optional: Click individual laptops for interaction
- Deploy-ready with `vercel.json`

---

## Workflow Advantages (MCP vs Computer Use)

### Why Legendaryy's Agent Used Blender MCP

| Aspect | Computer Use | Blender MCP |
|--------|--------------|-------------|
| **Speed** | Slow (GUI clicks) | Fast (direct API calls) |
| **Reliability** | Brittle (UI changes break) | Stable (Python API) |
| **Repeatability** | Hard (manual steps) | Easy (scripted) |
| **Headless** | Requires display server | Native headless support |
| **Composability** | Sequential only | Parallelizable |

**Verdict**: MCP wins for production agent workflows. Computer use is fine for one-offs but doesn't scale.

---

## What I'm Rebuilding (This Repo)

### Goals

1. ✅ **Document the pattern** (this file)
2. 🚧 **Hands-on Blender MCP starter** (`experiments/ai-3d-lanes/blender/`)
   - README with setup instructions
   - Script to generate semicircle laptop array
   - MCP tool wrappers (already started in `mcp_tools.py`)
3. 🚧 **Web viewer** (`experiments/blender-mcp-viewer/` or extend `web-3d`)
   - Load procedural semicircle GLB
   - Dark cinematic UI
   - Deploy to Vercel

### What I'm NOT Doing

- ❌ Using Apple MacBook Air CAD models (proprietary)
- ❌ Copying MCP server implementation (clean-room only)
- ❌ Pixel-perfect recreation (learning the workflow, not the exact visual)

### Free Alternatives

**Laptop geometry options**:
1. **Procedural** — Blender Python script creates generic laptop shape
2. **CC0 models** — Search Sketchfab/BlendKit for "laptop CC0" or "generic laptop"
3. **OpenSCAD** — Generate parametric laptop case (see `llm-openscad` lane)

**Example sources**:
- [Sketchfab CC0 Laptops](https://sketchfab.com/search?q=laptop&type=models&licenses=322a749bcfa841b29dff1e8a1bb74b0b)
- BlenderKit Free tier
- Procedural modeling (my preferred approach)

---

## Implementation Checklist

- [x] Document the observed workflow
- [ ] Write `experiments/ai-3d-lanes/blender/SETUP.md` (MCP installation)
- [ ] Add `semicircle_array.py` script (generates laptop semicircle)
- [ ] Create web viewer under `experiments/blender-mcp-viewer/`
- [ ] Test build and deployment
- [ ] Document in ADR (why Blender MCP matters for AI agents)

---

## Key Learnings for AI Agents

1. **MCP enables complex workflows** — Not just "render this", but "install tools → create scene → render → export → build website"
2. **Procedural > manual** — Semicircle layout via code, not hand-placing 51 objects
3. **Web is the demo medium** — Rendered images are nice, but interactive 3D websites go viral
4. **Clean-room is possible** — I can study the pattern without proprietary access

---

## Related Files

- `experiments/ai-3d-lanes/blender/README.md` — Current Blender lane status
- `experiments/ai-3d-lanes/blender/mcp_tools.py` — MCP tool wrapper examples
- `experiments/ai-3d-lanes/web-3d/` — Existing Three.js viewer (could extend for semicircle)
- `docs/adrs/ADR-0001-blender-mcp-lane.md` (to be created) — Architectural decision

---

**Last updated**: 2026-09-07  
**Status**: Documentation complete, implementation in progress  
**Next**: Build hands-on reproducible path with CC0 geometry
