### Task 01: Install design-system dependencies and rebuild the shared theme

**Files:**

- Modify: `package.json`
- Modify: `libs/theme/src/lib/theme.ts`
- Modify: `libs/theme/src/index.ts`

- [x] **Step 1: Add direct dependencies for the approved font and date picker support**

Add `@fontsource/plus-jakarta-sans`, `@mui/x-date-pickers`, and `luxon` to the root dependencies so the design system has a local font source and a supported mobile date picker foundation.

Expected: `package.json` declares the dependencies required by the approved design system.

- [x] **Step 2: Replace the base theme with the approved mobile-first token set**

Update `libs/theme/src/lib/theme.ts` so the app theme matches the approved Stitch direction:

- `Plus Jakarta Sans` for every text role
- the soft rose tonal palette
- large rounded corners
- component overrides for cards, buttons, fields, navigation surfaces, toggles, and chips
- baseline background styling that supports the calm editorial direction

Expected: The shared theme becomes the single source of truth for the new design system.

- [x] **Step 3: Export the theme with font side effects**

Update `libs/theme/src/index.ts` so importing `@health-tracker/theme` also loads the required `Plus Jakarta Sans` font weights.

Expected: App consumers receive both the theme object and the font styles from one import surface.
