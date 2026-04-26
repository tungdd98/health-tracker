# Planning Workflow

This document defines the required planning structure for implementation work in this repository.

## Goal

Keep plans easy to review, easy to execute in parallel, and easy to track during implementation.

## Required Structure

For any multi-step implementation effort:

1. Create a phase folder under `docs/superpowers/plans/`
2. Name the folder using the pattern `phase-<number>-<topic>`
3. Add an `index.md` file inside that folder
4. Split the plan into task files, one file per task
5. Name task files with the pattern `task-XX-<topic>.md`

Example:

- `docs/superpowers/plans/phase-0-health-tracker-base-project/index.md`
- `docs/superpowers/plans/phase-0-health-tracker-base-project/task-01-initialize-workspace.md`

## Index File Requirements

Each phase `index.md` must include:

- Phase title
- Goal
- Architecture summary
- Tech stack
- Tracking checklist linking to every task file
- File structure map when useful
- Spec coverage summary when useful

The `index.md` file is the main tracking entrypoint for the phase.

## Task File Requirements

Each task file must contain:

- Task title
- Exact files to create or modify
- Step-by-step checklist
- Concrete commands
- Expected outcomes

Each task should stay focused on one coherent unit of work.

## Naming Guidance

- Use `phase-0` for repo foundation and bootstrap work before feature implementation
- Use later phase numbers for feature or subsystem work that builds on the foundation
- Prefer concise, stable, descriptive slugs

## Replacing Older Flat Plans

If a flat plan file already exists and the work is being converted to the phase/task structure:

- Keep the old plan file as a short pointer to the new phase folder
- Do not maintain two active plan structures for the same work

## Tracking Rules

Tracking is mandatory during execution.

When a task is finished:

1. Update the phase `index.md` and mark that task as done
2. Update the corresponding task file and mark completed checklist items as done
3. Keep the plan files consistent with actual progress at all times

Do not postpone checkbox updates until the end of the session.

## Design Step (UI Features Only)

For features that introduce or change UI screens, layouts, or visual flows, insert a design step **between spec approval and plan writing**:

```
brainstorming → spec → designing-with-pencil → writing-plans → executing-plans
```

Rules:

- Use the **Pencil MCP server** to produce a `.pen` artifact at `docs/superpowers/designs/YYYY-MM-DD-<topic>.pen`. Each distinct screen/state lives in its own frame.
- Invoke the `designing-with-pencil` skill to drive this step — it owns the procedure (screens to cover, states, naming, handoff).
- Skip the design step entirely for backend-only, CLI, schema-only, or pure-logic changes.
- The plan **MUST reference the design** (`docs/superpowers/designs/<file>.pen` → frame `<name>`) instead of describing UI in prose. Plan tasks for UI work cover state, validation, API, routing — not visual description.

Rationale: keeping UI in `.pen` artifacts (not plan text) shortens plans, removes guesswork at implementation time, and makes design changes cheap.
