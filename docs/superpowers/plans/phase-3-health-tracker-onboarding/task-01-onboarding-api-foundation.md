### Task 01: Add the shared onboarding metadata contract and persistence helpers

**Files:**

- Create: `libs/api/src/lib/onboarding.ts`
- Modify: `libs/api/src/index.ts`
- Read first: `docs/superpowers/specs/2026-04-26-onboarding-design.md`
- Read first: `libs/api/src/lib/auth.ts`

- [x] **Step 1: Review the existing auth client surface and the approved onboarding spec**

Read these files before editing:

- `docs/superpowers/specs/2026-04-26-onboarding-design.md`
- `libs/api/src/lib/auth.ts`
- `libs/api/src/index.ts`

Expected: The worker understands that this phase stores onboarding state in Supabase auth metadata rather than introducing a new database layer.

- [x] **Step 2: Create the shared onboarding metadata types and parser**

Create `libs/api/src/lib/onboarding.ts` with:

- a literal supported phase union for the current phase such as `'pre-pregnancy'`
- an `OnboardingProfile` type covering:
  - `selectedPhase`
  - `onboardingCompleted`
  - `onboardingCompletedAt`
  - `displayName`
  - `birthDate`
  - `cycleLengthDays`
  - `lastPeriodStartDate`
  - `heightCm`
  - `weightKg`
- a parser like `getOnboardingProfileFromUser(user: User | null): OnboardingProfile`
- safe defaults so missing metadata returns an incomplete but valid onboarding profile shape

Use a focused runtime guard instead of trusting `user_metadata` blindly.

Expected: App code can read normalized onboarding state from any authenticated user object without duplicating metadata parsing logic.

- [x] **Step 3: Add metadata update helpers that preserve unrelated user metadata**

In `libs/api/src/lib/onboarding.ts`, add:

- `updateOnboardingProfile(user: User, patch: Partial<OnboardingProfile>)`
- `completeOnboarding(user: User)`

Implementation requirements:

- merge the patch with the existing `user.user_metadata`
- write through `supabase.auth.updateUser({ data: ... })`
- never drop unrelated user metadata keys
- keep `completeOnboarding` focused on `onboardingCompleted` and `onboardingCompletedAt`

Expected: The app has one safe place to write onboarding state without accidentally replacing the entire auth metadata object.

- [x] **Step 4: Export the onboarding API surface**

Update `libs/api/src/index.ts` to export the onboarding helpers and types together with the existing auth/query/env exports.

Expected: App code can import onboarding metadata helpers from `@health-tracker/api`.

- [x] **Step 5: Lint the shared API changes**

Run:

```bash
yarn eslint libs/api/src --max-warnings=0
```

Expected: The API helper changes lint cleanly before app code starts using them.

- [x] **Step 6: Commit the onboarding API foundation**

Run:

```bash
git add libs/api docs/superpowers/plans/phase-3-health-tracker-onboarding
git commit -m "feat: add onboarding metadata helpers"
```

Expected: Git records a focused commit for onboarding metadata read/write helpers.
