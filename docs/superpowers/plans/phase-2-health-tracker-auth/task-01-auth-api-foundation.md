### Task 01: Extend the shared API layer for auth session and error handling

**Files:**

- Create: `libs/api/src/lib/auth.ts`
- Create: `libs/api/src/lib/auth-errors.ts`
- Modify: `libs/api/src/lib/supabase.ts`
- Modify: `libs/api/src/index.ts`

- [ ] **Step 1: Review the existing Supabase client and current exports**

Read these files before editing:

- `libs/api/src/lib/supabase.ts`
- `libs/api/src/index.ts`
- `docs/superpowers/specs/2026-04-26-auth-design.md`

Expected: The worker understands the current API surface and the auth requirements before adding new helpers.

- [ ] **Step 2: Add a small shared auth helper module**

Create `libs/api/src/lib/auth.ts` with focused helpers around the existing `supabase` client. Include:

- a `getCurrentSession` helper using `supabase.auth.getSession()`
- a `signInWithEmailPassword` helper wrapping `supabase.auth.signInWithPassword`
- a `signUpWithEmailPassword` helper wrapping `supabase.auth.signUp`
- a `signOutUser` helper wrapping `supabase.auth.signOut`
- a `subscribeToAuthChanges` helper wrapping `supabase.auth.onAuthStateChange`

Expected: App code can import a narrow auth API instead of calling raw Supabase methods throughout the route and screen layer.

- [ ] **Step 3: Add human-readable auth error mapping**

Create `libs/api/src/lib/auth-errors.ts` with a small mapper function such as `mapAuthErrorToMessage(error: AuthError | Error | null): string`. Cover at least:

- invalid credentials
- email already registered
- generic network or temporary failure

Return short Vietnamese strings suitable for inline form-level error display.

Expected: Submit-level auth failures can be shown consistently without leaking raw Supabase messages into the UI.

- [ ] **Step 4: Adjust the shared Supabase client only if auth behavior requires it**

Update `libs/api/src/lib/supabase.ts` only if needed to make auth behavior explicit, for example by adding an options object for auth persistence defaults instead of relying on hidden library defaults.

Expected: The shared client remains a single importable instance and the auth-related behavior that matters for this phase is visible in code.

- [ ] **Step 5: Export the new auth surface**

Update `libs/api/src/index.ts` to export the new auth helpers and error mapper together with the existing env, query-client, and supabase exports.

Expected: App code can import every shared auth primitive from `@health-tracker/api`.

- [ ] **Step 6: Sanity-check the library surface**

Run:

```bash
yarn eslint libs/api/src --max-warnings=0
```

Expected: The API library changes lint cleanly before the app starts consuming them.

- [ ] **Step 7: Commit the auth API foundation**

Run:

```bash
git add libs/api docs/superpowers/plans/phase-2-health-tracker-auth
git commit -m "feat: add auth api helpers"
```

Expected: Git creates a focused commit for the auth-facing API layer.
