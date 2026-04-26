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

## Design Task Rule

For future design tasks that use Stitch, Pencil, or similar AI design tools:

1. Treat the approved default screens as the visual source of truth unless the task explicitly requires finalized state variants
2. Do not treat AI-generated error, loading, success, or other state variations as authoritative by default
3. Document state behavior as implementation notes when possible, so engineering can apply those states in code without changing the approved default layout
4. If state mockups are generated for exploration, explicitly mark whether they are authoritative or non-authoritative in the task file or spec
