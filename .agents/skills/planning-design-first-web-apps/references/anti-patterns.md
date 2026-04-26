# Anti-Patterns

Avoid these failure modes.

## 1. Brief Turns Into Engineering Spec

Symptoms:

- component hierarchy appears before design
- technical architecture starts dominating the brief
- the document becomes too long to iterate on cheaply

Correction:

- trim back to goals, users, flows, scope, constraints, and success criteria

## 2. Plan Tries To Replace Design

Symptoms:

- planning starts describing layouts, sections, and component behavior before the UI is approved
- later design work contradicts the plan

Correction:

- stop technical planning
- return to the design handoff or design iteration stage

## 3. Mega-Plan For The Entire App

Symptoms:

- the plan spans every page, component, and service in one pass
- tokens explode
- implementation order becomes abstract and hard to follow

Correction:

- split into vertical slices and plan only the next slice after design is stable

## 4. Inventing UI During Technical Planning

Symptoms:

- new components appear that were never part of the approved design
- engineering convenience starts changing the interface silently

Correction:

- flag the technical issue
- ask for a design decision or document the required deviation explicitly
