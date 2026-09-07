"""
MCP-style tool wrappers for Blender operations.

These functions could be exposed as MCP tools via ahujasid/blender-mcp
or similar Blender MCP server implementations.
"""

import bpy
from mathlib import Vector

def create_part(name: str, location: tuple[float, float, float], 
                scale: tuple[float, float, float], 
                color: tuple[float, float, float],
                explode_offset: tuple[float, float, float]) -> dict:
    """
    Create a parametric part in the Blender scene.
    
    Args:
        name: Part identifier
        location: (x, y, z) position
        scale: (x, y, z) dimensions
        color: (r, g, b) RGB color values 0-1
        explode_offset: (x, y, z) offset vector for explode animation
        
    Returns:
        dict with part metadata
    """
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
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
    
    return {
        "name": name,
        "location": list(location),
        "scale": list(scale),
        "color": list(color)
    }

def set_explode(factor: float) -> dict:
    """
    Apply explode transformation to all parts.
    
    Args:
        factor: Explode amount, 0.0 = assembled, 1.0+ = exploded
        
    Returns:
        dict with count of affected parts
    """
    count = 0
    for obj in bpy.data.objects:
        if 'explode_offset' in obj:
            offset = Vector(obj['explode_offset'])
            obj.location = offset * factor
            count += 1
    
    return {
        "parts_affected": count,
        "factor": factor
    }

def export_glb(filepath: str = "output.glb", 
               export_animations: bool = False) -> dict:
    """
    Export current scene to GLB format.
    
    Args:
        filepath: Output file path
        export_animations: Whether to include animations
        
    Returns:
        dict with export result
    """
    bpy.ops.export_scene.gltf(
        filepath=filepath,
        export_format='GLB',
        export_materials='EXPORT',
        export_colors=True,
        export_animations=export_animations
    )
    
    return {
        "filepath": filepath,
        "format": "GLB",
        "success": True
    }

def list_parts() -> list[dict]:
    """
    List all parts in the scene with metadata.
    
    Returns:
        list of part metadata dicts
    """
    parts = []
    for obj in bpy.data.objects:
        if obj.type == 'MESH':
            parts.append({
                "name": obj.name,
                "location": list(obj.location),
                "scale": list(obj.scale),
                "has_explode": 'explode_offset' in obj
            })
    
    return parts

def get_scene_info() -> dict:
    """
    Get current scene metadata.
    
    Returns:
        dict with scene information
    """
    return {
        "name": bpy.context.scene.name,
        "objects_count": len(bpy.data.objects),
        "meshes_count": len([o for o in bpy.data.objects if o.type == 'MESH']),
        "materials_count": len(bpy.data.materials),
        "camera": bpy.context.scene.camera.name if bpy.context.scene.camera else None
    }
