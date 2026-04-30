---
name: designing-with-pencil
description: Use when a spec describes UI screens, layouts, or user-facing visual flows, before writing an implementation plan — applies to web/mobile features with rendered interfaces. Skip for backend-only, CLI, or pure logic changes.
---

# Designing With Pencil

## Overview

Bridges the gap between spec and plan with a visual design step using the **Pencil MCP server**. Produces `.pen` design artifacts that the plan can reference instead of describing UI in prose.

**Core insight:** UI in a written plan is wasteful and lossy. Words like "card with title, subtitle, and CTA" leave layout, spacing, and hierarchy as guesswork. A `.pen` artifact captures all of that once and lets the plan focus on logic (state, validation, API, routing).

**Announce at start:** "I'm using the designing-with-pencil skill to produce the visual design before the plan."

## When to Use

**Use when** the approved spec contains any of:

- New screens or pages
- New components with non-trivial layout
- Changes to existing layouts/visual hierarchy
- User-facing flows with multiple visual states (loading, empty, error, success)

**Skip when**:

- Backend, API, CLI, or schema-only changes
- Pure logic refactors with no rendered output
- Single-line copy/text tweaks
- Bug fixes that don't change layout

## Workflow Position

```
brainstorming → spec → [designing-with-pencil] → writing-plans → executing-plans
```

This skill is invoked **after** the spec is written and approved, **before** `writing-plans`.

## Process

1. **Confirm prerequisites** — spec exists at `docs/superpowers/specs/<file>.md` and has been user-approved.
2. **List the screens to design** — extract every distinct screen/component/state from the spec. Show the list to the user and confirm before opening Pencil.
3. **Open or create the design file** — call `mcp__pencil__get_editor_state` to check current state. If no `.pen` is open or the open file is wrong, call `mcp__pencil__open_document` with `'new'` (or an existing path the user names).
4. **Load Pencil guidelines** — call `mcp__pencil__get_guidelines` to load current Pencil conventions before designing. Re-load if you change topic (mobile vs web, etc.).
5. **Design each screen as a frame** — use `mcp__pencil__batch_design` to insert frames. One frame per distinct screen/state. Reuse design system tokens if the project has one (`mcp__pencil__get_variables`).
6. **Save the file** — to `docs/superpowers/designs/YYYY-MM-DD-<topic>.pen` (matching the spec's date and topic slug). Create the directory if missing.
7. **Self-review** — see Self-Review section.
8. **Hand off to user** — show the saved path, ask user to open it in the Pencil app and approve before the plan step.
9. **Invoke writing-plans** — only after user approval, invoke `writing-plans`. Tell the plan author the design file path so they reference it instead of describing UI.

## What to Design (and What NOT to)

**DO put in the `.pen` file:**

- Layout, spacing, visual hierarchy
- Component composition (header, body, footer)
- Each meaningful state (default, loading, empty, error, success, disabled)
- Responsive variants if the spec calls them out (mobile vs desktop frames)

**DO NOT put in the `.pen` file:**

- Animation timing, transitions, micro-interactions → keep in spec/plan as text
- Business rules, validation logic, copy variations → spec/plan
- API/data shapes → spec/plan
- Routing/navigation logic → spec/plan

## Plan Reference Convention

Once the design exists, the plan MUST reference it instead of re-describing UI. In the plan, every UI-implementation task should look like:

```markdown
### Task N: Implement <Screen> UI

**Design:** `docs/superpowers/designs/2026-04-26-onboarding.pen` → frame `OnboardingStep1`

**Files:**

- Create: `apps/...`

- [ ] Step 1: Open the design file in Pencil and read frame `OnboardingStep1`
- [ ] Step 2: Implement layout matching the frame (use design system tokens from `libs/theme`)
- [ ] Step 3: Wire state per spec section X
      ...
```

The plan author (writing-plans) should NOT re-describe what the screen looks like in prose. The `.pen` file is the source of truth for visuals.

## Self-Review

After designing all frames, check:

1. **Coverage** — every screen/state listed in step 2 has a frame? List gaps.
2. **State completeness** — each interactive screen has at least: default + the states the spec explicitly mentions (loading/empty/error/success).
3. **Design system consistency** — colors, spacing, typography pulled from project variables, not hand-picked? Run `mcp__pencil__get_variables` to verify.
4. **Naming** — frame names match what the plan will reference (e.g., kebab-case or PascalCase, consistent within the file).

Fix issues inline before handoff.

## Common Mistakes

| Mistake                                         | Fix                                                                                                                               |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Designing before spec is approved               | Always wait for user approval of spec first — design churn is expensive.                                                          |
| One giant frame with everything stacked         | One frame per screen/state. Plan tasks reference frames by name.                                                                  |
| Hand-picking colors/spacing                     | Use design system variables (`get_variables`). Hand-picked values diverge from production.                                        |
| Letting the plan re-describe UI in prose        | If you see the plan saying "card with title and CTA," push back — the plan should reference the frame, not re-describe it.        |
| Designing micro-interactions in Pencil          | Pencil captures static layout. Animations/transitions belong in spec/plan text.                                                   |
| Skipping the user approval gate before the plan | The user must verify the design in the Pencil app before the plan locks it in — design fixes are cheaper than plan/code rewrites. |

## Pencil MCP Quick Reference

| Need                      | Tool                                             |
| ------------------------- | ------------------------------------------------ |
| Check what's open         | `mcp__pencil__get_editor_state`                  |
| Open existing or new file | `mcp__pencil__open_document`                     |
| Load conventions/styles   | `mcp__pencil__get_guidelines`                    |
| Get/set design tokens     | `mcp__pencil__get_variables` / `set_variables`   |
| Insert/update/move nodes  | `mcp__pencil__batch_design` (one call, many ops) |
| Read existing nodes       | `mcp__pencil__batch_get`                         |
| Snapshot for review       | `mcp__pencil__get_screenshot`                    |

**Never** read `.pen` files with `Read` or `Grep` — they are encrypted. Always go through `mcp__pencil__*` tools.

## Red Flags

These thoughts mean STOP — you're skipping the design step you should be doing:

- "The screen is simple, plan can describe it in two lines" → describe-in-plan = guesswork at implement time. Design it.
- "I'll design later when I implement" → defeats the point: the plan is already locked in by then.
- "User didn't ask for design" → if the spec has UI, the design step is implied.
- "Pencil isn't open, I'll skip" → call `open_document('new')` and create one.

## Handoff to writing-plans

After the user approves the design, hand off with:

> "Design approved and saved to `docs/superpowers/designs/<file>.pen`. Invoking `writing-plans` now. The plan will reference this file for all UI tasks instead of describing visuals in prose."

Then invoke `writing-plans`, passing the design path so it knows to reference rather than re-describe.
