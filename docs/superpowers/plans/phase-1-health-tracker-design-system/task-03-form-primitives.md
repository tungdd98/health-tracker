### Task 03: Expand the forms library with shared controls

**Files:**

- Modify: `libs/forms/src/lib/form-provider.tsx`
- Modify: `libs/forms/src/lib/form-text-field.tsx`
- Create: `libs/forms/src/lib/form-select-field.tsx`
- Create: `libs/forms/src/lib/form-text-area-field.tsx`
- Create: `libs/forms/src/lib/form-radio-group.tsx`
- Create: `libs/forms/src/lib/form-checkbox-field.tsx`
- Create: `libs/forms/src/lib/form-switch-field.tsx`
- Create: `libs/forms/src/lib/form-slider-field.tsx`
- Create: `libs/forms/src/lib/form-segmented-control.tsx`
- Create: `libs/forms/src/lib/form-stepper.tsx`
- Create: `libs/forms/src/lib/form-date-field.tsx`
- Modify: `libs/forms/src/index.ts`

- [x] **Step 1: Standardize provider and text-field behavior for the new system**

Update the existing form provider and text field wrapper so they support consistent spacing, helper text handling, and mobile-friendly field layout.

Expected: Existing form primitives continue to work but now fit the new design system.

- [x] **Step 2: Add the remaining approved form primitives**

Create shared wrappers for:

- select
- text area
- radio group
- checkbox
- switch
- slider
- segmented control
- stepper
- date field

Expected: The forms library covers the approved base controls without forcing feature code to reinvent form presentation.

- [x] **Step 3: Export the full form surface**

Update `libs/forms/src/index.ts` so all approved shared controls are available from the library root.

Expected: The forms library can serve as the implementation surface for future health-tracking screens.

**Note:** The date field wrapper is configured for the MUI X v8 custom `TextField` slot path, including `enableAccessibleFieldDOMStructure={false}` for compatibility with the current input-based implementation.
