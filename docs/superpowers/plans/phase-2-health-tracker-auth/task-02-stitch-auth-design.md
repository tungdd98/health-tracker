### Task 02: Design the auth screens and states in Stitch

**Files:**

- Reference: `docs/superpowers/specs/2026-04-26-auth-design.md`
- Modify: the Stitch project for Health Tracker auth screens and auth-related component states

- [ ] **Step 1: Re-read the approved auth spec before touching Stitch**

Review:

- `docs/superpowers/specs/2026-04-26-auth-design.md`

Focus on:

- the warm mobile-first visual direction
- the required `Login` and `Sign Up` layouts
- the required states and auth-specific patterns

Expected: The Stitch work stays aligned with the approved scope and does not drift into extra auth features.

- [ ] **Step 2: Design the `Login` frame in Stitch**

Create or update a dedicated `Login` frame that includes:

- auth hero block with eyebrow, title, and short description
- email field
- password field with visibility toggle
- primary submit CTA
- cross-link to `Sign Up`

Use the existing soft rose design system and keep the layout compact, single-column, and mobile-first.

Expected: The `Login` screen has a clear production-ready visual source of truth before code implementation.

- [ ] **Step 3: Design the `Sign Up` frame in Stitch**

Create or update a dedicated `Sign Up` frame that includes:

- auth hero block with sign-up-specific copy
- email field
- password field with visibility toggle
- confirm password field
- visible password rule text for the minimum `8` character requirement
- primary submit CTA
- cross-link to `Login`

Expected: The `Sign Up` screen is visually complete and clearly distinct in purpose while staying consistent with `Login`.

- [ ] **Step 4: Add the required auth states in Stitch**

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

- [ ] **Step 5: Capture implementation notes from Stitch**

Document the final implementation-facing notes in the task execution log or handoff notes, including:

- any auth-specific spacing or responsive decisions
- hero copy actually chosen in Stitch
- whether any new reusable auth surface pattern emerged that should be mirrored in code

Expected: The transition from Stitch to code is explicit and does not depend on memory.

- [ ] **Step 6: Mark the Stitch task ready for implementation**

Before moving to code, verify the designed frames cover the exact scope from the spec and no extra features such as social login, forgot password, or email verification banners have been introduced.

Expected: The phase can move into UI implementation with stable visual references and no hidden scope expansion.
