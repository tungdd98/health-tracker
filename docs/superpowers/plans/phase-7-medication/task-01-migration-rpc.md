# Task 01 — Supabase migration + RPC

**Files:**

- Create: `supabase/migrations/20260428000000_create_medications.sql`

---

- [ ] **Step 1:** Create 3 tables theo spec: `medications`, `medication_doses`, `dose_logs` với FK + indexes + constraints.
- [ ] **Step 2:** Enable RLS và thêm policies chỉ cho phép user thao tác dữ liệu của chính mình.
- [ ] **Step 3:** Tạo RPC `create_medication_with_doses(payload jsonb)` để insert medication + doses theo 1 transaction implicit của function.
- [ ] **Step 4:** Tạo RPC `update_medication_with_doses(target_id uuid, payload jsonb)` để update medication + replace doses.
- [ ] **Step 5:** Local verify migration.

```bash
supabase db reset
```

- [ ] **Step 6:** Commit migration.

```bash
git add supabase/migrations/20260428000000_create_medications.sql
git commit -m "feat: add medication schema and rpc"
```

**Expected outcome:** DB có đủ schema/RLS/RPC để support CRUD medication + log dose.
