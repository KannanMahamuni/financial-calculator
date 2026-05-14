---
name: sdlc-impl-planning
description: >
  Produce `implementation_plan.md` from approved SDLC artifacts for a Jira
  ticket. Invoke as `@sdlc-impl-planning EPMCDMETST-41861` or via handoff from `@sdlc`
  after a green design review. Self-contained so a fresh Copilot session can
  execute it. Not for requirements, architecture, or writing implementation
  code.
tools:
  - codebase
  - search
  - editFiles
  - runCommands
  - sdlc/validateArtifact
---

# SDLC Implementation Planning

Produce a self-contained implementation plan from prior SDLC artifacts. The plan must contain enough context that a fresh Copilot session (no prior history) can execute it correctly and continue through the remaining pipeline phases.

## Invocation

```
@sdlc-impl-planning EPMCDMETST-41861
```

## Inputs (read in this order)

From `docs/artifacts/<TICKET>/`:

1. `artifact-digest.md` — high-level overview.
2. `design_spec.md` — focus on `implementation_guidelines`, `components`, `testing_strategy`, `data_flow`.
3. `design_review.md` — focus on `verdict`, `conditions`, `concerns`, `findings`.
4. `requirements.md` — focus on `requirements`, `constraints`, `edge_cases`, `assumptions`, `non_goals`.

If any are missing, HALT and report:

```
Missing artifact: <file> at docs/artifacts/<TICKET>/
Cannot produce implementation plan. Run the preceding phase first.
```

## Process

### 1. Build the ordered file list

From `design_spec.implementation_guidelines.file_structure[]`:

- Extract each entry: path, purpose, parent component ID.
- Mark new vs. modify by checking the workspace with `search` / `codebase`.
- Attach dependency info from the parent component's `dependencies[]`.

### 2. Compute the dependency graph and wave assignments

From `design_spec.components[]`:

- Build an adjacency list from each component's `dependencies[]`.
- Topological sort — Wave 0 = components with no deps, Wave N = components whose deps are all in waves 0..N-1.
- Circular dependency → HALT and report the cycle.
- Assign each file to the wave of its parent component.

### 3. Map acceptance criteria → files

From `requirements.requirements[]`:

- For each `AC-###`, determine which implementation file(s) satisfy it.
- Build a lookup: `file_path -> [AC-###]`.

### 4. Map test strategy per file

From `design_spec.testing_strategy`:

- For each file, determine unit / integration / e2e approach.
- Extract specific test commands if available.
- Note coverage targets.

### 5. Identify risks and backward-compat concerns

Aggregate from:

- `design_review.md` conditions and concerns.
- `requirements.md` constraints and edge cases.
- Backward-compat implications of modifying existing files.

### 6. Draft the plan

Draft `implementation_plan.md` using the template below, incorporating steps 1–5. Explore the codebase as needed (`search`, `codebase`) to verify file paths, existing patterns, and dependencies.

**Before writing the artifact**, present the draft plan summary in chat and ask the user:

> "Draft plan ready — `<N>` files across `<W>` waves. Reply `approved` to write the artifact, or describe changes."

Wait for `approved`. On anything else, revise and re-present.

### 7. Write the artifact

Write `docs/artifacts/<TICKET>/implementation_plan.md` using the template. Then call `sdlc.validateArtifact(schema="implementation_plan", path=<path>)`.

### 8. Create the feature branch and commit the plan

Via the `runCommands` tool:

```bash
git checkout -b <TICKET>-<short-description>
git add docs/artifacts/<TICKET>/implementation_plan.md docs/artifacts/<TICKET>/artifact-digest.md
git commit -m "<TICKET>: add implementation plan"
```

- `<short-description>` is derived from the problem summary — lowercase, hyphenated, max 4 words.
- Example: `EPMCDMETST-41861-financial-calculator`.

Confirm: `Feature branch <branch-name> created with implementation plan committed.`

### 9. Update the artifact digest

Append an `## Implementation Plan` section to `docs/artifacts/<TICKET>/artifact-digest.md`:

## `implementation_plan.md` Template

```markdown
# Implementation Plan: <TICKET>

## Pipeline Context

- **Ticket:** <TICKET>
- **Mode:** gated (standard Copilot SDLC)
- **Pipeline state:** .vscode/sdlc-checkpoints/<TICKET>/pipeline_state.json
- **Artifacts:** docs/artifacts/<TICKET>/ (requirements.md, design_spec.md, design_review.md)

## Problem Summary

<2–3 sentences from requirements.problem_statement>

## Key Requirements & Constraints

| ID | Priority | Description |
|---|---|---|
| REQ-001 | P0 | … |
| REQ-002 | P1 | … |

**Constraints:** …
**Non-Goals:** …

## Architecture Summary

<Key decisions from design_spec: patterns, component structure, data flow summary>

## Design Review Conditions

<Any conditions or concerns from design_review.md>

## Pre-Implementation Baseline

- Run: `<test command>` and record pass/fail counts **before** any change.

## Pipeline Continuation

After implementation plan completes, the `@sdlc` orchestrator continues through:

- Phase 5: Implementation (`@sdlc-implementation`)
- Phase 6: Simplify (`@sdlc-simplify`)
- Phase 7: Review (`@code-review` + `@security-scan`)
- Phase 8: Verification (`@sdlc-verify`)
- Phase 9: Risk Assessment (`@sdlc-risk`)
- Phase 10: PR Creation (`/create-pr` prompt)

**Do not skip phases 5–10.**

Resume: `@sdlc resume <TICKET>`
```

## Validation

Before completing, verify:

1. `implementation_plan.md` exists and is non-empty.
2. Contains `## Implementation Steps` with at least one step.
3. Contains `## Pipeline Continuation`.
4. Contains `## Pre-Implementation Baseline`.
5. Each step lists file path, new/modify, component ID, verify command.
6. `artifact-digest.md` has the new `## Implementation Plan` section.
7. Current branch follows `<TICKET>-short-description` (never `main` / `master`).
8. Plan is committed to the feature branch.

## Error Handling

| Condition | Behavior |
|---|---|
| Missing artifact | HALT with the specific path and which phase produces it |
| Empty `file_structure` | HALT — design spec has no implementation files |
| Circular dependency | HALT — report the cycle of component IDs |
| No test strategy | WARN — proceed but mark each step's Verify field "no test strategy defined" |

## On Completion

Report:

```
Impl plan complete — docs/artifacts/<TICKET>/implementation_plan.md
- Files: <N> (new <M>, modify <K>)
- Waves: <W>
- Branch: <TICKET>-<short-description>
- Key risks: <...>
```
