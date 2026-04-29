import type { AuthSession } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import {
  getCurrentSession,
  getOnboardingProfileFromUser,
  subscribeToAuthChanges,
} from '@health-tracker/api';

const AUTH_SESSION_QUERY_KEY = ['authSession'] as const;
let hasSubscribedAuthChanges = false;

const getSessionSnapshot = async (): Promise<AuthSession | null> => {
  const { session } = await getCurrentSession();
  return session;
};

const ensureAuthSubscription = (setSession: (session: AuthSession | null) => void) => {
  if (hasSubscribedAuthChanges) {
    return;
  }

  hasSubscribedAuthChanges = true;

  subscribeToAuthChanges((_event, session) => {
    setSession(session);
  });
};

export const useAuthSession = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    ensureAuthSubscription((session) => {
      queryClient.setQueryData<AuthSession | null>(AUTH_SESSION_QUERY_KEY, session);
    });
  }, [queryClient]);

  const { data: session = null, isFetched } = useQuery({
    queryKey: AUTH_SESSION_QUERY_KEY,
    queryFn: getSessionSnapshot,
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  const onboardingProfile = useMemo(
    () => getOnboardingProfileFromUser(session?.user ?? null),
    [session?.user],
  );

  return {
    isAuthResolved: isFetched,
    session,
    user: session?.user ?? null,
    onboardingProfile,
    isOnboardingComplete: onboardingProfile.onboardingCompleted,
    hasSelectedOnboardingPhase: onboardingProfile.selectedPhase !== null,
  };
};
