### Task 04: Add a design-system preview screen and verify the phase

**Files:**

- Modify: `apps/health-tracker-web/src/app/providers.tsx`
- Modify: `apps/health-tracker-web/src/app/pages/landing-page.tsx`
- Modify: `docs/superpowers/plans/phase-1-health-tracker-design-system/index.md`
- Modify: `docs/superpowers/plans/phase-1-health-tracker-design-system/task-01-theme-and-dependencies.md`
- Modify: `docs/superpowers/plans/phase-1-health-tracker-design-system/task-02-ui-primitives.md`
- Modify: `docs/superpowers/plans/phase-1-health-tracker-design-system/task-03-form-primitives.md`
- Modify: `docs/superpowers/plans/phase-1-health-tracker-design-system/task-04-preview-and-verification.md`

- [x] **Step 1: Wire app-level localization support**

Update the app providers so date picker components can render correctly using Luxon.

Expected: The application provider stack supports every shared primitive introduced in this phase.

- [x] **Step 2: Turn the landing page into a design-system preview**

Replace the current placeholder landing content with a mobile-first preview that demonstrates:

- the new shell and bottom navigation
- buttons, chips, cards, and list items
- a representative form block using the new shared controls
- empty and loading states

Expected: The repo contains a living preview of the approved design system.

- [x] **Step 3: Verify and update tracking**

Run the phase verification commands:

- `yarn lint`
- `yarn build`

Then mark the phase index and all completed checklists as done.

Expected: The phase has fresh verification evidence and synchronized tracking files.
