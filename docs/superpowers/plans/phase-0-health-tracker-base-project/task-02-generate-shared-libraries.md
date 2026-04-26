### Task 02: Generate the shared foundation libraries

**Files:**

- Create: `libs/theme/project.json`
- Create: `libs/theme/src/index.ts`
- Create: `libs/ui/project.json`
- Create: `libs/ui/src/index.ts`
- Create: `libs/forms/project.json`
- Create: `libs/forms/src/index.ts`
- Create: `libs/api/project.json`
- Create: `libs/api/src/index.ts`
- Create: `libs/state/project.json`
- Create: `libs/state/src/index.ts`

- [x] **Step 1: Generate publish-disabled React/TS libraries**

Run:

```bash
yarn nx g @nx/react:lib theme --bundler=vite --unitTestRunner=none
yarn nx g @nx/react:lib ui --bundler=vite --unitTestRunner=none
yarn nx g @nx/react:lib forms --bundler=vite --unitTestRunner=none
yarn nx g @nx/js:lib api --unitTestRunner=none
yarn nx g @nx/react:lib state --bundler=vite --unitTestRunner=none
```

Expected: All five libraries are created under `libs/` with Nx project metadata and no test scaffolding.

- [x] **Step 2: Normalize the public entrypoints to clean exports**

Update the generated index files so each library exports only intentionally named modules:

```ts
// libs/theme/src/index.ts
export * from './lib/theme';
```

```ts
// libs/ui/src/index.ts
export * from './lib/app-shell';
export * from './lib/app-header';
export * from './lib/page-section';
export * from './lib/loading-block';
export * from './lib/empty-state';
```

```ts
// libs/forms/src/index.ts
export * from './lib/form-provider';
export * from './lib/form-text-field';
```

```ts
// libs/api/src/index.ts
export * from './lib/env';
export * from './lib/query-client';
export * from './lib/supabase';
```

```ts
// libs/state/src/index.ts
export * from './lib/app-ui-store';
```

Expected: The libraries expose stable project-level entrypoints instead of leaving default generator exports in place.

- [x] **Step 3: Commit the library boundaries**

Run:

```bash
git add libs
git commit -m "chore: add shared foundation libraries"
```

Expected: Git creates a commit with the five library shells.
