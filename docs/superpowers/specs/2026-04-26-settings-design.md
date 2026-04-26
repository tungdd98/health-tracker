# Health Tracker Settings Design

- Date: 2026-04-26
- Project: Health Tracker
- Phase: Settings foundation
- Primary app: `health-tracker-web`

## Goal

Add a minimal signed-in `Settings` experience that lets the user review and update the personal data collected during onboarding, while also providing a clear `Sign Out` action. This phase should keep the scope intentionally small: reuse the existing onboarding-backed profile data, avoid introducing broader account-management features, and give the signed-in app its first real settings surface.

## Scope

Included in this phase:

- A private `Settings` route inside the signed-in app
- A `Thông tin cá nhân` section with editable `display_name` and `birth_date`
- A read-only display of the current selected phase
- A `Chu kỳ & cơ thể` section with editable `cycle_length_days`, `last_period_start_date`, `height_cm`, and `weight_kg`
- Independent save actions for each editable section
- A `Tài khoản` section with a `Đăng xuất` action
- A logout confirmation dialog before sign-out completes
- Reuse of the same persisted onboarding/profile source of truth already used after authentication

Explicitly excluded from this phase:

- Changing the selected lifecycle phase
- Re-entering the onboarding wizard from settings
- App preferences such as language, units, theme, or notifications
- Email change, password change, or account deletion
- Security history, session management, or multi-device account controls
- A broader settings information architecture for future phases

## Recommended Approach

Use one dedicated `Settings` page in the authenticated app shell, with two editable sections that save independently and one separate destructive account action.

Why this approach:

- It matches the current product scope without overbuilding a large settings system too early
- It reuses the natural data groupings already established in onboarding
- It reduces validation and persistence risk by keeping save behavior local to each section
- It leaves room to add more settings sections later without redesigning the first settings page

## User Experience

The settings experience should feel like a stable signed-in destination rather than a continuation of the onboarding wizard.

### Page structure

The page should be composed as:

- Page header with the title `Cài đặt`
- `Thông tin cá nhân` section
- `Chu kỳ & cơ thể` section
- `Tài khoản` section

The screen should remain mobile-first and aligned with the current signed-in visual system.

### Section 1: Thông tin cá nhân

This section should show:

- `Giai đoạn hiện tại` as read-only display text
- `Tên` as an editable field
- `Ngày sinh` as an editable field
- A section-level `Lưu thay đổi` action

Behavior:

- `Giai đoạn hiện tại` is visible for context but cannot be edited in this phase
- The user can update only the editable fields in this section
- Saving this section should not trigger validation or persistence for other settings sections

### Section 2: Chu kỳ & cơ thể

This section should show editable fields for:

- `Độ dài chu kỳ`
- `Ngày bắt đầu kỳ gần nhất`
- `Chiều cao`
- `Cân nặng`
- A section-level `Lưu thay đổi` action

Behavior:

- This section saves independently from `Thông tin cá nhân`
- The user may leave optional fields blank
- Validation and error display stay local to this section

### Section 3: Tài khoản

This section should provide:

- A `Đăng xuất` action styled clearly as an account-level action

Behavior:

- Tapping `Đăng xuất` opens a confirmation dialog
- Only explicit confirmation completes sign-out
- Successful sign-out returns the user to `login`

## Routing Design

`Settings` should be part of the authenticated app surface, not part of onboarding.

### Route behavior

- Authenticated user can open the `Settings` route normally
- Unauthenticated user attempting to open `Settings` should be redirected through the existing auth guard behavior
- Signing out from `Settings` should terminate the active session and return the app to `login`

### App navigation requirement

The current signed-in placeholder home should expose a clear path into `Settings` so the page is reachable through normal in-app navigation.

## Data and Persistence Design

The phase should reuse the current onboarding/profile persistence model rather than introducing a new settings-specific data store.

### Source of truth

The fields shown in `Settings` should come from the same persisted onboarding/profile data already read after login.

That includes:

- `selected_phase`
- `display_name`
- `birth_date`
- `cycle_length_days`
- `last_period_start_date`
- `height_cm`
- `weight_kg`

### Save model

Each editable section owns its own save flow.

Rules:

- `Thông tin cá nhân` submits only its editable fields
- `Chu kỳ & cơ thể` submits only its editable fields
- Read-only `selected_phase` is never patched from this screen
- A failed save in one section must not block editing or saving the other section
- After a successful save, the screen should refresh its local snapshot so the latest persisted values are reflected immediately

## Validation Rules

Settings should preserve the same validation behavior the app uses for onboarding data so the same field does not behave differently depending on where it is edited.

### Personal information

- `display_name` is optional
- If `display_name` is entered, it should be trimmed and treated as meaningful text rather than whitespace-only input
- `birth_date` is optional
- If `birth_date` is entered, it must be a valid date in the app's chosen date-input format

### Cycle and body metrics

- `cycle_length_days` is optional
- `last_period_start_date` is optional
- `height_cm` is optional
- `weight_kg` is optional
- Blank optional numeric fields must remain blank rather than being coerced into `0`
- If any optional field is entered, it must satisfy the same value rules already used by onboarding

## UI States and Error Handling

Each settings section should manage its own UI state rather than forcing the entire page into one shared submit state.

### Section-level states

Each editable section should support:

- `idle`
- `saving`
- `success`
- `error`

Behavior expectations:

- While a section is saving, only that section's save action needs to be disabled or show loading
- A successful save should show short, local confirmation feedback
- A failed save should keep the user's edited input intact so it can be corrected and retried
- Errors should be presented near the relevant section instead of through a page-wide failure state

### Logout state

The confirmation dialog should also support a short in-flight state:

- While sign-out is running, confirmation controls should prevent duplicate submission
- If sign-out fails, the user should remain in context and see a clear error message

## Architecture Boundaries

The implementation should follow the existing monorepo boundaries and avoid mixing business logic into generic UI primitives.

### App layer

`apps/health-tracker-web` should own:

- The `Settings` page and route composition
- Section layout and page-level composition
- Logout confirmation dialog behavior
- Navigation entry into `Settings`

### Shared libraries

- `libs/api` should remain the place for shared session and profile persistence helpers
- `libs/forms` should continue to provide reusable form controls and validation-friendly field abstractions
- `libs/ui` should provide generic layout and interaction primitives, not settings-specific business flows
- If any shared validation helper is extracted from onboarding for reuse, it should stay focused on shared field rules rather than becoming a large settings abstraction

## Testing and Verification

This phase is complete when the following behaviors are verified:

- Authenticated users can reach `Settings`
- Unauthenticated users cannot access `Settings` directly
- Existing persisted profile data renders correctly in each section
- Saving `Thông tin cá nhân` only patches personal-information fields
- Saving `Chu kỳ & cơ thể` only patches cycle/body fields
- Blank optional numeric inputs do not become `0`
- The logout confirmation dialog appears and successful confirmation returns the user to `login`
- The repo still passes the required verification commands for this codebase: `yarn lint` and `yarn build`

## Constraints

- Keep this phase intentionally narrow
- Do not redesign onboarding around settings
- Do not turn settings into a catch-all destination for future account work
- Do not add preferences or security work that has not been approved
- Do not allow selected phase editing until the product supports that branch safely

## Success Criteria

The settings phase is successful when:

- signed-in users have a clear route to a minimal settings page
- onboarding-collected profile data can be reviewed and edited after first-time setup
- both editable sections save independently and predictably
- logout is available, confirmed explicitly, and routed correctly
- the implementation stays aligned with the current onboarding data model instead of introducing duplicate profile logic
