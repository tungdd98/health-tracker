### Task 01: Remove onboarding avatar and sticker flow from the basic profile step and onboarding page

**Files:**

- Modify: `apps/health-tracker-web/src/app/onboarding/basic-profile-step.tsx`
- Modify: `apps/health-tracker-web/src/app/pages/onboarding-page.tsx`
- Read first: `docs/superpowers/specs/2026-04-30-onboarding-sticker-removal-design.md`
- Read first: `docs/superpowers/specs/2026-04-29-avatar-mood-sticker-design.md`

- [x] **Step 1: Re-read the approved removal spec and the current onboarding sticker behavior**

Read:

- `docs/superpowers/specs/2026-04-30-onboarding-sticker-removal-design.md`
- `docs/superpowers/specs/2026-04-29-avatar-mood-sticker-design.md`
- `apps/health-tracker-web/src/app/onboarding/basic-profile-step.tsx`
- `apps/health-tracker-web/src/app/pages/onboarding-page.tsx`

Expected: The worker understands exactly which onboarding responsibilities are being deleted and which base onboarding fields must remain unchanged.

- [x] **Step 2: Simplify `basic-profile-step.tsx` back to personal fields only**

Update `apps/health-tracker-web/src/app/onboarding/basic-profile-step.tsx` so the component stops accepting or using avatar-upload props:

```ts
type BasicProfileStepProps = Record<string, never>;

export function BasicProfileStep(_: BasicProfileStepProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <FormTextField label="Tên hiển thị" name="displayName" placeholder="Ví dụ: Lan Anh" />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormDateField label="Ngày sinh" name="birthDate" />
      </Grid>
    </Grid>
  );
}
```

Expected: The basic-profile step renders only the existing personal fields and contains no avatar picker, upload spinner, hidden file input, or avatar-related imports.

- [x] **Step 3: Remove onboarding-owned avatar upload and sticker-generation state from `onboarding-page.tsx`**

Delete the onboarding-only imports and state branches from `apps/health-tracker-web/src/app/pages/onboarding-page.tsx`:

```ts
import {
  completeOnboarding,
  mapAuthErrorToMessage,
  type OnboardingProfile,
  updateOnboardingProfile,
} from '@health-tracker/api';

const [isSaving, setIsSaving] = useState(false);
const [submitError, setSubmitError] = useState('');
```

Remove all of the following onboarding-only pieces if they still exist:

- `generateMoodImages`
- `getUserMoodImages`
- `MoodValue`
- `updateAvatarMeta`
- `uploadAvatar`
- `compressImage`
- `MoodGeneratingOverlay`
- `OnboardingWowScreen`
- `isUploadingAvatar`
- `isGeneratingMood`
- `avatarFile`
- `avatarPreviewUrl`
- `showWowScreen`
- `wowMoodImages`
- `handleAvatarChange`
- `handleWowContinue`

Expected: `onboarding-page.tsx` owns only onboarding form persistence and step navigation, with no avatar or sticker side effects.

- [x] **Step 4: Restore the basic-profile submit path to a direct next-step transition**

In the `ONBOARDING_STEP_IDS.basicProfile` branch of `validateAndPersistCurrentStep`, keep only the profile save and next-step transition:

```ts
mergeProfileSnapshot({
  displayName: normalizeOptionalText(result.data.displayName) ?? null,
  birthDate: normalizeOptionalIsoDate(result.data.birthDate) ?? null,
});

setCurrentStepId(getNextOnboardingStepId(currentStepId) ?? ONBOARDING_STEP_IDS.cycle);
return;
```

Expected: After a successful basic-profile save, onboarding always continues directly to the next step without upload, generation, fallback, or wow-screen branching.

- [x] **Step 5: Render the simplified basic-profile step and remove the onboarding overlay branch**

Update the onboarding step switch and page return in `apps/health-tracker-web/src/app/pages/onboarding-page.tsx` so:

- `case ONBOARDING_STEP_IDS.basicProfile` returns `<BasicProfileStep />`
- the page no longer conditionally returns an onboarding wow screen
- the page no longer renders `<MoodGeneratingOverlay open={...} />`

Expected: The onboarding route has a single normal render path through `OnboardingLayout`.

- [x] **Step 6: Run focused lint on the onboarding files**

Run:

```bash
yarn eslint apps/health-tracker-web/src/app/onboarding/basic-profile-step.tsx \
  apps/health-tracker-web/src/app/pages/onboarding-page.tsx --max-warnings=0
```

Expected: The simplified onboarding files lint clean with no unused imports, no dead state, and no type errors surfaced by ESLint.

- [x] **Step 7: Commit the onboarding rollback**

Run:

```bash
git add apps/health-tracker-web/src/app/onboarding/basic-profile-step.tsx \
  apps/health-tracker-web/src/app/pages/onboarding-page.tsx
git commit -m "fix: remove onboarding sticker flow"
```

Expected: Git records a focused commit that removes onboarding avatar upload and sticker-generation behavior without touching settings.
