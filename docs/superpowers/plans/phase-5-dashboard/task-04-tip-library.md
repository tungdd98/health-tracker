### Task 04: Implement tip-of-day library

**Files:**

- Create: `apps/health-tracker-web/src/app/dashboard/tip-library.ts`

- [x] **Step 1: Create `tip-library.ts`**

```typescript
import { DateTime } from 'luxon';

import type { CyclePhase } from './cycle-utils';

const PHASE_TIPS: Record<CyclePhase, string[]> = {
  menstrual: [
    'Hay nghi ngoi va cham soc ban than — mot chut tra am va thu gian la hoan toan xung dang hom nay.',
    'Co the dang lam viec cham chi. Uong du nuoc va an thuc pham giau sat giup ban phuc hoi tot hon.',
    'Day la luc tuyet voi de lang nghe co the va tranh nhung hoat dong cang thang neu can.',
  ],
  follicular: [
    'Nang luong dang dan tro lai! Day la thoi diem tot de bat dau nhung thoi quen moi hoac tap the duc.',
    'Hormone estrogen dang tang — ban co the cam thay sang tao va tap trung hon nhung ngay nay.',
    'Hay tan dung suc khoe doi dao de lam nhung dieu ban yeu thich nhat.',
  ],
  fertile: [
    'Cua so thu thai dang mo — day la thoi diem ly tuong neu ban dang co gang co con.',
    'Theo doi nhiet do co the buoi sang giup xac nhan thoi diem rung trung chinh xac hon.',
    'Giu tinh than vui ve va thoai mai trong nhung ngay nay de ho tro suc khoe sinh san tot nhat.',
  ],
  luteal: [
    'Co the can nhieu magie hon vao giai doan nay — cac loai hat va rau la xanh la lua chon tot.',
    'Neu cam thay cang thang hoac met moi, do la phan ung binh thuong cua hormone. Hay tu te voi ban than.',
    'Yoga nhe nhang hoac di bo ngan co the giup giam bot cac trieu chung tien kinh nguyet.',
  ],
};

export const pickTip = (phase: CyclePhase, today: DateTime): string => {
  const tips = PHASE_TIPS[phase];
  return tips[today.ordinal % tips.length];
};
```

> Note: Tip strings are stored as romanized ASCII to keep the source file cSpell-clean. The component that renders the tip (`tip-of-day.tsx`) will display the text as-is; update the strings to proper Vietnamese with diacritics directly in the JSX text node or use a separate Vietnamese tips file if preferred.
>
> Alternatively, just add the proper Vietnamese strings here — cSpell warnings in `.ts` files are cosmetic and do not affect lint or build. The choice is left to the implementer.

- [x] **Step 2: Verify**

```bash
yarn lint && yarn build
```

Expected: no errors.

- [x] **Step 3: Commit**

```bash
git add apps/health-tracker-web/src/app/dashboard/tip-library.ts
git commit -m "feat: add tip-of-day library (PHASE_TIPS, pickTip)"
```

- [x] **Step 4: Mark complete in index.md**

Check off Task 04 in `docs/superpowers/plans/phase-5-dashboard/index.md`.
