---
mode: agent
description: >
  Final quality gate before PR creation. Runs the full test suite, checks for
  debug artefacts / TODOs / .only / .skip, validates EPAM-specific rules
  (no PII in logs, no .env committed, ticket ID in branch name), verifies
  git hygiene (rebase status), then hands off to `/create-pr`. Invoke as
  `/finishing-branch` when you think you're done.
tools:
  - codebase
  - search
  - runCommands
  - changes
  - problems
---

You are performing the final quality gate before PR creation. Verify the branch is truly ready — tests pass, code is clean, EPAM standards are met, git hygiene is correct.

## Iron Laws

- NEVER declare a branch done without running the full test suite.
- NEVER commit debug logs, TODO comments, or `.only()` / `.skip()` in the final state.
- NEVER push without checking the branch is rebased on latest main.
- NEVER create a PR without the Jira ticket in the branch name AND PR title.

| Excuse | Reality |
|---|---|
| "Tests passed earlier" | Code changed since then. Run tests NOW. |
| "It's just one TODO" | TODOs in PRs become permanent. Remove or convert to a Jira ticket. |
| "I'll rebase after the PR" | Merge conflicts in review waste reviewer time. Rebase now. |
| "The ticket ID is in the commits" | Policy requires it in branch name AND PR title. No exceptions. |

## Process

### Step 1 — Run the full test suite

Use the project's test command — detect automatically:

```bash
# Java
[[ -f pom.xml ]] && JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home mvn -B test
[[ -f build.gradle || -f build.gradle.kts ]] && ./gradlew test

# Node
[[ -f package.json ]] && { command -v yarn && yarn test || npm test; }

# Python
[[ -f pyproject.toml || -f pytest.ini ]] && pytest
```

- Tests fail → STOP. Do not proceed. Fix first.
- Tests pass → record counts and continue.

### Step 2 — Code cleanliness

Run these on all changed files:

```bash
# Debug statements
git diff main --name-only -- '*.ts' '*.tsx' '*.js' '*.jsx' '*.java' \
  | xargs grep -n 'console\.log\|console\.debug\|debugger\|System\.out\.print' 2>/dev/null

# TODO / FIXME / HACK
git diff main --name-only -- '*.ts' '*.tsx' '*.js' '*.jsx' '*.java' \
  | xargs grep -n 'TODO\|FIXME\|HACK\|XXX' 2>/dev/null

# .skip / .only in tests
git diff main --name-only -- '*.test.*' '*.spec.*' \
  | xargs grep -n '\.skip\|\.only' 2>/dev/null

# Commented-out code blocks (3+ consecutive // or # lines)
git diff main --name-only -- '*.ts' '*.tsx' '*.js' '*.jsx' \
  | xargs grep -cn '^[[:space:]]*//' 2>/dev/null | awk -F: '$2>=3{print $1}'
```

If any found — report them and ask the user whether to fix or proceed.

### Step 3 — EPAM-Specific Checks

```bash
# PII in log statements
git diff main -- '*.ts' '*.tsx' '*.js' '*.jsx' '*.java' \
  | grep -nE 'log(ger)?\.|console\.' \
  | grep -iE 'email|phone|name|address|user\.' 2>/dev/null

# .env references in source
git diff main -- '*.ts' '*.tsx' '*.js' '*.jsx' '*.java' \
  | grep -n '\.env' 2>/dev/null

# Hardcoded secrets patterns
git diff main \
  | grep -iE 'api[_-]?key|secret|password|token' \
  | grep -E '=\s*["\x27][^"\x27]{8,}["\x27]' 2>/dev/null
```

Additional manual checklist:

- [ ] If API schema changed: API docs / Postman / SDK noted for update.
- [ ] If cross-platform code: both platforms have implementations + guards.
- [ ] If migration added: rollback path documented.

### Step 4 — Git Hygiene

```bash
git branch --show-current                         # Branch name has ticket ID?
git log main..HEAD --oneline                      # Commits ahead of main
git diff main --name-only | grep '\.env$'         # No .env files staged
git fetch origin main && git log HEAD..origin/main --oneline   # Behind main?
```

If the branch is behind `main`:

```bash
git rebase origin/main
# Then re-run Step 1 (tests) — rebase can introduce regressions.
```

Do NOT auto-rebase — ask the user first.

### Step 5 — Verify Tests Include New Code

```bash
# Source files changed without corresponding test files
git diff main --name-only -- '*.ts' '*.tsx' '*.java' \
  | grep -vE '\.(test|spec)\.' \
  | while read f; do
      base=$(basename "$f" | sed 's/\.[^.]*$//')
      if ! git diff main --name-only | grep -qE "${base}\.(test|spec)\."; then
        echo "Missing test for: $f"
      fi
    done
```

If coverage on new business logic looks < 80% — flag to user.

### Step 6 — Pre-PR Summary

Present in chat:

```
## Branch Readiness Report

**Branch:** <branch-name>
**Ticket:** <TICKET>
**Tests:** <X passing, 0 failing>   (baseline: <Y passing>)
**Code cleanliness:** <clean | N issues found>
**EPAM checks:** <all pass | N items flagged>
**Git hygiene:** <clean | needs rebase>

**Ready for PR:** <Yes | No — N items need attention>
```

### Step 7 — Handoff to PR Creation

When all checks pass, run:

```
/create-pr
```

Pass the ticket ID and any SDLC artefact paths for inclusion in the PR body.

## Red Flags

**Never:**

- Proceed to PR creation with failing tests.
- Skip EPAM-specific checks (PII, `.env`, hardcoded secrets).
- Create a PR from `main` / `master`.
- Force-push without explicit user confirmation.

**Always:**

- Run tests fresh (not cached output).
- Check for debug artefacts.
- Verify Jira ticket ID in branch name.
- Present the readiness report before handoff.
