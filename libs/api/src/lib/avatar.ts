import type { MoodValue } from './daily-log';
import { supabase } from './supabase';

export type UserAvatarMeta = {
  avatarUrl: string | null;
  useAvatarMood: boolean;
};

type ProfileAvatarRow = {
  avatar_url: string | null;
  use_avatar_mood: boolean;
};

type MoodImageRow = {
  mood: MoodValue;
  image_url: string;
};

// --- Avatar ---

export const uploadAvatar = async (userId: string, file: File): Promise<string> => {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${userId}/avatar.${ext}`;

  const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });

  if (error) throw error;

  const { data: signed, error: signedError } = await supabase.storage
    .from('avatars')
    .createSignedUrl(path, 60 * 60 * 24 * 365);

  if (signedError) throw signedError;

  return signed.signedUrl;
};

export const getAvatarMeta = async (userId: string): Promise<UserAvatarMeta> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('avatar_url, use_avatar_mood')
    .eq('id', userId)
    .maybeSingle<ProfileAvatarRow>();

  if (error) throw error;

  return {
    avatarUrl: data?.avatar_url ?? null,
    useAvatarMood: data?.use_avatar_mood ?? true,
  };
};

export const updateAvatarMeta = async (
  userId: string,
  patch: Partial<UserAvatarMeta>,
): Promise<void> => {
  const payload: Record<string, unknown> = { id: userId };
  if (patch.avatarUrl !== undefined) payload.avatar_url = patch.avatarUrl;
  if (patch.useAvatarMood !== undefined) payload.use_avatar_mood = patch.useAvatarMood;

  const { error } = await supabase.from('profiles').upsert(payload);
  if (error) throw error;
};

// --- Mood images ---

export const getUserMoodImages = async (userId: string): Promise<Record<MoodValue, string>> => {
  const { data, error } = await supabase
    .from('user_mood_images')
    .select('mood, image_url')
    .eq('user_id', userId)
    .returns<MoodImageRow[]>();

  if (error) throw error;

  return Object.fromEntries((data ?? []).map((r) => [r.mood, r.image_url])) as Record<
    MoodValue,
    string
  >;
};

export const generateMoodImages = async (userId: string): Promise<void> => {
  const { error } = await supabase.functions.invoke('generate-mood-images', {
    body: { user_id: userId },
  });

  if (error) throw error;
};
