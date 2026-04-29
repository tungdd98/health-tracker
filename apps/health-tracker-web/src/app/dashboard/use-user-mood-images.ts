import { useQuery } from '@tanstack/react-query';

import { getAvatarMeta, getUserMoodImages, type MoodValue } from '@health-tracker/api';

type UserMoodImagesResult = {
  moodImages: Partial<Record<MoodValue, string>>;
  useAvatarMood: boolean;
  hasStickers: boolean;
};

export function useUserMoodImages(userId: string): UserMoodImagesResult {
  const { data: moodImages = {} } = useQuery({
    queryKey: ['userMoodImages', userId],
    queryFn: () => getUserMoodImages(userId),
    staleTime: 1000 * 60 * 10,
  });

  const { data: avatarMeta } = useQuery({
    queryKey: ['avatarMeta', userId],
    queryFn: () => getAvatarMeta(userId),
    staleTime: 1000 * 60 * 10,
  });

  return {
    moodImages,
    useAvatarMood: avatarMeta?.useAvatarMood ?? false,
    hasStickers: Object.keys(moodImages).length > 0,
  };
}
