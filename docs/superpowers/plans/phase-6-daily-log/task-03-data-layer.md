# Task 03 — Data layer (libs/api)

**Files:**

- Create: `libs/api/src/lib/daily-log.ts`
- Modify: `libs/api/src/index.ts`

---

- [ ] **Step 1:** Create `libs/api/src/lib/daily-log.ts`

```typescript
import { supabase } from './supabase';

export type MoodValue = 'sad' | 'neutral' | 'happy' | 'very_happy' | 'tired';

export type DailyLog = {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  bbtCelsius: number | null;
  mood: MoodValue | null;
  weightKg: number | null;
};

export type DailyLogPatch = {
  date: string;
  bbtCelsius?: number | null;
  mood?: MoodValue | null;
  weightKg?: number | null;
};

export const getDailyLog = async (userId: string, date: string): Promise<DailyLog | null> => {
  const { data, error } = await supabase
    .from('daily_logs')
    .select('id, user_id, date, bbt_celsius, mood, weight_kg')
    .eq('user_id', userId)
    .eq('date', date)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id as string,
    userId: data.user_id as string,
    date: data.date as string,
    bbtCelsius: (data.bbt_celsius ?? null) as number | null,
    mood: (data.mood ?? null) as MoodValue | null,
    weightKg: (data.weight_kg ?? null) as number | null,
  };
};

export const upsertDailyLog = async (userId: string, patch: DailyLogPatch): Promise<DailyLog> => {
  const payload: Record<string, unknown> = {
    user_id: userId,
    date: patch.date,
    updated_at: new Date().toISOString(),
  };

  if (patch.bbtCelsius !== undefined) payload['bbt_celsius'] = patch.bbtCelsius;
  if (patch.mood !== undefined) payload['mood'] = patch.mood;
  if (patch.weightKg !== undefined) payload['weight_kg'] = patch.weightKg;

  const { data, error } = await supabase
    .from('daily_logs')
    .upsert(payload, { onConflict: 'user_id,date' })
    .select('id, user_id, date, bbt_celsius, mood, weight_kg')
    .single();

  if (error) throw error;

  return {
    id: data.id as string,
    userId: data.user_id as string,
    date: data.date as string,
    bbtCelsius: (data.bbt_celsius ?? null) as number | null,
    mood: (data.mood ?? null) as MoodValue | null,
    weightKg: (data.weight_kg ?? null) as number | null,
  };
};
```

- [ ] **Step 2:** Append to end of `libs/api/src/index.ts`

```typescript
export * from './lib/daily-log';
```

- [ ] **Step 3:** Build verify

```bash
yarn build
```

Expected: No TypeScript errors.

- [ ] **Step 4:** Commit

```bash
git add libs/api/src/lib/daily-log.ts libs/api/src/index.ts
git commit -m "feat: add daily-log data layer to libs/api"
```
