---
name: using-git-worktrees
description: Use this when starting feature work that needs isolation - creates isolated git worktrees in .worktrees/ with safety verification; does NOT auto-derive names
---

# Using Git Worktrees

## Overview

Git worktrees create isolated workspaces sharing the same repository, allowing work on multiple branches simultaneously without switching.

**Core principle:** Systematic directory selection + safety verification = reliable isolation.

**Announce at start:** "I'm using the using-git-worktrees skill to set up an isolated workspace."

## Worktree Parameters (Required)

This skill REQUIRES the user to provide two explicit parameters before
creating a worktree. Do NOT auto-derive names from task descriptions
(no inferring branch name from ticket title, no inferring folder from feature name):

1. `<folder_name>` — exact leaf directory name (under `.worktrees/`)
2. `<branch_name>` — exact branch name to create

If either is missing, ASK the user. Never guess.

Example invocation:
"Create a worktree, folder 'login-fix', branch 'feat/login-fix'"

The folder and branch can be different (e.g., folder `login-fix`, branch `feat/login-fix`).

## Directory Selection Process

Follow this priority order:

### 1. Check Existing Directories

```bash
# Check in priority order
ls -d .worktrees 2>/dev/null     # Preferred (hidden)
ls -d worktrees 2>/dev/null      # Alternative
```

**If found:** Use that directory. If both exist, `.worktrees` wins.

### 2. Check CLAUDE.md

```bash
grep -i "worktree.*director" CLAUDE.md 2>/dev/null
```

**If preference specified:** Use it without asking.

### 3. Ask User

If no directory exists and no CLAUDE.md preference:

```
No worktree directory found. Where should I create worktrees?

1. .worktrees/ (project-local, hidden)
2. ~/.config/superpowers/worktrees/<project-name>/ (global location)

Which would you prefer?
```

## Safety Verification

### For Project-Local Directories (.worktrees or worktrees)

**MUST verify directory is ignored before creating worktree:**

```bash
# Check if directory is ignored (respects local, global, and system gitignore)
git check-ignore -q .worktrees 2>/dev/null || git check-ignore -q worktrees 2>/dev/null
```

**If NOT ignored:**

Per Jesse's rule "Fix broken things immediately":

1. Add appropriate line to .gitignore
2. Commit the change
3. Proceed with worktree creation

**Why critical:** Prevents accidentally committing worktree contents to repository.

### For Global Directory (~/.config/superpowers/worktrees)

No .gitignore verification needed - outside project entirely.

## Creation Steps

### 1. Detect Project Name

```bash
project=$(basename "$(git rev-parse --show-toplevel)")
```

### 2. Create Worktree

`<folder_name>` and `<branch_name>` MUST already be provided by the user
(see "Worktree Parameters (Required)" section above). If missing, STOP and ask.

```bash
# Determine full path using explicit folder_name (NOT auto-derived from branch)
case $LOCATION in
  .worktrees|worktrees)
    path="$LOCATION/<folder_name>"
    ;;
  ~/.config/superpowers/worktrees/*)
    path="~/.config/superpowers/worktrees/$project/<folder_name>"
    ;;
esac

# Create worktree with explicit branch name
git worktree add "$path" -b "<branch_name>"
cd "$path"
```

### 3. Symlink Gitignored Env Files

Gitignored files (`.env`, `.env.local`, etc.) are not present in new worktrees. Symlink them from the main worktree so all worktrees share one source of truth — no manual copying, no sync issues.

```bash
main_root=$(git rev-parse --show-toplevel)

# Common env file patterns — symlink each that exists in main worktree
for f in .env .env.local .env.development .env.development.local .env.production .env.production.local; do
  if [ -f "$main_root/$f" ]; then
    ln -sf "$main_root/$f" "$path/$f"
    echo "Symlinked $f"
  fi
done
```

**If no env files found:** Skip silently.

**Why symlink, not copy:** Changes to `.env.local` in main propagate automatically — no need to keep multiple copies in sync.

### 4. Run Project Setup

Auto-detect and run appropriate setup:

```bash
# Node.js
if [ -f package.json ]; then npm install; fi

# Rust
if [ -f Cargo.toml ]; then cargo build; fi

# Python
if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
if [ -f pyproject.toml ]; then poetry install; fi

# Go
if [ -f go.mod ]; then go mod download; fi
```

### 5. Verify Clean Baseline

Run tests to ensure worktree starts clean:

```bash
# Examples - use project-appropriate command
npm test
cargo test
pytest
go test ./...
```

**If tests fail:** Report failures, ask whether to proceed or investigate.

**If tests pass:** Report ready.

### 6. Migrate Untracked Spec/Plan Files

After baseline verification, check if the main worktree has untracked spec/plan files that should travel with the feature:

```bash
# Check for untracked spec/plan files in main worktree
main_root=$(git rev-parse --show-toplevel)
git -C "$main_root" ls-files --others --exclude-standard docs/superpowers/
```

**If untracked files found under `docs/superpowers/`:**

1. Identify files relevant to this feature (ask user if ambiguous)
2. Copy them into the new worktree:
   ```bash
   mkdir -p "$path/docs/superpowers/specs" "$path/docs/superpowers/plans"
   # Copy relevant spec/plan files
   cp <matched-files> "$path/docs/superpowers/..."
   ```
3. Commit on the feature branch:
   ```bash
   git -C "$path" add docs/superpowers/
   git -C "$path" commit -m "docs: add spec and plan for <feature-name>"
   ```
4. Report: "Spec/plan files copied and committed on feature branch."

**If no untracked spec/plan files:** Skip this step silently.

### 7. Report Location

```
Worktree ready at <full-path>
Tests passing (<N> tests, 0 failures)
Ready to implement <feature-name>
```

## Quick Reference

| Situation                  | Action                     |
| -------------------------- | -------------------------- |
| `.worktrees/` exists       | Use it (verify ignored)    |
| `worktrees/` exists        | Use it (verify ignored)    |
| Both exist                 | Use `.worktrees/`          |
| Neither exists             | Check CLAUDE.md → Ask user |
| Directory not ignored      | Add to .gitignore + commit |
| Tests fail during baseline | Report failures + ask      |
| No package.json/Cargo.toml | Skip dependency install    |
| Untracked spec/plan found  | Copy to worktree + commit  |
| No untracked spec/plan     | Skip silently              |

## Common Mistakes

### Skipping ignore verification

- **Problem:** Worktree contents get tracked, pollute git status
- **Fix:** Always use `git check-ignore` before creating project-local worktree

### Assuming directory location

- **Problem:** Creates inconsistency, violates project conventions
- **Fix:** Follow priority: existing > CLAUDE.md > ask

### Proceeding with failing tests

- **Problem:** Can't distinguish new bugs from pre-existing issues
- **Fix:** Report failures, get explicit permission to proceed

### Hardcoding setup commands

- **Problem:** Breaks on projects using different tools
- **Fix:** Auto-detect from project files (package.json, etc.)

## Example Workflow

```
You: I'm using the using-git-worktrees skill to set up an isolated workspace.

[Ask user: "Folder name and branch name?" → user provides folder='auth', branch='feature/auth']
[Check .worktrees/ - exists]
[Verify ignored - git check-ignore confirms .worktrees/ is ignored]
[Create worktree: git worktree add .worktrees/auth -b feature/auth]
[Run npm install]
[Run npm test - 47 passing]

Worktree ready at /Users/jesse/myproject/.worktrees/auth
Tests passing (47 tests, 0 failures)
Ready to implement auth feature
```

## Red Flags

**Never:**

- Create worktree without verifying it's ignored (project-local)
- Skip baseline test verification
- Proceed with failing tests without asking
- Assume directory location when ambiguous
- Skip CLAUDE.md check

**Always:**

- Follow directory priority: existing > CLAUDE.md > ask
- Verify directory is ignored for project-local
- Auto-detect and run project setup
- Verify clean test baseline

## Integration

**Called by:**

- **brainstorming** (Phase 4) - REQUIRED when design is approved and implementation follows
- **subagent-driven-development** - REQUIRED before executing any tasks
- **executing-plans** - REQUIRED before executing any tasks
- Any skill needing isolated workspace

**Pairs with:**

- **finishing-a-development-branch** - REQUIRED for cleanup after work complete
