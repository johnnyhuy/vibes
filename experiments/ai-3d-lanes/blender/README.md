# blender

Blender scripting lane for programmatic 3D scene creation and MCP integration.

## What's Here

- **explode_assembly.py** — Standalone bpy script creating an exploded motor assembly
- **mcp_tools.py** — MCP-style tool wrappers for Blender operations

## Running the Script

### With Blender Installed

```bash
blender --background --python explode_assembly.py
```

This creates `assembly_exploded.glb` in the current directory.

### Without Blender

The script is self-documenting — read it to understand the approach. Blender isn't required for this repo; the lane demonstrates programmatic 3D workflows.

## Blender MCP vs Computer Use

### Computer Use Approach
- **How it works**: AI controls mouse/keyboard to interact with Blender GUI
- **Pros**: Can use any Blender feature, no integration needed
- **Cons**: Slow, brittle (UI changes break it), hard to version control, can't run headless
- **Use case**: One-off tasks, exploring unfamiliar tools

### Blender MCP Approach
- **How it works**: AI calls Python functions (bpy API) via MCP protocol
- **Pros**: Fast, reliable, versionable, headless-friendly, composable
- **Cons**: Requires MCP server setup, limited to exposed functions
- **Use case**: Repeatable workflows, automation, agent-driven pipelines

### Verdict
**MCP wins for production workflows.** Computer use is great for exploration and learning, but MCP provides the speed and reliability needed for real work.

### Reference Implementation
**ahujasid/blender-mcp** — Blender MCP server exposing core bpy operations as MCP tools. Agents can:
- Create primitives and meshes
- Apply materials and modifiers
- Set up cameras and lighting
- Export to GLB/FBX/STL
- Query scene state

## MCP Tool Wrappers

`mcp_tools.py` shows how Blender operations can be structured as MCP-compatible functions:

```python
create_part(name, location, scale, color, explode_offset)
set_explode(factor)
export_glb(filepath)
list_parts()
get_scene_info()
```

These could be exposed via an MCP server for agent consumption.

## Extending This Lane

1. Add more complex geometry (boolean ops, curves, modifiers)
2. Implement animation keyframing
3. Add material node graph construction
4. Create physics simulations
5. Build a full MCP server wrapper

## Resources

- [Blender Python API (bpy) docs](https://docs.blender.org/api/current/)
- [ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp) — MCP server reference
- [Blender CLI docs](https://docs.blender.org/manual/en/latest/advanced/command_line/arguments.html)
