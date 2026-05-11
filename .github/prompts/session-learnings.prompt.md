---
mode: agent
description: >
  Analyse the current conversation for repeated corrections, missed workflow
  steps, or style preferences the user had to enforce. Propose minimal
  additions to `.github/copilot-instructions.md` so future sessions don't
  repeat the same mistakes. Invoke as `/session-learnings` (no args). Does
  NOT auto-edit — every change requires approval.
tools:
  - codebase
  - search
  - editFiles
---

You are analysing the current conversation to extract behavioural learnings that should be persisted into `.github/copilot-instructions.md` so future sessions do not repeat the same mistakes.

## Research-Backed Principle

Instruction files that are too verbose **hurt** agent performance and increase cost. Every instruction you propose must pass the **Minimality Test**:

> "Would removing this instruction cause the agent to make the same mistake again in a future session?"

If the answer is no — do NOT add it. Prefer zero updates over bloated ones.

## Step 1 — Scan for Learning Signals

Read through the conversation history and identify:

| Signal | Pattern | Example |
|---|---|---|
| Repeated correction | User says the same thing 2+ times | "I already told you to…" |
| Escalation language | User pushes for more effort | "think harder", "be more thorough", "check everything" |
| Missed workflow step | User points out a forgotten step | "you forgot to run the install script" |
| Wrong tool / approach | User redirects to a different tool | "use podman not docker" |
| Style correction | User corrects output format / style | "don't add emojis", "be more concise" |
| Missing knowledge | Agent didn't know a project convention | tool paths, naming, deploy steps |

For each signal, record:

- **What happened** — one sentence.
- **Root cause** — why the agent got it wrong (missing instruction? ignored instruction? incomplete thinking?).
- **Proposed fix** — minimal instruction that would prevent this in future.

## Step 2 — Check Existing Instructions

Before proposing any update, read the current instruction files:

1. `.github/copilot-instructions.md` (repo-scope, auto-loaded).
2. `.github/instructions/*.instructions.md` (scoped).
3. `~/.vscode/settings.json` → `github.copilot.chat.instructions` (user-scope).

For each proposed instruction:

- Already covered? Skip — the issue was ignoring it, not missing it.
- Contradicts an existing instruction? Flag for user decision.
- Too specific to this session? Generalise or skip.
- Obvious from general best practice? Skip.

## Step 3 — Draft the Update

Format each proposed addition as:

```
### <Section Name>

- **Instruction:** <minimal, imperative>
- **Reason:** one line — what went wrong without this
- **Signal:** quote from the conversation
```

Rules for the instruction text:

- **Imperative mood:** "Always run X after Y", not "You should consider running X".
- **Specific and actionable:** "Check required `##` section headers exist after modifying SDLC artifacts" — not "Remember to validate artifacts".
- **No filler:** no "please", "remember to", "it's important to" — just the instruction.
- **Under 2 sentences.** If it needs more, it's too complex for `copilot-instructions.md` — make it an agent / prompt file instead.

## Step 4 — Present to User for Approval

Show:

```
## Session Learnings Report

### Signals Detected
- <bulleted list>

### Proposed copilot-instructions.md Updates
- <each proposed instruction with reason>

### Skipped (already covered or too specific)
- <any signals that don't warrant a change>

Reply `approved` to apply (I'll edit the file in place), or tell me which ones to drop.
```

**Do NOT auto-edit.** Wait for explicit approval.

## Step 5 — Apply Approved Updates

After approval:

1. Edit `.github/copilot-instructions.md` with the approved instructions.
2. Place them in the most relevant existing section — or create a new section only if no existing section fits.
3. Do NOT create a "Session Learnings" dump section — integrate into the existing structure.
4. Verify the edit preserved valid Markdown.
5. Summarise: "Added <N> instructions to `<section>`. Please review the diff."

## Anti-Patterns (DO NOT do these)

- Adding instructions the user never corrected you on — that's speculation.
- Adding verbose explanations — instruction files are not documentation.
- Adding instructions that duplicate existing ones in different words.
- Creating a "lessons learned" or "session notes" section — integrate.
- Adding more than 5 instructions from a single session — prioritise top 5 by frequency / severity.
