# Health Tracker Auth Design

- Date: 2026-04-26
- Project: Health Tracker
- Phase: Auth foundation
- Primary app: `health-tracker-web`

## Goal

Add a production-ready authentication foundation for the Health Tracker web app using Supabase email/password auth. This phase should deliver complete `Login` and `Sign Up` flows, route protection, session-aware redirects, and a signed-in landing experience that proves the auth loop works end-to-end.

## Scope

Included in this phase:

- `Login` screen with `email + password`
- `Sign Up` screen with `email + password + confirm password`
- Supabase auth integration for sign in, sign up, sign out, and session bootstrap
- Public-only routing for `/login` and `/signup`
- Private routing for `/`
- Automatic redirect to `/` when an authenticated user opens auth routes
- Automatic redirect to `/login` when an unauthenticated user opens `/`
- Auth bootstrap loading state to prevent route flicker before session resolution
- Warm, mobile-first auth UI aligned to the current Stitch-driven design system
- Signed-in home experience using the current landing page as the temporary dashboard, updated to clearly reflect authenticated state
- Human-readable auth error handling for the initial supported cases

Explicitly excluded from this phase:

- Social login
- Forgot password
- Mandatory email verification before app access
- User profile collection and onboarding flows
- Role- or permission-based access control
- Additional private product screens beyond the temporary home/dashboard
- Automated tests beyond the existing repo verification approach

## Recommended Approach

Use two dedicated auth routes backed by Supabase session handling and lightweight auth-specific app infrastructure.

Why this approach:

- It matches the current monorepo structure without overbuilding a full auth module too early
- It keeps route control predictable by separating public-only and private behavior
- It gives future phases a clean base for onboarding, profile setup, and more private app routes
- It preserves the approved mobile-first design direction instead of treating auth as a generic utility screen

## User Experience

The auth experience should feel warm, calm, and health-oriented while keeping the form as the primary focus.

### Screen structure

Both auth screens should share one layout pattern:

- A small hero section above the form
- A rounded form card below it
- A single-column composition optimized for mobile first
- A centered desktop presentation that remains compact rather than expanding into a dashboard-style layout

### Tone and visual direction

- Follow the existing soft rose / blush design system direction
- Keep the auth copy short, clear, and reassuring
- Use health-oriented guidance in the hero content without distracting from the task
- Avoid illustrations or additional media in this phase

### Login screen

The `Login` screen should include:

- Email field
- Password field with show/hide toggle
- Primary CTA: sign in
- Secondary cross-link to `Sign Up`
- Inline validation and submit-level error feedback

The hero should frame the experience as returning to the user's health rhythm or daily tracking habit.

### Sign Up screen

The `Sign Up` screen should include:

- Email field
- Password field with show/hide toggle
- Confirm password field
- Visible password rule: minimum `8` characters
- Primary CTA: create account
- Secondary cross-link to `Login`
- Inline validation and submit-level error feedback

The hero should frame the experience as starting a gentle, sustainable health tracking journey.

### Interaction details

- First field should autofocus when practical
- Pressing Enter should submit the form
- CTA should show a loading state and prevent duplicate submissions
- Error presentation should not cause large layout shifts
- Screen copy should remain in Vietnamese for UI consistency

## Routing Design

The route structure should expand from the current simple router into three behavior groups.

### Public-only routes

- `/login`
- `/signup`

These routes are only for unauthenticated users. If a valid session already exists, the app should redirect to `/`.

### Private route

- `/`

This route acts as the temporary authenticated home/dashboard. If no valid session exists, the app should redirect to `/login`.

### Auth bootstrap state

At app startup, auth status must be resolved before route guards make redirect decisions. The app should show a lightweight auth bootstrap loading state while Supabase session resolution is in progress so users do not briefly see the wrong screen.

## Auth and Session Behavior

The app should rely on Supabase as the auth source of truth.

### Required flows

- `Login` uses Supabase email/password sign-in
- `Sign Up` uses Supabase email/password sign-up
- Successful `Sign Up` should place the user into the app immediately rather than stopping on an email-confirmation gate
- `Sign Out` should terminate the active session and return the user to `/login`
- The app should subscribe to auth state changes so session updates are reflected without manual refresh

### Session-aware UX rules

- If a user is signed in and opens `/login` or `/signup`, redirect to `/`
- If a user is signed out and opens `/`, redirect to `/login`
- If a session expires or changes in another tab, the UI should react cleanly and move the user to the correct route

### Supabase constraint note

This phase assumes the Supabase project configuration allows the intended immediate post-sign-up app access behavior. The implementation and spec must explicitly document that project setting so the runtime behavior and dashboard configuration do not drift apart.

## Validation and Error Handling

Validation and server failures should be handled separately.

### Client-side validation

- Email must be a valid email format
- Password must be at least `8` characters
- Confirm password must match password on `Sign Up`
- Invalid forms should not submit

### Server-side error handling

The app should map Supabase errors into short, user-friendly Vietnamese messages instead of displaying raw provider messages.

The first supported cases should include:

- Incorrect email or password on sign in
- Email already registered on sign up
- Network or temporary service failure
- Session loss during authenticated app usage

## Component and Architecture Boundaries

The implementation should stay aligned with the current repo structure and avoid broad refactors.

### App layer

`apps/health-tracker-web` should own:

- Auth pages
- Auth route composition
- Auth layout composition
- The temporary signed-in home/dashboard presentation

### Shared libraries

- `libs/api` should remain the home for Supabase bootstrap and auth-facing API helpers where shared infrastructure makes sense
- `libs/forms` should power the auth forms through the existing shared field abstractions
- `libs/ui` should provide reusable visual primitives, not auth-specific business screens
- `libs/state` should only be used if a minimal auth-adjacent client store is truly needed beyond route-local state and session subscriptions

### Design principle

Auth-specific business behavior should not be hidden inside generic UI components. Shared libraries should expose primitives and infrastructure, while auth screen composition stays readable in the app.

## Signed-In Home Requirements

The current landing page should serve as the temporary authenticated home for this phase, but it must stop reading like a generic design-system preview once auth is active.

The signed-in home should visibly confirm that the user is inside the app by including:

- A short signed-in greeting
- The current authenticated email or equivalent session identifier
- A clear `Sign Out` action

It can continue reusing the existing landing page structure and design-system surfaces, but it should communicate authenticated state clearly enough to verify the end-to-end auth loop.

## Stitch Scope

The Stitch work for this phase should stay tightly focused on the screens and states needed for implementation.

### Required frames

- `Login / Default`
- `Sign Up / Default`

### State references for implementation

The approved visual source of truth in Stitch for this phase is limited to the default `Login` and `Sign Up` screens.

State variants should be handled during implementation using the same base layout:

- Default
- Field error
- Submit loading
- Submit error

### Required auth-specific patterns

- Auth hero block
- Auth form card
- Password input with visibility toggle
- Inline error text treatment
- Loading CTA state
- Clear cross-link between login and sign-up screens

Desktop-specific mockups are not required. Responsive behavior notes are sufficient if the mobile design is clear.

## Verification

This phase is complete when the following behaviors are verified:

- A new user can sign up successfully with email and password
- A returning user can log in successfully with email and password
- An authenticated user who opens `/login` or `/signup` is redirected to `/`
- An unauthenticated user who opens `/` is redirected to `/login`
- The signed-in home displays authenticated context and supports sign out
- Sign out returns the user to `/login`
- `yarn lint` passes
- `yarn build` passes

## Success Criteria

The auth foundation is ready when:

- The app supports complete email/password login and sign-up flows
- Route behavior is correct for both authenticated and unauthenticated users
- Session bootstrap avoids route flicker on initial load
- Auth screens feel like part of the approved Health Tracker design system
- The temporary private home proves that a user can enter and exit the app cleanly
- The implementation leaves a clear path for future onboarding and private feature phases

## Notes

- This phase intentionally keeps the authentication scope narrow and complete instead of partially covering many auth features.
- The next likely feature phase after this work is onboarding or the first real private dashboard flow built on top of the new auth foundation.
