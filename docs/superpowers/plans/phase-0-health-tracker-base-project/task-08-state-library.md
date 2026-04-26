### Task 08: Add the minimal Zustand reference store

**Files:**

- Create: `libs/state/src/lib/app-ui-store.ts`
- Modify: `libs/state/src/index.ts`

- [x] **Step 1: Implement the sample app UI store**

Create `libs/state/src/lib/app-ui-store.ts`:

```ts
import { create } from 'zustand';

type AppUiState = {
  isShellCompact: boolean;
  toggleShellCompact: () => void;
};

export const useAppUiStore = create<AppUiState>((set) => ({
  isShellCompact: false,
  toggleShellCompact: () =>
    set((state) => ({
      isShellCompact: !state.isShellCompact,
    })),
}));
```

Expected: The project has one minimal Zustand store that demonstrates the intended pattern without introducing domain state.

- [x] **Step 2: Export the state library surface**

Set `libs/state/src/index.ts` to:

```ts
export * from './lib/app-ui-store';
```

Expected: The reference store is available through a clean public entrypoint.

- [x] **Step 3: Commit the state reference**

Run:

```bash
git add libs/state
git commit -m "feat: add zustand pattern"
```

Expected: Git creates a commit for the state library.
