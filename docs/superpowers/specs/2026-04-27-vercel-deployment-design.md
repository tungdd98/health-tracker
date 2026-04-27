# Vercel Deployment — Design Spec

**Date:** 2026-04-27
**Status:** Approved

## Overview

Deploy `health-tracker-web` (Nx monorepo, Vite SPA) to Vercel using GitHub Integration with a `vercel.json` config file. Auto-deploy on every push to `main`; preview deploys generated for every pull request.

## Config File

`vercel.json` at repo root:

```json
{
  "buildCommand": "yarn build",
  "outputDirectory": "dist/apps/health-tracker-web",
  "installCommand": "yarn install --frozen-lockfile",
  "framework": null,
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- `framework: null` — disables Vercel's auto-detect to prevent misidentification as Next.js
- `rewrites` — redirects all paths to `index.html` so React Router v7 handles client-side routing correctly
- `--frozen-lockfile` — ensures CI installs exact dependency versions from `yarn.lock`

## Environment Variables

Set once in Vercel Dashboard → **Settings → Environment Variables**:

| Key                      | Environments        |
| ------------------------ | ------------------- |
| `VITE_SUPABASE_URL`      | Production, Preview |
| `VITE_SUPABASE_ANON_KEY` | Production, Preview |

Vite's `envDir` is already configured to point to the monorepo root, so Vercel's injected env vars are picked up automatically during build — no code changes required.

## Deploy Flow

```
push to main  →  Vercel build (yarn build)  →  Production deploy (*.vercel.app)
open PR       →  Vercel build               →  Preview URL (unique per PR)
```

## Setup Steps (one-time)

1. Go to [vercel.com/new](https://vercel.com/new) and import the `health-tracker` GitHub repo
2. Leave Root Directory blank (monorepo root) — Vercel detects `vercel.json` automatically
3. Go to **Settings → Environment Variables** and add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for Production and Preview environments
4. Trigger first deploy by pushing a commit to `main` (or clicking Redeploy in dashboard)

## Constraints & Notes

- **Node.js version:** Vercel default (Node 20) is compatible with Vite 7 and Yarn 1.22 — no pinning needed
- **`dist/` in `.gitignore`:** Vercel builds on their servers; local `dist/` is irrelevant
- **No `vercel-build` script needed:** `vercel.json` `buildCommand` takes precedence over `package.json` scripts
- **Staging Supabase:** if a separate staging environment is needed in the future, set a different `VITE_SUPABASE_URL` for the Preview environment in the Dashboard
- **Custom domain:** not in scope — using default `*.vercel.app` domain

## Out of Scope

- Custom domain / DNS configuration
- Vercel CLI local linking
- Server-side rendering or Edge functions
