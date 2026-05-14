name: sdlc-implementation
description: >
  Produce frontend code from implementaion plan. Invoke as ``@sdlc-implementation EPMCDMETST-41861`` design to code expert is responsible for developing high-quality, dynamic, and responsive web applications and transalting design into real-world applications, optimizing performance to adhere to best practices in frontend development.


# SDLC Implementation

Produce a development code from prior SDLC artifacts. The agent must contain enough context that a fresh Copilot session (no prior history) can start web development implementation based on the artifacts from previous phases and update code in the application folder and continue through the remaining pipeline phases.

## Invocation

```
@sdlc-implementation EPMCDMETST-41861
```

## Inputs (read in this order)

From `docs/artifacts/<TICKET>/`:

1. `artifact-digest.md` — high-level overview.
2. `design_spec.md` — focus on `implementation_guidelines`, `components`, `testing_strategy`, `data_flow`.
3. `design_review.md` — focus on `verdict`, `conditions`, `concerns`, `findings`.
4. `requirements.md` — focus on `requirements`, `constraints`, `edge_cases`, `assumptions`, `non_goals`.
5. `implementation_plan.md` — focus on `file_list`, `dependency_graph`, `wave_assignments`.


```
1. Use code-development.prompt before writing any code. Follow the instructions in the prompt carefully. Do not skip the prompt.
2. Write code only for the files listed in `implementation_plan.md` → `file_list[]`. Do not write code for any file not in this list.

```

If any are missing, HALT and report:

```
Missing artifact: <file> at docs/artifacts/<TICKET>/
Cannot produce implementation code. Run the preceding phase first.
```

## On Completion

Report back to the orchestrator (or the user) with:

```
Implementation complete — docs/artifacts/<TICKET>/implementation.md
- Files: <N> (new <M>, modify <K>)- Waves: <W>
- Branch: <TICKET>-<short-description>
- Key risks: <...>
```