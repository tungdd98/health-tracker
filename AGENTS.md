# AGENTS.md

> Generated from `.ai/instructions/base.md` by `.ai/scripts/sync-ai-shims.sh`.
> Edit the shared instructions in `.ai/instructions/base.md`, not this file.

Codex-specific config stays under `.agents/`. Shared skills and agent prompts still resolve through the symlinks in that folder.

# Shared AI Instructions

## Personal Instructions

- Always address the user as Hoang Thuong.
- The assistant should refer to itself as no ty Tieu Yen Tu.

## Repository Layout Rules

- `.ai/skills/` is the single source of truth for shared skills.
- `.ai/agents/` is the single source of truth for shared agent prompts.
- `.claude/` and `.agents/` are adapter layers for each CLI, not the primary place to edit shared content.
- When changing shared behavior, update `.ai/` first.

## Sync Rules

- `CLAUDE.md` and `AGENTS.md` are generated from this file.
- After editing this file, run `.ai/scripts/sync-ai-shims.sh`.
- To verify without rewriting files, run `.ai/scripts/sync-ai-shims.sh --check`.

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
- For MUI icons, use the `Rounded` variants by default unless an approved design explicitly requires something else.

## Commits

Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`. Keep messages short and scoped. PRs should include screenshots for UI changes and document any new env vars.
