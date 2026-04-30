# Onboarding Sticker Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` (recommended) or `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Created:** 2026-04-30

**Status:** Planning

**Goal:** Remove avatar upload and sticker generation from onboarding while keeping avatar-based sticker management available only from `Settings`.

**Architecture:** This follow-up phase simplifies the existing onboarding flow instead of adding new behavior. The app should delete onboarding-owned avatar upload, mood-generation, wow-screen, and overlay branches from the onboarding route, while preserving the settings-owned avatar upload, regeneration dialog, sticker preview, and mood toggle without requiring any onboarding dependency.

**Tech Stack:** Nx, React 19, TypeScript, React Hook Form, MUI v7, TanStack React Query, Supabase

---

## Tracking

- [ ] Task 01: [Remove onboarding avatar and sticker flow from the basic profile step and onboarding page](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-13-onboarding-sticker-removal/task-01-remove-onboarding-avatar-flow.md)
- [ ] Task 02: [Retire onboarding-only sticker artifacts and align plan docs with the settings-only ownership model](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-13-onboarding-sticker-removal/task-02-retire-artifacts-and-align-docs.md)
- [ ] Task 03: [Verify the simplified onboarding flow, confirm settings still owns stickers, and synchronize tracking](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/phase-13-onboarding-sticker-removal/task-03-verification-and-tracking.md)

## File Structure Map

- `docs/superpowers/specs/2026-04-30-onboarding-sticker-removal-design.md`
  - Approved source spec for this phase
- `docs/superpowers/specs/2026-04-29-avatar-mood-sticker-design.md`
  - Earlier sticker spec whose onboarding portion is superseded by the new design
- `apps/health-tracker-web/src/app/onboarding/basic-profile-step.tsx`
  - Basic profile UI that currently embeds avatar upload state and affordances
- `apps/health-tracker-web/src/app/pages/onboarding-page.tsx`
  - Onboarding orchestration that currently uploads avatars, generates mood images, and branches to the wow screen
- `apps/health-tracker-web/src/app/onboarding/onboarding-wow-screen.tsx`
  - Onboarding-only sticker preview screen that should be removed if no longer referenced
- `apps/health-tracker-web/src/app/components/mood-generating-overlay.tsx`
  - Shared overlay still used by settings; onboarding should stop importing it
- `apps/health-tracker-web/src/app/pages/settings-page.tsx`
  - Settings-owned avatar upload, regeneration, sticker preview, and toggle workflow that must stay intact
- `docs/superpowers/plans/phase-12-avatar-mood-sticker/index.md`
  - Historical phase entrypoint that should note the onboarding rollback
- `docs/superpowers/plans/phase-12-avatar-mood-sticker/task-04-onboarding-avatar-wow.md`
  - Historical onboarding task file whose assumptions should be marked as superseded

## Spec Coverage

- Remove avatar upload from onboarding basic profile: Task 01
- Remove onboarding-triggered mood generation and wow-screen branching: Task 01
- Keep onboarding silent about stickers: Tasks 01 and 02
- Preserve settings as the only sticker entry point: Tasks 02 and 03
- Replace old onboarding task assumptions in plan docs: Task 02
- Verification and tracking updates: Task 03

## Notes For Implementers

- Skip the Pencil design step for this phase because Hoang Thuong explicitly requested a workflow override. Use the approved spec directly instead of a `.pen` file.
- Do not redesign onboarding copy or layout beyond removing avatar and sticker affordances.
- Do not weaken the settings-owned sticker flow while cleaning onboarding imports or shared helpers.
- This repo has no dedicated test runner. The required verification gate remains `yarn format`, `yarn lint`, and `yarn build`.
