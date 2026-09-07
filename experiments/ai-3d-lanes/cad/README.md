# cad

Parametric CAD lane using CadQuery for programmatic solid modelling.

## What's Here

- **mounting_bracket.py** — Parametric L-bracket and motor flange designs
- Exports to STL (3D printing) and STEP (CAD interchange)

## Setup

```bash
pip install -r requirements.txt
```

Requires Python 3.9+. CadQuery bundles OpenCASCADE (the B-Rep kernel).

## Running

```bash
python mounting_bracket.py
```

Generates:
- `mounting_bracket.stl` / `mounting_bracket.step`
- `motor_flange.stl` / `motor_flange.step`

## B-Rep vs Mesh: Why It Matters

### Mesh Representation (STL, OBJ, GLB)
- **What**: Surface approximated by triangles
- **Pros**: Simple, universal, GPU-friendly
- **Cons**: No exact curves, can't modify easily, gets huge for accuracy
- **Use**: Rendering, 3D printing, game engines

### B-Rep Representation (STEP, IGES, Parasolid)
- **What**: Exact mathematical surfaces (NURBS, planes, cylinders)
- **Pros**: Infinite precision, fully editable, compact
- **Cons**: Complex to implement, needs kernel (OpenCASCADE, Parasolid)
- **Use**: CAD, engineering, manufacturing

**CadQuery uses B-Rep** under the hood (via OpenCASCADE), then exports to mesh formats when needed.

## Why CadQuery?

### Advantages
- **Code-first**: Design with Python instead of clicking
- **Parametric**: Change dimensions and regenerate
- **Version control**: Git-friendly design history
- **Chainable API**: Fluent, readable operations
- **3D printing ready**: Direct STL export

### When to Use Alternatives

| Tool | Best For |
|------|----------|
| **CadQuery** | Mechanical parts, brackets, enclosures, parametric |
| **OpenSCAD** | Simple geometries, education, extreme parametrisation |
| **Fusion 360** | Complex assemblies, rendering, collaboration |
| **Zoo CAD AI** | Natural language → CAD (commercial API) |
| **OnShape** | Browser-based, teams, version control |

## AI Assistance for CAD

### Zoo API
Commercial service: text prompt → STEP file. Great for one-offs, not open source.

### Fusion Assistant
Autodesk's AI inside Fusion 360. Natural language → features. Proprietary.

### CadQuery + LLM
**This approach**: LLM writes CadQuery code → B-Rep output. Transparent, versionable, extensible.

## Extending This Lane

1. Add assembly constraints between parts
2. Implement stress analysis (with `cadquery-ocp` or `calculix`)
3. Generate toolpaths for CNC
4. Create configurators with Streamlit UI
5. Build web viewer with `cadquery-massembly`

## Example: Customising the Bracket

```python
from mounting_bracket import create_mounting_bracket

custom_bracket = create_mounting_bracket(
    base_width=100,        # Wider base
    bracket_height=60,     # Taller vertical
    mounting_hole_spacing=80  # More hole spacing
)

custom_bracket.val().exportStl("custom_bracket.stl")
```

## Resources

- [CadQuery Documentation](https://cadquery.readthedocs.io/)
- [CadQuery Examples](https://github.com/CadQuery/cadquery/tree/master/examples)
- [OpenCASCADE (kernel)](https://dev.opencascade.org/)
- [Zoo CAD API](https://zoo.dev/) — AI text-to-CAD service
