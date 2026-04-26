import type { AuthSession } from '@supabase/supabase-js';
import { useSyncExternalStore } from 'react';

import {
  getCurrentSession,
  getOnboardingProfileFromUser,
  subscribeToAuthChanges,
} from '@health-tracker/api';

type AuthSessionStore = {
  isAuthResolved: boolean;
  session: AuthSession | null;
};

const listeners = new Set<() => void>();

let authStore: AuthSessionStore = {
  isAuthResolved: false,
  session: null,
};

let hasBootstrapped = false;

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

const setAuthStore = (nextStore: AuthSessionStore) => {
  authStore = nextStore;
  emitChange();
};

const bootstrapAuthSession = async () => {
  const { session } = await getCurrentSession();

  setAuthStore({
    isAuthResolved: true,
    session,
  });
};

const ensureAuthBootstrap = () => {
  if (hasBootstrapped) {
    return;
  }

  hasBootstrapped = true;

  void bootstrapAuthSession();

  subscribeToAuthChanges((_event, session) => {
    setAuthStore({
      isAuthResolved: true,
      session,
    });
  });
};

const subscribe = (listener: () => void) => {
  ensureAuthBootstrap();
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => authStore;

export const useAuthSession = () => {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const onboardingProfile = getOnboardingProfileFromUser(snapshot.session?.user ?? null);

  return {
    isAuthResolved: snapshot.isAuthResolved,
    session: snapshot.session,
    user: snapshot.session?.user ?? null,
    onboardingProfile,
    isOnboardingComplete: onboardingProfile.onboardingCompleted,
    hasSelectedOnboardingPhase: onboardingProfile.selectedPhase !== null,
  };
};
