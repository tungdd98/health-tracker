### Task 10: Final verification and developer documentation

**Files:**
- Create: `README.md`
- Modify: `package.json`

- [ ] **Step 1: Add helpful root scripts**

Ensure `package.json` includes these scripts:

```json
{
  "scripts": {
    "dev": "yarn nx serve health-tracker-web",
    "build": "yarn nx build health-tracker-web",
    "lint": "yarn nx run-many -t lint --all",
    "format": "yarn nx format:write",
    "format:check": "yarn nx format:check"
  }
}
```

Expected: The repo has ergonomic root commands for day-to-day development.

- [ ] **Step 2: Write the project README**

Create `README.md`:

```md
# Health Tracker

## Requirements

- Node.js 20
- Yarn

## Setup

```bash
yarn install
cp .env.example .env.local
```

Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` before running the app.

## Commands

```bash
yarn dev
yarn build
yarn lint
yarn format
```

## Included foundations

- Nx monorepo
- React + TypeScript + Vite web app
- Shared theme, UI, forms, API, and state libraries
- MUI and React Query setup
- Supabase client bootstrap
- ESLint, Prettier, Husky, Commitlint
```

Expected: A new engineer can install, configure env values, and run the workspace without reading implementation code.

- [ ] **Step 3: Run the final verification commands**

Run:

```bash
yarn install
yarn lint
yarn build
```

Expected: All commands succeed with no lint errors and the app builds successfully.

- [ ] **Step 4: Perform a final smoke check**

Run:

```bash
yarn dev
```

Expected: The dev server starts and the app shows the minimal landing page at `/`, with the not-found page rendering for an unknown route.

- [ ] **Step 5: Commit the final project polish**

Run:

```bash
git add package.json yarn.lock README.md
git commit -m "docs: add base project usage guide"
```

Expected: Git creates the final commit for scripts and setup documentation.
