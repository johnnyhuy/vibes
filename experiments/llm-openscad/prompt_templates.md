# LLM Prompt Templates for OpenSCAD Generation

Effective prompts for generating parametric CAD code with LLMs.

## General Prompt Structure

```
Generate an OpenSCAD script for [PART_DESCRIPTION].

Requirements:
- Parametric design with adjustable dimensions at the top
- Well-commented code explaining each section
- Use modules for reusable components
- Include mounting holes/features as needed
- Suitable for 3D printing (no impossible overhangs)
- Output dimensions in millimeters

Parameters to expose:
[LIST KEY DIMENSIONS]

Additional features:
[SPECIAL REQUIREMENTS]
```

## Example Prompts by Part Type

### Mechanical Brackets

```
Generate an OpenSCAD script for an L-shaped mounting bracket.

Requirements:
- Parametric design with adjustable dimensions
- Two mounting holes in the horizontal base
- Two mounting holes in the vertical wall
- Rounded corners (fillet radius parameter)
- Wall thickness parameter for structural integrity
- Total height around 40mm, base length 50mm

Parameters to expose:
- base_length, base_width, base_thickness
- wall_height, wall_thickness
- hole_diameter, hole_spacing
- fillet_radius

Generate the complete .scad file with clear comments.
```

**Expected output**: Functional bracket.scad similar to `examples/bracket.scad`

---

### Enclosures

```
Generate an OpenSCAD script for an electronics enclosure box with a snap-fit lid.

Requirements:
- Parametric rectangular box with lid
- Adjustable width, length, height
- Wall thickness parameter
- Rounded corners for better aesthetics
- Lid should have a lip that fits inside the box
- Lid clearance parameter for tight/loose fit
- Four mounting bosses inside for PCB screws
- Screw hole diameter parameter

Parameters to expose:
- box_width, box_length, box_height
- wall_thickness
- corner_radius
- lid_clearance (0.2mm default)
- boss_diameter, boss_height
- screw_hole_diameter

Include both base and lid in the output, positioned side-by-side for export.
```

**Expected output**: Functional enclosure.scad similar to `examples/enclosure.scad`

---

### Gears & Mechanical Components

```
Generate an OpenSCAD script for a parametric involute spur gear.

Requirements:
- Parametric gear with adjustable teeth count
- Circular pitch (distance between teeth) parameter
- Pressure angle (20° standard)
- Hub diameter and bore diameter parameters
- Gear thickness parameter
- Use proper involute tooth profile for meshing
- Include central hub for strength

Parameters to expose:
- number_of_teeth
- circular_pitch
- pressure_angle (default 20)
- gear_thickness
- hub_diameter
- bore_diameter

Calculate pitch radius, base radius, and other derived values automatically.
Generate smooth involute curves using polygon() with calculated points.
```

**Expected output**: Functional gear.scad similar to `examples/gear.scad`

---

### Custom Flanges

```
Generate an OpenSCAD script for a circular mounting flange.

Requirements:
- Parametric circular plate with bolt holes
- Adjustable outer diameter and thickness
- Bolt circle diameter parameter
- Number of bolt holes parameter (4, 6, 8, etc.)
- Bolt hole diameter parameter
- Central bore for shaft
- Chamfered edges for aesthetics
- Optional raised rim around bore

Parameters to expose:
- outer_diameter
- inner_bore_diameter
- flange_thickness
- bolt_circle_diameter
- bolt_hole_diameter
- number_of_bolts
- chamfer_size

Use a for loop to create evenly spaced bolt holes around the bolt circle.
```

---

### 3D Printable Joints

```
Generate an OpenSCAD script for a parametric snap-fit hinge joint.

Requirements:
- Two-part design: male and female
- Adjustable pin diameter and length
- Snap-fit mechanism with relief cuts
- Print-in-place option (parts already assembled)
- Clearance parameter for fit tolerance
- Rounded edges for smooth operation

Parameters to expose:
- pin_diameter
- pin_length
- snap_clearance (0.15mm default)
- hinge_thickness
- print_in_place (true/false)

If print_in_place is true, position parts with correct spacing.
If false, position side-by-side for separate printing.
```

---

## Prompt Enhancement Techniques

### 1. Specify Constraints

❌ Bad: "Make a bracket"

✅ Good: "Make a 40mm L-bracket with M4 mounting holes, 3mm wall thickness, suitable for 3D printing"

### 2. Request Comments

Add to prompt:
```
Include detailed comments explaining:
- Purpose of each module
- Parameter meanings and typical ranges
- Any design decisions or trade-offs
```

### 3. Ask for Variants

```
Generate three variants:
1. Compact version (30mm)
2. Standard version (50mm)
3. Heavy-duty version (80mm, thicker walls)

Show how to switch between variants by changing one parameter.
```

### 4. Request Validation

```
Include parameter validation:
- Warn if wall_thickness < 2mm (too weak for printing)
- Error if hole_diameter > base_width (impossible geometry)
- Suggest typical ranges in comments
```

## LLM-Specific Tips

### For GPT-4 / Claude

These models handle OpenSCAD well. Prompt pattern:

```
You are an expert mechanical engineer and OpenSCAD programmer.
Generate a parametric OpenSCAD script for [PART].

Use these best practices:
- Define all parameters at the top
- Use meaningful variable names
- Create modules for reusable geometry
- Add comments explaining non-obvious calculations
- Use $fn for smooth circles (suggest $fn=50 for preview, $fn=100 for render)

[SPECIFIC REQUIREMENTS]

Output only the .scad code, no explanations outside comments.
```

### For Smaller Models (7B-13B)

Simpler, more structured prompts work better:

```
Task: Create OpenSCAD bracket

Structure:
1. Parameters section (dimensions)
2. Helper modules (rounded_cube, etc.)
3. Main bracket() module
4. Final call to bracket()

Dimensions:
- Length: 50mm
- Width: 30mm
- Thickness: 3mm
- Holes: M4 (4mm diameter)

Output format: Valid .scad syntax only
```

## Iterative Refinement Prompts

After initial generation, refine with:

```
The generated bracket works, but please modify it to:
- Add chamfers on the top edges (1mm)
- Increase hole spacing from 20mm to 30mm
- Add a small handle cutout on the vertical wall
- Keep all other parameters the same

Show only the modified sections that changed.
```

## Testing Generated Code

After LLM generates .scad file:

```bash
# Validate syntax
openscad --export-format=echo bracket.scad > /dev/null

# Generate STL for inspection
openscad -o bracket.stl bracket.scad

# Preview in OpenSCAD GUI
openscad bracket.scad
```

## Comparison: LLM+OpenSCAD vs Other Approaches

| Approach | Speed | Precision | Learning Curve | Cost |
|----------|-------|-----------|----------------|------|
| **LLM + OpenSCAD** | Fast | High | Low (prompt) | API cost |
| **CadQuery (vibes/cad)** | Medium | Very High | Medium (Python) | Free |
| **Manual OpenSCAD** | Slow | High | Medium | Free |
| **Zoo Text-to-CAD** | Fast | Medium | Very Low | $$$ |
| **Fusion 360 AI** | Medium | High | Low | $ |

**LLM+OpenSCAD wins for**: Rapid parametric part generation, education, one-off designs

**CadQuery wins for**: Production workflows, complex assemblies, version control

**Manual wins for**: Learning, full control, no API dependency

## Resources

- [OpenSCAD Cheat Sheet](https://openscad.org/cheatsheet/)
- [OpenSCAD Tutorial](https://en.wikibooks.org/wiki/OpenSCAD_Tutorial)
- [Parametric Design Patterns](https://github.com/openscad/openscad/wiki/Parametric-Design)
- [3D Printing Tolerances](https://www.3dhubs.com/knowledge-base/tolerances-3d-printing/)
