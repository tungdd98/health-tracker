### Task 01: Tighten cycleLengthDays schema to range [21, 45]

**Files:**

- Modify: `apps/health-tracker-web/src/app/profile/profile-schemas.ts`
- Modify: `apps/health-tracker-web/src/app/onboarding/onboarding-schemas.ts`
- Modify: `apps/health-tracker-web/src/app/settings/settings-schemas.ts`

- [ ] **Step 1: Add `cycleLengthDaysSchema` to `profile-schemas.ts`**

In `apps/health-tracker-web/src/app/profile/profile-schemas.ts`, add after the existing `optionalPositiveIntegerSchema`:

```typescript
export const cycleLengthDaysSchema = z.preprocess(
  parseOptionalPositiveNumber,
  z.number().int().min(21).max(45).optional(),
);
```

- [ ] **Step 2: Update `onboarding-schemas.ts` to use the new schema**

In `apps/health-tracker-web/src/app/onboarding/onboarding-schemas.ts`, change the import:

```typescript
import {
  cycleLengthDaysSchema,
  optionalDateTimeSchema,
  optionalPositiveNumberSchema,
  optionalTrimmedTextSchema,
} from '../profile/profile-schemas';
```

Change `onboardingCycleSchema`:

```typescript
export const onboardingCycleSchema = z.object({
  cycleLengthDays: cycleLengthDaysSchema,
  lastPeriodStartDate: optionalDateTimeSchema,
});
```

- [ ] **Step 3: Update `settings-schemas.ts` to use the new schema**

In `apps/health-tracker-web/src/app/settings/settings-schemas.ts`, change the import:

```typescript
import {
  cycleLengthDaysSchema,
  optionalDateTimeSchema,
  optionalPositiveNumberSchema,
  optionalTrimmedTextSchema,
} from '../profile/profile-schemas';
```

Change `cycleAndBodySettingsSchema`:

```typescript
export const cycleAndBodySettingsSchema = z.object({
  cycleLengthDays: cycleLengthDaysSchema,
  lastPeriodStartDate: optionalDateTimeSchema,
  heightCm: optionalPositiveNumberSchema,
  weightKg: optionalPositiveNumberSchema,
});
```

- [ ] **Step 4: Verify**

```bash
yarn lint && yarn build
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add apps/health-tracker-web/src/app/profile/profile-schemas.ts \
        apps/health-tracker-web/src/app/onboarding/onboarding-schemas.ts \
        apps/health-tracker-web/src/app/settings/settings-schemas.ts
git commit -m "feat: tighten cycleLengthDays schema to [21, 45]"
```

- [ ] **Step 6: Mark complete in index.md**

Check off Task 01 in `docs/superpowers/plans/phase-5-dashboard/index.md`.
