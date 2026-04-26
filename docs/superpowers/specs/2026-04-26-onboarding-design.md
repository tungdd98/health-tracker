# Health Tracker Onboarding Design

- Date: 2026-04-26
- Project: Health Tracker
- Phase: Onboarding foundation
- Primary app: `health-tracker-web`

## Goal

Add a first-time-user onboarding flow that collects the minimum initial data needed to personalize the Health Tracker app for users who are preparing for pregnancy. This phase should begin immediately after authentication, guide the user through a small step-by-step setup, allow partial completion through skip actions, and mark onboarding as complete only when the user reaches the final completion step.

## Scope

Included in this phase:

- First-login onboarding routing after authentication
- A step-by-step onboarding wizard for first-time users
- Required phase selection with only the `pre-pregnancy` path enabled
- Optional profile collection for name and birth date
- Optional cycle data collection for cycle length and last period start date
- Optional body metrics collection for height and weight
- Per-step progress through `Back`, `Continue`, and `Skip` actions where allowed
- Incremental persistence of submitted onboarding data
- Final onboarding completion step that sets the completion flag

Explicitly excluded from this phase:

- Pregnancy onboarding flows
- Editing onboarding data from `Settings`
- A real post-onboarding dashboard
- Mood tracking
- Medication tracking or reminders
- AI chat or AI-driven recommendations
- Notifications
- Detailed fertility planning or medical guidance

## Recommended Approach

Use a dedicated private onboarding wizard route that sits between authentication and the main signed-in app, while persisting each completed step as the user moves through the flow.

Why this approach:

- It keeps onboarding logic separate from authentication and separate from the eventual dashboard
- It matches the user's expectation of a focused first-time setup flow rather than a generic profile form
- It preserves partial progress without forcing the app to build a full draft-recovery experience
- It leaves room for later `Settings` work to reuse the same stored data instead of migrating from temporary client-only state

## User Journey

The intended first-time flow is:

1. User signs up or logs in successfully
2. App checks whether onboarding is complete
3. If onboarding is incomplete, app routes the user into the onboarding wizard
4. User must choose a lifecycle phase before moving forward
5. User can complete, go back, or skip the remaining optional steps
6. User reaches the final completion step and confirms completion
7. App marks onboarding as complete and redirects to the signed-in home/dashboard placeholder

After onboarding has been completed once, future sign-ins should enter the app normally without reopening onboarding automatically.

## Routing Design

Onboarding should be treated as its own authenticated flow instead of an overlay on top of the future dashboard.

### Route behavior

- Authenticated user with incomplete onboarding:
  - Redirect to the onboarding flow
- Authenticated user with completed onboarding:
  - Redirect to the signed-in home/dashboard route
- Unauthenticated user:
  - Continue using the auth routes defined in the auth phase

### Route structure

The exact paths can follow the app's existing router conventions, but the flow should clearly distinguish:

- Auth routes such as `login` and `signup`
- Onboarding route(s) for first-time setup
- Main signed-in app route for post-onboarding usage

The onboarding flow should not depend on the future dashboard implementation to exist first.

## Wizard Design

The onboarding experience should use a linear wizard with a stable frame and one focused responsibility per step.

### Step order

1. `Select Phase`
2. `Basic Profile`
3. `Cycle Information`
4. `Body Metrics`
5. `Completion`

### Navigation rules

- `Select Phase` is mandatory and cannot be skipped
- Optional steps should provide `Back`, `Continue`, and `Skip`
- `Back` returns to the previous step and preserves any previously saved values
- `Skip` moves forward without storing data for that step
- `Continue` validates the current step and stores the entered values
- The wizard is considered complete only when the user reaches the final step and confirms completion

### Resume behavior

If the user leaves the app before the final step, they should not be forced back into onboarding on the next login. They may enter the app normally later, and future editing of these fields will belong to a `Settings` phase rather than to repeated onboarding entry.

## Step-by-Step Requirements

### Step 1: Select Phase

Purpose:

- Establish which product branch the user belongs to

Requirements:

- Present two large selectable options
- Enable `Preparing for pregnancy`
- Show `Currently pregnant` as visible but disabled
- Add a clear label such as `Coming soon` for the disabled option
- Prevent moving forward without selecting the enabled option

### Step 2: Basic Profile

Purpose:

- Collect baseline identity information for personalization

Fields:

- `display_name`
- `birth_date`

Behavior:

- Entire step is optional
- `Continue` stores any valid entered values
- `Skip` advances without storing values for this step

### Step 3: Cycle Information

Purpose:

- Collect the minimum cycle inputs needed for future cycle-aware features

Fields:

- `cycle_length_days`
- `last_period_start_date`

Behavior:

- Entire step is optional
- Include short explanatory copy for why the app asks for this data
- `Continue` stores any valid entered values
- `Skip` advances without storing values for this step

### Step 4: Body Metrics

Purpose:

- Collect basic physical context for future health-oriented features

Fields:

- `height_cm`
- `weight_kg`

Behavior:

- Entire step is optional
- `Continue` stores any valid entered values
- `Skip` advances without storing values for this step

### Step 5: Completion

Purpose:

- Confirm that the app is ready to begin

Requirements:

- Provide a short completion message
- Present a primary CTA to enter the app
- Set the onboarding completion flag only from this step

## Data Model

The design should separate onboarding state from the optional profile data collected during the wizard.

### Onboarding state

Required fields:

- `selected_phase`
- `onboarding_completed`

Recommended metadata:

- `onboarding_completed_at`

### Initial user profile fields

- `display_name`
- `birth_date`
- `cycle_length_days`
- `last_period_start_date`
- `height_cm`
- `weight_kg`

### Data-state rules

- Saving the first step should persist the chosen phase even though onboarding is not yet complete
- Optional steps may remain partially or entirely empty
- `onboarding_completed` stays `false` until the final completion action
- Stored onboarding/profile data should remain available for later reuse by future phases such as `Settings`, cycle tracking, or recommendations

## Persistence Strategy

Each step should persist on successful `Continue` rather than waiting for one final submit at the end.

### Persistence rules

- `Continue` on a valid step writes that step's data
- `Skip` advances without writing fields for that step
- Previously saved steps remain intact when the user navigates backward
- The final completion CTA writes the completion state and redirects into the app

### Why incremental persistence is preferred

- It avoids losing already-entered data if the page reloads mid-flow
- It supports clean step boundaries
- It keeps later profile editing compatible with the same stored source of truth

## UX and Validation

The onboarding UI should stay warm, calm, and lightweight, following the visual tone established by the auth phase.

### Layout principles

- Mobile-first layout
- One primary question or data group per screen
- Visible progress indicator
- Stable footer navigation across steps
- No dashboard-like chrome inside the wizard

### Validation rules

- Only the phase-selection step is required
- Optional steps validate entered values only when the user chooses `Continue`
- `Skip` should remain simple and should not block on validation
- Number inputs must treat blank values as blank, not as `0`

### Skip behavior

To avoid ambiguous partial submission, the preferred UX is:

- If the current optional step has no entered values, `Skip` advances immediately
- If the user has started typing, the implementation should use one clear rule consistently

Recommended rule:

- `Skip` is only shown or enabled when the current optional step is still empty

This keeps the early implementation simple and prevents confusion over whether partially entered values should be saved or discarded.

## Error Handling

The onboarding flow should handle validation and persistence failures without collapsing the step experience.

Requirements:

- Show field-level validation when `Continue` is used on invalid data
- Show short, human-readable submit errors if a save fails
- Keep the user on the current step when save fails
- Do not mark onboarding as complete unless the final completion write succeeds

## Architecture Boundaries

The implementation should follow the current repo boundaries and keep onboarding business logic readable at the app layer.

### App layer

`apps/health-tracker-web` should own:

- Onboarding pages or step screens
- Onboarding route composition and route guards
- Wizard-level navigation behavior
- Completion redirect behavior

### Shared libraries

- `libs/api` should own any shared API helpers or persistence contracts needed for onboarding reads and writes
- `libs/forms` should provide the field abstractions used by the step forms
- `libs/ui` should only host reusable presentation primitives if onboarding reveals a genuine shared need
- `libs/state` should only be used if the implementation truly needs cross-screen client state beyond route-local or form-local state

### Design principle

Do not hide onboarding business rules inside generic UI components. Keep the flow understandable by reading the onboarding screens and route wiring directly.

## Post-Onboarding Destination

This phase does not require the real dashboard to exist. After completion, the user can be routed into the current signed-in home or another temporary post-authenticated landing state already used by the app.

The important rule is:

- Incomplete onboarding users are routed into onboarding
- Completed onboarding users are routed into the main authenticated area

## Verification

This phase is complete when the following behaviors are verified:

- A newly authenticated user with incomplete onboarding is routed into the onboarding flow
- The user cannot move past phase selection without choosing the supported phase
- The disabled `Currently pregnant` option is visible but not selectable
- Optional steps can be skipped
- Entered values on optional steps persist when `Continue` succeeds
- Back navigation preserves already stored data
- Onboarding is marked complete only from the final completion step
- A completed user can enter the app normally on future sign-ins without being sent back into onboarding
- Lint and build both pass for the implementation

## Non-Goals

The following items should remain out of scope for this phase even if the data collected here will support them later:

- Settings-based profile editing
- Pregnancy-specific onboarding
- Mood and symptom logging
- Medication plans and reminders
- AI chat
- Advanced recommendations
- Notification flows
