# Health Tracker Onboarding Phase 3

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this phase task-by-task. Track progress in this file first, then inside the task file you are executing.

**Goal:** Add a first-time-user onboarding wizard that collects initial pre-pregnancy profile data, requires lifecycle phase selection before app entry, supports optional skip behavior for later steps, and records completion only when the user reaches the final onboarding step.

**Architecture:** This phase keeps onboarding inside the authenticated app boundary but separates it from the main signed-in route. The app reads onboarding state from Supabase auth user metadata so route guards, onboarding steps, and later profile editing can share one lightweight source of truth without introducing database infrastructure in the same phase. The onboarding experience is implemented as a small wizard with focused app-owned screens and shared API helpers for metadata read and write operations.

**Tech Stack:** Nx, React, TypeScript, React Router, React Hook Form, Zod, MUI, Luxon, Supabase Auth metadata

---

## Tracking

- [x] Task 01: [Add the shared onboarding metadata contract and persistence helpers](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-3-health-tracker-onboarding/task-01-onboarding-api-foundation.md)
- [x] Task 02: [Design the onboarding screens in Google Stitch](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-3-health-tracker-onboarding/task-02-stitch-onboarding-design.md)
- [x] Task 03: [Gate authenticated routes with onboarding-aware session logic](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-3-health-tracker-onboarding/task-03-onboarding-routing-and-session.md)
- [ ] Task 04: [Build the onboarding wizard structure, schemas, and step components](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-3-health-tracker-onboarding/task-04-onboarding-ui-and-steps.md)
- [ ] Task 05: [Wire onboarding persistence, navigation, and completion behavior](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-3-health-tracker-onboarding/task-05-onboarding-flow-and-submit.md)
- [ ] Task 06: [Verify onboarding flows and synchronize plan tracking](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-3-health-tracker-onboarding/task-06-verification-and-tracking.md)

## File Structure Map

- `docs/superpowers/specs/2026-04-26-onboarding-design.md`
  - Source spec for this phase
- `task-02-stitch-onboarding-design.md`
  - Authoritative visual handoff for the onboarding default screens and implementation notes
- `libs/api/src/lib/onboarding.ts`
  - Shared onboarding metadata types, parsing, and update helpers
- `libs/api/src/index.ts`
  - Exports the onboarding helper surface
- `apps/health-tracker-web/src/app/auth/use-auth-session.ts`
  - Extends the auth session snapshot with parsed onboarding state and a required-phase readiness flag from user metadata
- `apps/health-tracker-web/src/app/router.tsx`
  - Adds onboarding-aware route guards and the onboarding route
- `apps/health-tracker-web/src/app/pages/landing-page.tsx`
  - Remains the temporary post-onboarding signed-in home
- `apps/health-tracker-web/src/app/components/onboarding-layout.tsx`
  - Shared layout shell for onboarding steps
- `apps/health-tracker-web/src/app/onboarding/onboarding-types.ts`
  - App-facing wizard step ids and form value types if needed for UI-only concerns
- `apps/health-tracker-web/src/app/onboarding/onboarding-steps.ts`
  - Ordered step definitions and progress metadata
- `apps/health-tracker-web/src/app/onboarding/onboarding-schemas.ts`
  - Zod schemas for each step
- `apps/health-tracker-web/src/app/onboarding/phase-step.tsx`
  - Required phase-selection step with disabled pregnancy option
- `apps/health-tracker-web/src/app/onboarding/basic-profile-step.tsx`
  - Optional name and birth-date step
- `apps/health-tracker-web/src/app/onboarding/cycle-step.tsx`
  - Optional cycle length and last-period step
- `apps/health-tracker-web/src/app/onboarding/body-metrics-step.tsx`
  - Optional height and weight step
- `apps/health-tracker-web/src/app/onboarding/completion-step.tsx`
  - Final completion CTA and message
- `apps/health-tracker-web/src/app/pages/onboarding-page.tsx`
  - Wizard state, step rendering, submit/skip behavior, and completion redirect

## Spec Coverage

- First-login onboarding routing after auth: Tasks 01 and 03
- Authoritative Stitch design for the onboarding default screens: Task 02
- Required phase selection with disabled pregnancy branch: Tasks 02, 04, and 05
- Optional profile, cycle, and body-metrics steps: Tasks 02, 04, and 05
- Incremental persistence on `Continue`: Tasks 01 and 05
- `Skip` and `Back` behavior: Task 05
- Completion-only `onboarding_completed` flag: Tasks 01 and 05
- Warm mobile-first onboarding UI: Tasks 02 and 04
- Verification and tracking updates: Task 06

## Notes For Implementers

- Use Supabase auth `user_metadata` for this phase rather than introducing a new database schema and migration system in parallel.
- Gate app entry on the required phase-selection step, not on the final completion flag. This preserves the approved rule that users who leave after the required first step may enter the app normally on later sign-ins.
- Keep blank number fields truly blank. Do not use `z.coerce.number().optional()` in a way that turns empty input into `0`.
- Keep onboarding business logic in app-owned onboarding files. `libs/ui` should only receive a reusable primitive if a real shared pattern emerges.
- The current signed-in home remains the post-onboarding destination until a later dashboard phase replaces it.
