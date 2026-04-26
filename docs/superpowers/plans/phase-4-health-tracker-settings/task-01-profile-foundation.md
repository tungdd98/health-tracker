### Task 01: Extract shared profile field rules and metadata patch helpers

**Files:**

- Create: `apps/health-tracker-web/src/app/profile/profile-schemas.ts`
- Create: `apps/health-tracker-web/src/app/profile/profile-mappers.ts`
- Modify: `apps/health-tracker-web/src/app/onboarding/onboarding-schemas.ts`
- Modify: `libs/api/src/lib/onboarding.ts`
- Modify: `libs/api/src/index.ts`
- Read first: `docs/superpowers/specs/2026-04-26-settings-design.md`
- Read first: `apps/health-tracker-web/src/app/pages/onboarding-page.tsx`

- [x] **Step 1: Re-read the approved settings spec and current onboarding data flow**

Review:

- `docs/superpowers/specs/2026-04-26-settings-design.md`
- `apps/health-tracker-web/src/app/onboarding/onboarding-schemas.ts`
- `apps/health-tracker-web/src/app/pages/onboarding-page.tsx`
- `libs/api/src/lib/onboarding.ts`

Focus on:

- the required settings field groups
- the rule that `selectedPhase` stays read-only
- the requirement that settings and onboarding share validation behavior
- the existing metadata patch path that writes through Supabase auth user metadata

Expected: The worker understands which rules must be shared and which writes remain settings-specific.

- [x] **Step 2: Extract shared field-level schema helpers for profile data**

Create `apps/health-tracker-web/src/app/profile/profile-schemas.ts` and move reusable field rules there for:

- optional trimmed text
- optional date values based on the current Luxon form input approach
- optional positive integer values for cycle length
- optional positive numeric values for height and weight

Then update `apps/health-tracker-web/src/app/onboarding/onboarding-schemas.ts` so the onboarding step schemas consume those shared field rules instead of re-declaring them locally.

Expected: Onboarding and settings can rely on one field-rule source for the overlapping profile fields.

- [x] **Step 3: Add shared mapping helpers for section defaults and patch normalization**

Create `apps/health-tracker-web/src/app/profile/profile-mappers.ts` with helpers that can be reused by both onboarding and settings for:

- turning stored ISO date strings into Luxon values or `null`
- turning stored numeric values into string form defaults
- trimming/normalizing settings form submissions into metadata patches

Do not move onboarding page business flow into this file. Keep it focused on profile value conversion and normalization.

Expected: Settings page tasks can reuse stable value-shaping helpers instead of copying conversions from onboarding.

- [x] **Step 4: Tighten the shared metadata update surface in `libs/api`**

Update `libs/api/src/lib/onboarding.ts` only as needed so settings can submit targeted section patches cleanly. Acceptable outcomes include:

- keeping `updateOnboardingProfile` as the shared write path but documenting section-level patches more clearly, or
- adding tiny named wrappers for personal-info and cycle/body patch writes if that improves readability without hiding behavior

Also update `libs/api/src/index.ts` so any new shared helpers are exported.

Expected: The app layer has a clean way to write settings section patches without inventing a second persistence system.

- [x] **Step 5: Lint the shared profile foundation changes**

Run:

```bash
yarn eslint apps/health-tracker-web/src libs/api/src --max-warnings=0
```

Expected: The extracted schema and metadata helper changes lint cleanly before route and page work begins.

- [ ] **Step 6: Commit the shared profile foundation**

Run:

```bash
git add apps/health-tracker-web libs/api docs/superpowers/plans/phase-4-health-tracker-settings
git commit -m "feat: extract shared profile settings foundation"
```

Expected: Git records a focused commit for reusable profile validation and patch helpers.
