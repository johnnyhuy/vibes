# ADR-0003: Blender MCP Lane for Agent-Driven 3D Workflows

**Status**: Accepted  
**Date**: 2026-09-07  
**Author**: Johnny Huynh

## Context

I'm exploring AI agent-driven 3D content creation workflows in the `vibes` monorepo. After studying viral demos (particularly [Legendaryy's Blender MCP demo](https://x.com/Legendaryy/status/2096510965789422001)), I need to decide how to structure the Blender integration lane.

**Key observations**:
1. Agents can autonomously install and use Blender MCP servers
2. Blender MCP is significantly faster and more reliable than Computer Use for GUI automation
3. The pattern (Blender scene → GLB export → Three.js viewer → Vercel deploy) is repeatable and valuable
4. Clean-room implementation is legally safer and educationally richer than copying assets

**Problem**: What's the best architecture for Blender integration in an agent-driven 3D workflow?

## Decision

**Blender MCP lane will follow a "scripts-first, MCP-ready" architecture**:

### 1. Standalone Python Scripts (Phase 1 — Current)

**What**: Self-contained `bpy` scripts that run with `blender --background --python script.py`.

**Why**:
- No external dependencies (just Blender installation)
- Educational (developers can read and learn from scripts)
- Testable (can be run manually or in CI)
- Agent-friendly (agents can generate/modify Python files)

**Examples**:
- `explode_assembly.py` — Motor assembly with explosion layout
- `semicircle_array.py` — 51 laptop-like objects in semicircular arc

**Export target**: GLB files for web viewers.

---

### 2. MCP Tool Wrappers (Phase 2 — Prepared)

**What**: MCP-compatible function signatures in `mcp_tools.py`.

**Why**:
- Demonstrates how Blender operations map to MCP tools
- Enables future MCP server integration without rewriting core logic
- Shows agents what functions they'd call via MCP

**Example**:
```python
def create_part(name, location, scale, color, explode_offset):
    """MCP-callable function for creating scene parts."""
    # Implementation using bpy
```

**Status**: Documented pattern, not a running MCP server (yet).

---

### 3. MCP Server Integration (Phase 3 — Future)

**What**: Full MCP server wrapping Blender operations (e.g., `ahujasid/blender-mcp` or custom).

**When**: After proving value with standalone scripts.

**Why deferred**:
- Scripts alone are sufficient for current demos
- MCP server setup adds complexity
- Want to validate workflow patterns first

**Prerequisites**:
- Clear use cases from scripts-first approach
- Understanding of which operations agents call most
- Decision on server implementation (adopt `ahujasid/blender-mcp` vs. build custom)

---

## Implementation Strategy

### Directory Structure

```
experiments/ai-3d-lanes/blender/
├── README.md                   # Setup instructions, MCP vs Computer Use comparison
├── explode_assembly.py         # Example: Motor assembly
├── semicircle_array.py         # Example: Laptop semicircle (NEW)
├── mcp_tools.py                # MCP-style function patterns
└── [future] mcp_server.js      # Actual MCP server (Phase 3)
```

### Web Viewer Integration

**Separate experiment folders** for web viewers (not inside `blender/`):
- `experiments/blender-semicircle-viewer/` — Three.js viewer for semicircle demo
- Future: `experiments/blender-product-viewer/` — Generic product configurator

**Why separate**:
- Blender scripts are Python/bpy focused
- Web viewers are JavaScript/Three.js focused
- Each has its own build system (Blender CLI vs. Vite)
- Cleaner deployment (each viewer is a Vercel project)

**Connection**: Blender scripts export GLB → web viewers load GLB (or use procedural fallback).

---

## Alternatives Considered

### Alternative 1: Computer Use Only

**Approach**: Agent controls Blender GUI via mouse/keyboard (e.g., Anthropic Computer Use).

**Pros**:
- Can access any Blender feature (including undocumented ones)
- No setup (just launch Blender)

**Cons**:
- **10-100x slower** than API calls (clicking through menus vs. direct bpy)
- **Brittle** (UI layout changes break scripts)
- **Not headless-friendly** (requires display server)
- **Hard to version control** (sequences of clicks vs. Python files)

**Verdict**: Good for exploration, terrible for production workflows.

---

### Alternative 2: MCP Server First

**Approach**: Build/install full MCP server before writing any Blender scripts.

**Pros**:
- "Proper" agent integration from day one
- Demonstrates MCP protocol usage

**Cons**:
- **Over-engineering** for current needs (scripts work fine)
- **Adds complexity** (MCP server setup, debugging stdio/HTTP)
- **Unclear value** (need to validate patterns first)

**Verdict**: Right end goal, wrong starting point. Build scripts first, MCP later.

---

### Alternative 3: Direct Three.js Only (No Blender)

**Approach**: Skip Blender entirely, generate all geometry procedurally in Three.js.

**Pros**:
- Simpler stack (just JavaScript)
- Faster iteration (no Blender export step)

**Cons**:
- **Limited geometry** (procedural primitives only, no complex CAD)
- **No advanced materials** (can't use Blender's shader nodes)
- **No rendering** (can't generate offline-rendered hero shots)
- **Missing the point** (I'm specifically exploring Blender MCP workflows)

**Verdict**: Fine for simple demos (already done in `web-3d`), but doesn't explore agent-driven CAD workflows.

---

## Rationale

### Why Scripts-First?

1. **Immediate value**: Scripts work today, no MCP setup required
2. **Educational**: Developers can read Python, learn bpy API
3. **Agent-ready**: Agents can generate/modify Python files
4. **Testable**: Run manually, in CI, or via agent
5. **Foundation**: Scripts become MCP server functions later

### Why MCP Eventually?

1. **Composability**: Agents can combine tools (`create_part` + `set_explode` + `export_glb`)
2. **Standardisation**: MCP protocol works across agents (Claude, GPT, custom)
3. **Discoverability**: MCP tool schemas tell agents what's possible
4. **Workflow orchestration**: Multi-step pipelines (scene → render → export → deploy)

### Why Separate Web Viewers?

1. **Different tech stacks**: Python/bpy vs. JavaScript/Three.js
2. **Different build systems**: Blender CLI vs. Vite
3. **Independent deployment**: Each viewer is a Vercel project
4. **Cleaner organisation**: Blender = 3D authoring, viewers = 3D presentation

---

## Consequences

### Positive

- ✅ **Immediate demos**: Scripts work without MCP server setup
- ✅ **Educational value**: Standalone scripts teach bpy fundamentals
- ✅ **Future-proof**: MCP integration path is clear
- ✅ **Clean separation**: Blender (authoring) vs. Three.js (presentation)

### Negative

- ❌ **Not "true" MCP yet**: Still calling scripts manually, not via MCP protocol
- ❌ **Manual GLB management**: Need to move GLB files from Blender output to web viewer
- ❌ **No auto-discovery**: Agents can't query "what Blender tools exist?" without reading files

### Mitigations

- Document MCP tool patterns in `mcp_tools.py` (shows future path)
- Add setup instructions for MCP servers (Phase 3 roadmap)
- Use consistent function signatures (easy to wrap in MCP later)

---

## Success Metrics

### Phase 1 (Scripts-First) — ✅ ACHIEVED

- [x] Working Blender scripts (`explode_assembly.py`, `semicircle_array.py`)
- [x] GLB export to web-compatible format
- [x] Companion Three.js viewer (`blender-semicircle-viewer`)
- [x] Documentation (README, reverse-engineering notes)

### Phase 2 (MCP-Ready) — 🚧 IN PROGRESS

- [x] MCP tool wrapper patterns (`mcp_tools.py`)
- [ ] Clear function signatures for common operations
- [ ] Agent-generated Python scripts (test with Claude/Cursor)

### Phase 3 (MCP Server) — 📋 PLANNED

- [ ] Install `ahujasid/blender-mcp` or build custom
- [ ] Agent successfully calls Blender via MCP
- [ ] End-to-end workflow (agent prompt → deployed website)

---

## Related Documentation

- `experiments/ai-3d-lanes/blender/README.md` — Implementation details
- `docs/reverse-engineering/blender-mcp-macbook-semicircle.md` — Workflow analysis
- `docs/visual-quality-bar.md` — UI standards for web viewers

---

## Review Schedule

**Re-evaluate after**:
- 3 more Blender scripts added (validates script-first approach)
- First agent-generated Blender script (tests agent-friendliness)
- Successful MCP server integration (validates Phase 3 path)

---

**Last updated**: 2026-09-07  
**Status**: Accepted (Phase 1 complete, Phase 2 in progress)
