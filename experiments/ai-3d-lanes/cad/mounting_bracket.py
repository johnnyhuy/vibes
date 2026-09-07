"""
Parametric mounting bracket design using CadQuery.

Generates a printable bracket with mounting holes and a flange interface.
"""

import cadquery as cq

def create_mounting_bracket(
    base_width=60,
    base_length=80,
    base_thickness=5,
    bracket_height=40,
    bracket_thickness=4,
    mounting_hole_diameter=6,
    mounting_hole_spacing=50,
    fillet_radius=3
):
    """
    Create a parametric L-bracket with mounting holes.
    
    Args:
        base_width: Width of the base plate (mm)
        base_length: Length of the base plate (mm)
        base_thickness: Thickness of the base plate (mm)
        bracket_height: Height of the vertical bracket (mm)
        bracket_thickness: Thickness of the vertical bracket (mm)
        mounting_hole_diameter: Diameter of mounting holes (mm)
        mounting_hole_spacing: Center-to-center spacing of holes (mm)
        fillet_radius: Radius for edge fillets (mm)
    
    Returns:
        CadQuery Workplane with the bracket geometry
    """
    
    base = (
        cq.Workplane("XY")
        .box(base_length, base_width, base_thickness, centered=(True, True, False))
    )
    
    vertical = (
        cq.Workplane("XZ")
        .center(0, base_thickness / 2)
        .box(base_length, bracket_height, bracket_thickness, centered=(True, False, True))
    )
    
    result = base.union(vertical)
    
    result = (
        result
        .faces(">Z")
        .workplane()
        .rarray(mounting_hole_spacing, mounting_hole_spacing, 2, 2)
        .hole(mounting_hole_diameter)
    )
    
    result = (
        result
        .faces(">Y")
        .workplane()
        .center(0, bracket_height / 2)
        .rarray(mounting_hole_spacing, mounting_hole_spacing / 2, 2, 2)
        .hole(mounting_hole_diameter)
    )
    
    result = result.edges("|Z").fillet(fillet_radius)
    
    result = (
        result
        .edges("not (|Z or |X or |Y)")
        .fillet(fillet_radius * 0.5)
    )
    
    return result

def create_motor_flange(
    outer_diameter=100,
    inner_diameter=40,
    thickness=8,
    bolt_circle_diameter=80,
    bolt_hole_diameter=8,
    bolt_count=4,
    center_bore_diameter=25
):
    """
    Create a parametric motor mounting flange.
    
    Args:
        outer_diameter: Outer diameter of flange (mm)
        inner_diameter: Inner diameter before bolt circle (mm)
        thickness: Flange thickness (mm)
        bolt_circle_diameter: Diameter of bolt circle (mm)
        bolt_hole_diameter: Diameter of bolt holes (mm)
        bolt_count: Number of bolt holes
        center_bore_diameter: Diameter of center bore (mm)
    
    Returns:
        CadQuery Workplane with the flange geometry
    """
    
    result = (
        cq.Workplane("XY")
        .circle(outer_diameter / 2)
        .extrude(thickness)
    )
    
    result = (
        result
        .faces(">Z")
        .workplane()
        .circle(center_bore_diameter / 2)
        .cutThruAll()
    )
    
    result = (
        result
        .faces(">Z")
        .workplane()
        .polarArray(
            radius=bolt_circle_diameter / 2,
            startAngle=0,
            angle=360,
            count=bolt_count
        )
        .circle(bolt_hole_diameter / 2)
        .cutThruAll()
    )
    
    result = (
        result
        .faces(">Z")
        .workplane()
        .circle(inner_diameter / 2)
        .circle((inner_diameter + 5) / 2)
        .extrude(2)
    )
    
    result = result.edges("|Z").fillet(1.5)
    
    return result

def main():
    """Generate and export both models."""
    
    print("Generating mounting bracket...")
    bracket = create_mounting_bracket()
    bracket.val().exportStl("mounting_bracket.stl")
    bracket.val().exportStep("mounting_bracket.step")
    print("✓ Exported mounting_bracket.stl and mounting_bracket.step")
    
    print("\nGenerating motor flange...")
    flange = create_motor_flange()
    flange.val().exportStl("motor_flange.stl")
    flange.val().exportStep("motor_flange.step")
    print("✓ Exported motor_flange.stl and motor_flange.step")
    
    print("\nBoth models generated successfully!")
    print("\nModel statistics:")
    print(f"  Bracket: {len(bracket.faces().vals())} faces")
    print(f"  Flange:  {len(flange.faces().vals())} faces")

if __name__ == "__main__":
    main()
