### Task 04: Build the personal-information settings section

**Files:**

- Create: `apps/health-tracker-web/src/app/settings/settings-schemas.ts`
- Create: `apps/health-tracker-web/src/app/settings/settings-types.ts`
- Create or Modify: `apps/health-tracker-web/src/app/components/settings-section-card.tsx`
- Modify: `apps/health-tracker-web/src/app/pages/settings-page.tsx`
- Read first: `apps/health-tracker-web/src/app/profile/profile-schemas.ts`
- Read first: `apps/health-tracker-web/src/app/profile/profile-mappers.ts`
- Read first: `libs/forms/src/index.ts`
- Read first: `docs/superpowers/specs/2026-04-26-settings-design.md`

- [x] **Step 1: Review the shared profile helpers and current form primitives**

Read:

- `apps/health-tracker-web/src/app/profile/profile-schemas.ts`
- `apps/health-tracker-web/src/app/profile/profile-mappers.ts`
- `libs/forms/src/index.ts`
- `docs/superpowers/specs/2026-04-26-settings-design.md`

Expected: The worker knows which shared rules to reuse and which UI primitives are already available.

- [x] **Step 2: Add settings-specific section schemas and value types**

Create `apps/health-tracker-web/src/app/settings/settings-schemas.ts` and `apps/health-tracker-web/src/app/settings/settings-types.ts` for the settings page with at least:

- one schema/value shape for `Thông tin cá nhân`
- one schema/value shape for `Chu kỳ & cơ thể`
- a small section-id or save-state model only if it helps keep `settings-page.tsx` readable

Build the section schemas from the shared profile field rules extracted in Task 01.

Expected: The settings page can validate each section independently without redefining overlapping field logic.

- [x] **Step 3: Build the reusable section presentation wrapper if it genuinely reduces repetition**

Create or refine `apps/health-tracker-web/src/app/components/settings-section-card.tsx` only if a shared wrapper improves readability for:

- section title and optional helper copy
- local status/error area
- consistent action-row spacing

If the page stays clearer without this abstraction, keep the logic directly in `settings-page.tsx` and document that choice in the commit.

Expected: Section presentation stays readable without inventing unnecessary component layers.

- [x] **Step 4: Implement the `Thông tin cá nhân` section**

Update `apps/health-tracker-web/src/app/pages/settings-page.tsx` so the page:

- reads the current persisted profile snapshot from `useAuthSession`
- displays read-only `Giai đoạn hiện tại`
- renders editable `Tên` and `Ngày sinh`
- owns local save/loading/success/error state for this section only
- validates this section without touching the cycle/body fields
- writes only the personal-information patch through the shared metadata write helper
- refreshes its local snapshot after a successful save

Expected: Personal information can be updated independently without affecting the rest of the page.

- [x] **Step 5: Lint the personal-information section**

Run:

```bash
yarn eslint apps/health-tracker-web/src --max-warnings=0
```

Expected: The personal-information section scaffolding lint cleans before the second section is added.

- [ ] **Step 6: Commit the personal-information section**

Run:

```bash
git add apps/health-tracker-web docs/superpowers/plans/phase-4-health-tracker-settings
git commit -m "feat: add personal settings section"
```

Expected: Git records a focused commit for the read-only phase display and personal-info save flow.
