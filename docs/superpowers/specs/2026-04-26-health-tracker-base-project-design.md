# Health Tracker Base Project Design

- Date: 2026-04-26
- Project: Health Tracker
- Phase: Base project setup
- Primary app: `health-tracker-web`

## Goal

Set up a clean, scalable base project for the Health Tracker application for Hoang hau Chang using `Nx` monorepo and a modern React stack. This phase focuses on repository structure, shared foundations, developer tooling, and application bootstrapping. It does not include business features, authentication, or automated tests.

## Scope

Included in this phase:

- `Nx` monorepo using `Yarn`
- React + TypeScript web app scaffold
- Shared libraries for theme, UI, forms, API, and state pattern
- `MUI` and `MUI Icons`
- `react-hook-form` + `zod`
- `zustand` skeleton pattern
- `react-router-dom`
- `@tanstack/react-query`
- `supabase-js` client setup and env validation
- `prettier`, `eslint`, `husky`, `commitlint`
- Minimal landing page and not-found page

Explicitly excluded from this phase:

- Authentication and session handling
- Route guards and private/public app separation based on auth
- Health tracking domain features
- Unit tests
- End-to-end tests

## Recommended Approach

Use an `Nx` monorepo with one web app and a small set of shared libraries that establish project boundaries early without over-engineering the system.

Why this approach:

- Faster than building full platform-level modularization up front
- More maintainable than putting everything into a single app and refactoring later
- Keeps room for future health-tracking features without locking the team into premature abstractions

## Architecture Overview

The repository will contain one main application and a minimal set of shared libraries with clear responsibilities.

### App

- `apps/health-tracker-web`
  - Hosts the React application
  - Composes global providers
  - Declares app routes
  - Uses shared libraries instead of owning cross-cutting concerns directly

### Shared Libraries

- `libs/theme`
  - Owns MUI theme configuration
  - Defines palette, typography, spacing, breakpoints, and base component overrides

- `libs/ui`
  - Exposes project-specific UI building blocks
  - Intended examples: `AppShell`, `PageSection`, `AppHeader`, `LoadingBlock`, `EmptyState`
  - Does not wrap general-purpose MUI primitives unless there is a project-specific opinion to enforce

- `libs/forms`
  - Bridges `react-hook-form`, `zod`, and MUI
  - Provides base form wiring and reusable field wrappers
  - Standardizes validation display and submit-state behavior

- `libs/api`
  - Owns Supabase bootstrap and API-related shared foundations
  - Provides env parsing, runtime validation, singleton client setup, React Query base setup helpers, and a place for future service/query abstractions

- `libs/state`
  - Contains a minimal `zustand` example store as a reference pattern
  - Exists to define boundaries, not to centralize all application state

## Routing Design

Routing uses `react-router-dom` with a pragmatic structure that is more scalable than a single flat route file but lighter than fully modular feature routing.

### Route shape

- Root route for global providers and application bootstrap
- Minimal route branch outside the app shell for standalone pages
- App shell route branch prepared for future in-app feature screens

### Initial routes

- `/` for a minimal landing page
- `*` for not-found

The app shell structure should exist even if this phase does not yet populate multiple in-app screens. This avoids reshaping the route tree in the next phase.

## Provider Stack

The root app composition should include:

- `ThemeProvider` from shared theme setup
- `CssBaseline`
- `QueryClientProvider`
- `RouterProvider`
- Supabase bootstrap through shared API setup

This keeps infrastructure concerns centralized and prevents provider duplication in feature code later.

## State and Data Flow

State responsibilities are intentionally separated:

- Server state belongs to React Query
- Local UI state stays in components
- Global client state is only introduced through `zustand` when it is truly cross-cutting

In this phase:

- React Query is configured and available globally
- `zustand` is present only as a minimal sample pattern
- No domain stores are introduced yet

## Supabase Design

Supabase is included only as infrastructure preparation.

This phase includes:

- Environment variables for Supabase URL and anon key
- Runtime env validation
- Shared singleton client creation
- A clear extension point for future query/service logic

This phase excludes:

- Auth flows
- Session persistence handling
- Guards for protected routes
- User profile or domain-level Supabase integration

## UI Foundation

The project should establish a consistent visual and structural baseline without overbuilding a design system.

### Theme strategy

`libs/theme` is the single source of truth for:

- Palette
- Typography
- Spacing
- Breakpoints
- MUI component overrides

### UI abstraction policy

`libs/ui` should wrap only components that express application conventions. It should not become a full duplicate surface area for MUI.

Good candidates:

- Layout wrappers
- Shared page scaffolds
- Loading and empty states
- Project-level shell components

Poor candidates for early wrapping:

- Generic `Box`
- Generic `Stack`
- Generic `Typography`
- Any MUI component with no project-specific behavior

## Forms Strategy

Forms should follow a schema-first pattern using `zod` with `react-hook-form`.

This phase should provide:

- Base form provider composition
- A small number of field wrappers integrated with MUI
- Standard validation error rendering
- Standard submit/loading handling

This phase should not attempt to implement a large field component catalog.

## Tooling and Quality Gates

The repository should include pragmatic developer tooling with low friction.

### Package manager

- `Yarn`

### Code quality

- `eslint` configured with pragmatic defaults
- `prettier` for consistent formatting
- Rules should be strict enough to prevent obvious drift, but not so strict that setup becomes cumbersome

### Git hooks and commits

- `husky` for pre-commit enforcement
- `commitlint` using standard Conventional Commits
- Scope is not required in commit messages

## Expected Deliverables

Base project completion means:

- `Nx` monorepo boots correctly with `Yarn`
- `health-tracker-web` runs successfully
- Landing page renders
- Not-found route renders
- Shared provider stack is wired at the app root
- MUI theme is applied application-wide
- React Query is configured and available
- Supabase env and client bootstrap are ready
- Shared libraries for `theme`, `ui`, `forms`, `api`, and `state` exist at a minimal but usable level
- `eslint`, `prettier`, `husky`, and `commitlint` are configured and working

## Non-Goals

The following are intentionally deferred:

- Authentication
- Feature-level business screens
- Health data models and domain workflows
- Automated testing

## Risks and Controls

### Risk: over-abstracting MUI too early

Control:

- Limit `libs/ui` to opinionated project primitives only
- Allow direct MUI imports when no project-specific standard is needed

### Risk: route structure becoming too heavy for current scope

Control:

- Use a lightweight shell-ready route hierarchy rather than full per-feature route modules

### Risk: state management duplication

Control:

- Keep React Query as the only default server-state solution
- Treat `zustand` as optional and minimal until a real cross-cutting client-state need appears

## Success Criteria

This phase is successful if the team can start the next implementation phase on top of a stable repo foundation without first revisiting monorepo structure, provider composition, routing shape, or toolchain setup.
