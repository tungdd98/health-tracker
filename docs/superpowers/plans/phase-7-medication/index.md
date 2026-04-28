# Phase 7 — Medication

**Goal:** Thêm luồng quản lý thuốc và tracking đã uống theo từng liều trong ngày: dashboard có `MedicationStrip` để check nhanh, cùng cụm trang `/medications` để CRUD thuốc.

**Architecture:** Supabase migration tạo `medications`, `medication_doses`, `dose_logs` + RLS + 2 RPC atomic (`create_medication_with_doses`, `update_medication_with_doses`). Data layer nằm ở `libs/api`, query hooks và UI nằm trong `apps/health-tracker-web/src/app/medications` + `dashboard/medication-strip.tsx`.

**Tech Stack:** React 19, TypeScript strict, MUI v7, TanStack React Query v5, Supabase JS v2, Luxon, React Hook Form, Zod.

**Spec:** `docs/superpowers/specs/2026-04-28-medication-design.md`

**Design file:** `docs/superpowers/designs/2026-04-28-medications.pen`

---

## Task Checklist

- [ ] [Task 01 — Supabase migration + RPC](task-01-migration-rpc.md)
- [ ] [Task 02 — Data layer (libs/api)](task-02-data-layer.md)
- [ ] [Task 03 — Medication query hooks](task-03-medication-hooks.md)
- [ ] [Task 04 — Medication form schema + dose field](task-04-form-schema-dose-field.md)
- [ ] [Task 05 — MedicationStrip UI](task-05-medication-strip.md)
- [ ] [Task 06 — Medications list page](task-06-medications-list-page.md)
- [ ] [Task 07 — Medication form page (new/edit)](task-07-medication-form-page.md)
- [ ] [Task 08 — Router wiring + dashboard integration](task-08-routing-dashboard-wire.md)
- [ ] [Task 09 — Verification and smoke test](task-09-verification-smoke.md)
- [ ] [Task 10 — Tracking sync and commit plan](task-10-tracking-and-commit.md)

---

## File Map

| File                                                                    | Action                            |
| ----------------------------------------------------------------------- | --------------------------------- |
| `supabase/migrations/20260428000000_create_medications.sql`             | Create                            |
| `libs/api/src/lib/medication.ts`                                        | Create                            |
| `libs/api/src/index.ts`                                                 | Modify — add export               |
| `apps/health-tracker-web/src/app/medications/use-medications.ts`        | Create                            |
| `apps/health-tracker-web/src/app/medications/use-today-medications.ts`  | Create                            |
| `apps/health-tracker-web/src/app/medications/medication-form-schema.ts` | Create                            |
| `apps/health-tracker-web/src/app/medications/dose-time-list-field.tsx`  | Create                            |
| `apps/health-tracker-web/src/app/dashboard/medication-strip.tsx`        | Create                            |
| `apps/health-tracker-web/src/app/medications/medication-list-page.tsx`  | Create                            |
| `apps/health-tracker-web/src/app/medications/medication-form-page.tsx`  | Create                            |
| `apps/health-tracker-web/src/app/app.tsx`                               | Modify — add routes               |
| `apps/health-tracker-web/src/app/dashboard/dashboard-page.tsx`          | Modify — insert `MedicationStrip` |

---

## Spec Coverage Summary

- Schema + RLS + RPC atomic write: Task 01
- Medication API + exports: Task 02
- Query keys + optimistic toggle + today eligibility: Task 03
- Validation + dose list rules: Task 04
- `MedicationStrip` states and interactions: Task 05
- `/medications` list + active toggle + delete confirm: Task 06
- `/medications/new` + `/medications/:id/edit`: Task 07
- Routing integration and dashboard placement: Task 08
- Full verification checklist from spec: Task 09
- Tracking hygiene + commit: Task 10
