# Post-Design Implementation Planning

Use this file only after the design is approved enough to be the UI source of truth.

## Goal

Write a technical plan that follows the approved design without redesigning it.

## Focus On

- app architecture
- routing and page ownership
- data flow
- state ownership
- API or client boundaries
- execution order
- vertical slices

## Avoid

- changing the UI structure without a stated reason
- inventing new components when the design already defines the screen
- restating the whole design in engineering language
- building a mega-plan for the entire app if slices are possible

## Prompt Template

```text
Create an implementation plan for this approved design.
Treat the design as the source of truth for UI.
Focus on architecture, routing, data flow, state boundaries, API integration, and execution order.
Break the work into vertical slices.
Do not redesign the UI or invent new components unless technically necessary.
```

## Preferred Slice Shapes

Good slices:

- authentication
- onboarding
- dashboard shell
- logging flow
- profile and settings

Poor slices:

- all shared components
- all pages
- all state management
- all API calls

Prefer end-to-end slices that produce a usable path through the product.
