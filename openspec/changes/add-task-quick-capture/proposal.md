# Proposal

## Why

Capturing small tasks should not interrupt the user’s workflow. A keyboard-first form makes adding the next task quick and predictable.

## What Changes

- Create tasks from a title field with Enter or an Add button.
- Trim titles, reject empty titles, and enforce a 200-character limit.
- Clear and refocus the field after success while retaining input on errors.

## Capabilities

### New Capabilities

- `SA-REQ-006-capture-contract`: Keyboard capture contract.
- `FE-REQ-006-capture-form`: Capture form and focus recovery.
- `BE-REQ-006-capture-validation`: Create title validation.
- `QA-REQ-006-capture-regression`: Capture acceptance and keyboard regression.

### Modified Capabilities

None. Role contracts retain the original task-workspace behavior; the original
capability delta remains in `legacy/specs/task-workspace/spec.md` for traceability.

## Impact

Illustrative task list, editor, in-memory API, and acceptance coverage. This store
contains sample specification artifacts only; seeded checkboxes are not product
implementation or test evidence. No new services or authentication.
