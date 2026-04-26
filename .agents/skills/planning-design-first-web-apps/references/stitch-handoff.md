# Stitch-First Design Handoff

Use this file after the lean brief is ready and the next step is UI exploration.

## Default

Prefer Stitch as the primary design path. If the user is already committed to Pencil, keep the same structure but swap the tool name and any tool-specific phrasing.

## Handoff Should Contain

- one-paragraph product summary
- target users
- screen inventory
- primary journey between screens
- key states: empty, loading, error, success
- reusable patterns to preserve across screens
- visual direction or design constraints

## Stitch Prompt Template

```text
Use this lean product brief to create the UI direction for a web app.
Focus on screen inventory, screen flow, layout, interaction patterns, and key states.
Treat this as design exploration, not implementation planning.
Do not invent code structure or technical architecture.
Return screens, flow, states, reusable patterns, and visual rules.
```

## Pencil Fallback Prompt

```text
Use this lean product brief to design the UI flow for a web app.
Focus on screens, navigation between them, major states, layout direction, and reusable interface patterns.
Do not turn this into a coding plan.
```

## Review Checklist

Design is ready for technical planning when it provides:

- a stable screen list
- clear navigation or flow between screens
- the major states each screen must support
- enough visual direction that implementation should follow it rather than reinterpret it

If any of these are missing, continue design iteration instead of writing an implementation plan.
