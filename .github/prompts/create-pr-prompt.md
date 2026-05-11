---
mode: agent
description: >
  Open a pull request / merge request following EPAM standards. Auto-detects
  GitHub vs GitLab, runs pre-flight gates (security, risk, post-verification
  delta), extracts the Jira ticket, generates the title + body from the
  required template, and pushes the branch. Invoke as `/create-pr` (optionally
  with a ticket ID).
tools:
  - codebase
  - search
  - runCommands
  - editFiles
---

You are creating a pull request / merge request following EPAM's PR standards. Detect the git host and use the appropriate CLI: `glab` for GitLab (anything matching `gitlab|git.epam|git.garage.epam`), `gh` for GitHub.

## Pre-flight Checks

Run via `runCommands`:

```bash
# 1. Detect Git host + confirm CLI is authenticated
REMOTE_URL=$(git remote get-url origin)
if echo "$REMOTE_URL" | grep -qiE 'gitlab|git\.garage\.epam|git\.epam'; then
  glab auth status
else
  gh auth status
fi

# 2. Confirm not on main/master
BRANCH=$(git branch --show-current)
[[ "$BRANCH" == "main" || "$BRANCH" == "master" ]] && \
  { echo "ERROR: cannot create PR from main/master"; exit 1; }

# 3. Uncommitted changes?
git status --porcelain

# 4. Any commits ahead of main?
git log --oneline $(git merge-base HEAD origin/main)..HEAD
```

If there are **uncommitted changes**, stop and ask the user to commit or stash them first.

### Security Findings Gate (MANDATORY)

If `.vscode/sdlc-checkpoints/<TICKET>/security_audit.json` (or review findings in context) contains any **critical** finding that is unresolved — **BLOCK**:

```
BLOCKING: Unresolved CRITICAL security findings.
  - <file:line> <issue> — <remediation>
Fix the issues and re-run: @sdlc <TICKET> from=review
```

For **high** findings without explicit user acknowledgement: present them and require a chat response ("Acknowledge and proceed" / "Fix first") before continuing.

If no security results exist, proceed normally — not all PRs go through the SDLC pipeline.

### Risk Assessment Gate (MANDATORY)

If `.vscode/sdlc-checkpoints/<TICKET>/risk_assessment.md` exists:

1. Read the `## Recommendations` → `### MANDATORY_PRE_SHIP` table.
2. For each item, check the `Resolved` column.
3. If any row is `[ ]` (unresolved) — **BLOCK**:

```
BLOCKING: Unresolved MANDATORY_PRE_SHIP risk items.
  - REC-001: <action> (effort: X)
Options:
  A) Fix now and mark resolved in risk_assessment.md
  B) Explicitly accept the risk — add `resolved: true` + `resolved_notes: "ACCEPTED: <reason>"`
```

Do not proceed until every open item is addressed.

### Post-Verification Delta Gate (MANDATORY)

If `.vscode/sdlc-checkpoints/<TICKET>/pipeline_state.json` exists and has `phases.verification.implementation_sha`:

1. Run `git rev-parse HEAD`.
2. If it differs from the stored SHA, warn:

```
WARNING: Implementation changed after verification completed.
Commits since verification: <list>
Changed files: <list>
Options:
  A) Run the delta re-gate — re-invoke @sdlc-verify
  B) Confirm changes are trivial (whitespace / comments) and proceed
  C) Proceed and accept that post-verification changes are unreviewed
```

Require explicit acknowledgement in chat before proceeding.

## Extract Jira Ticket ID

**Required — traceability is mandatory per EPAM security policy.**

1. Try the branch name: `FINANCIALCALCULATOR-1234-add-social-login` → `FINANCIALCALCULATOR-1234`.
2. Otherwise, scan commit messages for `[A-Z]+-[0-9]+`.
3. Otherwise, **ask the user in chat**: "What is the ticket ID for this change? (e.g., `FINANCIALCALCULATOR-1234`)"

Do not proceed until a valid ticket ID is confirmed.

## Gather Context

```bash
# Commits on this branch (not in main)
git log --oneline --no-merges $(git merge-base HEAD origin/main)..HEAD

# Changed files
git diff --stat $(git merge-base HEAD origin/main)..HEAD

# Truncated diff for summary generation
git diff $(git merge-base HEAD origin/main)..HEAD -- '*.ts' '*.js' '*.tsx' '*.jsx' '*.java' '*.xml' '*.properties' '*.sql' '*.py' | head -200
```

## PR Title

Format: `<TICKET-ID>: <Short description>`

- Imperative mood, ≤ 72 chars, no trailing period.
- Examples:
  - `FINANCIALCALCULATOR-1234: Add social login button for Google`
  - `FINANCIALCALCULATOR-5678: Fix token expiry race condition on mobile`
  - `FINANCIALCALCULATOR-9012: Upgrade Spring Boot to 3.3.5`

If the branch name doesn't follow `<TICKET-ID>-short-description`, remind the user — but don't rename the branch without permission.

## PR Body — use this EXACT template

**IRON LAW:** use this structure exactly. Do NOT invent section headers. The security team requires this template with no exceptions. Sections with no relevant content get `N/A` — never skipped.

```markdown
### Jira Ticket Number
[<TICKET>](https://jiraeu.epam.com/browse/<TICKET>)

---

### Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (change that causes existing functionality to break)
- [ ] Other:

---

### Context

**Before:**
<previous behaviour>

**After:**
<new behaviour>

<any relevant background or motivation>

---

### Architecture Document (if applicable)
<ADR link, design doc link, or N/A>

---

### Evidence / Screenshots / Test Artifacts

| Before | After |
| ------ | ----- |
| <screenshot> | <screenshot> |

---

### Postman Collection / SDK Update (if applicable)
- [ ] Update the shared Postman collection
- [ ] Bump or update a relevant SDK
- [ ] Notify downstream consumers

---

### How Has This Been Tested?
- [ ] Unit tests added / updated and passing
- [ ] Integration tests added / updated and passing
- [ ] E2E tests added / updated and passing
- [ ] Manually tested locally
- [ ] Tested in staging / QA environment

---

### Checklist
- [ ] My code follows the project's coding and PR guidelines
- [ ] I have added or updated unit/integration tests
- [ ] All new and existing tests pass locally
- [ ] I have commented complex or non-obvious areas of the code
- [ ] I have added appropriate metrics/logs and will create alerts if required
- [ ] My code does not send any PII data in logs
- [ ] I have updated documentation as needed
- [ ] I have added a feature flag if this needs to be toggled across markets
- [ ] I have updated downstream dependencies if needed (e.g. SDKs, Postman, configs)
- [ ] Performed a self-review of my own code
- [ ] Added labels to test cases covered under this PR: `Automated_QA`
- [ ] Run all related tests involved with my code changes
- [ ] Removed all unnecessary comments and logs
- [ ] Checked that PR and Ticket have the same CBA number
- [ ] Removed any unused or duplicate code; reused functions for repeated patterns
- [ ] Added tests in the correct folder
- [ ] Checked that the covered test case runs in both QA and PROD environments
- [ ] Copilot used to create unit test cases (if applicable)
- [ ] Copilot used to generate code snippets (if applicable)
- [ ] Copilot used to generate documentation (if applicable)
- [ ] EliteA was used for QA Automation (if applicable)
- [ ] I have added/updated LaunchDarkly feature flags in this PR (if applicable)
- [ ] Observability: metrics, dashboards, monitors

---

### Anything else we should know?
<caveats, follow-up work, or N/A>
```

**Rules:**

- Fill in every section. Use `N/A` for non-applicable sections — never skip.
- Check boxes with `[x]` only where they apply.
- If SDLC artifacts exist, include verification score and monitoring recommendations in the Context section.

## Push and Create

```bash
git push -u origin $(git branch --show-current)

REMOTE_URL=$(git remote get-url origin)
if echo "$REMOTE_URL" | grep -qiE 'gitlab|git\.garage\.epam|git\.epam'; then
  glab mr create \
    --title "<TICKET>: <description>" \
    --description "$(cat <<'PREOF'
<generated PR body>
PREOF
)" \
    --target-branch main
else
  gh pr create \
    --title "<TICKET>: <description>" \
    --body "$(cat <<'PREOF'
<generated PR body>
PREOF
)" \
    --base main
fi
```

For work-in-progress, add `--draft` (both `gh` and `glab` accept it).

## After Creation

1. Display the PR URL prominently.
2. If UI changes — remind the user to attach screenshots / recordings to the Evidence section.
3. If API contract changed — remind them to update Postman collections / SDKs.
4. Offer to watch CI: `gh pr checks --watch` or `glab ci status`.
5. Offer to add reviewers: `gh pr edit --add-reviewer <user>` or `glab mr update <id> --reviewer <user>`.

## Safety Rules

- Never create a PR without a ticket ID.
- Never create a PR targeting a branch other than `main` unless the user explicitly says so.
- Never force-push during this flow.
- If the branch is behind `main`, ask whether to rebase first (do not auto-rebase).
- Never add `[skip ci]` to commit messages.

## PR Lifecycle (on request)

- Status: `gh pr status` / `gh pr checks` / `glab mr list --mine` / `glab ci status`.
- Add reviewers: `gh pr edit --add-reviewer <user>` / `glab mr update <id> --reviewer <user>`.
- Merge requirements (EPAM standard): ≥ 2 approvals (1 from CODEOWNERS), all CI passing, no conflicts, branch up to date, Jira ticket linked.
- Merge: `gh pr merge --squash --delete-branch` / `glab mr merge <id> --squash --remove-source-branch`.
