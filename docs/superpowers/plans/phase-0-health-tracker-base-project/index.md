# Health Tracker Base Project Phase 0

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this phase task-by-task. Track progress in this file first, then inside the task file you are executing.

**Goal:** Build the initial `Nx` monorepo foundation for the Health Tracker app with one React TypeScript web app, shared foundation libraries, Supabase bootstrap, and pragmatic developer tooling.

**Architecture:** Phase 0 creates one application, `apps/health-tracker-web`, and a focused set of shared libraries: `theme`, `ui`, `forms`, `api`, and `state`. The app owns provider composition and route wiring, while the libraries own reusable project conventions and infrastructure boundaries without introducing auth or health-domain features.

**Tech Stack:** Nx, React, TypeScript, Vite, MUI, MUI Icons, react-hook-form, zod, zustand, react-router-dom, @tanstack/react-query, @supabase/supabase-js, ESLint, Prettier, Husky, Commitlint, Yarn

---

## Tracking

- [ ] Task 01: [Initialize the Nx workspace and React app](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-0-health-tracker-base-project/task-01-initialize-workspace.md)
- [ ] Task 02: [Generate the shared foundation libraries](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-0-health-tracker-base-project/task-02-generate-shared-libraries.md)
- [ ] Task 03: [Install runtime dependencies and root developer tooling](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-0-health-tracker-base-project/task-03-root-tooling.md)
- [ ] Task 04: [Build the shared theme library](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-0-health-tracker-base-project/task-04-theme-library.md)
- [ ] Task 05: [Build the API foundation](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-0-health-tracker-base-project/task-05-api-foundation.md)
- [ ] Task 06: [Build the UI library primitives](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-0-health-tracker-base-project/task-06-ui-library.md)
- [ ] Task 07: [Build the forms library](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-0-health-tracker-base-project/task-07-forms-library.md)
- [ ] Task 08: [Add the minimal Zustand reference store](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-0-health-tracker-base-project/task-08-state-library.md)
- [ ] Task 09: [Wire the app providers, routes, and screens](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-0-health-tracker-base-project/task-09-app-wiring.md)
- [ ] Task 10: [Final verification and developer documentation](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-0-health-tracker-base-project/task-10-verification-and-readme.md)

## File Structure Map

- `package.json`
  - Root dependency and script entrypoint
- `nx.json`
  - Nx workspace configuration
- `tsconfig.base.json`
  - Shared TypeScript path aliases
- `.gitignore`
  - Workspace ignores including env files and build outputs
- `.nvmrc`
  - Node version pin for local consistency
- `.prettierrc.json`
  - Prettier formatting rules
- `.prettierignore`
  - Prettier ignore list
- `eslint.config.mjs`
  - Root ESLint flat config
- `.husky/pre-commit`
  - Lint/format gate before commit
- `.husky/commit-msg`
  - Commitlint gate
- `commitlint.config.cjs`
  - Conventional Commits configuration
- `.env.example`
  - Documented Supabase env variables
- `apps/health-tracker-web/src/main.tsx`
  - React entrypoint
- `apps/health-tracker-web/src/app/app.tsx`
  - App bootstrap shell
- `apps/health-tracker-web/src/app/router.tsx`
  - Route definitions
- `apps/health-tracker-web/src/app/providers.tsx`
  - Provider composition
- `apps/health-tracker-web/src/app/pages/landing-page.tsx`
  - Minimal landing page
- `apps/health-tracker-web/src/app/pages/not-found-page.tsx`
  - Not-found screen
- `libs/theme/src/lib/theme.ts`
  - Shared MUI theme factory/object
- `libs/theme/src/index.ts`
  - Theme lib public exports
- `libs/ui/src/lib/app-shell.tsx`
  - App shell layout
- `libs/ui/src/lib/page-section.tsx`
  - Standard content section wrapper
- `libs/ui/src/lib/app-header.tsx`
  - Shared header
- `libs/ui/src/lib/loading-block.tsx`
  - Loading placeholder
- `libs/ui/src/lib/empty-state.tsx`
  - Empty state primitive
- `libs/ui/src/index.ts`
  - UI lib public exports
- `libs/forms/src/lib/form-provider.tsx`
  - RHF wrapper
- `libs/forms/src/lib/form-text-field.tsx`
  - MUI text field integration
- `libs/forms/src/index.ts`
  - Forms lib public exports
- `libs/api/src/lib/env.ts`
  - Runtime env parsing and validation
- `libs/api/src/lib/supabase.ts`
  - Shared Supabase singleton client
- `libs/api/src/lib/query-client.ts`
  - React Query client creation
- `libs/api/src/index.ts`
  - API lib public exports
- `libs/state/src/lib/app-ui-store.ts`
  - Minimal Zustand example store
- `libs/state/src/index.ts`
  - State lib public exports
- `README.md`
  - Setup and run instructions

## Spec Coverage

- Nx monorepo using Yarn: Tasks 01 and 10
- React + TypeScript app scaffold: Task 01
- Shared libs for `theme`, `ui`, `forms`, `api`, `state`: Tasks 02, 04, 05, 06, 07, 08
- MUI and MUI Icons: Tasks 03, 04, 06, 09
- `react-hook-form` + `zod`: Tasks 03 and 07
- `zustand` skeleton pattern only: Task 08
- `react-router-dom` route setup: Task 09
- React Query foundation: Tasks 03, 05, 09
- Supabase client/config/env without auth: Tasks 03, 05, 09
- `prettier`, `eslint`, `husky`, `commitlint`: Task 03
- No unit tests and no e2e tests: Tasks 01 and 02 generator choices
- Minimal landing page and not-found page: Task 09

## Notes

- Chosen label: `Phase 0`
- Reason: this phase only establishes repo and app foundations, with no business workflow, auth, or feature domain logic yet
