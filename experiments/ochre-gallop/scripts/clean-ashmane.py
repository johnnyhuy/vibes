"""Clean Poly Haven Horse Statue 01 into the chase-ready Ashmane GLB.

Run from a machine with Blender 4.x:

    blender -b -P experiments/ochre-gallop/scripts/clean-ashmane.py

Expects the 2k glTF folder at /tmp/horse-gltf (see ATTRIBUTION.md).
"""

from __future__ import annotations

import math
from pathlib import Path

import bpy
from mathutils import Vector

SRC = Path("/tmp/horse-gltf/horse_statue_01_2k.gltf")
DST = Path(__file__).resolve().parents[1] / "public" / "models" / "ashmane.glb"
PREVIEW = Path("/tmp/horse-src/ashmane-preview.png")
TARGET_HEIGHT = 1.72


def reset_scene() -> None:
    bpy.ops.wm.read_factory_settings(use_empty=True)


def mesh_objects():
    return [obj for obj in bpy.data.objects if obj.type == "MESH"]


def world_bounds(objects):
    mins = Vector((math.inf, math.inf, math.inf))
    maxs = Vector((-math.inf, -math.inf, -math.inf))
    for obj in objects:
        for corner in obj.bound_box:
            world = obj.matrix_world @ Vector(corner)
            mins.x = min(mins.x, world.x)
            mins.y = min(mins.y, world.y)
            mins.z = min(mins.z, world.z)
            maxs.x = max(maxs.x, world.x)
            maxs.y = max(maxs.y, world.y)
            maxs.z = max(maxs.z, world.z)
    return mins, maxs


def apply_transforms(obj) -> None:
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)


def separate(obj, kind: str) -> None:
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.separate(type=kind)
    bpy.ops.object.mode_set(mode="OBJECT")


def is_wood_or_named_base(obj) -> bool:
    name = obj.name.lower()
    mats = " ".join(slot.material.name.lower() if slot.material else "" for slot in obj.material_slots)
    return "base" in name or "wood" in mats or mats.endswith("_base") or "_base" in mats


def is_disc(obj) -> bool:
    mins, maxs = world_bounds([obj])
    size = maxs - mins
    span_xy = max(size.x, size.y)
    return size.z < 0.016 and span_xy > 0.05


def polish_materials() -> None:
    for mat in bpy.data.materials:
        if not mat.use_nodes:
            continue
        principled = next((node for node in mat.node_tree.nodes if node.type == "BSDF_PRINCIPLED"), None)
        if not principled:
            continue
        if "Roughness" in principled.inputs:
            principled.inputs["Roughness"].default_value = 0.58
        if "Metallic" in principled.inputs:
            principled.inputs["Metallic"].default_value = 0.0
        if "Specular IOR Level" in principled.inputs:
            principled.inputs["Specular IOR Level"].default_value = 0.32
        if "Coat Weight" in principled.inputs:
            principled.inputs["Coat Weight"].default_value = 0.08
        if "Coat Roughness" in principled.inputs:
            principled.inputs["Coat Roughness"].default_value = 0.4


def render_preview(horses) -> None:
    PREVIEW.parent.mkdir(parents=True, exist_ok=True)
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 960
    scene.render.resolution_y = 540
    scene.render.filepath = str(PREVIEW)
    scene.render.image_settings.file_format = "PNG"
    cam_data = bpy.data.cameras.new("PreviewCam")
    cam_data.lens = 45
    cam = bpy.data.objects.new("PreviewCam", cam_data)
    scene.collection.objects.link(cam)
    scene.camera = cam
    cam.location = (2.15, -2.85, 1.15)
    direction = Vector((0.0, 0.15, 0.78)) - cam.location
    cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    light_data = bpy.data.lights.new("Key", "SUN")
    light_data.energy = 6
    light = bpy.data.objects.new("Key", light_data)
    scene.collection.objects.link(light)
    light.rotation_euler = (math.radians(48), 0, math.radians(35))
    fill_data = bpy.data.lights.new("Fill", "AREA")
    fill_data.energy = 80
    fill = bpy.data.objects.new("Fill", fill_data)
    scene.collection.objects.link(fill)
    fill.location = (-1.6, 1.4, 1.8)
    world = bpy.data.worlds.new("PreviewWorld")
    scene.world = world
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs[0].default_value = (0.16, 0.09, 0.05, 1)
    world.node_tree.nodes["Background"].inputs[1].default_value = 0.45
    bpy.ops.render.render(write_still=True)
    print("preview", PREVIEW, "horses", len(horses))


def main() -> None:
    reset_scene()
    bpy.ops.import_scene.gltf(filepath=str(SRC))

    for obj in list(mesh_objects()):
        separate(obj, "MATERIAL")

    for obj in list(mesh_objects()):
        if is_wood_or_named_base(obj) and not any(
            slot.material and "horse_statue_01" == slot.material.name for slot in obj.material_slots
        ):
            bpy.data.objects.remove(obj, do_unlink=True)

    # Material split can leave the porcelain object still named *_base. Prefer the
    # slot that is not the wooden puck, then split islands.
    remaining = mesh_objects()
    if len(remaining) == 1:
        separate(remaining[0], "MATERIAL")

    porcelain = []
    for obj in list(mesh_objects()):
        mats = [slot.material.name if slot.material else "" for slot in obj.material_slots]
        if any(name.endswith("_base") and "horse_statue_01_base" == name for name in mats) and len(obj.data.vertices) < 800:
            bpy.data.objects.remove(obj, do_unlink=True)
            continue
        porcelain.append(obj)

    for obj in list(mesh_objects()):
        separate(obj, "LOOSE")

    kept = []
    dropped = []
    for obj in list(mesh_objects()):
        if is_disc(obj):
            dropped.append(obj.name)
            bpy.data.objects.remove(obj, do_unlink=True)
        else:
            kept.append(obj)

    print("kept", len(kept), "dropped discs", dropped)
    if not kept:
        raise SystemExit("no horse islands left")

    root = bpy.data.objects.new("Ashmane", None)
    bpy.context.scene.collection.objects.link(root)
    for obj in kept:
        obj.parent = root
        obj.name = obj.name.replace("horse_statue_01", "ashmane")

    mins, maxs = world_bounds(kept)
    size = maxs - mins
    print("size before orient", [round(c, 4) for c in size])
    if size.x > size.y * 1.05:
        root.rotation_euler[2] = math.radians(-90)
    bpy.context.view_layer.update()

    mins, maxs = world_bounds(kept)
    height = maxs.z - mins.z
    if height > 1e-6:
        root.scale *= TARGET_HEIGHT / height
    bpy.context.view_layer.update()

    mins, maxs = world_bounds(kept)
    center = (mins + maxs) * 0.5
    root.location.x -= center.x
    root.location.y -= center.y
    root.location.z -= mins.z
    bpy.context.view_layer.update()

    for obj in list(mesh_objects()) + [root]:
        apply_transforms(obj)

    polish_materials()
    render_preview(mesh_objects())

    mins, maxs = world_bounds(mesh_objects())
    print("final bounds", [round(c, 4) for c in mins], [round(c, 4) for c in maxs])
    print("final meshes", len(mesh_objects()), "verts", sum(len(obj.data.vertices) for obj in mesh_objects()))

    DST.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=str(DST),
        export_format="GLB",
        export_texcoords=True,
        export_normals=True,
        export_materials="EXPORT",
        export_cameras=False,
        export_lights=False,
        export_apply=True,
    )
    print("wrote", DST, DST.stat().st_size)


if __name__ == "__main__":
    main()
