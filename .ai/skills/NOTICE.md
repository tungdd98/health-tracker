# Superpowers Skills — Local Clone

Cloned from: obra/superpowers v5.0.7 (commit b557648)
Cloned date: 2026-04-29
License: MIT (see LICENSE)

## Modifications from upstream

- **writing-plans**: added FE/UI verbosity-strip rules; commit-policy changed from auto to ask-user; description prefixed with override hint
- **verification-before-completion**: replaced test mandate with package-manager-aware `typecheck → lint → build` flow; tests optional; description updated
- **using-git-worktrees**: kept `.worktrees/` discovery and gitignore safety check; removed auto-naming; requires explicit folder+branch params; description updated
- **finishing-a-development-branch**: simplified to single action (invoke create-pr); removed merge/cleanup/squash options; description updated
- **brainstorming**: spec git-commit changed from auto to ask-user (1-line change); rest verbatim

## New skills (not from upstream)

- **create-pr**: GitHub PR creation via `gh CLI` with auto-detected base branch; minimal scope (no draft, no template-via-prompt, no reviewer assignment)

## Sync history

| Date       | Action        | Version |
| ---------- | ------------- | ------- |
| 2026-04-29 | Initial clone | 5.0.7   |
