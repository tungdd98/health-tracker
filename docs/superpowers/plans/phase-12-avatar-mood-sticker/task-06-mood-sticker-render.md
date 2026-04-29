# Task 06 — Mood Sticker Render (Bottom Sheet + Dashboard)

**Files:**

- Create: `apps/health-tracker-web/src/app/dashboard/use-user-mood-images.ts`
- Modify: `apps/health-tracker-web/src/app/dashboard/mood-bottom-sheet.tsx`
- Modify: `apps/health-tracker-web/src/app/dashboard/daily-log-strip.tsx`

---

**Design reference:** `docs/superpowers/specs/2026-04-29-avatar-mood-sticker-design.md` — Flow 3, UI: Mood Bottom Sheet, Dashboard Mood Card.

- [ ] **Step 1:** Tạo `use-user-mood-images.ts`.

```ts
import { useQuery } from '@tanstack/react-query';
import { getUserMoodImages, getAvatarMeta } from '@health-tracker/api';
import type { MoodValue } from '@health-tracker/api';

export const userMoodImagesQueryKey = (userId: string | undefined) =>
  ['user-mood-images', userId] as const;

export const useUserMoodImages = (userId: string | undefined) => {
  const avatarMetaQuery = useQuery({
    queryKey: ['avatar-meta', userId],
    queryFn: () => getAvatarMeta(userId!),
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });

  const moodImagesQuery = useQuery({
    queryKey: userMoodImagesQueryKey(userId),
    queryFn: () => getUserMoodImages(userId!),
    enabled: Boolean(userId) && Boolean(avatarMetaQuery.data?.useAvatarMood),
    staleTime: 60 * 60 * 1000,
  });

  const hasStickers =
    avatarMetaQuery.data?.useAvatarMood === true &&
    moodImagesQuery.data !== undefined &&
    Object.keys(moodImagesQuery.data).length > 0;

  return {
    moodImages: moodImagesQuery.data ?? ({} as Record<MoodValue, string>),
    hasStickers,
  };
};
```

- [ ] **Step 2:** Cập nhật `mood-bottom-sheet.tsx`.

Thêm props: `moodImages: Record<MoodValue, string>`, `hasStickers: boolean`.

Trong render các mood card, thay `<Typography sx={{ fontSize: 22 }}>{mood.emoji}</Typography>` bằng:

```tsx
{
  hasStickers && moodImages[mood.value] ? (
    <Box
      component="img"
      src={moodImages[mood.value]}
      alt={mood.label}
      sx={{ width: 32, height: 32, objectFit: 'contain' }}
    />
  ) : (
    <Typography sx={{ fontSize: 22 }}>{mood.emoji}</Typography>
  );
}
```

- [ ] **Step 3:** Cập nhật `daily-log-strip.tsx`.

Thêm `userId` đã có sẵn vào `useUserMoodImages(userId)`.

Trong `DailyLogStrip`, mood card `value` prop hiện đang là `${MOOD_EMOJI[log.mood]} ${MOOD_LABELS[log.mood]}`.

Thêm `moodIcon` prop vào `LogCard` (kiểu `ReactNode`), truyền sticker image thay emoji khi có:

```tsx
icon={
  hasStickers && log?.mood && moodImages[log.mood]
    ? <Box component="img" src={moodImages[log.mood]} alt="" sx={{ width: 22, height: 22, objectFit: 'contain' }} />
    : <SentimentSatisfiedAltRoundedIcon fontSize="inherit" />
}
```

Pass `moodImages` + `hasStickers` xuống `<MoodBottomSheet>`.

- [ ] **Step 4:** `yarn lint && yarn build`

- [ ] **Step 5:** Commit.

```bash
git add apps/health-tracker-web/src/app/dashboard/
git commit -m "feat: render sticker images in mood sheet and dashboard"
```
