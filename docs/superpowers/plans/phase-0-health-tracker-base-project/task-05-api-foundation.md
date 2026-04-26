### Task 05: Build the API foundation

**Files:**

- Create: `libs/api/src/lib/env.ts`
- Create: `libs/api/src/lib/supabase.ts`
- Create: `libs/api/src/lib/query-client.ts`
- Modify: `libs/api/src/index.ts`

- [x] **Step 1: Implement runtime env parsing**

Create `libs/api/src/lib/env.ts`:

```ts
import { z } from 'zod';

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
});

export type AppEnv = z.infer<typeof envSchema>;

export const appEnv: AppEnv = envSchema.parse({
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
});
```

Expected: Invalid or missing Supabase env values fail at startup with a clear schema error.

- [x] **Step 2: Implement the shared Supabase client**

Create `libs/api/src/lib/supabase.ts`:

```ts
import { createClient } from '@supabase/supabase-js';

import { appEnv } from './env';

export const supabase = createClient(appEnv.VITE_SUPABASE_URL, appEnv.VITE_SUPABASE_ANON_KEY);
```

Expected: The app has a single importable Supabase client instance.

- [x] **Step 3: Implement the shared Query Client**

Create `libs/api/src/lib/query-client.ts`:

```ts
import { QueryClient } from '@tanstack/react-query';

export const createAppQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
```

Expected: React Query has a single default factory with pragmatic defaults.

- [x] **Step 4: Export the API surface**

Set `libs/api/src/index.ts` to:

```ts
export * from './lib/env';
export * from './lib/query-client';
export * from './lib/supabase';
```

Expected: App code can import the env object, Supabase client, and Query Client factory from one place.

- [ ] **Step 5: Commit the API foundation**

Run:

```bash
git add libs/api
git commit -m "feat: add api foundation"
```

Expected: Git creates a commit for env, query, and Supabase setup.
