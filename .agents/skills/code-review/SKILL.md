---
name: code-review
description: Multi-agent code review that analyzes a diff or branch for correctness bugs, security vulnerabilities, broken edge cases, and subtle regressions. Use when the user asks to "review code", "review a PR", "review the diff", "do a code review", or wants changes checked before merging. Focuses on real bugs, not style or lint.
---

# Code Review

Inspired by Claude Code's [Code Review](https://code.claude.com/docs/en/code-review#how-reviews-work): a fleet of specialized reviewers examines the change in the context of the full codebase, each looking for a different class of issue, then a verification step filters false positives before findings are deduplicated, ranked by severity, and reported with `file:line` citations.

## Scope

Determine what to review, in order of preference:

1. **Explicit target**: the file, path, branch, or ref range the user names (e.g. `main...my-feature`).
2. **Default**: the current diff — uncommitted changes plus commits on this branch ahead of its upstream, i.e. `git diff` plus `git diff <upstream>...HEAD`.

Use `git status`, `git diff`, `git log`, and `git merge-base` to establish the exact scope before reviewing, and state it in the summary.

## Workflow

### 1. Context

- Read `AGENTS.md` (and any `CLAUDE.md`) for project conventions and verification commands.
- Read changed files in full, not just the diff hunks, so findings are grounded in real behavior. Follow imports to understand actual runtime behavior.
- Identify generated files (e.g. `lib/generated/prisma`, `package-lock.json`, `tsconfig.tsbuildinfo`, `.next/`) and exclude them from findings.

### 2. Fan out

Launch **parallel subagents** — one per issue class (at least 3, at most 6) — using your environment's subagent or task tool, so each reviewer runs with its own context window. Give every subagent:

- the diff content and the list of changed files up front,
- the project conventions from `AGENTS.md`,
- instructions to open the cited files and verify behavior before reporting,
- the reporting rules below (evidence bar, no style nits, `file:line` citations).

Recommended issue classes:

- **Correctness**: wrong logic, off-by-one, inverted conditions, null/undefined derefs, race conditions, incorrect state transitions, error paths that swallow failures.
- **Security**: auth bypasses, IDOR / missing authorization checks, unsafe SQL, missing input validation, PII in logs or error messages, secrets exposure, XSS/injection.
- **Edge cases**: empty states, boundary values, locale/encoding issues, malformed input handling, overflow.
- **Regressions**: subtle behavior changes vs. the base branch, API contract changes that break callers, changes that violate documented conventions.
- **Data integrity & async**: unhandled promise rejections, data races, non-atomic transactions, missing rollback, stale reads after writes.

### 3. Verify

Before reporting any candidate finding, verify it against actual code behavior:

- Open the cited file and re-read the code around the line.
- A behavior claim needs a `file:line` citation proving it in the source — inference from naming is not evidence.
- Drop findings that don't survive a strict read of the source. When unsure, leave it out.

### 4. Deduplicate and rank

- Merge findings from different subagents that describe the same root cause.
- Rank by severity: Important first, then Nit, then Pre-existing.

| Marker | Severity     | Meaning                                                                 |
| :----- | :----------- | :---------------------------------------------------------------------- |
| 🔴     | Important    | A bug that should be fixed before merging: breaks behavior, leaks data, introduces a security hole, or blocks rollback. |
| 🟡     | Nit          | A minor issue, worth fixing but not blocking.                            |
| 🟣     | Pre-existing | A bug that exists in the codebase but was not introduced by this change. |

### 5. Report

Reply with a one-line tally followed by the findings:

- **Summary**: e.g. `2 Important, 4 Nit, 1 Pre-existing` over `<scope>`. If nothing was found, say "No issues found" plainly.
- **Findings**: for each, a severity marker, `file:line`, a one-sentence summary, and a short reasoning block — why it's wrong and how you verified it. Prefer the most specific line; for whole-file concerns give the file plus the relevant range.

Example:

```
Review of interest-form changes (main...HEAD): 1 Important, 1 Nit.

🔴 Important — lib/actions/interest.ts:47 — `count` check and `insert` are not in the same transaction and there is no unique constraint, so two rapid submissions can create duplicate interest rows.
🟡 Nit — components/interest-form.tsx:82 — the error state is set but never rendered; the form keeps its success styling.
```

### Report nothing

If the review turns up nothing, say so directly. Do not pad the report with non-findings or reworded style advice.

## Rules

- Focus on **correctness** — bugs that would break production. Do not report formatting preferences, missing tests, or style; do not re-report what `npm run lint` / `npm run typecheck` already enforce.
- Report at most five Nits; if more were found, say "plus N similar items" in the summary and report the five most impactful.
- Never invent evidence. Every finding must be grounded in code you actually read.
- Newly introduced violations of `AGENTS.md` conventions are Nits, not Important.
- This skill is **read-only**: do not modify files during the review.
- If the user asks to fix the findings, apply fixes to the working tree and re-verify with `npm run lint` and `npm run typecheck`.
