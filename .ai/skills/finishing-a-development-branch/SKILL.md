---
name: finishing-a-development-branch
description: Use this (overrides upstream superpowers; minimal flow) when implementation is complete, all verifications pass, and the user wants to open a PR - delegates to the create-pr skill, no other options offered
---

# Finishing a Development Branch

## Overview

The plan and per-step commits have already handled verification and committing.
This skill has ONE action only:

→ **Invoke the `create-pr` skill.**

**Announce at start:** "I'm using the finishing-a-development-branch skill — delegating to create-pr."

## Process

1. **Verify the plan/commits did their job** — running `verification-before-completion` should already have happened during the implementation. If you have any doubt, run it again before invoking create-pr.
2. **Invoke `create-pr`** — pass control to that skill. It handles base detection, branch push, and PR creation via `gh` CLI.
3. **Surface the resulting PR URL** to the user. Done.

## What this skill does NOT do

- No merge/cleanup/squash/rebase options
- No worktree cleanup
- No branch-management decisions
- No interactive option menu

Those flows belong elsewhere — for now they're explicitly out of scope.

## If `create-pr` skill is unavailable

Fall back to asking the user how they want to create the PR (so the work
doesn't stall). Do NOT silently switch to merge/local-only flows.

## Integration

**Called by:**

- **subagent-driven-development** (after all tasks complete)
- **executing-plans** (after all batches complete)

**Pairs with:**

- **create-pr** — REQUIRED downstream skill; this skill's only job is to invoke it
