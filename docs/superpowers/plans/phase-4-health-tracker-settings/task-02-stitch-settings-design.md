### Task 02: Design the settings screen in Google Stitch

**Files:**

- Reference: `docs/superpowers/specs/2026-04-26-settings-design.md`
- Modify: the Google Stitch project for the Health Tracker settings screen and implementation-state notes

- [x] **Step 1: Re-read the approved settings spec before touching Stitch**

Review:

- `docs/superpowers/specs/2026-04-26-settings-design.md`

Focus on:

- the minimal settings scope
- the two editable sections and one account-action section
- the rule that `selected phase` is visible but read-only
- the rule that only default screens are authoritative design references

Expected: The Stitch work stays aligned with the approved scope and does not drift into preferences or security features.

- [x] **Step 2: Design the `Settings / Default` frame**

Create or update one dedicated default frame that includes:

- a settings page header in the signed-in visual language
- `Thông tin cá nhân` section with read-only `Giai đoạn hiện tại`, editable `Tên`, and editable `Ngày sinh`
- `Chu kỳ & cơ thể` section with `Độ dài chu kỳ`, `Ngày bắt đầu kỳ gần nhất`, `Chiều cao`, and `Cân nặng`
- `Tài khoản` section with a clear `Đăng xuất` action
- section-level `Lưu thay đổi` actions for the two editable sections

Expected: Engineering has one authoritative default settings layout before code implementation begins.

- [x] **Step 3: Capture implementation notes without making non-default variants authoritative**

Document implementation-facing notes in the Stitch handoff or task execution notes for:

- local success/error message placement per section
- loading treatment for a section-level save button
- read-only styling for `Giai đoạn hiện tại`
- spacing and hierarchy between the two editable sections and the destructive account action
- confirmation-dialog tone and button labels for `Đăng xuất`

Do not make AI-generated loading, success, or error mockups the design source of truth unless Hoàng Thượng explicitly approves them later.

Expected: Engineering can implement state behavior in code while preserving the approved default layout.

- [x] **Step 4: Scope-check the Stitch output before moving to code**

Verify the final Stitch output does not introduce:

- phase switching
- app preferences
- notification settings
- password or email change forms
- account deletion
- dashboard redesign work unrelated to settings entry

Expected: The phase can move into implementation with stable visual references and no hidden scope expansion.

### Execution Notes

- Stitch project: `projects/2050085960228570195` (`Trợ lý Sức khỏe Chang`)
- Created screen: `projects/2050085960228570195/screens/6a146939b91d4205bc20319517504ba6`
- Reuse the established Health Tracker mobile design language and approved signed-in surfaces.

### Final Screen Inventory

- `Settings / Default`

### Authority Decision

- The approved Stitch source of truth for settings implementation is limited to the default `Settings` screen.
- Validation, loading, success, and error states should be implemented in code by preserving the same layout and applying state-only changes.
- The sign-out confirmation dialog may be documented as implementation notes unless Hoàng Thượng later asks for a finalized dialog mockup.

### Pencil Redesign Follow-up

- On `2026-04-27`, settings visuals were refreshed in code against `docs/superpowers/designs/2026-04-27-settings.pen`.
- The active implementation now follows the Pencil frames `settings-default`, `settings-saving`, and `settings-error`, including the updated signed-in header, section-card typography, and outlined sign-out action.
- Stitch remains the original phase artifact, but the current settings presentation is now aligned to the Pencil redesign.
