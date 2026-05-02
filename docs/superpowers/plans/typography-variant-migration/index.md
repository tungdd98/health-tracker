# Typography Variant Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` (recommended), `branch-driven-development`, or `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Created:** 2026-05-02

**Status:** Planning

**Goal:** Remove `AppTypographyTokens`, delete all `theme.appTokens.typography.*` usage, and standardize typography rendering on the default MUI variants already defined in the app theme.

**Architecture:** Keep `theme.typography` as the only typography source in `libs/theme/src/lib/theme.ts`, then migrate call sites by assigning explicit `Typography` variants instead of spreading custom token styles into `sx`. When a non-`Typography` slot currently depends on the old token object, move the text responsibility onto a `Typography` child or switch to a component API that accepts a variant directly.

**Tech Stack:** React 19, TypeScript strict, MUI v7, Nx workspace, Prettier, ESLint, Vite build.

---

## Task Checklist

- [x] [Task 01 - Remove custom typography tokens from theme](task-01-theme-typography-cleanup.md)
- [x] [Task 02 - Migrate shared UI primitives and navigation labels](task-02-shared-primitives-and-nav.md)
- [x] [Task 03 - Migrate dashboard, calendar, and chat surfaces](task-03-dashboard-calendar-chat.md)
- [x] [Task 04 - Migrate auth, onboarding, medication, and remaining app surfaces](task-04-auth-onboarding-medication-and-forms.md)
- [x] [Task 05 - Verify, audit leftovers, and update tracking](task-05-verification-and-tracking.md)

---

## File Structure

| File or Area                                     | Change                                                                                                                                      |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `libs/theme/src/lib/theme.ts`                    | Delete `AppTypographyTokens`, remove `appTokens.typography` typing/runtime shape, keep default MUI variants as the only typography contract |
| `libs/ui/src/lib/app-bottom-nav.tsx`             | Replace token-based label styling with `Typography` variant usage that still preserves nav state behavior                                   |
| `libs/ui/src/lib/app-header.tsx`                 | Stop reading `sectionValue` token and move title/subtitle emphasis to explicit variants                                                     |
| `libs/forms/src/lib/form-field.tsx`              | Remove token-derived label styles and rely on `Typography` variants for helper label rendering                                              |
| `apps/health-tracker-web/src/app/dashboard/**`   | Replace token-based emphasis in hero, strips, sheets, and summaries with MUI variants                                                       |
| `apps/health-tracker-web/src/app/calendar/**`    | Migrate legend and day-detail labels/headings to variants                                                                                   |
| `apps/health-tracker-web/src/app/chat/**`        | Migrate welcome/disclaimer/history drawer headings and body copy to variants                                                                |
| `apps/health-tracker-web/src/app/pages/**`       | Update auth pages that currently apply token typography through `sx`                                                                        |
| `apps/health-tracker-web/src/app/components/**`  | Update onboarding/settings/shared cards that still consume typography tokens                                                                |
| `apps/health-tracker-web/src/app/medications/**` | Replace form/list typography token usage with semantic variants                                                                             |

## Variant Mapping Guardrails

- `eyebrow` -> `overline`
- `microLabel` -> `overline`
- `sectionLabel` -> `subtitle2`
- `sectionValue` -> `subtitle1` or `subtitle2` based on emphasis
- `helper` -> `caption`
- `metricValue` -> `h5`
- `titleMd` -> `h5`

## Verification Target

Run the repo quality gate in this order once migration is complete:

1. `yarn format`
2. `yarn lint`
3. `yarn build`

Then manually review the screens called out in the spec:

- `/login` and `/signup`
- Dashboard cards and daily-log bottom sheets
- Calendar day-detail sheet
- Chat welcome/history surfaces
- Medication list and form
- Shared shell components such as `AppHeader` and `AppBottomNav`
