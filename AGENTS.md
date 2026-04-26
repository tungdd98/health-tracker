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

## Coding Style & Naming Conventions

Use TypeScript, 2-space indentation, single quotes, and semicolon-free style to match the existing codebase. Prefer small, focused modules and colocate implementation files with their feature area, for example `libs/ui/src/lib/app-shell.tsx`. Follow the repository's ESLint and Prettier configuration; avoid unused variables and prefix intentionally unused arguments with `_`.

## Testing Guidelines

There is no dedicated test runner configured yet. Treat `yarn lint` and `yarn build` as the required verification commands for changes. If you add tests, name them clearly near the code they cover, such as `*.test.ts` or `*.test.tsx`, and document any new test command in the relevant package.

## Commit & Pull Request Guidelines

Commit history uses conventional commits such as `feat:`, `fix:`, `docs:`, and `chore:`. Keep commit messages short and scoped. Pull requests should summarize the change, link the related issue or spec when available, and include screenshots for UI updates. Mention any new environment variables or manual setup steps.

## Agent-Specific Instructions

Before any multi-step implementation task, read and follow `docs/process/planning-workflow.md`. For every active phase under `docs/superpowers/plans/`, keep tracking synchronized with reality: mark completed tasks in the phase `index.md`, update checklist items inside the task file, and do not leave finished work unchecked.

For future design tasks using Stitch or similar tools, treat only the approved default screen frames as the visual source of truth unless the task explicitly says otherwise. Do not rely on AI-generated error, loading, or other state variants as authoritative design references. Those non-default states should normally be implemented in code by preserving the default layout and applying state-only changes.
