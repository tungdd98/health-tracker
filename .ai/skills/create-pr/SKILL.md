---
name: create-pr
description: Use when implementation is complete and verified, and the user wants to open a pull request on GitHub. Pushes the current branch (if needed) and creates a PR via gh CLI with auto-detected base branch. Defers title/body to gh's --fill default; respects .github/PULL_REQUEST_TEMPLATE.md when present.
---

# Create Pull Request

## Overview

Minimal GitHub PR creation. Auto-detects base branch from upstream
tracking, pushes the current branch if not yet pushed, and runs
`gh pr create --fill --base <base>`.

**Announce at start:** "I'm using the create-pr skill to open a pull request."

## Pre-flight checks

Run these checks; if any fails, surface a clear error to the user and STOP.

1. **gh CLI present**

   ```bash
   command -v gh >/dev/null || { echo "ERROR: gh CLI not installed (brew install gh)"; exit 1; }
   ```

2. **gh authenticated**

   ```bash
   gh auth status >/dev/null 2>&1 || { echo "ERROR: gh not authenticated. Run 'gh auth login'"; exit 1; }
   ```

3. **Currently on a feature branch (not main/master)**

   ```bash
   branch=$(git branch --show-current)
   case "$branch" in
     main|master|"") echo "ERROR: not on a feature branch (current: '$branch')"; exit 1 ;;
   esac
   ```

4. **Working tree clean**
   ```bash
   if [ -n "$(git status --porcelain)" ]; then
     echo "ERROR: working tree dirty. Commit or stash before creating a PR."
     exit 1
   fi
   ```

## Steps

1. **Detect base branch**

   ```bash
   # Try upstream tracking parent first
   base=$(git rev-parse --abbrev-ref @{upstream} 2>/dev/null | sed 's|^[^/]*/||')
   # Fallback: ask gh for repo's default branch
   if [ -z "${base:-}" ]; then
     base=$(gh repo view --json defaultBranchRef -q .defaultBranchRef.name 2>/dev/null)
   fi
   # Final fallback: 'main'
   base="${base:-main}"
   echo "Base branch: $base"
   ```

2. **Push branch if not yet on remote**

   ```bash
   branch=$(git branch --show-current)
   if ! git ls-remote --exit-code --heads origin "$branch" >/dev/null 2>&1; then
     git push -u origin "$branch"
   fi
   ```

3. **Verify commits ahead of base**

   ```bash
   ahead=$(git rev-list --count "origin/$base..$branch" 2>/dev/null || git rev-list --count "$base..$branch")
   if [ "$ahead" -lt 1 ]; then
     echo "ERROR: branch has 0 commits ahead of $base. Nothing to PR."
     exit 1
   fi
   ```

4. **Create PR**

   ```bash
   gh pr create --fill --base "$base"
   ```

   `--fill`: title + body auto-populated from commits.
   If `.github/PULL_REQUEST_TEMPLATE.md` exists, gh applies it (see gh docs).

5. **Output the PR URL** — surface the URL printed by `gh pr create` so the user can click straight to it.

## Constraints / Out of Scope

This minimal version does NOT support:

- Custom title/body via prompt (use `gh pr create` manually if needed)
- Draft PRs (`--draft`)
- Reviewer assignment / labels / milestone
- Generating body from `docs/superpowers/specs/` or `docs/superpowers/plans/`

These are deferred to a future spec. If the user requests them, surface
"create-pr skill is minimal; please specify and I'll run gh manually" rather
than attempting to handle them here.

## Failure modes

If `gh pr create` fails with a non-trivial error (e.g., template validation,
permission denied, branch protection), pass the error verbatim to the user
and stop. Do NOT auto-retry.

## Integration

**Called by:**

- **finishing-a-development-branch** — its single delegated action

**Pairs with:**

- **verification-before-completion** — should have already run before this skill
