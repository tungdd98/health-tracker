# Task 05 — Settings: Avatar Upload + Toggle

**Files:**

- Modify: `apps/health-tracker-web/src/app/pages/settings-page.tsx`

---

**Design reference:** `docs/superpowers/specs/2026-04-29-avatar-mood-sticker-design.md` — Flow 2, UI: Settings section.

- [ ] **Step 1:** Thêm state + data loading vào `settings-page.tsx`.

```ts
const [avatarMeta, setAvatarMeta] = useState<UserAvatarMeta | null>(null);
const [isRegenerating, setIsRegenerating] = useState(false);
const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);
const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
```

Load `avatarMeta` khi component mount:

```ts
useEffect(() => {
  if (!user) return;
  getAvatarMeta(user.id)
    .then(setAvatarMeta)
    .catch(() => {});
}, [user]);
```

- [ ] **Step 2:** Thêm avatar picker + toggle vào section _Thông tin cá nhân_.

**Ở đầu section** (trước các field hiện tại): avatar tròn 60px hiển thị `avatarMeta.avatarUrl` hoặc placeholder icon. Nút text _"Thay ảnh"_ trigger `<input type="file" accept="image/*">` ẩn.

Khi user chọn file mới → `setPendingAvatarFile(file)` → upload avatar vào Storage, cập nhật `profiles.avatar_url` → `setShowRegenerateDialog(true)`.

**Ở cuối section** (sau các field hiện tại, chỉ hiển thị khi `avatarMeta?.avatarUrl`):

```tsx
<FormControlLabel
  control={
    <Switch
      checked={avatarMeta.useAvatarMood}
      onChange={async (e) => {
        await updateAvatarMeta(user.id, { useAvatarMood: e.target.checked });
        setAvatarMeta((prev) => (prev ? { ...prev, useAvatarMood: e.target.checked } : prev));
      }}
    />
  }
  label="Dùng sticker cá nhân cho tâm trạng"
/>
```

- [ ] **Step 3:** Thêm dialog xác nhận tạo lại sticker.

Dùng `AppConfirmDialog` (đã có ở `app/components/app-confirm-dialog.tsx`).

```tsx
<AppConfirmDialog
  open={showRegenerateDialog}
  title="Tạo lại sticker?"
  description="Bạn muốn tạo lại sticker tâm trạng với avatar mới không?"
  confirmLabel="Tạo lại"
  cancelLabel="Bỏ qua"
  onConfirm={async () => {
    setShowRegenerateDialog(false);
    setIsRegenerating(true);
    try {
      await generateMoodImages(user.id);
    } catch {
      // show toast error
    } finally {
      setIsRegenerating(false);
    }
  }}
  onCancel={() => setShowRegenerateDialog(false)}
/>
```

Hiển thị loading toast _"Đang tạo lại sticker..."_ khi `isRegenerating`.

- [ ] **Step 4:** `yarn lint && yarn build`

- [ ] **Step 5:** Commit.

```bash
git add apps/health-tracker-web/src/app/pages/settings-page.tsx
git commit -m "feat: add avatar upload and mood sticker toggle to settings"
```
