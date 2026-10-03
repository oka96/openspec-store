# Proposal

## Why

Some tasks cannot proceed until related work finishes. Explicit prerequisites make those relationships visible and help avoid planning cycles.

## What Changes

- Allow tasks to reference existing prerequisite tasks.
- Reject self-dependencies, missing prerequisites, and cycles without partial updates.
- Show unresolved prerequisite titles on affected task rows.

## Capabilities

### New Capabilities

- `SA-REQ-005-dependency-contract`: Dependency graph contract.
- `FE-REQ-005-dependency-controls`: Prerequisite selection and warnings.
- `BE-REQ-005-dependency-validation`: Atomic reference and cycle validation.
- `QA-REQ-005-dependency-regression`: Dependency lifecycle and graph regression.

### Modified Capabilities

None. Role contracts retain the original task-workspace behavior; the original
capability delta remains in `legacy/specs/task-workspace/spec.md` for traceability.

## Impact

Illustrative task list, editor, in-memory API, and acceptance coverage. This store
contains sample specification artifacts only; seeded checkboxes are not product
implementation or test evidence. No new services or authentication.
