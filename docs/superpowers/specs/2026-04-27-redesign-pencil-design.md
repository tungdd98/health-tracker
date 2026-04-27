# Redesign Auth, Onboarding & Settings — Pencil

- Date: 2026-04-27
- Project: Health Tracker
- Phase: Pencil redesign (replaces Stitch for all pre-dashboard screens)
- Primary app: `health-tracker-web`

## Goal

Recreate the Login, SignUp, Onboarding, and Settings screens as a Pencil design system, replacing the previous Stitch designs. The Stitch designs suffered from visual inconsistency, component/code mismatch, and no reusable component structure. This redesign uses a component-first approach in Pencil to establish a consistent visual source of truth aligned with the live MUI theme.

## Design File

`docs/superpowers/designs/2026-04-27-auth-onboarding-settings.pen`

## Design Tokens (from `libs/theme/src/lib/theme.ts`)

| Token                | Value             |
| -------------------- | ----------------- |
| Primary              | `#6c5a61`         |
| Primary container    | `#f4dce4`         |
| Secondary            | `#566259`         |
| Background           | `#fff8f8`         |
| Paper                | `#ffffff`         |
| Surface low          | `#fff0f4`         |
| Text primary         | `#3b2f34`         |
| Text muted           | `#6a5b61`         |
| Border               | `#c0adb3`         |
| Error                | `#a8364b`         |
| Font                 | Plus Jakarta Sans |
| Global border radius | 24px              |
| Button border radius | 999px             |
| Card border radius   | 32px              |
| Input border radius  | 20px              |

## Reusable Components

All components are placed as a separate library section at the top of the canvas.

### AuthHero

Icon bubble (68×68, `borderRadius: 50%`, `backgroundColor: alpha(#f4dce4, 0.72)`, `boxShadow: 0 18px 36px alpha(#6c5a61, 0.14)`) containing a heart icon, followed by overline text, h2 title (max-width 360), and body description (max-width 420). Center-aligned.

### FormCard

AppCard wrapper: `borderRadius: 32px`, `backgroundColor: rgba(255,255,255,0.92)`, `backdropFilter: blur(14px)`, `padding: 28px` (mobile) / `padding: 40px` (tablet). Children use `gap: 20px` vertical stack.

### OnboardingProgressBar

Step counter label (`overline` variant, `color: text.secondary`) left-aligned, `gap: 8px` below, LinearProgress bar (`height: 8px`, `borderRadius: 999px`, `backgroundColor: rgba(0,0,0,0.06)`).

### SettingsSectionCard

Card with section title using `subtitle1` typography (fontWeight 600, 1rem), `padding: 20px`, `gap: 16px` vertical stack for children.

### AppShellHeader

Eyebrow (`overline`, `color: text.secondary`) + large title (`h3`) + subtitle (`body2`, `color: text.secondary`). `padding: 20px 16px 0`.

### AppBottomNav

Fixed bottom bar: `borderRadius: 28px`, `backgroundColor: rgba(255,255,255,0.88)`, `backdropFilter: blur(18px)`, `boxShadow: 0 18px 40px alpha(#6c5a61, 0.12)`. Three tabs: Home, Calendar, Settings. Active tab: `color: #6c5a61`, inactive: `color: #6a5b61`.

### PrimaryButton

Contained button: `borderRadius: 999px`, `minHeight: 48px`, `paddingInline: 20px`, gradient `linear-gradient(135deg, #6c5a61 0%, rgba(108,90,97,0.72) 100%)`. Loading state: spinner 18px `color="inherit"` + label text change.

## Frame Inventory

### Canvas Layout

Groups arranged left-to-right: **Components Library** | **Auth** | **Onboarding** | **Settings**

### Auth — Login (3 frames)

**`login-default`**

- AuthHero (eyebrow: "Chào mừng trở lại", title: "Đăng nhập", description: health rhythm copy)
- FormCard: email field → password field + show/hide toggle → PrimaryButton "Đăng nhập"
- Footer link below card: "Chưa có tài khoản? Đăng ký" (body2, center)

**`login-loading`**

- Identical to default; PrimaryButton disabled with spinner + "Đang đăng nhập..."

**`login-error`**

- Identical to default; Alert `variant="filled"` `color="error"` inserted between password field and CTA

### Auth — SignUp (3 frames)

**`signup-default`**

- AuthHero (eyebrow: "Tạo tài khoản", title: "Bắt đầu hành trình", description: gentle tracking journey copy)
- FormCard: email field → password field + show/hide + caption "Tối thiểu 8 ký tự" → confirm password + show/hide → PrimaryButton "Tạo tài khoản"
- Footer link below card: "Đã có tài khoản? Đăng nhập"

**`signup-loading`**

- PrimaryButton disabled with spinner + "Đang tạo tài khoản..."

**`signup-error`**

- Alert filled error between confirm password and CTA

### Onboarding (7 frames)

All onboarding frames share: AuthHero (heart icon + overline "Onboarding" + step title), OnboardingProgressBar, FormCard.

**`onboarding-phase`** — Step 1/5

- OnboardingProgressBar (1/5, label: "Chọn giai đoạn")
- 2 PhaseOptionCard: "Chuẩn bị có em bé" (selectable) + "Đang có em bé" (disabled, Chip "Sắp ra mắt")
- PrimaryButton "Tiếp tục"

**`onboarding-basic-profile`** — Step 2/5

- OnboardingProgressBar (2/5, label: "Thông tin cơ bản")
- displayName field (helper: "Không bắt buộc") + birthDate field
- Row: Back button (outlined) + PrimaryButton "Tiếp tục"

**`onboarding-cycle`** — Step 3/5

- OnboardingProgressBar (3/5, label: "Chu kỳ")
- cycleLengthDays field + lastPeriodStartDate field
- Row: Back (outlined) + Skip (text) + PrimaryButton "Tiếp tục"

**`onboarding-body-metrics`** — Step 4/5

- OnboardingProgressBar (4/5, label: "Chỉ số cơ thể")
- heightCm field + weightKg field
- Row: Back (outlined) + Skip (text) + PrimaryButton "Tiếp tục"

**`onboarding-completion`** — Step 5/5

- OnboardingProgressBar (5/5, label: "Hoàn tất")
- Heart icon large (96×96) + headline "Bạn đã sẵn sàng!" + description
- PrimaryButton "Vào app"

**`onboarding-loading`** — Generic loading state

- Representative of any step mid-submit: PrimaryButton disabled + spinner

**`onboarding-error`** — Generic validation error

- Representative of any step with field error: error helper text below field

### Settings (3 frames)

**`settings-default`**

- AppShellHeader (eyebrow: "Tài khoản", title: "Cài đặt", subtitle: "Quản lý thông tin của bạn")
- SettingsSectionCard "Thông tin cá nhân": read-only phase field + displayName + birthDate + PrimaryButton "Lưu thay đổi"
- SettingsSectionCard "Chu kỳ & cơ thể": cycleLengthDays + lastPeriodStartDate + heightCm + weightKg + PrimaryButton "Lưu thay đổi"
- SettingsSectionCard "Tài khoản": Sign out button `variant="outlined" color="error"`
- AppBottomNav (active: Settings)

**`settings-saving`**

- Identical to default; one section card's PrimaryButton shows spinner + "Đang lưu..."

**`settings-error`**

- Snackbar at `bottom-center`: Alert `variant="filled"` `color="error"` with error message overlay

## Improvements vs Current Code

### Auth

| Point                | Current                                  | Pencil direction                             |
| -------------------- | ---------------------------------------- | -------------------------------------------- |
| Footer link position | Inside FormCard (same `<Stack>` as form) | Outside / below FormCard — clearer hierarchy |
| Field gap            | Implicit from Stack spacing              | Explicit `gap: 20px` in FormCard             |

### Onboarding

| Point               | Current                                   | Pencil direction                                            |
| ------------------- | ----------------------------------------- | ----------------------------------------------------------- |
| Button row layout   | `direction={{ xs: 'column', sm: 'row' }}` | Mobile-first column layout shown; responsive note annotated |
| Progress step label | No step label, only `n / total` counter   | Add step label text next to counter (e.g. "Chọn giai đoạn") |

### Settings

| Point                    | Current                             | Pencil direction                                                   |
| ------------------------ | ----------------------------------- | ------------------------------------------------------------------ |
| Section title typography | Unspecified                         | `subtitle1` (fontWeight 600, 1rem)                                 |
| Sign out button          | `variant="contained" color="error"` | `variant="outlined" color="error"` — less alarming, review in code |
| Error snackbar           | Not documented anywhere             | Documented in `settings-error` frame                               |

## Frame Naming Convention

All frame names use kebab-case prefixed by screen group: `login-*`, `signup-*`, `onboarding-*`, `settings-*`. Implementation plan tasks must reference `docs/superpowers/designs/2026-04-27-auth-onboarding-settings.pen` + frame name instead of describing visuals in prose.

## Scope

Included:

- All 16 frames listed above
- Component library section on canvas
- Improvement annotations where noted

Excluded:

- Desktop-specific layout variants
- Social login, forgot password, email verification flows
- Dark mode variants

## Success Criteria

The redesign is complete when:

- All 16 frames exist in the `.pen` file
- Reusable components are defined and used consistently across all screens
- Design tokens from `theme.ts` are applied — no hardcoded colors or fonts that diverge from the theme
- Loading and error states are represented for every screen group
- Improvements table items are reflected in the Pencil frames
- The file is committed under `docs/superpowers/designs/`
