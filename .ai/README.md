# Shared AI Workspace

This directory is the canonical home for content shared across multiple AI CLIs.

## Source Of Truth

- Edit shared skills in `.ai/skills/`
- Edit shared agent prompts in `.ai/agents/`
- Edit shared instructions in `.ai/instructions/base.md`

## Platform Adapters

- `.claude/skills` and `.claude/agents` are symlinks into `.ai/`
- `.agents/skills` and `.agents/agents` are symlinks into `.ai/`
- `.claude/settings.json` and `.claude/hooks/` stay Claude-specific

## Maintenance

After changing `.ai/instructions/base.md`, run:

```bash
.ai/scripts/sync-ai-shims.sh
```

To verify the adapter layout without rewriting files, run:

```bash
.ai/scripts/sync-ai-shims.sh --check
```
