### Task 02: Implement mobile-first UI primitives and shell updates

**Files:**

- Modify: `libs/ui/src/lib/app-shell.tsx`
- Modify: `libs/ui/src/lib/app-header.tsx`
- Modify: `libs/ui/src/lib/page-section.tsx`
- Modify: `libs/ui/src/lib/loading-block.tsx`
- Modify: `libs/ui/src/lib/empty-state.tsx`
- Create: `libs/ui/src/lib/app-bottom-nav.tsx`
- Create: `libs/ui/src/lib/app-card.tsx`
- Create: `libs/ui/src/lib/app-chip.tsx`
- Create: `libs/ui/src/lib/app-list-item.tsx`
- Modify: `libs/ui/src/index.ts`

- [x] **Step 1: Rebuild the shell around the mobile-first navigation model**

Update the shell and header to support:

- a softer top bar presentation
- sticky bottom navigation
- tighter mobile width defaults
- layered backgrounds instead of flat blocks

Expected: App layout now reflects the approved mobile-first structure.

- [x] **Step 2: Add reusable surface and navigation primitives**

Create shared wrappers for:

- bottom navigation
- card
- chip
- list item

Expected: The UI library exposes the base components called out in the approved design system instead of relying on ad hoc MUI usage.

- [x] **Step 3: Bring supporting feedback primitives into the same visual system**

Update `PageSection`, `LoadingBlock`, and `EmptyState` so spacing, elevation, and typography match the new theme.

Expected: Feedback and content scaffolds feel like part of the same system as the new shell and surfaces.
