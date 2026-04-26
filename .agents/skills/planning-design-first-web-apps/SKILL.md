---
name: planning-design-first-web-apps
description: Use when planning a web app or frontend feature before UI design, especially when the user mentions brainstorming, spec, Stitch, Pencil, mockups, wireframes, screen flows, or conflict between detailed plans and design work. Use when the goal is a lean product brief before design, not a coding plan. Do not use for coding tasks or post-design implementation after a design is already approved.
---

# Planning Design-First Web Apps

This skill prevents planning from overrunning design. It keeps product scoping, UI design, and implementation planning in separate phases so the agent does not invent components, file structures, or API details before the interface is approved.

## Use This Skill For

- Web app or frontend feature discovery before UI is designed
- Requests that mention Stitch, Pencil, mockups, wireframes, or screen flows
- Situations where the user complains that specs or plans are too long, too technical, or keep conflicting with design work
- Creating a lean brief that a design tool can use as input

## Do Not Use This Skill For

- Pure coding or debugging tasks
- Implementing an already approved UI design
- Writing a post-design implementation plan after design is locked

If the user already has an approved design, switch to the post-design planning workflow in [references/post-design-plan.md](references/post-design-plan.md) instead of restarting with a brief.

## Core Rule

Do not let the planning phase decide the UI implementation. Before design approval, stay at the product and flow level.

Forbidden before design approval:

- component trees
- props or state breakdowns
- file or folder structures
- API signatures
- test matrices
- responsive rules section-by-section

## Default Workflow

### Phase 1: Lean Brief Only

Produce a short product brief, not an implementation plan.

Required output:

- goals
- target users
- core flows
- MVP scope
- non-goals
- constraints
- success criteria

Use [references/lean-brief.md](references/lean-brief.md).

### Phase 2: Design Handoff

Prepare the handoff for the design tool.

Default path:

- Stitch first
- Pencil as fallback if the user asks for it or already uses it

Required design outputs:

- screen inventory
- user flow between screens
- major empty, loading, error, and success states
- reusable UI patterns
- basic design tokens or visual rules

Use [references/stitch-handoff.md](references/stitch-handoff.md).

### Phase 3: Design Gate

After design work, confirm whether the UI is approved enough to act as source of truth.

If not approved:

- stay in brief and design iteration
- do not create implementation plan details

If approved:

- treat the design as the UI source of truth
- move to the post-design planning workflow

### Phase 4: Post-Design Implementation Plan

Only after design approval, create a technical plan that follows the design instead of replacing it.

Allowed focus:

- architecture
- routing
- data flow
- state ownership
- API boundaries
- execution order
- vertical slices

Still avoid redesigning the UI unless there is a technical blocker that must be surfaced explicitly.

Use [references/post-design-plan.md](references/post-design-plan.md).

## Output Contract

### Brief phase output

Return a concise brief. The deliverable should read like product intent, not engineering design.

### Design handoff output

Return a handoff package for Stitch or Pencil with screen list, flow summary, edge states, and visual direction.

### Post-design plan output

Return a technical implementation plan that references the approved design and breaks work into vertical slices.

## Anti-Patterns

Before moving on, check [references/anti-patterns.md](references/anti-patterns.md) and actively avoid those failure modes.

## Examples

For common prompts and routing examples, use [references/examples.md](references/examples.md).
