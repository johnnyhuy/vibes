"""
Blender script: Create an exploded assembly scene and export to GLB.

Run with: blender --background --python explode_assembly.py
"""

import bpy
import math
from mathlib import Vector

def clear_scene():
    """Remove all mesh objects from the scene."""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

def create_part(name, location, scale, color, explode_offset):
    """Create a simple box part with material."""
    bpy.ops.mesh.primitive_cube_add(
        size=1,
        location=location
    )
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = scale
    
    mat = bpy.data.materials.new(name=f"{name}_Material")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs['Base Color'].default_value = (*color, 1.0)
    bsdf.inputs['Metallic'].default_value = 0.7
    bsdf.inputs['Roughness'].default_value = 0.3
    
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)
    
    obj['explode_offset'] = explode_offset
    
    return obj

def create_assembly():
    """Create a simple motor assembly."""
    parts = []
    
    parts.append(create_part(
        "Housing",
        (0, 0, 0),
        (2.5, 3.0, 2.5),
        (0.2, 0.4, 0.8),
        (0, 0.8, 0)
    ))
    
    parts.append(create_part(
        "Rotor",
        (0, 0, 0),
        (1.2, 2.5, 1.2),
        (0.9, 0.3, 0.3),
        (0, 0.5, 0)
    ))
    
    parts.append(create_part(
        "Stator",
        (0, 0, 0),
        (1.8, 2.6, 1.8),
        (0.5, 0.2, 0.8),
        (0, -0.5, 0)
    ))
    
    parts.append(create_part(
        "Shaft",
        (0, 0, 0),
        (0.25, 4.0, 0.25),
        (0.7, 0.7, 0.7),
        (0, 1.5, 0)
    ))
    
    parts.append(create_part(
        "End_Cap_Front",
        (0, 2.0, 0),
        (2.6, 0.4, 2.6),
        (0.3, 0.6, 0.9),
        (0, 1.0, 0)
    ))
    
    parts.append(create_part(
        "End_Cap_Rear",
        (0, -2.0, 0),
        (2.6, 0.4, 2.6),
        (0.3, 0.6, 0.9),
        (0, -1.0, 0)
    ))
    
    parts.append(create_part(
        "Cooling_Fan",
        (0, 2.5, 0),
        (2.0, 0.3, 2.0),
        (0.9, 0.6, 0.1),
        (0, 1.2, 0)
    ))
    
    parts.append(create_part(
        "Terminal_Box",
        (1.5, 0, 0),
        (1.0, 0.8, 0.8),
        (0.2, 0.8, 0.5),
        (1.2, 0, 0)
    ))
    
    return parts

def apply_explode(factor=0.0):
    """Apply explode transformation to all parts with explode_offset."""
    for obj in bpy.data.objects:
        if 'explode_offset' in obj:
            offset = Vector(obj['explode_offset'])
            obj.location = offset * factor

def setup_lighting():
    """Add simple three-point lighting."""
    bpy.ops.object.light_add(type='SUN', location=(5, 5, 10))
    sun = bpy.context.active_object
    sun.data.energy = 2.0
    
    bpy.ops.object.light_add(type='AREA', location=(-3, -3, 5))
    fill = bpy.context.active_object
    fill.data.energy = 50
    fill.data.size = 5
    
    bpy.ops.object.light_add(type='SPOT', location=(0, 8, 3))
    spot = bpy.context.active_object
    spot.data.energy = 100
    spot.rotation_euler = (math.radians(80), 0, 0)

def setup_camera():
    """Position camera for good assembly view."""
    bpy.ops.object.camera_add(location=(8, -6, 5))
    camera = bpy.context.active_object
    camera.rotation_euler = (math.radians(70), 0, math.radians(50))
    bpy.context.scene.camera = camera

def export_glb(filepath="assembly_exploded.glb"):
    """Export scene to GLB format."""
    bpy.ops.export_scene.gltf(
        filepath=filepath,
        export_format='GLB',
        export_materials='EXPORT',
        export_colors=True
    )
    print(f"Exported to: {filepath}")

def main():
    """Main execution."""
    clear_scene()
    
    parts = create_assembly()
    print(f"Created {len(parts)} parts")
    
    apply_explode(factor=0.0)
    
    setup_lighting()
    setup_camera()
    
    export_glb()
    
    print("Assembly scene created successfully!")

if __name__ == "__main__":
    main()
