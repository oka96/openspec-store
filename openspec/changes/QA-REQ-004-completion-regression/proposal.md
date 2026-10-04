# Proposal

## Why

Users need to distinguish finished tasks from active work and recover when they complete a task by mistake. A reversible completion state supports both needs.

## What Changes

- Add a completed boolean defaulting to false for new tasks.
- Allow completion and reopening from each task row.
- Keep visible completed and total counts consistent after updates.

## Capabilities

### New Capabilities

- `QA-REQ-004-completion-regression`: Completion lifecycle regression.

### Modified Capabilities

None.

## Impact

Illustrative task list, editor, in-memory API, and acceptance coverage. This store
contains sample specification artifacts only; seeded checkboxes are not product
implementation or test evidence. No new services or authentication.

## Kanban

- Requirement title: Complete & reopen tasks
- Requirement summary: Track finished work, reopen it when needed, and keep progress counts accurate.
- Spec title: Completion lifecycle regression
- Owner: Quinn · sample
- Role note: Final keyboard and rapid-toggle regression review remains.
- State: in_progress
- Note: Final keyboard and rapid-toggle regression review remains.
