import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';

const HOURLY_LIMIT = 30;
const DAILY_LIMIT = 200;

type ChatUsageRow = {
  user_id: string;
  hour_bucket: string;
  message_count: number;
};

const toHourBucket = (date: Date) => {
  const bucket = new Date(date);
  bucket.setMinutes(0, 0, 0);
  return bucket.toISOString();
};

export const checkChatRateLimit = async (supabase: SupabaseClient, userId: string) => {
  const now = new Date();
  const dailyThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('chat_usage')
    .select('user_id, hour_bucket, message_count')
    .eq('user_id', userId)
    .gte('hour_bucket', dailyThreshold)
    .returns<ChatUsageRow[]>();

  if (error) {
    throw error;
  }

  const usageRows = data ?? [];
  const hourlyThreshold = now.getTime() - 60 * 60 * 1000;

  const lastHourCount = usageRows
    .filter((row) => new Date(row.hour_bucket).getTime() >= hourlyThreshold)
    .reduce((sum, row) => sum + row.message_count, 0);

  const lastDayCount = usageRows.reduce((sum, row) => sum + row.message_count, 0);

  return {
    exceeded: lastHourCount >= HOURLY_LIMIT || lastDayCount >= DAILY_LIMIT,
    lastHourCount,
    lastDayCount,
  };
};

export const incrementChatUsage = async (supabase: SupabaseClient, userId: string) => {
  const hourBucket = toHourBucket(new Date());

  const { data: existing, error: fetchError } = await supabase
    .from('chat_usage')
    .select('message_count')
    .eq('user_id', userId)
    .eq('hour_bucket', hourBucket)
    .maybeSingle<{ message_count: number }>();

  if (fetchError) {
    throw fetchError;
  }

  const { error: upsertError } = await supabase.from('chat_usage').upsert(
    {
      user_id: userId,
      hour_bucket: hourBucket,
      message_count: (existing?.message_count ?? 0) + 1,
    },
    {
      onConflict: 'user_id,hour_bucket',
    },
  );

  if (upsertError) {
    throw upsertError;
  }
};
