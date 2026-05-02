import { appEnv } from './env';
import { supabase } from './supabase';

type DailyTipRow = {
  tip_text: string;
};

export const getDailyTip = async (userId: string, date: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('daily_tips')
    .select('tip_text')
    .eq('user_id', userId)
    .eq('date', date)
    .maybeSingle<DailyTipRow>();

  if (error) {
    throw error;
  }

  return data?.tip_text ?? null;
};

export const generateDailyTip = async (phase: string, date: string): Promise<string> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new Error('No active session');
  }

  const response = await fetch(`${appEnv.VITE_SUPABASE_URL}/functions/v1/generate-daily-tip`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ phase, date }),
  });

  if (!response.ok) {
    throw new Error(`generate-daily-tip failed: ${response.status}`);
  }

  const json = (await response.json()) as { tipText: string };

  if (!json.tipText) {
    throw new Error('Empty tipText in response');
  }

  return json.tipText;
};
