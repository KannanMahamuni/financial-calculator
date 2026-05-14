# EPAM â€” Copilot SDLC Pack

Auto-applied repository instructions for GitHub Copilot. Loaded by Copilot Chat (Agent mode) for every request in this workspace.

## Organization Identity

You are assisting investors to calculate their financial metrics for mutual funds investment and retirement planning investments for National Pension Scheme.

**Stack:** Java 17 (Spring Boot 3.3.5) + React 18 | **CI/CD:** GitLab CI | **Cloud:** GCP | **Tickets:** Jira (`EPMCDMETST-` prefixes)

## Core Behavioral Principles

1. **Security-first.** Never commit secrets, credentials, or PII. Flag any discovered secrets immediately.
2. **Minimal blast radius.** Prefer targeted, reversible changes. Ask before touching shared infrastructure. Use `trash` over `rm` for deletions.
3. **Explain, don't just do.** For non-trivial changes, briefly explain reasoning before making them.
4. **Fail loud, fail safe.** Surface errors clearly rather than silently swallowing them.
5. **Least privilege.** Minimal IAM permissions; never suggest `*` resource wildcards.
6. **Backward compatible by default.** Additive over subtractive. Never remove defaults without blast radius check.

## Forbidden Actions

- `git push --force` to `main`, `master`, or any release branch
- Creating a PR without a Jira ticket ID
- Committing `.env` files, AWS/GCP credentials, API keys, private certificates, or passwords
- Logging PII (email, phone, name, address, payment data) to any monitoring tool
- Processing IP addresses without using the approved IP address library
- Using user data before consent is confirmed
- Dropping / truncating database tables without explicit, confirmed user instruction
- Disabling CI checks (`--no-verify`, `ci skip`) unless the user explicitly confirms
- Generating or guessing internal URLs, account IDs, or region values
- Deleting files or directories with `rm` â€” use `trash` or confirm with the user first

## SDLC Pipeline

This workspace ships a 10-phase gated pipeline. Entry point: `@sdlc` in Copilot Chat (Agent mode).

```
@sdlc EPMCDMETST-41861                     # start the pipeline for a ticket
@sdlc resume EPMCDMETST-41861              # resume from last checkpoint
@sdlc EPMCDMETST-41861 from=architecture   # start at a specific phase
```

Phases and their agents:

| # | Phase | Agent | Artifact |
|---|-------|-------|----------|
| 1 | Requirements | `@sdlc-requirements` | `docs/artifacts/<TICKET>/requirements.md` |
| 2 | Architecture | `@sdlc-architecture` (handoff â†’ `@architect`) | `design_spec.md` + ADR |
| 3 | Design review | `@sdlc-design-review` | `design_review.md` |
| 4 | Impl planning | `@sdlc-impl-planning` | `implementation_plan.md` |
| 5 | Implementation | `@sdlc-implementation` | `implementation.md`|
| 6 | Simplify | `@sdlc-simplify` | refactored files |
| 7 | Review | parallel: `@code-review`, `@security-scan` | review notes |
| 8 | Verify | `@sdlc-verify` | coverage matrix |
| 9 | Risk | `@sdlc-risk` | ship/no-ship recommendation |
| 10 | PR | `/create-pr` prompt | GitHub/GitLab PR |

Phase transitions are **gated**: at the end of each phase the agent asks for approval. Reply `approve` / `continue` to proceed, `reject` / `revise` to rework.

## Branch & PR Naming

Every change must be traceable to a Jira ticket:

- **Branch:** `<TICKET-ID>-short-description` (e.g., `EPMCDMETST-41861-calculator-api`)
- **PR title:** `<TICKET-ID>: Short description`
- **PR body:** must link the Jira ticket â€” required by security team, no exceptions.

## Code Conventions

- Java/Spring Boot: see `references/lang/java-spring-boot.md`
- Shared rules: `references/shared-rules.md`
- Defensive programming: `references/defensive-programming-checklist.md`

## PII & Data Privacy

- Anonymize when PII must be observed (hash user IDs before logging).
- Trace full data flow before logging any object â€” nested objects may contain PII.

## Observability

- Every service change: document required metrics and alerting thresholds in the design spec.
- Structured logs only â€” never `console.log(object)` in production. SLF4J/Logback for Java, JSON-formatted console for Node.
- Feature flags: not used in this project.
- Update Swagger when API shapes change.

## Architecture Context

- **Backend:** Java 17 Spring Boot 3.3.5 on port 80 (Maven)
- **Frontend:** React 18 CRA with Redux Toolkit + EPAM UUI, port 3000
- **Database:** PostgreSQL 16 (Podman container)

## Implementation Safety Rules

1. **Test baseline first.** Run full test suite before modifying ANY file. Record pass/fail counts.
2. **Test after each file change.** Don't batch changes and test at the end.
3. **Never remove defaults without checking blast radius.** Grep all usages; run tests first.
4. **Use `git stash` to verify baseline.** If unsure whether failures are pre-existing: stash, test, pop.
5. **Logging costs money.** Add logging only where it provides actionable information.
6. **Check infrastructure impact.** Health endpoints, startup sequences, API response shapes.

## Extension: SDLC Guards (mandatory invocation)

The `vscode-extension-sdlc-guards` extension (installed via `.vsix`) contributes three **language-model tools**. Copilot does not intercept agent actions automatically â€” **agents must invoke these tools explicitly** before the matching sensitive operation. Skipping them counts as a policy violation and should be reported back in chat if an agent notices a missed check.

| Tool | Call BEFORE | If `blocked = true` |
|---|---|---|
| `#sdlc_prompt_guard` | Passing any user-supplied text into a tool that leaves the workspace (HTTP call, commit, PR body, Slack message) OR writing potentially sensitive text to a file | Refuse to proceed; ask the user to redact the input |
| `#sdlc_env_guard` | Reading / editing / writing any file whose name matches `*.env*`, running any shell command that references `.env`, or globbing for `.env` files | Refuse to run the original tool call; ask the user for the specific non-secret value instead |
| `#sdlc_command_guard` | Executing any shell command via the terminal / run-command tool | Refuse to run the command; explain the risk |

**Allowlist for `sdlc_env_guard`:** `.env.example`, `.env.sample`, `.env.template` (these do not contain secrets).

If the extension is not installed, the tools are unavailable â€” agents must then fall back to the forbidden-actions rules above and decline sensitive operations themselves. The `scripts/setup-project.sh` script checks for the extension and warns if it is missing.

**Never chat a sensitive value back to the user even as "verification".** If `sdlc_prompt_guard` finds a credential, do not echo the value â€” reference it by category (e.g. "an AWS Access Key was detected near line 42").

## Workspace Tools

Configured in `.vscode/mcp.json`. Available in Agent mode:

- `sdlc.validateArtifact(schema, content)` â€” JSON-schema validation for generated artifacts.
- `sdlc.saveCheckpoint(ticket, phase, state)` / `sdlc.loadCheckpoint(ticket)` â€” pipeline state persistence under `.vscode/sdlc-checkpoints/`.
- `sdlc.computeCoverage(reqs, tests)` â€” Phase 8 requirement-coverage matrix.
- Playwright â€” browser automation (E2E test authoring, DOM inspection).

## Jira And Confluence API Access

Jira and Confluence access must use direct Atlassian REST APIs, not MCP-backed Atlassian tools.

- Read local configuration from `.vscode/atlassian-api.local.json` only. Seed it from `.vscode/atlassian-api.local.template.json`.
- `.vscode/atlassian-api.local.json` must stay gitignored and must never be copied into prompts, commits, PR bodies, or artifacts.
- Treat Atlassian tokens as user-supplied secrets. Never echo them back in chat, logs, files, or tool arguments visible to the user.
- Before any outbound Jira or Confluence API call that contains user-supplied text, invoke `sdlc_prompt_guard`.
- Use direct REST calls for both reads and updates when the active client supports outbound HTTP. If direct API tooling is unavailable in the client, ask the user to provide sanitized exported context instead of falling back to MCP for Atlassian access.
- Default to read-only behavior. Perform Jira or Confluence updates only when the user explicitly asks for them or the phase contract clearly requires a write.

## Dependencies (VS Code)

Recommended extensions â€” install before running `@sdlc`:

- `github.copilot-chat` (Agent mode required)
- `dbaeumer.vscode-eslint` (replaces the deprecated `eslint-on-save` hook)
- `ms-playwright.playwright` (test authoring aid)
- Local: `vscode-extension-sdlc-guards` (safety guards; install via `.vsix`)

## Per-Team Customization

Each team creates a `.github/copilot-instructions.local.md` that extends this file with project-specific context (GCP project ID, service name, team lead). This pack never contains team-specific secrets, account IDs, or URLs.

## Response Style

- Concise. Bullet points over paragraphs.
- Code blocks for all code, config, commands.
- When unsure, ask â€” don't guess at org-specific details.
- Flag security concerns immediately.
