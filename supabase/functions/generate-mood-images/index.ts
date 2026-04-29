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
const STICKER_SIZE = 256;
const STICKER_QUALITY = 60;
type MoodValue = (typeof MOODS)[number];
type MoodImageResult = { mood: MoodValue; imageUrl: string };

const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': '*',
};

const buildPrompt = (moodLabel: string) =>
  `Hãy tạo hình ảnh phong cách sticker zalo sử dụng khuôn mặt của avatar người dùng.\nTỷ lệ ảnh bắt buộc 1:1 (vuông).\nNền sạch, đơn giản.\nBiểu cảm: ${moodLabel}`;

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

const mimeTypeToExtension = (mimeType: string) => {
  if (mimeType.includes('png')) return 'png';
  if (mimeType.includes('webp')) return 'webp';
  if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return 'jpg';
  return 'png';
};

const decodeBase64 = (base64: string): Uint8Array => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const resolveImageAsset = async (
  imageRef: string,
): Promise<{ bytes: Uint8Array; contentType: string; extension: string }> => {
  if (imageRef.startsWith('data:')) {
    const [header, base64] = imageRef.split(',', 2);
    if (!header || !base64) {
      throw new Error('Invalid data URL returned from model');
    }

    const mimeType = header.match(/^data:(.*?);base64$/)?.[1] ?? 'image/png';
    return {
      bytes: decodeBase64(base64),
      contentType: mimeType,
      extension: mimeTypeToExtension(mimeType),
    };
  }

  const response = await fetch(imageRef);
  if (!response.ok) {
    throw new Error(`Failed to download generated image: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const contentType = response.headers.get('content-type') ?? 'image/png';
  return {
    bytes: new Uint8Array(arrayBuffer),
    contentType,
    extension: mimeTypeToExtension(contentType),
  };
};

const isFulfilled = <T>(result: PromiseSettledResult<T>): result is PromiseFulfilledResult<T> =>
  result.status === 'fulfilled';

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
        const imageRef = await generateImage(openrouterKey, avatarUrl, mood);
        const imageAsset = await resolveImageAsset(imageRef);
        const path = `${user.id}/${mood}.${imageAsset.extension}`;

        const { error: uploadError } = await supabase.storage
          .from('mood-images')
          .upload(path, imageAsset.bytes, { contentType: imageAsset.contentType, upsert: true });

        if (uploadError) throw uploadError;

        const { data: signed, error: signedError } = await supabase.storage
          .from('mood-images')
          .createSignedUrl(path, 60 * 60 * 24 * 365, {
            transform: {
              width: STICKER_SIZE,
              height: STICKER_SIZE,
              quality: STICKER_QUALITY,
            },
          });

        if (signedError) throw signedError;

        return { mood, imageUrl: signed.signedUrl } satisfies MoodImageResult;
      }),
    );

    const succeeded = results.filter(isFulfilled).map((r) => r.value);

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
