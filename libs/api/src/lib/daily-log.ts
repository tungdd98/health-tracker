import { supabase } from './supabase';

export type MoodValue = 'sad' | 'neutral' | 'happy' | 'very_happy' | 'tired';

export type DailyLog = {
  id: string;
  userId: string;
  date: string;
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

type DailyLogRow = {
  id: string;
  user_id: string;
  date: string;
  bbt_celsius: number | null;
  mood: MoodValue | null;
  weight_kg: number | null;
};

const DAILY_LOG_COLUMNS = 'id, user_id, date, bbt_celsius, mood, weight_kg';

const toDailyLog = (data: DailyLogRow): DailyLog => ({
  id: data.id,
  userId: data.user_id,
  date: data.date,
  bbtCelsius: data.bbt_celsius,
  mood: data.mood,
  weightKg: data.weight_kg,
});

export const getDailyLog = async (userId: string, date: string): Promise<DailyLog | null> => {
  const { data, error } = await supabase
    .from('daily_logs')
    .select(DAILY_LOG_COLUMNS)
    .eq('user_id', userId)
    .eq('date', date)
    .maybeSingle<DailyLogRow>();

  if (error) {
    throw error;
  }

  return data ? toDailyLog(data) : null;
};

export const upsertDailyLog = async (userId: string, patch: DailyLogPatch): Promise<DailyLog> => {
  const payload: Record<string, unknown> = {
    user_id: userId,
    date: patch.date,
    updated_at: new Date().toISOString(),
  };

  if (patch.bbtCelsius !== undefined) {
    payload.bbt_celsius = patch.bbtCelsius;
  }

  if (patch.mood !== undefined) {
    payload.mood = patch.mood;
  }

  if (patch.weightKg !== undefined) {
    payload.weight_kg = patch.weightKg;
  }

  const { data, error } = await supabase
    .from('daily_logs')
    .upsert(payload, { onConflict: 'user_id,date' })
    .select(DAILY_LOG_COLUMNS)
    .single<DailyLogRow>();

  if (error) {
    throw error;
  }

  return toDailyLog(data);
};
