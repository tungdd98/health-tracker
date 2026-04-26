import type { AuthChangeEvent, AuthSession } from '@supabase/supabase-js';

import { supabase } from './supabase';

export type AuthChangeCallback = (event: AuthChangeEvent, session: AuthSession | null) => void;

export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();

  return {
    session: data.session,
    error,
  };
};

export const signInWithEmailPassword = async (email: string, password: string) =>
  supabase.auth.signInWithPassword({
    email,
    password,
  });

export const signUpWithEmailPassword = async (email: string, password: string) =>
  supabase.auth.signUp({
    email,
    password,
  });

export const signOutUser = async () => supabase.auth.signOut();

export const subscribeToAuthChanges = (callback: AuthChangeCallback) =>
  supabase.auth.onAuthStateChange(callback);
