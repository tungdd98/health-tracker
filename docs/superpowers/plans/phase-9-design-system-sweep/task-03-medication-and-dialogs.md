# Task 03: Refactor medication screens and route-level shared dialogs

**Design:** `docs/superpowers/designs/2026-04-28-medications.pen`, `docs/superpowers/designs/2026-04-27-settings.pen`

**Files:**

- Modify: `apps/health-tracker-web/src/app/components/app-confirm-dialog.tsx`
- Modify: `apps/health-tracker-web/src/app/medications/medication-page-layout.tsx`
- Modify: `apps/health-tracker-web/src/app/medications/medication-list-page.tsx`
- Modify: `apps/health-tracker-web/src/app/medications/medication-form-page.tsx`

- [x] Replace medication page-local surface and typography literals with shared roles.
- [x] Align dialog radius and action styling with the hardened button and surface contract.
- [x] Keep approved layout hierarchy while reducing repeated `sx` drift.

**Expected outcome:** Medication flows and confirmation surfaces look like part of the same product system.
