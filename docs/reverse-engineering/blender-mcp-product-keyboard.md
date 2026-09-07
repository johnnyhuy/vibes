# Blender MCP Product Keyboard Workflow

**Reference**: [Gilbert93533589's Work Louder × Figma keyboard](https://x.com/Gilbert93533589/status/2096920288319435154)  
**Date observed**: 2026-09-07  
**Status**: Clean-room notes complete (no experiment yet — and I am not building a Work Louder / Figma clone)

This is my first-person, clean-room analysis of the *offline render → web* pattern I saw in Gilbert's public post. I studied the visible workflow only: Blender MCP writes a script, Blender renders a product still, a web page shows the image. No proprietary keycap CAD, no Work Louder assets, no Figma plugin code.

## The Pattern

**Blender MCP → Python scripts → Render → Web display**

```
1. Use Blender MCP to generate Python scripts
   ↓
2. Scripts define geometry, materials, camera, lighting
   ↓
3. Execute scripts in Blender to render images
   ↓
4. Display renders in web app (React, Next.js, etc)
```

This is different from the semicircle viewer (which exports GLB for real-time Three.js) — here we're doing offline rendering in Blender and displaying static images or image sequences on the web.

## Why This Workflow?

### Advantages of Offline Rendering

1. **Photorealism** — Cycles rendering with path tracing beats real-time WebGL
2. **No polygon budget** — Can use high-poly models (millions of faces)
3. **Complex materials** — Subsurface scattering, volumetrics, etc
4. **Lighting quality** — Global illumination, caustics, area lights
5. **No browser performance concerns** — User sees pre-rendered images

### When to Use This vs Real-Time 3D

**Offline rendering (this pattern)**:
- Product photography replacement
- Marketing hero images
- High-fidelity showcase (quality over interactivity)

**Real-time 3D (Three.js/R3F)**:
- Interactive configurators (color pickers, part swapping)
- 360° viewer with user control
- Scroll-driven animation (see scroll-product-showcase)

## Keyboard-Specific Techniques

### 1. Keycap Geometry

Mechanical keyboards have distinct profiles (SA, DSA, Cherry, etc). From the X post, this looks like a low-profile design.

**Likely approach**:
```python
import bpy

# Create keycap base
bpy.ops.mesh.primitive_cube_add(size=1)
keycap = bpy.context.active_object

# Add bevel modifier for rounded edges
bevel = keycap.modifiers.new(name="Bevel", type='BEVEL')
bevel.width = 0.05
bevel.segments = 4

# Scale to keycap proportions (1u = ~18mm)
keycap.scale = (0.18, 0.18, 0.08)
```

### 2. Array Modifier for Keyboard Layout

**Pattern**: Single keycap → Array modifier → Full keyboard grid

```python
# Horizontal row
array_x = keycap.modifiers.new(name="Array_X", type='ARRAY')
array_x.count = 15  # 15 keys wide
array_x.relative_offset_displace = (1.1, 0, 0)  # 10% gap

# Vertical rows
array_y = keycap.modifiers.new(name="Array_Y", type='ARRAY')
array_y.count = 5  # 5 rows
array_y.relative_offset_displace = (0, 1.1, 0)
```

### 3. Material Setup

**Keycaps**: PBT or ABS plastic with legend (text on key)

```python
mat = bpy.data.materials.new(name="Keycap")
mat.use_nodes = True
nodes = mat.node_tree.nodes

# Principled BSDF (Blender's PBR material)
bsdf = nodes.get("Principled BSDF")
bsdf.inputs['Base Color'].default_value = (0.2, 0.2, 0.2, 1)  # Dark grey
bsdf.inputs['Roughness'].default_value = 0.4  # Semi-matte plastic
```

**Case**: Anodised aluminium or powder-coated steel

```python
case_mat = bpy.data.materials.new(name="Case")
bsdf = case_mat.node_tree.nodes.get("Principled BSDF")
bsdf.inputs['Metallic'].default_value = 0.9
bsdf.inputs['Roughness'].default_value = 0.2
```

### 4. Lighting (Product Photography Style)

**Three-point lighting**:

```python
# Key light (main light source)
bpy.ops.object.light_add(type='AREA', location=(2, -2, 3))
key_light = bpy.context.active_object
key_light.data.energy = 200
key_light.data.size = 2

# Fill light (soften shadows)
bpy.ops.object.light_add(type='AREA', location=(-2, -1, 2))
fill_light = bpy.context.active_object
fill_light.data.energy = 100
fill_light.data.size = 3

# Rim light (edge highlight)
bpy.ops.object.light_add(type='AREA', location=(0, 2, 1))
rim_light = bpy.context.active_object
rim_light.data.energy = 150
rim_light.data.size = 1.5
```

### 5. Camera Setup

**Orthographic vs Perspective**:

Product photography often uses **near-orthographic** (long lens, far away) to minimise distortion.

```python
bpy.ops.object.camera_add(location=(0, -5, 3))
camera = bpy.context.active_object
camera.data.type = 'PERSP'
camera.data.lens = 85  # Portrait lens (less distortion)

# Point at keyboard center
constraint = camera.constraints.new(type='TRACK_TO')
constraint.target = keyboard_object
constraint.track_axis = 'TRACK_NEGATIVE_Z'
constraint.up_axis = 'UP_Y'
```

## Blender MCP Integration

### How Blender MCP Helps

The [Blender MCP server](https://github.com/JacobLinCool/blender-mcp-server) lets AI assistants (like Claude) generate Blender Python scripts through natural language.

**Example prompt** (hypothetical):
> "Create a 60% mechanical keyboard with rounded keycaps, aluminium case, three-point lighting, and render from a 30° angle"

**MCP generates**:
```python
import bpy

# Clear scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Create keycap
bpy.ops.mesh.primitive_cube_add(size=1)
# ... (rest of script)

# Render settings
bpy.context.scene.render.engine = 'CYCLES'
bpy.context.scene.cycles.samples = 128
bpy.context.scene.render.filepath = '/tmp/keyboard_render.png'
bpy.ops.render.render(write_still=True)
```

### Workflow Steps

1. **Describe desired keyboard** (layout, materials, angle)
2. **MCP generates Python script** (geometry + materials + lighting + camera)
3. **Run script in Blender** (`blender --background --python script.py`)
4. **Output render** (PNG, EXR, or image sequence)
5. **Display on web** (Next.js Image component, React img tag, etc)

## Web Display

### Static Render

```tsx
// Next.js Image component
import Image from 'next/image';

<Image 
  src="/renders/keyboard-hero.png" 
  alt="Work Louder × Figma keyboard"
  width={1920}
  height={1080}
/>
```

### Image Sequence (Fake 360° Spin)

Render 72 frames (5° increments) and cycle through them on scroll or drag.

```tsx
const [frame, setFrame] = useState(0);
const totalFrames = 72;

// On scroll
const handleScroll = (e) => {
  const progress = e.target.scrollTop / e.target.scrollHeight;
  setFrame(Math.floor(progress * totalFrames));
};

<img src={`/renders/keyboard_${frame.toString().padStart(4, '0')}.png`} />
```

## Comparison: MCP vs Computer Use

| Aspect | Blender MCP | Computer Use |
|--------|-------------|--------------|
| **Speed** | Fast (direct Python exec) | Slow (GUI automation) |
| **Precision** | High (code-defined) | Variable (click targets) |
| **Repeatability** | Perfect (same script = same output) | Fragile (UI changes break automation) |
| **Debugging** | Easy (read Python script) | Hard (watch screen recording) |
| **Best for** | Procedural scenes | Complex UI workflows |

**Verdict**: MCP is better for parametric product renders. Computer Use is better for complex Blender UI workflows (manual modeling, rigging).

## Future Implementation Plan

If I build this in `vibes`:

### Goals

1. **New experiment**: `experiments/blender-keyboard-render/`
2. **Blender MCP integration**: Generate keyboard render script
3. **Render in Blender**: Execute script, output PNG
4. **Next.js page**: Display render with hover effects

### Stack

- **Blender** (via MCP or CLI)
- **Python** (Blender scripting)
- **Next.js** (image display)
- **Sharp** (image optimisation)

### Constraints

- Blender must be installed (check in setup)
- Renders can be large (optimise with Sharp before commit)
- Offline rendering (not real-time interaction)

### Scope

**In scope**:
- Generic keyboard render (not Work Louder branded)
- Clean-room procedural modeling
- Educational documentation

**Out of scope**:
- Figma integration (that's Gilbert's project)
- Real-time configurator (use Three.js for that)

## Key Learnings (Anticipated)

1. **MCP enables rapid iteration** — Natural language → Python script → render
2. **Offline rendering allows realism** — Cycles path tracing beats WebGL
3. **Web display is simple** — Just static images (no Three.js loader complexity)
4. **Blender is the bottleneck** — Render time scales with quality

## Related Documentation

- [blender-semicircle-viewer](../../experiments/blender-semicircle-viewer/) — Blender MCP → GLB → Three.js (real-time 3D)
- This doc — Blender MCP → PNG → web (offline rendering)

## References

- [Gilbert93533589's keyboard](https://x.com/Gilbert93533589/status/2096920288319435154) — Inspiration
- [Work Louder keyboards](https://worklouder.cc/) — Product design style
- [Blender MCP Server](https://github.com/JacobLinCool/blender-mcp-server) — MCP implementation

---

**Status**: Notes complete from the #10 docs pass. No keyboard experiment until someone asks — scroll-product and semicircle framing come first.  
**Priority**: Low  
**Last updated**: 2026-09-07  
**Next**: Optional `experiments/blender-keyboard-render/` with generic procedural keycaps only (never Work Louder / Figma assets)
