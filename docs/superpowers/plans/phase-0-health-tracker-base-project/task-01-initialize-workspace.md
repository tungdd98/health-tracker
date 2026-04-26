### Task 01: Initialize the Nx workspace and React app

**Files:**

- Create: `package.json`
- Create: `nx.json`
- Create: `tsconfig.base.json`
- Create: `.gitignore`
- Create: `apps/health-tracker-web/project.json`
- Create: `apps/health-tracker-web/src/main.tsx`
- Create: `apps/health-tracker-web/src/app/app.tsx`
- Create: `apps/health-tracker-web/index.html`

- [x] **Step 1: Scaffold the Nx workspace with Yarn**

Run:

```bash
yarn create nx-workspace@latest . --preset=apps --nxCloud=skip --packageManager=yarn --interactive=false
```

Expected: Nx initializes the workspace in the current directory and creates root config files including `package.json`, `nx.json`, and `tsconfig.base.json`.

- [x] **Step 2: Add the React plugin and generate the web app**

Run:

```bash
yarn add -D @nx/react @nx/vite
yarn nx g @nx/react:app health-tracker-web --bundler=vite --style=css --routing=false --unitTestRunner=none --e2eTestRunner=none
```

Expected: `apps/health-tracker-web` exists, the app builds with Vite, and no unit or e2e test projects are generated.

- [x] **Step 3: Verify the generated app starts**

Run:

```bash
yarn nx serve health-tracker-web
```

Expected: The dev server starts successfully and serves the default Nx React page in the terminal output.

- [ ] **Step 4: Commit the workspace bootstrap**

Run:

```bash
git add package.json yarn.lock nx.json tsconfig.base.json .gitignore apps/health-tracker-web
git commit -m "chore: initialize nx workspace"
```

Expected: Git creates a commit containing the initial workspace scaffold.
