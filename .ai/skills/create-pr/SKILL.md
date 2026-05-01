---
name: create-pr
description: Use when implementation is complete and verified, and the user wants to open a pull request on GitHub. Pushes the current branch (if needed) and creates a PR via gh CLI with auto-detected base branch. Generates a conventional-commit title from commits; uses .github/PULL_REQUEST_TEMPLATE.md for the body when present.
---

# Create Pull Request

## Overview

GitHub PR creation with a structured title. Auto-detects base branch from
upstream tracking, pushes the current branch if not yet pushed, generates
a conventional-commit title from commits, and runs
`gh pr create --title "<title>" --body-file .github/PULL_REQUEST_TEMPLATE.md --base <base>`.

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

4. **Generate PR title**

   Read the commits ahead of base:

   ```bash
   git log "origin/$base..$branch" --pretty=format:"%s" 2>/dev/null \
     || git log "$base..$branch" --pretty=format:"%s"
   ```

   From those commit subjects, synthesize a single title that follows the
   conventional-commit format:

   ```
   <type>(<scope>): <short description>
   ```

   Rules:
   - `type` must be one of: `feat`, `fix`, `refactor`, `docs`, `chore`
   - `scope` is optional but preferred when a clear area is involved (e.g., `ui`, `auth`, `api`)
   - `description` is lowercase, present tense, no trailing period, ≤ 72 chars total
   - If commits have mixed types, pick the most significant one (`feat` > `fix` > `refactor` > `docs` > `chore`)
   - If there is only one commit and it already follows the format, use it directly (reformatted to lowercase if needed)

   Example outputs: `feat(auth): add forgot-password flow`, `fix(ui): correct shadow on trip card`

5. **Create PR**

   If `.github/PULL_REQUEST_TEMPLATE.md` exists, use it as the body:

   ```bash
   gh pr create --title "<generated-title>" --body-file .github/PULL_REQUEST_TEMPLATE.md --base "$base"
   ```

   Otherwise fall back to `--fill`:

   ```bash
   gh pr create --title "<generated-title>" --fill --base "$base"
   ```

6. **Output the PR URL** — surface the URL printed by `gh pr create` so the user can click straight to it.

## Constraints / Out of Scope

This minimal version does NOT support:

- Draft PRs (`--draft`)
- Reviewer assignment / labels / milestone (use `gh pr create` manually if needed)
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
