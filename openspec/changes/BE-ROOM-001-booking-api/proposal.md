# Meeting room booking — Backend

## Why
Provide a small multi-repository demo for choosing a room, booking a time, preventing overlaps and cancelling a booking.

## What Changes
Bind exactly one Backend repository in scope.json. Read every referenced SA proposal, design and capability spec before writing this spec. Implement only the bound repository and preserve the SA contract.

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
- Spec title: Backend booking implementation
- Owner: Backend
- State: backlog
