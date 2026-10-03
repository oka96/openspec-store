# Proposal

## Why

Users need to distinguish finished tasks from active work and recover when they complete a task by mistake. A reversible completion state supports both needs.

## What Changes

- Add a completed boolean defaulting to false for new tasks.
- Allow completion and reopening from each task row.
- Keep visible completed and total counts consistent after updates.

## Capabilities

### New Capabilities

- `SA-REQ-004-completion-contract`: Completion and reopen contract.
- `FE-REQ-004-completion-controls`: Completion controls and feedback.
- `BE-REQ-004-completion-api`: Idempotent completion API.
- `QA-REQ-004-completion-regression`: Completion lifecycle regression.

### Modified Capabilities

None. Role contracts retain the original task-workspace behavior; the original
capability delta remains in `legacy/specs/task-workspace/spec.md` for traceability.

## Impact

Illustrative task list, editor, in-memory API, and acceptance coverage. This store
contains sample specification artifacts only; seeded checkboxes are not product
implementation or test evidence. No new services or authentication.
