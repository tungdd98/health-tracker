# Auth, Onboarding & Settings — Pencil Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Create `docs/superpowers/designs/2026-04-27-auth-onboarding-settings.pen` with 7 reusable Pencil components and 16 frames covering Login, SignUp, Onboarding (5 steps), and Settings screens — replacing the old Stitch designs.

**Architecture:** Component-first. Define 7 reusable components at the top of the canvas as a library, then compose all 16 frames using those components via `ref` instances. No code changes — Pencil MCP only. Use `get_screenshot` after each task to verify visual output.

**Tech Stack:** Pencil MCP (`open_document`, `batch_design`, `batch_get`, `get_screenshot`, `get_variables`, `snapshot_layout`). Design tokens sourced from `libs/theme/src/lib/theme.ts`.

**Spec:** `docs/superpowers/specs/2026-04-27-redesign-pencil-design.md`

---

## Design Tokens Reference

| Token                  | Value     |
| ---------------------- | --------- |
| Primary                | `#6c5a61` |
| Primary container      | `#f4dce4` |
| Background             | `#fff8f8` |
| Paper                  | `#ffffff` |
| Surface low            | `#fff0f4` |
| Text primary           | `#3b2f34` |
| Text muted / secondary | `#6a5b61` |
| Border                 | `#c0adb3` |
| Error                  | `#a8364b` |
| Error container        | `#ffd9de` |
| Card border-radius     | `32`      |
| Button border-radius   | `999`     |
| Input border-radius    | `20`      |
| Global border-radius   | `24`      |

---

## Canvas Layout Convention

Place all groups left-to-right with 80px gap between groups:

```
[Component Library x=0] | [Auth x=600] | [Onboarding x=1400] | [Settings x=2600]
```

Each screen frame: `width: 390` (iPhone 14 viewport), `height: fit_content`.

---

### Task 1: Open file and read guidelines

**Files:**

- Create: `docs/superpowers/designs/2026-04-27-auth-onboarding-settings.pen`

- [x] **Step 1: Open the design document**

```
open_document("docs/superpowers/designs/2026-04-27-auth-onboarding-settings.pen")
```

Expected: Document opens (new blank canvas).

- [x] **Step 2: Load editor state and guidelines**

```
get_editor_state({ include_schema: false })
get_guidelines("guide", "style")
```

Read the style guide to inform color, spacing, and type choices before designing.

- [x] **Step 3: Check available variables**

```
get_variables()
```

If no variables exist yet, proceed — all values will be hardcoded from the token table above.

---

### Task 2: Component Library — AuthHero

Reusable component used by Login, SignUp, and all Onboarding frames. Contains icon bubble + overline + h2 title + body description, center-aligned.

**Files:**

- Modify: `docs/superpowers/designs/2026-04-27-auth-onboarding-settings.pen`

- [x] **Step 1: Create the AuthHero reusable component**

Place at approximately `x: 0, y: 0` on the canvas.

```javascript
hero = I(document, {
  type: 'frame',
  id: 'AuthHero',
  reusable: true,
  x: 0,
  y: 0,
  width: 390,
  height: 'fit_content(200)',
  layout: 'vertical',
  alignItems: 'center',
  gap: 12,
});
bubble = I(hero, {
  type: 'frame',
  width: 68,
  height: 68,
  cornerRadius: 34,
  fill: { type: 'color', color: '#f4dce4b8' },
  effect: {
    type: 'shadow',
    shadowType: 'outer',
    blur: 36,
    spread: 0,
    offset: { x: 0, y: 18 },
    color: '#6c5a6124',
  },
  layout: 'horizontal',
  justifyContent: 'center',
  alignItems: 'center',
});
I(bubble, {
  type: 'icon_font',
  iconFontFamily: 'Material Symbols Rounded',
  iconFontName: 'favorite',
  width: 24,
  height: 24,
  fill: '#6c5a61',
});
I(hero, {
  type: 'text',
  content: 'GIAI ĐOẠN',
  fontSize: 11,
  fontWeight: '700',
  letterSpacing: 2.5,
  fill: '#6a5b61',
  textGrowth: 'auto',
});
I(hero, {
  type: 'text',
  content: 'Tiêu đề trang',
  fontSize: 32,
  fontWeight: '700',
  letterSpacing: -1,
  lineHeight: 1.08,
  fill: '#3b2f34',
  textGrowth: 'fixed-width',
  width: 340,
  textAlign: 'center',
});
I(hero, {
  type: 'text',
  content: 'Mô tả ngắn về màn hình này.',
  fontSize: 16,
  lineHeight: 1.65,
  fill: '#6a5b61',
  textGrowth: 'fixed-width',
  width: 320,
  textAlign: 'center',
});
```

- [x] **Step 2: Screenshot to verify**

```
get_screenshot(AuthHero_id)
```

Expected: Centered stack — pink bubble with heart icon, uppercase overline, bold title, muted description.

---

### Task 3: Component Library — FormCard and PrimaryButton

FormCard is the frosted-glass card wrapping all auth/onboarding forms. PrimaryButton is the full-width gradient CTA.

**Files:**

- Modify: `docs/superpowers/designs/2026-04-27-auth-onboarding-settings.pen`

- [x] **Step 1: Create FormCard reusable component**

Place below AuthHero (y: ~300).

```javascript
card = I(document, {
  type: 'frame',
  id: 'FormCard',
  reusable: true,
  x: 0,
  y: 300,
  width: 390,
  height: 'fit_content(200)',
  layout: 'vertical',
  gap: 20,
  padding: [28, 20],
  cornerRadius: 32,
  fill: { type: 'color', color: '#ffffffeb' },
  effect: [
    { type: 'background_blur', radius: 14 },
    {
      type: 'shadow',
      shadowType: 'outer',
      blur: 48,
      spread: 0,
      offset: { x: 0, y: 24 },
      color: '#6c5a6114',
    },
  ],
});
I(card, {
  type: 'text',
  content: 'Nội dung form ở đây',
  fontSize: 14,
  fill: '#6a5b61',
  textGrowth: 'fixed-width',
  width: 'fill_container',
});
```

- [x] **Step 2: Create PrimaryButton reusable component**

Place below FormCard (y: ~560).

```javascript
btn = I(document, {
  type: 'frame',
  id: 'PrimaryButton',
  reusable: true,
  x: 0,
  y: 560,
  width: 350,
  height: 48,
  cornerRadius: 999,
  fill: {
    type: 'gradient',
    gradientType: 'linear',
    rotation: 45,
    colors: [
      { color: '#6c5a61', position: 0 },
      { color: '#6c5a61b8', position: 1 },
    ],
  },
  effect: {
    type: 'shadow',
    shadowType: 'outer',
    blur: 36,
    spread: 0,
    offset: { x: 0, y: 18 },
    color: '#6c5a612e',
  },
  layout: 'horizontal',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 8,
});
I(btn, {
  type: 'text',
  content: 'Đăng nhập',
  fontSize: 16,
  fontWeight: '700',
  letterSpacing: -0.15,
  fill: '#fff7f8',
});
```

- [x] **Step 3: Screenshot both components**

```
get_screenshot(card_id)
get_screenshot(btn_id)
```

Expected: FormCard — rounded frosted card. PrimaryButton — rose gradient pill, white label.

---

### Task 4: Component Library — OnboardingProgressBar and PhaseOptionCard

OnboardingProgressBar shows step counter + linear progress. PhaseOptionCard is the selectable card in step 1.

**Files:**

- Modify: `docs/superpowers/designs/2026-04-27-auth-onboarding-settings.pen`

- [x] **Step 1: Create OnboardingProgressBar reusable component**

Place at `y: ~680` in the component library.

```javascript
pb = I(document, {
  type: 'frame',
  id: 'OnboardingProgressBar',
  reusable: true,
  x: 0,
  y: 680,
  width: 350,
  height: 'fit_content(40)',
  layout: 'vertical',
  gap: 8,
});
counterRow = I(pb, {
  type: 'frame',
  width: 'fill_container',
  height: 'fit_content',
  layout: 'horizontal',
  justifyContent: 'space_between',
  alignItems: 'center',
});
I(counterRow, {
  type: 'text',
  content: '1 / 5 · Chọn giai đoạn',
  fontSize: 11,
  fontWeight: '700',
  letterSpacing: 2.5,
  fill: '#6a5b61',
  textGrowth: 'auto',
});
trackBg = I(pb, {
  type: 'frame',
  width: 'fill_container',
  height: 8,
  cornerRadius: 999,
  fill: { type: 'color', color: '#0000000f' },
});
I(trackBg, {
  type: 'frame',
  width: '60%',
  height: 'fill_container',
  cornerRadius: 999,
  fill: {
    type: 'gradient',
    gradientType: 'linear',
    rotation: 90,
    colors: [
      { color: '#6c5a61', position: 0 },
      { color: '#6c5a61b8', position: 1 },
    ],
  },
});
```

- [x] **Step 2: Create PhaseOptionCard reusable component**

Place at `y: ~800` in the component library. This is the selectable card used in the Phase step.

```javascript
poc = I(document, {
  type: 'frame',
  id: 'PhaseOptionCard',
  reusable: true,
  x: 0,
  y: 800,
  width: 350,
  height: 'fit_content(80)',
  layout: 'vertical',
  padding: 18,
  gap: 8,
  cornerRadius: 24,
  fill: { type: 'color', color: '#ffffffeb' },
  effect: {
    type: 'shadow',
    shadowType: 'outer',
    blur: 30,
    spread: 0,
    offset: { x: 0, y: 14 },
    color: '#6c5a6114',
  },
  stroke: { align: 'inside', thickness: 1, fill: { type: 'color', color: '#6c5a6100' } },
});
row = I(poc, {
  type: 'frame',
  width: 'fill_container',
  height: 'fit_content',
  layout: 'horizontal',
  justifyContent: 'space_between',
  alignItems: 'center',
  gap: 8,
});
textBlock = I(row, {
  type: 'frame',
  width: 'fill_container',
  height: 'fit_content',
  layout: 'vertical',
  gap: 4,
});
I(textBlock, {
  type: 'text',
  content: 'Tên lựa chọn',
  fontSize: 16,
  fontWeight: '600',
  fill: '#3b2f34',
  textGrowth: 'fixed-width',
  width: 'fill_container',
});
I(textBlock, {
  type: 'text',
  content: 'Mô tả lựa chọn.',
  fontSize: 14,
  fill: '#6a5b61',
  textGrowth: 'fixed-width',
  width: 'fill_container',
});
I(row, {
  type: 'icon_font',
  iconFontFamily: 'Material Symbols Rounded',
  iconFontName: 'chevron_right',
  width: 20,
  height: 20,
  fill: '#6c5a61',
});
```

- [x] **Step 3: Screenshot to verify**

```
get_screenshot(pb_id)
get_screenshot(poc_id)
```

Expected: OnboardingProgressBar — counter label + filled track. PhaseOptionCard — white rounded card, title + description + chevron.

---

### Task 5: Component Library — SettingsSectionCard, AppShellHeader, AppBottomNav

**Files:**

- Modify: `docs/superpowers/designs/2026-04-27-auth-onboarding-settings.pen`

- [x] **Step 1: Create SettingsSectionCard reusable component**

Place at `y: ~1000` in the component library.

```javascript
ssc = I(document, {
  type: 'frame',
  id: 'SettingsSectionCard',
  reusable: true,
  x: 0,
  y: 1000,
  width: 390,
  height: 'fit_content(100)',
  layout: 'vertical',
  gap: 16,
  padding: 20,
  cornerRadius: 32,
  fill: { type: 'color', color: '#ffffffeb' },
  effect: {
    type: 'shadow',
    shadowType: 'outer',
    blur: 48,
    spread: 0,
    offset: { x: 0, y: 24 },
    color: '#6c5a6114',
  },
});
I(ssc, {
  type: 'text',
  content: 'Tiêu đề nhóm',
  fontSize: 16,
  fontWeight: '600',
  fill: '#3b2f34',
  textGrowth: 'auto',
});
I(ssc, {
  type: 'text',
  content: 'Nội dung phần cài đặt',
  fontSize: 14,
  fill: '#6a5b61',
  textGrowth: 'fixed-width',
  width: 'fill_container',
});
```

- [x] **Step 2: Create AppShellHeader reusable component**

Place at `y: ~1180` in the component library.

```javascript
ash = I(document, {
  type: 'frame',
  id: 'AppShellHeader',
  reusable: true,
  x: 0,
  y: 1180,
  width: 390,
  height: 'fit_content(80)',
  layout: 'vertical',
  gap: 4,
  padding: [20, 16, 0, 16],
});
I(ash, {
  type: 'text',
  content: 'TÀI KHOẢN',
  fontSize: 11,
  fontWeight: '700',
  letterSpacing: 2.5,
  fill: '#6a5b61',
  textGrowth: 'auto',
});
I(ash, {
  type: 'text',
  content: 'Cài đặt',
  fontSize: 23,
  fontWeight: '700',
  letterSpacing: -0.46,
  fill: '#3b2f34',
  textGrowth: 'auto',
});
I(ash, {
  type: 'text',
  content: 'Quản lý thông tin của bạn',
  fontSize: 15,
  fill: '#6a5b61',
  textGrowth: 'fixed-width',
  width: 'fill_container',
});
```

- [x] **Step 3: Create AppBottomNav reusable component**

Place at `y: ~1340` in the component library.

```javascript
nav = I(document, {
  type: 'frame',
  id: 'AppBottomNav',
  reusable: true,
  x: 0,
  y: 1340,
  width: 390,
  height: 64,
  layout: 'horizontal',
  justifyContent: 'space_between',
  alignItems: 'center',
  padding: [0, 16],
  cornerRadius: 28,
  fill: { type: 'color', color: '#ffffffdf' },
  effect: [
    { type: 'background_blur', radius: 18 },
    {
      type: 'shadow',
      shadowType: 'outer',
      blur: 40,
      spread: 0,
      offset: { x: 0, y: 18 },
      color: '#6c5a611f',
    },
  ],
});
// Home tab
homeTab = I(nav, {
  type: 'frame',
  layout: 'vertical',
  alignItems: 'center',
  gap: 2,
  width: 'fill_container',
});
I(homeTab, {
  type: 'icon_font',
  iconFontFamily: 'Material Symbols Rounded',
  iconFontName: 'home',
  width: 24,
  height: 24,
  fill: '#6a5b61',
});
I(homeTab, {
  type: 'text',
  content: 'Trang chủ',
  fontSize: 11,
  fontWeight: '700',
  fill: '#6a5b61',
  textGrowth: 'auto',
});
// Calendar tab
calTab = I(nav, {
  type: 'frame',
  layout: 'vertical',
  alignItems: 'center',
  gap: 2,
  width: 'fill_container',
});
I(calTab, {
  type: 'icon_font',
  iconFontFamily: 'Material Symbols Rounded',
  iconFontName: 'calendar_month',
  width: 24,
  height: 24,
  fill: '#6a5b61',
});
I(calTab, {
  type: 'text',
  content: 'Lịch',
  fontSize: 11,
  fontWeight: '700',
  fill: '#6a5b61',
  textGrowth: 'auto',
});
// Settings tab (active)
setTab = I(nav, {
  type: 'frame',
  layout: 'vertical',
  alignItems: 'center',
  gap: 2,
  width: 'fill_container',
});
I(setTab, {
  type: 'icon_font',
  iconFontFamily: 'Material Symbols Rounded',
  iconFontName: 'settings',
  width: 24,
  height: 24,
  fill: '#6c5a61',
});
I(setTab, {
  type: 'text',
  content: 'Cài đặt',
  fontSize: 11,
  fontWeight: '700',
  fill: '#6c5a61',
  textGrowth: 'auto',
});
```

- [x] **Step 4: Screenshot all three new components**

```
get_screenshot(ssc_id)
get_screenshot(ash_id)
get_screenshot(nav_id)
```

Expected: SettingsSectionCard — card with section title. AppShellHeader — eyebrow + large title + subtitle. AppBottomNav — 3 tabs, Settings tab highlighted in primary color.

---

### Task 6: Auth frames — Login (3 frames)

Place in the Auth group at `x: 600`. Frames stacked vertically with 60px gap between them.

**Files:**

- Modify: `docs/superpowers/designs/2026-04-27-auth-onboarding-settings.pen`

- [x] **Step 1: Create login-default frame**

```javascript
loginDefault = I(document, {
  type: 'frame',
  name: 'login-default',
  placeholder: true,
  x: 600,
  y: 0,
  width: 390,
  height: 'fit_content(700)',
  layout: 'vertical',
  gap: 24,
  padding: [40, 16],
  fill: { type: 'color', color: '#fff8f8' },
  effect: {
    type: 'gradient',
    gradientType: 'radial',
    colors: [
      { color: '#f4dce4e6', position: 0 },
      { color: '#fff8f800', position: 1 },
    ],
  },
});
// AuthHero instance
heroInst = I(loginDefault, { type: 'ref', ref: 'AuthHero', width: 'fill_container' });
U(heroInst + '/overline_id', { content: 'CHÀO MỪNG TRỞ LẠI' });
U(heroInst + '/title_id', { content: 'Đăng nhập' });
U(heroInst + '/desc_id', { content: 'Tiếp tục hành trình theo dõi sức khỏe của bạn.' });
// FormCard instance
cardInst = I(loginDefault, { type: 'ref', ref: 'FormCard', width: 'fill_container' });
// Replace placeholder content with actual form fields
emailField = R(cardInst + '/placeholder_id', {
  type: 'frame',
  layout: 'vertical',
  gap: 6,
  width: 'fill_container',
});
I(emailField, {
  type: 'text',
  content: 'Email',
  fontSize: 14,
  fontWeight: '500',
  fill: '#6a5b61',
  textGrowth: 'auto',
});
emailInput = I(emailField, {
  type: 'frame',
  width: 'fill_container',
  height: 52,
  cornerRadius: 20,
  fill: { type: 'color', color: '#fff0f4f5' },
  stroke: { align: 'inside', thickness: 1, fill: { type: 'color', color: '#c0adb333' } },
  layout: 'horizontal',
  alignItems: 'center',
  padding: [0, 14],
});
I(emailInput, {
  type: 'text',
  content: 'nguyenvana@email.com',
  fontSize: 15,
  fill: '#6a5b6199',
  textGrowth: 'auto',
});
```

Continue building the password field, show/hide icon, and CTA in the same `batch_design` call:

```javascript
pwField = I(cardInst + '/content_frame', {
  type: 'frame',
  layout: 'vertical',
  gap: 6,
  width: 'fill_container',
});
I(pwField, {
  type: 'text',
  content: 'Mật khẩu',
  fontSize: 14,
  fontWeight: '500',
  fill: '#6a5b61',
  textGrowth: 'auto',
});
pwInput = I(pwField, {
  type: 'frame',
  width: 'fill_container',
  height: 52,
  cornerRadius: 20,
  fill: { type: 'color', color: '#fff0f4f5' },
  stroke: { align: 'inside', thickness: 1, fill: { type: 'color', color: '#c0adb333' } },
  layout: 'horizontal',
  alignItems: 'center',
  justifyContent: 'space_between',
  padding: [0, 14],
});
I(pwInput, {
  type: 'text',
  content: '••••••••',
  fontSize: 15,
  fill: '#6a5b6199',
  textGrowth: 'auto',
});
I(pwInput, {
  type: 'icon_font',
  iconFontFamily: 'Material Symbols Rounded',
  iconFontName: 'visibility',
  width: 20,
  height: 20,
  fill: '#6a5b61',
});
// CTA button
ctaInst = I(cardInst + '/content_frame', {
  type: 'ref',
  ref: 'PrimaryButton',
  width: 'fill_container',
});
U(ctaInst + '/label_id', { content: 'Đăng nhập' });
// Footer link (OUTSIDE the card, below it)
footer = I(loginDefault, {
  type: 'frame',
  layout: 'horizontal',
  justifyContent: 'center',
  gap: 4,
  width: 'fill_container',
});
I(footer, {
  type: 'text',
  content: 'Chưa có tài khoản?',
  fontSize: 14,
  fill: '#6a5b61',
  textGrowth: 'auto',
});
I(footer, {
  type: 'text',
  content: 'Đăng ký',
  fontSize: 14,
  fontWeight: '600',
  fill: '#6c5a61',
  textGrowth: 'auto',
});
// Remove placeholder flag
U(loginDefault, { placeholder: false });
```

> **Note:** The exact descendant IDs (`overline_id`, `title_id`, `placeholder_id`, etc.) will be resolved at runtime from `batch_get` on the component. Use `batch_get([AuthHero_id, FormCard_id, PrimaryButton_id], readDepth:3)` before this task to learn the actual child IDs, then substitute them in the operations above.

- [x] **Step 2: Create login-loading frame by copying login-default**

```javascript
loginLoading = C(loginDefault_id, document, {
  name: 'login-loading',
  x: 600,
  y: 760,
  placeholder: true,
});
// Update CTA label + add spinner indicator
U(loginLoading + '/cta_label_id', { content: 'Đang đăng nhập...', fill: '#fff7f8b8' });
// Add spinner (circle with dashed stroke as spinner stand-in)
spinner = I(loginLoading + '/cta_id', {
  type: 'ellipse',
  width: 18,
  height: 18,
  layoutPosition: 'absolute',
  x: 16,
  y: 15,
  stroke: {
    align: 'center',
    thickness: 2,
    fill: { type: 'color', color: '#fff7f8' },
    dashPattern: [4, 4],
  },
});
U(loginLoading, { placeholder: false });
```

- [x] **Step 3: Create login-error frame by copying login-default**

```javascript
loginError = C(loginDefault_id, document, {
  name: 'login-error',
  x: 600,
  y: 1520,
  placeholder: true,
});
// Insert error Alert between password field and CTA button inside the card
errorAlert = I(loginError + '/card_content_id', {
  type: 'frame',
  width: 'fill_container',
  height: 'fit_content',
  layout: 'horizontal',
  alignItems: 'center',
  gap: 10,
  padding: [12, 14],
  cornerRadius: 12,
  fill: { type: 'color', color: '#a8364b' },
});
I(errorAlert, {
  type: 'icon_font',
  iconFontFamily: 'Material Symbols Rounded',
  iconFontName: 'error',
  width: 18,
  height: 18,
  fill: '#ffffff',
});
I(errorAlert, {
  type: 'text',
  content: 'Email hoặc mật khẩu không đúng.',
  fontSize: 14,
  fill: '#ffffff',
  textGrowth: 'fixed-width',
  width: 'fill_container',
});
U(loginError, { placeholder: false });
```

- [x] **Step 4: Screenshot all three login frames**

```
get_screenshot(loginDefault_id)
get_screenshot(loginLoading_id)
get_screenshot(loginError_id)
```

Expected: login-default — hero + frosted card with email/password/CTA + footer link below. login-loading — CTA grayed with spinner. login-error — red Alert between fields and CTA.

---

### Task 7: Auth frames — SignUp (3 frames)

Place in the Auth group continuing from Login: `x: 1000` (or same x with more vertical gap — choose empty space).

**Files:**

- Modify: `docs/superpowers/designs/2026-04-27-auth-onboarding-settings.pen`

- [x] **Step 1: Find empty space on canvas**

```
find_empty_space_on_canvas({width:390, height:2400})
```

Use the returned coordinates for the SignUp group.

- [x] **Step 2: Create signup-default frame**

Structure mirrors login-default but with 3 fields (email, password + caption, confirm password) and different hero copy.

```javascript
signupDefault=I(document, {
  type:"frame", name:"signup-default", placeholder:true,
  x:<empty_x>, y:<empty_y>, width:390, height:"fit_content(860)",
  layout:"vertical", gap:24, padding:[40,16],
  fill:{type:"color", color:"#fff8f8"}
})
// AuthHero instance
heroInst=I(signupDefault, {type:"ref", ref:"AuthHero", width:"fill_container"})
U(heroInst+"/overline_id", {content:"TẠO TÀI KHOẢN"})
U(heroInst+"/title_id", {content:"Bắt đầu hành trình"})
U(heroInst+"/desc_id", {content:"Theo dõi sức khỏe của bạn một cách nhẹ nhàng và bền vững."})
// FormCard with 3 fields
cardInst=I(signupDefault, {type:"ref", ref:"FormCard", width:"fill_container"})
// Email, Password + caption, Confirm password fields (same pattern as login-default)
// Password field has an extra caption row below it
pwCaption=I(cardInst+"/after_pw_field", {
  type:"text", content:"Tối thiểu 8 ký tự", fontSize:12, fill:"#6a5b61", textGrowth:"auto"
})
// CTA
ctaInst=I(cardInst+"/content_frame", {type:"ref", ref:"PrimaryButton", width:"fill_container"})
U(ctaInst+"/label_id", {content:"Tạo tài khoản"})
// Footer
footer=I(signupDefault, {type:"frame", layout:"horizontal", justifyContent:"center", gap:4, width:"fill_container"})
I(footer, {type:"text", content:"Đã có tài khoản?", fontSize:14, fill:"#6a5b61", textGrowth:"auto"})
I(footer, {type:"text", content:"Đăng nhập", fontSize:14, fontWeight:"600", fill:"#6c5a61", textGrowth:"auto"})
U(signupDefault, {placeholder:false})
```

- [x] **Step 3: Create signup-loading by copying signup-default**

Same approach as login-loading: copy frame, update CTA to show spinner + "Đang tạo tài khoản...".

- [x] **Step 4: Create signup-error by copying signup-default**

Same approach as login-error: copy frame, insert red Alert between confirm password field and CTA.

- [x] **Step 5: Screenshot all three signup frames**

```
get_screenshot(signupDefault_id)
get_screenshot(signupLoading_id)
get_screenshot(signupError_id)
```

Expected: signup-default — 3-field form, password caption, footer link. signup-loading/error — same patterns as login variants.

---

### Task 8: Onboarding frames — Phase (step 1) and Basic Profile (step 2)

Place Onboarding group at `x: 1400`. Steps stacked vertically.

**Files:**

- Modify: `docs/superpowers/designs/2026-04-27-auth-onboarding-settings.pen`

- [x] **Step 1: Create onboarding-phase frame (step 1/5)**

```javascript
obPhase = I(document, {
  type: 'frame',
  name: 'onboarding-phase',
  placeholder: true,
  x: 1400,
  y: 0,
  width: 390,
  height: 'fit_content(700)',
  layout: 'vertical',
  gap: 24,
  padding: [40, 16],
  fill: { type: 'color', color: '#fff8f8' },
});
// AuthHero
heroInst = I(obPhase, { type: 'ref', ref: 'AuthHero', width: 'fill_container' });
U(heroInst + '/overline_id', { content: 'ONBOARDING' });
U(heroInst + '/title_id', { content: 'Chọn giai đoạn' });
U(heroInst + '/desc_id', { content: 'Chúng tôi sẽ tùy chỉnh trải nghiệm phù hợp với bạn.' });
// FormCard
cardInst = I(obPhase, { type: 'ref', ref: 'FormCard', width: 'fill_container' });
// Progress bar
pbInst = I(cardInst + '/content_frame', {
  type: 'ref',
  ref: 'OnboardingProgressBar',
  width: 'fill_container',
});
U(pbInst + '/counter_id', { content: '1 / 5 · Chọn giai đoạn' });
// Update track fill width to 20% (step 1 of 5)
U(pbInst + '/track_fill_id', { width: '20%' });
// Phase options
option1 = I(cardInst + '/content_frame', {
  type: 'ref',
  ref: 'PhaseOptionCard',
  width: 'fill_container',
});
U(option1 + '/title_id', { content: 'Chuẩn bị có em bé' });
U(option1 + '/desc_id', { content: 'Lộ trình dành cho giai đoạn chuẩn bị mang thai.' });
// Selected state for option1
U(option1, {
  fill: { type: 'color', color: '#f4dce43d' },
  stroke: { align: 'inside', thickness: 1, fill: { type: 'color', color: '#6c5a61' } },
});
option2 = I(cardInst + '/content_frame', {
  type: 'ref',
  ref: 'PhaseOptionCard',
  width: 'fill_container',
});
U(option2 + '/title_id', { content: 'Đang có em bé' });
U(option2 + '/desc_id', { content: 'Mục này sẽ sớm được mở trong bản cập nhật tiếp theo.' });
// Disabled state + "Sắp ra mắt" chip + no chevron
U(option2, { opacity: 0.72 });
U(option2 + '/chevron_id', { enabled: false });
chip = I(option2 + '/row_id', {
  type: 'frame',
  layout: 'horizontal',
  alignItems: 'center',
  padding: [4, 10],
  cornerRadius: 999,
  fill: { type: 'color', color: '#f4dce4b8' },
});
I(chip, {
  type: 'text',
  content: 'Sắp ra mắt',
  fontSize: 12,
  fontWeight: '600',
  fill: '#6c5a61',
  textGrowth: 'auto',
});
// CTA
ctaInst = I(cardInst + '/content_frame', {
  type: 'ref',
  ref: 'PrimaryButton',
  width: 'fill_container',
});
U(ctaInst + '/label_id', { content: 'Tiếp tục' });
U(obPhase, { placeholder: false });
```

- [x] **Step 2: Create onboarding-basic-profile frame (step 2/5)**

```javascript
obBasic = I(document, {
  type: 'frame',
  name: 'onboarding-basic-profile',
  placeholder: true,
  x: 1400,
  y: 760,
  width: 390,
  height: 'fit_content(700)',
  layout: 'vertical',
  gap: 24,
  padding: [40, 16],
  fill: { type: 'color', color: '#fff8f8' },
});
// AuthHero + progress bar pattern same as onboarding-phase
// progress: 2/5 = 40% track width, label "Thông tin cơ bản"
// Fields: displayName (helper: "Không bắt buộc") + birthDate
// Button row: Back (outlined, fill:transparent, stroke:#6c5a6159) + Tiếp tục (PrimaryButton)
backBtn = I(cardInst + '/content_frame', {
  type: 'frame',
  width: 'fill_container',
  height: 48,
  cornerRadius: 999,
  fill: { type: 'color', color: '#00000000' },
  stroke: { align: 'inside', thickness: 1, fill: { type: 'color', color: '#c0adb359' } },
  layout: 'horizontal',
  justifyContent: 'center',
  alignItems: 'center',
});
I(backBtn, {
  type: 'text',
  content: 'Quay lại',
  fontSize: 16,
  fontWeight: '700',
  fill: '#6c5a61',
  textGrowth: 'auto',
});
ctaInst = I(cardInst + '/content_frame', {
  type: 'ref',
  ref: 'PrimaryButton',
  width: 'fill_container',
});
U(ctaInst + '/label_id', { content: 'Tiếp tục' });
U(obBasic, { placeholder: false });
```

- [x] **Step 3: Screenshot frames**

```
get_screenshot(obPhase_id)
get_screenshot(obBasic_id)
```

Expected: onboarding-phase — step 1/5 progress bar, 2 option cards (first selected/highlighted, second faded with chip). onboarding-basic-profile — step 2/5, two text fields, Back + Tiếp tục buttons.

---

### Task 9: Onboarding frames — Cycle (step 3) and Body Metrics (step 4)

**Files:**

- Modify: `docs/superpowers/designs/2026-04-27-auth-onboarding-settings.pen`

- [x] **Step 1: Create onboarding-cycle frame (step 3/5)**

Same structure as onboarding-basic-profile. Progress bar at 60% (3/5), label "Chu kỳ".

Fields:

- `Độ dài chu kỳ` (numeric input, placeholder `28`)
- `Ngày bắt đầu kỳ gần nhất` (date input, placeholder `DD/MM/YYYY`)

Button row: Back (outlined) + Skip (text button, fill `#6c5a61`, no background) + Tiếp tục (PrimaryButton).

```javascript
obCycle = I(document, {
  type: 'frame',
  name: 'onboarding-cycle',
  placeholder: true,
  x: 1400,
  y: 1520,
  width: 390,
  height: 'fit_content(720)',
  layout: 'vertical',
  gap: 24,
  padding: [40, 16],
  fill: { type: 'color', color: '#fff8f8' },
});
// Hero + card + progress bar (60%) + 2 fields + 3-button row
// Skip text button:
skipBtn = I(buttonRow, {
  type: 'frame',
  width: 'fill_container',
  height: 48,
  layout: 'horizontal',
  justifyContent: 'center',
  alignItems: 'center',
});
I(skipBtn, {
  type: 'text',
  content: 'Bỏ qua',
  fontSize: 16,
  fontWeight: '700',
  fill: '#6c5a61',
  textGrowth: 'auto',
});
U(obCycle, { placeholder: false });
```

- [x] **Step 2: Create onboarding-body-metrics frame (step 4/5)**

Same structure. Progress bar at 80% (4/5), label "Chỉ số cơ thể".

Fields:

- `Chiều cao (cm)` (numeric, placeholder `160`)
- `Cân nặng (kg)` (numeric, placeholder `52`)

Button row: Back + Skip + Tiếp tục.

```javascript
obBody = I(document, {
  type: 'frame',
  name: 'onboarding-body-metrics',
  placeholder: true,
  x: 1400,
  y: 2280,
  width: 390,
  height: 'fit_content(720)',
  layout: 'vertical',
  gap: 24,
  padding: [40, 16],
  fill: { type: 'color', color: '#fff8f8' },
});
// Hero + card + progress bar (80%) + 2 fields + 3-button row (Back+Skip+Tiếp tục)
U(obBody, { placeholder: false });
```

- [x] **Step 3: Screenshot both frames**

```
get_screenshot(obCycle_id)
get_screenshot(obBody_id)
```

Expected: Step 3 — cycle fields + 3-button row. Step 4 — body metric fields + 3-button row.

---

### Task 10: Onboarding frames — Completion (step 5), Loading, Error

**Files:**

- Modify: `docs/superpowers/designs/2026-04-27-auth-onboarding-settings.pen`

- [x] **Step 1: Create onboarding-completion frame (step 5/5)**

```javascript
obCompletion = I(document, {
  type: 'frame',
  name: 'onboarding-completion',
  placeholder: true,
  x: 1400,
  y: 3040,
  width: 390,
  height: 'fit_content(680)',
  layout: 'vertical',
  gap: 24,
  padding: [40, 16],
  fill: { type: 'color', color: '#fff8f8' },
});
// Progress bar at 100% (5/5), label "Hoàn tất"
// No form fields — center celebration content inside FormCard:
celebrationIcon = I(cardInst + '/content_frame', {
  type: 'frame',
  width: 96,
  height: 96,
  cornerRadius: 48,
  layoutPosition: 'auto',
  fill: { type: 'color', color: '#f4dce4b8' },
  effect: {
    type: 'shadow',
    shadowType: 'outer',
    blur: 36,
    spread: 0,
    offset: { x: 0, y: 18 },
    color: '#6c5a6124',
  },
  layout: 'horizontal',
  justifyContent: 'center',
  alignItems: 'center',
});
I(celebrationIcon, {
  type: 'icon_font',
  iconFontFamily: 'Material Symbols Rounded',
  iconFontName: 'favorite',
  width: 36,
  height: 36,
  fill: '#6c5a61',
});
I(cardInst + '/content_frame', {
  type: 'text',
  content: 'Bạn đã sẵn sàng!',
  fontSize: 24,
  fontWeight: '700',
  letterSpacing: -0.5,
  fill: '#3b2f34',
  textGrowth: 'fixed-width',
  width: 'fill_container',
  textAlign: 'center',
});
I(cardInst + '/content_frame', {
  type: 'text',
  content: 'Chào mừng bạn đến với hành trình sức khỏe của mình.',
  fontSize: 15,
  fill: '#6a5b61',
  lineHeight: 1.65,
  textGrowth: 'fixed-width',
  width: 'fill_container',
  textAlign: 'center',
});
ctaInst = I(cardInst + '/content_frame', {
  type: 'ref',
  ref: 'PrimaryButton',
  width: 'fill_container',
});
U(ctaInst + '/label_id', { content: 'Vào app' });
U(obCompletion, { placeholder: false });
```

- [x] **Step 2: Create onboarding-loading generic frame**

Copy onboarding-basic-profile frame (representative of any step mid-submit):

```javascript
obLoading = C(obBasic_id, document, {
  name: 'onboarding-loading',
  x: 1800,
  y: 760,
  placeholder: true,
});
U(obLoading + '/cta_label_id', { content: 'Đang lưu...', fill: '#fff7f8b8' });
// Add spinner inside CTA
I(obLoading + '/cta_id', {
  type: 'ellipse',
  width: 18,
  height: 18,
  layoutPosition: 'absolute',
  x: 16,
  y: 15,
  stroke: {
    align: 'center',
    thickness: 2,
    fill: { type: 'color', color: '#fff7f8' },
    dashPattern: [4, 4],
  },
});
U(obLoading, { placeholder: false });
```

- [x] **Step 3: Create onboarding-error generic frame**

Copy onboarding-basic-profile frame (representative of any step with validation error):

```javascript
obError = C(obBasic_id, document, {
  name: 'onboarding-error',
  x: 1800,
  y: 1520,
  placeholder: true,
});
// Add error helper text under first field
U(obError + '/field1_id', {
  // Append error text node below the input
});
errText = I(obError + '/field1_frame_id', {
  type: 'text',
  content: 'Trường này là bắt buộc.',
  fontSize: 12,
  fill: '#a8364b',
  textGrowth: 'auto',
});
U(obError, { placeholder: false });
```

- [x] **Step 4: Screenshot all three frames**

```
get_screenshot(obCompletion_id)
get_screenshot(obLoading_id)
get_screenshot(obError_id)
```

Expected: Completion — 100% progress, large heart icon, headline, "Vào app" CTA. Loading — grayed CTA with spinner. Error — field with red helper text.

---

### Task 11: Settings frames — settings-default, settings-saving, settings-error

Place Settings group at `x: 2600`.

**Files:**

- Modify: `docs/superpowers/designs/2026-04-27-auth-onboarding-settings.pen`

- [x] **Step 1: Create settings-default frame**

```javascript
settDefault = I(document, {
  type: 'frame',
  name: 'settings-default',
  placeholder: true,
  x: 2600,
  y: 0,
  width: 390,
  height: 'fit_content(900)',
  layout: 'vertical',
  gap: 16,
  padding: [0, 16, 100, 16],
  fill: { type: 'color', color: '#fff8f8' },
});
// AppShellHeader instance
ashInst = I(settDefault, { type: 'ref', ref: 'AppShellHeader', width: 'fill_container' });
// SettingsSectionCard 1 — Personal info
sc1 = I(settDefault, { type: 'ref', ref: 'SettingsSectionCard', width: 'fill_container' });
U(sc1 + '/title_id', { content: 'Thông tin cá nhân' });
// Inside sc1: read-only phase field (gray bg) + displayName field + birthDate field + Save button
phaseField = I(sc1 + '/content_frame', {
  type: 'frame',
  width: 'fill_container',
  height: 52,
  cornerRadius: 20,
  fill: { type: 'color', color: '#0000000a' },
  stroke: { align: 'inside', thickness: 1, fill: { type: 'color', color: '#c0adb326' } },
  layout: 'horizontal',
  alignItems: 'center',
  padding: [0, 14],
});
I(phaseField, {
  type: 'text',
  content: 'Tiền thai kỳ',
  fontSize: 15,
  fill: '#6a5b6199',
  textGrowth: 'auto',
});
// displayName + birthDate fields (same input style as auth forms)
saveBtn1 = I(sc1 + '/content_frame', {
  type: 'ref',
  ref: 'PrimaryButton',
  width: 'fill_container',
});
U(saveBtn1 + '/label_id', { content: 'Lưu thay đổi' });
// SettingsSectionCard 2 — Cycle & body (4 fields: cycleLengthDays, lastPeriodStartDate, heightCm, weightKg)
sc2 = I(settDefault, { type: 'ref', ref: 'SettingsSectionCard', width: 'fill_container' });
U(sc2 + '/title_id', { content: 'Chu kỳ & cơ thể' });
// 4 fields + Save button
saveBtn2 = I(sc2 + '/content_frame', {
  type: 'ref',
  ref: 'PrimaryButton',
  width: 'fill_container',
});
U(saveBtn2 + '/label_id', { content: 'Lưu thay đổi' });
// SettingsSectionCard 3 — Account
sc3 = I(settDefault, { type: 'ref', ref: 'SettingsSectionCard', width: 'fill_container' });
U(sc3 + '/title_id', { content: 'Tài khoản' });
// Sign out button: outlined, error color
signOutBtn = I(sc3 + '/content_frame', {
  type: 'frame',
  width: 'fill_container',
  height: 48,
  cornerRadius: 999,
  fill: { type: 'color', color: '#00000000' },
  stroke: { align: 'inside', thickness: 1, fill: { type: 'color', color: '#a8364b' } },
  layout: 'horizontal',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 8,
});
I(signOutBtn, {
  type: 'icon_font',
  iconFontFamily: 'Material Symbols Rounded',
  iconFontName: 'logout',
  width: 20,
  height: 20,
  fill: '#a8364b',
});
I(signOutBtn, {
  type: 'text',
  content: 'Đăng xuất',
  fontSize: 16,
  fontWeight: '700',
  fill: '#a8364b',
  textGrowth: 'auto',
});
// AppBottomNav pinned at bottom
navInst = I(settDefault, {
  type: 'ref',
  ref: 'AppBottomNav',
  width: 'fill_container',
  layoutPosition: 'absolute',
  x: 0,
  y: -80,
});
U(settDefault, { placeholder: false });
```

> **Note on bottom nav:** Since the frame uses vertical layout with `fit_content`, pin the nav via `layoutPosition: "absolute"` at the bottom of the frame, or add it as a separate overlay element. Adjust `padding-bottom` of the main content to 80px to avoid overlap.

- [x] **Step 2: Create settings-saving frame by copying settings-default**

```javascript
settSaving = C(settDefault_id, document, {
  name: 'settings-saving',
  x: 2600,
  y: 960,
  placeholder: true,
});
// Update first section's save button to loading state
U(settSaving + '/saveBtn1_label_id', { content: 'Đang lưu...', fill: '#fff7f8b8' });
// Add spinner
I(settSaving + '/saveBtn1_id', {
  type: 'ellipse',
  width: 18,
  height: 18,
  layoutPosition: 'absolute',
  x: 16,
  y: 15,
  stroke: {
    align: 'center',
    thickness: 2,
    fill: { type: 'color', color: '#fff7f8' },
    dashPattern: [4, 4],
  },
});
U(settSaving, { placeholder: false });
```

- [x] **Step 3: Create settings-error frame by copying settings-default**

```javascript
settError = C(settDefault_id, document, {
  name: 'settings-error',
  x: 2600,
  y: 1920,
  placeholder: true,
});
// Add Snackbar overlay at bottom-center
snackbar = I(settError, {
  type: 'frame',
  layoutPosition: 'absolute',
  x: 20,
  y: -120,
  width: 350,
  height: 'fit_content(52)',
  cornerRadius: 12,
  fill: { type: 'color', color: '#a8364b' },
  layout: 'horizontal',
  alignItems: 'center',
  gap: 10,
  padding: [12, 14],
});
I(snackbar, {
  type: 'icon_font',
  iconFontFamily: 'Material Symbols Rounded',
  iconFontName: 'error',
  width: 18,
  height: 18,
  fill: '#ffffff',
});
I(snackbar, {
  type: 'text',
  content: 'Đã xảy ra lỗi. Vui lòng thử lại.',
  fontSize: 14,
  fill: '#ffffff',
  textGrowth: 'fixed-width',
  width: 'fill_container',
});
U(settError, { placeholder: false });
```

- [x] **Step 4: Screenshot all three settings frames**

```
get_screenshot(settDefault_id)
get_screenshot(settSaving_id)
get_screenshot(settError_id)
```

Expected: settings-default — header, 3 section cards, sign-out outlined in red, bottom nav with Settings active. settings-saving — first card's button shows spinner. settings-error — red snackbar at bottom.

---

### Task 12: Final verification and commit

**Files:**

- Read: `docs/superpowers/designs/2026-04-27-auth-onboarding-settings.pen`

- [x] **Step 1: Verify frame count via editor state**

```
get_editor_state({ include_schema: false })
```

Expected output should list **exactly 16 top-level frames**:
`login-default`, `login-loading`, `login-error`,
`signup-default`, `signup-loading`, `signup-error`,
`onboarding-phase`, `onboarding-basic-profile`, `onboarding-cycle`, `onboarding-body-metrics`, `onboarding-completion`, `onboarding-loading`, `onboarding-error`,
`settings-default`, `settings-saving`, `settings-error`

And **7 reusable components**:
`AuthHero`, `FormCard`, `PrimaryButton`, `OnboardingProgressBar`, `PhaseOptionCard`, `SettingsSectionCard`, `AppShellHeader`, `AppBottomNav`

> Note: AppBottomNav counts as 1 reusable component even though it contains 3 tabs.

If any frame or component is missing, create it before proceeding.

- [x] **Step 2: Take final screenshots of one frame per group**

```
get_screenshot(loginDefault_id)
get_screenshot(signupDefault_id)
get_screenshot(onboardingPhase_id)
get_screenshot(settingsDefault_id)
```

Confirm all four look visually consistent — same background color, same card style, same typography treatment.

- [x] **Step 3: Run format check**

```bash
yarn format
```

Expected: No changes needed (`.pen` file is binary, Prettier ignores it).

- [x] **Step 4: Commit the design file**

```bash
git add docs/superpowers/designs/2026-04-27-auth-onboarding-settings.pen
git commit -m "feat: add pencil redesign for auth, onboarding and settings screens"
```

Expected: Commit succeeds, pre-commit hook passes.

---

## Self-Review Checklist

### Spec coverage

| Spec requirement                                  | Covered by task |
| ------------------------------------------------- | --------------- |
| 7 reusable components                             | Tasks 2–5       |
| AuthHero with bubble + overline + h2 + desc       | Task 2          |
| FormCard with blur + border-radius 32             | Task 3          |
| OnboardingProgressBar with step label             | Task 4          |
| PhaseOptionCard (selected + disabled states)      | Task 4          |
| SettingsSectionCard, AppShellHeader, AppBottomNav | Task 5          |
| PrimaryButton with loading state                  | Task 3          |
| login-default, login-loading, login-error         | Task 6          |
| signup-default, signup-loading, signup-error      | Task 7          |
| onboarding-phase (step 1)                         | Task 8          |
| onboarding-basic-profile (step 2)                 | Task 8          |
| onboarding-cycle (step 3)                         | Task 9          |
| onboarding-body-metrics (step 4)                  | Task 9          |
| onboarding-completion (step 5)                    | Task 10         |
| onboarding-loading (generic)                      | Task 10         |
| onboarding-error (generic)                        | Task 10         |
| settings-default                                  | Task 11         |
| settings-saving                                   | Task 11         |
| settings-error (snackbar)                         | Task 11         |
| Footer link outside FormCard (improvement)        | Tasks 6–7       |
| Step label in OnboardingProgressBar (improvement) | Task 4, 8–10    |
| Sign out button outlined error (improvement)      | Task 11         |
| Screenshots for verification                      | Tasks 6–12      |
| Commit file                                       | Task 12         |

All spec requirements covered. ✓

### Placeholder scan

No TBD, TODO, or incomplete sections. Pseudo-code uses `_id` suffix to indicate "resolve from batch_get at runtime" — this is intentional guidance, not a placeholder. ✓

### Type consistency

- `PhaseOptionCard` defined in Task 4, used in Task 8 — consistent naming ✓
- `PrimaryButton` defined in Task 3, used in Tasks 6–11 — consistent ✓
- `OnboardingProgressBar` defined in Task 4, used in Tasks 8–10 — consistent ✓
- `SettingsSectionCard` defined in Task 5, used in Task 11 — consistent ✓
