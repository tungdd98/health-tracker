### Task 03: Install runtime dependencies and root developer tooling

**Files:**
- Modify: `package.json`
- Create: `.nvmrc`
- Create: `.env.example`
- Create: `.prettierrc.json`
- Create: `.prettierignore`
- Create: `eslint.config.mjs`
- Create: `commitlint.config.cjs`
- Create: `.husky/pre-commit`
- Create: `.husky/commit-msg`
- Modify: `.gitignore`

- [ ] **Step 1: Add runtime dependencies**

Run:

```bash
yarn add @mui/material @mui/icons-material @emotion/react @emotion/styled react-hook-form zod @hookform/resolvers zustand react-router-dom @tanstack/react-query @supabase/supabase-js
```

Expected: `package.json` contains the requested application dependencies.

- [ ] **Step 2: Add root dev dependencies**

Run:

```bash
yarn add -D prettier husky @commitlint/cli @commitlint/config-conventional eslint @eslint/js typescript-eslint globals
```

Expected: Root tooling dependencies are available for formatting, linting, hooks, and commit message validation.

- [ ] **Step 3: Add root formatting and environment files**

Create these files:

```json
// .prettierrc.json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100
}
```

```text
# .prettierignore
dist
coverage
node_modules
.nx
```

```text
# .nvmrc
20
```

```text
# .env.example
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Append to `.gitignore`:

```gitignore
.env
.env.local
.env.*.local
dist
```

Expected: Formatting defaults, ignored outputs, Node version, and documented env variables are in place.

- [ ] **Step 4: Create the root ESLint config**

Create `eslint.config.mjs`:

```js
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['dist', 'node_modules', '.nx'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    },
  },
];
```

Expected: The workspace has a pragmatic flat ESLint config that works across app and libs.

- [ ] **Step 5: Configure Commitlint and Husky**

Create `commitlint.config.cjs`:

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

Run:

```bash
yarn husky init
mkdir -p .husky
```

Then set hook contents:

```sh
# .husky/pre-commit
yarn nx format:check
yarn nx run-many -t lint --all
```

```sh
# .husky/commit-msg
yarn commitlint --edit "$1"
```

Expected: Commits are blocked when format, lint, or commit message validation fails.

- [ ] **Step 6: Commit the root toolchain**

Run:

```bash
git add package.json yarn.lock .nvmrc .env.example .prettierrc.json .prettierignore eslint.config.mjs commitlint.config.cjs .husky .gitignore
git commit -m "chore: add root development tooling"
```

Expected: Git creates a commit with all root tooling configuration.
