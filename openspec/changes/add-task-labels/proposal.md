# Proposal

## Why

Users need a light way to group related tasks without maintaining separate projects. Labels and a matching filter make large lists easier to navigate.

## What Changes

- Add up to five labels to a task, each at most 24 characters after trimming.
- Deduplicate labels case-insensitively while preserving the first entered spelling.
- Filter task rows by an exact case-insensitive label match.

## Capabilities

### New Capabilities

- `SA-REQ-003-labels`: Label rules.
- `SA-REQ-003-filters`: Filter rules and empty state.
- `FE-REQ-003-labels`: Label entry and removable chips.
- `FE-REQ-003-filters`: Quick filters and empty results.
- `BE-REQ-003-labels`: Label normalization and validation.
- `BE-REQ-003-filters`: Exact-match label filter API.
- `QA-REQ-003-integration`: Label edit and filter integration.
- `QA-REQ-003-keyboard`: Empty results and keyboard regression.

### Modified Capabilities

None. Role contracts retain the original task-workspace behavior; the original
capability delta remains in `legacy/specs/task-workspace/spec.md` for traceability.

## Impact

Illustrative task list, editor, in-memory API, and acceptance coverage. This store
contains sample specification artifacts only; seeded checkboxes are not product
implementation or test evidence. No new services or authentication.
