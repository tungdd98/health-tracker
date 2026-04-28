# Task 01: Audit drift and define semantic token targets

**Files:**

- Read: `libs/theme/src/lib/theme.ts`
- Read: `libs/ui/src/lib/*`
- Read: `libs/forms/src/lib/form-field.tsx`
- Read: `apps/health-tracker-web/src/app/components/*`
- Read: `apps/health-tracker-web/src/app/dashboard/*`
- Read: `apps/health-tracker-web/src/app/medications/*`
- Read: `apps/health-tracker-web/src/app/onboarding/*`
- Read: `docs/superpowers/designs/2026-04-26-dashboard.pen`
- Read: `docs/superpowers/designs/2026-04-27-auth.pen`
- Read: `docs/superpowers/designs/2026-04-27-onboarding.pen`
- Read: `docs/superpowers/designs/2026-04-27-settings.pen`
- Read: `docs/superpowers/designs/2026-04-27-common-ui.pen`
- Read: `docs/superpowers/designs/2026-04-28-medications.pen`

- [x] Identify repeated hardcoded categories: color, surface, radius, shadow, typography, button treatment.
- [x] Group drift by shared primitives, auth/onboarding/settings, dashboard/daily-log, and medication flows.
- [x] Define which repeated values should become semantic tokens instead of staying screen-local.

**Expected outcome:** The implementation has a concrete contract target instead of replacing literals ad hoc.
