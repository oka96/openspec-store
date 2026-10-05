# Meeting room booking — QA

## Why
Provide a small multi-repository demo for choosing a room, booking a time, preventing overlaps and cancelling a booking.

## What Changes
Bind exactly one QA regression repository in scope.json. Read referenced SA, Frontend and Backend specs before deriving regression scenarios. Write regression code only in the bound QA repository; report product failures to the implementation roles.

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
- Spec title: QA booking regression
- Owner: QA
- State: backlog
