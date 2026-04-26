# Health Tracker Settings Phase 4

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this phase task-by-task. Track progress in this file first, then inside the task file you are executing.

**Goal:** Add a minimal signed-in `Settings` route that lets the user edit onboarding-collected profile data in two independently saved sections and sign out through an explicit confirmation flow.

**Architecture:** This phase keeps the existing Supabase auth metadata as the source of truth for profile values, then layers a dedicated `Settings` page on top of the current signed-in app shell. The implementation should reuse or extract the same field-validation rules already used by onboarding so profile editing behaves consistently across first-time setup and later updates.

**Tech Stack:** Nx, React, TypeScript, React Router, React Hook Form, Zod, MUI, Luxon, Supabase Auth metadata, Google Stitch

---

## Tracking

- [ ] Task 01: [Extract shared profile field rules and metadata patch helpers](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-4-health-tracker-settings/task-01-profile-foundation.md)
- [ ] Task 02: [Design the settings screen in Google Stitch](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-4-health-tracker-settings/task-02-stitch-settings-design.md)
- [ ] Task 03: [Add the authenticated settings route and app navigation entry](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-4-health-tracker-settings/task-03-settings-routing-and-shell.md)
- [ ] Task 04: [Build the personal-information settings section](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-4-health-tracker-settings/task-04-settings-personal-info.md)
- [ ] Task 05: [Build the cycle-and-body section and confirmed sign-out flow](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-4-health-tracker-settings/task-05-settings-cycle-body-and-signout.md)
- [ ] Task 06: [Verify the settings flows and synchronize plan tracking](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-4-health-tracker-settings/task-06-verification-and-tracking.md)

## File Structure Map

- `docs/superpowers/specs/2026-04-26-settings-design.md`
  - Source spec for the settings phase
- `task-02-stitch-settings-design.md`
  - Authoritative visual handoff for the default settings screen and implementation-state notes
- `libs/api/src/lib/onboarding.ts`
  - Existing metadata source of truth, expanded only as needed with safer section-level patch helpers
- `libs/api/src/index.ts`
  - Re-exports any shared helpers added for settings/profile editing
- `apps/health-tracker-web/src/app/profile/profile-schemas.ts`
  - Shared field-level schema helpers used by both onboarding and settings
- `apps/health-tracker-web/src/app/profile/profile-mappers.ts`
  - Shared value-normalization helpers for ISO dates, optional numbers, and section snapshot shaping
- `apps/health-tracker-web/src/app/onboarding/onboarding-schemas.ts`
  - Updated to consume shared field rules instead of owning duplicate profile validation logic
- `apps/health-tracker-web/src/app/router.tsx`
  - Adds the private `Settings` route
- `apps/health-tracker-web/src/app/pages/landing-page.tsx`
  - Adds a real in-app path into settings and removes settings-owned account actions when appropriate
- `apps/health-tracker-web/src/app/pages/settings-page.tsx`
  - Owns the settings page composition, section state, and route-level behavior
- `apps/health-tracker-web/src/app/components/settings-section-card.tsx`
  - Shared section wrapper for title, description, status, and section-level save action if a reusable pattern emerges
- `apps/health-tracker-web/src/app/components/sign-out-confirm-dialog.tsx`
  - Account sign-out confirmation dialog used by the settings page
- `apps/health-tracker-web/src/app/settings/settings-schemas.ts`
  - Section-level settings schemas built from shared profile field rules
- `apps/health-tracker-web/src/app/settings/settings-types.ts`
  - Settings form value and section id types if the page benefits from explicit app-owned types

## Spec Coverage

- Private `Settings` route in the signed-in app: Tasks 03, 04, and 05
- Authoritative Stitch design for the default settings screen: Task 02
- `Thông tin cá nhân` section with read-only phase plus editable `display_name` and `birth_date`: Tasks 01 and 04
- `Chu kỳ & cơ thể` section with editable cycle/body fields: Tasks 01 and 05
- Independent section save behavior and local error states: Tasks 01, 04, and 05
- Reuse of onboarding-backed profile persistence: Tasks 01, 04, and 05
- Logout confirmation dialog and route return to `login`: Tasks 03 and 05
- Lint, build, and settings-specific manual verification: Task 06

## Notes For Implementers

- Keep `selectedPhase` read-only in this phase. Do not introduce a phase-switching UI or write path.
- Prefer extracting shared profile field rules from onboarding instead of duplicating validation logic under `settings`.
- Keep blank numeric fields truly blank. Do not regress into `'' -> 0` coercion.
- The Stitch default settings screen is the only authoritative design source for implementation. Validation, loading, success, and error states should be applied in code without replacing the approved layout.
- Move the primary sign-out action to `Settings` so the account flow matches the approved spec, but do not broaden the home screen into a dashboard while doing so.
