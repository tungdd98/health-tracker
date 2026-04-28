# Health Tracker Design System Contract Phase 8

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this phase task-by-task. Track progress in this file first, then inside the task file you are executing.

**Goal:** Audit hardcoded style drift and harden the shared design-system contract so app screens can consume consistent theme tokens and shared primitives.

**Architecture:** This phase keeps `libs/theme/src/lib/theme.ts` as the source of truth for shared visual tokens, extends it with semantic roles missing from the current system, and aligns `libs/ui` and `libs/forms` to those roles before screen-level cleanup starts.

**Tech Stack:** Nx, React, TypeScript, MUI, React Hook Form

**Design files:** `docs/superpowers/designs/2026-04-26-dashboard.pen`, `docs/superpowers/designs/2026-04-27-auth.pen`, `docs/superpowers/designs/2026-04-27-onboarding.pen`, `docs/superpowers/designs/2026-04-27-settings.pen`, `docs/superpowers/designs/2026-04-27-common-ui.pen`, `docs/superpowers/designs/2026-04-28-medications.pen`

---

## Tracking

- [x] Task 01: [Audit drift and define semantic token targets](task-01-audit-and-token-targets.md)
- [x] Task 02: [Extend the theme contract and shared overrides](task-02-theme-contract-and-overrides.md)
- [x] Task 03: [Align shared UI and form primitives](task-03-shared-primitives.md)

## File Structure Map

- `libs/theme/src/lib/theme.ts`
  - Semantic palette roles, radius tiers, shadow tiers, and compact typography helpers
- `libs/ui/src/lib/*`
  - Shared surface and navigation primitives aligned to the new contract
- `libs/forms/src/lib/form-field.tsx`
  - Shared label styling aligned to theme roles
- `docs/superpowers/plans/phase-8-design-system-contract/*`
  - Tracking for audit and contract hardening

## Spec Coverage

- Semantic roles for surface, border, warning/status colors: Tasks 01 and 02
- Radius and shadow consistency: Tasks 01, 02, and 03
- Typography consistency for labels/meta/helper text: Tasks 01, 02, and 03
- Shared button/surface/navigation consistency: Tasks 02 and 03
