# Task 07 — Mood Bottom Sheet

**Design:** `docs/superpowers/designs/2026-04-26-dashboard.pen` → frame `mood-bottom-sheet` (ID: `0iK4F`)

**Files:**

- Create: `apps/health-tracker-web/src/app/dashboard/mood-bottom-sheet.tsx`

Same props shape as `BbtBottomSheetProps` (substitute component name).

Mood config (fixed — do not alter values or order):

```typescript
const MOODS: Array<{ value: MoodValue; emoji: string; label: string }> = [
  { value: 'sad', emoji: '😔', label: 'Buồn' },
  { value: 'neutral', emoji: '😐', label: 'Bình thường' },
  { value: 'happy', emoji: '😊', label: 'Vui' },
  { value: 'very_happy', emoji: '😄', label: 'Rất vui' },
  { value: 'tired', emoji: '😴', label: 'Mệt mỏi' },
];
```

---

- [ ] **Step 1:** Open Pencil, read frame `mood-bottom-sheet` (0iK4F): handle bar, title, 5 equal-width emoji boxes (emoji + label), selected box has accent border + tinted bg, selected mood name label below row, Huỷ/Lưu row.

- [ ] **Step 2:** Create file. Implement Drawer with same handle bar + padding pattern as BBT sheet.

- [ ] **Step 3:** Implement emoji picker: `Stack direction="row"` with 5 equal boxes. Each box shows emoji + label. Selected box: `borderColor: 'primary.main'`, `bgcolor: 'action.hover'`.

- [ ] **Step 4:** Show selected mood label (e.g. `"Vui"`) centered below emoji row; hide when nothing selected.

- [ ] **Step 5:** `useEffect` on `open`: pre-select from `currentLog?.mood`, call `onResetError()`.

- [ ] **Step 6:** Lưu button `disabled` when `!selectedMood || isMutating`. On click: `onSave({ date, mood: selectedMood })` then `onClose()`. Show `mutationError?.message` inline above button row.

- [ ] **Step 7:** `yarn format && yarn lint`
