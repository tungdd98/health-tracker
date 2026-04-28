# Task 06 — BBT Bottom Sheet

**Design:** `docs/superpowers/designs/2026-04-26-dashboard.pen` → frame `bbt-bottom-sheet` (ID: `RnfHT`)

**Files:**

- Create: `apps/health-tracker-web/src/app/dashboard/bbt-bottom-sheet.tsx`

Props:

```typescript
type BbtBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  currentLog: DailyLog | null | undefined;
  date: string;
  isMutating: boolean;
  mutationError: Error | null;
  onSave: (patch: DailyLogPatch) => Promise<DailyLog>;
  onResetError: () => void;
};
```

---

- [ ] **Step 1:** Open Pencil, read frame `bbt-bottom-sheet` (RnfHT): handle bar, thermometer icon bubble, title, hint, input row with °C unit, Huỷ/Lưu button row.

- [ ] **Step 2:** Create file. Implement MUI `Drawer anchor="bottom"` with `PaperProps={{ sx: { borderRadius: '16px 16px 0 0', p: 3 } }}`. Render handle bar (`36×4px`, `bgcolor: 'divider'`, `borderRadius: 2`) centered at top.

- [ ] **Step 3:** Implement body matching frame: icon bubble with `DeviceThermostatRoundedIcon`, title `"Nhiệt độ cơ thể buổi sáng"`, hint `"Đo trước khi ra khỏi giường"`, `TextField type="number"` with `inputProps={{ step: 0.05, min: 35, max: 42 }}` and `°C` end adornment.

- [ ] **Step 4:** Add `useEffect` on `open` to pre-fill TextField from `currentLog?.bbtCelsius`, clear local error, call `onResetError()`.

- [ ] **Step 5:** Implement `handleSave`: parse float, validate `35 ≤ num ≤ 42` (inline error `"Nhiệt độ phải trong khoảng 35–42 °C"` if invalid), call `onSave({ date, bbtCelsius: num })` then `onClose()`.

- [ ] **Step 6:** Button row: Huỷ `variant="outlined"` + Lưu `variant="contained"`, both `disabled` when `isMutating`. Lưu shows `CircularProgress size={20}` when `isMutating`. Display `mutationError?.message` as inline error text below TextField.

- [ ] **Step 7:** `yarn format && yarn lint`
