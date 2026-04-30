# Onboarding Sticker Removal Design

- Date: 2026-04-30
- Project: Health Tracker
- Phase: Onboarding simplification for avatar mood stickers
- Primary app: `health-tracker-web`

## Goal

Remove avatar upload and sticker creation from onboarding so the first-time setup flow stays focused on core profile and health inputs. Personal avatar stickers should remain available only from `Settings`.

## Scope

Included in this change:

- Remove avatar upload from the onboarding `Basic Profile` step
- Remove onboarding-triggered mood sticker generation
- Remove the onboarding wow screen that previews generated stickers
- Keep onboarding completely silent about stickers and avatar personalization
- Preserve the existing sticker workflow under `Settings`

Explicitly excluded from this change:

- Redesigning the rest of onboarding
- Removing avatar upload from `Settings`
- Removing sticker regeneration, preview, or toggle behavior from `Settings`
- Adding new onboarding hints, promos, or education about stickers
- Changing the underlying sticker storage or generation backend

## Recommended Approach

Use a full rollback of sticker-related onboarding entry points rather than hiding them behind dormant code paths.

Why this approach:

- It restores a cleaner onboarding journey with fewer distractions
- It avoids leaving dead async branches and unused state in the onboarding page
- It makes `Settings` the single clear owner of avatar and sticker behavior
- It reduces the chance that future onboarding work accidentally reuses stale sticker logic

## User Journey

The intended user flow after this change is:

1. User completes onboarding through the existing five-step flow
2. `Basic Profile` collects only the existing personal-information fields
3. Advancing from `Basic Profile` goes directly to the next onboarding step
4. User finishes onboarding without seeing avatar upload, sticker generation, or sticker messaging
5. If the user later wants personal stickers, they must go to `Settings`

## Onboarding Behavior

The onboarding flow should remain:

1. `Select Phase`
2. `Basic Profile`
3. `Cycle Information`
4. `Body Metrics`
5. `Completion`

### Basic Profile step

Requirements:

- Show only the existing personal-information fields already owned by this step
- Do not render avatar upload UI
- Do not mention stickers, personalization via avatar, or later sticker creation
- Preserve the existing validation and skip behavior for the remaining fields

### Step transition behavior

Requirements:

- Continuing from `Basic Profile` should persist the basic-profile fields only
- The step should not trigger avatar upload
- The step should not trigger mood-image generation
- The step should not branch to any sticker-preview or wow screen
- After a successful save, onboarding proceeds directly to the next step

## Settings Ownership

`Settings` becomes the only product surface that owns avatar and sticker actions.

Requirements:

- Avatar upload remains available in `Settings`
- Sticker generation or regeneration remains initiated from `Settings`
- Sticker preview and the personal-sticker toggle remain in `Settings`
- No onboarding dependency should be required for the settings-based sticker workflow to function

## Code Shape

The implementation should simplify onboarding rather than hide features.

Expected changes:

- Remove sticker-related state, handlers, and async branches from `apps/health-tracker-web/src/app/pages/onboarding-page.tsx`
- Restore `apps/health-tracker-web/src/app/onboarding/basic-profile-step.tsx` to a non-avatar version
- Remove the onboarding wow-screen component if it becomes unused
- Remove onboarding-only imports related to avatar upload, sticker generation, wow-screen rendering, and sticker loading UI
- Keep the settings page and shared sticker components intact unless a small copy adjustment is needed for standalone clarity

## Documentation Impact

This spec supersedes the onboarding-specific portion of `docs/superpowers/specs/2026-04-29-avatar-mood-sticker-design.md`.

After implementation planning:

- The implementation plan should replace the old onboarding avatar/wow-screen task assumptions
- The settings-side sticker tasks remain valid unless a later decision changes that scope

## Verification

The change is complete when:

- Onboarding shows no avatar upload affordance
- Onboarding shows no sticker-generation loading state
- Onboarding shows no wow-screen or sticker preview branch
- The five-step onboarding flow still completes successfully
- `Settings` still supports avatar upload, sticker generation or regeneration, preview, and the sticker toggle
- `yarn format`, `yarn lint`, and `yarn build` pass once implementation is done
