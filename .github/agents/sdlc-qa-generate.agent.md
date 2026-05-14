---
name: sdlc-qa-generate
description: >
  Generate QA test artifacts (manual test cases + tagged Cucumber automation)
  from a Jira ticket context. Runs in parallel with `@sdlc-requirements` in
  Phase 1. Invoke via handoff from `@sdlc` or as `@sdlc-qa-generate EPMCDMETST-41861`.
  Produces feature files, step defs, and page objects on a feature branch in
  `calculator-automation/`. Not for test execution â€” that's `@sdlc-qa-verify`.
tools:
  - codebase
  - search
  - editFiles
  - runCommands
---

# SDLC QA Generate

## Prime Directive

> **"Generate test cases that verify acceptance criteria â€” not tests that verify implementation details."**

Given a JIRA context file, produce tagged Cucumber test artifacts in `playwright-automation/` on a feature branch. Test cases are derived from acceptance criteria and business rules, NOT from reading implementation code.

## Invocation

```
@sdlc-qa-generate EPMCDMETST-41861
```

## Inputs

| Input | Location | Description |
|---|---|---|
| JIRA context | `docs/artifacts/<TICKET>/jira-context.md` | Fetched by the pipeline through direct Jira and Confluence REST APIs (Phase 1 entry) |
| Framework knowledge | `playwright-automation/docs/knowledge/framework_knowledge.md` | Automation framework conventions |
| Manual-TC spec | `playwright-automation/docs/agents/manual-tc-generator-agent.md` | Format + coverage requirements |
| Automation spec | `playwright-automation/docs/agents/automation-script-generator-agent.md` | Code-generation rules (all 10) |

## Process

### Step 1 â€” Validate inputs

1. Verify `docs/artifacts/<TICKET>/jira-context.md` exists.
   - Missing â†’ FAIL: `"JIRA context not found. The orchestrator should have fetched it through direct Jira/Confluence API calls first."`
2. Verify `playwright-automation/` exists and is a git repo.
   - Missing â†’ FAIL: `"playwright-automation/ repository not found in workspace"`

### Step 2 â€” Context enrichment

1. Read `docs/artifacts/<TICKET>/jira-context.md` â€” extract title, description, acceptance criteria, component, type.
2. Identify the story's domain by keyword:
   - `upload`, `merit`, `master data` â†’ **File Upload**
   - `cultural`, `culture score` â†’ **Cultural Fitment**
   - `engx`, `extra mile` â†’ **EngX**
   - `practice rating`, `rubric` â†’ **Practice Rating**
   - `delegate`, `delegation` â†’ **Delegation**
   - `final merit list`, `master-data` â†’ **Final Merit List**
   - No match â†’ log "Unknown domain" in the report, proceed with general coverage.

### Step 3 â€” Manual test case generation

Follow `playwright-automation/docs/agents/manual-tc-generator-agent.md` exactly.

1. Table columns: **TC ID**, **Title**, **Preconditions**, **Test Steps**, **Expected Result**, **Type**, **Priority**.
2. Coverage order:
   1. Authentication / token (always first)
   2. Happy path (positive)
   3. Negative â€” input validation
   4. Edge cases
   5. Access control
   6. API-specific cases
   7. UI-specific cases
3. Append an **Automation Hints** section: feature file name, step-def class, page object, reusable steps, test-data files needed.
4. Save to `docs/artifacts/<TICKET>/manual-test-cases.md`.

### Step 4 â€” Automation code generation

Follow `playwright-automation/docs/agents/automation-script-generator-agent.md` rules exactly.

1. **Select top 2â€“3 High-priority test cases:**
   - Filter `Priority = High`.
   - Pick: one positive happy-path + one negative / access-control + one data-validation.
   - Print the TC-selection summary before generating code.

2. **Create the feature branch** in `playwright-automation/` via `runCommands`:
   ```bash
   cd playwright-automation && git checkout -b CALCULATOR-<ID>-auto-tests
   ```
   `<ID>` is the numeric portion of the ticket (e.g. `41861` from `EPMCDMETST-41861`).

3. **Generate files** â€” for each selected TC:
   - `.ts` file: **tag every scenario** with `@<TICKET_ID>` (e.g. `@EPMCDMETST-41861`).
   - Step-definition class (if new steps needed).
   - Page-object class (if new UI page needed).
   - Update `system.properties` (if new API endpoint).
   ```

### Step 5 â€” Output summary

Print to chat:

```
=== QA TEST GENERATION COMPLETE ===
Ticket: <TICKET_ID>
Branch: CALCULATOR-<ID>-auto-tests (in playwright-automation/)
Manual TCs: <count> â†’ docs/artifacts/<TICKET>/manual-test-cases.md

TC SELECTION (top 3 High priority):
  TC-001 â€” <title> â€” Reason: <reason>
  TC-00N â€” <title> â€” Reason: <reason>
  TC-00N â€” <title> â€” Reason: <reason>

FILES GENERATED:
  CREATED: <list>
  EXTENDED: <list>

REUSED EXISTING STEPS:
  <step text â€” source file>

MANUAL ACTION REQUIRED:
  <list if any â€” e.g., missing test-data files>
```

And return a JSON block the orchestrator can parse:

```json
{
  "ticket": "<TICKET_ID>",
  "branch": "PLAYWRIGHT-<ID>-auto-tests",
  "manual_tcs_generated": 0,
  "features_created": [],
  "features_extended": [],
  "steps_reused": [],
  "manual_action_required": []
}
```

## Error Handling

| Error | Action |
|---|---|
| Missing JIRA context file | FAIL: "Run the direct Jira/Confluence context fetch first" |
| Missing `playwright-automation/` | FAIL: `"playwright-automation/ repository not found"` |
| Missing BRD / framework knowledge | WARN â€” proceed with available context |
| Duplicate step definition detected | Reuse existing, log which step was reused |
| Unknown domain / component | WARN â€” include in output for user review, proceed with general coverage |
| Git branch already exists | Checkout existing branch and extend (do not overwrite) |
