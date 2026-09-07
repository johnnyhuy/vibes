# llm-openscad

Text-to-CAD using LLMs to generate parametric OpenSCAD code.

## What's Here

- **examples/** — Three working .scad files (bracket, enclosure, gear)
- **generate_part.py** — Dry-run generator demonstrating LLM workflow
- **prompt_templates.md** — Effective prompts for LLM CAD generation

## Running Locally

### Explore Examples

```bash
# List available examples
ls examples/

# Preview in OpenSCAD (if installed)
openscad examples/bracket.scad
openscad examples/enclosure.scad
openscad examples/gear.scad
```

### Generate with Script

```bash
# Run examples (dry-run mode)
python generate_part.py

# Generate from prompt (selects matching template)
python generate_part.py "Create a mounting bracket"

# Save to file
python generate_part.py "Make an enclosure box" output.scad
```

### Export to STL

If OpenSCAD CLI is installed:

```bash
openscad -o bracket.stl examples/bracket.scad
openscad -o enclosure.stl examples/enclosure.scad
openscad -o gear.stl examples/gear.scad
```

## How This Works

### LLM → OpenSCAD Pipeline

```
1. Natural Language Prompt
   "Create a 50mm mounting bracket with M4 holes"
   ↓
2. LLM Generation (GPT-4, Claude)
   Generates parametric OpenSCAD code
   ↓
3. OpenSCAD Rendering
   openscad → STL file
   ↓
4. 3D Printing or Viewing
   Prusa Slicer, Cura, or web-3d viewer
```

### Why OpenSCAD for LLM Generation?

1. **Text-based** — LLMs naturally emit code, not binary CAD files
2. **Parametric** — Easy to request "make it 20% larger" → change one variable
3. **Deterministic** — Same code = same geometry, every time
4. **Readable** — Engineers can review and modify LLM output
5. **3D-printing ready** — Direct STL export

### Comparison to Other Approaches

| Approach | Speed | Precision | Flexibility | Cost |
|----------|-------|-----------|-------------|------|
| **LLM + OpenSCAD** | Fast | High | Very High | API cost |
| **CadQuery (vibes/cad)** | Medium | Very High | Very High | Free |
| **Zoo Text-to-CAD** | Fast | Medium | Low | $$$ |
| **Manual CAD (Fusion)** | Slow | Very High | Full | Free/$ |
| **Mesh Gen (Meshy)** | Fast | Low-Med | Low | $$ |

**LLM+OpenSCAD wins for**:
- Rapid prototyping of functional parts
- Parametric designs (easy to tweak dimensions)
- Educational exploration
- Code-reviewable CAD (version control friendly)

**CadQuery wins for**:
- Production workflows
- Complex assemblies
- Python ecosystem integration

**Zoo/Mesh Gen win for**:
- Artistic/organic shapes
- Non-parametric one-offs

## Prompt Engineering for CAD

See `prompt_templates.md` for detailed examples. Quick tips:

### Good Prompt Structure

```
Generate an OpenSCAD script for a [PART TYPE].

Requirements:
- Parametric design with [KEY DIMENSIONS]
- [FEATURES: holes, fillets, etc.]
- [CONSTRAINTS: printable, thickness limits]

Parameters to expose:
- dimension1, dimension2, dimension3
```

### Example: Bracket

```
Generate an OpenSCAD script for an L-shaped mounting bracket.

Requirements:
- 50mm horizontal base, 40mm vertical wall
- Two M4 mounting holes in each section
- 3mm wall thickness throughout
- 2mm rounded corners for aesthetics
- Suitable for 3D printing (no supports needed)

Parameters to expose:
- base_length, wall_height, wall_thickness
- hole_diameter, hole_spacing, fillet_radius
```

**Result**: LLM generates `bracket.scad` similar to `examples/bracket.scad`

## Integration with Other Vibes Lanes

### With CAD Lane (CadQuery)

**OpenSCAD**: Quick iteration, LLM-friendly syntax  
**CadQuery**: Production-ready, complex assemblies, Python workflows

Use OpenSCAD for rapid prototyping → switch to CadQuery for production refinement.

### With Mesh Gen Lane

**Mesh Gen**: Generates organic/artistic 3D meshes (Meshy, Tripo)  
**LLM+OpenSCAD**: Generates functional/mechanical parts

**Mesh gen is wrong for functional parts** because:
- Not parametric (can't easily adjust dimensions)
- Poor dimensional accuracy (AI guesses sizes)
- Not manufacturable (no tolerance control)
- Hard to modify (mesh vs. solid model)

**Use OpenSCAD when you need**:
- Exact dimensions (3mm wall thickness, M4 holes)
- Parametric control (easy to resize)
- 3D printing tolerances
- Engineering requirements (load-bearing, fitment)

### With Web-3D Lane

Generate OpenSCAD part → export STL → convert to GLB → display in web-3d viewer

```bash
# Generate and export
openscad -o bracket.stl examples/bracket.scad

# Convert STL to GLB (with meshlab or blender)
# Display in experiments/ai-3d-lanes/web-3d/
```

### With Blender Lane

LLM+OpenSCAD generates mechanical parts → import into Blender → add materials/textures → render

OpenSCAD handles **precision geometry**, Blender handles **presentation**.

## When to Use Each Tool

| Need | Use This |
|------|----------|
| Functional bracket/enclosure | **LLM + OpenSCAD** |
| Custom texture on part | **Blender** |
| Organic/artistic mesh | **Mesh Gen (Meshy/Tripo)** |
| Production assembly | **CadQuery** |
| Interactive web viewer | **web-3d** |
| Physics simulation | **web-physics** |

## Extending This Experiment

1. Implement real LLM integration (GPT-4, Claude API)
2. Add STL validation (manifold check, printability)
3. Build web UI for prompt → preview → download
4. Create library of reusable OpenSCAD modules
5. Add FreeCAD/STEP export support
6. Integrate with 3D printer slicer APIs

## Example Generated Parts

All examples in `examples/` are fully parametric:

### bracket.scad
- L-shaped mounting bracket
- Adjustable dimensions
- Mounting holes with configurable spacing
- Rounded corners (fillets)

### enclosure.scad
- Rectangular box with snap-fit lid
- Internal mounting bosses for PCBs
- Parametric clearances
- Two parts: base + lid

### gear.scad
- Involute spur gear
- Configurable tooth count
- Standard pressure angle (20°)
- Hub and bore parameters

## Resources

- [OpenSCAD Documentation](https://openscad.org/documentation.html)
- [OpenSCAD Cheat Sheet](https://openscad.org/cheatsheet/)
- [Prompt Templates](./prompt_templates.md)
- [CadQuery (vibes/cad)](../ai-3d-lanes/cad/) — Python alternative
- [Zoo Text-to-CAD](https://zoo.dev/) — Commercial service

## Why Not Just Use Zoo or Fusion AI?

**Zoo Text-to-CAD**:
- ✅ Fast, no coding needed
- ❌ Commercial API ($$$), not open
- ❌ Less control over output
- ❌ Outputs STEP (good) but harder to modify programmatically

**Fusion 360 AI Assistant**:
- ✅ Integrated into Fusion
- ❌ Proprietary, not code-based
- ❌ Can't version control or batch process
- ❌ Subscription required

**LLM + OpenSCAD**:
- ✅ Open, code-reviewable, versionable
- ✅ Full parametric control
- ✅ Free (except LLM API cost)
- ✅ Educational (see the code)
- ❌ Requires prompt engineering skill

**Use LLM+OpenSCAD for**: Learning, rapid iteration, open workflows, version control

**Use Zoo/Fusion for**: Quick commercial one-offs, non-technical users
