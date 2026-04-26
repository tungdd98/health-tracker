### Task 02: Design the onboarding screens in Google Stitch

**Files:**

- Reference: `docs/superpowers/specs/2026-04-26-onboarding-design.md`
- Modify: the Google Stitch project for Health Tracker onboarding screens and implementation-state notes

- [x] **Step 1: Re-read the approved onboarding spec before touching Stitch**

Review:

- `docs/superpowers/specs/2026-04-26-onboarding-design.md`

Focus on:

- the warm mobile-first visual direction
- the required step order
- the rule that only the default screens are authoritative design references
- the requirement that the pregnancy path is visible but disabled

Expected: The Stitch work stays aligned with the approved scope and does not drift into unsupported product branches.

- [x] **Step 2: Design the `Select Phase / Default` frame**

Create or update a dedicated frame for the first onboarding step that includes:

- a short onboarding eyebrow, title, and description
- a visible progress treatment for step `1 / 5`
- a large selectable card for `Chuẩn bị có em bé`
- a large disabled card for `Đang có em bé`
- a `Sắp ra mắt` label on the disabled option
- footer actions with `Tiếp tục`

Expected: Engineering has a clear visual source of truth for the only required onboarding step.

- [x] **Step 3: Design the optional data-entry default frames**

Create or update dedicated default frames for:

- `Thông tin cơ bản / Default`
- `Chu kỳ kinh nguyệt / Default`
- `Chiều cao và cân nặng / Default`

Each frame should include:

- progress treatment for its step index
- a short title and helper description
- the required fields for that step
- footer actions with `Quay lại`, `Bỏ qua`, and `Tiếp tục`

Expected: Each optional onboarding step has an authoritative default layout before code implementation begins.

- [x] **Step 4: Design the `Hoàn tất / Default` frame**

Create or update the final completion frame with:

- completion-focused copy
- a simple summary tone rather than a medical review screen
- the final primary CTA to enter the app

Expected: The wizard has a clear visual destination that matches the approved completion behavior.

- [x] **Step 5: Capture state and implementation notes without making non-default variants authoritative**

Document implementation-facing notes in the Stitch handoff or task execution notes for:

- step progress treatment
- disabled-card treatment
- inline field error placement
- loading CTA behavior
- submit-error placement
- when `Bỏ qua` should appear or be disabled on optional steps

Do not make generated loading or error mockups the design source of truth unless Hoàng Thượng explicitly approves them later.

Expected: Engineering can implement validation, loading, and error states in code while preserving the approved default layouts.

- [x] **Step 6: Scope-check the Stitch output before moving to code**

Verify the final Stitch set does not introduce:

- pregnancy onboarding screens
- settings editing screens
- mood tracking
- medication tracking
- dashboard mockups beyond a minimal post-onboarding handoff if needed

Expected: The phase moves into UI implementation with stable visual references and no hidden scope expansion.

### Execution Notes

- Stitch project: `projects/2050085960228570195` (`Trợ lý Sức khỏe Chang`)
- Stitch session: `593088093545485730`
- Updated design system: `Health Tracker Mobile DS`
- The onboarding screens were generated in the same warm rose / tonal layering language as auth, using Plus Jakarta Sans across the set.

### Final Screen Inventory

- `Select Phase / Default`
- `Basic Profile / Default`
- `Cycle Information / Default`
- `Body Metrics / Default`
- `Completion / Default`

### Authority Decision

- The approved Stitch source of truth for onboarding implementation is limited to the five default screens above.
- Any loading, validation error, or submit error behavior should be implemented in code on top of the default layouts.
- The disabled `Đang có em bé` branch remains visible but is not an implementation target in this phase.

### Implementation Notes

- `Select Phase / Default`: progress `1 / 5`, eyebrow + title + description, one enabled selection card, one disabled coming-soon card, and primary `Tiếp tục`.
- `Basic Profile / Default`: progress `2 / 5`, title + helper copy, `Tên hiển thị` and `Ngày sinh`, with `Quay lại`, `Bỏ qua`, `Tiếp tục`.
- `Cycle Information / Default`: progress `3 / 5`, helper copy explaining why cycle data is requested, `Độ dài chu kỳ` and `Ngày bắt đầu kỳ kinh gần nhất`, with `Quay lại`, `Bỏ qua`, `Tiếp tục`.
- `Body Metrics / Default`: progress `4 / 5`, `Chiều cao (cm)` and `Cân nặng (kg)`, with `Quay lại`, `Bỏ qua`, `Tiếp tục`.
- `Completion / Default`: progress `5 / 5`, simple completion message, calm summary tone, primary `Bắt đầu ngay`.
- Inline field errors should sit directly beneath the related field.
- Submit-level errors should be shown above the primary CTA.
- Loading states should disable the CTA without shifting layout.
- `Bỏ qua` should appear only on optional steps and be disabled or hidden when the step already has entered values.
- No extra pregnancy, settings, dashboard, mood, or medication screens were introduced.
