# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev            # start dev server (port 4200)
yarn build          # production build
yarn lint           # ESLint across all Nx projects
yarn format         # write Prettier formatting changes
yarn format:check   # verify formatting without writing
```

No test runner is configured yet — `yarn lint` and `yarn build` serve as the verification gate.

## Definition of Done

Before marking any task complete or creating a commit, run in order:

1. `yarn format`
2. `yarn lint`
3. `yarn build` (for any app-impacting change)

Do not claim completion while formatting, lint, or build issues remain unresolved.

## Architecture

**Nx monorepo** — app at `apps/health-tracker-web/`, shared code in `libs/`:

| Library      | Purpose                                                                     |
| ------------ | --------------------------------------------------------------------------- |
| `libs/ui`    | Reusable MUI wrapper components (AppShell, AppCard, AppHeader, etc.)        |
| `libs/forms` | React Hook Form + Zod field components (FormTextField, FormDateField, etc.) |
| `libs/api`   | Supabase client, auth helpers, React Query client                           |
| `libs/state` | Zustand global UI store (`useAppUiStore`)                                   |
| `libs/theme` | MUI theme configuration                                                     |

Import via path aliases: `@health-tracker/ui`, `@health-tracker/forms`, etc. (configured in `tsconfig.base.json` and `vite.config.ts`).

**Stack:** React 19 + TypeScript (strict) + Vite, MUI v7, React Router v7, TanStack React Query, Zustand, Supabase, React Hook Form + Zod.

## Key Patterns

**Routing** — `createBrowserRouter` in `apps/health-tracker-web/src/app/`. Route guards: `PublicOnlyRoute`, `PrivateRoute`, `OnboardingRoute`. Routes: `/`, `/onboarding`, `/settings`, `/login`, `/signup`.

**Auth** — `useAuthSession()` hook (in `libs/api`) built on `useSyncExternalStore`. Returns `isAuthResolved`, `session`, `user`, `onboardingProfile`, `hasSelectedOnboardingPhase`, `isOnboardingComplete`. Backed by Supabase; requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`.

**Data fetching** — TanStack React Query. QueryClient defaults: 1 retry, `refetchOnWindowFocus: false`.

**Global UI state** — Zustand store with `isShellCompact` / `toggleShellCompact()`.

**Forms** — React Hook Form with Zod schemas. Always use the `libs/forms` wrapper components; colocate schemas near the feature (e.g., `auth-schemas.ts`).

## Code Style

- TypeScript strict mode, 2-space indent, single quotes, semicolons enabled (Prettier config), 100-char line width.
- Unused variables disallowed; prefix intentionally unused arguments with `_`.
- Colocate implementation files with their feature area (e.g., `libs/ui/src/lib/app-shell.tsx`).

## Commits

Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`. Keep messages short and scoped. PRs should include screenshots for UI changes and document any new env vars.

## Multi-Step Tasks

Before any multi-step implementation, read `docs/process/planning-workflow.md`. Keep phase tracking in `docs/superpowers/plans/` synchronized: mark completed tasks in the phase `index.md` and check off items inside each task file.

**UI work** — for features with new screens, layout changes, or visual flows, insert a design step between spec and plan: invoke the `designing-with-pencil` skill, save the `.pen` artifact under `docs/superpowers/designs/YYYY-MM-DD-<topic>.pen`. Plan tasks for UI MUST reference the design file + frame name instead of describing visuals in prose. Skip for backend/CLI/logic-only changes.
