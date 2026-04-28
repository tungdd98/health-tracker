# Task 01: Refactor auth, onboarding, and settings surfaces

**Design:** `docs/superpowers/designs/2026-04-27-auth.pen`, `docs/superpowers/designs/2026-04-27-onboarding.pen`, `docs/superpowers/designs/2026-04-27-settings.pen`

**Files:**

- Modify: `apps/health-tracker-web/src/app/components/auth-layout.tsx`
- Modify: `apps/health-tracker-web/src/app/components/auth-route-state.tsx`
- Modify: `apps/health-tracker-web/src/app/components/onboarding-layout.tsx`
- Modify: `apps/health-tracker-web/src/app/components/settings-section-card.tsx`
- Modify: `apps/health-tracker-web/src/app/onboarding/phase-step.tsx`
- Modify: `apps/health-tracker-web/src/app/onboarding/completion-step.tsx`
- Modify: `apps/health-tracker-web/src/app/pages/login-page.tsx`
- Modify: `apps/health-tracker-web/src/app/pages/signup-page.tsx`

- [x] Replace repeated radius, shadow, and hero badge styling with shared theme roles.
- [x] Align labels and helper text to shared typography roles.
- [x] Preserve approved layouts while removing screen-local token drift.

**Expected outcome:** Auth, onboarding, and settings use the same visual contract instead of near-duplicate custom styling.
