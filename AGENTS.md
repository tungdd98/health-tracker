# Repository Guidelines

## Project Structure & Module Organization

This repository is an Nx monorepo. The main app lives in `apps/health-tracker-web/`, with source code under `apps/health-tracker-web/src/`. Shared code belongs in `libs/`, grouped by concern: `libs/ui`, `libs/forms`, `libs/state`, `libs/theme`, and `libs/api`. Repository-level docs and execution plans live in `docs/`, especially `docs/process/` and `docs/superpowers/`.

## Build, Test, and Development Commands

- `yarn install` - install dependencies.
- `yarn dev` - run the web app locally through Nx/Vite.
- `yarn build` - create a production build for `health-tracker-web`.
- `yarn lint` - run ESLint across all Nx projects.
- `yarn format` - write Prettier formatting changes.
- `yarn format:check` - verify formatting without changing files.

## Definition of Done

Before reporting a task as complete or creating a commit, always run this verification sequence:

1. `yarn format` (or format only the files touched when scope must stay narrow)
2. `yarn lint`
3. `yarn build` for app-impacting changes

Do not claim completion while formatting or lint/build issues are still unresolved.

## Coding Style & Naming Conventions

Use TypeScript, 2-space indentation, single quotes, and semicolon-free style to match the existing codebase. Prefer small, focused modules and colocate implementation files with their feature area, for example `libs/ui/src/lib/app-shell.tsx`. Follow the repository's ESLint and Prettier configuration; avoid unused variables and prefix intentionally unused arguments with `_`.

## Testing Guidelines

There is no dedicated test runner configured yet. Treat `yarn lint` and `yarn build` as the required verification commands for changes. If you add tests, name them clearly near the code they cover, such as `*.test.ts` or `*.test.tsx`, and document any new test command in the relevant package.

## Commit & Pull Request Guidelines

Commit history uses conventional commits such as `feat:`, `fix:`, `docs:`, and `chore:`. Keep commit messages short and scoped. Pull requests should summarize the change, link the related issue or spec when available, and include screenshots for UI updates. Mention any new environment variables or manual setup steps.

## Agent-Specific Instructions

Before any multi-step implementation task, read and follow `docs/process/planning-workflow.md`. For every active phase under `docs/superpowers/plans/`, keep tracking synchronized with reality: mark completed tasks in the phase `index.md`, update checklist items inside the task file, and do not leave finished work unchecked.

For features that touch UI (new screens, layout changes, visual flows), insert a design step between spec approval and `writing-plans`: invoke the `designing-with-pencil` skill to produce a `.pen` artifact under `docs/superpowers/designs/`. Plan tasks for UI must reference the design file + frame name rather than re-describing visuals in prose. Skip the design step for backend, CLI, or pure-logic work. See `docs/process/planning-workflow.md` for the full rule.
