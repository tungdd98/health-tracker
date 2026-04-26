### Task 04: Build the shared theme library

**Files:**

- Create: `libs/theme/src/lib/theme.ts`
- Modify: `libs/theme/src/index.ts`

- [x] **Step 1: Implement the project theme**

Create `libs/theme/src/lib/theme.ts`:

```ts
import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#166534',
    },
    secondary: {
      main: '#0f766e',
    },
    background: {
      default: '#f6f7f1',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Averia Serif Libre", "Georgia", serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
        },
      },
    },
  },
});
```

Expected: The workspace has a single shared MUI theme with project-level visual defaults.

- [x] **Step 2: Export the theme from the library entrypoint**

Set `libs/theme/src/index.ts` to:

```ts
export * from './lib/theme';
```

Expected: App code can import `appTheme` from `@health-tracker/theme`.

- [x] **Step 3: Commit the theme foundation**

Run:

```bash
git add libs/theme
git commit -m "feat: add shared mui theme"
```

Expected: Git creates a commit containing the theme implementation.
