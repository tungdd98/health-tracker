# MUI Typography Variant Migration Design

- Date: 2026-05-02
- Scope: `health-tracker` monorepo (apps + libs)
- Status: Approved

## 1) Goal

Remove custom typography token usage and standardize text rendering on default MUI `Typography` variants already defined in `libs/theme/src/lib/theme.ts`.

## 2) Requirements

1. Remove `AppTypographyTokens` from `libs/theme/src/lib/theme.ts`.
2. Remove `appTokens.typography` from theme typing and runtime theme object.
3. Replace all `theme.appTokens.typography.*` usage across repo with MUI `Typography` `variant`.
4. Do not hardcode typography properties (`fontSize`, `lineHeight`, `fontWeight`, `letterSpacing`, `textTransform`) in replacement code.
5. `sx` remains allowed for non-typography styling only (layout, spacing, color, borders, positioning).

## 3) Non-goals

1. No visual parity guarantee at pixel-perfect level.
2. No redesign of spacing/layout beyond what is needed to preserve readability.
3. No change to theme palette, radius, shadow, or breakpoints.

## 4) Variant Mapping Strategy

Replace token intent with semantic MUI variants:

1. `eyebrow` -> `overline`
2. `microLabel` -> `overline`
3. `sectionLabel` -> `subtitle2`
4. `sectionValue` -> `subtitle2` or `subtitle1` based on emphasis in current context
5. `helper` -> `caption`
6. `metricValue` -> `h5`
7. `titleMd` -> `h5`

Selection rule when ambiguous:

1. If text is supporting/metadata: `caption` or `overline`
2. If text is label/value in item rows: `subtitle2`
3. If text is prominent numeric/key value: `h5`
4. If text is section/mini-title: `h5` (or `subtitle1` when less prominent)

## 5) Architecture Impact

### Theme layer

File: `libs/theme/src/lib/theme.ts`

1. Delete `AppTypographyTokens` type.
2. Delete `typography` field from `Theme.appTokens` and `ThemeOptions.appTokens` augmentation.
3. Delete `appTokens.typography` runtime object.
4. Keep existing `theme.typography` variants as single typography source.

### Component layer

Files in `apps/health-tracker-web/src/app/**` and `libs/**` currently using `theme.appTokens.typography.*`.

1. Migrate each `Typography` usage to explicit `variant`.
2. Remove typography style spreads from `sx`.
3. For non-`Typography` components inheriting typography styles in `sx`, use MUI typography system value via non-hardcoded variant reference approach only if available through component API; otherwise move text into `Typography` child.

## 6) Data Flow and Behavior

No business logic/data flow changes. This is presentation-layer typography normalization only.

## 7) Error Handling and Risk

### Risks

1. Some headings/labels may appear slightly larger/smaller after migration.
2. Components that previously depended on token style spreads may lose intended emphasis.

### Mitigation

1. Use consistent mapping rules above.
2. Verify key screens manually after lint/build:
   - Auth (`/login`, `/signup`)
   - Dashboard cards and bottom sheets
   - Calendar day detail sheet
   - Chat screens and session history drawer
   - Medication list/form
   - Shared shell components (`AppHeader`, `AppBottomNav`)

## 8) Testing and Verification

Run repo quality gate in order:

1. `yarn format`
2. `yarn lint`
3. `yarn build`

Acceptance criteria:

1. No `AppTypographyTokens` type remains.
2. No `appTokens.typography` remains in theme typing/object.
3. No `theme.appTokens.typography` usage remains in repo.
4. Lint/build pass.

## 9) Implementation Boundaries

1. Keep changes focused on typography migration.
2. Avoid unrelated refactors.
3. Do not introduce new custom typography token systems.

## 10) Rollout

Single-phase migration in one branch/PR because scope is cohesive and cross-cutting.
