# Health Tracker Design System Phase 1

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this phase task-by-task. Track progress in this file first, then inside the task file you are executing.

**Goal:** Sync the approved mobile-first Stitch design system into the shared theme, UI, and form foundations used by the Health Tracker web app.

**Architecture:** This phase keeps Stitch as the visual source of truth and translates its tokens and component inventory into the existing `theme`, `ui`, and `forms` libraries. The app shell and landing route become a living preview so the repo has a concrete, reusable design baseline before feature screens are built.

**Tech Stack:** Nx, React, TypeScript, MUI, MUI Icons, MUI X Date Pickers, React Hook Form, Luxon

---

## Tracking

- [x] Task 01: [Install design-system dependencies and rebuild the shared theme](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-1-health-tracker-design-system/task-01-theme-and-dependencies.md)
- [x] Task 02: [Implement mobile-first UI primitives and shell updates](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-1-health-tracker-design-system/task-02-ui-primitives.md)
- [x] Task 03: [Expand the forms library with shared controls](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-1-health-tracker-design-system/task-03-form-primitives.md)
- [x] Task 04: [Add a design-system preview screen and verify the phase](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-1-health-tracker-design-system/task-04-preview-and-verification.md)

## File Structure Map

- `package.json`
  - Adds direct dependencies for the approved font and date picker support
- `libs/theme/src/lib/theme.ts`
  - Shared MUI theme tokens and component overrides
- `libs/theme/src/index.ts`
  - Theme export surface and font side effects
- `libs/ui/src/lib/*`
  - Mobile-first shell, navigation, surface, and feedback primitives
- `libs/ui/src/index.ts`
  - UI public exports
- `libs/forms/src/lib/*`
  - Shared RHF-powered form controls
- `libs/forms/src/index.ts`
  - Forms public exports
- `apps/health-tracker-web/src/app/providers.tsx`
  - App-level provider wiring for date localization
- `apps/health-tracker-web/src/app/pages/landing-page.tsx`
  - Design-system preview screen

## Spec Coverage

- `Plus Jakarta Sans` everywhere: Tasks 01 and 04
- Soft rose mobile-first theme tokens: Task 01
- Navigation and surface primitives: Task 02
- Form components including date picker, segmented control, and stepper: Task 03
- Working in-app preview and phase verification: Task 04
