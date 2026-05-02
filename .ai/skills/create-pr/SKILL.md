---
name: create-pr
description: Use when implementation is complete and verified, and the user wants to open a pull request on GitHub. Pushes the current branch and creates a PR via gh CLI with conventional-commit title derived from commits; uses the project PR template for the body.
---

# Create Pull Request

## Context

Gather before creating the PR:

- Current branch: run `git branch --show-current`
- Recent commits (with full messages): run `git log main..HEAD --format="%H %s%n%b"`
- Diff: run `git diff main..HEAD`
- PR template: run `cat .github/pull_request_template.md`

## Steps

1. Push the current branch to origin. NEVER push to main directly.
2. Create a pull request using `gh pr create`:
   - **Title:** conventional commits format (`feat(scope):`, `fix(scope):`, `docs:`, `chore:`, etc.), max 72 chars, English. Derive from branch commits — if all commits share a type/scope use the most significant one; if mixed, synthesize a summary.
   - **Body:** follow the PR template. Fill each section based on the changes — include not just what changed (from the diff) but also why, drawing from commit messages, branch name, and contextual clues in the changes. **Write in English.**
   - **Base branch:** main
