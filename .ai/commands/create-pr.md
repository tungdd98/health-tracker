---
allowed-tools: Bash(git push:*), Bash(gh pr create:*)
description: Create a PR using the project template
---

## Context

- Current branch: !`git branch --show-current`
- Recent commits (with full messages): !`git log main..HEAD --format="%H %s%n%b"`
- Diff: !`git diff main..HEAD`
- PR template: !`cat .github/pull_request_template.md`

## Your task

1. Push the current branch to origin. NEVER push to main directly.
2. Create a pull request using `gh pr create`:
   - Title: conventional commits format (`feat(scope):`, `fix(scope):`, `docs:`, `chore:`, etc.), max 72 chars, English. Derive from branch commits — if all commits share a type/scope use the most significant one; if mixed, synthesize a summary.
   - Body: follow the PR template above. Fill each section based on the changes — include not just what changed (from the diff) but also why, drawing from commit messages, branch name, and contextual clues in the changes. **Write in English.**
   - Base branch: main
