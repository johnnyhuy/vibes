# Blender Lane — MCP-Driven 3D Scene Creation

I'm exploring **Blender as an AI-agent tool** — not just "render this", but full programmatic scene construction, export, and web integration via MCP (Model Context Protocol).

This lane shows how agents can orchestrate complex 3D workflows: install tools, generate scenes, export assets, and build interactive viewers.

## Why This Matters

**Blender MCP unlocks agent-driven 3D pipelines**:
- **Automated rendering** — Generate 100 product shots overnight
- **Parametric scenes** — "Change this car colour and re-render" in one prompt
- **Batch exports** — GLB assets for web, STEP for manufacturing, FBX for games
- **Learning workflows** — Agents that improve their own Blender scripts

**vs. Computer Use**: MCP is **10x faster and 100x more reliable** than clicking through Blender's GUI. See my comparison notes in this README below.

---

## What's Here

### Python Scripts

#### `explode_assembly.py`

**Self-contained bpy script** — Creates an exploded motor assembly and exports to GLB.

**Run it** (with Blender installed):

```bash
blender --background --python explode_assembly.py
```

**Output**: `assembly_exploded.glb` in current directory.

**What it demonstrates**:
- Creating primitives (cylinders, cubes, toruses)
- Applying materials (metallic, rough, emissive)
- Spatial layout (exploded assembly arrangement)
- GLB export for web use

**No Blender GUI required** — This is the headless automation workflow I'm targeting for agents.

---

#### `semicircle_array.py`

**NEW** — Generates 51 laptop-like objects in a semicircular arc, inspired by [Legendaryy's Blender MCP demo](https://x.com/Legendaryy/status/2096510965789422001).

**Run it**:

```bash
blender --background --python semicircle_array.py
```

**Output**: `semicircle_laptops.glb`

**What it demonstrates**:
- **Parametric arrays** — Change `count`, `radius`, `arc_angle` and re-run
- **Procedural geometry** — Generic laptop shape (not Apple assets)
- **Semicircle math** — Polar coordinate placement + outward rotation
- **MCP-ready structure** — Functions that could be exposed as MCP tools

**Use case**: Agent receives "create 51 laptops in a semicircle" → calls MCP tools → exports GLB → builds Three.js viewer.

See `docs/reverse-engineering/blender-mcp-macbook-semicircle.md` for the full workflow analysis.

---

#### `mcp_tools.py`

**MCP-style tool wrappers** — Functions structured for potential MCP server exposure.

```python
create_part(name, location, scale, color, explode_offset)
set_explode(factor)
export_glb(filepath)
list_parts()
get_scene_info()
```

**Not a working MCP server** (yet) — just showing the pattern. A real MCP server would:
1. Import these functions
2. Wrap in MCP protocol handlers
3. Expose over stdio/HTTP
4. Accept agent tool calls

**Reference implementation**: [ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp) — Working Blender MCP server.

---

### Setup & Installation

#### Option A: Local Blender (Full Features)

**Install Blender** (if not already):

- **macOS**: `brew install --cask blender`
- **Ubuntu/Debian**: `sudo snap install blender --classic`
- **Windows**: Download from [blender.org](https://www.blender.org/download/)

**Verify**:

```bash
blender --version
# Should print: Blender 4.x.x
```

**Run scripts**:

```bash
cd experiments/ai-3d-lanes/blender
blender --background --python explode_assembly.py
```

**Check output**:

```bash
ls -lh *.glb
# assembly_exploded.glb (or semicircle_laptops.glb)
```

---

#### Option B: Read the Scripts (No Blender Required)

**If Blender isn't installed**: The scripts are self-documenting Python. Read them to understand the bpy API patterns.

**Key concepts**:
- `bpy.ops.mesh.primitive_*_add()` — Create geometry
- `bpy.context.object` — Access active object
- `bpy.data.materials.new()` — Create materials
- `bpy.ops.export_scene.gltf()` — Export to GLB

**This lane is educational** — You don't need Blender running to learn from the code.

---

#### Option C: Blender MCP Server (Agent-Driven)

**For AI agents** that want to call Blender operations as MCP tools:

1. **Install ahujasid/blender-mcp** (or similar):

   ```bash
   git clone https://github.com/ahujasid/blender-mcp.git
   cd blender-mcp
   npm install
   ```

2. **Configure MCP client** (e.g., Claude Desktop, Cursor, custom agent):

   Add to MCP config:

   ```json
   {
     "mcpServers": {
       "blender": {
         "command": "node",
         "args": ["/path/to/blender-mcp/index.js"]
       }
     }
   }
   ```

3. **Agent calls tools**:

   ```
   Agent: "Create a semicircle of 51 laptops and export to GLB"
   
   MCP Server:
     - create_primitive(type="cube", location=[0,0,0])
     - duplicate_object(count=51, layout="semicircle")
     - export_scene(format="glb", path="output.glb")
   
   Output: semicircle_laptops.glb
   ```

**I haven't set this up yet** — this lane is currently **scripts-first**, with MCP integration as a future step.

---

## Blender MCP vs Computer Use

I documented this comparison in detail in `docs/reverse-engineering/blender-mcp-macbook-semicircle.md`, but here's the quick version:

| Aspect | Computer Use | Blender MCP |
|--------|--------------|-------------|
| **Speed** | Slow (GUI clicks, mouse moves) | Fast (direct Python API) |
| **Reliability** | Brittle (UI layout changes) | Stable (bpy API) |
| **Repeatability** | Hard (manual steps) | Easy (scripts) |
| **Headless** | Requires X server / display | Native `--background` flag |
| **Composability** | Sequential only | Parallelisable |
| **Debugging** | Watch screen recording | Read Python stack traces |

### When to Use Each

**Computer Use**:
- Exploring Blender for the first time (learning the UI)
- One-off tasks where scripting setup isn't worth it
- Features not exposed via bpy (rare, but exists)

**Blender MCP**:
- Repeated workflows (daily renders, batch exports)
- Agent-driven pipelines (MCP tool calls)
- CI/CD integration (headless rendering in containers)
- Parametric generation (change N, re-run script)

**My verdict**: MCP wins for production. Computer Use is a learning tool.

---

## Example Workflows

### 1. Exploded Assembly (Current Script)

```bash
blender --background --python explode_assembly.py
```

**Output**: `assembly_exploded.glb` — 8-part motor with explosion layout.

**Use case**: Load in Three.js viewer, add explosion slider, deploy to Vercel.

**Live example**: See `experiments/explode-assembly/` for full React + R3F implementation.

---

### 2. Semicircle Laptop Array (NEW)

```bash
blender --background --python semicircle_array.py
```

**Output**: `semicircle_laptops.glb` — 51 procedural laptop-like objects in a 180° arc.

**Parameters** (edit script):

```python
LAPTOP_COUNT = 51
SEMICIRCLE_RADIUS = 10.0
ARC_ANGLE = 180.0  # degrees
```

**Next step**: Build Three.js viewer (see "Web Viewer" section below).

---

### 3. Future: Parametric Car Configurator

**Idea** (not implemented yet):

```python
# car_configurator.py

def generate_car(body_color, wheel_type, interior_style):
    # Load base car GLB
    # Swap materials
    # Replace wheel meshes
    # Re-export
    pass

# Agent calls:
generate_car("red", "sport", "leather")
# Output: car_red_sport_leather.glb
```

**MCP flow**:

```
User: "Show me this car in blue with chrome wheels"
Agent: configure_car(body_color="blue", wheel_type="chrome")
Agent: export_glb("car_blue_chrome.glb")
Agent: [deploys Three.js viewer with new GLB]
User: Sees updated car in browser
```

This is the **agent-driven product visualisation pipeline** I'm working toward.

---

## Web Viewer Integration

### Existing Viewer: `ai-3d-lanes/web-3d`

**Current status**: Generic motor assembly viewer (vanilla Three.js).

**Could extend for semicircle laptops**:

1. Replace `createMotorAssembly()` with GLTFLoader for `semicircle_laptops.glb`
2. Add camera framing for wider semicircle
3. Optional: Click individual laptops for interaction

**File**: `experiments/ai-3d-lanes/web-3d/main.js`

---

### NEW Viewer: `blender-semicircle-viewer` (This PR)

**I'm building a dedicated semicircle laptop viewer** under `experiments/blender-semicircle-viewer/`:

- Loads `semicircle_laptops.glb` (or procedural fallback)
- Dark cinematic UI (matching `vibes` quality bar)
- Camera auto-rotation or OrbitControls
- Optional: Highlight on hover, click for info
- Deploy-ready with `vercel.json`

**See that folder's README for details.**

---

## Resources

### Blender Python API

- [Official bpy docs](https://docs.blender.org/api/current/)
- [Blender scripting quickstart](https://docs.blender.org/api/current/info_quickstart.html)
- [Blender CLI docs](https://docs.blender.org/manual/en/latest/advanced/command_line/arguments.html)

### Blender MCP Servers

- [ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp) — Reference implementation
- MCP Protocol docs: [modelcontextprotocol.io](https://modelcontextprotocol.io/)

### Learning Blender Scripting

- [Blender Python Tutorials](https://www.youtube.com/results?search_query=blender+python+scripting) (YouTube)
- [CG Cookie Blender Python course](https://cgcookie.com/courses/scripting-for-artists-in-blender)
- Study existing scripts in this folder

---

## Implementation Checklist

- [x] `explode_assembly.py` — Working motor assembly script
- [x] `mcp_tools.py` — MCP-style function wrappers
- [x] Document MCP vs Computer Use trade-offs
- [x] `semicircle_array.py` — NEW laptop semicircle generator
- [x] Updated README (this file) with setup instructions
- [ ] Blender MCP server integration (future)
- [ ] Web viewer with semicircle GLB (in progress, separate folder)

---

## Next Steps

1. **Test semicircle script locally** (if Blender installed)
2. **Build web viewer** — See `experiments/blender-semicircle-viewer/`
3. **Add MCP server** — Wrap these functions in ahujasid/blender-mcp or custom server
4. **Agent workflow** — Full pipeline from "create scene" to "deployed website"

This lane is **hands-on practical**, not vapourware docs. The goal is a reproducible agent-driven 3D pipeline.

---

**Last updated**: 2026-09-07  
**Status**: Scripts working, MCP integration pending, web viewer in progress  
**Author**: Johnny Huynh (learning in public)
