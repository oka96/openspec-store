# Proposal

## Why

Tasks need a clear time commitment so users can see what needs attention today. A date-only field avoids ambiguity about time-of-day scheduling.

## What Changes

- Add an optional date-only due date to each task.
- Mark incomplete tasks overdue when the local calendar date is later than their due date.
- Allow dates to be cleared and reject invalid calendar dates.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `task-workspace`: Give each task an optional due date and make overdue work visible.

## Impact

Illustrative task list, editor, in-memory API, and acceptance coverage. This store
contains sample specification artifacts only; seeded checkboxes are not product
implementation or test evidence. No new services or authentication.
