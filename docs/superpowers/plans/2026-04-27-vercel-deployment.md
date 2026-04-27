# Vercel Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy the `health-tracker-web` Vite SPA to Vercel with GitHub Integration so every push to `main` auto-deploys to production and every PR gets a preview URL.

**Architecture:** A single `vercel.json` at repo root declares the build command, output directory, and SPA rewrites. Vercel reads this file automatically when the GitHub repo is imported — no Dashboard build-settings UI needed. Env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) are set once in the Vercel Dashboard.

**Tech Stack:** Vercel (static hosting), Vite 7, Yarn 1.22, Nx 22, React Router v7, Supabase.

**Spec:** `docs/superpowers/specs/2026-04-27-vercel-deployment-design.md`

---

## File Map

| Action | Path          | Purpose                            |
| ------ | ------------- | ---------------------------------- |
| Create | `vercel.json` | Vercel build config + SPA rewrites |

---

### Task 1: Create `vercel.json`

**Files:**

- Create: `vercel.json` (repo root)

- [ ] **Step 1: Create the file**

  Create `/Users/mac/Desktop/health-tracker/vercel.json` with this exact content:

  ```json
  {
    "buildCommand": "yarn build",
    "outputDirectory": "dist/apps/health-tracker-web",
    "installCommand": "yarn install --frozen-lockfile",
    "framework": null,
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```

  - `buildCommand` — runs `yarn nx build health-tracker-web` via the root `package.json` `build` script
  - `outputDirectory` — where Vite writes the final bundle (set in `apps/health-tracker-web/vite.config.ts`)
  - `framework: null` — prevents Vercel from auto-detecting Next.js and overriding settings
  - `rewrites` — sends every URL to `index.html` so React Router v7 handles client-side navigation

- [ ] **Step 2: Run format + lint to satisfy pre-commit hook**

  ```bash
  yarn format && yarn lint
  ```

  Expected: both exit 0 with no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add vercel.json
  git commit -m "chore: add vercel.json for Vercel deployment"
  ```

  Expected: commit succeeds, pre-commit hook passes.

---

### Task 2: Import project on Vercel Dashboard (manual, one-time)

**Files:** none — Vercel UI only.

- [ ] **Step 1: Open Vercel new-project page**

  Go to <https://vercel.com/new> (log in if needed).

- [ ] **Step 2: Import the GitHub repo**

  Click **"Import"** next to the `health-tracker` repository. If the repo isn't listed, click **"Adjust GitHub App Permissions"** and grant Vercel access to it.

- [ ] **Step 3: Verify Vercel picks up `vercel.json` automatically**

  On the "Configure Project" screen you should see:
  - **Build Command:** `yarn build`
  - **Output Directory:** `dist/apps/health-tracker-web`
  - **Install Command:** `yarn install --frozen-lockfile`

  If these fields are pre-filled and greyed out, `vercel.json` was detected correctly. **Do not override them.**

  Leave **Root Directory** blank (empty = monorepo root).

- [ ] **Step 4: Do NOT deploy yet**

  Click **"Cancel"** or close the tab — env vars must be set before the first deploy, otherwise the build will succeed but the app will fail to connect to Supabase at runtime. Move on to Task 3.

---

### Task 3: Set environment variables in Vercel Dashboard (manual, one-time)

**Files:** none — Vercel Dashboard only.

- [ ] **Step 1: Navigate to Environment Variables settings**

  Go to your Vercel project → **Settings** → **Environment Variables**.

- [ ] **Step 2: Add `VITE_SUPABASE_URL`**

  | Field        | Value                                                |
  | ------------ | ---------------------------------------------------- |
  | Name         | `VITE_SUPABASE_URL`                                  |
  | Value        | (copy from your local `.env.local`)                  |
  | Environments | ✅ Production &nbsp; ✅ Preview &nbsp; ☐ Development |

  Click **Save**.

- [ ] **Step 3: Add `VITE_SUPABASE_ANON_KEY`**

  | Field        | Value                                                |
  | ------------ | ---------------------------------------------------- |
  | Name         | `VITE_SUPABASE_ANON_KEY`                             |
  | Value        | (copy from your local `.env.local`)                  |
  | Environments | ✅ Production &nbsp; ✅ Preview &nbsp; ☐ Development |

  Click **Save**.

- [ ] **Step 4: Verify both vars appear in the list**

  You should see two entries with type "Encrypted" and environments "Production, Preview".

---

### Task 4: Trigger first deploy and smoke-test

**Files:** none.

- [ ] **Step 1: Trigger the first deploy**

  Option A (recommended): push a small commit to `main`:

  ```bash
  git commit --allow-empty -m "chore: trigger first Vercel deploy"
  git push origin main
  ```

  Option B: Go to Vercel Dashboard → **Deployments** → **Redeploy** on the latest commit.

- [ ] **Step 2: Watch the build log**

  In Vercel Dashboard → **Deployments**, click the active deployment. Expected build output:

  ```
  Running "yarn install --frozen-lockfile"
  ...
  Running "yarn build"
  ...
  vite build --config apps/health-tracker-web/vite.config.ts
  ...
  dist/apps/health-tracker-web/index.html  X kB
  ✓ built in X.XXs
  ```

  Build status should reach **"Ready"**. If it shows **"Error"**, expand the log and read the error — most common causes: missing env var name typo, Node version mismatch (unlikely with Node 20).

- [ ] **Step 3: Open the production URL**

  Vercel shows the URL in format `health-tracker-<hash>.vercel.app`. Open it in a browser.

  Verify:
  - [ ] The login page loads (no blank screen, no console errors about missing env vars)
  - [ ] Navigating to `/login` directly in the address bar loads the correct page (tests SPA rewrites)
  - [ ] Navigating to `/signup` directly works too
  - [ ] Supabase login flow completes without network errors (open DevTools → Network tab, look for failed Supabase requests)

- [ ] **Step 4: Verify preview deploys work**

  Create a throwaway branch, push it, open a PR:

  ```bash
  git checkout -b test/vercel-preview
  git commit --allow-empty -m "test: verify Vercel preview deploy"
  git push origin test/vercel-preview
  ```

  Open a PR on GitHub. Within ~1 minute a Vercel bot comment should appear with a preview URL. Open it and confirm the app loads.

  Close/delete the PR and branch after verifying.

- [ ] **Step 5: Clean up test branch**

  ```bash
  git checkout main
  git branch -d test/vercel-preview
  git push origin --delete test/vercel-preview
  ```
