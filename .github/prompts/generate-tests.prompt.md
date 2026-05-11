---
mode: agent
description: >
  Generate complete, runnable tests for a source file or feature — Jest unit
  tests or Playwright E2E, selected based on target and intent. Supports Test-
  After (default) and TDD (test-first) modes. Invoke as `/generate-tests`
  with a file path or feature description.
tools:
  - codebase
  - search
  - editFiles
  - runCommands
---

You are generating tests for EPAM's JavaScript / TypeScript codebase. Produce **complete, runnable** test files that follow the project's existing conventions.

## Integration with SDLC

If invoked from within the SDLC pipeline, read `docs/artifacts/<TICKET>/design_spec.md` → `## Testing Strategy` **before** generating tests so coverage aligns with the approved design.

## Process

### 1. Understand the target

- Read the source file(s) to be tested.
- Identify all exported functions, classes, hooks, components.
- Note function signatures, types, and documented behaviour.
- Identify error / edge cases from the implementation.

### 2. Discover project conventions

```
- Look for existing *.test.ts / *.spec.ts files
- Check jest.config.* for setup files and module name mapper
- Check if @testing-library/react, msw, supertest, or other utilities are used
- Verify co-located vs. __tests__/ folder convention
- Identify TS config path aliases
```

### 3. Choose test type

**Jest unit tests** — for pure functions, utilities, services, hooks, controllers without a browser.

**Playwright E2E** — for user-facing flows, multi-page journeys, or when the request mentions "user flow", "browser", "E2E", "end-to-end".

**Both** — if the request explicitly asks for coverage at both layers.

### 4. Generate the tests

Use **TDD mode** (test-first) if:
- The user says "TDD", "test-first", "write tests before I implement".
- `design_spec.md` exists but implementation files do NOT yet exist.

In TDD mode — **Iron Law**: never generate passing tests against unwritten code. Tests MUST fail initially (import errors are expected). Read `requirements.md` AC and `design_spec.md` component definitions; produce a failing test per AC and per component responsibility. Do NOT write the implementation — that's the implementer's job.

Otherwise use **Test-After mode** (default) — add tests to improve coverage of existing code.

### 5. Write the files

- Jest: `<source-dir>/__tests__/<filename>.test.ts` **or** co-located per project convention.
- Playwright: `e2e/tests/<feature-name>.spec.ts` with page objects in `e2e/pages/`.

### 6. Report

```
Tests generated — <N> files

Created:
  - <path> — <what it covers>

Scenarios covered:
  - Happy path, edge cases, error cases, …

Coverage estimate: <X%> of <N> new statements
Run: <test command>
```

## What to Test

### Functions
1. Happy path — correct inputs → expected outputs.
2. Edge cases — empty arrays, zero, null, undefined, boundary values.
3. Error cases — invalid inputs, dependency failures, thrown errors.
4. Type narrowing — TS union types handled correctly.

### API handlers
1. Valid request → correct status + body.
2. Missing / invalid body → 400 with validation details.
3. Unauthorised → 401.
4. Resource not found → 404.
5. Dependency failure → 500 with a **safe** error message (no stack traces, no internal paths).

### React components
1. Renders without errors with required props.
2. Displays correct content based on props.
3. User interactions trigger the correct callbacks.
4. Loading and error states render correctly.
5. Accessibility — semantic roles and labels present.

### React hooks
1. Returns expected initial state.
2. State transitions are correct.
3. Cleanup functions are called.

## Quality Gates

Generated tests MUST:

- [ ] Be syntactically valid TypeScript.
- [ ] Import from the correct source path (respect tsconfig aliases).
- [ ] Not import test utilities that aren't already in the project dependencies.
- [ ] Call `jest.clearAllMocks()` in `beforeEach` when using mocks.
- [ ] Have descriptive `describe` / `it` labels that read as specifications.
- [ ] Not use `any` in test code without justification.
- [ ] Not hardcode implementation details that break on refactor.
- [ ] Not leave `.only` or `.skip` in the committed output.

## Anti-Patterns

- Mocks so heavy the test passes regardless of real logic — if you're about to write one, STOP and ask: "Would this catch a bug in the implementation?"
- Snapshot-testing whole components when a prop/callback assertion would do.
- Duplicating production logic in test setup.
- Testing the framework instead of the code (e.g. asserting React re-rendered).

## References

- EPAM test patterns: `references/org-test-patterns.md`
- Defensive programming: `references/defensive-programming-checklist.md`
