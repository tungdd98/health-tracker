import '../edge-runtime.d.ts';

import { createClient } from 'npm:@supabase/supabase-js@2';

const MOOD_LABELS: Record<string, string> = {
  sad: 'buồn',
  neutral: 'bình thường',
  happy: 'vui',
  very_happy: 'rất vui',
  tired: 'mệt mỏi',
};

const MOODS = ['sad', 'neutral', 'happy', 'very_happy', 'tired'] as const;

const OPENROUTER_MODEL = 'google/gemini-2.5-flash-image';

const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': '*',
};

const buildPrompt = (moodLabel: string) =>
  `Hãy tạo hình ảnh phong cách sticker zalo sử dụng khuôn mặt của avatar người dùng.\nNền sạch, đơn giản.\nBiểu cảm: ${moodLabel}`;

const generateImage = async (
  openrouterKey: string,
  avatarUrl: string,
  mood: string,
): Promise<string> => {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openrouterKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      modalities: ['image', 'text'],
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: avatarUrl },
            },
            {
              type: 'text',
              text: buildPrompt(MOOD_LABELS[mood] ?? mood),
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenRouter error ${response.status}: ${body}`);
  }

  const json = (await response.json()) as {
    choices: Array<{
      message: {
        images?: Array<{ type: string; image_url?: { url: string } }>;
      };
    }>;
  };

  const imageUrl = json.choices[0]?.message?.images?.[0]?.image_url?.url;

  if (!imageUrl) {
    throw new Error('No image in OpenRouter response');
  }

  return imageUrl;
};

const dataUrlToBytes = (dataUrl: string): Uint8Array => {
  const base64 = dataUrl.split(',')[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
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
  const openrouterKey = Deno.env.get('OPENROUTER_API_KEY') ?? '';

  if (!supabaseUrl || !supabaseAnonKey || !openrouterKey) {
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

  const { data: profile } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', user.id)
    .maybeSingle<{ avatar_url: string | null }>();

  const avatarUrl = profile?.avatar_url;

  if (!avatarUrl) {
    return Response.json({ error: 'No avatar uploaded.' }, { headers: corsHeaders, status: 400 });
  }

  try {
    const results = await Promise.allSettled(
      MOODS.map(async (mood) => {
        const dataUrl = await generateImage(openrouterKey, avatarUrl, mood);
        const bytes = dataUrlToBytes(dataUrl);
        const path = `${user.id}/${mood}.png`;

        const { error: uploadError } = await supabase.storage
          .from('mood-images')
          .upload(path, bytes, { contentType: 'image/png', upsert: true });

        if (uploadError) throw uploadError;

        const { data: signed, error: signedError } = await supabase.storage
          .from('mood-images')
          .createSignedUrl(path, 60 * 60 * 24 * 365);

        if (signedError) throw signedError;

        return { mood, imageUrl: signed.signedUrl };
      }),
    );

    const succeeded = results
      .filter(
        (r): r is PromiseFulfilledResult<{ mood: string; imageUrl: string }> =>
          r.status === 'fulfilled',
      )
      .map((r) => r.value);

    if (succeeded.length === 0) {
      throw new Error('All image generations failed');
    }

    await supabase.from('user_mood_images').upsert(
      succeeded.map(({ mood, imageUrl }) => ({
        user_id: user.id,
        mood,
        image_url: imageUrl,
      })),
    );

    return Response.json({ success: true, count: succeeded.length }, { headers: corsHeaders });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Generation failed' },
      { headers: corsHeaders, status: 500 },
    );
  }
});
