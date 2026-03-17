---
name: cli-anything
description: Use when the user wants to build, refine, test, or validate a CLI-Anything harness for a GUI application or source repository. Follows the CLI-Anything methodology.
---

# CLI-Anything

Use this skill to build powerful, stateful CLI interfaces for open-source GUI applications. The goal is to let AI agents operate software designed for humans without a display or mouse.

## Methodology

Follow the methodology documented in [HARNESS.md](file:///c:/Agent-72/.claude/skills/cli-anything/HARNESS.md).

### Phase 1: Codebase Analysis
- Identify backend engine.
- Map GUI actions to API calls.
- Identify data model.
- Find existing CLI tools.
- Catalog command/undo system.

### Phase 2: CLI Architecture Design
- Choose interaction model (REPL + Subcommands).
- Define command groups.
- Design state model.
- Plan output format (Human + JSON).

### Phase 3: Implementation
- Python Click CLI.
- Unified REPL skin using `repl_skin.py`.
- Namespace package layout (`cli_anything.<software>`).

### Phase 4-6: Testing and Validation
- Plan tests in `TEST.md`.
- Implement unit and E2E tests (must invoke real software).
- Verify outputs programmatically.

## Key Principles
- **Use the real software** — Do not reimplement rendering/export in Python.
- **Fail loudly** — Provide clear error messages for agent self-correction.
- **JSON output** — Support `--json` for machine parsing.
- **Namespace packages** — Use PEP 420 for co-installable CLIs.
