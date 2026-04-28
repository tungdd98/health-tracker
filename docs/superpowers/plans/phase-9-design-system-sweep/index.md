# Health Tracker Design System Sweep Phase 9

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this phase task-by-task. Track progress in this file first, then inside the task file you are executing.

**Goal:** Refactor app screens to consume the hardened design-system contract across auth, onboarding, settings, dashboard, daily-log, calendar, and medication flows.

**Architecture:** This phase applies the semantic contract from phase 8 to app-owned screens, preserving approved layouts from the existing Pencil files while removing hardcoded style duplication from route-level components.

**Tech Stack:** Nx, React, TypeScript, MUI, Luxon, React Hook Form

**Design files:** `docs/superpowers/designs/2026-04-26-dashboard.pen`, `docs/superpowers/designs/2026-04-27-auth.pen`, `docs/superpowers/designs/2026-04-27-onboarding.pen`, `docs/superpowers/designs/2026-04-27-settings.pen`, `docs/superpowers/designs/2026-04-28-medications.pen`

---

## Tracking

- [x] Task 01: [Refactor auth, onboarding, and settings surfaces](task-01-auth-onboarding-settings.md)
- [x] Task 02: [Refactor dashboard, daily-log, and calendar surfaces](task-02-dashboard-and-calendar.md)
- [x] Task 03: [Refactor medication screens and route-level shared dialogs](task-03-medication-and-dialogs.md)
- [x] Task 04: [Verify lint and build, then sync tracking](task-04-verification-and-tracking.md)

## File Structure Map

- `apps/health-tracker-web/src/app/components/*`
  - Shared route-level surfaces and dialogs
- `apps/health-tracker-web/src/app/onboarding/*`
  - Onboarding card, option, and completion styling aligned to the new contract
- `apps/health-tracker-web/src/app/dashboard/*`
  - Hero, bottom sheets, strips, and calendar pieces consume semantic theme roles
- `apps/health-tracker-web/src/app/medications/*`
  - Medication list/form/layout use the same surface, label, and button rules
- `docs/superpowers/plans/phase-9-design-system-sweep/*`
  - Tracking for the full-app cleanup pass

## Spec Coverage

- Auth/onboarding/settings cleanup: Task 01
- Dashboard/daily-log/calendar cleanup: Task 02
- Medication and dialog cleanup: Task 03
- Verification and tracking sync: Task 04
