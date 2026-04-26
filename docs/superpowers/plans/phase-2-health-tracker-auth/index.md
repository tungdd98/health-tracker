# Health Tracker Auth Phase 2

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this phase task-by-task. Track progress in this file first, then inside the task file you are executing.

**Goal:** Add complete Supabase email/password authentication with dedicated `Login` and `Sign Up` screens, session-aware routing, and a signed-in home flow for the Health Tracker web app.

**Architecture:** This phase keeps Supabase as the auth source of truth and adds a small auth infrastructure layer around the existing API bootstrap, then composes the auth UI and route guards in the app. The current landing page becomes a temporary private home so the user can enter and exit the app cleanly while keeping the phase tightly scoped.

**Tech Stack:** Nx, React, TypeScript, React Router, React Hook Form, Zod, MUI, Supabase

---

## Tracking

- [x] Task 01: [Extend the shared API layer for auth session and error handling](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-2-health-tracker-auth/task-01-auth-api-foundation.md)
- [x] Task 02: [Design the auth screens and states in Stitch](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-2-health-tracker-auth/task-02-stitch-auth-design.md)
- [x] Task 03: [Build the auth layout and the `Login` and `Sign Up` screens](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-2-health-tracker-auth/task-03-auth-ui-and-forms.md)
- [x] Task 04: [Wire route guards, session bootstrap, and the signed-in home flow](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-2-health-tracker-auth/task-04-auth-routing-and-home.md)
- [ ] Task 05: [Verify auth flows and sync plan tracking](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-2-health-tracker-auth/task-05-verification-and-tracking.md)

## File Structure Map

- `libs/api/src/lib/supabase.ts`
  - Upgrades the shared client configuration for auth session persistence behavior when needed
- `libs/api/src/lib/auth.ts`
  - Shared auth-facing helpers for session bootstrap, sign in, sign up, sign out, and auth state subscriptions
- `libs/api/src/lib/auth-errors.ts`
  - Maps Supabase auth failures into short Vietnamese UI messages
- `libs/api/src/index.ts`
  - Exports the auth helper surface to the app
- `docs/superpowers/specs/2026-04-26-auth-design.md`
  - Source spec for the Stitch auth screen states and implementation constraints
- `apps/health-tracker-web/src/app/router.tsx`
  - Declares public-only and private route behavior
- `apps/health-tracker-web/src/app/providers.tsx`
  - Hosts any app-wide auth bootstrap provider or loading composition needed before routing settles
- `apps/health-tracker-web/src/app/pages/login-page.tsx`
  - Login screen with hero content, validation, and sign-in submit flow
- `apps/health-tracker-web/src/app/pages/signup-page.tsx`
  - Sign-up screen with confirm-password validation and account-creation flow
- `apps/health-tracker-web/src/app/pages/landing-page.tsx`
  - Temporary authenticated home with user context and sign-out action
- `apps/health-tracker-web/src/app/pages/not-found-page.tsx`
  - Keeps not-found navigation coherent after auth routing is introduced
- `apps/health-tracker-web/src/app/components/auth-layout.tsx`
  - Shared warm auth screen layout and hero/form card composition
- `apps/health-tracker-web/src/app/components/auth-route-state.tsx`
  - Shared bootstrap/loading surface used while session state is resolving
- `apps/health-tracker-web/src/app/auth/*`
  - Small app-owned auth helpers such as form schemas, hooks, or guard wrappers if the implementation needs them

## Spec Coverage

- Stitch `Login` / `Sign Up` frames and state design: Task 02
- Dedicated `Login` and `Sign Up` routes: Tasks 03 and 04
- Warm mobile-first auth UI aligned to Stitch and the design system: Tasks 02 and 03
- Supabase sign in, sign up, sign out, and auth state listening: Tasks 01 and 04
- Public-only and private route redirects: Task 04
- Auth bootstrap loading state to prevent flicker: Task 04
- Vietnamese-friendly validation and mapped auth errors: Tasks 01 and 03
- Signed-in landing page as temporary dashboard with visible authenticated context: Task 04
- Lint, build, and manual auth verification: Task 05
