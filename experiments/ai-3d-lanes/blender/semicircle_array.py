"""
semicircle_array.py

Generates a semicircular array of laptop-like objects in Blender.
Inspired by Legendaryy's Blender MCP demo (51 MacBook Airs in semicircle).

This is a clean-room implementation using procedural geometry — NOT Apple assets.

Run:
    blender --background --python semicircle_array.py

Output:
    semicircle_laptops.glb in current directory

Author: Johnny Huynh
License: MIT
"""

import bpy
import math

# Configuration
LAPTOP_COUNT = 51
SEMICIRCLE_RADIUS = 12.0
ARC_ANGLE = 180.0  # degrees
LAPTOP_WIDTH = 0.8
LAPTOP_DEPTH = 0.6
LAPTOP_THICKNESS = 0.05
SCREEN_HEIGHT = 0.5


def clear_scene():
    """Remove default cube, camera, light."""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)


def create_laptop_geometry():
    """
    Create a simple laptop-like shape using procedural geometry.
    
    NOT an Apple MacBook — generic laptop form for educational purposes.
    
    Returns:
        bpy.types.Object: The laptop base object
    """
    # Base (keyboard section)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0))
    base = bpy.context.object
    base.name = "Laptop_Base"
    base.scale = (LAPTOP_WIDTH, LAPTOP_DEPTH, LAPTOP_THICKNESS)
    
    # Apply scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    
    # Add bevel modifier for rounded edges
    bevel_mod = base.modifiers.new(name="Bevel", type='BEVEL')
    bevel_mod.width = 0.02
    bevel_mod.segments = 3
    
    # Material - aluminum/silver
    mat_base = bpy.data.materials.new(name="Laptop_Base_Material")
    mat_base.use_nodes = True
    mat_base.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.7, 0.7, 0.75, 1.0)
    mat_base.node_tree.nodes["Principled BSDF"].inputs["Metallic"].default_value = 0.8
    mat_base.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.3
    base.data.materials.append(mat_base)
    
    # Screen (slightly tilted back)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -LAPTOP_DEPTH/2 - 0.02, SCREEN_HEIGHT/2))
    screen = bpy.context.object
    screen.name = "Laptop_Screen"
    screen.scale = (LAPTOP_WIDTH * 0.95, LAPTOP_THICKNESS * 0.5, SCREEN_HEIGHT)
    screen.rotation_euler.x = math.radians(-105)  # Slight tilt (laptop open angle)
    
    # Apply transforms
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    
    # Screen material - dark with slight emission (powered on look)
    mat_screen = bpy.data.materials.new(name="Laptop_Screen_Material")
    mat_screen.use_nodes = True
    mat_screen.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.1, 0.12, 0.15, 1.0)
    mat_screen.node_tree.nodes["Principled BSDF"].inputs["Emission"].default_value = (0.2, 0.25, 0.3, 1.0)
    mat_screen.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = 0.3
    mat_screen.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.2
    screen.data.materials.append(mat_screen)
    
    # Parent screen to base
    screen.parent = base
    
    # Select both for grouping
    base.select_set(True)
    screen.select_set(True)
    bpy.context.view_layer.objects.active = base
    
    return base


def create_semicircle_array(base_object, count=51, radius=10.0, arc_angle=180.0):
    """
    Duplicate base_object in a semicircular arc.
    
    Args:
        base_object: Blender object to duplicate
        count: Number of instances
        radius: Semicircle radius
        arc_angle: Arc span in degrees (180 = half circle)
    """
    angle_step = math.radians(arc_angle) / (count - 1)
    start_angle = math.radians(-arc_angle / 2)
    
    # Deselect all
    bpy.ops.object.select_all(action='DESELECT')
    
    for i in range(count):
        if i == 0:
            # Use the original base object for first instance
            obj = base_object
        else:
            # Duplicate
            obj = base_object.copy()
            obj.data = base_object.data.copy()
            bpy.context.collection.objects.link(obj)
        
        # Calculate position
        angle = start_angle + (i * angle_step)
        x = radius * math.cos(angle)
        y = radius * math.sin(angle)
        
        obj.location = (x, y, 0)
        
        # Rotate to face outward (away from center)
        obj.rotation_euler.z = angle + math.radians(90)
        
        obj.name = f"Laptop_{i:03d}"


def setup_camera():
    """Position camera to frame the full semicircle."""
    bpy.ops.object.camera_add(location=(0, -SEMICIRCLE_RADIUS * 1.5, SEMICIRCLE_RADIUS * 0.6))
    camera = bpy.context.object
    camera.rotation_euler = (math.radians(75), 0, 0)
    bpy.context.scene.camera = camera


def setup_lighting():
    """Add studio-style lighting."""
    # Key light
    bpy.ops.object.light_add(type='SUN', location=(5, -5, 10))
    key_light = bpy.context.object
    key_light.data.energy = 3.0
    key_light.rotation_euler = (math.radians(45), 0, math.radians(45))
    
    # Fill light
    bpy.ops.object.light_add(type='SUN', location=(-5, 5, 8))
    fill_light = bpy.context.object
    fill_light.data.energy = 1.5
    fill_light.rotation_euler = (math.radians(60), 0, math.radians(-45))
    
    # Ambient
    bpy.context.scene.world.use_nodes = True
    world_nodes = bpy.context.scene.world.node_tree.nodes
    world_nodes["Background"].inputs["Color"].default_value = (0.05, 0.05, 0.05, 1.0)
    world_nodes["Background"].inputs["Strength"].default_value = 0.3


def export_glb(filepath="semicircle_laptops.glb"):
    """Export scene to GLB for web use."""
    bpy.ops.export_scene.gltf(
        filepath=filepath,
        export_format='GLB',
        export_cameras=True,
        export_lights=True,
        export_materials='EXPORT',
        export_colors=True
    )
    print(f"✅ Exported: {filepath}")


def main():
    """Main execution."""
    print("🚀 Generating semicircle laptop array...")
    
    # Clear default scene
    clear_scene()
    print("  - Cleared default scene")
    
    # Create laptop geometry
    laptop_base = create_laptop_geometry()
    print("  - Created laptop geometry")
    
    # Duplicate in semicircle
    create_semicircle_array(laptop_base, LAPTOP_COUNT, SEMICIRCLE_RADIUS, ARC_ANGLE)
    print(f"  - Duplicated {LAPTOP_COUNT} laptops in semicircle")
    
    # Camera and lighting
    setup_camera()
    setup_lighting()
    print("  - Set up camera and lighting")
    
    # Export
    export_glb()
    print(f"✅ Done! {LAPTOP_COUNT} laptops in semicircle exported to semicircle_laptops.glb")


if __name__ == "__main__":
    main()
