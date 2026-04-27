### Task 02: Design the auth screens and states in Stitch

**Files:**

- Reference: `docs/superpowers/specs/2026-04-26-auth-design.md`
- Modify: the Stitch project for Health Tracker auth screens and auth-related component states

- [x] **Step 1: Re-read the approved auth spec before touching Stitch**

Review:

- `docs/superpowers/specs/2026-04-26-auth-design.md`

Focus on:

- the warm mobile-first visual direction
- the required `Login` and `Sign Up` layouts
- the required states and auth-specific patterns

Expected: The Stitch work stays aligned with the approved scope and does not drift into extra auth features.

- [x] **Step 2: Design the `Login` frame in Stitch**

Create or update a dedicated `Login` frame that includes:

- auth hero block with eyebrow, title, and short description
- email field
- password field with visibility toggle
- primary submit CTA
- cross-link to `Sign Up`

Use the existing soft rose design system and keep the layout compact, single-column, and mobile-first.

Expected: The `Login` screen has a clear production-ready visual source of truth before code implementation.

- [x] **Step 3: Design the `Sign Up` frame in Stitch**

Create or update a dedicated `Sign Up` frame that includes:

- auth hero block with sign-up-specific copy
- email field
- password field with visibility toggle
- confirm password field
- visible password rule text for the minimum `8` character requirement
- primary submit CTA
- cross-link to `Login`

Expected: The `Sign Up` screen is visually complete and clearly distinct in purpose while staying consistent with `Login`.

- [x] **Step 4: Add the required auth states in Stitch**

For both `Login` and `Sign Up`, add or document these states:

- default
- field error
- submit loading
- submit error

Also confirm the visual treatment for:

- inline error text
- disabled/loading CTA
- password visibility toggle

Expected: Engineering has explicit state references instead of inferring missing behaviors during implementation.

- [x] **Step 5: Capture implementation notes from Stitch**

Document the final implementation-facing notes in the task execution log or handoff notes, including:

- any auth-specific spacing or responsive decisions
- hero copy actually chosen in Stitch
- whether any new reusable auth surface pattern emerged that should be mirrored in code

Expected: The transition from Stitch to code is explicit and does not depend on memory.

- [x] **Step 6: Mark the Stitch task ready for implementation**

Before moving to code, verify the designed frames cover the exact scope from the spec and no extra features such as social login, forgot password, or email verification banners have been introduced.

Expected: The phase can move into UI implementation with stable visual references and no hidden scope expansion.

### Execution Notes

- Stitch project: `projects/2050085960228570195` (`Trợ lý Sức khỏe Chang`)
- Stitch update confirmed at: `2026-04-26T08:45:00.855443Z`
- Stitch session: `10648317369230286723`

### Final Screen Inventory

- `Login / Default`
- `Sign Up / Default`

### Stitch Authority Decision

- The approved Stitch source of truth for implementation is now limited to the default `Login` and `Sign Up` screens.
- Additional visual state screens generated earlier in Stitch are not authoritative and should not be used as design references for code.
- `field error`, `submit loading`, and `submit error` should be implemented in code by preserving the default layout and applying state-only changes.

### Pencil Redesign Follow-up

- On `2026-04-27`, auth visuals were refreshed in code against the Pencil redesign artifacts:
  - `docs/superpowers/designs/2026-04-27-auth.pen` → `login-default`, `login-loading`, `login-error`
  - `docs/superpowers/designs/2026-04-27-auth.pen` → `signup-default`, `signup-loading`, `signup-error`
- Stitch remains the historical phase artifact, but the current auth screen hierarchy, copy, and spacing now follow the Pencil frames above.

### Final Hero Copy

- Login eyebrow: `Nhịp sống khỏe mỗi ngày`
- Login title: `Chào mừng bạn quay lại`
- Login description: `Đăng nhập để tiếp tục theo dõi chỉ số và giữ nhịp chăm sóc cơ thể thật nhẹ nhàng.`
- Sign Up eyebrow: `Bắt đầu hành trình bền vững`
- Sign Up title: `Tạo tài khoản mới`
- Sign Up description: `Thiết lập không gian theo dõi sức khỏe riêng để lưu lại những thay đổi nhỏ nhưng quan trọng mỗi ngày.`

### Final Form Copy

- Login fields: `Email`, `Mật khẩu`
- Login CTA: `Đăng nhập`
- Login link: `Chưa có tài khoản? Tạo tài khoản`
- Login loading CTA: `Đang đăng nhập...`
- Login submit error reference: `Email hoặc mật khẩu chưa đúng.`
- Sign Up fields: `Email`, `Mật khẩu`, `Nhập lại mật khẩu`
- Sign Up password rule: `Mật khẩu cần có ít nhất 8 ký tự.`
- Sign Up CTA: `Tạo tài khoản`
- Sign Up link: `Đã có tài khoản? Đăng nhập`
- Sign Up loading CTA: `Đang tạo tài khoản...`
- Sign Up submit error reference: `Email này đã được đăng ký.`

### State Notes For Implementation

- Cả hai màn hình dùng cùng một pattern: hero block nhỏ phía trên, form card bo tròn lớn phía dưới, layout một cột, mobile-first.
- `Sign Up` cao hơn `Login` để chứa trường xác nhận mật khẩu và dòng password rule luôn hiển thị.
- Trạng thái `field error` dùng inline error text ngay dưới field liên quan để tránh đẩy bố cục quá mạnh.
- Trạng thái `submit error` dùng form-level error message gọn phía trên CTA.
- Trạng thái `submit loading` giữ nguyên layout, chỉ khóa CTA và đổi label loading.
- Password visibility toggle phải hiện diện trong mọi trạng thái có trường mật khẩu.

### Reusable UI Pattern To Mirror In Code

- Một auth surface pattern mới đã rõ ràng và nên mirror trong code:
  `AuthLayout` gồm `hero block + rounded auth card + stacked fields + CTA + cross-link`.
- Pattern này nên được dùng chung cho cả `Login` và `Sign Up`, còn copy, field list, password rule, field errors và submit errors nên được truyền từ page-level composition.

### Scope Check

- Đã giữ đúng scope của spec.
- Không thêm social login.
- Không thêm forgot password.
- Không thêm email verification banner.
- Không thêm flow auth ngoài `Login` và `Sign Up`.
