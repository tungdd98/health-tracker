### Task 03: Build the auth layout and the `Login` and `Sign Up` screens

**Files:**

- Create: `apps/health-tracker-web/src/app/components/auth-layout.tsx`
- Create: `apps/health-tracker-web/src/app/pages/login-page.tsx`
- Create: `apps/health-tracker-web/src/app/pages/signup-page.tsx`
- Create: `apps/health-tracker-web/src/app/auth/auth-schemas.ts`
- Create: `apps/health-tracker-web/src/app/auth/auth-copy.ts`
- Modify: `libs/forms/src/lib/form-text-field.tsx`
- Modify: `libs/forms/src/index.ts` only if the auth screens need a newly exported forms primitive

- [ ] **Step 1: Review the current design-system building blocks**

Read these files before composing the auth screens:

- `apps/health-tracker-web/src/app/pages/landing-page.tsx`
- `libs/forms/src/lib/form-provider.tsx`
- `libs/forms/src/lib/form-text-field.tsx`
- `libs/ui/src/index.ts`
- `docs/superpowers/specs/2026-04-26-auth-design.md`
- `docs/superpowers/plans/phase-2-health-tracker-auth/task-02-stitch-auth-design.md`

Expected: The worker understands the existing visual language, the approved default Stitch auth screens, the documented implementation-state notes, and the shared form abstractions before introducing auth-specific UI.

- [ ] **Step 2: Add auth form schemas and copy constants**

Create `apps/health-tracker-web/src/app/auth/auth-schemas.ts` with Zod schemas and inferred types for:

- `LoginFormValues`
- `SignUpFormValues`

Include the required rules:

- valid email format
- password minimum `8` characters
- confirm password must match on sign up

Create `apps/health-tracker-web/src/app/auth/auth-copy.ts` for the hero titles, descriptions, CTA labels, and cross-link text so the copy stays consistent and easy to tune.

Expected: Validation and UI copy are centralized instead of being duplicated inside the page components.

- [ ] **Step 3: Upgrade the shared text field wrapper if auth needs password affordances**

Update `libs/forms/src/lib/form-text-field.tsx` only if the current wrapper cannot cleanly support password visibility toggles or input adornments. Preserve existing behavior for all current consumers.

Expected: The auth screens can use the shared forms layer instead of bypassing it with one-off MUI fields.

- [ ] **Step 4: Build the shared auth layout**

Create `apps/health-tracker-web/src/app/components/auth-layout.tsx` with:

- a compact mobile-first container
- a hero block for eyebrow, title, description, and optional chips
- a rounded card-like content surface for the form

Keep the component reusable across both auth pages and aligned with the current soft rose design system.

Expected: `Login` and `Sign Up` share one visual structure instead of drifting into two independently styled screens.

- [ ] **Step 5: Build the `Login` page**

Create `apps/health-tracker-web/src/app/pages/login-page.tsx` using:

- `react-hook-form`
- the login Zod schema
- the shared auth layout
- `AppFormProvider` and shared form fields
- the auth helper and error mapper from `@health-tracker/api`

Include:

- email field
- password field with show/hide toggle
- loading state on submit
- inline field validation
- form-level auth error message in Vietnamese
- a clear link to `/signup`

Expected: The `Login` screen is visually complete and functionally wired for sign-in.

- [ ] **Step 6: Build the `Sign Up` page**

Create `apps/health-tracker-web/src/app/pages/signup-page.tsx` using the same structure as `Login`, but add:

- confirm password field
- visible password rule text
- sign-up submit flow
- a clear link to `/login`

Use the approved behavior that a successful sign-up should continue into the app rather than stopping on a local success-only screen.

Expected: The `Sign Up` screen is ready for account creation with the approved validation rules and visual direction.

- [ ] **Step 7: Lint the auth UI before wiring routing**

Run:

```bash
yarn eslint apps/health-tracker-web/src/app --max-warnings=0
```

Expected: The new auth pages and helpers are clean before route integration work begins.

- [ ] **Step 8: Commit the auth UI slice**

Run:

```bash
git add apps/health-tracker-web libs/forms docs/superpowers/plans/phase-2-health-tracker-auth
git commit -m "feat: add auth screens"
```

Expected: Git creates a focused commit for the auth layout and form screens.
