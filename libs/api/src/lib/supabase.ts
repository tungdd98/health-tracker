import { createClient } from '@supabase/supabase-js';

import { appEnv } from './env';

export const supabase = createClient(appEnv.VITE_SUPABASE_URL, appEnv.VITE_SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
