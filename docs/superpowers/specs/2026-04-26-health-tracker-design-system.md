# Health Tracker Design System

- Date: 2026-04-26
- Project: Health Tracker
- Source of truth: Stitch project `Trợ lý Sức khỏe Chang`
- Scope: mobile-first design system for the app UI foundations

## Goal

Create a reusable design system for the Health Tracker app that matches the approved Stitch direction while making it usable as a production foundation in the codebase. The system should feel calm, soft, and health-oriented, but still be practical enough to support real app screens and form-heavy flows.

## Design Principles

- Mobile-first: design and component decisions should prioritize small screens first.
- Typography-first: use `Plus Jakarta Sans` for all text styles, including headings, labels, helper text, and navigation.
- Soft surfaces: keep the gentle tonal layering and rounded shapes from Stitch.
- Low-friction forms: inputs must be easy to scan, tap, and validate on mobile.
- One system, many screens: components should be reusable across tracking, entry, and settings flows without redesigning each screen.

## Visual Direction

The visual direction should stay close to the Stitch mockup:

- Keep the soft rose / blush palette and tonal surface layers.
- Preserve the calm, editorial feeling rather than a clinical dashboard look.
- Avoid hard dividers and dense table-like layouts.
- Use generous spacing and rounded corners instead of heavy borders.
- Keep motion subtle and supportive, not attention-seeking.

## Core Tokens

### Typography

- Font family: `Plus Jakarta Sans` everywhere.
- Heading styles: clear size contrast for page titles and section headings.
- Body styles: readable on mobile with comfortable line height.
- Labels and helper text: smaller, but still legible without shrinking into secondary noise.

### Color

The system should retain the current Stitch palette direction:

- Primary: muted rose / mauve
- Secondary: soft green-gray
- Surface background: warm off-white blush
- Surface layers: progressively tinted containers for hierarchy
- Error: muted red with enough contrast for validation and destructive states

### Shape

- Global rounded corners should remain prominent.
- Cards, sheets, buttons, inputs, and chips should feel soft rather than sharp.
- Bottom navigation and top app surfaces should also use rounded treatment where appropriate.

### Spacing

- Use spacious vertical rhythm.
- Keep consistent gaps between field groups, cards, and sections.
- Avoid cramped form stacks or tight icon/text pairs.

## Component Inventory

The design system must define these base components in Stitch and treat them as reusable patterns for the app:

### Navigation

- `App Bar`
  - Page title
  - Optional leading/back action
  - Optional trailing actions
- `Bottom Nav`
  - Mobile primary navigation
  - Sticky bottom positioning
  - Active and inactive states

### Action

- `Button`
  - Primary
  - Secondary
  - Ghost / subtle
  - Destructive
  - Loading state
- `Icon Button`
  - Default
  - Selected
  - Disabled

### Surface

- `Card`
  - Summary card
  - Elevated card
  - Clickable card
- `Chip`
  - Status chip
  - Filter chip
  - Selectable chip
- `List Item`
  - Leading icon/avatar
  - Title
  - Subtitle
  - Trailing action or value

### Form

- `Input`
  - Text
  - Password
  - Search
  - Disabled
  - Error
- `Select`
  - Default option list
  - Placeholder
  - Disabled
  - Error
- `Textarea`
  - Notes and longer text input
- `Slider`
  - Numeric range selection
  - Value label
  - Disabled
  - Error or warning context if needed
- `Radio`
  - Single-choice group
  - Selected / unselected / disabled states
- `Checkbox`
  - Single and multi-select states
  - Checked / indeterminate / disabled
- `Switch`
  - Quick on/off settings
- `Segmented Control`
  - Compact choice switching on mobile
  - Selected / unselected / disabled
- `Stepper`
  - Multi-step form progress
  - Current / completed / upcoming steps
- `Date Picker`
  - Calendar entry flow optimized for mobile
  - Selected date, placeholder, and disabled states

### Feedback

- `Empty State`
  - Icon or illustration
  - Title
  - Description
  - CTA
- `Loading State`
  - Skeletons for cards, lists, and form blocks
- `Validation State`
  - Helper text
  - Error text
  - Success or confirmation where useful

## Form Behavior Rules

- Labels should stay visible and predictable on mobile.
- Helper text should appear close to the field it supports.
- Validation states should be clear without shouting.
- Form controls should have generous tap targets.
- Spacing between grouped fields should be consistent across all forms.
- Multi-option controls should stay compact enough for one-handed use.

## Screen States

The system must support the major UI states that the app will need later:

- Empty
- Loading
- Success
- Error
- Disabled
- Selected / active
- Focused

## Constraints

- Do not introduce a desktop-first layout system.
- Do not switch the design language away from the Stitch mockup direction.
- Do not add unnecessary component variants that do not support near-term app screens.
- Do not introduce a second font family.
- Do not rebuild the system around generic Material defaults if they conflict with the approved direction.

## Success Criteria

The design system is ready when:

- all text in the system uses `Plus Jakarta Sans`
- mobile screens feel consistent and reusable across the app
- base components cover navigation, action, surface, form, and feedback needs
- form-heavy flows can be built without inventing new visual rules each time
- the Stitch direction is preserved, but the component set is complete enough for implementation

## Recommended Implementation Order

1. Update typography and tokens in Stitch
2. Define navigation and action primitives
3. Define form primitives, including `date picker`, `segmented control`, and `stepper`
4. Define feedback and surface patterns
5. Mirror the approved system into the codebase theme and shared UI library

## Notes

- This spec intentionally stays mobile-first.
- Desktop-specific versions are out of scope for this design system iteration.
