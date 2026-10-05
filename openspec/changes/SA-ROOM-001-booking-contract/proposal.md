# Meeting room booking — SA

## Why
Provide a small multi-repository demo for choosing a room, booking a time, preventing overlaps and cancelling a booking.

## What Changes
Design only: span all impacted repositories in scope.json. NEVER modify application code or clone code for implementation. Define the API and user scenarios, then hand off to Backend and Frontend. Apply verifies design and handoff checklists only.

## Capabilities
### New Capabilities
- `meeting-room-booking`: room selection, booking, conflict handling and cancellation.
### Modified Capabilities
None.

## Impact
Application bindings and upstream sources are declared in scope.json. This demo uses Node.js 24, built-in HTTP, plain browser JavaScript and in-memory state. No authentication, database or external service is required.

## Kanban
- Requirement title: Meeting room booking
- Requirement summary: Choose Atlas or Cedar, book a time, prevent overlaps and cancel a booking.
- Spec title: SA booking contract and handoff
- Owner: SA
- State: backlog
