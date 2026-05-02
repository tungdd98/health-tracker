import '../edge-runtime.d.ts';

import { createClient } from 'npm:@supabase/supabase-js@2';

type CyclePhase = 'menstrual' | 'follicular' | 'fertile' | 'luteal';

const PHASE_LABELS: Record<CyclePhase, string> = {
  menstrual: 'kinh nguyệt',
  follicular: 'nang trứng',
  fertile: 'rụng trứng',
  luteal: 'hoàng thể',
};

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MODEL = 'claude-haiku-4-5-20251001';

const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': '*',
};

type RequestBody = {
  date: string;
  phase: CyclePhase;
};

type DailyLogRow = {
  date: string;
  mood: string | null;
};

type DailyTipRow = {
  tip_text: string;
};

const isValidPhase = (value: unknown): value is CyclePhase =>
  typeof value === 'string' && ['menstrual', 'follicular', 'fertile', 'luteal'].includes(value);

const isValidDate = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

const buildPrompt = (phase: CyclePhase, moodSummary: string | null, goals: string[]): string => {
  const lines = [
    'Bạn là trợ lý sức khỏe phụ nữ. Hãy viết 1 lời khuyên ngắn (2-3 câu) bằng tiếng Việt, thân thiện và ấm áp, phù hợp với:',
    `- Giai đoạn chu kỳ: ${PHASE_LABELS[phase]}`,
  ];

  if (moodSummary) {
    lines.push(`- Triệu chứng/cảm xúc gần đây: ${moodSummary}`);
  }

  if (goals.length > 0) {
    lines.push(`- Mục tiêu sức khỏe: ${goals.join(', ')}`);
  }

  lines.push('\nChỉ trả về nội dung lời khuyên, không thêm tiêu đề hay giải thích.');

  return lines.join('\n');
};

const sevenDaysAgo = (fromDate: string): string => {
  const d = new Date(fromDate);
  d.setDate(d.getDate() - 7);
  return d.toISOString().split('T')[0] ?? fromDate;
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const authHeader = request.headers.get('Authorization') ?? request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return Response.json({ error: 'Unauthorized' }, { headers: corsHeaders, status: 401 });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseAnonKey =
    Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('SB_PUBLISHABLE_KEY') ?? '';
  const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY') ?? '';

  if (!supabaseUrl || !supabaseAnonKey || !anthropicApiKey) {
    return Response.json(
      { error: 'Missing server configuration.' },
      { headers: corsHeaders, status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { headers: corsHeaders, status: 401 });
  }

  let body: RequestBody;
  try {
    const raw = (await request.json()) as Record<string, unknown>;
    if (!isValidDate(raw.date) || !isValidPhase(raw.phase)) {
      throw new Error('Invalid fields');
    }
    body = { date: raw.date, phase: raw.phase };
  } catch {
    return Response.json(
      {
        error:
          'Invalid request body. Requires: date (YYYY-MM-DD), phase (menstrual|follicular|fertile|luteal).',
      },
      { headers: corsHeaders, status: 400 },
    );
  }

  // Idempotency: return cached tip if it already exists for today
  const { data: existing } = await supabase
    .from('daily_tips')
    .select('tip_text')
    .eq('user_id', user.id)
    .eq('date', body.date)
    .maybeSingle<DailyTipRow>();

  if (existing) {
    return Response.json({ tipText: existing.tip_text }, { headers: corsHeaders });
  }

  // Fetch personalization context in parallel
  const [logsResult, profileResult] = await Promise.allSettled([
    supabase
      .from('daily_logs')
      .select('date, mood')
      .eq('user_id', user.id)
      .gte('date', sevenDaysAgo(body.date))
      .order('date', { ascending: false })
      .returns<DailyLogRow[]>(),
    supabase
      .from('profiles')
      .select('assistant_goals')
      .eq('id', user.id)
      .maybeSingle<{ assistant_goals: string[] | null }>(),
  ]);

  const logs = logsResult.status === 'fulfilled' ? (logsResult.value.data ?? []) : [];
  const goals =
    profileResult.status === 'fulfilled'
      ? (profileResult.value.data?.assistant_goals ?? []).filter(
          (g): g is string => typeof g === 'string' && g.trim().length > 0,
        )
      : [];

  const moodLogs = logs.filter((l) => l.mood);
  const moodSummary = moodLogs.length > 0 ? moodLogs.map((l) => l.mood).join(', ') : null;

  const prompt = buildPrompt(body.phase, moodSummary, goals);

  // Call Claude Haiku (non-streaming)
  const claudeResponse = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'anthropic-version': ANTHROPIC_VERSION,
      'content-type': 'application/json',
      'x-api-key': anthropicApiKey,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!claudeResponse.ok) {
    const errorText = await claudeResponse.text();
    const status = claudeResponse.status === 429 ? 429 : 502;
    return Response.json(
      { error: `Claude error ${claudeResponse.status}: ${errorText}` },
      { headers: corsHeaders, status },
    );
  }

  const claudeJson = (await claudeResponse.json()) as Record<string, unknown>;
  const content = Array.isArray(claudeJson.content) ? claudeJson.content : [];
  const tipText = (content as Array<Record<string, unknown>>).find((b) => b['type'] === 'text')?.[
    'text'
  ] as string | undefined;

  if (!tipText?.trim()) {
    return Response.json(
      { error: 'Empty response from Claude.' },
      { headers: corsHeaders, status: 502 },
    );
  }

  const trimmedTip = tipText.trim();

  // Upsert handles the race condition where two requests arrive simultaneously
  const { error: upsertError } = await supabase
    .from('daily_tips')
    .upsert(
      { user_id: user.id, date: body.date, tip_text: trimmedTip },
      { onConflict: 'user_id,date' },
    );

  if (upsertError) {
    return Response.json({ error: 'Failed to save tip.' }, { headers: corsHeaders, status: 500 });
  }

  return Response.json({ tipText: trimmedTip }, { headers: corsHeaders });
});
