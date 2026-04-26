# Lean Brief

Use this file when the user is still shaping the product or feature and the UI is not approved yet.

## Goal

Produce a compact product brief that a design tool can consume without locking implementation details too early.

## Include

- problem statement
- target users
- user goals
- core flows
- MVP scope
- non-goals
- constraints
- success criteria

## Exclude

- component breakdowns
- props or state
- file structure
- backend contract details unless they are a hard constraint
- test plan
- pixel or section-level responsive instructions

## Prompt Template

```text
Create a lean product brief for this web app or frontend feature.
Focus only on goals, users, core flows, MVP scope, non-goals, constraints, and success criteria.
Do not include implementation details, component breakdowns, file structure, coding plan, or test plan.
Keep it concise and design-ready.
```

## Suggested Output Shape

```markdown
# Lean Product Brief

## Goal

## Users

## Core Flows

## MVP Scope

## Non-Goals

## Constraints

## Success Criteria
```

## Done Checklist

The brief is complete when:

- a designer can list screens and flows from it
- an engineer cannot yet infer a component tree from it
- the brief is short enough to survive iteration without becoming the implementation plan
