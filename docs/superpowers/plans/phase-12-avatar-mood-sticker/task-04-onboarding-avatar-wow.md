# Task 04 — Onboarding: Avatar Picker + Wow Screen

**Files:**

- Modify: `apps/health-tracker-web/src/app/onboarding/basic-profile-step.tsx`
- Create: `apps/health-tracker-web/src/app/onboarding/onboarding-wow-screen.tsx`
- Modify: `apps/health-tracker-web/src/app/pages/onboarding-page.tsx`

---

**Design reference:** `docs/superpowers/specs/2026-04-29-avatar-mood-sticker-design.md` — Flow 1, UI: Basic Profile step, Wow screen.

- [ ] **Step 1:** Thêm avatar picker vào `basic-profile-step.tsx`.

Avatar picker là một `Box` tròn (80px) dạng `<input type="file" accept="image/*">` ẩn, triggered bởi nút tap. Props cần nhận: `onAvatarChange: (file: File) => void`, `avatarPreviewUrl: string | null`.

Render avatar preview nếu có (`<img>` dạng tròn), ngược lại render icon camera placeholder.

- [ ] **Step 2:** Tạo `onboarding-wow-screen.tsx`.

Props: `moodImages: Record<string, string>`, `onContinue: () => void`.

Layout: `Stack` với title _"Sticker của bạn đây!"_, grid 5 sticker (hàng 1: 3, hàng 2: 2 căn giữa), mỗi sticker là `<img>` + label mood tiếng Việt bên dưới, nút primary _"Tiếp tục"_ gọi `onContinue`.

Mood labels: `{ sad: 'Buồn', neutral: 'Bình thường', happy: 'Vui', very_happy: 'Rất vui', tired: 'Mệt mỏi' }`.

- [ ] **Step 3:** Wiring trong `onboarding-page.tsx`.

Thêm state:

```ts
const [avatarFile, setAvatarFile] = useState<File | null>(null);
const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
const [showWowScreen, setShowWowScreen] = useState(false);
const [wowMoodImages, setWowMoodImages] = useState<Record<string, string>>({});
```

Trong `handleAvatarChange(file: File)`:

1. Upload avatar: `const url = await uploadAvatar(user.id, file)`
2. `await updateAvatarMeta(user.id, { avatarUrl: url })`
3. Set `avatarPreviewUrl(url)`, `avatarFile(file)`

Trong `validateAndPersistCurrentStep` — case `basicProfile`, sau khi save thành công:

```ts
if (avatarFile) {
  setIsSaving(true);
  try {
    await generateMoodImages(user.id);
    const images = await getUserMoodImages(user.id);
    setWowMoodImages(images);
    setShowWowScreen(true);
  } catch {
    // ignore — proceed to next step even if generation fails
  } finally {
    setIsSaving(false);
  }
  return; // wow screen will call handleWowContinue
}
setCurrentStepId(getNextOnboardingStepId(currentStepId) ?? ONBOARDING_STEP_IDS.cycle);
```

Thêm `handleWowContinue`:

```ts
const handleWowContinue = () => {
  setShowWowScreen(false);
  setCurrentStepId(
    getNextOnboardingStepId(ONBOARDING_STEP_IDS.basicProfile) ?? ONBOARDING_STEP_IDS.cycle,
  );
};
```

Trong render: nếu `showWowScreen`, render `<OnboardingWowScreen>` thay `<OnboardingLayout>`.

Pass `onAvatarChange` + `avatarPreviewUrl` xuống `<BasicProfileStep>`.

- [ ] **Step 4:** `yarn lint && yarn build`

- [ ] **Step 5:** Commit.

```bash
git add apps/health-tracker-web/src/app/onboarding/ apps/health-tracker-web/src/app/pages/onboarding-page.tsx
git commit -m "feat: add avatar picker and wow screen to onboarding"
```
