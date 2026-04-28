# Task 03: Align shared UI and form primitives

**Files:**

- Modify: `libs/ui/src/lib/app-bottom-nav.tsx`
- Modify: `libs/ui/src/lib/app-header.tsx`
- Modify: `libs/ui/src/lib/app-list-item.tsx`
- Modify: `libs/ui/src/lib/empty-state.tsx`
- Modify: `libs/ui/src/lib/loading-block.tsx`
- Modify: `libs/forms/src/lib/form-field.tsx`

- [x] Remove repeated style literals that now map cleanly to the shared theme contract.
- [x] Keep `libs/ui` primitives as the canonical source for repeated surface and navigation styling.
- [x] Align labels/helper text with shared typography roles.

**Expected outcome:** Shared primitives stop reintroducing the same drift into feature screens.
